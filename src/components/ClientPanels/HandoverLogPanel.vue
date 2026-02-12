<!-- @ts-nocheck -->
<template>
  <view class="panel handover-panel">
    <view class="panel-header">
      <text class="panel-title">转交日志</text>
      <text class="count-badge">{{ total }}</text>
    </view>

    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="spinner" size="28" />
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="list.length === 0" class="empty-state">
      <text class="empty-text">暂无转交记录</text>
    </view>

    <view v-else class="panel-content">
      <view class="timeline">
        <view
          v-for="(item, index) in list"
          :key="item.id"
          class="timeline-item"
          :class="{ 'is-last': index === list.length - 1 }"
        >
          <view class="timeline-dot" :class="`status-${item.status}`" />
          <view class="timeline-content">
            <view class="content-header">
              <view class="status-badge" :class="`status-${item.status}`">
                {{ statusLabel(item.status) }}
              </view>
              <text class="time">{{ formatTime(item.create_time) }}</text>
            </view>

            <view class="transfer-info">
              <view class="transfer-row">
                <text class="from">{{ item.from_user_name }}</text>
                <SvgIcon name="arrow-right" :size="28" color="#909399" />
                <text class="to">{{ item.to_user_name }}</text>
              </view>
            </view>

            <view v-if="item.reason" class="reason">
              <text class="reason-label">转交原因：</text>
              <text class="reason-text">{{ item.reason }}</text>
            </view>

            <view v-if="item.status === 'approved' && item.approver_name" class="approval-info">
              <text class="approver">审批人：{{ item.approver_name }}</text>
              <text class="approval-time">{{ formatTime(item.approval_time) }}</text>
            </view>

            <view v-if="item.status === 'rejected' && item.reject_reason" class="reject-info">
              <text class="reject-label">拒绝原因：</text>
              <text class="reject-text">{{ item.reject_reason }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted } from 'vue'
import type { ClientHandoverLog } from '@/types/interfaces/client-handover'
import dayjs from 'dayjs'
import { getTransferLogList } from '@/api/client'

interface Props {
  clientId: number | string
}

const props = defineProps<Props>()

const list = ref<ClientHandoverLog[]>([])
const total = ref(0)
const loading = ref(false)

function statusLabel(status: string) {
  const map = {
    pending: '待审批',
    completed: '已通过',
    approved: '已通过',
    rejected: '已驳回'
  }
  return map[status] || status
}

function formatTime(time: string) {
  return dayjs(time).format('MM-DD HH:mm')
}

async function loadList() {
  if (loading.value) return

  loading.value = true
  try {
    const res = await getTransferLogList(props.clientId)
    list.value = res.results || []
    total.value = res.total || 0
  } catch (error) {
    console.error('加载转交日志失败:', error)
    uni.showToast({
      title: '获取转交记录失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadList()
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

.timeline {
  position: relative;
}

.timeline-item {
  position: relative;
  padding-left: 60rpx;
  padding-bottom: 40rpx;

  &:not(.is-last)::before {
    content: '';
    position: absolute;
    left: 16rpx;
    top: 40rpx;
    bottom: 0;
    width: 2rpx;
    background: #EBEEF5;
  }
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 8rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: #fff;
  border: 4rpx solid;

  &.status-pending {
    border-color: #E6A23C;
  }

  &.status-approved {
    border-color: #67C23A;
  }

  &.status-rejected {
    border-color: #F56C6C;
  }
}

.timeline-content {
  background: #F5F7FA;
  border-radius: 8rpx;
  padding: 20rpx;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.status-badge {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 500;

  &.status-pending {
    background: #FFF7E6;
    color: #E6A23C;
  }

  &.status-approved {
    background: #F0F9E8;
    color: #67C23A;
  }

  &.status-rejected {
    background: #FEF0F0;
    color: #F56C6C;
  }
}

.time {
  font-size: 24rpx;
  color: #909399;
}

.transfer-info {
  margin-bottom: 16rpx;
}

.transfer-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 28rpx;
}

.from,
.to {
  font-weight: 600;
  color: #303133;
}

.reason {
  padding: 12rpx;
  background: #fff;
  border-radius: 6rpx;
  margin-bottom: 16rpx;
}

.reason-label {
  font-size: 24rpx;
  color: #909399;
}

.reason-text {
  font-size: 26rpx;
  color: #606266;
  line-height: 1.5;
}

.approval-info,
.reject-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  font-size: 24rpx;
  color: #909399;
}

.reject-label {
  color: #F56C6C;
}

.reject-text {
  color: #606266;
}
</style>
