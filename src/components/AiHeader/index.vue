<template>
  <view class="app-header" :style="headerStyle">
    <view class="ai-entry" @click="goToAI">
      <SvgIcon name="ai" :size="44" />
      <text class="ai-entry-text">AI助手</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  aiClick: []
}>()

const headerStyle = {
  background: 'linear-gradient(135deg, #2f7bff 0%, #667eea 55%, #8b5cf6 100%)',
  padding: '18rpx 30rpx',
  paddingTop: `calc(var(--status-bar-height) + 20rpx)`
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
  max-width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 18rpx;
  border-bottom-left-radius: 28rpx;
  border-bottom-right-radius: 28rpx;
  box-shadow: 0 18rpx 46rpx rgba(47, 123, 255, 0.25);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: -120rpx;
    top: -140rpx;
    width: 360rpx;
    height: 360rpx;
    border-radius: 999rpx;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 60%);
    pointer-events: none;
  }
}

.ai-entry {
  display: flex;
  align-items: center;
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.18);
  border: 1rpx solid rgba(255, 255, 255, 0.28);
  color: #fff;
  font-size: 28rpx;
  position: relative;
  z-index: 1;

  &:active {
    opacity: 0.92;
    transform: scale(0.99);
  }

  .ai-entry-text {
    margin-left: 10rpx;
    font-weight: 700;
  }
}
</style>
