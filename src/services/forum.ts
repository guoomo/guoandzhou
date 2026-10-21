import type { ForumListResult, ForumPost, ForumPublishParams } from '@/types/forum'
import { http } from '@/utils/http'

// 帖子列表（分页）
export function getForumListAPI(data: { page: number, pageSize: number }) {
  return http<ForumListResult>({
    url: '/api/forum/list',
    method: 'GET',
    data,
  })
}

// 帖子详情
export function getForumDetailAPI(id: number) {
  return http<ForumPost>({
    url: `/api/forum/${id}`,
    method: 'GET',
  })
}

// 发帖
export function publishForumAPI(data: ForumPublishParams) {
  return http<null>({
    url: '/api/forum/publish',
    method: 'POST',
    data,
  })
}
