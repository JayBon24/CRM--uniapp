<template>
  <view class="feedback-list-page">
    <view class="list-container">
      <view v-if="loading" class="loading-box">
        <u-loading-icon mode="spinner"></u-loading-icon>
        <text class="loading-text">加载中...</text>
      </view>
      
      <view v-else-if="list.length === 0" class="empty-box">
        <text class="empty-text">暂无反馈记录</text>
      </view>
      
      <view v-else class="list">
        <view v-for="item in list" :key="item.id" class="feedback-item">
          <view class="item-header">
            <view class="type-badge" :class="item.type">
              {{ typeLabel(item.type) }}
            </view>
            <text class="time">{{ item.created_at }}</text>
          </view>
          
          <view class="content">
            {{ item.content }}
          </view>
          
          <view v-if="item.images && item.images.length > 0" class="images">
            <image
              v-for="(img, idx) in item.images"
              :key="idx"
              :src="img"
              class="img"
              mode="aspectFill"
              @click="previewImage(item.images, idx)"
            />
          </view>
          
          <view v-if="item.context" class="context-info">
            <text class="context-label">关联客户 ID: {{ item.context.client_id || '-' }}</text>
          </view>
          
          <view class="item-footer">
            <text class="status" :class="item.status">{{ statusLabel(item.status) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFeedbackList } from '@/api/mine'
import type { FeedbackTicket } from '@/types/interfaces/mine'

const list = ref<FeedbackTicket[]>([])
const loading = ref(true)

async function fetchList() {
  try {
    loading.value = true
    const res = await getFeedbackList()
    list.value = res.rows
  } catch (error) {
    console.error('获取反馈列表失败:', error)
  } finally {
    loading.value = false
  }
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    bug: '缺陷',
    feature: '建议',
    ai_feedback: 'AI反馈',
    other: '其他'
  }
  return map[type] || type
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    open: '待处理',
    closed: '已关闭',
    in_progress: '处理中'
  }
  return map[status] || status
}

function previewImage(urls: string[], current: number) {
  uni.previewImage({
    urls,
    current
  })
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.feedback-list-page {
  min-height: 100vh;
  background: #F5F7FA;
  padding: 20rpx;
}

.loading-box, .empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.loading-text, .empty-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #909399;
}

.feedback-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.type-badge {
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
  font-size: 22rpx;
  color: #fff;
  
  &.bug { background: #F56C6C; }
  &.feature { background: #409EFF; }
  &.ai_feedback { background: #67C23A; }
  &.other { background: #909399; }
}

.time {
  font-size: 24rpx;
  color: #909399;
}

.content {
  font-size: 28rpx;
  color: #303133;
  line-height: 1.6;
  margin-bottom: 16rpx;
  word-break: break-all;
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
}

.context-info {
  background: #F5F7FA;
  padding: 12rpx 16rpx;
  border-radius: 4rpx;
  margin-bottom: 16rpx;
}

.context-label {
  font-size: 24rpx;
  color: #606266;
}

.item-footer {
  text-align: right;
  border-top: 1rpx solid #EBEEF5;
  padding-top: 16rpx;
}

.status {
  font-size: 24rpx;
  font-weight: 500;
  
  &.open { color: #E6A23C; }
  &.closed { color: #909399; }
  &.in_progress { color: #409EFF; }
}
</style>

