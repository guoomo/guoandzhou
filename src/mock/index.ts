import type { ForumItem, ForumListResult, ForumPost, ForumPublishParams } from '@/types/forum'
import type { LoginResult, UserInfo } from '@/types/member'
import type {
  ApplyItem,
  MyRecruitItem,
  RecruitDetail,
  RecruitItem,
  RecruitListResult,
  RecruitPublishParams,
} from '@/types/recruit'
import type { Resume } from '@/types/resume'
import {
  mockApplyList,
  mockForumContents,
  mockForumItems,
  mockRecruitContents,
  mockRecruitItems,
  mockResume,
} from './data'

/**
 * 前端 mock 层
 * - 默认开启（.env 里 VITE_APP_USE_MOCK !== 'false'）
 * - 挂在 http 层最前面，页面 / services 代码与真实接口完全一致
 * - 后端就绪后：VITE_APP_USE_MOCK=false 即可切回真实请求，本目录可整体删除
 */
export const mockEnabled = import.meta.env.VITE_APP_USE_MOCK !== 'false'

interface MockResponse<T> {
  code: number
  message: string
  result: T
}

type Body = Record<string, unknown>

const MOCK_DELAY = 240
const USER_KEY = 'mock-login-user'

// 运行期可变数据（发布后会追加，刷新页面恢复种子数据）
const recruits: RecruitItem[] = [...mockRecruitItems]
const forums: ForumItem[] = [...mockForumItems]
const applies: ApplyItem[] = [...mockApplyList]
const resume: Resume = { ...mockResume }

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

function today() {
  const d = new Date()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function num(value: unknown, fallback: number) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function str(value: unknown) {
  return typeof value === 'string' ? value : ''
}

/* ---------------------------------- 用户 ---------------------------------- */

function login(username: string): LoginResult {
  // 约定：账号里带 club / 社团 → 社团角色，其余为学生角色
  const isClub = /club|社团/i.test(username)
  const userInfo: UserInfo = isClub
    ? { userId: 2, nickname: '摄影协会', avatar: '/static/logo.svg', role: 'club' }
    : { userId: 1, nickname: '张同学', avatar: '/static/logo.svg', role: 'student' }
  uni.setStorageSync(USER_KEY, userInfo)
  return { token: `mock-token-${Date.now()}`, userInfo }
}

function currentUser(): UserInfo {
  const cached = uni.getStorageSync(USER_KEY) as UserInfo | undefined
  return cached || { userId: 1, nickname: '张同学', avatar: '/static/logo.svg', role: 'student' }
}

function logout() {
  uni.removeStorageSync(USER_KEY)
  return null
}

/* --------------------------------- 招新/岗位 -------------------------------- */

function recruitList(page: number, pageSize: number, type: number): RecruitListResult {
  const filtered = recruits.filter(item => item.type === type)
  const start = (page - 1) * pageSize
  return { total: filtered.length, list: filtered.slice(start, start + pageSize) }
}

function recruitDetail(id: number): RecruitDetail {
  const item = recruits.find(r => r.id === id)
  if (!item)
    throw new Error('招新/岗位不存在')
  const extra = mockRecruitContents[id] || { content: item.summary, imgUrl: '' }
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    publisher: item.publisher,
    createTime: item.createTime,
    content: extra.content,
    imgUrl: extra.imgUrl,
  }
}

function myRecruitList(): MyRecruitItem[] {
  const me = currentUser()
  return recruits
    .filter(item => item.publisher === me.nickname)
    .map(item => ({ ...item, status: 'published' as const }))
}

function publishRecruit(params: RecruitPublishParams) {
  const me = currentUser()
  const id = Math.max(0, ...recruits.map(r => r.id)) + 1
  const item: RecruitItem = {
    id,
    title: params.title,
    type: params.type,
    publisher: me.nickname,
    createTime: today(),
    summary: params.content.slice(0, 40),
  }
  recruits.unshift(item)
  mockRecruitContents[id] = { content: params.content, imgUrl: params.img }
  return null
}

function applyRecruit(recruitId: number) {
  const item = recruits.find(r => r.id === recruitId)
  if (!item)
    throw new Error('招新/岗位不存在')
  if (applies.some(a => a.recruitId === recruitId))
    throw new Error('你已投递过该岗位')
  applies.unshift({
    id: Math.max(0, ...applies.map(a => a.id)) + 1,
    recruitId,
    title: item.title,
    publisher: item.publisher,
    createTime: today(),
    status: 'pending',
  })
  return null
}

function myApplyList(): ApplyItem[] {
  return applies
}

/* ---------------------------------- 论坛 ---------------------------------- */

function forumList(page: number, pageSize: number): ForumListResult {
  const start = (page - 1) * pageSize
  return { total: forums.length, list: forums.slice(start, start + pageSize) }
}

function forumDetail(id: number): ForumPost {
  const item = forums.find(f => f.id === id)
  if (!item)
    throw new Error('帖子不存在')
  const extra = mockForumContents[id] || { content: item.preview, imgUrl: '', likeCount: 0 }
  return {
    id: item.id,
    title: item.title,
    author: item.author,
    createTime: item.createTime,
    content: extra.content,
    imgUrl: extra.imgUrl,
    likeCount: extra.likeCount,
  }
}

function publishForum(params: ForumPublishParams) {
  const me = currentUser()
  const id = Math.max(0, ...forums.map(f => f.id)) + 1
  forums.unshift({
    id,
    title: params.title,
    author: me.nickname,
    createTime: today(),
    preview: params.content.slice(0, 40),
  })
  mockForumContents[id] = {
    content: params.content,
    imgUrl: params.imgs?.[0] || '',
    likeCount: 0,
  }
  return null
}

/* ---------------------------------- 简历 ---------------------------------- */

function getResume(): Resume {
  return { ...resume }
}

function saveResume(data: Omit<Resume, 'id'>) {
  Object.assign(resume, data)
  return null
}

/* --------------------------------- 路由表 --------------------------------- */

interface Handler {
  method: string
  test: RegExp
  handle: (match: RegExpMatchArray, body: Body) => unknown
}

const handlers: Handler[] = [
  { method: 'POST', test: /^\/api\/user\/login$/, handle: (_m, b) => login(str(b.username)) },
  { method: 'GET', test: /^\/api\/user\/info$/, handle: () => currentUser() },
  { method: 'POST', test: /^\/api\/user\/logout$/, handle: () => logout() },

  {
    method: 'GET',
    test: /^\/api\/recruit\/list$/,
    handle: (_m, b) => recruitList(num(b.page, 1), num(b.pageSize, 10), num(b.type, 0)),
  },
  { method: 'GET', test: /^\/api\/recruit\/mine$/, handle: () => myRecruitList() },
  {
    method: 'POST',
    test: /^\/api\/recruit\/publish$/,
    handle: (_m, b) => publishRecruit(b as unknown as RecruitPublishParams),
  },
  {
    method: 'POST',
    test: /^\/api\/recruit\/(\d+)\/apply$/,
    handle: m => applyRecruit(Number(m[1])),
  },
  { method: 'GET', test: /^\/api\/apply\/mine$/, handle: () => myApplyList() },
  { method: 'GET', test: /^\/api\/recruit\/(\d+)$/, handle: m => recruitDetail(Number(m[1])) },

  {
    method: 'GET',
    test: /^\/api\/forum\/list$/,
    handle: (_m, b) => forumList(num(b.page, 1), num(b.pageSize, 10)),
  },
  {
    method: 'POST',
    test: /^\/api\/forum\/publish$/,
    handle: (_m, b) => publishForum(b as unknown as ForumPublishParams),
  },
  { method: 'GET', test: /^\/api\/forum\/(\d+)$/, handle: m => forumDetail(Number(m[1])) },

  { method: 'GET', test: /^\/api\/resume$/, handle: () => getResume() },
  {
    method: 'POST',
    test: /^\/api\/resume$/,
    handle: (_m, b) => saveResume(b as unknown as Omit<Resume, 'id'>),
  },
]

function normalizePath(url: string) {
  return url.replace(/^https?:\/\/[^/]+/, '').split('?')[0]
}

/** 构造一个带 statusCode / data 的错误对象，页面侧可读取 error.data.message */
function mockError(statusCode: number, message: string) {
  const error = new Error(message) as Error & {
    statusCode: number
    data: { code: number, message: string, result: null }
  }
  error.statusCode = statusCode
  error.data = { code: statusCode, message, result: null }
  return error
}

/**
 * mock 请求入口：签名与 http<T> 一致，直接返回 { code, message, result }
 */
export async function mockRequest<T>(options: UniApp.RequestOptions): Promise<MockResponse<T>> {
  await sleep(MOCK_DELAY)

  const path = normalizePath(options.url)
  const method = (options.method || 'GET').toUpperCase()
  const body = (options.data && typeof options.data === 'object' ? options.data : {}) as Body

  const route = handlers.find(h => h.method === method && h.test.test(path))
  if (!route) {
    return Promise.reject(mockError(404, `mock 未实现：${method} ${path}`))
  }

  try {
    const result = route.handle(path.match(route.test)!, body)
    return { code: 0, message: 'ok', result: result as T }
  }
  catch (error) {
    return Promise.reject(mockError(500, (error as Error).message))
  }
}
