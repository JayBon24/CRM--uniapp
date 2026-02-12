<template>
    <view class="page">
    <scroll-view
      scroll-y
      class="list"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onReachBottom"
    >
      <view v-if="items.length === 0 && !loading" class="empty">暂无提醒</view>
      <view v-for="item in items" :key="item.id" class="card" :class="{ unread: !item.is_read }" @click="onClick(item)">
        <view class="card-top">
          <view class="tag" :class="item.reminder_type">{{ typeLabel(item.reminder_type) }}</view>
          <view v-if="!item.is_read" class="dot" />
        </view>
        <view class="card-title">{{ item.title }}</view>
        <view class="card-content">{{ item.content }}</view>
        <view class="card-footer">
          <text class="time">{{ formatTime(item.create_time) }}</text>
          <text class="jump" v-if="item.related_id">查看</text>
        </view>
      </view>
      <view v-if="loading" class="loading">加载中...</view>
      <view v-if="finished && items.length" class="finished">没有更多了</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import { getReminderList } from '@/api/client'
import { useUserStore } from '@/stores/user'

type ReminderItem = {
  id: number
  reminder_type: string
  title: string
  content: string
  related_type?: string
  related_id?: number
  is_read: boolean
  create_time?: string
}

const userStore = useUserStore()

const items = ref<ReminderItem[]>([])
const page = ref(1)
const pageSize = 12
const finished = ref(false)
const loading = ref(false)
const refreshing = ref(false)

const ensureHQAccess = () => {
  if ((userStore.roleLevel || '').toUpperCase() === 'HQ') return true
  uni.showToast({ title: '仅总所管理可访问', icon: 'none' })
  setTimeout(() => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack({ delta: 1 })
    } else {
      uni.switchTab({ url: '/pages/tab/mine' })
    }
  }, 200)
  return false
}

const typeLabel = (v?: string) => {
  if (v === 'recycle_warning') return '公海回收'
  if (v === 'followup_reminder') return '跟进提醒'
  return '提醒'
}

const formatTime = (v?: string) => {
  if (!v) return ''
  return dayjs(v).format('YYYY-MM-DD HH:mm')
}

const fetchList = async (reset = false) => {
  if (loading.value) return
  loading.value = true
  if (reset) {
    page.value = 1
    finished.value = false
  }
  try {
    const res: any = await getReminderList({ page: page.value, pageSize })
    console.log('[messages] fetchList response:', res)
    
    // 后端返回格式: {code: 2000, data: {results: [], count: ...}}
    // 或者 DRF 格式: {count, next, previous, results}
    let rows: ReminderItem[] = []
    let total = 0
    
    // 优先解析项目标准格式: {code: 2000, data: {results: [], count: ...}}
    if (res?.data?.results && Array.isArray(res.data.results)) {
      rows = res.data.results
      total = res.data.count || res.data.total || 0
    } 
    // DRF 标准格式: {count, next, previous, results}
    else if (res?.results && Array.isArray(res.results)) {
      rows = res.results
      total = res.count || 0
    } 
    // 包装在 data 中的 DRF 格式
    else if (res?.data && Array.isArray(res.data)) {
      rows = res.data
      total = res.count || res.total || rows.length
    } 
    // 直接是数组
    else if (Array.isArray(res)) {
      rows = res
      total = res.length
    } 
    // 其他格式
    else {
      rows = res?.rows || res?.list || []
      total = res?.total || res?.count || rows.length
    }
    
    console.log('[messages] parsed rows:', rows.length, 'total:', total)
    
    const merged = reset ? rows : items.value.concat(rows)
    items.value = merged
    
    // 判断是否还有更多数据
    if (merged.length >= total || rows.length < pageSize) {
      finished.value = true
    } else {
      page.value += 1
    }
  } catch (e) {
    console.error('[messages] load failed', e)
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const onRefresh = () => {
  refreshing.value = true
  fetchList(true)
}

const onReachBottom = () => {
  if (!finished.value) fetchList()
}

const onClick = async (item: ReminderItem) => {
  // 先本地标记，避免点击时被网络阻塞
  item.is_read = true

  if (!item.related_id) {
    uni.showToast({ title: '该提醒暂无详情', icon: 'none' })
    return
  }

  // 当前提醒均为 customer 关联，直接跳客户详情
  uni.navigateTo({
    url: `/pages/other/customer/detail/index?id=${item.related_id}`,
    fail: () => {
      uni.showToast({ title: '打开详情失败', icon: 'none' })
    }
  })
}

const initList = () => {
  if (!ensureHQAccess()) return
  fetchList(true)
}

onLoad(() => {
  initList()
})

onShow(() => {
  // 回到页面时主动刷新，避免必须手动下拉才显示
  if (!ensureHQAccess()) return
  if (items.value.length === 0) {
    fetchList(true)
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fb;
}
.list {
  height: calc(100vh - var(--status-bar-height, 0px));
  padding: 16rpx;
  box-sizing: border-box;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 18rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 6rpx 20rpx rgba(15, 23, 42, 0.05);
  position: relative;
}
.card.unread {
  border: 2rpx solid #4f8bff;
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tag {
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  border-radius: 999px;
  background: #eef2ff;
  color: #3b82f6;
}
.tag.recycle_warning {
  background: #fff7ed;
  color: #f97316;
}
.tag.followup_reminder {
  background: #ecfdf3;
  color: #22c55e;
}
.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #f43f5e;
}
.card-title {
  margin-top: 8rpx;
  font-size: 30rpx;
  font-weight: 700;
}
.card-content {
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #4b5563;
}
.card-footer {
  margin-top: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  color: #94a3b8;
}
.jump {
  color: #3b82f6;
}
.empty,
.loading,
.finished {
  text-align: center;
  padding: 24rpx 0;
  color: #9ca3af;
  font-size: 26rpx;
}

/* 去掉可能的自定义导航栏，避免出现双标题 */
:global(.uni-navbar),
:global(.u-navbar) {
  display: none !important;
}
</style>
