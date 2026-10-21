import { useMemberStore } from '@/stores'

/**
 * 页面级登录 / 角色守卫
 * @param role 需要的角色，不传则只校验是否登录
 * @returns 是否通过校验
 */
export function useAuthGuard(role?: 'student' | 'club') {
  const memberStore = useMemberStore()
  const profile = memberStore.profile

  if (!profile) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/login/login' })
    }, 800)
    return false
  }

  if (role && profile.userInfo.role !== role) {
    uni.showToast({ title: '无权限访问该页面', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
    }, 800)
    return false
  }

  return true
}
