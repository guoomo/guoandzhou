<script setup lang="ts">
import { reactive, ref } from 'vue'
import { userLoginAPI } from '@/services/member'
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()
const form = reactive({ username: '', password: '' })
const logging = ref(false)

function validate(): string {
  if (!form.username.trim())
    return '请输入账号'
  if (!form.password.trim())
    return '请输入密码'
  return ''
}

async function onLogin() {
  const err = validate()
  if (err) {
    uni.showToast({ title: err, icon: 'none' })
    return
  }

  logging.value = true
  try {
    const res = await userLoginAPI({ ...form })
    memberStore.setProfile(res.result)
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => uni.reLaunch({ url: '/pages/index/index' }), 600)
  }
  catch (error) {
    uni.showToast({
      title: (error as { data?: { message?: string } })?.data?.message || '登录失败',
      icon: 'none',
    })
  }
  finally {
    logging.value = false
  }
}
</script>

<template>
  <view class="login">
    <text class="login__title">校园招聘</text>
    <text class="login__subtitle">毕业生岗位 · 社团招新 · 校园社区</text>

    <view class="login__form">
      <view class="item">
        <text class="item__label">账号</text>
        <input v-model="form.username" class="item__input" placeholder="请输入账号" placeholder-class="item__placeholder">
      </view>
      <view class="item">
        <text class="item__label">密码</text>
        <input v-model="form.password" class="item__input" password placeholder="请输入密码" placeholder-class="item__placeholder">
      </view>

      <button class="login__btn" :loading="logging" :disabled="logging" @click="onLogin">
        登录
      </button>

      <!-- 后端未搭建：登录走 src/mock，任意账号密码均可通过 -->
      <text class="login__tip">当前为 mock 模式：任意账号密码均可登录，账号含 “club / 社团” 即社团角色</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login { min-height: 100vh; padding: 120rpx 48rpx 0; box-sizing: border-box; background: linear-gradient(180deg, #eaf2ff 0%, #f6f8fc 400rpx); }
.login__title { display: block; font-size: 52rpx; font-weight: 700; color: #1f2d3d; }
.login__subtitle { display: block; margin-top: 16rpx; font-size: 26rpx; color: #909399; }
.login__form { margin-top: 80rpx; }
.item { padding: 24rpx 0; border-bottom: 1rpx solid #e6e8eb; }
.item__label { display: block; margin-bottom: 10rpx; font-size: 24rpx; color: #909399; }
.item__input { height: 60rpx; font-size: 30rpx; color: #1f2d3d; }
.item__placeholder { color: #c0c4cc; }
.login__btn { margin-top: 64rpx; height: 88rpx; line-height: 88rpx; border-radius: 44rpx; background: #2f6bff; color: #fff; font-size: 30rpx; }
.login__btn::after { border: none; }
.login__tip { display: block; margin-top: 32rpx; font-size: 22rpx; line-height: 1.6; color: #b0b3bb; }
</style>
