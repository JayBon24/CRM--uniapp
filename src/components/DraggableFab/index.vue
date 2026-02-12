<template>
  <view class="fab-wrapper" :style="wrapperStyle">
    <movable-area class="fab-area" :style="areaStyle">
      <movable-view
        class="fab"
        direction="all"
        :x="posX"
        :y="posY"
        :animation="false"
        :style="fabStyle"
        :out-of-bounds="false"
        @change="onMoveChange"
        @touchstart="onTouchStart"
        @touchmove.stop.prevent="onTouchMove"
        @touchend="onTouchEnd"
        @click.stop="onClick"
      >
        <view class="fab-inner" :style="fabInnerStyle">
          <SvgIcon :name="icon" :size="iconSize" :color="iconColor" />
        </view>
      </movable-view>
    </movable-area>
  </view>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'

interface Props {
  icon?: string
  size?: number
  iconSize?: number
  bgColor?: string
  iconColor?: string
  offsetRight?: number
  offsetBottom?: number
  bottomGap?: number
  topGap?: number
  storageKey?: string
  zIndex?: number
  clickMode?: 'emit' | 'navigate' | 'toast'
  navigateUrl?: string
  toastTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'publish',
  size: 96,
  iconSize: 44,
  bgColor: '#667eea',
  iconColor: '#fff',
  offsetRight: 26,
  offsetBottom: 56,
  bottomGap: 80,
  topGap: 0,
  storageKey: '',
  zIndex: 999,
  clickMode: 'emit',
  navigateUrl: '/pages/other/publish/type-select/index',
  toastTitle: ''
})

const emit = defineEmits<{
  click: []
  change: [{ x: number; y: number }]
}>()

const posX = ref(0)
const posY = ref(0)
const dragging = ref(false)
const dragX = ref(0)
const dragY = ref(0)
const touchStartPos = ref({ x: 0, y: 0 })
const lastDragAt = ref(0)
const dragDistance = ref(0)

const winW = ref(0)
const winH = ref(0)

const sizePx = computed(() => uni.upx2px(props.size))
const bottomGapPx = computed(() => uni.upx2px(props.bottomGap))
const topGapPx = computed(() => uni.upx2px(props.topGap))
const tabBarHeightPx = computed(() => uni.upx2px(100))
const edgeMarginPx = computed(() => uni.upx2px(20))
const safeAreaBottomPx = computed(() => {
  const sys = uni.getSystemInfoSync()
  return sys.safeAreaInsets?.bottom || 0
})
const effectiveBottomGapPx = computed(() => {
  const reserve = tabBarHeightPx.value + safeAreaBottomPx.value + edgeMarginPx.value
  return Math.max(bottomGapPx.value, reserve)
})
const clickMoveThresholdPx = 6

const fabStyle = computed(() => ({
  width: `${sizePx.value}px`,
  height: `${sizePx.value}px`
}))

const wrapperStyle = computed(() => ({
  zIndex: props.zIndex
}))

const areaStyle = computed(() => {
  const areaHeight = winH.value ? Math.max(0, winH.value - effectiveBottomGapPx.value - topGapPx.value) : 0
  return {
    position: 'absolute',
    top: `${topGapPx.value}px`,
    left: 0,
    width: '100%',
    height: `${areaHeight}px`
  }
})

const fabInnerStyle = computed(() => ({
  width: `${sizePx.value}px`,
  height: `${sizePx.value}px`,
  backgroundColor: props.bgColor
}))

const clampPos = (pos: { x: number; y: number }) => {
  const sys = uni.getSystemInfoSync()
  const areaH = Math.max(0, sys.windowHeight - effectiveBottomGapPx.value - topGapPx.value)
  const maxX = Math.max(0, sys.windowWidth - sizePx.value)
  const maxY = Math.max(0, areaH - sizePx.value)

  return {
    x: Math.min(maxX, Math.max(0, pos.x)),
    y: Math.min(maxY, Math.max(0, pos.y))
  }
}

const calcDefaultPos = () => {
  const sys = uni.getSystemInfoSync()
  const areaH = Math.max(0, sys.windowHeight - effectiveBottomGapPx.value - topGapPx.value)
  const right = uni.upx2px(props.offsetRight)
  const bottom = uni.upx2px(props.offsetBottom)

  const maxX = Math.max(0, sys.windowWidth - sizePx.value)
  const maxY = Math.max(0, areaH - sizePx.value)

  // 按配置计算理想的右下角位置
  let x = Math.min(maxX, Math.max(0, sys.windowWidth - sizePx.value - right))
  let y = Math.min(maxY, Math.max(0, areaH - sizePx.value - bottom))

  // 兜底：如果默认位置仍然在 (0, 0)，说明计算出现了问题
  // 在这种情况下，强制落在可视区域的右下角，避免漂到左上角
  const isScreenReady = sys.windowWidth > 0 && sys.windowHeight > 0
  const isAreaLargeEnough = areaH > sizePx.value
  if (isScreenReady && isAreaLargeEnough && x === 0 && y === 0) {
    x = maxX
    y = maxY
  }

  return { x, y }
}

const loadPos = () => {
  if (!props.storageKey) return null
  try {
    const saved = uni.getStorageSync(props.storageKey)
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
      return { x: saved.x, y: saved.y }
    }
    return null
  } catch {
    return null
  }
}

const savePos = () => {
  if (!props.storageKey) return
  uni.setStorageSync(props.storageKey, { x: posX.value, y: posY.value })
}

const initPosition = (retryCount = 0) => {
  const sys = uni.getSystemInfoSync()
  winW.value = sys.windowWidth
  winH.value = sys.windowHeight

  // 如果窗口尺寸未就绪，延迟重试（最多重试3次）
  if ((sys.windowWidth === 0 || sys.windowHeight === 0) && retryCount < 3) {
    setTimeout(() => {
      initPosition(retryCount + 1)
    }, 50)
    return
  }

  const saved = loadPos()
  const initial = saved ? clampPos(saved) : calcDefaultPos()
  
  // 验证计算出的位置是否有效
  // 对于默认位置（右下角），x 和 y 都应该大于 0（除非窗口非常小）
  // 如果计算出的位置是 (0, 0) 且窗口尺寸正常，说明计算有问题，需要重试
  const areaH = Math.max(0, sys.windowHeight - effectiveBottomGapPx.value - topGapPx.value)
  const isDefaultPos = !saved
  const isPositionValid = isDefaultPos 
    ? (initial.x > 0 || initial.y > 0 || areaH <= sizePx.value) // 默认位置应该在右下角
    : true // 保存的位置直接使用
  
  if (!isPositionValid && retryCount < 3 && sys.windowWidth > 0 && sys.windowHeight > 0) {
    // 如果位置无效且窗口尺寸正常，可能是计算时机问题，延迟重试
    setTimeout(() => {
      initPosition(retryCount + 1)
    }, 100)
    return
  }

  posX.value = initial.x
  posY.value = initial.y

  if (saved && (saved.x !== initial.x || saved.y !== initial.y)) {
    savePos()
  }
}

onMounted(() => {
  // 使用 nextTick 确保 movable-area 已渲染完成
  nextTick(() => {
    initPosition()
  })
})

const onTouchStart = () => {
  dragging.value = false
  dragX.value = posX.value
  dragY.value = posY.value
  touchStartPos.value = { x: posX.value, y: posY.value }
  dragDistance.value = 0
}

const onTouchMove = () => {}

const onTouchEnd = () => {
  const deltaX = dragX.value - touchStartPos.value.x
  const deltaY = dragY.value - touchStartPos.value.y
  dragDistance.value = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  const clamped = clampPos({ x: dragX.value, y: dragY.value })
  posX.value = clamped.x
  posY.value = clamped.y
  savePos()
  if (dragDistance.value > clickMoveThresholdPx) {
    lastDragAt.value = Date.now()
  }
  setTimeout(() => {
    dragging.value = false
  }, 50)
}

const onMoveChange = (e: any) => {
  const detail = e?.detail
  if (!detail) return

  dragX.value = detail.x
  dragY.value = detail.y

  if (detail.source === 'touch') dragging.value = true
  emit('change', { x: dragX.value, y: dragY.value })
}

const onClick = () => {
  if (dragging.value) return
  if (Date.now() - lastDragAt.value < 180) return
  if (dragDistance.value > clickMoveThresholdPx) return

  if (props.clickMode === 'navigate' && props.navigateUrl) {
    uni.navigateTo({
      url: props.navigateUrl,
      fail: err => {
        console.error('页面跳转失败:', err)
        uni.showToast({
          title: '页面跳转失败',
          icon: 'none'
        })
      }
    })
    return
  }

  if (props.clickMode === 'toast' && props.toastTitle) {
    uni.showToast({
      title: props.toastTitle,
      icon: 'none'
    })
    return
  }

  emit('click')
}

</script>

<style lang="scss" scoped>
.fab-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.fab-area {
  position: absolute;
  left: 0;
  width: 100%;
  pointer-events: none;
}

.fab {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.fab-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  box-shadow: 0 18rpx 40rpx rgba(47, 123, 255, 0.35);
  pointer-events: auto;
}
</style>
