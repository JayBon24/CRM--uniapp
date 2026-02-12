<template>
  <view 
    class="metric-card" 
    :class="[sizeClass, variantClass, { clickable }]" 
    @click="handleClick"
  >
    <!-- 顶部：标题和图标 -->
    <view class="card-header">
      <view class="title-section">
        <text class="title">{{ title }}</text>
      </view>
      <view v-if="icon" class="icon-section">
        <image :src="icon" class="icon" mode="aspectFit" />
      </view>
    </view>

    <!-- 中间：数值和单位 -->
    <view class="card-body">
      <view class="value-section">
        <text class="value">{{ displayValue }}</text>
        <text v-if="unit" class="unit">{{ unit }}</text>
      </view>
    </view>

    <!-- 底部：趋势指示器 -->
    <view v-if="trend && trendValue" class="card-footer">
      <view class="trend-section" :class="trendClass">
        <text class="trend-icon">{{ trendIcon }}</text>
        <text class="trend-value">{{ trendValue }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  icon?: string
  clickable?: boolean
  size?: 'small' | 'medium' | 'large' | 'hero'
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
  trend: undefined,
  trendValue: '',
  icon: '',
  clickable: true,
  size: 'medium',
  variant: 'default'
})

const emit = defineEmits<{
  click: []
}>()

// 格式化显示值
const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    // 如果是数字，格式化为千分位
    return props.value.toLocaleString('zh-CN')
  }
  return props.value
})

// 尺寸样式类
const sizeClass = computed(() => `size-${props.size}`)

// 变体样式类
const variantClass = computed(() => `variant-${props.variant}`)

// 趋势样式类
const trendClass = computed(() => {
  if (!props.trend) return ''
  return `trend-${props.trend}`
})

// 趋势图标
const trendIcon = computed(() => {
  if (!props.trend) return ''
  switch (props.trend) {
    case 'up':
      return '↑'
    case 'down':
      return '↓'
    case 'stable':
      return '→'
    default:
      return ''
  }
})

function handleClick() {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped lang="scss">
.metric-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(31, 35, 41, 0.04);
  transition: all 0.2s ease;
  border: 2rpx solid transparent;
  width: 100%;
  box-sizing: border-box;
  height: 100%;

  &.clickable {
    cursor: pointer;

    &:active {
      border-color: #e5e6eb;
      box-shadow: 0 2rpx 8rpx rgba(31, 35, 41, 0.08);
    }
  }

  // 尺寸变体
  &.size-small {
    padding: 24rpx 20rpx;

    .title {
      font-size: 24rpx;
    }

    .value {
      font-size: 40rpx;
    }

    .unit {
      font-size: 20rpx;
    }
  }

  &.size-medium {
    padding: 32rpx 28rpx;
  }

  &.size-large {
    padding: 40rpx 32rpx;

    .title {
      font-size: 32rpx;
    }

    .value {
      font-size: 56rpx;
    }
  }

  &.size-hero {
    padding: 48rpx 36rpx;
    min-height: 280rpx;
    border-radius: 16rpx;

    .title {
      font-size: 28rpx;
      font-weight: 500;
    }

    .value {
      font-size: 80rpx;
      font-weight: 600;
      line-height: 1.1;
    }

    .unit {
      font-size: 32rpx;
      font-weight: 500;
    }
  }

  // 颜色变体 - 飞书风格纯色
  &.variant-primary {
    background: #3370ff;
    color: #fff;
    box-shadow: 0 4rpx 16rpx rgba(51, 112, 255, 0.16);

    .title,
    .value,
    .unit {
      color: #fff;
    }

    .trend-section {
      background-color: rgba(255, 255, 255, 0.2);
      color: #fff;

      .trend-icon,
      .trend-value {
        color: #fff;
      }
    }
  }

  &.variant-success {
    background: #00b42a;
    color: #fff;
    box-shadow: 0 4rpx 16rpx rgba(0, 180, 42, 0.16);

    .title,
    .value,
    .unit {
      color: #fff;
    }

    .trend-section {
      background-color: rgba(255, 255, 255, 0.2);
      color: #fff;

      .trend-icon,
      .trend-value {
        color: #fff;
      }
    }
  }

  &.variant-warning {
    background: #ff7d00;
    color: #fff;
    box-shadow: 0 4rpx 16rpx rgba(255, 125, 0, 0.16);

    .title,
    .value,
    .unit {
      color: #fff;
    }

    .trend-section {
      background-color: rgba(255, 255, 255, 0.2);
      color: #fff;

      .trend-icon,
      .trend-value {
        color: #fff;
      }
    }
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.title-section {
  flex: 1;
}

.title {
  font-size: 28rpx;
  color: #646a73;
  font-weight: 500;
  line-height: 1.4;
}

.icon-section {
  width: 48rpx;
  height: 48rpx;
}

.icon {
  width: 100%;
  height: 100%;
}

.card-body {
  margin-bottom: 20rpx;
}

.value-section {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.value {
  font-size: 56rpx;
  font-weight: 600;
  color: #1f2329;
  line-height: 1.2;
}

.unit {
  font-size: 24rpx;
  color: #8f959e;
  font-weight: 400;
}

.card-footer {
  display: flex;
  align-items: center;
}

.trend-section {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 6rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 500;

  &.trend-up {
    color: #00b42a;
    background-color: #e8ffea;

    .trend-icon {
      color: #00b42a;
    }
  }

  &.trend-down {
    color: #f53f3f;
    background-color: #ffece8;

    .trend-icon {
      color: #f53f3f;
    }
  }

  &.trend-stable {
    color: #8f959e;
    background-color: #f7f8fa;

    .trend-icon {
      color: #8f959e;
    }
  }
}

.trend-icon {
  font-size: 24rpx;
  line-height: 1;
}

.trend-value {
  font-size: 24rpx;
}
</style>
