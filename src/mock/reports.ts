/**
 * 报表系统Mock数据
 */
import type { MockHandler } from './utils'
import { createMockResponse, createMockListResponse } from './utils'
import type {
  DashboardData,
  IndicatorData,
  IndicatorType,
  IndicatorBreakdown,
  DimensionType,
  Report,
  AISuggestion,
  DashboardQueryParams,
  IndicatorDetailQueryParams,
  ReportListQueryParams,
  ReportGenerateParams,
  IndicatorDetailData,
  TrendDataPoint,
  DimensionDataPoint
} from '@/types/interfaces/reports'
import { mockClientsDb } from './mock-shared'

/**
 * 根据实际客户数据计算转化率
 */
function calculateConversionRate(userId?: number | string): number {
  let publicPoolCount = 0
  let followUpCount = 0
  
  mockClientsDb.forEach((client: any) => {
    if (userId) {
      // 个人数据：只统计自己的客户
      if (client.owner_user_id === Number(userId)) {
        if (client.status === 'PUBLIC_POOL') publicPoolCount++
        if (client.status === 'FOLLOW_UP') followUpCount++
      }
    } else {
      // 全部数据
      if (client.status === 'PUBLIC_POOL') publicPoolCount++
      if (client.status === 'FOLLOW_UP') followUpCount++
    }
  })
  
  // 如果公海客户数为0，返回0（无法计算转化率）
  if (publicPoolCount === 0) {
    return 0
  }
  
  return (followUpCount / publicPoolCount) * 100
}

/**
 * 生成指标数据
 */
function generateIndicatorData(type: IndicatorType): IndicatorData {
  const configs: Record<
    IndicatorType,
    { unit: string; baseValue: number; trend: 'up' | 'down' | 'stable' }
  > = {
    lead_frequency: { unit: '次', baseValue: 15, trend: 'up' },
    new_customers: { unit: '个', baseValue: 8, trend: 'up' },
    conversion_rate: { unit: '%', baseValue: 25, trend: 'down' },
    visit_frequency: { unit: '次', baseValue: 12, trend: 'stable' },
    key_customer_visit_ratio: { unit: '%', baseValue: 60, trend: 'up' },
    visit_success_rate: { unit: '%', baseValue: 75, trend: 'up' },
    avg_conversation_duration: { unit: '小时', baseValue: 2.5, trend: 'stable' },
    visit_cycle: { unit: '天', baseValue: 7, trend: 'down' },
    conversion_funnel: { unit: '', baseValue: 0, trend: 'stable' }
  }

  const config = configs[type]
  let value = config.baseValue + (Math.random() - 0.5) * config.baseValue * 0.2
  
  // 百分比类型的值不能超过 100%
  if (config.unit === '%') {
    value = Math.min(value, 100)
  }
  
  // 计数类型（个、次、天）应该是整数
  if (config.unit === '个' || config.unit === '次' || config.unit === '天') {
    value = Math.round(value)
  } else {
    // 其他类型保留两位小数
    value = Math.round(value * 100) / 100
  }
  
  const trendPercent = (Math.random() - 0.5) * 20

  return {
    type,
    value,
    unit: config.unit,
    trend: config.trend,
    trendValue: Math.round(trendPercent * 100) / 100,
    trendPercent: Math.round(trendPercent * 100) / 100
  }
}

/**
 * 生成维度拆分数据
 */
function generateBreakdownData(
  dimension: DimensionType,
  baseValue: number,
  unit: string
): IndicatorBreakdown[] {
  if (dimension === 'NONE') {
    return []
  }

  let labels: string[] = []
  let count = 5 // 默认生成5个维度项
  
  switch (dimension) {
    case 'PERSONNEL':
      labels = ['张三', '李四', '王五', '赵六', '钱七']
      break
    case 'BRANCH':
      labels = ['北京分所', '上海分所', '深圳分所', '广州分所', '杭州分所']
      break
    case 'SOURCE':
      labels = ['线上推广', '客户推荐', '展会活动', '电话营销', '其他渠道']
      break
    case 'GRADE':
      labels = ['A级客户', 'B级客户', 'C级客户', 'D级客户', 'E级客户']
      break
    case 'CATEGORY':
      labels = ['建工', '建材']
      break
    default:
      return []
  }

  // 生成拆分数据，确保总和接近 baseValue
  const breakdown: IndicatorBreakdown[] = []
  let remainingValue = baseValue
  
  for (let i = 0; i < labels.length; i++) {
    let value: number
    
    if (i === labels.length - 1) {
      // 最后一个使用剩余值
      value = remainingValue
    } else {
      // 生成一个占比，逐渐递减
      const ratio = (0.3 - i * 0.05) + (Math.random() - 0.5) * 0.1
      value = baseValue * Math.max(0.05, ratio)
      remainingValue -= value
    }
    
    // 根据单位决定精度
    const decimals = unit === '%' ? 1 : (unit === '小时' ? 1 : 0)
    value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
    
    breakdown.push({
      label: labels[i],
      value: Math.max(0, value),
      percent: Math.round((value / baseValue) * 100 * 10) / 10
    })
  }
  
  return breakdown
}

/**
 * 生成看板数据
 */
function generateDashboardData(params: DashboardQueryParams): DashboardData {
  const { dimensionFilter } = params
  const scope = dimensionFilter?.scope || 'SELF'
  const dimension = dimensionFilter?.dimension || 'NONE'
  const userId = dimensionFilter?.userId
  
  const indicatorTypes: IndicatorType[] = [
    'lead_frequency',
    'new_customers',
    'conversion_rate',
    'visit_frequency',
    'key_customer_visit_ratio',
    'visit_success_rate',
    'avg_conversation_duration',
    'visit_cycle'
  ]

  // 根据不同角色生成不同范围的数据
  const indicators = indicatorTypes.map((type) => {
    // 特殊处理：转化率基于实际客户数据计算
    if (type === 'conversion_rate') {
      const realConversionRate = calculateConversionRate(userId)
      const trendPercent = (Math.random() - 0.5) * 20
      
      return {
        type,
        value: Math.round(realConversionRate * 100) / 100,
        unit: '%',
        trend: 'down' as const,
        trendValue: Math.round(trendPercent * 100) / 100,
        trendPercent: Math.round(trendPercent * 100) / 100,
        breakdown: dimension !== 'NONE' 
          ? generateBreakdownData(dimension, realConversionRate, '%')
          : undefined
      }
    }
    
    const baseIndicator = generateIndicatorData(type)
    
    // 根据数据范围调整数值
    // 如果指定了 userId，说明是查看具体人员的数据，使用个人倍数
    let multiplier = 1
    if (userId) {
      multiplier = 1 // 具体人员的数据，使用个人倍数
    } else {
      // 根据 scope 决定倍数
      switch (scope) {
        case 'SELF':
          multiplier = 1
          break
        case 'TEAM':
          multiplier = 3 // 团队数据是个人的3倍
          break
        case 'BRANCH':
          multiplier = 10 // 分所数据是个人的10倍
          break
        case 'HQ':
          multiplier = 50 // 总所数据是个人的50倍
          break
      }
    }
    
    let finalValue = Math.round(baseIndicator.value * multiplier * 100) / 100
    
    // 百分比类型的值不能超过 100%（即使乘以倍数后也要限制）
    if (baseIndicator.unit === '%') {
      finalValue = Math.min(finalValue, 100)
    }
    
    // 计数类型（个、次、天）应该是整数
    if (baseIndicator.unit === '个' || baseIndicator.unit === '次' || baseIndicator.unit === '天') {
      finalValue = Math.round(finalValue)
    }
    
    // 如果有维度拆分，生成 breakdown 数据
    const breakdown = dimension !== 'NONE' 
      ? generateBreakdownData(dimension, finalValue, baseIndicator.unit)
      : undefined
    
    console.log(`[Mock] Indicator ${type}, dimension: ${dimension}, has breakdown: ${!!breakdown}, breakdown length: ${breakdown?.length || 0}`)
    
    return {
      ...baseIndicator,
      value: finalValue,
      breakdown
    }
  })

  // 生成转化漏斗数据 - 根据范围调整基数
  let baseValue = 1000
  switch (scope) {
    case 'SELF':
      baseValue = 100
      break
    case 'TEAM':
      baseValue = 500
      break
    case 'BRANCH':
      baseValue = 2000
      break
    case 'HQ':
      baseValue = 10000
      break
  }

  const funnelStages = [
    { name: '商机', value: baseValue, percent: 100 },
    { name: '面谈', value: Math.round(baseValue * 0.6), percent: 60 },
    { name: '交案', value: Math.round(baseValue * 0.3), percent: 30 },
    { name: '回款', value: Math.round(baseValue * 0.15), percent: 15 },
    { name: '赢单', value: Math.round(baseValue * 0.1), percent: 10 }
  ]

  return {
    indicators,
    conversionFunnel: {
      stages: funnelStages
    },
    updateTime: new Date().toISOString()
  }
}

/**
 * 生成趋势数据
 */
function generateTrendData(days: number, indicatorType?: IndicatorType): TrendDataPoint[] {
  const data: TrendDataPoint[] = []
  const now = new Date()

  // 模拟边界情况：10%概率生成空数据
  if (Math.random() < 0.05) {
    return []
  }

  // 根据指标类型确定基础值和波动范围
  let baseValue = 15
  let fluctuationRange = 10
  let minValue = 5
  
  // 判断是否为百分比类型
  const configs: Record<IndicatorType, { unit: string; baseValue: number; trend: 'up' | 'down' | 'stable' }> = {
    lead_frequency: { unit: '次', baseValue: 15, trend: 'up' },
    new_customers: { unit: '个', baseValue: 8, trend: 'up' },
    conversion_rate: { unit: '%', baseValue: 25, trend: 'down' },
    visit_frequency: { unit: '次', baseValue: 12, trend: 'stable' },
    key_customer_visit_ratio: { unit: '%', baseValue: 60, trend: 'up' },
    visit_success_rate: { unit: '%', baseValue: 75, trend: 'up' },
    avg_conversation_duration: { unit: '小时', baseValue: 2.5, trend: 'stable' },
    visit_cycle: { unit: '天', baseValue: 7, trend: 'down' },
    conversion_funnel: { unit: '', baseValue: 0, trend: 'stable' }
  }
  
  if (indicatorType && configs[indicatorType]) {
    const config = configs[indicatorType]
    baseValue = config.baseValue
    
    // 百分比类型的波动范围更小
    if (config.unit === '%') {
      fluctuationRange = baseValue * 0.3 // 30% 的波动
      minValue = Math.max(0, baseValue * 0.5) // 最小值是基础值的50%
    } else {
      fluctuationRange = baseValue * 0.6 // 60% 的波动
      minValue = Math.max(0, baseValue * 0.3) // 最小值是基础值的30%
    }
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // 生成基础值
    const fluctuation = (Math.random() - 0.5) * fluctuationRange
    const value = Math.max(minValue, Math.round((baseValue + fluctuation) * 100) / 100)
    
    // 对比值（同比/环比）：在当前值基础上有一定波动
    const comparisonFluctuation = (Math.random() - 0.5) * (fluctuationRange * 0.4)
    const comparisonValue = Math.max(minValue, Math.round((value + comparisonFluctuation) * 100) / 100)

    data.push({
      time: date.toISOString().split('T')[0],
      value,
      comparisonValue
    })
  }

  return data
}

/**
 * 生成维度数据
 */
function generateDimensionData(dimensionType?: DimensionType): DimensionDataPoint[] {
  if (!dimensionType || dimensionType === 'NONE') {
    return []
  }

  let labels: string[] = []
  
  switch (dimensionType) {
    case 'PERSONNEL':
      labels = ['张三', '李四', '王五', '赵六', '钱七']
      break
    case 'BRANCH':
      labels = ['北京分所', '上海分所', '深圳分所', '广州分所', '杭州分所']
      break
    case 'SOURCE':
      labels = ['线上推广', '客户推荐', '展会活动', '电话营销', '其他渠道']
      break
    case 'GRADE':
      labels = ['A级客户', 'B级客户', 'C级客户', 'D级客户', 'E级客户']
      break
    case 'CATEGORY':
      labels = ['建工', '建材']
      break
    default:
      labels = ['维度1', '维度2', '维度3', '维度4', '维度5']
  }

  const total = labels.reduce((sum, _, index) => {
    return sum + (100 - index * 15)
  }, 0)

  return labels.map((label, index) => {
    const value = Math.round((100 - index * 15 + Math.random() * 20) * 100) / 100
    return {
      label,
      value,
      percent: Math.round((value / total) * 100 * 100) / 100
    }
  })
}

/**
 * 生成指标详情数据
 */
function generateIndicatorDetailData(
  params: IndicatorDetailQueryParams
): IndicatorDetailData {
  // 根据时间范围计算天数
  const startDate = new Date(params.timeRange.start)
  const endDate = new Date(params.timeRange.end)
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  // 生成趋势数据（传入指标类型）
  const trendData = generateTrendData(daysDiff, params.indicatorType)
  
  // 生成基础指标数据
  const baseIndicator = generateIndicatorData(params.indicatorType)
  
  // 判断指标类型：百分比类型使用平均值，其他类型使用总和
  const isPercentageType = baseIndicator.unit === '%'
  
  let displayValue: number
  let avgValue: number
  
  if (isPercentageType) {
    // 百分比类型：使用平均值
    displayValue = trendData.reduce((sum, point) => sum + point.value, 0) / daysDiff
    avgValue = displayValue // 平均值就是显示值
  } else {
    // 次数类型：使用总和
    const totalValue = trendData.reduce((sum, point) => sum + point.value, 0)
    displayValue = totalValue
    avgValue = totalValue / daysDiff
  }
  
  // 使用计算出的值替换随机值
  const indicator = {
    ...baseIndicator,
    value: Math.round(displayValue * 100) / 100,
    avgValue: Math.round(avgValue * 100) / 100,
    unit: baseIndicator.unit // 确保单位不被修改
  }
  
  // 只有当 dimensionType 不是 'NONE' 时才生成维度数据
  const dimensionData = params.dimensionType && params.dimensionType !== 'NONE' 
    ? generateDimensionData(params.dimensionType) 
    : undefined

  return {
    indicator,
    timeRange: params.timeRange,
    comparisonMode: params.comparisonMode,
    trendData,
    dimensionData
  }
}

/**
 * 生成报告列表
 */
function generateReportList(params: ReportListQueryParams): { rows: Report[]; total: number } {
  const reports: Report[] = []
  const total = 20
  const page = params.page || 1
  const pageSize = params.pageSize || 10

  for (let i = 0; i < Math.min(pageSize, total - (page - 1) * pageSize); i++) {
    const id = (page - 1) * pageSize + i + 1
    const type = i % 2 === 0 ? 'weekly' : 'monthly'
    const status = i % 3 === 0 ? 'generating' : i % 3 === 1 ? 'completed' : 'failed'

    reports.push({
      id,
      type,
      title: `${type === 'weekly' ? '周报' : '月报'} - ${new Date().toLocaleDateString()}`,
      status,
      timeRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        granularity: type === 'weekly' ? 'week' : 'month'
      },
      indicators: [
        generateIndicatorData('lead_frequency'),
        generateIndicatorData('new_customers')
      ],
      summary: '本周业绩表现良好，新客户获取数量增长明显。',
      createTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  return { rows: reports, total }
}

/**
 * 生成AI建议
 */
function generateAISuggestions(): AISuggestion[] {
  return [
    {
      id: 1,
      title: '提高客户拜访频次',
      content: '根据数据分析，您的客户拜访频次低于团队平均水平，建议增加拜访次数以提高转化率。',
      priority: 'high',
      relatedIndicators: ['visit_frequency', 'conversion_rate'],
      createTime: new Date().toISOString()
    },
    {
      id: 2,
      title: '优化跟进策略',
      content: '重点客户的拜访占比较低，建议优先安排重点客户的拜访计划。',
      priority: 'medium',
      relatedIndicators: ['key_customer_visit_ratio'],
      createTime: new Date().toISOString()
    },
    {
      id: 3,
      title: '缩短拜访周期',
      content: '客户拜访周期偏长，可能影响客户关系维护，建议缩短拜访间隔。',
      priority: 'low',
      relatedIndicators: ['visit_cycle'],
      createTime: new Date().toISOString()
    }
  ]
}

export default [
  {
    url: '/reports/dashboard',
    method: 'GET',
    response: (params: any) => {
      const query = params?.query || params?.dimensionFilter || params || {}
      return createMockResponse(generateDashboardData({ dimensionFilter: query.dimensionFilter || query }))
    }
  },
  {
    url: '/reports/indicator/detail',
    method: 'GET',
    response: (params: any) => {
      const query = params?.query || params || {}
      const result = generateIndicatorDetailData(query)
      return createMockResponse(result)
    }
  },
  {
    url: '/reports/report/list',
    method: 'GET',
    response: (params: any) => {
      const query = params?.query || params || {}
      const result = generateReportList(query)
      return createMockListResponse({ rows: result.rows, total: result.total })
    }
  },
  {
    url: '/reports/report/generate',
    method: 'POST',
    response: (params: any) => {
      const body = params?.body || params || {}
      return createMockResponse({ reportId: Math.floor(Math.random() * 10000) })
    }
  },
  {
    url: '/reports/report/:id',
    method: 'GET',
    response: (params: any) => {
      const id = params?.id || params?.query?.id || 1
      return createMockResponse({
        id,
        type: 'weekly',
        title: `周报 - ${new Date().toLocaleDateString()}`,
        status: 'completed',
        timeRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0],
          granularity: 'week'
        },
        indicators: [
          generateIndicatorData('lead_frequency'),
          generateIndicatorData('new_customers'),
          generateIndicatorData('conversion_rate')
        ],
        summary: '本周业绩表现良好，新客户获取数量增长明显。',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      })
    }
  },
  {
    url: '/reports/report/:id/export',
    method: 'POST',
    response: () => {
      return createMockResponse({ url: 'https://example.com/report.pdf' })
    }
  },
  {
    url: '/reports/report/:id/share',
    method: 'POST',
    response: () => {
      return createMockResponse(null)
    }
  },
  {
    url: '/reports/ai/suggestions',
    method: 'GET',
    response: () => {
      return createMockResponse(generateAISuggestions())
    }
  }
] as MockHandler[]
