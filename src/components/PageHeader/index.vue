<template>
  <view class="header">
    <view class="header-content">
      <!-- 左侧标题 -->
      <view v-if="title" class="header-title">{{ title }}</view>
      
      <!-- AI入口按钮（右上角） -->
      <view class="ai-entry-btn" @click="onAIClick">
        <SvgIcon name="ai" :size="32" color="#fff" />
        <text class="ai-entry-text">AI入口</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// Props定义
interface Props {
  title?: string // 可选的标题文本
}

const props = withDefaults(defineProps<Props>(), {
  title: ''
})

// 事件定义
const emit = defineEmits<{
  aiClick: []
}>()

// AI入口点击事件
const onAIClick = () => {
  emit('aiClick')
}
</script>

<style lang="scss" scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx 30rpx;
  padding-top: calc(var(--status-bar-height) + 20rpx);
}

.header-content {
  display: flex;
  justify-content: space-between; // 左右对齐
  align-items: center;
  position: relative;
}

.header-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  flex: 1; // 占据可用空间，实现真正的左对齐
}

.ai-entry-btn {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 12rpx 24rpx;
  border-radius: 25rpx;
  color: #fff;
  font-size: 26rpx;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  position: absolute;
  right: 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2rpx);
  }

  .ai-entry-text {
    margin-left: 8rpx;
    font-weight: 500;
  }
}
</style>
