<template>
  <view class="image-viewer">
    <!-- 图片展示区域 -->
    <view class="image-container">
      <movable-area class="movable-area">
        <movable-view class="movable-view" direction="all" :scale="true" :scale-min="1" :scale-max="3"
          :scale-value="scale" inertia :out-of-bounds="false" :friction="0.1" :disabled="false">
          <!-- 使用 u-image 组件 -->
          <u-image :src="imageSrc" mode="aspectFit" :class="imageClass"
            :show-loading="true" :show-error="true" :lazy-load="true"
            :disable-default-padding="true"
            @error="onImageError" @load="onImageLoad"
            @click="previewFullscreen"
            @longpress="onImageLongPress" />

        </movable-view>
      </movable-area>

      <!-- 缩放控制按钮 -->
      <view class="zoom-controls">
        <u-icon name="minus-circle" size="22" color="#fff" @tap="zoomOut" />
        <u-icon name="reload" size="22" color="#fff" @tap="resetZoom" />
        <u-icon name="scan" size="22" color="#fff" @tap="previewFullscreen" />
        <u-icon name="plus-circle" size="22" color="#fff" @tap="zoomIn" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 组件属性
const props = defineProps({
  imageSrc: {
    type: String,
    required: true
  }
})

// 组件事件
const emit = defineEmits(['imageLoad', 'imageError', 'previewFullscreen'])

// 缩放状态
const scale = ref(1)

// 是否使用原生 image 标签（备用方案）
const useNativeImage = ref(false)

// 检测是否在小程序环境
const isMiniProgram = computed(() => {
  // #ifdef MP
  return true
  // #endif
  // #ifndef MP
  return false
  // #endif
})

// 图片样式类名
const imageClass = computed(() => {
  return isMiniProgram.value ? 'image image-miniprogram' : 'image'
})

// 缩放控制方法
const zoomIn = () => {
  if (scale.value < 3) {
    scale.value = parseFloat((scale.value + 0.2).toFixed(1))
  }
}

const zoomOut = () => {
  if (scale.value > 1) {
    scale.value = parseFloat((scale.value - 0.2).toFixed(1))
  }
}

const resetZoom = () => {
  scale.value = 1
}

// 全屏预览
const previewFullscreen = () => {
  if (props.imageSrc) {
    const urls = [props.imageSrc]
    // H5/小程序通用预览
    uni.previewImage({
      urls,
      current: 0,
      indicator: 'number',
      longPressActions: {
        itemList: ['保存图片'],
        success: function (res) {
          console.log('选中了第' + (res.tapIndex + 1) + '个按钮')
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      }
    })
  }
  // 同时发出事件给父组件
  emit('previewFullscreen')
}

// 图片长按事件处理（禁用默认长按菜单）
const onImageLongPress = (e) => {
  console.log('图片长按事件', e)
  // 阻止默认的长按菜单，让双指缩放正常工作
  e.preventDefault && e.preventDefault()
  e.stopPropagation && e.stopPropagation()
  return false
}

// 图片加载事件
const onImageLoad = (e) => {
  console.log('图片加载成功', e)
  console.log('图片地址:', props.imageSrc)
  emit('imageLoad', e)
}

const onImageError = (e) => {
  console.log('图片加载失败', e)
  console.log('图片地址:', props.imageSrc)
  console.log('错误详情:', e.detail)

  // 如果是 u-image 组件失败，尝试切换到原生 image
  if (!useNativeImage.value) {
    console.log('尝试切换到原生 image 标签')
    useNativeImage.value = true
  }

  emit('imageError', e)
}
</script>

<style scoped>
.image-viewer {
  width: 100%;
  aspect-ratio: 1 / 1;
  /* 锁定为正方形，宽高相等 */
  position: relative;
  background: #eeeeee;
  overflow: hidden;
  /* 确保容器可以正确显示图片 */
  min-height: 400rpx;
}

.image-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.movable-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.movable-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* 在小程序中确保容器有明确的高度 */
  min-height: 400rpx;
}

.image {
  /* 在小程序中使用固定尺寸，避免百分比计算问题 */
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  margin: auto;
  cursor: pointer;
  transition: opacity 0.2s ease;
  /* 确保图片能够正确显示，初始满屏 */
  min-width: 100%;
  min-height: 100%;
  /* 禁用图片的长按菜单 */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.image:hover {
  opacity: 0.9;
}

/* 小程序特定样式 */
.image-miniprogram {
  /* 在小程序中使用固定尺寸，避免百分比计算问题 */
  width: 100% !important;
  height: 100% !important;
  min-width: 100% !important;
  min-height: 100% !important;
  /* 确保图片能够正确显示，初始满屏 */
  display: block !important;
  object-fit: contain !important;
  /* 禁用长按菜单，避免干扰双指缩放 */
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  /* 确保图片可以响应触摸事件 */
  pointer-events: auto !important;
}

.zoom-controls {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  display: flex;
  gap: 16rpx;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 9999px;
  padding: 16rpx 32rpx;
}
</style>
