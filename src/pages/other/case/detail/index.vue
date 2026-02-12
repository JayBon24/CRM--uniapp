<!-- @ts-nocheck -->
<template>
  <view class="detail-page">
    <view v-if="loading" class="loading-box">
      <u-loading-icon mode="spinner" size="28" />
      <text class="loading-text">加载中...</text>
    </view>
    <view v-else-if="!caseDetail" class="empty">暂无案件详情</view>
    <view v-else class="content">
      <view class="header">
        <text class="title">{{ caseDetail.case_name || '案件详情' }}</text>
        <view class="status">{{ caseDetail.case_status || '-' }}</view>
      </view>

      <view class="card">
        <view class="row">
          <text class="label">案件编号</text>
          <text class="value">{{ caseDetail.case_number || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">案件类型</text>
          <text class="value">{{ caseDetail.case_type || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">客户</text>
          <text class="value">{{ caseDetail.customer_name || '-' }}</text>
        </view>
          <view class="row">
            <text class="label">经办人</text>
            <text class="value">{{ handlerDisplay }}</text>
          </view>
        <view class="row">
          <text class="label">创建时间</text>
          <text class="value">{{ formatDate(caseDetail.create_datetime) }}</text>
        </view>
      </view>

      <view class="card">
        <view class="section-title">案件描述</view>
        <text class="paragraph">{{ caseDetail.case_description || '暂无' }}</text>
      </view>

      <view class="card">
        <view class="section-title">原告信息</view>
        <view class="row">
          <text class="label">名称</text>
          <text class="value">{{ caseDetail.plaintiff_name || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">信用代码</text>
          <text class="value">{{ caseDetail.plaintiff_credit_code || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">地址</text>
          <text class="value">{{ caseDetail.plaintiff_address || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">法定代表人</text>
          <text class="value">{{ caseDetail.plaintiff_legal_representative || '-' }}</text>
        </view>
      </view>

      <view class="card">
        <view class="section-title">被告信息</view>
        <view class="row">
          <text class="label">名称</text>
          <text class="value">{{ caseDetail.defendant_name || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">信用代码</text>
          <text class="value">{{ caseDetail.defendant_credit_code || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">地址</text>
          <text class="value">{{ caseDetail.defendant_address || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">法定代表人</text>
          <text class="value">{{ caseDetail.defendant_legal_representative || '-' }}</text>
        </view>
      </view>

      <view class="card">
        <view class="section-title">金额与诉讼信息</view>
        <view class="row">
          <text class="label">合同金额</text>
          <text class="value">{{ formatAmount(caseDetail.contract_amount) }}</text>
        </view>
        <view class="row">
          <text class="label">律师费</text>
          <text class="value">{{ formatAmount(caseDetail.lawyer_fee) }}</text>
        </view>
        <view class="row">
          <text class="label">诉讼请求</text>
          <text class="value">{{ caseDetail.litigation_request || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">事实与理由</text>
          <text class="value">{{ caseDetail.facts_and_reasons || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">管辖法院</text>
          <text class="value">{{ caseDetail.jurisdiction || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">立案日期</text>
          <text class="value">{{ caseDetail.filing_date || '-' }}</text>
        </view>
        <view class="row">
          <text class="label">申请人</text>
          <text class="value">{{ caseDetail.petitioner || '-' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import { computed } from 'vue'
import { getCaseDetail } from '@/api/case'

const caseDetail = ref<any>(null)
const handlerDisplay = computed(() => {
  if (caseDetail.value?.handler_names && caseDetail.value.handler_names.length > 0) {
    return caseDetail.value.handler_names.join('、')
  }
  return (caseDetail.value?.handler_names && caseDetail.value.handler_names.length ? caseDetail.value.handler_names.join("?") : (caseDetail.value?.owner_user_name || '-'))
})
const loading = ref(false)

function formatDate(value?: string) {
  if (!value) return '-'
  return dayjs(value).format('YYYY-MM-DD')
}

function formatAmount(value?: number) {
  if (!value) return '-'
  return Number(value).toFixed(2)
}

async function loadDetail(id: string | number) {
  loading.value = true
  try {
    const res = await getCaseDetail(id)
    caseDetail.value = res.data || res
  } catch (error) {
    console.error('加载案件详情失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onLoad((options: any) => {
  if (options?.id) {
    loadDetail(options.id)
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

.loading-box {
  padding: 120rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.loading-text {
  color: #909399;
  font-size: 26rpx;
}

.empty {
  text-align: center;
  color: #909399;
  padding: 120rpx 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  gap: 12rpx;
}

.title {
  font-size: 34rpx;
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

.card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16rpx;
}

.paragraph {
  color: #606266;
  font-size: 26rpx;
  line-height: 1.6;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f2f5;
  gap: 16rpx;
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
  text-align: right;
  flex: 1;
}
</style>
