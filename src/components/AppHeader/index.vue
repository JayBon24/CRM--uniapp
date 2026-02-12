<template>
  <view class="app-header" :style="headerStyle">
    <view class="header-content" :class="`align-${effectiveAlign}`">
      <view v-if="showBack && !aiOnly" class="back-btn" @click="handleBack">
        <SvgIcon name="arrow-left" :size="28" color="#fff" />
        <text>返回</text>
      </view>

      <view v-if="title && !aiOnly" class="page-title">{{ title }}</view>

      <view v-if="showAI" class="ai-entry-btn" @click="goToAI">
        <SvgIcon name="ai" :size="32" :color="aiMainColor" />
        <text class="ai-entry-text" :style="{ color: aiMainColor }">AI入口</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props定义
interface Props {
  showBack?: boolean // 是否显示返回按钮
  title?: string // 页面标题
  showAI?: boolean // 是否显示AI入口按钮
  align?: 'left' | 'center' | 'right' // 对齐方式
  aiOnly?: boolean // AI入口独占模式（不显示返回/标题，头部透明）
  aiColor?: string // AI入口主色（不传则自动根据模式切换）
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false,
  title: '',
  showAI: true,
  align: 'left',
  aiOnly: false,
  aiColor: ''
})

// 事件定义
const emit = defineEmits<{
  back: []
  aiClick: []
}>()

// 计算样式
const headerStyle = computed(() => {
  return {
    background: props.aiOnly ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: props.aiOnly ? '16rpx 30rpx' : '20rpx 30rpx',
    paddingTop: `calc(var(--status-bar-height) + 20rpx)`
  }
})

const effectiveAlign = computed(() => (props.aiOnly ? 'right' : props.align))

const aiMainColor = computed(() => {
  if (props.aiColor) return props.aiColor
  return props.aiOnly ? '#3B82F6' : '#fff'
})

// 点击返回
const handleBack = () => {
  emit('back')
  uni.navigateBack()
}

// 点击AI入口
const goToAI = () => {
  emit('aiClick')
  // 跳转到AI寄件页面
  uni.navigateTo({
    url: '/pages/other/ai-assistant/index',
    fail: (err) => {
      console.error('跳转AI寄件页面失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.app-header {
  position: relative;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  width: 100%;

  &.align-left {
    justify-content: space-between;
  }

  &.align-center {
    justify-content: center;
  }

  &.align-right {
    justify-content: flex-end;
  }
}

.back-btn {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 28rpx;

  .back-icon {
    margin-right: 8rpx;
  }
}

.page-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}

.ai-entry-btn {
  display: flex;
  align-items: center;
  background-color: transparent;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  border: 1rpx solid currentColor;
  color: v-bind(aiMainColor);
  font-size: 26rpx;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2rpx);
  }

  &:active {
    opacity: 0.85;
    transform: translateY(0);
  }

  .ai-entry-text {
    margin-left: 8rpx;
    font-weight: 500;
  }
}
</style>
