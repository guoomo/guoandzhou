import type { LoginResult, UserInfo } from '@/types/member'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store（用户信息 + 角色）
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息（含 token 与 userInfo）
    const profile = ref<LoginResult>()

    // 保存会员信息，登录时使用
    const setProfile = (val: LoginResult) => {
      profile.value = val
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }

    // 刷新用户信息（个人中心调用）
    const updateUserInfo = (info: UserInfo) => {
      if (profile.value) {
        profile.value.userInfo = { ...profile.value.userInfo, ...info }
      }
    }

    return { profile, setProfile, clearProfile, updateUserInfo }
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
