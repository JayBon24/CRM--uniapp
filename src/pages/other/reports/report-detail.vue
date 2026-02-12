<template>
  <view class="report-detail-page">
    <!-- 页面头部 -->
    <view class="page-header" :style="{ paddingTop: headerPaddingTop + 'px' }">
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <text class="icon">←</text>
        </view>
        <view class="header-title">报告详情</view>
        <view class="header-action" @click="showActionSheet">
          <text class="action-icon">⋯</text>
        </view>
      </view>
    </view>

    <!-- 下拉刷新 -->
    <scroll-view
      class="scroll-container"
      :style="{ height: scrollViewHeight + 'px' }"
      scroll-y
      refresher-enabled
      refresher-default-style="black"
      refresher-background="#f5f6f8"
      :refresher-triggered="refresherTriggered"
      @refresherrefresh="onRefresh"
    >
      <!-- 加载状态 -->
      <view v-if="loading && !report" class="loading-container">
        <text>加载中...</text>
      </view>

      <!-- 错误状态 -->
      <view v-else-if="error" class="error-container">
        <text class="error-text">{{ error }}</text>
        <button class="retry-btn" @click="loadReport">重试</button>
      </view>

      <!-- 报告内容 -->
      <view v-else-if="report" class="content">
        <!-- 报告头部 -->
        <view class="report-header">
          <view class="report-title">{{ report.title }}</view>
          <view class="report-meta">
            <text class="meta-item">{{ getTypeText(report.type) }}</text>
            <text class="meta-divider">|</text>
            <text class="meta-item">{{ formatDate(report.createTime) }}</text>
          </view>
          <view class="report-status" :class="report.status">
            {{ getStatusText(report.status) }}
          </view>
        </view>

        <!-- 时间范围 -->
        <view class="info-card">
          <view class="info-label">统计周期</view>
          <view class="info-value">
            {{ report.timeRange.start }} 至 {{ report.timeRange.end }}
          </view>
        </view>

        <!-- 报告摘要 -->
        <view v-if="report.summary" class="summary-card">
          <view class="card-title">报告摘要</view>
          <view class="summary-text">{{ report.summary }}</view>
        </view>

        <!-- 指标数据 -->
        <view class="indicators-card">
          <view class="card-title">关键指标</view>
          <view class="indicators-grid">
            <view
              v-for="indicator in report.indicators"
              :key="indicator.type"
              class="indicator-item"
            >
              <view class="indicator-name">{{ getIndicatorName(indicator.type) }}</view>
              <view class="indicator-value">
                <text class="value">{{ indicator.value }}</text>
                <text class="unit">{{ indicator.unit }}</text>
              </view>
              <view v-if="indicator.trend" class="indicator-trend">
                <text class="trend-icon" :class="indicator.trend">
                  {{ indicator.trend === 'up' ? '↑' : indicator.trend === 'down' ? '↓' : '→' }}
                </text>
                <text class="trend-value">{{ Math.abs(indicator.trendPercent || 0) }}%</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 操作按钮 -->
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-container">
        <text class="empty-text">报告不存在</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, nextTick } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getReportDetail } from '@/api/reports'
import type { Report, ReportType, ReportStatus, IndicatorType } from '@/types/interfaces/reports'
import dayjs from 'dayjs'

// 页面参数
const reportId = ref<number>(0)
const headerPaddingTop = ref(0)
const scrollViewHeight = ref(0)
const baseStatusBar = uni.getSystemInfoSync?.().statusBarHeight || 0
headerPaddingTop.value = baseStatusBar
// #ifdef MP-WEIXIN
headerPaddingTop.value = baseStatusBar + 12
// #endif
const instance = getCurrentInstance()

const updateScrollHeight = () => {
  const systemInfo = uni.getSystemInfoSync?.() || {}
  const windowHeight = systemInfo.windowHeight || 0
  nextTick(() => {
    const query = uni.createSelectorQuery().in(instance?.proxy)
    query.select('.page-header').boundingClientRect((rect: any) => {
      const headerHeight = rect?.height || 0
      const targetHeight = windowHeight - headerHeight
      scrollViewHeight.value = targetHeight > 0 ? targetHeight : windowHeight
    }).exec()
  })
}

const refresherTriggered = ref(false)
const hasLoadedOnce = ref(false)

onLoad((options: any) => {
  if (options?.id) {
    reportId.value = Number(options.id)
  }
})

// 状态
const loading = ref(false)
const error = ref<string | null>(null)
const report = ref<Report | null>(null)

// 指标名称映射
const indicatorNames: Record<IndicatorType, string> = {
  lead_frequency: '跟进频次',
  new_customers: '新客户获取',
  conversion_rate: '有效线索转化率',
  visit_frequency: '客户拜访频次',
  key_customer_visit_ratio: '重点客户拜访占比',
  visit_success_rate: '拜访成功率',
  avg_conversation_duration: '单客户平均洽谈时长',
  visit_cycle: '客户拜访周期',
  conversion_funnel: '客户转化漏斗'
}

// 加载报告详情
const loadReport = async () => {
  if (!reportId.value) return

  try {
    loading.value = true
    error.value = null

    const response: any = await getReportDetail(reportId.value)
    report.value = response.data || response
  } catch (err: any) {
    error.value = err.message || '加载失败'
    console.error('加载报告详情失败:', err)
  } finally {
    loading.value = false
  }
}

// 刷新
const onRefresh = async () => {
  refresherTriggered.value = true
  await loadReport()
  refresherTriggered.value = false
}

// 导出报告

// 分享报告

// 显示操作菜单
const showActionSheet = () => {
  uni.showActionSheet({
    itemList: ['删除报告'],
    success: (res) => {
      if (res.tapIndex === 0) {
        confirmDelete()
      }
    }
  })
}

// 确认删除
const confirmDelete = () => {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，确定要删除这份报告吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '删除功能开发中',
          icon: 'none'
        })
      }
    }
  })
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 格式化日期
const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}

// 获取状态文本
const getStatusText = (status: ReportStatus) => {
  const statusMap: Record<ReportStatus, string> = {
    generating: '生成中',
    completed: '已完成',
    failed: '失败'
  }
  return statusMap[status] || status
}

// 获取类型文本
const getTypeText = (type: ReportType) => {
  return type === 'weekly' ? '周报' : '月报'
}

// 获取指标名称
const getIndicatorName = (type: IndicatorType) => {
  return indicatorNames[type] || type
}

// 生命周期
onMounted(() => {
  updateScrollHeight()
  refresherTriggered.value = true
  loadReport().finally(() => {
    refresherTriggered.value = false
    hasLoadedOnce.value = true
  })
})

onShow(() => {
  updateScrollHeight()
  if (!hasLoadedOnce.value && reportId.value) {
    refresherTriggered.value = true
    loadReport().finally(() => {
      refresherTriggered.value = false
      hasLoadedOnce.value = true
    })
  }
})
</script>

<style scoped lang="scss">
.report-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.back-btn {
  .icon {
    font-size: 24px;
    color: #333;
  }
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-action {
  .action-icon {
    font-size: 24px;
    color: #333;
  }
}

.scroll-container {
  min-height: 0;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px calc(60px + env(safe-area-inset-bottom));
}

.error-text,
.empty-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 8px 24px;
  background: #1890ff;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  border: none;
}

.content {
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.report-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  color: #fff;
}

.report-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.report-meta {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
  opacity: 0.9;

  .meta-divider {
    margin: 0 8px;
  }
}

.report-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
}

.info-card,
.summary-card,
.indicators-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
}

.info-value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.summary-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.indicator-item {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.indicator-name {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.indicator-value {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;

  .value {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }

  .unit {
    font-size: 12px;
    color: #999;
    margin-left: 4px;
  }
}

.indicator-trend {
  display: flex;
  align-items: center;
  font-size: 12px;

  .trend-icon {
    margin-right: 4px;

    &.up {
      color: #52c41a;
    }

    &.down {
      color: #ff4d4f;
    }

    &.stable {
      color: #faad14;
    }
  }

  .trend-value {
    color: #666;
  }
}


</style>
