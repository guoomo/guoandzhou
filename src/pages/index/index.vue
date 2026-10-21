<script setup lang="ts">
import type { RecruitItem } from '@/types/recruit'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { getRecruitListAPI } from '@/services/recruit'
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()
const isClub = computed(() => memberStore.profile?.userInfo.role === 'club')

const tabs = [
  { type: 0, label: '毕业生岗位' },
  { type: 1, label: '社团招新' },
] as const

const activeTab = ref<0 | 1>(0)
const list = ref<RecruitItem[]>([])
const page = ref(1)
const pageSize = 10
const total = ref(0)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 自定义导航栏：状态栏高度
const { statusBarHeight } = uni.getWindowInfo()

// 切换 Tab
function switchTab(type: 0 | 1) {
  if (activeTab.value === type)
    return
  activeTab.value = type
  list.value = []
  page.value = 1
  total.value = 0
  finished.value = false
  loadList(true)
}

// 下拉刷新
async function onRefresh() {
  refreshing.value = true
  page.value = 1
  finished.value = false
  await loadList(true)
  refreshing.value = false
}

// 触底分页
function onReachBottom() {
  if (!loading.value && !finished.value)
    loadList(false)
}

async function loadList(isRefresh: boolean) {
  if (loading.value)
    return
  loading.value = true
  try {
    const res = await getRecruitListAPI({ page: page.value, pageSize, type: activeTab.value })
    total.value = res.result.total
    const rows = res.result.list
    list.value = isRefresh ? rows : [...list.value, ...rows]
    finished.value = list.value.length >= total.value
    if (!finished.value)
      page.value += 1
  }
  catch (error) {
    // 请求失败（例如后端未启动）：停止继续分页，避免无限重试
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

// 跳转详情
function goDetail(id: number) {
  uni.navigateTo({ url: `/pagesRecruit/detail/detail?id=${id}` })
}

// 跳转发布（仅社团）
function goPublish() {
  uni.navigateTo({ url: '/pagesRecruit/publish/publish' })
}

onLoad(() => loadList(true))
</script>

<template>
  <view class="home">
    <!-- 自定义导航：Tab + 社团专属发布入口 -->
    <view class="header" :style="{ paddingTop: `${statusBarHeight}px` }">
      <view class="tab-bar">
        <view
          v-for="tab in tabs"
          :key="tab.type"
          class="tab"
          :class="{ 'tab--active': activeTab === tab.type }"
          @click="switchTab(tab.type)"
        >
          {{ tab.label }}
        </view>
      </view>
      <view v-if="isClub" class="publish-btn" @click="goPublish">
        + 发布
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
        暂无数据
      </view>

      <view v-for="item in list" :key="item.id" class="card" @click="goDetail(item.id)">
        <view class="card__head">
          <text class="card__title">{{ item.title }}</text>
          <text class="card__tag" :class="item.type === 1 ? 'card__tag--club' : 'card__tag--job'">
            {{ item.type === 1 ? '社团招新' : '毕业生岗位' }}
          </text>
        </view>
        <view class="card__meta">
          <text>{{ item.publisher }}</text>
          <text>{{ item.createTime }}</text>
        </view>
        <text class="card__summary">{{ item.summary }}</text>
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
.home { height: 100vh; display: flex; flex-direction: column; background: #f6f8fc; }
.header { display: flex; align-items: center; height: 88rpx; box-sizing: content-box; padding: 0 24rpx; background: #fff; }
.tab-bar { display: flex; flex: 1; }
.tab { position: relative; margin-right: 48rpx; padding-bottom: 10rpx; font-size: 30rpx; color: #888; }
.tab--active { color: #2f6bff; font-weight: 600; }
.tab--active::after { content: ''; position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 40rpx; height: 6rpx; border-radius: 3rpx; background: #2f6bff; }
.publish-btn { flex-shrink: 0; height: 56rpx; padding: 0 24rpx; line-height: 56rpx; border-radius: 28rpx; background: #2f6bff; color: #fff; font-size: 26rpx; }
.scroll { flex: 1; }
.card { margin: 24rpx; padding: 28rpx; border-radius: 20rpx; background: #fff; }
.card__head { display: flex; align-items: center; justify-content: space-between; }
.card__title { flex: 1; font-size: 32rpx; font-weight: 600; color: #1f2d3d; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.card__tag { flex-shrink: 0; margin-left: 16rpx; padding: 4rpx 16rpx; border-radius: 20rpx; font-size: 22rpx; }
.card__tag--job { background: #e8f0ff; color: #2f6bff; }
.card__tag--club { background: #e8fff2; color: #12b76a; }
.card__meta { display: flex; justify-content: space-between; margin-top: 16rpx; font-size: 24rpx; color: #909399; }
.card__summary { display: -webkit-box; margin-top: 16rpx; font-size: 26rpx; color: #606266; line-height: 1.6; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.empty, .tip { padding: 80rpx 0; text-align: center; font-size: 26rpx; color: #b0b3bb; }
</style>
