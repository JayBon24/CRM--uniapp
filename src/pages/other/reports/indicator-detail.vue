<template>
  <view class="indicator-detail-page">
    <!-- 页面头部 -->
    <view class="page-header" :style="{ paddingTop: headerPaddingTop + 'px' }">
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <text class="icon">←</text>
        </view>
        <view class="header-title">{{ indicatorTitle }}</view>
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
      <view v-if="loading && !detailData" class="loading-container">
        <text>加载中...</text>
      </view>

      <!-- 错误状态 -->
      <view v-else-if="error" class="error-container">
        <text class="error-text">{{ error }}</text>
        <button class="retry-btn" @click="refreshData">重试</button>
      </view>

      <!-- 内容区域 -->
      <view v-else-if="detailData" class="content">
        <!-- 指标概览卡片 -->
        <view class="indicator-overview">
          <view class="overview-value">
            <text class="value">{{ correctedIndicatorData.value }}</text>
            <text class="unit">{{ correctedIndicatorData.unit }}</text>
          </view>
          <!-- 平均值显示 -->
          <view v-if="correctedIndicatorData.avgValue !== undefined" class="overview-avg">
            <text class="avg-label">平均：</text>
            <text class="avg-value">{{ correctedIndicatorData.avgValue }}</text>
            <text class="avg-unit">{{ correctedIndicatorData.unit }}</text>
          </view>
          <view v-if="correctedIndicatorData.trend" class="overview-trend">
            <text
              class="trend-icon"
              :class="correctedIndicatorData.trend"
            >
              {{ correctedIndicatorData.trend === 'up' ? '↑' : correctedIndicatorData.trend === 'down' ? '↓' : '→' }}
            </text>
            <text class="trend-value">
              {{ correctedIndicatorData.trendPercent }}%
            </text>
          </view>
        </view>

        <!-- 时间范围选择器 -->
        <TimeRangeSelector
          v-model="timeRange"
          @change="changeTimeRange"
        />

        <!-- 对比模式和维度拆分选择 -->
        <view class="filter-row">
          <view class="filter-section">
            <text class="filter-label">对比模式：</text>
            <view class="filter-options">
              <view
                v-for="mode in comparisonModes"
                :key="mode.value"
                class="filter-option"
                :class="{ active: comparisonMode === mode.value }"
                @click="changeComparisonMode(mode.value)"
              >
                {{ mode.label }}
              </view>
            </view>
          </view>

          <view class="filter-section">
            <text class="filter-label">维度拆分：</text>
            <view class="filter-options">
              <view
                v-for="dim in availableDimensionTypes"
                :key="dim.value"
                class="filter-option"
                :class="{ active: dimensionType === dim.value }"
                @click="changeDimensionType(dim.value)"
              >
                {{ dim.label }}
              </view>
            </view>
          </view>
        </view>

        <!-- 趋势图表 -->
        <view class="chart-section">
          <view class="section-title">趋势分析</view>
          <ChartContainer
            v-if="trendChartData"
            :key="`chart-${indicatorType}-${timeRange.start}-${timeRange.end}-${comparisonMode}`"
            type="line"
            :data="trendChartData"
            :height="300"
            :active-point-index="selectedTrendPoint?.index ?? null"
            @point-click="handleTrendPointClick"
          />
          <view v-if="selectedTrendPoint" class="trend-point-tip">
            <text class="tip-main">{{ selectedTrendPoint.label }}：{{ selectedTrendPoint.value }}{{ correctedIndicatorData?.unit || '' }}</text>
            <text v-if="selectedTrendPoint.comparisonValue !== undefined" class="tip-sub">
              对比：{{ selectedTrendPoint.comparisonValue }}{{ correctedIndicatorData?.unit || '' }}
            </text>
          </view>
          <view v-else class="empty-state">
            <text>暂无趋势数据</text>
          </view>
        </view>

        <!-- 维度拆分数据 -->
        <view v-if="hasDimensionData" class="dimension-section">
          <view class="section-title">维度拆分</view>
          <view class="dimension-list">
            <view
              v-for="(item, index) in detailData.dimensionData"
              :key="index"
              class="dimension-item"
            >
              <view class="dimension-label">{{ item.label }}</view>
              <view class="dimension-value-row">
                <text class="dimension-value">{{ item.value }}</text>
                <text class="dimension-percent">{{ item.percent }}%</text>
              </view>
              <view class="dimension-bar">
                <view
                  class="dimension-bar-fill"
                  :style="{ width: item.percent + '%' }"
                ></view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-container">
        <text class="empty-text">暂无数据</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useIndicatorDetail } from '../composables/useIndicatorDetail'
import TimeRangeSelector from '@/components/reports/TimeRangeSelector.vue'
import ChartContainer from '@/components/reports/ChartContainer.vue'
import type {
  IndicatorType,
  ComparisonMode,
  DimensionType,
  TimeRange,
  DimensionFilter
} from '@/types/interfaces/reports'
import { useUserStore } from '@/stores/user'

// 获取页面参数 - 使用 onLoad 生命周期获取
const indicatorType = ref<IndicatorType>('lead_frequency')
const isPageReady = ref(false)
const refresherTriggered = ref(false)
const hasLoadedOnce = ref(false)
const headerPaddingTop = ref(0)
const scrollViewHeight = ref(0)
const systemInfo = uni.getSystemInfoSync?.() || {}
const isIOS = (systemInfo.platform || '').toLowerCase() === 'ios'
const scrollContainerStyle = computed(() => {
  return isIOS ? {} : { height: scrollViewHeight.value + 'px' }
})
const scrollProps = computed(() => {
  if (isIOS) return {}
  return {
    scrollY: true,
    refresherEnabled: true,
    refresherDefaultStyle: 'black',
    refresherBackground: '#f5f6f8',
    refresherTriggered: refresherTriggered.value
  }
})
const baseStatusBar = uni.getSystemInfoSync?.().statusBarHeight || 0
headerPaddingTop.value = baseStatusBar
// #ifdef MP-WEIXIN
headerPaddingTop.value = baseStatusBar + 12
// #endif

// 在 onLoad 中获取参数
onLoad((options: any) => {
  console.log('[indicator-detail] onLoad - 页面参数:', options)
  if (options?.type) {
    indicatorType.value = options.type as IndicatorType
    console.log('[indicator-detail] onLoad - 设置指标类型:', indicatorType.value)
  }
  
  // 优先处理传递的 dimensionFilter，确保在数据加载前设置
  let filterToUse: DimensionFilter | null = null
  
  if (options?.dimensionFilter) {
    try {
      const decoded = decodeURIComponent(options.dimensionFilter)
      const parsed = JSON.parse(decoded)
      if (parsed && typeof parsed === 'object') {
        filterToUse = parsed as DimensionFilter
        console.log('[indicator-detail] onLoad - 解析维度筛选:', filterToUse)
      }
    } catch (error) {
      console.error('[indicator-detail] onLoad - 解析维度筛选失败:', error)
    }
  } else {
    const cachedFilter = uni.getStorageSync('reports:dimensionFilter')
    if (cachedFilter && typeof cachedFilter === 'object') {
      filterToUse = cachedFilter as DimensionFilter
      console.log('[indicator-detail] onLoad - 使用缓存维度筛选:', filterToUse)
    }
  }
  
  if (filterToUse) {
    pendingDimensionFilter.value = filterToUse
    console.log('[indicator-detail] onLoad - 使用维度筛选条件:', filterToUse)
  }
  
  isPageReady.value = true
  console.log('[indicator-detail] onLoad - isPageReady 设置为 true')
})

// 用户信息
const userStore = useUserStore()
const roleLevel = computed(() => userStore.roleLevel || 'SALES')

// 初始化维度筛选 - 使用 ref 以便在 onLoad 中更新
const initialDimensionFilter = ref({
  scope: roleLevel.value === 'SALES' ? 'SELF' : roleLevel.value,
  dimension: 'NONE'
} as any)
const pendingDimensionFilter = ref<DimensionFilter | null>(null)
const selectedTrendPoint = ref<{ index: number; label: string; value: number; comparisonValue?: number } | null>(null)

// 使用 composable
const {
  loading,
  detailData,
  error,
  timeRange,
  comparisonMode,
  dimensionType,
  dimensionFilter: dimensionFilterRef,
  hasDimensionData,
  hasComparisonData,
  loadIndicatorDetail,
  refreshData,
  changeTimeRange: _changeTimeRange,
  changeComparisonMode: _changeComparisonMode,
  changeDimensionType: _changeDimensionType,
  setDimensionFilter
} = useIndicatorDetail(indicatorType, initialDimensionFilter.value, { skipInitialLoad: true })

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

const indicatorTitle = computed(() => indicatorTitles[indicatorType.value] || '指标详情')

// 修正后的指标数据（强制使用正确的单位和数值）
const correctedIndicatorData = computed(() => {
  if (!detailData.value) return null
  
  // 百分比类型的指标
  const percentageTypes: IndicatorType[] = ['conversion_rate', 'key_customer_visit_ratio', 'visit_success_rate']
  
  if (percentageTypes.includes(indicatorType.value)) {
    // 对于百分比类型，如果数值大于100，说明是累加的，需要除以天数
    let correctedValue = detailData.value.indicator.value
    let correctedAvgValue = detailData.value.indicator.avgValue
    
    // 如果值大于100，说明是错误的累加值，使用 avgValue
    if (correctedValue > 100 && correctedAvgValue) {
      correctedValue = correctedAvgValue
    }
    
    return {
      ...detailData.value.indicator,
      value: correctedValue,
      avgValue: correctedValue, // 百分比类型的平均值就是值本身
      unit: '%' // 强制使用百分比单位
    }
  }
  
  return detailData.value.indicator
})

// 对比模式选项
const comparisonModes = [
  { label: '无对比', value: 'none' as ComparisonMode },
  { label: '同比', value: 'yoy' as ComparisonMode },
  { label: '环比', value: 'mom' as ComparisonMode }
]

// 维度拆分选项（默认全量）
const dimensionTypes = [
  { label: '不拆分', value: 'NONE' as DimensionType },
  { label: '按人员', value: 'PERSONNEL' as DimensionType },
  { label: '按分所', value: 'BRANCH' as DimensionType },
  { label: '按来源', value: 'SOURCE' as DimensionType },
  { label: '按等级', value: 'GRADE' as DimensionType },
  { label: '按分类', value: 'CATEGORY' as DimensionType }
]

const indicatorDimensionMap: Record<IndicatorType, DimensionType[]> = {
  lead_frequency: ['NONE', 'PERSONNEL', 'BRANCH', 'CATEGORY'],
  new_customers: ['NONE', 'PERSONNEL', 'BRANCH', 'SOURCE', 'GRADE', 'CATEGORY'],
  conversion_rate: ['NONE', 'PERSONNEL', 'BRANCH', 'CATEGORY'],
  visit_frequency: ['NONE', 'PERSONNEL', 'BRANCH', 'CATEGORY'],
  key_customer_visit_ratio: ['NONE', 'PERSONNEL', 'BRANCH'],
  visit_success_rate: ['NONE', 'PERSONNEL', 'BRANCH'],
  avg_conversation_duration: ['NONE', 'PERSONNEL', 'BRANCH'],
  visit_cycle: ['NONE', 'PERSONNEL', 'BRANCH'],
  conversion_funnel: ['NONE']
}

const availableDimensionTypes = computed(() => {
  const allowed = indicatorDimensionMap[indicatorType.value] || ['NONE']
  return dimensionTypes.filter(item => allowed.includes(item.value))
})

// 趋势图表数据
const trendChartData = computed(() => {
  if (!detailData.value?.trendData || detailData.value.trendData.length === 0) {
    console.log('[indicator-detail] trendChartData - 无趋势数据', {
      hasDetailData: !!detailData.value,
      trendDataLength: detailData.value?.trendData?.length || 0
    })
    return null
  }

  const categories = detailData.value.trendData.map((point) => {
    // 格式化日期显示
    const date = new Date(point.time)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })
  
  const series = [
    {
      name: '当前值',
      data: detailData.value.trendData.map((point) => point.value)
    }
  ]

  // 如果有对比数据，添加对比系列
  if (hasComparisonData.value) {
    series.push({
      name: comparisonMode.value === 'yoy' ? '同期值' : '环比值',
      data: detailData.value.trendData.map((point) => point.comparisonValue || 0)
    })
  }

  const chartData = {
    categories,
    series
  }
  
  console.log('[indicator-detail] trendChartData - 计算完成', {
    categoriesCount: categories.length,
    seriesCount: series.length,
    firstCategory: categories[0],
    firstSeriesData: series[0]?.data?.slice(0, 3)
  })
  
  return chartData
})

// 维度拆分图表数据
const dimensionChartData = computed(() => {
  if (!detailData.value?.dimensionData || detailData.value.dimensionData.length === 0) {
    return null
  }

  return {
    categories: detailData.value.dimensionData.map((item) => item.label),
    series: [
      {
        name: '数值',
        data: detailData.value.dimensionData.map((item) => item.value)
      }
    ]
  }
})

// 方法
const goBack = () => {
  // 直接跳转到报表 Tab 首页，而不是返回上一页
  uni.switchTab({
    url: '/pages/tab/reports-wrapper'
  })
}

const onRefresh = async () => {
  refresherTriggered.value = true
  selectedTrendPoint.value = null
  await refreshData()
  refresherTriggered.value = false
}

const changeTimeRange = async (newTimeRange: TimeRange) => {
  selectedTrendPoint.value = null
  await _changeTimeRange(newTimeRange)
}

const changeComparisonMode = async (mode: ComparisonMode) => {
  selectedTrendPoint.value = null
  await _changeComparisonMode(mode)
}

const changeDimensionType = async (type: DimensionType) => {
  selectedTrendPoint.value = null
  await _changeDimensionType(type)
}

const handleTrendPointClick = (point: { index: number; label: string; value: number; comparisonValue?: number }) => {
  selectedTrendPoint.value = point
}

const triggerInitialLoad = async (source: string) => {
  if (!isPageReady.value || hasLoadedOnce.value) {
    return
  }
  console.log(`[indicator-detail] triggerInitialLoad - source: ${source}`)
  if (pendingDimensionFilter.value) {
    setDimensionFilter(pendingDimensionFilter.value)
  }
  refresherTriggered.value = true
  try {
    await loadIndicatorDetail()
  } finally {
    refresherTriggered.value = false
    hasLoadedOnce.value = true
  }
}

// 生命周期
onMounted(() => {
  console.log('[indicator-detail] onMounted - 页面挂载')
  
  // 计算 scroll-view 高度（iOS 真机上需要明确的高度）
  try {
    const systemInfo = uni.getSystemInfoSync()
    console.log('[indicator-detail] onMounted - 系统信息:', {
      windowHeight: systemInfo.windowHeight,
      statusBarHeight: systemInfo.statusBarHeight,
      headerPaddingTop: headerPaddingTop.value
    })
    
    // 计算头部高度：状态栏 + 导航栏（约44px）
    const headerHeight = headerPaddingTop.value + 44
    scrollViewHeight.value = systemInfo.windowHeight - headerHeight
    
    console.log('[indicator-detail] onMounted - 计算 scroll-view 高度:', {
      windowHeight: systemInfo.windowHeight,
      headerHeight,
      scrollViewHeight: scrollViewHeight.value
    })
  } catch (error) {
    console.error('[indicator-detail] onMounted - 计算高度失败:', error)
    //  fallback: 使用默认值
    scrollViewHeight.value = 600
  }
  
  // iOS 真机上 watch 可能不触发，在这里也加载一次
  void triggerInitialLoad('mounted')
})

// 监听页面准备好后加载数据
watch(isPageReady, (ready) => {
  if (ready) {
    console.log('[indicator-detail] watch isPageReady - 页面准备好，开始加载数据')
    console.log('[indicator-detail] watch - 指标类型:', indicatorType.value)
    console.log('[indicator-detail] watch - 当前维度筛选:', dimensionFilterRef.value)
    console.log('[indicator-detail] watch - hasLoadedOnce:', hasLoadedOnce.value)
    void triggerInitialLoad('watch')
  }
}, { immediate: true })

onShow(() => {
  console.log('[indicator-detail] onShow - 页面显示', {
    hasLoadedOnce: hasLoadedOnce.value,
    isPageReady: isPageReady.value,
    dimensionFilter: dimensionFilterRef.value
  })
  
  void triggerInitialLoad('show')
})

watch(availableDimensionTypes, (types) => {
  if (!types.some(item => item.value === dimensionType.value)) {
    void _changeDimensionType('NONE')
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.indicator-detail-page {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  padding: 12px 16px;
}

.back-btn {
  margin-right: 12px;
  
  .icon {
    font-size: 24px;
    color: #333;
  }
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.scroll-container {
  width: 100%;
  /* 高度通过 style 动态绑定 */
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
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
}

.indicator-overview {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  color: #fff;
}

.overview-value {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;

  .value {
    font-size: 36px;
    font-weight: 600;
  }

  .unit {
    font-size: 16px;
    margin-left: 8px;
    opacity: 0.9;
  }
}

.overview-avg {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
  font-size: 14px;
  opacity: 0.85;

  .avg-label {
    margin-right: 4px;
  }

  .avg-value {
    font-size: 18px;
    font-weight: 500;
  }

  .avg-unit {
    margin-left: 4px;
  }
}

.overview-trend {
  display: flex;
  align-items: center;
  font-size: 14px;

  .trend-icon {
    margin-right: 4px;
    font-size: 18px;

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
    opacity: 0.9;
  }
}

.filter-row {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.filter-section {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-option {
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  transition: all 0.3s;

  &.active {
    background: #1890ff;
    color: #fff;
  }
}

.chart-section,
.dimension-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  /* iOS 上确保容器正确显示 */
  position: relative;
  overflow: visible;
  /* 确保内容不会被裁剪 */
  min-height: 1px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

.trend-point-tip {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .tip-main {
    color: #1f2329;
    font-size: 13px;
    font-weight: 500;
  }

  .tip-sub {
    color: #646a73;
    font-size: 12px;
  }
}

.dimension-list {
  /* 移除底部 margin，因为不再显示图表 */
}

.dimension-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

.dimension-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.dimension-value-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.dimension-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.dimension-percent {
  font-size: 14px;
  color: #1890ff;
}

.dimension-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.dimension-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #36cfc9 100%);
  border-radius: 4px;
  transition: width 0.3s;
}
</style>
