import type { LoginResult, UserInfo } from '@/types/member'
import { http } from '@/utils/http'

// 账号密码登录
export function userLoginAPI(data: { username: string, password: string }) {
  return http<LoginResult>({
    url: '/api/user/login',
    method: 'POST',
    data,
  })
}

// 获取用户信息
export function userInfoAPI() {
  return http<UserInfo>({
    url: '/api/user/info',
    method: 'GET',
  })
}
