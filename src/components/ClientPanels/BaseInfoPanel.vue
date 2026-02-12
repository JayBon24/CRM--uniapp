<!-- @ts-nocheck -->
<template>
  <view class="panel base-info-panel">
    <view class="panel-header">
      <text class="panel-title">基础信息</text>
      <view class="edit-btn" @click="handleEdit">
        <u-icon name="edit-pen" size="18" color="#667eea" />
        <text class="edit-text">编辑</text>
      </view>
    </view>

    <view class="panel-content">
      <view class="info-grid">
        <view class="info-item">
          <text class="info-label">客户名称</text>
          <text class="info-value">{{ client.client_name || client.company_name || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">联系人</text>
          <text class="info-value">{{ client.contact_name || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">手机号</text>
          <text class="info-value phone">{{ client.mobile || client.phone || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">地址</text>
          <text class="info-value">{{ areaText }}</text>
        </view>

        <view class="info-item full">
          <text class="info-label">需求摘要</text>
          <text class="info-value">{{ client.demand_summary || client.requirement_summary || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">来源渠道</text>
          <text class="info-value">{{ client.source_channel || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">引荐人</text>
          <text class="info-value">{{ client.referrer || client.referrer_name || '-' }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">创建时间</text>
          <text class="info-value">{{ formatDate(client.create_time) }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">客户类别</text>
          <text class="info-value">{{ categoryLabel }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">最后成交时间</text>
          <text class="info-value">{{ formatDate(client.last_deal_time) }}</text>
        </view>

        <view class="info-item">
          <text class="info-label">创建人</text>
          <text class="info-value">{{ client.creator_name || '-' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed } from 'vue'
import type { ClientDetail } from '@/types/interfaces/client'
import dayjs from 'dayjs'
import { getCategoryLabel } from '@/utils/client-enums'

interface Props {
  client: ClientDetail
}

const props = defineProps<Props>()

const areaText = computed(() => {
  // 优先使用完整的 address 或 region 字段（客户详情页直接显示完整地址）
  const fullAddress = (props.client as any).address || (props.client as any).region
  if (fullAddress) {
    return fullAddress
  }
  
  // 如果没有完整地址，尝试从分离的字段拼接
  const parts = []
  if (props.client.province) parts.push(props.client.province)
  if (props.client.city) parts.push(props.client.city)
  if (props.client.district) parts.push(props.client.district)
  
  // 拼接详细地址
  const detailAddress = (props.client as any).detail_address
  if (detailAddress) {
    parts.push(detailAddress)
  }
  
  return parts.join(' ') || '-'
})

const categoryLabel = computed(() => {
  const category = (props.client as any).category || (props.client as any).client_category
  return getCategoryLabel(category) || '-'
})

function formatDate(date?: string) {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function handleEdit() {
  // 暂时跳转到新增客户页面（编辑模式）
  uni.navigateTo({
    url: `/pages/other/customer/create/index?id=${props.client.id}&mode=edit`
  })
}
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
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.edit-text {
  font-size: 26rpx;
  color: #667eea;
}

.panel-content {
  padding: 20rpx 30rpx 24rpx;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx 24rpx;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6rpx;

  &.full {
    grid-column: 1 / -1;
  }
}

.info-label {
  font-size: 24rpx;
  color: #909399;
}

.info-value {
  font-size: 28rpx;
  color: #303133;
  word-break: break-all;

  &.phone {
    color: #667eea;
    font-weight: 500;
  }
}
</style>
