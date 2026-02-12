<template>
  <view class="dimension-breakdown">
    <view class="breakdown-header">
      <view class="header-title">{{ title }}</view>
    </view>

    <view v-if="showChart && breakdownData.length > 0" class="chart-section">
      <ChartContainer
        type="bar"
        :data="chartData"
        :height="300"
      />
    </view>

    <view class="breakdown-list">
      <view
        v-for="(item, index) in breakdownData"
        :key="index"
        class="breakdown-item"
      >
        <view class="item-left">
          <view class="item-rank">{{ index + 1 }}</view>
          <view class="item-label">{{ item.label }}</view>
        </view>
        <view class="item-right">
          <view class="item-value">{{ formatValue(item.value) }}</view>
          <view class="item-percent">{{ item.percent }}%</view>
        </view>
      </view>
    </view>

    <view v-if="breakdownData.length === 0" class="empty-state">
      <view class="empty-icon">*</view>
      <view class="empty-text">{{ emptyText }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartContainer from './ChartContainer.vue'
import type { IndicatorBreakdown } from '@/types/interfaces/reports'

interface Props {
  title: string
  breakdownData: IndicatorBreakdown[]
  unit?: string
  showChart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
  showChart: true
})

const emptyText = '\u6682\u65e0\u62c6\u5206\u6570\u636e'

const formatValue = (value: number): string => {
  if (props.unit === '%') {
    return `${value}%`
  }
  if (props.unit === '\u5c0f\u65f6') {
    return `${value}\u5c0f\u65f6`
  }
  return `${value}${props.unit}`
}

const chartData = computed(() => {
  return {
    categories: props.breakdownData.map(item => item.label),
    series: [{
      name: props.title,
      data: props.breakdownData.map(item => item.value)
    }]
  }
})
</script>

<style scoped lang="scss">
.dimension-breakdown {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.breakdown-header {
  margin-bottom: 24rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2329;
  display: flex;
  align-items: center;
  gap: 12rpx;

  &::before {
    content: '';
    width: 6rpx;
    height: 28rpx;
    background: #3370ff;
    border-radius: 3rpx;
  }
}

.chart-section {
  margin-bottom: 32rpx;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.breakdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f7f8fa;
  border-radius: 12rpx;
  transition: all 0.2s;

  &:active {
    background: #ebedf0;
  }
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.item-rank {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3370ff;
  color: #fff;
  border-radius: 50%;
  font-size: 24rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.item-label {
  font-size: 28rpx;
  color: #1f2329;
  font-weight: 500;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
}

.item-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2329;
}

.item-percent {
  font-size: 24rpx;
  color: #8f959e;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 48rpx;
}

.empty-icon {
  font-size: 96rpx;
  margin-bottom: 24rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #8f959e;
}
</style>
