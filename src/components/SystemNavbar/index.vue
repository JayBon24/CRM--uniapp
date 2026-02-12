<template>
  <view class="system-navbar" :style="{ paddingTop: statusBarHeight + 'px', zIndex: String(zIndex), background: backgroundColor }">
    <view class="navbar-inner" :style="{ height: navBarHeight + 'px' }">
      <view class="navbar-left" v-if="showBack" @click="handleBack">
        <u-icon name="arrow-left" size="22" :color="textColor" />
      </view>
      <view class="navbar-title" :style="{ color: textColor }">{{ title }}</view>
      <view class="navbar-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, toRefs } from 'vue'

// 组件属性定义（中文注释：标题、是否显示返回、配色与层级）
const props = defineProps({
  title: { type: String, default: '标题' },
  showBack: { type: Boolean, default: true },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#333333' },
  zIndex: { type: Number, default: 20 }
})

// 组件事件（中文注释：点击返回/就绪回调）
const emit = defineEmits(['back', 'ready'])

// 状态栏与导航栏高度（中文注释：多端近似计算，无法获取时使用默认值）
const statusBarHeight = ref(0)
const navBarHeight = ref(44)

const detectHeights = () => {
  try {
    const info = uni.getSystemInfoSync()
    if (info.statusBarHeight) statusBarHeight.value = info.statusBarHeight
    // 微信小程序可用胶囊按钮计算更精确高度
    const rect = typeof wx !== 'undefined' && wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
    if (rect && rect.height) {
      // 经验公式：导航栏高度 ≈ 胶囊高度 + 上下间距
      navBarHeight.value = rect.height + (rect.top - (info.statusBarHeight || 0)) * 2
    }
  } catch (e) {
    // 保持默认高度
  }
}

onMounted(() => {
  detectHeights()
  // 通知父级当前高度，便于父级进行布局（例如固定在顶部时计算内容偏移量）
  setTimeout(() => {
    emit('ready', { statusBarHeight: statusBarHeight.value, navBarHeight: navBarHeight.value })
  }, 0)
})

// 返回按钮处理
const handleBack = () => emit('back')

// 向外暴露高度，便于父级需要时使用
defineExpose({ statusBarHeight, navBarHeight })

// 便于模板直接使用的解构
const { title, showBack, backgroundColor, textColor, zIndex } = toRefs(props)
</script>

<style scoped>
.system-navbar { position: sticky; top: 0; left: 0; right: 0; border-bottom: 1px solid #f0f0f0; }
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16rpx;
}
.navbar-left, .navbar-right {
  width: 80rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
}
</style>

