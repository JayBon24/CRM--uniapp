<template>
  <view class="reports-dashboard">
    <!-- 顶部栏 -->
    <view class="top-bar">
      <view class="page-title">数据报表</view>
      <view class="top-actions">
        <view class="action-btn" @click="goToReportCenter">
          <text class="action-icon">📊</text>
        </view>
      </view>
    </view>

    <!-- 维度筛选器 -->
    <DimensionFilter
      v-model="dimensionFilter"
      @change="handleDimensionChange"
    />
    
    <!-- 维度说明 -->
    <view v-if="showDimensionHint" class="dimension-hint">
      <text class="hint-icon">ℹ️</text>
      <text class="hint-text">{{ dimensionHintText }}</text>
    </view>

    <!-- 下拉刷新容器 -->
    <scroll-view
      class="scroll-container"
      scroll-y
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="handleRefresh"
      @refresherrestore="handleRefreshRestore"
    >
      <!-- 加载状态 -->
      <view v-if="loading && !dashboardData" class="loading-container">
        <view class="loading-text">加载中...</view>
      </view>

      <!-- 错误状态 -->
      <view v-else-if="error" class="error-container">
        <view class="error-icon">⚠️</view>
        <view class="error-text">{{ error }}</view>
        <button class="retry-button" @click="loadDashboardData">重试</button>
      </view>

      <!-- 看板内容 -->
      <view v-else-if="dashboardData" class="dashboard-content">
        <!-- 更新时间 -->
        <view class="update-time">
          更新时间：{{ formatUpdateTime(dashboardData.updateTime) }}
        </view>

        <!-- 核心指标区 - 大卡片 -->
        <view class="hero-metrics">
          <view
            v-for="indicator in heroIndicators"
            :key="indicator.type"
            class="metric-card-item"
          >
            <MetricCard
              :title="getIndicatorTitle(indicator.type)"
              :value="indicator.value"
              :unit="indicator.unit"
              :trend="indicator.trend"
              :trend-value="indicator.trendPercent ? `${Math.abs(indicator.trendPercent)}%` : undefined"
              :size="'hero'"
              :variant="getHeroVariant(indicator.type)"
              @click="handleIndicatorClick(indicator.type)"
            />
          </view>
        </view>

        <!-- 客户跟进指标组 -->
        <view class="metric-group">
          <view class="group-header">
            <view class="group-title">客户跟进</view>
          </view>
          <view class="metrics-grid">
            <view
              v-for="indicator in followUpIndicators"
              :key="indicator.type"
              class="metric-card-item"
            >
              <MetricCard
                :title="getIndicatorTitle(indicator.type)"
                :value="indicator.value"
                :unit="indicator.unit"
                :trend="indicator.trend"
                :trend-value="indicator.trendPercent ? `${Math.abs(indicator.trendPercent)}%` : undefined"
                @click="handleIndicatorClick(indicator.type)"
              />
            </view>
          </view>
        </view>

        <!-- 拜访效率指标组 -->
        <view class="metric-group">
          <view class="group-header">
            <view class="group-title">拜访效率</view>
          </view>
          <view class="metrics-grid">
            <view
              v-for="indicator in visitIndicators"
              :key="indicator.type"
              class="metric-card-item"
            >
              <MetricCard
                :title="getIndicatorTitle(indicator.type)"
                :value="indicator.value"
                :unit="indicator.unit"
                :trend="indicator.trend"
                :trend-value="indicator.trendPercent ? `${Math.abs(indicator.trendPercent)}%` : undefined"
                @click="handleIndicatorClick(indicator.type)"
              />
            </view>
          </view>
        </view>

        <!-- 维度拆分数据展示 -->
        <view v-if="hasDimensionBreakdown" class="dimension-section">
          <DimensionBreakdown
            v-for="indicator in indicatorsWithBreakdown"
            :key="indicator.type"
            :title="getIndicatorTitle(indicator.type)"
            :breakdown-data="indicator.breakdown || []"
            :unit="indicator.unit"
            :show-chart="true"
          />
        </view>

        <!-- 客户转化图 -->
        <view class="funnel-section">
          <view class="section-header">
            <view class="section-title">客户转化图</view>
          </view>
          <ChartContainer
            v-if="dashboardData.conversionFunnel"
            type="funnel"
            :data="dashboardData.conversionFunnel"
            title=""
            :height="400"
          />
        </view>
      </view>
    </scroll-view>
    
    <!-- 自定义 TabBar，保持底部导航栏显示 -->
    <CustomTabBar ref="tabBarRef" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { useReportsDashboard } from '@/composables/useReportsDashboard'
import MetricCard from '@/components/reports/MetricCard.vue'
import DimensionFilter from '@/components/reports/DimensionFilter.vue'
import ChartContainer from '@/components/reports/ChartContainer.vue'
import DimensionBreakdown from '@/components/reports/DimensionBreakdown.vue'
import CustomTabBar from '@/custom-tab-bar/index.vue'
import type { IndicatorType, DimensionFilter as DimensionFilterType } from '@/types/interfaces/reports'

// 获取用户信息
const userStore = useUserStore()
const roleLevel = userStore.roleLevel

// 使用看板 composable
const {
  loading,
  dashboardData,
  error,
  dimensionFilter,
  loadDashboardData,
  refreshData,
  changeDimensionFilter
} = useReportsDashboard(roleLevel)

// 监听 dimensionFilter 变化
watch(dimensionFilter, (newVal) => {
  console.log('=== dimensionFilter changed ===', newVal)
}, { deep: true })

// 下拉刷新状态
const refreshing = ref(false)

// 选中的维度ID（用于筛选单个人员/分所）
const selectedDimensionId = ref<string | number | null>(null)

// 指标标题映射
const indicatorTitles: Record<IndicatorType, string> = {
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

// 核心指标（大卡片展示）
const heroIndicators = computed(() => {
  if (!dashboardData.value) return []
  return dashboardData.value.indicators.filter(ind => 
    ['new_customers', 'conversion_rate'].includes(ind.type)
  )
})

// 客户跟进指标
const followUpIndicators = computed(() => {
  if (!dashboardData.value) return []
  return dashboardData.value.indicators.filter(ind => 
    ['lead_frequency', 'visit_frequency'].includes(ind.type)
  )
})

// 拜访效率指标
const visitIndicators = computed(() => {
  if (!dashboardData.value) return []
  return dashboardData.value.indicators.filter(ind => 
    ['key_customer_visit_ratio', 'visit_success_rate', 'avg_conversation_duration', 'visit_cycle'].includes(ind.type)
  )
})

// 是否有维度拆分
const hasDimensionBreakdown = computed(() => {
  return dimensionFilter.value.dimension !== 'NONE' && 
         dashboardData.value?.indicators.some(ind => ind.breakdown && ind.breakdown.length > 0)
})

// 有拆分数据的指标（只显示前4个主要指标）
const indicatorsWithBreakdown = computed(() => {
  if (!dashboardData.value || !hasDimensionBreakdown.value) return []
  
  // 优先显示这些关键指标的拆分
  const priorityTypes: IndicatorType[] = [
    'new_customers',
    'conversion_rate', 
    'visit_frequency',
    'visit_success_rate'
  ]
  
  let indicators = dashboardData.value.indicators
    .filter(ind => ind.breakdown && ind.breakdown.length > 0 && priorityTypes.includes(ind.type))
  
  // 如果选中了特定维度，只显示该维度的数据
  if (selectedDimensionId.value !== null) {
    const selectedIndex = parseInt(selectedDimensionId.value.toString().replace('dimension_', ''))
    indicators = indicators.map(ind => ({
      ...ind,
      breakdown: ind.breakdown ? [ind.breakdown[selectedIndex]] : []
    }))
  }
  
  return indicators.slice(0, 4) // 最多显示4个
})

// 维度提示文本
const showDimensionHint = computed(() => {
  return dimensionFilter.value.dimension !== 'NONE'
})

const dimensionHintText = computed(() => {
  const dimensionNames = {
    PERSONNEL: '按销售人员',
    BRANCH: '按分所',
    SOURCE: '按来源渠道',
    GRADE: '按客户等级'
  }
  const dimension = dimensionFilter.value.dimension
  if (!dimension || dimension === 'NONE') return ''
  
  if (selectedDimensionId.value !== null) {
    return `当前${dimensionNames[dimension]}查看数据明细`
  }
  
  // 根据不同维度显示不同的提示
  if (dimension === 'BRANCH') {
    return '当前按分所查看数据明细'
  } else if (dimension === 'PERSONNEL') {
    return '当前按销售人员查看数据明细'
  }
  
  return `当前${dimensionNames[dimension]}查看数据明细`
})

// 获取指标标题
const getIndicatorTitle = (type: IndicatorType): string => {
  return indicatorTitles[type] || type
}

// 获取核心指标的颜色变体
const getHeroVariant = (type: IndicatorType): 'primary' | 'success' | 'warning' => {
  if (type === 'new_customers') return 'primary'
  if (type === 'conversion_rate') return 'success'
  return 'warning'
}

// 格式化更新时间
const formatUpdateTime = (time: string): string => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`

  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 处理维度切换
const handleDimensionChange = async (filter: DimensionFilterType) => {
  console.log('=== handleDimensionChange called ===', filter)
  // 切换维度时重置选中的维度ID
  selectedDimensionId.value = null
  uni.setStorageSync('reports:dimensionFilter', filter)
  await changeDimensionFilter(filter)
}

// 处理下拉刷新
const handleRefresh = async () => {
  refreshing.value = true
  try {
    await refreshData()
  } finally {
    refreshing.value = false
  }
}

// 处理刷新恢复
const handleRefreshRestore = () => {
  refreshing.value = false
}

// 处理指标点击
const handleIndicatorClick = (type: IndicatorType) => {
  const serializedFilter = encodeURIComponent(JSON.stringify(dimensionFilter.value || {}))
  uni.navigateTo({
    url: `/pages/other/reports/indicator-detail?type=${type}&dimensionFilter=${serializedFilter}`
  })
}

// 跳转到报告中心
const goToReportCenter = () => {
  uni.navigateTo({
    url: '/pages/other/reports/report-center'
  })
}

// TabBar 引用
const tabBarRef = ref()

// 页面显示时
onShow(() => {
  // tabBar 状态由 custom-tab-bar 统一管理
  // 设置当前 Tab 为报表（索引 3）
  if (tabBarRef.value && typeof tabBarRef.value.setSelected === 'function') {
    tabBarRef.value.setSelected(3)
  }
})

// 组件挂载时加载数据
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped lang="scss">
.reports-dashboard {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 24rpx;
  background: #fff;
}

.page-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #1f2329;
}

.top-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
  border-radius: 16rpx;

  .action-icon {
    font-size: 36rpx;
  }

  &:active {
    background: #ebedf0;
  }
}

.scroll-container {
  flex: 1;
  height: 0;
  background: #f7f8fa;
  width: 100%;
}

.dimension-hint {
  margin: 0 32rpx 24rpx;
  padding: 20rpx 24rpx;
  background: #e8f3ff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.hint-icon {
  font-size: 28rpx;
}

.hint-text {
  font-size: 24rpx;
  color: #3370ff;
  flex: 1;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
}

.error-icon {
  font-size: 96rpx;
  margin-bottom: 24rpx;
}

.error-text {
  font-size: 28rpx;
  color: #8f959e;
  margin-bottom: 32rpx;
}

.retry-button {
  padding: 16rpx 48rpx;
  font-size: 28rpx;
  color: #3370ff;
  background-color: #fff;
  border: 2rpx solid #3370ff;
  border-radius: 8rpx;
}

.dashboard-content {
  padding: 24rpx;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom) + 120rpx);
}

.update-time {
  font-size: 24rpx;
  color: #8f959e;
  text-align: right;
  margin-bottom: 32rpx;
}

// 核心指标区
.hero-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  margin-bottom: 48rpx;
  align-items: stretch;
  justify-items: stretch;
  align-content: stretch;
  width: 100%;
  box-sizing: border-box;
}

.hero-metrics .metric-card-item {
  width: calc((100% - 24rpx) / 2);
  height: 300rpx;
  min-width: 0;
  box-sizing: border-box;
}

// 指标分组
.metric-group {
  margin-bottom: 48rpx;
}

.group-header {
  margin-bottom: 24rpx;
  padding: 0 4rpx;
}

.group-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2329;
  display: flex;
  align-items: center;
  gap: 12rpx;

  &::before {
    content: '';
    width: 6rpx;
    height: 28rpx;
    background: #3370ff;
    border-radius: 3rpx;
  }
}

.metrics-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: stretch;
  justify-items: stretch;
  align-content: stretch;
  width: 100%;
  box-sizing: border-box;
}

.metrics-grid .metric-card-item {
  width: calc((100% - 24rpx) / 2);
  height: 240rpx;
  min-width: 0;
  min-height: 200rpx;
  box-sizing: border-box;
}

// 维度拆分区域
.dimension-section {
  margin-bottom: 48rpx;
}

// 漏斗区域
.funnel-section {
  margin-bottom: 48rpx;
}

.section-header {
  margin-bottom: 24rpx;
  padding: 0 4rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2329;
  display: flex;
  align-items: center;
  gap: 12rpx;

  &::before {
    content: '';
    width: 6rpx;
    height: 28rpx;
    background: #3370ff;
    border-radius: 3rpx;
  }
}
</style>
