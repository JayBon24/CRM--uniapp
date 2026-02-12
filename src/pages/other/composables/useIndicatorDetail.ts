/**
 * 指标详情 Composable
 * 管理指标详情数据获取、时间范围、对比模式和维度拆分逻辑
 */
import { ref, computed, type Ref, unref } from 'vue'
import { getIndicatorDetail } from '@/api/reports'
import type {
  IndicatorDetailData,
  IndicatorType,
  TimeRange,
  ComparisonMode,
  DimensionFilter,
  DimensionType,
  TimeGranularity
} from '@/types/interfaces/reports'
import dayjs from 'dayjs'

export function useIndicatorDetail(
  indicatorTypeRef: Ref<IndicatorType> | IndicatorType,
  initialDimensionFilter: DimensionFilter,
  options?: { skipInitialLoad?: boolean }
) {
  // 状态
  const loading = ref(false)
  const detailData = ref<IndicatorDetailData | null>(null)
  const error = ref<string | null>(null)

  // 时间范围状态 - 默认为最近30天
  const timeRange = ref<TimeRange>({
    start: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD'),
    granularity: 'day'
  })

  // 对比模式状态 - 默认无对比
  const comparisonMode = ref<ComparisonMode>('none')

  // 维度筛选状态
  const dimensionFilter = ref<DimensionFilter>(initialDimensionFilter)

  // 维度拆分类型 - 默认不拆分
  const dimensionType = ref<DimensionType>('NONE')
  let comparisonFallbackUsed = false
  let latestRequestId = 0
  let dimensionDebounceTimer: ReturnType<typeof setTimeout> | null = null

  const normalizeComparisonRange = (range: TimeRange, mode: ComparisonMode) => {
    if (mode === 'none') {
      return range
    }
    const clampDate = (dateStr: string) => {
      const current = dayjs(dateStr)
      if (!current.isValid()) return dateStr
      const prev = mode === 'yoy' ? current.subtract(1, 'year') : current.subtract(1, 'month')
      const lastDay = prev.endOf('month').date()
      const safeDay = Math.min(current.date(), lastDay, 28)
      return current.date(safeDay).format('YYYY-MM-DD')
    }
    const nextStart = clampDate(range.start)
    const nextEnd = clampDate(range.end)
    const safeStart = dayjs(nextStart).isAfter(dayjs(nextEnd)) ? nextEnd : nextStart
    return {
      ...range,
      start: safeStart,
      end: nextEnd
    }
  }


  // 构建查询参数
  const isComparisonRangeSafe = (range: TimeRange) => {
    const startDay = dayjs(range.start).date()
    const endDay = dayjs(range.end).date()
    return startDay <= 28 && endDay <= 28
  }

  const showComparisonRangeTip = () => {
    uni.showToast({
      title: '环比仅支持1-28日区间，请调整日期',
      icon: 'none'
    })
  }

  const forceSafeComparisonRange = (range: TimeRange) => {
    const clampToSafeDay = (dateStr: string) => {
      const current = dayjs(dateStr)
      if (!current.isValid()) return dateStr
      const safeDay = Math.min(current.date(), 28)
      return current.date(safeDay).format('YYYY-MM-DD')
    }
    const nextStart = clampToSafeDay(range.start)
    const nextEnd = clampToSafeDay(range.end)
    const safeStart = dayjs(nextStart).isAfter(dayjs(nextEnd)) ? nextEnd : nextStart
    return {
      ...range,
      start: safeStart,
      end: nextEnd
    }
  }

  const buildQueryParams = () => {
    const normalizedRange = normalizeComparisonRange(timeRange.value, comparisonMode.value)
    const safeRange = comparisonMode.value === 'none' ? normalizedRange : forceSafeComparisonRange(normalizedRange)
    return {
      indicatorType: unref(indicatorTypeRef),
      timeRange: safeRange,
      comparisonMode: comparisonMode.value,
      dimensionFilter: dimensionFilter.value,
      dimensionType: dimensionType.value
    }
  }

  // 加载指标详情数据
  const loadIndicatorDetail = async () => {
    const requestId = ++latestRequestId
    loading.value = true
    error.value = null

    try {
      const params = buildQueryParams()
      console.log('[useIndicatorDetail] 请求参数:', params)
      const response: any = await getIndicatorDetail(params)
      if (requestId !== latestRequestId) return
      console.log('[useIndicatorDetail] 原始响应:', response)
      // 提取响应数据：支持 { code: 200, data: {...} } 或直接返回数据
      detailData.value = response.data || response
      if (dimensionType.value === 'SOURCE' && detailData.value?.dimensionData) {
        detailData.value = {
          ...detailData.value,
          dimensionData: normalizeSourceDimensionData(detailData.value.dimensionData)
        }
      }
      console.log('[useIndicatorDetail] 设置后的 detailData:', detailData.value)
      console.log('[useIndicatorDetail] indicator.value:', detailData.value?.indicator?.value)
      console.log('[useIndicatorDetail] indicator.unit:', detailData.value?.indicator?.unit)
    } catch (err: any) {
      const message = err?.msg || err?.message || err?.data?.msg || err?.response?.data?.msg || '加载指标详情失败'
      const shouldFallback =
        !comparisonFallbackUsed &&
        comparisonMode.value !== 'none' &&
        typeof message === 'string' &&
        message.includes('day is out of range for month')

      if (shouldFallback) {
        const safeRange = forceSafeComparisonRange(timeRange.value)
        const changed =
          safeRange.start !== timeRange.value.start || safeRange.end !== timeRange.value.end
        if (changed) {
          comparisonFallbackUsed = true
          timeRange.value = safeRange
          loading.value = false
          await loadIndicatorDetail()
          return
        }
      }

      error.value = message
      console.error('加载指标详情失败:', err)
    } finally {
      if (requestId === latestRequestId) {
        loading.value = false
      }
    }
  }

  const debouncedLoad = async () => {
    if (dimensionDebounceTimer) {
      clearTimeout(dimensionDebounceTimer)
    }
    await new Promise<void>((resolve) => {
      dimensionDebounceTimer = setTimeout(async () => {
        await loadIndicatorDetail()
        resolve()
      }, 180)
    })
  }

  const shouldAutoLoad = options?.skipInitialLoad === false
  if (shouldAutoLoad) {
    void loadIndicatorDetail()
  }

  // 刷新数据
  const refreshData = async () => {
    await loadIndicatorDetail()
  }

  // 切换时间范围
  const changeTimeRange = async (newTimeRange: TimeRange) => {
    if (comparisonMode.value !== 'none' && !isComparisonRangeSafe(newTimeRange)) {
      showComparisonRangeTip()
      return
    }
    comparisonFallbackUsed = false
    const normalizedRange = normalizeComparisonRange(newTimeRange, comparisonMode.value)
    timeRange.value = comparisonMode.value === 'none' ? normalizedRange : forceSafeComparisonRange(normalizedRange)
    await loadIndicatorDetail()
  }

  // 切换对比模式
  const changeComparisonMode = async (mode: ComparisonMode) => {
    comparisonMode.value = mode
    comparisonFallbackUsed = false
    if (mode !== 'none') {
      if (!isComparisonRangeSafe(timeRange.value)) {
        comparisonMode.value = 'none'
        showComparisonRangeTip()
        return
      }
      const normalizedRange = normalizeComparisonRange(timeRange.value, mode)
      timeRange.value = forceSafeComparisonRange(normalizedRange)
    }
    await loadIndicatorDetail()
  }

  // 切换维度拆分
  const changeDimensionType = async (type: DimensionType) => {
    dimensionType.value = type
    await debouncedLoad()
  }

  // 切换维度筛选
  const changeDimensionFilter = async (filter: DimensionFilter) => {
    dimensionFilter.value = filter
    await debouncedLoad()
  }

  const setDimensionFilter = (filter: DimensionFilter) => {
    dimensionFilter.value = filter
  }

  // 快捷时间范围设置
  const setQuickTimeRange = async (granularity: TimeGranularity, count: number = 1) => {
    const end = dayjs()
    let start = dayjs()

    switch (granularity) {
      case 'day':
        start = end.subtract(count, 'day')
        break
      case 'week':
        start = end.subtract(count, 'week')
        break
      case 'month':
        start = end.subtract(count, 'month')
        break
      case 'quarter':
        start = end.subtract(count * 3, 'month')
        break
      case 'year':
        start = end.subtract(count, 'year')
        break
    }

    await changeTimeRange({
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      granularity
    })
  }

  // 计算属性：是否有维度拆分数据
  const hasDimensionData = computed(() => {
    return detailData.value?.dimensionData && detailData.value.dimensionData.length > 0
  })

  // 计算属性：是否有对比数据
  const hasComparisonData = computed(() => {
    return (
      comparisonMode.value !== 'none' &&
      detailData.value?.trendData?.some((point) => point.comparisonValue !== undefined)
    )
  })

  return {
    // 状态
    loading,
    detailData,
    error,
    timeRange,
    comparisonMode,
    dimensionFilter,
    dimensionType,

    // 计算属性
    hasDimensionData,
    hasComparisonData,

    // 方法
    loadIndicatorDetail,
    refreshData,
    changeTimeRange,
    changeComparisonMode,
    changeDimensionType,
    changeDimensionFilter,
    setDimensionFilter,
    setQuickTimeRange
  }
}

  const SOURCE_LABEL_ORDER = ['电话来访', '网络咨询', '朋友推荐', '老客户介绍', '展会活动', '其他']

  const SOURCE_LABEL_MAP: Record<string, string> = {
    ONLINE: '网络咨询',
    '官网': '网络咨询',
    '线上推广': '网络咨询',
    '网络咨询': '网络咨询',
    TELEMARKETING: '电话来访',
    '电话营销': '电话来访',
    '电话来访': '电话来访',
    REFERRAL: '朋友推荐',
    '朋友推荐': '朋友推荐',
    '转介绍': '朋友推荐',
    '客户推荐': '朋友推荐',
    EXHIBITION: '展会活动',
    '展会': '展会活动',
    '展会活动': '展会活动',
    OTHER: '其他',
    '其他': '其他',
    '其他渠道': '其他',
    '广告': '其他',
    '未知': '其他'
  }

  const normalizeSourceLabel = (label?: string | null) => {
    if (!label) return '其他'
    const raw = String(label).trim()
    if (!raw) return '其他'
    if (SOURCE_LABEL_MAP[raw]) return SOURCE_LABEL_MAP[raw]
    const upper = raw.toUpperCase()
    if (SOURCE_LABEL_MAP[upper]) return SOURCE_LABEL_MAP[upper]
    if (raw.includes('老客户')) return '老客户介绍'
    if (raw.includes('推荐') || raw.includes('介绍')) return '朋友推荐'
    if (raw.includes('展会')) return '展会活动'
    if (raw.includes('电话')) return '电话来访'
    if (raw.includes('网络') || raw.includes('线上') || raw.includes('官网')) return '网络咨询'
    return '其他'
  }

  const normalizeSourceDimensionData = (data: any[]) => {
    const merged = new Map<string, { label: string; value: number; percent: number }>()
    data.forEach((item) => {
      const label = normalizeSourceLabel(item?.label)
      const value = Number(item?.value || 0)
      if (!merged.has(label)) {
        merged.set(label, { label, value, percent: 0 })
      } else {
        const current = merged.get(label)!
        current.value += value
      }
    })

    const result = SOURCE_LABEL_ORDER.map((label) => ({
      label,
      value: merged.get(label)?.value || 0,
      percent: 0
    }))

    const total = result.reduce((sum, item) => sum + (item.value || 0), 0)
    result.forEach((item) => {
      item.percent = total ? Math.round((item.value / total) * 1000) / 10 : 0
    })

    return result
  }
