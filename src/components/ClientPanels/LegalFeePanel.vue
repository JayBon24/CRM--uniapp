<!-- @ts-nocheck -->
<template>
  <view class="panel legal-fee-panel">
    <view class="panel-header">
      <view class="title-section">
        <text class="panel-title">律师费用</text>
        <view class="total-badge">
          累计：¥{{ formatAmount(totalAmount) }}
        </view>
      </view>
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
      <text class="empty-text">暂无律师费用记录</text>
    </view>

    <view v-else class="panel-content">
      <view class="fee-list">
        <view
          v-for="item in list"
          :key="item.id"
          class="fee-item"
          @click="handleItemClick(item)"
        >
          <view class="fee-header">
            <view class="amount">¥{{ formatAmount(item.amount) }}</view>
            <view class="status-badge">已支付</view>
          </view>

          <view class="fee-info">
            <view class="info-row">
              <SvgIcon name="calendar" :size="24" color="#909399" />
              <text class="time">{{ formatDate(item.payment_time) }}</text>
            </view>
            <view v-if="item.voucher_images && item.voucher_images.length > 0" class="info-row">
              <SvgIcon name="image" :size="24" color="#909399" />
              <text class="voucher-count">{{ item.voucher_images.length }}张凭证</text>
            </view>
          </view>

          <view v-if="item.remark" class="fee-remark">
            <text class="remark-text">{{ item.remark }}</text>
          </view>

          <view class="fee-footer">
            <text class="creator">录入人：{{ item.creator_name || '-' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import type { ClientLegalFee } from '@/types/interfaces/client-legal-fee'
import { getLegalFeeList } from '@/api/client'
import dayjs from 'dayjs'

interface Props {
  clientId: number | string
}

const props = defineProps<Props>()

const list = ref<ClientLegalFee[]>([])
const loading = ref(false)

const totalAmount = computed(() => {
  return list.value.reduce((sum, item) => sum + item.amount, 0)
})

function formatAmount(amount: number) {
  return (amount / 10000).toFixed(2) + '万'
}

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD')
}

function handleAdd() {
  uni.navigateTo({
    url: `/pages/other/customer/legal-fee/create?clientId=${props.clientId}`
  })
}

function handleItemClick(item: ClientLegalFee) {
  const payload = encodeURIComponent(JSON.stringify(item || {}))
  uni.navigateTo({
    url: `/pages/other/customer/legal-fee/detail?payload=${payload}`
  })
}

async function loadList() {
  if (loading.value) return

  loading.value = true
  try {
    const fees = await getLegalFeeList(props.clientId)
    
    // 转换后端数据格式到前端期望的格式
    list.value = fees.map((fee: any) => ({
      id: fee.id,
      amount: fee.amount || 0,
      payment_time: fee.payment_time || fee.pay_time || '',
      voucher_images: fee.voucher_images || fee.voucher_attachments || [],
      remark: fee.remark || '',
      creator_name: fee.creator_name || fee.created_by_name || '',
      client_id: fee.client_id || props.clientId,
      create_time: fee.create_time || fee.created_at || ''
    }))
  } catch (error) {
    console.error('加载律师费用失败:', error)
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

// 页面显示时刷新列表（用于创建成功后返回时刷新）
onShow(() => {
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

.title-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.total-badge {
  padding: 4rpx 12rpx;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%);
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #FF9800;
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

.fee-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.fee-item {
  padding: 24rpx;
  background: #FFF7E6;
  border-radius: 8rpx;
  border-left: 4rpx solid #FF9800;
}

.fee-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.amount {
  font-size: 36rpx;
  font-weight: 600;
  color: #FF9800;
}

.status-badge {
  padding: 4rpx 12rpx;
  background: #F0F9E8;
  border-radius: 6rpx;
  font-size: 24rpx;
  color: #67C23A;
}

.fee-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;
  color: #606266;
}

.fee-remark {
  padding: 12rpx;
  background: #fff;
  border-radius: 6rpx;
  margin-bottom: 16rpx;
}

.remark-text {
  font-size: 26rpx;
  color: #606266;
  line-height: 1.5;
}

.fee-footer {
  padding-top: 12rpx;
  border-top: 1rpx solid #F5DEBA;
  font-size: 24rpx;
  color: #909399;
}
</style>
