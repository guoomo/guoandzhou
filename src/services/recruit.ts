import type {
  ApplyItem,
  MyRecruitItem,
  RecruitDetail,
  RecruitListResult,
  RecruitPublishParams,
} from '@/types/recruit'
import { http } from '@/utils/http'

// 招新/岗位列表（分页 + 类型筛选）
export function getRecruitListAPI(data: { page: number, pageSize: number, type: 0 | 1 }) {
  return http<RecruitListResult>({
    url: '/api/recruit/list',
    method: 'GET',
    data,
  })
}

// 招新/岗位详情
export function getRecruitDetailAPI(id: number) {
  return http<RecruitDetail>({
    url: `/api/recruit/${id}`,
    method: 'GET',
  })
}

// 发布招新/岗位（社团）
export function publishRecruitAPI(data: RecruitPublishParams) {
  return http<null>({
    url: '/api/recruit/publish',
    method: 'POST',
    data,
  })
}

// 我的发布（社团）
export function getMyRecruitListAPI() {
  return http<MyRecruitItem[]>({
    url: '/api/recruit/mine',
    method: 'GET',
  })
}

// 投递简历（学生）
export function applyRecruitAPI(id: number) {
  return http<null>({
    url: `/api/recruit/${id}/apply`,
    method: 'POST',
  })
}

// 我的投递（学生）
export function getMyApplyListAPI() {
  return http<ApplyItem[]>({
    url: '/api/apply/mine',
    method: 'GET',
  })
}
