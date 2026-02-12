<!-- @ts-nocheck -->
<template>
  <view class="panel payment-panel">
    <view class="panel-header">
      <view class="title-section">
        <text class="panel-title">回款记录</text>
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
      <text class="empty-text">暂无回款记录</text>
    </view>

    <view v-else class="panel-content">
      <view class="payment-list">
        <view
          v-for="item in list"
          :key="item.id"
          class="payment-item"
          @click="handleItemClick(item)"
        >
          <view class="payment-header">
            <view class="amount">¥{{ formatAmount(item.amount) }}</view>
            <view class="category-badge" :class="`category-${item.collection_category}`">
              {{ collectionLabel(item.collection_category) }}
            </view>
          </view>

          <view class="payment-info">
            <view class="info-row">
              <SvgIcon name="calendar" :size="24" color="#909399" />
              <text class="time">{{ formatDate(item.payment_time) }}</text>
            </view>
            <view v-if="item.voucher_images && item.voucher_images.length > 0" class="info-row">
              <SvgIcon name="image" :size="24" color="#909399" />
              <text class="voucher-count">{{ item.voucher_images.length }}张凭证</text>
            </view>
          </view>

          <view v-if="item.remark" class="payment-remark">
            <text class="remark-text">{{ item.remark }}</text>
          </view>

          <view class="payment-footer">
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
import type { ClientPayment } from '@/types/interfaces/client-payment'
import { getPaymentList } from '@/api/client'
import dayjs from 'dayjs'

interface Props {
  clientId: number | string
}

const props = defineProps<Props>()

const list = ref<ClientPayment[]>([])
const loading = ref(false)

const totalAmount = computed(() => {
  return list.value.reduce((sum, item) => sum + item.amount, 0)
})

function formatAmount(amount: number) {
  return (amount / 10000).toFixed(2) + '万'
}

function collectionLabel(category: string) {
  const map = {
    arbitration: '仲裁',
    mediation: '调解',
    litigation: '诉讼'
  }
  return map[category] || category
}

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD')
}

function handleAdd() {
  uni.navigateTo({
    url: `/pages/other/customer/payment/create?clientId=${props.clientId}`
  })
}

function handleItemClick(item: ClientPayment) {
  const payload = encodeURIComponent(JSON.stringify(item || {}))
  uni.navigateTo({
    url: `/pages/other/customer/payment/detail?payload=${payload}`
  })
}

async function loadList() {
  if (loading.value) return

  loading.value = true
  try {
    const payments = await getPaymentList(props.clientId)
    
    // 转换后端数据格式到前端期望的格式
    list.value = payments.map((payment: any) => ({
      id: payment.id,
      amount: payment.amount || 0,
      payment_time: payment.payment_time || payment.pay_time || '',
      collection_category: payment.collection_category || 'arbitration',
      voucher_images: payment.voucher_images || payment.voucher_attachments || [],
      remark: payment.remark || '',
      creator_name: payment.creator_name || payment.created_by_name || '',
      client_id: payment.client_id || props.clientId,
      create_time: payment.create_time || payment.created_at || ''
    }))
  } catch (error) {
    console.error('加载回款记录失败:', error)
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
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #667eea;
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

.payment-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.payment-item {
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  border-left: 4rpx solid #67C23A;
}

.payment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.amount {
  font-size: 36rpx;
  font-weight: 600;
  color: #67C23A;
}

.category-badge {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;

  &.category-arbitration {
    background: #E6F4FF;
    color: #409EFF;
  }

  &.category-mediation {
    background: #F0F9E8;
    color: #67C23A;
  }

  &.category-litigation {
    background: #FFF7E6;
    color: #E6A23C;
  }
}

.payment-info {
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

.payment-remark {
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

.payment-footer {
  padding-top: 12rpx;
  border-top: 1rpx solid #EBEEF5;
  font-size: 24rpx;
  color: #909399;
}
</style>
