<template>
  <view class="date-selector">
    <!-- 选择显示区域，参考 AreaSelector 的样式：文字 + 箭头 -->
    <view class="selected-area" @click="openPicker">
      <view class="area-value">
        <text v-if="displayText" class="selected-text">{{ displayText }}</text>
        <text v-else class="placeholder">{{ placeholder }}</text>
      </view>
      <u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
    </view>

    <!-- 直接使用 u-datetime-picker 自带弹层，不再额外包裹 u-popup -->
    <u-datetime-picker
      v-model="innerTimestamp"
      :show="showPicker"
      mode="date"
      :closeOnClickOverlay="true"
      @change="onPickerChange"
      @confirm="onConfirm"
      @cancel="onCancel"
      @close="onCancel"
    />
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// 组件属性
const props = defineProps({
  // v-model 绑定：建议使用 ISO 字符串或 'YYYY-MM-DD'
  modelValue: {
    type: String,
    default: ''
  },
  // 占位文本
  placeholder: {
    type: String,
    default: '请选择日期'
  },
  // 弹窗标题
  title: {
    type: String,
    default: '选择日期'
  }
})

// 事件：更新和变更
const emit = defineEmits(['update:modelValue', 'change'])

// 弹窗显示控制
// 控制 u-datetime-picker 的显示
const showPicker = ref(false)

// 内部时间戳（毫秒）
const innerTimestamp = ref(Date.now())

// 展示文本：YYYY-MM-DD
const displayText = computed(() => {
  if (!props.modelValue) return ''
  // 支持 ISO 字符串或已格式化的 'YYYY-MM-DD'
  const date = /^\d{4}-\d{2}-\d{2}$/.test(props.modelValue)
    ? new Date(props.modelValue + 'T00:00:00')
    : new Date(props.modelValue)
  if (isNaN(date.getTime())) return ''
  const yyyy = date.getFullYear()
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd}`
})

// 打开选择器：初始化内部值
const openPicker = () => {
  if (props.modelValue) {
    const d = /^\d{4}-\d{2}-\d{2}$/.test(props.modelValue)
      ? new Date(props.modelValue + 'T00:00:00')
      : new Date(props.modelValue)
    if (!isNaN(d.getTime())) {
      innerTimestamp.value = d.getTime()
    } else {
      innerTimestamp.value = Date.now()
    }
  } else {
    innerTimestamp.value = Date.now()
  }
  showPicker.value = true
}

// 监听滚动选择变化（保留用于联动/调试）
const onPickerChange = (e) => {
  // e.value 为时间戳
  if (e && e.value) {
    innerTimestamp.value = e.value
  }
}

// 确认选择（来自 u-datetime-picker 的 confirm 事件）
const onConfirm = () => {
  const d = new Date(innerTimestamp.value)
  const yyyy = d.getFullYear()
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const formatted = `${yyyy}-${MM}-${dd}`
  // 更新父级绑定并触发change
  emit('update:modelValue', formatted)
  emit('change', formatted)
  showPicker.value = false
}

// 取消/关闭
const onCancel = () => {
  showPicker.value = false
}

// 外部值变化时，同步内部时间（首次或显式更新）
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    const d = /^\d{4}-\d{2}-\d{2}$/.test(val) ? new Date(val + 'T00:00:00') : new Date(val)
    if (!isNaN(d.getTime())) {
      innerTimestamp.value = d.getTime()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.date-selector {
  width: 100%;
}

.selected-area {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background-color: #ffffff;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.selected-area:hover {
  border-color: #667eea;
}

.area-value {
  flex: 1;
  margin-right: 20rpx;
}

.selected-text {
  font-size: 28rpx;
  color: #333333;
}

.placeholder {
  font-size: 28rpx;
  color: #999999;
}

.date-popup {
  background-color: #ffffff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.picker-wrapper {
  padding: 20rpx 30rpx 40rpx;
}
</style>

