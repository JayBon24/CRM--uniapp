<!-- @ts-nocheck -->
<template>
  <view class="panel visit-panel">
    <view class="panel-header">
      <text class="panel-title">拜访足迹</text>
      <text class="count-badge">{{ total }} / {{ validCount }}有效</text>
    </view>

    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="spinner" size="28" />
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="list.length === 0" class="empty-state">
      <text class="empty-text">暂无拜访记录</text>
    </view>

    <view v-else class="panel-content">
      <view class="visit-list">
        <view
          v-for="item in list"
          :key="item.id"
          class="visit-item"
          @click="handleItemClick(item)"
        >
          <view class="visit-header">
            <view class="header-left">
              <text class="visit-time">{{ formatTime(item.visit_time) }}</text>
              <view v-if="isValidVisit(item)" class="valid-badge">有效</view>
            </view>
            <view class="location-status" :class="`status-${item.location_status}`">
              {{ locationStatusLabel(item.location_status) }}
            </view>
          </view>

          <view class="visit-content">
            <text class="value-info">{{ item.value_info || '暂无记录' }}</text>
          </view>

          <view v-if="item.address" class="visit-location">
            <SvgIcon name="location" :size="24" color="#909399" />
            <text class="address">{{ item.address }}</text>
          </view>

          <view class="visit-footer">
            <view class="participants">
              <text class="label">参与：</text>
              <text class="value">{{ participantsText(item) }}</text>
            </view>
            <text class="duration">{{ item.duration || 0 }}分钟</text>
          </view>
        </view>
      </view>

      <view v-if="hasMore" class="load-more" @click="loadMore">
        <text class="load-more-text">查看更多</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted } from 'vue'
import type { ClientVisit } from '@/types/interfaces/client-visit'
import { getVisitList } from '@/api/client'
import dayjs from 'dayjs'

interface Props {
  clientId: number | string
}

const props = defineProps<Props>()

const list = ref<ClientVisit[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)

const hasMore = ref(false)

const validCount = computed(() => {
  return list.value.filter(item => isValidVisit(item)).length
})

function isValidVisit(visit: ClientVisit) {
  return visit.location_status === 'success' || (visit.lng && visit.lat)
}

function locationStatusLabel(status: string) {
  const map = {
    success: '定位成功',
    fail: '定位失败',
    denied: '拒绝授权',
    offline: '无网络'
  }
  return map[status] || status
}

function participantsText(visit: ClientVisit) {
  const names = []
  if (visit.system_users && visit.system_users.length > 0) {
    names.push(...visit.system_users.map(u => u.name))
  }
  if (visit.client_contacts && visit.client_contacts.length > 0) {
    names.push(...visit.client_contacts.map(c => c.name))
  }
  return names.join('、') || '-'
}

function formatTime(time: string) {
  return dayjs(time).format('MM-DD HH:mm')
}

function handleItemClick(item: ClientVisit) {
  uni.navigateTo({
    url: `/pages/other/customer/visit/detail?id=${item.id}`
  })
}

async function loadList(append = false) {
  if (loading.value) return

  loading.value = true
  try {
    const res = await getVisitList(props.clientId as string)
    
    if (append) {
      list.value = [...list.value, ...res.rows]
    } else {
      list.value = res.rows
    }
    total.value = res.total
    hasMore.value = list.value.length < res.total
  } catch (error) {
    console.error('加载拜访记录失败:', error)
  } finally {
    loading.value = false
  }
}

function loadMore() {
  page.value++
  loadList(true)
}

onMounted(() => {
  loadList()
})

// 暴露刷新方法供父组件调用
defineExpose({
  refresh: loadList
})
</script>

<style scoped lang="scss">
.panel {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.count-badge {
  padding: 4rpx 12rpx;
  background: #F0F2F5;
  border-radius: 10rpx;
  font-size: 24rpx;
  color: #606266;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 30rpx;
  gap: 16rpx;
}

.loading-text,
.empty-text {
  font-size: 26rpx;
  color: #909399;
}

.panel-content {
  padding: 30rpx;
}

.visit-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.visit-item {
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
}

.visit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.visit-time {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
}

.valid-badge {
  padding: 2rpx 10rpx;
  background: #F0F9E8;
  border-radius: 6rpx;
  font-size: 20rpx;
  color: #67C23A;
  font-weight: 500;
}

.location-status {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;

  &.status-success {
    background: #E6F4FF;
    color: #409EFF;
  }

  &.status-fail {
    background: #FEF0F0;
    color: #F56C6C;
  }

  &.status-denied {
    background: #FFF7E6;
    color: #E6A23C;
  }

  &.status-offline {
    background: #F5F5F5;
    color: #909399;
  }
}

.visit-content {
  margin-bottom: 16rpx;
}

.value-info {
  font-size: 28rpx;
  color: #606266;
  line-height: 1.6;
}

.visit-location {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx;
  background: #fff;
  border-radius: 6rpx;
  margin-bottom: 16rpx;
}

.address {
  font-size: 26rpx;
  color: #606266;
}

.visit-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
  color: #909399;
}

.participants {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.label {
  color: #909399;
}

.value {
  color: #606266;
}

.duration {
  color: #667eea;
  font-weight: 500;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 20rpx 0;
  margin-top: 20rpx;
  border-top: 1rpx solid #EBEEF5;
}

.load-more-text {
  font-size: 26rpx;
  color: #667eea;
}
</style>

