<template>
  <u-popup
    :show="show"
    mode="bottom"
    :round="18"
    :safe-area-inset-bottom="true"
    @close="handleClose"
  >
    <view class="quick-action-sheet">
      <view class="sheet-title">选择操作</view>
      <view class="sheet-subtitle">{{ stageLabel }}</view>
      <view class="action-list">
        <view
          v-for="item in actionOptions"
          :key="item.type"
          class="action-item"
          @click="handleSelect(item.type)"
        >
          <text class="action-item__text">{{ item.label }}</text>
        </view>
      </view>
      <view class="cancel-btn" @click="handleClose">取消</view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { QuickActionType, SalesStage } from '@/types/interfaces/client'

interface Props {
  show: boolean
  stage: SalesStage
  mode?: 'sales' | 'manager'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  select: [value: QuickActionType]
}>()

const stageLabel = computed(() => {
  const modeLabel = props.mode === 'manager' ? '查看模式' : '执行模式'
  if (props.stage === 'CASE') return `当前阶段：交案（${modeLabel}）`
  if (props.stage === 'PAYMENT') return `当前阶段：回款（${modeLabel}）`
  if (props.stage === 'WON') return `当前阶段：赢单（${modeLabel}）`
  if (props.stage === 'MEETING') return `当前阶段：跟进（${modeLabel}）`
  return `当前阶段：商机（${modeLabel}）`
})

const actionOptions = computed<Array<{ type: QuickActionType; label: string }>>(() => {
  const managerMode = props.mode === 'manager'
  if (props.stage === 'CASE') {
    return [
      { type: 'FOLLOWUP_RECORD', label: managerMode ? '查看跟进记录' : '跟进记录' },
      { type: 'CASE_PLAN', label: managerMode ? '查看交案' : '办案计划' },
      { type: managerMode ? 'CONFIRM_CONTRACT' : 'ADD_PAYMENT', label: managerMode ? '查看合同' : '录入回款' }
    ]
  }
  if (props.stage === 'PAYMENT') {
    return [
      { type: 'FOLLOWUP_RECORD', label: managerMode ? '查看跟进记录' : '跟进记录' },
      { type: 'PAYMENT_FOLLOWUP', label: managerMode ? '查看回款' : '回款跟进' },
      { type: managerMode ? 'CONFIRM_CONTRACT' : 'ADD_LEGAL_FEE', label: managerMode ? '查看合同' : '录入律师费' }
    ]
  }
  if (props.stage === 'WON') {
    return [
      { type: 'FOLLOWUP_RECORD', label: managerMode ? '查看跟进记录' : '跟进记录' },
      { type: 'COLLECTION_PROGRESS', label: managerMode ? '查看收款进度' : '收款进度' },
      { type: 'CONFIRM_CONTRACT', label: managerMode ? '查看合同' : '确认合同' }
    ]
  }
  return [
    { type: 'FOLLOWUP_RECORD', label: managerMode ? '查看跟进记录' : '跟进记录' },
    { type: 'VALID_CASE', label: managerMode ? '查看交案' : '有效交案' },
    { type: 'CONFIRM_CONTRACT', label: managerMode ? '查看合同' : '确认合同' }
  ]
})

function handleClose() {
  emit('update:show', false)
}

function handleSelect(action: QuickActionType) {
  emit('update:show', false)
  emit('select', action)
}
</script>

<style scoped lang="scss">
.quick-action-sheet {
  padding: 28rpx 24rpx 24rpx;
}

.sheet-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1f2937;
}

.sheet-subtitle {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.action-list {
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.action-item {
  height: 90rpx;
  border-radius: 16rpx;
  background: #f5f7fb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-item__text {
  font-size: 30rpx;
  color: #1d4ed8;
  font-weight: 600;
}

.cancel-btn {
  margin-top: 20rpx;
  height: 88rpx;
  border-radius: 16rpx;
  background: #fff;
  border: 1rpx solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #4b5563;
}
</style>
