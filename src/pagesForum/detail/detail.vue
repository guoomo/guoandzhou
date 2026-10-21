<script setup lang="ts">
import type { ForumPost } from '@/types/forum'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getForumDetailAPI } from '@/services/forum'

const id = ref(0)
const post = ref<ForumPost | null>(null)
const loading = ref(false)
const refreshing = ref(false)
const liked = ref(false)

onLoad((options) => {
  id.value = Number(options?.id) || 0
  loadPost()
})

async function loadPost() {
  loading.value = true
  try {
    const res = await getForumDetailAPI(id.value)
    post.value = res.result
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
  await loadPost()
  refreshing.value = false
}

// 后端未搭建：点赞仅本地状态，未落库
function toggleLike() {
  liked.value = !liked.value
  if (post.value)
    post.value.likeCount += liked.value ? 1 : -1
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
      <view v-if="!post" class="tip">
        {{ loading ? '加载中...' : '帖子不存在' }}
      </view>
      <template v-else>
        <text class="title">{{ post.title }}</text>
        <view class="meta">
          <text class="meta__author">{{ post.author }}</text>
          <text class="meta__time">{{ post.createTime }}</text>
        </view>
        <image v-if="post.imgUrl" class="cover" :src="post.imgUrl" mode="widthFix" />
        <text class="content">{{ post.content }}</text>
      </template>
    </scroll-view>

    <view v-if="post" class="footer">
      <button class="like-btn" :class="{ 'like-btn--active': liked }" @click="toggleLike">
        👍 {{ post.likeCount }}
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.detail { height: 100vh; display: flex; flex-direction: column; background: #f6f8fc; }
.scroll { flex: 1; }
.title { display: block; padding: 24rpx 24rpx 0; font-size: 38rpx; font-weight: 700; color: #1f2d3d; line-height: 1.5; }
.meta { display: flex; align-items: center; padding: 20rpx 24rpx; }
.meta__author { font-size: 26rpx; color: #2f6bff; }
.meta__time { margin-left: 24rpx; font-size: 24rpx; color: #909399; }
.cover { width: 100%; margin-top: 8rpx; }
.content { display: block; padding: 24rpx; font-size: 28rpx; color: #3a3f47; line-height: 1.8; white-space: pre-wrap; }
.tip { padding: 120rpx 0; text-align: center; font-size: 26rpx; color: #b0b3bb; }
.footer { padding: 20rpx 24rpx; background: #fff; }
.like-btn { height: 88rpx; line-height: 88rpx; border-radius: 44rpx; background: #f2f3f5; color: #606266; font-size: 28rpx; text-align: center; }
.like-btn::after { border: none; }
.like-btn--active { background: #e8f0ff; color: #2f6bff; }
</style>
