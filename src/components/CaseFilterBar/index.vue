<template>
  <view class="case-filter-bar">
    <view class="filter-row">
      <picker
        class="picker"
        :range="statusOptions"
        range-key="label"
        :value="statusIndex"
        @change="onStatusChange"
      >
        <view class="picker-display">{{ statusOptions[statusIndex]?.label || '状态' }}</view>
      </picker>
      <picker
        class="picker"
        :range="typeOptions"
        range-key="label"
        :value="typeIndex"
        @change="onTypeChange"
      >
        <view class="picker-display">{{ typeOptions[typeIndex]?.label || '类型' }}</view>
      </picker>
    </view>
    <view class="search-row">
      <input
        v-model="local.search"
        class="search-input"
        placeholder="搜索案件名称/编号"
        placeholder-style="color: #C0C4CC"
        confirm-type="search"
        @confirm="handleSearch"
      />
      <view class="btn primary" @click="handleSearch">搜索</view>
      <view class="btn ghost" @click="handleReset">重置</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

interface FilterData {
  case_status?: string
  case_type?: string
  search?: string
}

const props = defineProps<{
  modelValue: FilterData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterData): void
  (e: 'filter'): void
  (e: 'search'): void
}>()

const local = reactive<FilterData>({
  case_status: '',
  case_type: '',
  search: '',
})

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(local, value || {})
  },
  { immediate: true, deep: true }
)

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '待处理', value: '待处理' },
  { label: '进行中', value: '进行中' },
  { label: '已结案', value: '已结案' },
]

const typeOptions = [
  { label: '全部类型', value: '' },
  { label: '诉讼', value: 'litigation' },
  { label: '仲裁', value: 'arbitration' },
  { label: '调解', value: 'mediation' },
  { label: '其他', value: 'other' },
]

const statusIndex = computed(() => {
  const index = statusOptions.findIndex(item => item.value === (local.case_status || ''))
  return index === -1 ? 0 : index
})

const typeIndex = computed(() => {
  const index = typeOptions.findIndex(item => item.value === (local.case_type || ''))
  return index === -1 ? 0 : index
})

function emitChange() {
  emit('update:modelValue', { ...local })
  emit('filter')
}

function onStatusChange(event: any) {
  const index = Number(event.detail.value || 0)
  local.case_status = statusOptions[index]?.value || ''
  emitChange()
}

function onTypeChange(event: any) {
  const index = Number(event.detail.value || 0)
  local.case_type = typeOptions[index]?.value || ''
  emitChange()
}

function handleSearch() {
  emit('update:modelValue', { ...local })
  emit('search')
}

function handleReset() {
  local.case_status = ''
  local.case_type = ''
  local.search = ''
  emit('update:modelValue', { ...local })
  emit('filter')
}
</script>

<style scoped lang="scss">
.case-filter-bar {
  padding: 24rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.04);
}

.filter-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.picker {
  flex: 1;
}

.picker-display {
  padding: 16rpx 20rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  color: #303133;
  font-size: 26rpx;
}

.search-row {
  display: flex;
  gap: 12rpx;
  align-items: center;
}

.search-input {
  flex: 1;
  height: 72rpx;
  padding: 0 20rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #303133;
}

.btn {
  padding: 0 24rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.btn.primary {
  background: #667eea;
  color: #fff;
}

.btn.ghost {
  background: #f0f2f5;
  color: #606266;
}
</style>
