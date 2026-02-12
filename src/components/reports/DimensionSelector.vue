<template>
  <view class="dimension-selector">
    <view class="selector-trigger" @click="handleTriggerClick">
      <view class="trigger-content">
        <text class="trigger-label">{{ currentLabel }}</text>
        <text class="trigger-icon">▼</text>
      </view>
    </view>

    <view v-if="showPopup" class="popup-overlay" @click="handleOverlayClick">
      <view class="popup-content" @click.stop="handleContentClick">
        <view class="popup-header">
          <view class="popup-title">选择{{ dimensionName }}</view>
          <view class="popup-close" @click="handleClose">✕</view>
        </view>
        
        <view class="popup-body">
          <view
            class="dimension-item"
            :class="{ active: !selectedId }"
            @click="handleSelectAll"
          >
            <view class="item-left">
              <view class="item-icon">📊</view>
              <view class="item-label">全部{{ dimensionName }}</view>
            </view>
            <view v-if="!selectedId" class="item-check">✓</view>
          </view>

          <view
            v-for="(item, index) in dimensionList"
            :key="index"
            class="dimension-item"
            :class="{ active: selectedId === item.id }"
            @click="handleSelectItem(item.id)"
          >
            <view class="item-left">
              <view class="item-avatar">{{ getFirstChar(item.label) }}</view>
              <view class="item-info">
                <view class="item-label">{{ item.label }}</view>
                <view v-if="item.value !== undefined" class="item-value">
                  {{ formatValue(item.value) }}
                </view>
              </view>
            </view>
            <view v-if="selectedId === item.id" class="item-check">✓</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DimensionType } from '@/types/interfaces/reports'

interface DimensionItem {
  id: string | number
  label: string
  value?: number
}

interface Props {
  dimensionType?: DimensionType
  dimensionList: DimensionItem[]
  selectedId?: string | number | null
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  dimensionType: 'NONE',
  selectedId: null,
  unit: ''
})

const emit = defineEmits<{
  select: [id: string | number | null]
}>()

const showPopup = ref(false)

const dimensionName = computed(() => {
  const names: Record<DimensionType, string> = {
    PERSONNEL: '人员',
    BRANCH: '分所',
    SOURCE: '来源',
    GRADE: '等级',
    NONE: ''
  }
  return names[props.dimensionType || 'NONE'] || ''
})

const currentLabel = computed(() => {
  if (!props.selectedId) {
    return `全部${dimensionName.value}`
  }
  const item = props.dimensionList.find(item => item.id === props.selectedId)
  return item?.label || `全部${dimensionName.value}`
})

const getFirstChar = (str: string): string => {
  return str ? str.charAt(0) : ''
}

const formatValue = (value: number): string => {
  if (props.unit === '%') {
    return `${value}%`
  }
  if (props.unit === '小时') {
    return `${value}小时`
  }
  return `${value}${props.unit}`
}

const handleTriggerClick = () => {
  showPopup.value = true
}

const handleSelectAll = () => {
  emit('select', null)
  showPopup.value = false
}

const handleSelectItem = (id: string | number) => {
  emit('select', id)
  showPopup.value = false
}

const handleClose = () => {
  showPopup.value = false
}

const handleOverlayClick = () => {
  showPopup.value = false
}

const handleContentClick = () => {
  // 阻止事件冒泡
}
</script>

<style scoped lang="scss">
.dimension-selector {
  position: relative;
}

.selector-trigger {
  padding: 0 32rpx 24rpx;
}

.trigger-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #fff;
  border-radius: 12rpx;
  border: 2rpx solid #e5e6eb;
}

.trigger-label {
  font-size: 28rpx;
  color: #1f2329;
  font-weight: 500;
}

.trigger-icon {
  font-size: 20rpx;
  color: #8f959e;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
  box-sizing: border-box;
}

.popup-content {
  width: 100%;
  max-height: 80vh;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding-bottom: calc(env(safe-area-inset-bottom) + 180rpx);
  box-sizing: border-box;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid #f7f8fa;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2329;
}

.popup-close {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #8f959e;
}

.popup-body {
  max-height: calc(80vh - 120rpx);
  overflow-y: auto;
  padding: 16rpx 32rpx calc(32rpx + env(safe-area-inset-bottom) + 220rpx);
}

.dimension-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #f7f8fa;
  border-radius: 16rpx;
}

.dimension-item.active {
  background: #e8f3ff;
  border: 2rpx solid #3370ff;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.item-icon {
  font-size: 36rpx;
}

.item-avatar {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 50%;
  font-size: 28rpx;
  font-weight: 600;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.item-label {
  font-size: 28rpx;
  color: #1f2329;
  font-weight: 500;
}

.item-value {
  font-size: 24rpx;
  color: #8f959e;
}

.item-check {
  font-size: 32rpx;
  color: #3370ff;
  font-weight: 600;
}
</style>
