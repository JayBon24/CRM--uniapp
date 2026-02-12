<template>
  <view class="time-range-selector">
    <view class="selector-tabs">
      <view
        v-for="option in timeOptions"
        :key="option.value"
        class="tab-item"
        :class="{ active: selectedOption === option.value }"
        @click="selectOption(option.value)"
      >
        {{ option.label }}
      </view>
    </view>

    <!-- 自定义时间范围选择 -->
    <view v-if="selectedOption === 'custom'" class="custom-range">
      <view class="date-picker-row">
        <text class="label">开始日期：</text>
        <picker
          mode="date"
          :value="customStart"
          @change="onStartDateChange"
        >
          <view class="picker-value">{{ customStart || '选择日期' }}</view>
        </picker>
      </view>
      <view class="date-picker-row">
        <text class="label">结束日期：</text>
        <picker
          mode="date"
          :value="customEnd"
          @change="onEndDateChange"
        >
          <view class="picker-value">{{ customEnd || '选择日期' }}</view>
        </picker>
      </view>
      <button class="confirm-btn" @click="confirmCustomRange">确认</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TimeRange, TimeGranularity } from '@/types/interfaces/reports'
import dayjs from 'dayjs'

interface Props {
  modelValue: TimeRange
}

interface Emits {
  (e: 'update:modelValue', value: TimeRange): void
  (e: 'change', value: TimeRange): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 时间选项
const timeOptions = [
  { label: '今日', value: 'today', granularity: 'day' as TimeGranularity, count: 0 },
  { label: '近7天', value: 'week', granularity: 'day' as TimeGranularity, count: 7 },
  { label: '近30天', value: 'month', granularity: 'day' as TimeGranularity, count: 30 },
  { label: '近3个月', value: 'quarter', granularity: 'month' as TimeGranularity, count: 3 },
  { label: '近1年', value: 'year', granularity: 'month' as TimeGranularity, count: 12 },
  { label: '自定义', value: 'custom', granularity: 'day' as TimeGranularity, count: 0 }
]

const selectedOption = ref('month') // 默认近30天
const customStart = ref('')
const customEnd = ref('')

// 选择预设选项
const selectOption = (value: string) => {
  selectedOption.value = value

  if (value === 'custom') {
    // 自定义模式，等待用户选择日期
    return
  }

  const option = timeOptions.find((opt) => opt.value === value)
  if (!option) return

  const end = dayjs()
  let start = dayjs()

  if (value === 'today') {
    start = end
  } else {
    start = end.subtract(option.count, option.granularity === 'month' ? 'month' : 'day')
  }

  const newTimeRange: TimeRange = {
    start: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD'),
    granularity: option.granularity
  }

  emit('update:modelValue', newTimeRange)
  emit('change', newTimeRange)
}

// 自定义日期选择
const onStartDateChange = (e: any) => {
  customStart.value = e.detail.value
}

const onEndDateChange = (e: any) => {
  customEnd.value = e.detail.value
}

const confirmCustomRange = () => {
  if (!customStart.value || !customEnd.value) {
    uni.showToast({
      title: '请选择开始和结束日期',
      icon: 'none'
    })
    return
  }

  if (dayjs(customStart.value).isAfter(dayjs(customEnd.value))) {
    uni.showToast({
      title: '开始日期不能晚于结束日期',
      icon: 'none'
    })
    return
  }

  const newTimeRange: TimeRange = {
    start: customStart.value,
    end: customEnd.value,
    granularity: 'day'
  }

  emit('update:modelValue', newTimeRange)
  emit('change', newTimeRange)
}

// 监听外部变化
watch(
  () => props.modelValue,
  (newValue) => {
    // 根据时间范围判断选中的选项
    const daysDiff = dayjs(newValue.end).diff(dayjs(newValue.start), 'day')
    
    if (daysDiff === 0) {
      selectedOption.value = 'today'
    } else if (daysDiff === 7) {
      selectedOption.value = 'week'
    } else if (daysDiff === 30) {
      selectedOption.value = 'month'
    } else if (daysDiff >= 85 && daysDiff <= 95) {
      selectedOption.value = 'quarter'
    } else if (daysDiff >= 360 && daysDiff <= 370) {
      selectedOption.value = 'year'
    } else {
      selectedOption.value = 'custom'
      customStart.value = newValue.start
      customEnd.value = newValue.end
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.time-range-selector {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.selector-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tab-item {
  flex: 0 0 auto;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;

  &.active {
    background: #1890ff;
    color: #fff;
  }
}

.custom-range {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.date-picker-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .label {
    font-size: 14px;
    color: #333;
    margin-right: 8px;
  }

  .picker-value {
    flex: 1;
    padding: 8px 12px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
  }
}

.confirm-btn {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #1890ff;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  border: none;
  margin-top: 8px;
}
</style>
