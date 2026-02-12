<template>
  <view class="custom-slider" :style="sliderStyle">
    <!-- 滑块轨道 -->
    <view
      class="slider-track"
      :style="trackStyle"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @click="onTrackClick"
    >
      <!-- 已填充部分 -->
      <view class="slider-fill" :style="fillStyle"></view>
      <!-- 滑块按钮 -->
      <view
        class="slider-thumb"
        :style="thumbStyle"
      >
        <view class="thumb-inner"></view>
      </view>
    </view>

    <!-- 可选：显示当前值 -->
    <view v-if="showValue" class="slider-value">{{ currentValue }}</view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showValue: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 4
  },
  thumbSize: {
    type: Number,
    default: 20
  },
  activeColor: {
    type: String,
    default: '#1976d2'
  },
  inactiveColor: {
    type: String,
    default: '#e0e0e0'
  },
  thumbColor: {
    type: String,
    default: '#ffffff'
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'change', 'input'])

// 响应式数据
const currentValue = ref(props.modelValue)
const isDragging = ref(false)
const trackWidth = ref(0)
const trackLeft = ref(0)

// 计算属性
const percentage = computed(() => {
  const range = props.max - props.min
  return ((currentValue.value - props.min) / range) * 100
})

const sliderStyle = computed(() => ({
  height: props.height + 'px',
  opacity: props.disabled ? 0.6 : 1
}))

const trackStyle = computed(() => ({
  height: props.height + 'px',
  backgroundColor: props.inactiveColor,
  borderRadius: (props.height / 2) + 'px'
}))

const fillStyle = computed(() => ({
  width: percentage.value + '%',
  height: '100%',
  backgroundColor: props.activeColor,
  borderRadius: (props.height / 2) + 'px',
  transition: isDragging.value ? 'none' : 'width 0.2s ease'
}))

const thumbStyle = computed(() => ({
  left: percentage.value + '%',
  width: props.thumbSize + 'px',
  height: props.thumbSize + 'px',
  marginLeft: (-props.thumbSize / 2) + 'px',
  marginTop: (-(props.thumbSize - props.height) / 2) + 'px',
  transition: isDragging.value ? 'none' : 'left 0.2s ease'
}))

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  currentValue.value = newValue
})

// 更新值并触发事件
const updateValue = (value) => {
  // 确保值在范围内
  const clampedValue = Math.max(props.min, Math.min(props.max, value))

  // 按步长调整
  const steppedValue = Math.round((clampedValue - props.min) / props.step) * props.step + props.min

  if (steppedValue !== currentValue.value) {
    currentValue.value = steppedValue
    emit('update:modelValue', steppedValue)
    emit('input', steppedValue)
  }
}

// 根据位置计算值
const getValueFromPosition = (x) => {
  if (trackWidth.value === 0) return currentValue.value

  const percentage = Math.max(0, Math.min(1, (x - trackLeft.value) / trackWidth.value))
  const value = props.min + percentage * (props.max - props.min)
  return value
}

// 获取轨道位置信息
const updateTrackInfo = () => {
  const query = uni.createSelectorQuery()
  query.select('.slider-track').boundingClientRect((rect) => {
    if (rect) {
      trackWidth.value = rect.width
      trackLeft.value = rect.left
    }
  }).exec()
}

// 鼠标按下
const onMouseDown = (e) => {
  if (props.disabled) return

  isDragging.value = true
  updateTrackInfo()
}

// 鼠标移动
const onMouseMove = (e) => {
  if (props.disabled || !isDragging.value) return

  const currentX = e.clientX
  const newValue = getValueFromPosition(currentX)
  updateValue(newValue)
}

// 鼠标抬起
const onMouseUp = (e) => {
  if (props.disabled) return

  isDragging.value = false
  // 拖拽结束时触发change事件
  emit('change', currentValue.value)
}

// 点击滑块轨道
const onTrackClick = (e) => {
  if (props.disabled) return

  e.stopPropagation()

  updateTrackInfo()

  // 延迟执行，确保轨道信息已更新
  setTimeout(() => {
    const clickX = e.clientX
    const newValue = getValueFromPosition(clickX)
    updateValue(newValue)
    emit('change', newValue)
  }, 10)
}
</script>

<style scoped>
.custom-slider {
  position: relative;
  width: 100%;
  user-select: none;
}

.slider-track {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.slider-thumb {
  position: absolute;
  top: 0;
  cursor: grab;
  z-index: 2;
}

.slider-thumb:active {
  cursor: grabbing;
}

.thumb-inner {
  width: 100%;
  height: 100%;
  background-color: v-bind(thumbColor);
  border: 2px solid v-bind(activeColor);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.slider-thumb:active .thumb-inner {
  transform: scale(1.1);
}

.slider-value {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

/* 禁用状态 */
.custom-slider.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.custom-slider.disabled .slider-thumb {
  cursor: not-allowed;
}
</style>
