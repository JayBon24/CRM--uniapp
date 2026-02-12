/**
 * 报表系统类型定义
 */

/**
 * 用户角色层级
 */
export type UserRoleLevel = 'SALES' | 'TEAM' | 'BRANCH' | 'HQ'

/**
 * 数据范围
 */
export type DataScope = 'SELF' | 'TEAM' | 'BRANCH' | 'HQ'

/**
 * 维度类型
 */
export type DimensionType = 'PERSONNEL' | 'BRANCH' | 'SOURCE' | 'GRADE' | 'CATEGORY' | 'NONE'

/**
 * 时间粒度
 */
export type TimeGranularity = 'day' | 'week' | 'month' | 'quarter' | 'year'

/**
 * 对比模式
 */
export type ComparisonMode = 'yoy' | 'mom' | 'none'

/**
 * 指标类型
 */
export type IndicatorType =
  | 'lead_frequency' // 跟进频次
  | 'new_customers' // 新客户获取
  | 'conversion_rate' // 有效线索转化率
  | 'visit_frequency' // 客户拜访频次
  | 'key_customer_visit_ratio' // 重点客户拜访占比
  | 'visit_success_rate' // 拜访成功率
  | 'avg_conversation_duration' // 单客户平均洽谈时长
  | 'visit_cycle' // 客户拜访周期
  | 'conversion_funnel' // 客户转化漏斗

/**
 * 维度筛选
 */
export interface DimensionFilter {
  scope: DataScope
  dimension?: DimensionType
  userId?: number | string
  branchId?: number | string
}

/**
 * 时间范围
 */
export interface TimeRange {
  start: string
  end: string
  granularity: TimeGranularity
}

/**
 * 指标数据
 */
export interface IndicatorData {
  type: IndicatorType
  value: number // 总值
  avgValue?: number // 平均值（可选）
  unit: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  trendPercent?: number
  breakdown?: IndicatorBreakdown[]
}

/**
 * 指标拆分数据
 */
export interface IndicatorBreakdown {
  label: string
  value: number
  percent?: number
}

/**
 * 看板数据
 */
export interface DashboardData {
  indicators: IndicatorData[]
  conversionFunnel: FunnelData
  updateTime: string
}

/**
 * 漏斗数据
 */
export interface FunnelData {
  stages: FunnelStage[]
}

export interface FunnelStage {
  name: string
  value: number
  percent: number
}

/**
 * 指标详情数据
 */
export interface IndicatorDetailData {
  indicator: IndicatorData
  timeRange: TimeRange
  comparisonMode: ComparisonMode
  trendData: TrendDataPoint[]
  dimensionData?: DimensionDataPoint[]
}

/**
 * 趋势数据点
 */
export interface TrendDataPoint {
  time: string
  value: number
  comparisonValue?: number
}

/**
 * 维度数据点
 */
export interface DimensionDataPoint {
  label: string
  value: number
  percent: number
}

/**
 * 报告类型
 */
export type ReportType = 'weekly' | 'monthly'

/**
 * 报告状态
 */
export type ReportStatus = 'generating' | 'completed' | 'failed'

/**
 * 报告数据
 */
export interface Report {
  id: number | string
  type: ReportType
  title: string
  status: ReportStatus
  timeRange: TimeRange
  indicators: IndicatorData[]
  summary?: string
  createTime: string
  updateTime: string
}

/**
 * 报告生成参数
 */
export interface ReportGenerateParams {
  type: ReportType
  timeRange: TimeRange
  dimensionFilter: DimensionFilter
}

/**
 * 报告导出参数
 */
export interface ReportExportParams {
  reportId: number | string
  format: 'excel' | 'pdf'
}

/**
 * AI建议
 */
export interface AISuggestion {
  id: number | string
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  relatedIndicators: IndicatorType[]
  createTime: string
}

/**
 * 查询参数
 */
export interface DashboardQueryParams {
  dimensionFilter: DimensionFilter
}

export interface IndicatorDetailQueryParams {
  indicatorType: IndicatorType
  timeRange: TimeRange
  comparisonMode: ComparisonMode
  dimensionFilter: DimensionFilter
  dimensionType?: DimensionType
}

export interface ReportListQueryParams {
  type?: ReportType
  status?: ReportStatus
  page?: number
  pageSize?: number
}
