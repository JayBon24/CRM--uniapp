<!-- @ts-nocheck -->
<template>
  <view class="location-badge" :class="`status-${status}`">
    <SvgIcon :name="iconName" :size="28" :color="iconColor" />
    <text class="status-text">{{ statusText }}</text>
    <view v-if="showRetry && (status === 'fail' || status === 'offline')" class="retry-btn" @click="onRetry">
      <text class="retry-text">重试</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LocationStatus } from '@/types/interfaces/client-visit'

interface Props {
  status: LocationStatus
  showRetry?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRetry: true
})

const emit = defineEmits<{
  retry: []
}>()

const statusConfig = {
  success: { text: '定位成功', icon: 'location', color: '#67C23A' },
  fail: { text: '定位失败', icon: 'warning', color: '#F56C6C' },
  denied: { text: '定位权限被拒绝', icon: 'warning', color: '#E6A23C' },
  offline: { text: '网络不可用', icon: 'wifi-off', color: '#909399' }
}

const statusText = computed(() => statusConfig[props.status]?.text || '未知状态')
const iconName = computed(() => statusConfig[props.status]?.icon || 'location')
const iconColor = computed(() => statusConfig[props.status]?.color || '#909399')

function onRetry() {
  emit('retry')
}
</script>

<style scoped lang="scss">
.location-badge {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 24rpx;
  border-radius: 8rpx;
  background: #F5F7FA;
  border: 1rpx solid #DCDFE6;
}

.status-text {
  flex: 1;
  font-size: 26rpx;
  color: #606266;
}

.retry-btn {
  padding: 8rpx 16rpx;
  background: #667eea;
  border-radius: 6rpx;
}

.retry-text {
  font-size: 24rpx;
  color: #fff;
}

.location-badge.status-success {
  background: #F0F9FF;
  border-color: #67C23A;
  
  .status-text {
    color: #67C23A;
  }
}

.location-badge.status-fail {
  background: #FEF0F0;
  border-color: #F56C6C;
  
  .status-text {
    color: #F56C6C;
  }
}

.location-badge.status-denied {
  background: #FDF6EC;
  border-color: #E6A23C;
  
  .status-text {
    color: #E6A23C;
  }
}

.location-badge.status-offline {
  background: #F4F4F5;
  border-color: #909399;
  
  .status-text {
    color: #909399;
  }
}
</style>

