<template>
  <view class="case-card" @click="handleClick">
    <view class="header">
      <text class="name">{{ caseItem.case_name || '-' }}</text>
      <view class="status">{{ caseItem.case_status || '-' }}</view>
    </view>
    <view class="meta">
      <text class="meta-item">编号：{{ caseItem.case_number || '-' }}</text>
      <text class="meta-item">类型：{{ caseItem.case_type || '-' }}</text>
    </view>
    <view class="meta">
      <text class="meta-item">客户：{{ caseItem.customer_name || '-' }}</text>
      <text class="meta-item">负责人：{{ handlerDisplay }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface CaseItem {
  id: number | string
  case_name?: string
  case_number?: string
  case_type?: string
  case_status?: string
  customer_name?: string
  owner_user_name?: string
  handler_names?: string[]
}

const props = defineProps<{
  caseItem: CaseItem
}>()

const emit = defineEmits<{
  (e: 'click', value: CaseItem): void
}>()

const handlerDisplay = computed(() => {
  if (props.caseItem.handler_names && props.caseItem.handler_names.length > 0) {
    return props.caseItem.handler_names.join('、')
  }
  return (props.caseItem.handler_names && props.caseItem.handler_names.length ? props.caseItem.handler_names.join("?") : (props.caseItem.owner_user_name || '-'))
})

function handleClick() {
  if (!props.caseItem?.id) {
    console.warn('案件卡片点击：案件ID无效', props.caseItem)
    return
  }
  emit('click', props.caseItem)
}
</script>

<style scoped lang="scss">
.case-card {
  padding: 24rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.status {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  background: #f0f2ff;
  color: #667eea;
  font-size: 22rpx;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  font-size: 24rpx;
  color: #606266;
}

.meta-item {
  flex: 1;
  min-width: 220rpx;
}
</style>
