<template>
  <view class="report-center-page">
    <!-- 页面头部 -->
    <view class="page-header" :style="{ paddingTop: headerPaddingTop + 'px' }">
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <text class="icon">←</text>
        </view>
        <view class="header-title">报告中心</view>
        <view class="header-action" @click="showGenerateDialog">
          <text class="action-text">生成报告</text>
        </view>
      </view>
    </view>

    <!-- 下拉刷新 -->
    <scroll-view
      class="scroll-container"
      :style="{ height: scrollViewHeight + 'px' }"
      scroll-y
      refresher-enabled
      :refresher-triggered="loading"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
    >
      <!-- 加载状态 -->
      <view v-if="loading && reports.length === 0" class="loading-container">
        <text>加载中...</text>
      </view>

      <!-- 错误状态 -->
      <view v-else-if="error" class="error-container">
        <text class="error-text">{{ error }}</text>
        <button class="retry-btn" @click="loadReports">重试</button>
      </view>

      <!-- 报告列表 -->
      <view v-else-if="reports.length > 0" class="content">
        <view
          v-for="report in reports"
          :key="report.id"
          class="report-card"
          @click="viewReport(report.id)"
        >
          <view class="report-header">
            <view class="report-title">{{ report.title }}</view>
            <view class="report-status" :class="report.status">
              {{ getStatusText(report.status) }}
            </view>
          </view>
          
          <view class="report-meta">
            <text class="meta-item">{{ getTypeText(report.type) }}</text>
            <text class="meta-divider">|</text>
            <text class="meta-item">{{ formatDate(report.createTime) }}</text>
          </view>

          <view v-if="report.summary" class="report-summary">
            {{ report.summary }}
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="hasMore" class="load-more">
          <text>{{ loadingMore ? '加载中...' : '上拉加载更多' }}</text>
        </view>
        <view v-else class="no-more">
          <text>没有更多了</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-container">
        <text class="empty-icon">📊</text>
        <text class="empty-text">暂无报告</text>
        <button class="generate-btn" @click="showGenerateDialog">生成报告</button>
      </view>
    </scroll-view>

    <!-- 生成报告弹窗 -->
    <view v-if="showDialog" class="dialog-mask" @click="hideGenerateDialog">
      <view class="dialog-content" @click.stop>
        <view class="dialog-title">生成报告</view>
        
        <view class="dialog-form">
          <view class="form-item">
            <text class="form-label">报告类型</text>
            <view class="form-options">
              <view
                v-for="type in reportTypes"
                :key="type.value"
                class="form-option"
                :class="{ active: generateForm.type === type.value }"
                @click="onReportTypeChange(type.value)"
              >
                {{ type.label }}
              </view>
            </view>
          </view>

          <view class="form-item">
            <text class="form-label">开始日期</text>
            <picker
              mode="date"
              :value="generateForm.startDate"
              @change="onStartDateChange"
            >
              <view class="date-picker-box">
                <text class="date-picker-text">{{ generateForm.startDate || '请选择日期' }}</text>
                <text class="picker-icon">📅</text>
              </view>
            </picker>
          </view>
          
          <view class="form-item">
            <text class="form-label">结束日期</text>
            <view class="date-display-box">
              <text class="date-display-text">{{ generateForm.endDate || '请先选择开始日期' }}</text>
              <text class="date-auto-hint">（自动计算）</text>
            </view>
          </view>
        </view>

        <view class="dialog-actions">
          <button class="dialog-btn cancel" @click="hideGenerateDialog">取消</button>
          <button class="dialog-btn confirm" @click="generateReport">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance, nextTick } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getReportList, generateReport as apiGenerateReport } from '@/api/reports'
import type { Report, ReportType, ReportStatus } from '@/types/interfaces/reports'
import dayjs from 'dayjs'

// 状态
const loading = ref(false)
const loadingMore = ref(false)
const error = ref<string | null>(null)
const reports = ref<Report[]>([])
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const showDialog = ref(false)
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

// 生成报告表单
const generateForm = reactive({
  type: 'weekly' as ReportType,
  startDate: '',
  endDate: ''
})

// 报告类型选项
const reportTypes = [
  { label: '周报', value: 'weekly' as ReportType },
  { label: '月报', value: 'monthly' as ReportType }
]

// 加载报告列表
const loadReports = async (isRefresh = false) => {
  if (isRefresh) {
    page.value = 1
    reports.value = []
    hasMore.value = true
  }

  if (!hasMore.value) return

  try {
    loading.value = isRefresh
    loadingMore.value = !isRefresh

    const response: any = await getReportList({
      page: page.value,
      pageSize
    })

    const data = response.data || response
    const newReports = data.rows || []
    
    if (isRefresh) {
      reports.value = newReports
    } else {
      reports.value = [...reports.value, ...newReports]
    }

    hasMore.value = reports.value.length < (data.total || 0)
    error.value = null
  } catch (err: any) {
    error.value = err.message || '加载失败'
    console.error('加载报告列表失败:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    page.value++
    loadReports()
  }
}

// 刷新
const onRefresh = async () => {
  await loadReports(true)
}

// 查看报告详情
const viewReport = (id: number) => {
  uni.navigateTo({
    url: `/pages/other/reports/report-detail?id=${id}`
  })
}


const showGenerateDialog = () => {
  console.log('=== showGenerateDialog 被调用 ===')
  // 设置默认时间范围
  const end = dayjs()
  const start = end.subtract(7, 'day')
  generateForm.startDate = start.format('YYYY-MM-DD')
  generateForm.endDate = end.format('YYYY-MM-DD')
  console.log('设置时间范围:', generateForm.startDate, '到', generateForm.endDate)
  showDialog.value = true
  console.log('showDialog.value =', showDialog.value)
}

// 隐藏生成报告弹窗
const hideGenerateDialog = () => {
  showDialog.value = false
}

// 开始日期变更时，自动计算结束日期
const onStartDateChange = (e?: any) => {
  const value = e?.detail?.value || generateForm.startDate
  if (!value) return
  generateForm.startDate = value
  
  if (!generateForm.startDate) return
  
  const start = dayjs(generateForm.startDate)
  const days = generateForm.type === 'weekly' ? 7 : 30
  const end = start.add(days, 'day')
  generateForm.endDate = end.format('YYYY-MM-DD')
  
  console.log(`开始日期: ${generateForm.startDate}, 报告类型: ${generateForm.type}, 结束日期: ${generateForm.endDate}`)
}

// 报告类型变更时，重新计算结束日期
const onReportTypeChange = (type: ReportType) => {
  generateForm.type = type
  onStartDateChange()
}

// 生成报告
const generateReport = async () => {
  console.log('=== generateReport 被调用 ===')
  console.log('generateForm:', generateForm)
  
  if (!generateForm.startDate || !generateForm.endDate) {
    console.log('时间范围未选择')
    uni.showToast({
      title: '请选择时间范围',
      icon: 'none'
    })
    return
  }

  try {
    console.log('开始生成报告...')
    uni.showLoading({ title: '生成中...' })
    
    const params = {
      type: generateForm.type,
      timeRange: {
        start: generateForm.startDate,
        end: generateForm.endDate,
        granularity: generateForm.type === 'weekly' ? 'week' : 'month'
      }
    }
    console.log('请求参数:', params)
    
    const result = await apiGenerateReport(params)
    console.log('生成结果:', result)

    uni.hideLoading()
    
    hideGenerateDialog()
    
    // 直接跳转到报告详情页面
    if (result && result.reportId) {
      uni.showToast({
        title: '报告生成成功',
        icon: 'success',
        duration: 1500
      })
      
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/other/reports/report-detail?id=${result.reportId}`
        })
      }, 1500)
    } else {
      // 如果没有返回 reportId，刷新列表
      uni.showToast({
        title: '报告生成成功，请下拉刷新查看',
        icon: 'success',
        duration: 2000
      })
      
      setTimeout(() => {
        loadReports(true)
      }, 500)
    }
  } catch (err: any) {
    console.error('生成报告失败:', err)
    uni.hideLoading()
    uni.showToast({
      title: err.message || '生成失败',
      icon: 'none'
    })
  }
}

// 返回
const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    // 如果没有上一页，返回到报表 Tab
    uni.switchTab({
      url: '/pages/tab/reports-wrapper'
    })
  }
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

// 生命周期
onMounted(() => {
  updateScrollHeight()
  loadReports(true)
})

onShow(() => {
  updateScrollHeight()
})
</script>

<style scoped lang="scss">
.report-center-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
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
  .action-text {
    font-size: 14px;
    color: #1890ff;
  }
}

.scroll-container {
  flex: 1;
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

.error-text {
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

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
}

.generate-btn {
  padding: 10px 32px;
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

.report-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.report-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.report-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;

  &.generating {
    background: #e6f7ff;
    color: #1890ff;
  }

  &.completed {
    background: #f6ffed;
    color: #52c41a;
  }

  &.failed {
    background: #fff1f0;
    color: #ff4d4f;
  }
}

.report-meta {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
  color: #999;

  .meta-divider {
    margin: 0 8px;
  }
}

.report-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}



.load-more,
.no-more {
  text-align: center;
  padding: 16px;
  font-size: 14px;
  color: #999;
}

// 弹窗样式
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.dialog-content {
  width: 80%;
  max-width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.dialog-form {
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-options {
  display: flex;
  gap: 12px;
}

.form-option {
  flex: 1;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  color: #666;

  &.active {
    background: #1890ff;
    color: #fff;
  }
}

.form-input {
  padding: 10px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

.date-range {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-input {
  width: 100%;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  z-index: 1;
  
  &:focus {
    border-color: #1890ff;
    outline: none;
  }
  
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 1;
  }
}

.form-divider {
  display: block;
  text-align: center;
  margin: 8px 0;
  font-size: 14px;
  color: #999;
}

.date-inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.date-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-picker-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  
  &:active {
    background: #f5f5f5;
  }
}

.date-picker-text {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.picker-icon {
  font-size: 20px;
}

.date-display-box {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
}

.date-display-text {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.date-auto-hint {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.input-label {
  font-size: 13px;
  color: #666;
}

.date-input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 15px;
  color: #333;
  box-sizing: border-box;
  
  &:focus {
    border-color: #1890ff;
    outline: none;
    background: #f0f8ff;
  }
  
  &::-webkit-calendar-picker-indicator {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}

.dialog-actions {
  display: flex;
  gap: 12px;
}

.dialog-btn {
  flex: 1;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
  border: none;

  &.cancel {
    background: #f5f5f5;
    color: #666;
  }

  &.confirm {
    background: #1890ff;
    color: #fff;
  }
}
</style>
