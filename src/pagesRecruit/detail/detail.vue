<script setup lang="ts">
import type { RecruitDetail } from '@/types/recruit'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { applyRecruitAPI, getRecruitDetailAPI } from '@/services/recruit'
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()

const id = ref(0)
const detail = ref<RecruitDetail | null>(null)
const loading = ref(false)
const refreshing = ref(false)
const applying = ref(false)

onLoad((options) => {
  id.value = Number(options?.id) || 0
  loadDetail()
})

async function loadDetail() {
  loading.value = true
  try {
    const res = await getRecruitDetailAPI(id.value)
    detail.value = res.result
  }
  catch (error) {
    uni.showToast({
      icon: 'none',
      title: (error as { data?: { message?: string } })?.data?.message || '加载失败，请稍后重试',
    })
  }
  finally {
    loading.value = false
  }
}

async function onRefresh() {
  refreshing.value = true
  await loadDetail()
  refreshing.value = false
}

// 学生角色才展示投递入口
async function apply() {
  if (!memberStore.profile) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => uni.navigateTo({ url: '/pages/login/login' }), 800)
    return
  }

  applying.value = true
  try {
    await applyRecruitAPI(id.value)
    uni.showToast({ title: '投递成功', icon: 'success' })
  }
  catch (error) {
    uni.showToast({
      title: (error as { data?: { message?: string } })?.data?.message || '投递失败',
      icon: 'none',
    })
  }
  finally {
    applying.value = false
  }
}
</script>

<template>
  <view class="detail">
    <scroll-view
      class="scroll"
      scroll-y
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <view v-if="!detail" class="tip">
        {{ loading ? '加载中...' : '内容不存在' }}
      </view>
      <template v-else>
        <view class="head">
          <text class="title">{{ detail.title }}</text>
          <text class="tag" :class="detail.type === 1 ? 'tag--club' : 'tag--job'">
            {{ detail.type === 1 ? '社团招新' : '毕业生岗位' }}
          </text>
        </view>
        <view class="meta">
          <text>{{ detail.publisher }}</text>
          <text>{{ detail.createTime }}</text>
        </view>
        <image v-if="detail.imgUrl" class="cover" :src="detail.imgUrl" mode="widthFix" />
        <text class="content">{{ detail.content }}</text>
      </template>
    </scroll-view>

    <view v-if="detail" class="footer">
      <button
        v-if="detail.type === 0"
        class="apply-btn"
        :loading="applying"
        :disabled="applying"
        @click="apply"
      >
        投递简历
      </button>
      <button v-else class="apply-btn" @click="apply">
        联系社团
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.detail { height: 100vh; display: flex; flex-direction: column; background: #f6f8fc; }
.scroll { flex: 1; }
.head { display: flex; align-items: flex-start; justify-content: space-between; padding: 24rpx; }
.title { flex: 1; font-size: 36rpx; font-weight: 700; color: #1f2d3d; line-height: 1.5; }
.tag { flex-shrink: 0; margin-left: 16rpx; padding: 4rpx 16rpx; border-radius: 20rpx; font-size: 22rpx; }
.tag--job { background: #e8f0ff; color: #2f6bff; }
.tag--club { background: #e8fff2; color: #12b76a; }
.meta { display: flex; justify-content: space-between; padding: 0 24rpx; font-size: 24rpx; color: #909399; }
.cover { width: 100%; margin-top: 24rpx; border-radius: 16rpx; }
.content { display: block; padding: 24rpx; font-size: 28rpx; color: #3a3f47; line-height: 1.8; white-space: pre-wrap; }
.tip { padding: 120rpx 0; text-align: center; font-size: 26rpx; color: #b0b3bb; }
.footer { padding: 20rpx 24rpx; background: #fff; }
.apply-btn { height: 88rpx; line-height: 88rpx; border-radius: 44rpx; background: #2f6bff; color: #fff; font-size: 30rpx; text-align: center; }
.apply-btn::after { border: none; }
</style>
