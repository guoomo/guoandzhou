<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed } from 'vue'
import { userInfoAPI } from '@/services/member'
import { useMemberStore } from '@/stores'

interface MenuItem {
  text: string
  /** 未实现的菜单不写 url，点击给出提示 */
  url?: string
}

const memberStore = useMemberStore()
const userInfo = computed(() => memberStore.profile?.userInfo)
const isClub = computed(() => userInfo.value?.role === 'club')
const isLogin = computed(() => !!memberStore.profile)

const studentMenus: MenuItem[] = [
  { text: '我的投递', url: '/pagesRecruit/mine/mine?tab=apply' },
  { text: '我的简历', url: '/pagesResume/edit/edit' },
  { text: '我的收藏' },
  { text: '我的闲置' },
]
const clubMenus: MenuItem[] = [
  { text: '我的发布招新', url: '/pagesRecruit/mine/mine?tab=publish' },
  { text: '我的帖子' },
  { text: '我的闲置' },
]
const menus = computed(() => (isClub.value ? clubMenus : studentMenus))

onShow(async () => {
  if (!isLogin.value)
    return
  try {
    const res = await userInfoAPI()
    memberStore.updateUserInfo(res.result)
  }
  catch {
    // 拉取失败不影响页面展示（本地已有持久化的用户信息）
  }
})

function goMenu(item: MenuItem) {
  if (!item.url) {
    uni.showToast({ title: '该功能开发中', icon: 'none' })
    return
  }
  uni.navigateTo({ url: item.url })
}

function goLogin() {
  uni.navigateTo({ url: '/pages/login/login' })
}

function onLogout() {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: (res) => {
      if (!res.confirm)
        return
      memberStore.clearProfile()
      uni.reLaunch({ url: '/pages/login/login' })
    },
  })
}
</script>

<template>
  <view class="profile">
    <view class="user">
      <image class="user__avatar" :src="userInfo?.avatar || '/static/logo.svg'" mode="aspectFill" />
      <view class="user__info">
        <text class="user__nickname">{{ userInfo?.nickname || '未登录' }}</text>
        <text v-if="isLogin" class="user__role">{{ isClub ? '社团' : '学生' }}</text>
      </view>
      <view v-if="!isLogin" class="user__login" @click="goLogin">
        去登录
      </view>
    </view>

    <view class="menu">
      <view v-for="item in menus" :key="item.text" class="menu__item" @click="goMenu(item)">
        <text class="menu__text">{{ item.text }}</text>
        <text class="menu__arrow">›</text>
      </view>
    </view>

    <view v-if="isLogin" class="logout" @click="onLogout">
      退出登录
    </view>

    <!-- 后端未搭建：用户信息来自 src/mock -->
    <text class="profile__tip">当前为 mock 模式：用户信息、菜单数据均为本地假数据</text>
  </view>
</template>

<style lang="scss" scoped>
.profile { min-height: 100vh; background: #f6f8fc; }
.user { display: flex; align-items: center; padding: 60rpx 32rpx 40rpx; background: linear-gradient(135deg, #2f6bff, #6aa1ff); }
.user__avatar { width: 120rpx; height: 120rpx; border-radius: 50%; border: 4rpx solid rgba(255, 255, 255, .6); }
.user__info { flex: 1; margin-left: 28rpx; }
.user__nickname { font-size: 36rpx; font-weight: 700; color: #fff; }
.user__role { display: inline-block; margin-top: 10rpx; padding: 4rpx 16rpx; border-radius: 20rpx; background: rgba(255, 255, 255, .25); color: #fff; font-size: 22rpx; }
.user__login { padding: 10rpx 28rpx; border-radius: 28rpx; background: rgba(255, 255, 255, .9); color: #2f6bff; font-size: 26rpx; }
.menu { margin: 24rpx; border-radius: 20rpx; overflow: hidden; background: #fff; }
.menu__item { display: flex; align-items: center; justify-content: space-between; padding: 30rpx 28rpx; border-bottom: 1rpx solid #f0f2f5; }
.menu__item:last-child { border-bottom: none; }
.menu__text { font-size: 30rpx; color: #3a3f47; }
.menu__arrow { font-size: 34rpx; color: #c8c9cc; }
.logout { margin: 48rpx 24rpx 0; height: 88rpx; line-height: 88rpx; border-radius: 44rpx; background: #fff; color: #f56c6c; font-size: 30rpx; text-align: center; }
.profile__tip { display: block; margin: 32rpx 24rpx; font-size: 22rpx; color: #b0b3bb; text-align: center; }
</style>
