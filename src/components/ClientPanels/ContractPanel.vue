<!-- @ts-nocheck -->
<template>
  <view class="panel contract-panel">
    <view class="panel-header">
      <text class="panel-title">合同与案件</text>
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
      <text class="empty-text">暂无合同记录</text>
    </view>

    <view v-else class="panel-content">
      <view class="contract-list">
        <view
          v-for="item in list"
          :key="item.id"
          class="contract-item"
          @click="handleItemClick(item)"
        >
          <view class="contract-header">
            <text class="contract-no">{{ item.contract_no }}</text>
            <view class="amount-badge">
              ¥{{ formatAmount(item.contract_amount) }}
            </view>
          </view>

          <view class="contract-info">
            <view class="info-row">
              <text class="label">服务类型：</text>
              <text class="value">{{ item.service_type || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="label">客户主体：</text>
              <text class="value">{{ item.client_entity || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="label">合同期限：</text>
              <text class="value">{{ formatPeriod(item) }}</text>
            </view>
          </view>

          <view v-if="item.case_no" class="case-info">
            <view class="case-badge">
              <SvgIcon name="file" :size="24" color="#667eea" />
              <text class="case-text">案件编号：{{ item.case_no }}</text>
            </view>
          </view>

          <view class="contract-footer">
            <text class="time">{{ formatDate(item.create_time) }}</text>
            <view class="attachments">
              <SvgIcon name="attachment" :size="24" color="#909399" />
              <text class="count">{{ item.attachments?.length || 0 }}个附件</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted } from 'vue'
import type { ClientContract } from '@/types/interfaces/client-contract'
import { getContractList } from '@/api/client'
import dayjs from 'dayjs'

interface Props {
  clientId: number | string
}

const props = defineProps<Props>()

const list = ref<ClientContract[]>([])
const loading = ref(false)

function formatAmount(amount: number) {
  return (amount / 10000).toFixed(2) + '万'
}

function formatPeriod(contract: ClientContract) {
  if (!contract.start_date || !contract.end_date) return '-'
  return `${dayjs(contract.start_date).format('YYYY-MM-DD')} 至 ${dayjs(contract.end_date).format('YYYY-MM-DD')}`
}

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD')
}

function handleAdd() {
  uni.navigateTo({
    url: `/pages/other/customer/contract/confirm?clientId=${props.clientId}`
  })
}

function handleItemClick(item: ClientContract) {
  const payload = encodeURIComponent(JSON.stringify(item || {}))
  uni.navigateTo({
    url: `/pages/other/customer/contract/detail?payload=${payload}`
  })
}

async function loadList() {
  if (loading.value) return

  loading.value = true
  try {
    const contracts = await getContractList(props.clientId)
    
    // 转换后端数据格式到前端期望的格式
    list.value = contracts.map((contract: any) => ({
      id: contract.id,
      contract_no: contract.contract_no || '',
      contract_amount: contract.contract_amount || contract.amount || 0,
      service_type: contract.service_type || '',
      client_entity: contract.client_entity || contract.client_subject || '',
      start_date: contract.start_date || '',
      end_date: contract.end_date || '',
      case_no: contract.case_no || '',
      attachments: contract.attachments || [],
      create_time: contract.create_time || contract.created_at || '',
      client_id: contract.client_id || props.clientId
    }))
  } catch (error) {
    console.error('加载合同记录失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadList()
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

.loading-text,
.empty-text {
  font-size: 26rpx;
  color: #909399;
}

.panel-content {
  padding: 30rpx;
}

.contract-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.contract-item {
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  border-left: 4rpx solid #667eea;
}

.contract-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.contract-no {
  font-size: 30rpx;
  font-weight: 600;
  color: #303133;
}

.amount-badge {
  padding: 6rpx 16rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 6rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #667eea;
}

.contract-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.info-row {
  display: flex;
  align-items: baseline;
  font-size: 26rpx;
}

.label {
  color: #909399;
  flex-shrink: 0;
}

.value {
  color: #606266;
  word-break: break-all;
}

.case-info {
  margin-bottom: 16rpx;
}

.case-badge {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: #E6F4FF;
  border-radius: 6rpx;
}

.case-text {
  font-size: 24rpx;
  color: #409EFF;
  font-weight: 500;
}

.contract-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16rpx;
  border-top: 1rpx solid #EBEEF5;
}

.time {
  font-size: 24rpx;
  color: #909399;
}

.attachments {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.count {
  font-size: 24rpx;
  color: #909399;
}
</style>
