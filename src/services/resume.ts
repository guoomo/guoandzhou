import type { Resume } from '@/types/resume'
import { http } from '@/utils/http'

// 获取简历
export function getResumeAPI() {
  return http<Resume>({
    url: '/api/resume',
    method: 'GET',
  })
}

// 保存简历
export function saveResumeAPI(data: Omit<Resume, 'id'>) {
  return http<null>({
    url: '/api/resume',
    method: 'POST',
    data,
  })
}
