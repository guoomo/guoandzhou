// 用户信息
export interface UserInfo {
  userId: number
  nickname: string
  avatar: string
  role: 'student' | 'club'
}

// 登录返回结果
export interface LoginResult {
  token: string
  userInfo: UserInfo
}
