<script setup lang="ts">
import type { ApplyItem, MyRecruitItem } from '@/types/recruit'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useAuthGuard } from '@/composables/useAuthGuard'
import { getMyApplyListAPI, getMyRecruitListAPI } from '@/services/recruit'
import { useMemberStore } from '@/stores'

type TabKey = 'publish' | 'apply'

const memberStore = useMemberStore()
const activeTab = ref<TabKey>('apply')
const publishList = ref<MyRecruitItem[]>([])
const applyList = ref<ApplyItem[]>([])
const loading = ref(false)
const inited = ref(false)

const publishStatusText: Record<MyRecruitItem['status'], string> = {
  published: '已发布',
  reviewing: '审核中',
  offline: '已下架',
}
const applyStatusText: Record<ApplyItem['status'], string> = {
  pending: '已投递',
  viewed: '已查看',
  pass: '已通过',
  reject: '未通过',
}

onLoad((options) => {
  if (!useAuthGuard())
    return
  const tab = options?.tab
  activeTab.value = tab === 'publish' ? 'publish' : 'apply'
  inited.value = true
  loadList()
})

// 从发布页返回时刷新列表
onShow(() => {
  if (inited.value)
    loadList()
})

async function loadList() {
  loading.value = true
  try {
    if (activeTab.value === 'publish') {
      const res = await getMyRecruitListAPI()
      publishList.value = res.result
    }
    else {
      const res = await getMyApplyListAPI()
      applyList.value = res.result
    }
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

function switchTab(tab: TabKey) {
  if (activeTab.value === tab)
    return
  activeTab.value = tab
  loadList()
}

function goDetail(id: number) {
  uni.navigateTo({ url: `/pagesRecruit/detail/detail?id=${id}` })
}

function goPublish() {
  uni.navigateTo({ url: '/pagesRecruit/publish/publish' })
}
</script>

<template>
  <view class="mine">
    <view class="tabs">
      <view
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'publish' }"
        @click="switchTab('publish')"
      >
        我的发布
      </view>
      <view
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'apply' }"
        @click="switchTab('apply')"
      >
        我的投递
      </view>
    </view>

    <scroll-view class="scroll" scroll-y>
      <!-- 我的发布 -->
      <template v-if="activeTab === 'publish'">
        <view v-if="publishList.length === 0 && !loading" class="empty">
          还没有发布内容
        </view>
        <view v-for="item in publishList" :key="item.id" class="card" @click="goDetail(item.id)">
          <view class="card__head">
            <text class="card__title">{{ item.title }}</text>
            <text class="card__status">{{ publishStatusText[item.status] }}</text>
          </view>
          <view class="card__meta">
            <text>{{ item.publisher }}</text>
            <text>{{ item.createTime }}</text>
          </view>
          <text class="card__summary">{{ item.summary }}</text>
        </view>

        <view v-if="memberStore.profile?.userInfo.role === 'club'" class="publish-entry" @click="goPublish">
          + 发布新招新
        </view>
      </template>

      <!-- 我的投递 -->
      <template v-else>
        <view v-if="applyList.length === 0 && !loading" class="empty">
          还没有投递记录
        </view>
        <view v-for="item in applyList" :key="item.id" class="card" @click="goDetail(item.recruitId)">
          <view class="card__head">
            <text class="card__title">{{ item.title }}</text>
            <text class="card__status card__status--apply">{{ applyStatusText[item.status] }}</text>
          </view>
          <view class="card__meta">
            <text>{{ item.publisher }}</text>
            <text>{{ item.createTime }}</text>
          </view>
        </view>
      </template>

      <view v-if="loading" class="tip">
        加载中...
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.mine { height: 100vh; display: flex; flex-direction: column; background: #f6f8fc; }
.tabs { display: flex; align-items: center; height: 88rpx; padding: 0 24rpx; background: #fff; }
.tabs__item { position: relative; margin-right: 48rpx; padding-bottom: 10rpx; font-size: 30rpx; color: #888; }
.tabs__item--active { color: #2f6bff; font-weight: 600; }
.tabs__item--active::after { content: ''; position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 40rpx; height: 6rpx; border-radius: 3rpx; background: #2f6bff; }
.scroll { flex: 1; }
.card { margin: 24rpx; padding: 28rpx; border-radius: 20rpx; background: #fff; }
.card__head { display: flex; align-items: center; justify-content: space-between; }
.card__title { flex: 1; font-size: 32rpx; font-weight: 600; color: #1f2d3d; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.card__status { flex-shrink: 0; margin-left: 16rpx; padding: 4rpx 16rpx; border-radius: 20rpx; background: #e8fff2; color: #12b76a; font-size: 22rpx; }
.card__status--apply { background: #e8f0ff; color: #2f6bff; }
.card__meta { display: flex; justify-content: space-between; margin-top: 16rpx; font-size: 24rpx; color: #909399; }
.card__summary { display: -webkit-box; margin-top: 16rpx; font-size: 26rpx; color: #606266; line-height: 1.6; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.publish-entry { margin: 0 24rpx 24rpx; height: 88rpx; line-height: 88rpx; border-radius: 44rpx; background: #fff; color: #2f6bff; font-size: 28rpx; text-align: center; }
.empty, .tip { padding: 80rpx 0; text-align: center; font-size: 26rpx; color: #b0b3bb; }
</style>
