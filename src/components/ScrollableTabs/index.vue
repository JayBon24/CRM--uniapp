<template>
  <view
    class="xtabs"
    :style="{ backgroundColor: bgColor }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- 可横向滚动的容器，滚动到选中项 -->
    <scroll-view
      class="xtabs-scroll"
      :scroll-x="true"
      :scroll-with-animation="true"
      :scroll-into-view="activeTabDomId"
      :show-scrollbar="false"
    >
      <view class="xtabs-inner" :style="{ justifyContent: justifyContent }">
        <view
          v-for="(item, index) in list"
          :key="item.value ?? index"
          class="xtab-item"
          :id="getTabDomId(index)"
          :class="{ active: index === currentIndex }"
          @click="onClick(index)"
        >
          <text class="xtab-text" :style="index === currentIndex ? activeTextStyle : {}">{{ item.name }}</text>
          <view
            v-if="index === currentIndex"
            class="xtab-underline"
            :style="{ backgroundColor: lineColor }"
          />
        </view>
      </view>
    </scroll-view>
  </view>

</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, watch, ref } from 'vue'

/**
 * 可横向滚动的 Tabs 组件
 * 目的：替代 u-tabs，解决初始化测量异常；点击/切换时自动滚动到可视区域
 * Props 对齐：list、current、lineColor、activeStyle；事件：@change(index)
 * 新增：justify 用于主轴对齐（默认 flex-start，可设 space-around/space-between/center）
 */

// 中文注释：Tabs 项接口
interface ITabItem {
  name: string
  value: string
}

const props = defineProps<{
  // 选项列表
  list: ITabItem[]
  // 当前索引
  current?: number
  // 下划线颜色
  lineColor?: string
  // 选中项文字样式（内联样式字符串）
  activeStyle?: string
  // 背景色
  bgColor?: string
  // 是否允许左右滑动切换
  swipeable?: boolean
  // 主轴对齐方式
  justify?: 'flex-start' | 'center' | 'space-around' | 'space-between'
}>()

const emits = defineEmits<{ (e: 'change', index: number): void }>()

// 中文注释：内部当前索引，受控优先
const currentIndex = computed(() => Number(props.current ?? 0))

// 中文注释：将 activeStyle 字符串转为对象，避免直接绑定字符串导致告警
const activeTextStyle = computed(() => {
  const style: Record<string, string> = {}
  if (!props.activeStyle) return style
  props.activeStyle.split(';').forEach((pair) => {
    const [k, v] = pair.split(':')
    if (k && v) style[k.trim()] = v.trim()
  })
  return style
})

const lineColor = computed(() => props.lineColor || '#2979ff')
const bgColor = computed(() => props.bgColor || '#ffffff')
const swipeable = computed(() => props.swipeable !== false)
// 中文注释：主轴对齐（当内容不足一屏时生效）
const justifyContent = computed(() => props.justify || 'flex-start')

// 中文注释：scroll-into-view 目标 id
const activeTabDomId = ref('')
function getTabDomId(index: number) {
  return `xtab_${index}`
}

function onClick(index: number) {
  // 中文注释：先滚动再通知外部变更
  activeTabDomId.value = getTabDomId(index)
  emits('change', index)
}

// 中文注释：外部 current 变化时，滚动到对应项
watch(
  () => props.current,
  (val) => {
    const idx = Number(val ?? 0)
    activeTabDomId.value = getTabDomId(idx)
  },
  { immediate: true }
)

// 中文注释：手势滑动切换（左右滑动）
const touchStartX = ref(0)
const touchStartY = ref(0)
const isMoving = ref(false)

function onTouchStart(e: any) {
  if (!swipeable.value) return
  const t = e.changedTouches?.[0] || e.touches?.[0]
  if (!t) return
  touchStartX.value = t.pageX
  touchStartY.value = t.pageY
  isMoving.value = true
}

function onTouchMove(e: any) {
  // 中文注释：仅记录，避免阻塞 scroll-view 默认横向滚动
}

function onTouchEnd(e: any) {
  if (!swipeable.value || !isMoving.value) return
  isMoving.value = false
  const t = e.changedTouches?.[0]
  if (!t) return
  const dx = t.pageX - touchStartX.value
  const dy = t.pageY - touchStartY.value
  // 中文注释：判定为水平滑动且距离足够
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
    const dir = dx < 0 ? 1 : -1 // 左滑：下一个；右滑：上一个
    const next = Math.max(0, Math.min(currentIndex.value + dir, (props.list?.length || 1) - 1))
    if (next !== currentIndex.value) {
      onClick(next)
    }
  }
}

</script>

<style scoped lang="scss">
.xtabs {
  background-color: #fff;
}

.xtabs-scroll {
  white-space: nowrap;
  /* 隐藏滚动条（H5/APP） */
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // IE/Edge
}
.xtabs-scroll::-webkit-scrollbar {
  display: none; // WebKit
}

.xtabs-inner {
  display: flex;
  align-items: center;
  flex-wrap: nowrap; // 中文注释：禁止换行，保证一行排列
  height: 84rpx;
  padding: 0 8rpx;
}

.xtab-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 22rpx;
  height: 84rpx;
  flex: 0 0 auto; // 中文注释：项宽度由内容决定，且不换行
}

.xtab-text {
  font-size: 28rpx;
  color: #333;
  white-space: nowrap; // 中文注释：文本不换行，防止“全部”分成两行
  line-height: 1;
}

.xtab-item.active .xtab-text {
  color: #2979ff;
  font-weight: 600;
}

.xtab-underline {
  position: absolute;
  left: 50%;
  bottom: 4rpx;
  transform: translateX(-50%);
  width: 44rpx;
  height: 6rpx;
  border-radius: 3rpx;
}
</style>

