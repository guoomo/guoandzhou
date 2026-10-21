<script setup lang="ts">
import type { ForumItem } from '@/types/forum'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getForumListAPI } from '@/services/forum'

const list = ref<ForumItem[]>([])
const page = ref(1)
const pageSize = 10
const total = ref(0)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

async function onRefresh() {
  refreshing.value = true
  page.value = 1
  finished.value = false
  await loadList(true)
  refreshing.value = false
}

function onReachBottom() {
  if (!loading.value && !finished.value)
    loadList(false)
}

async function loadList(isRefresh: boolean) {
  if (loading.value)
    return
  loading.value = true
  try {
    const res = await getForumListAPI({ page: page.value, pageSize })
    total.value = res.result.total
    const rows = res.result.list
    list.value = isRefresh ? rows : [...list.value, ...rows]
    finished.value = list.value.length >= total.value
    if (!finished.value)
      page.value += 1
  }
  catch (error) {
    finished.value = true
    uni.showToast({
      icon: 'none',
      title: (error as { data?: { message?: string } })?.data?.message || '加载失败，请稍后重试',
    })
  }
  finally {
    loading.value = false
  }
}

function goDetail(id: number) {
  uni.navigateTo({ url: `/pagesForum/detail/detail?id=${id}` })
}
function goPost() {
  uni.navigateTo({ url: '/pagesForum/post/post' })
}

onLoad(() => loadList(true))
</script>

<template>
  <view class="forum">
    <view class="forum__head">
      <text class="forum__title">社区论坛</text>
      <view class="forum__post" @click="goPost">
        发帖
      </view>
    </view>

    <scroll-view
      class="scroll"
      scroll-y
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onReachBottom"
    >
      <view v-if="list.length === 0 && !loading" class="empty">
        暂无帖子
      </view>
      <view v-for="item in list" :key="item.id" class="card" @click="goDetail(item.id)">
        <text class="card__title">{{ item.title }}</text>
        <text class="card__preview">{{ item.preview }}</text>
        <view class="card__meta">
          <text>{{ item.author }}</text>
          <text>{{ item.createTime }}</text>
        </view>
      </view>
      <view v-if="loading" class="tip">
        加载中...
      </view>
      <view v-if="finished && list.length" class="tip">
        — 没有更多了 —
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.forum { height: 100vh; display: flex; flex-direction: column; background: #f6f8fc; }
.forum__head { display: flex; align-items: center; justify-content: space-between; padding: 24rpx; }
.forum__title { font-size: 36rpx; font-weight: 700; color: #1f2d3d; }
.forum__post { padding: 10rpx 28rpx; border-radius: 28rpx; background: #2f6bff; color: #fff; font-size: 26rpx; }
.scroll { flex: 1; }
.card { margin: 0 24rpx 24rpx; padding: 28rpx; border-radius: 20rpx; background: #fff; }
.card__title { font-size: 32rpx; font-weight: 600; color: #1f2d3d; }
.card__preview { display: -webkit-box; margin-top: 14rpx; font-size: 26rpx; color: #606266; line-height: 1.6; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card__meta { display: flex; justify-content: space-between; margin-top: 18rpx; font-size: 24rpx; color: #909399; }
.empty, .tip { padding: 80rpx 0; text-align: center; font-size: 26rpx; color: #b0b3bb; }
</style>
