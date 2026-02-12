<!-- @ts-nocheck -->
<template>
  <view class="detail-page">
    <view v-if="!fee" class="empty">暂无律师费详情</view>
    <view v-else class="content">
      <view class="header">
        <text class="title">律师费详情</text>
        <text class="amount">¥{{ formatAmount(fee.amount) }}</text>
      </view>

      <view class="card">
        <view class="row">
          <text class="label">支付时间</text>
          <text class="value">{{ formatDate(fee.payment_time) }}</text>
        </view>
        <view class="row">
          <text class="label">凭证数量</text>
          <text class="value">{{ fee.voucher_images?.length || 0 }}</text>
        </view>
      </view>

      <view v-if="fee.remark" class="card">
        <view class="row">
          <text class="label">备注</text>
          <text class="value">{{ fee.remark }}</text>
        </view>
      </view>

      <view class="card">
        <view class="row">
          <text class="label">录入人</text>
          <text class="value">{{ fee.creator_name || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">创建时间</text>
          <text class="value">{{ formatDate(fee.create_time) }}</text>
        </view>
      </view>
      <view v-if="fee.voucher_attachments && fee.voucher_attachments.length > 0" class="card attachments-section">
        <view class="section-title">凭证附件 ({{ fee.voucher_attachments.length }})</view>
        <view class="attachment-grid">
          <view
            v-for="(file, index) in fee.voucher_attachments"
            :key="file.attachment_id || file.url || index"
            class="attachment-item"
            @click="handleAttachmentClick(file)"
          >
            <text class="attachment-name" :title="file.name">{{ file.name || '附件' }}</text>
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

const fee = ref(null)

function formatAmount(amount) {
  if (!amount) return '0.00'
  return (Number(amount) / 10000).toFixed(2) + '万'
}

function formatDate(date) {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD')
}

onLoad((options) => {
  if (options?.payload) {
    try {
      fee.value = JSON.parse(decodeURIComponent(options.payload))
    } catch (error) {
      fee.value = null
    }
  }
})

function handleAttachmentClick(file) {
  const url = getAttachmentUrl(file)
  if (!url) {
    uni.showToast({ title: '附件地址无效', icon: 'none' })
    return
  }
  openAttachmentDocument(url)
}
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
  color: #ff9800;
  font-weight: 600;
}

.card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
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
</style>

