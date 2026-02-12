<!-- @ts-nocheck -->
<template>
  <view class="client-detail-header">
    <view class="header-top">
      <view class="client-name-section">
        <text class="client-name">{{ client.client_name || client.company_name }}</text>
        <text v-if="client.short_name" class="short-name">（{{ client.short_name }}）</text>
      </view>
      
      <!-- 只显示状态：公海、商机、跟进、交案、回款、赢单（不显示生命周期等文案） -->
      <view class="status-badges">
        <SalesStageTag :stage="displayStage" size="small" />
      </view>
    </view>

    <view class="header-info">
      <view class="info-row">
        <view class="info-item">
          <text class="label">客户类别：</text>
          <view v-if="client.category" class="category-badge" :style="categoryStyle">
            {{ categoryLabel }}
          </view>
          <text v-else class="value">-</text>
        </view>
        <view class="info-item">
          <text class="label">客户等级：</text>
          <view class="grade-badge" :class="`grade-${client.grade}`">
            {{ gradeLabel }}
          </view>
          <text v-if="client.grade_source === 'manual'" class="source-tag">人工</text>
        </view>
      </view>

      <view class="info-row info-row-handlers">
        <text class="label">经办人：</text>
        <text class="value value-handlers">{{ ownerDisplay }}</text>
      </view>

      <view v-if="client.last_deal_time" class="info-row">
        <text class="label">最后成交时间：</text>
        <text class="value">{{ formatDateTime(client.last_deal_time) }}</text>
      </view>

      <view v-if="recycleReminder" class="info-row reminder-row">
        <text class="label">流入公海提醒：</text>
        <text class="value reminder-text">{{ recycleReminder }}</text>
      </view>

      <view v-if="showRecycleRisk" class="info-row risk-chip">
        <u-icon name="error-circle" size="18" color="#F56C6C" />
        <text class="risk-text">{{ recycleRiskText }}</text>
        <text v-if="client.recycle_deadline" class="deadline">
          （{{ formatDate(client.recycle_deadline) }}前需处理）
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed } from 'vue'
import type { ClientDetail } from '@/types/interfaces/client'
import { CLIENT_GRADE_MAP, getCategoryLabel, getCategoryStyle } from '@/utils/client-enums'
import SalesStageTag from '@/components/SalesStageTag/index.vue'
import dayjs from 'dayjs'

interface Props {
  client: ClientDetail
}

const props = defineProps<Props>()

// 详情页只展示一个状态（公海、商机、跟进、交案、回款、赢单），优先展业阶段，无则按 status 映射
const displayStage = computed(() => {
  const stage = props.client.sales_stage
  const status = props.client.status
  if (status === 'PUBLIC_POOL') return 'PUBLIC_POOL'
  if (stage) return stage
  if (status === 'FOLLOW_UP') return 'MEETING' // 跟进
  if (['CASE', 'PAYMENT', 'WON'].includes(status)) return status
  return 'BLANK'
})

const gradeLabel = computed(() => {
  return CLIENT_GRADE_MAP[props.client.grade]?.label || props.client.grade
})

const resolvedCategory = computed(() => {
  return props.client.category || (props.client as any).client_category || ''
})

const categoryLabel = computed(() => {
  return getCategoryLabel(resolvedCategory.value)
})

const categoryStyle = computed(() => {
  if (!resolvedCategory.value) return {}
  return getCategoryStyle(resolvedCategory.value as any)
})

const ownerDisplay = computed(() => {
  // 多经办人：兼容 handler_names / handlerNames（后端可能返回 snake_case 或 camelCase）
  const rawNames = props.client.handler_names ?? (props.client as any).handlerNames
  const namesArr = Array.isArray(rawNames) && rawNames.length > 0
    ? rawNames.map((s: any) => String(s ?? '').trim()).filter(Boolean)
    : typeof rawNames === 'string' && String(rawNames).trim()
      ? String(rawNames).split(/[、,，;；]/).map((s: string) => s.trim()).filter(Boolean)
      : []
  if (namesArr.length > 0) return namesArr.join('、')
  const handlers = (props.client as any).handlers
  if (Array.isArray(handlers) && handlers.length > 0) {
    const fromHandlers = handlers.map((h: any) => (h && (h.name || h.username)) || '').filter(Boolean)
    if (fromHandlers.length > 0) return fromHandlers.join('、')
  }
  if (props.client.owner_user_name) return props.client.owner_user_name
  if ((props.client as any).owner_name) return (props.client as any).owner_name
  if (props.client.owner_user_id) return `ID:${props.client.owner_user_id}`
  return '-'
})

const showRecycleRisk = computed(() => {
  return props.client.recycle_risk_level && props.client.recycle_risk_level !== 'low'
})

const parseDeadline = (deadline: string) => {
  const normalized = (deadline || '').replace(/\//g, '-').trim()
  const formats = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm']
  let parsed = dayjs(normalized, formats, true)
  if (!parsed.isValid()) {
    parsed = dayjs(deadline)
  }
  return parsed.isValid() ? parsed : null
}

const recycleReminder = computed(() => {
  const deadline = props.client.recycle_deadline
  if (!deadline) return ''
  const end = parseDeadline(deadline)
  if (!end) return ''
  const days = end.startOf('day').diff(dayjs().startOf('day'), 'day')
  if (days < 0) return `已超期${Math.abs(days)}天`
  return `剩余${days}天`
})

const recycleRiskText = computed(() => {
  const riskMap = {
    high: '高风险回收',
    medium: '中风险回收',
    low: '低风险'
  }
  return riskMap[props.client.recycle_risk_level || 'low'] || ''
})

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD')
}

function formatDateTime(date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}
</script>

<style scoped lang="scss">
.client-detail-header {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #5f72be 0%, #8a70d6 100%);
  padding: 30rpx 30rpx 40rpx;
  color: #fff;
}

.client-detail-header::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%);
  pointer-events: none;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.client-name-section {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}

.client-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
}

.short-name {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.status-badges {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.badge {
  padding: 8rpx 16rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 500;
}

.badge.status {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.2);
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 26rpx;

  &.info-row-handlers {
    align-items: flex-start;
  }

  &.risk-chip {
    align-self: flex-start;
    background: #FFF5F5;
    border: 1rpx solid #FFD6D6;
    border-radius: 999rpx;
    padding: 8rpx 16rpx;
    gap: 8rpx;
  }
}

.value-handlers {
  flex: 1;
  word-break: break-all;
  line-height: 1.4;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.label {
  color: rgba(255, 255, 255, 0.8);
}

.value {
  color: #fff;
  font-weight: 500;
}

.reminder-text {
  color: #FEF0F0;
  font-weight: 600;
}

.grade-badge {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 600;
  
  &.grade-A {
    background: rgba(255, 215, 0, 0.3);
    color: #FFD700;
  }
  
  &.grade-B {
    background: rgba(64, 158, 255, 0.3);
    color: #409EFF;
  }
  
  &.grade-C {
    background: rgba(103, 194, 58, 0.3);
    color: #67C23A;
  }
  
  &.grade-D {
    background: rgba(144, 147, 153, 0.3);
    color: #909399;
  }
}

.category-badge {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.source-tag {
  padding: 2rpx 8rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4rpx;
  font-size: 20rpx;
  color: #fff;
}

.risk-text {
  font-weight: 600;
  color: #F56C6C;
}

.deadline {
  font-size: 24rpx;
  color: #FA8C8C;
}
</style>
