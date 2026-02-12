<!-- @ts-nocheck -->
<template>
  <view class="panel plan-panel">
    <view class="panel-header">
      <text class="panel-title">{{ panelTitle }}</text>
      <view class="add-btn" @click="handleAdd">
        <SvgIcon name="plus" :size="28" color="#667eea" />
        <text class="add-text">新增</text>
      </view>
    </view>

    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="spinner" size="28" />
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="list.length === 0" class="empty-state">
      <text class="empty-text">暂无记录</text>
    </view>

    <view v-else class="panel-content">
      <view class="plan-list">
        <view
          v-for="item in list"
          :key="item.id"
          class="plan-item"
          :class="{ 'is-completed': item.is_completed }"
          @click="handleItemClick(item)"
        >
          <template v-if="isCollectionMode">
            <view class="plan-header">
              <text class="plan-title">总金额：{{ item.total_amount }} 万元</text>
              <text class="plan-sub">期数：{{ item.installment_count }}</text>
            </view>
            <view class="plan-time">
              <SvgIcon name="calendar" :size="24" color="#909399" />
              <text class="time-text">
                最近收款：{{ latestCollectionTime(item.installments) }}
              </text>
            </view>
          </template>
          <template v-else>
            <view class="plan-header">
              <view class="plan-info">
                <text class="plan-title" :class="{ 'is-completed': item.is_completed }">
                  {{ item.title || item.plan_content }}
                </text>
                <view class="plan-time">
                  <SvgIcon name="calendar" :size="24" color="#909399" />
                  <text class="time-text">{{ formatTime(item.time_points?.[0] || item.plan_time) }}</text>
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { getPlanList, getCollectionProgressList } from '@/api/client'
import type { ClientPlan } from '@/types/interfaces/client-plan'
import type { CollectionProgress, CollectionInstallment } from '@/types/interfaces/client-collection-progress'

interface Props {
  clientId: number | string
  salesStage?: string
}

const props = defineProps<Props>()

const list = ref<any[]>([])
const loading = ref(false)

const isCollectionMode = computed(() => props.salesStage === 'WON')

const panelTitle = computed(() => {
  if (props.salesStage === 'WON') return '收款进度'
  if (['BLANK', 'MEETING', 'FOLLOW_UP'].includes(props.salesStage || '')) return '有效交案'
  if (props.salesStage === 'CASE') return '办案计划'
  if (props.salesStage === 'PAYMENT') return '回款跟进'
  return '计划'
})

function formatTime(time: string | undefined) {
  if (!time) return '暂无时间'
  const date = dayjs(time)
  const now = dayjs()
  if (date.isSame(now, 'day')) return `今天 ${date.format('HH:mm')}`
  if (date.isSame(now.add(1, 'day'), 'day')) return `明天 ${date.format('HH:mm')}`
  return date.format('MM-DD HH:mm')
}

function latestCollectionTime(installments: CollectionInstallment[]) {
  const times = (installments || []).map(item => item.time).filter(Boolean) as string[]
  if (!times.length) return '暂无收款时间'
  const sorted = [...times].sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf())
  return formatTime(sorted[0])
}

function handleAdd() {
  uni.navigateTo({
    url: `/pages/other/customer/plan/edit?clientId=${props.clientId}&salesStage=${props.salesStage || ''}`
  })
}

function handleItemClick(item: ClientPlan | CollectionProgress) {
  if (isCollectionMode.value) {
    uni.navigateTo({
      url: `/pages/other/customer/plan/edit?clientId=${props.clientId}&salesStage=${props.salesStage || ''}&collectionId=${item.id}`
    })
    return
  }
  uni.navigateTo({
    url: `/pages/other/customer/plan/edit?id=${item.id}&clientId=${props.clientId}&salesStage=${props.salesStage || ''}`
  })
}

async function loadList() {
  if (loading.value) return
  loading.value = true
  try {
    if (isCollectionMode.value) {
      const res = await getCollectionProgressList(props.clientId as string)
      list.value = res.rows || []
    } else {
      const res = await getPlanList(props.clientId as string)
      const planType = getPlanType()
      list.value = (res.rows || []).filter((item: ClientPlan) => item.plan_type === planType)
    }
  } catch (error) {
    console.error('加载计划失败:', error)
  } finally {
    loading.value = false
  }
}

function getPlanType() {
  if (['BLANK', 'MEETING', 'FOLLOW_UP'].includes(props.salesStage || '')) return 'effective_case'
  if (props.salesStage === 'PAYMENT') return 'payment_followup'
  return 'case_plan'
}

watch(
  () => [props.clientId, props.salesStage],
  () => {
    loadList()
  },
  { immediate: true }
)

defineExpose({
  refresh: loadList
})
</script>

<style scoped lang="scss">
.panel {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.add-text {
  font-size: 26rpx;
  color: #667eea;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 30rpx;
  gap: 16rpx;
}

.loading-text {
  font-size: 26rpx;
  color: #667eea;
}

.empty-text {
  font-size: 26rpx;
  color: #909399;
}

.panel-content {
  padding: 30rpx;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.plan-item {
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  border-left: 4rpx solid #409EFF;

  &.is-completed {
    border-left-color: #67C23A;
    opacity: 0.6;
  }
}

.plan-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.plan-info {
  flex: 1;
}

.plan-title {
  font-size: 28rpx;
  color: #303133;
  font-weight: 500;
  line-height: 1.5;

  &.is-completed {
    text-decoration: line-through;
    color: #909399;
  }
}

.plan-sub {
  font-size: 24rpx;
  color: #909399;
}

.plan-time {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.time-text {
  font-size: 24rpx;
  color: #909399;
}
</style>
