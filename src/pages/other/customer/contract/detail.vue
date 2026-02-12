<!-- @ts-nocheck -->
<template>
  <view class="detail-page">
    <view v-if="!contract" class="empty">暂无合同详情</view>
    <view v-else class="content">
      <view class="header">
        <text class="title">{{ contract.contract_no || '合同详情' }}</text>
        <text class="amount">¥{{ formatAmount(contract.contract_amount) }}</text>
      </view>

      <view class="card">
        <view class="row">
          <text class="label">服务类型</text>
          <text class="value">{{ contract.service_type || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">客户主体</text>
          <text class="value">{{ contract.client_entity || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">合同期限</text>
          <text class="value">{{ formatPeriod(contract) }}</text>
        </view>
        <view v-if="contract.case_no" class="row">
          <text class="label">案件编号</text>
          <text class="value">{{ contract.case_no }}</text>
        </view>
      </view>

      <view class="card">
        <view class="row">
          <text class="label">创建时间</text>
          <text class="value">{{ formatDate(contract.create_time) }}</text>
        </view>
        <view class="row">
          <text class="label">附件数量</text>
          <text class="value">{{ contract.attachments?.length || 0 }}</text>
        </view>
      </view>
      <view v-if="contract.attachments && contract.attachments.length > 0" class="card attachments-section">
        <view class="section-title">附件 ({{ contract.attachments.length }})</view>
        <view class="attachment-grid">
          <view
            v-for="(file, index) in contract.attachments"
            :key="file.attachment_id || file.url || index"
            class="attachment-item"
            @click="handleAttachmentClick(file.url)"
          >
            <text class="attachment-name" :title="file.name">{{ file.name }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import { getAttachmentUrl, openAttachmentDocument } from '@/utils/attachment'

const contract = ref(null)

function formatAmount(amount) {
  if (!amount) return '0.00'
  return (Number(amount) / 10000).toFixed(2) + '万'
}

function formatPeriod(item) {
  if (!item?.start_date || !item?.end_date) return '-'
  return `${dayjs(item.start_date).format('YYYY-MM-DD')} 至 ${dayjs(item.end_date).format('YYYY-MM-DD')}`
}

function formatDate(date) {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD')
}

function handleAttachmentClick(file) {
  const url = getAttachmentUrl(file)
  if (!url) {
    uni.showToast({ title: '附件地址无效', icon: 'none' })
    return
  }
  openAttachmentDocument(url)
}

onLoad((options) => {
  if (options?.payload) {
    try {
      contract.value = JSON.parse(decodeURIComponent(options.payload))
    } catch (error) {
      contract.value = null
    }
  }
})
</script>

<style scoped lang="scss">
.detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24rpx;
  box-sizing: border-box;
}

.empty {
  text-align: center;
  color: #909399;
  padding: 120rpx 0;
}

.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 600;
  color: #303133;
}

.amount {
  font-size: 32rpx;
  color: #667eea;
  font-weight: 600;
}

.card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.attachments-section {
  padding-top: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 14rpx;
}

.attachment-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.attachment-item {
  flex: 1 0 28%;
  min-width: 140rpx;
  padding: 16rpx;
  border-radius: 10rpx;
  background: #F5F7FA;
  border: 1rpx solid #EBEEF5;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.attachment-name {
  font-size: 24rpx;
  color: #409EFF;
  line-height: 1.4;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f2f5;
}

.row:last-child {
  border-bottom: none;
}

.label {
  color: #909399;
  font-size: 26rpx;
}

.value {
  color: #303133;
  font-size: 26rpx;
}
</style>

