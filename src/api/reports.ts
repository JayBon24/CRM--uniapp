/**
 * 报表系统API接口
 */
import { http } from '@/utils/request'
import type {
  DashboardData,
  DashboardQueryParams,
  IndicatorDetailData,
  IndicatorDetailQueryParams,
  Report,
  ReportListQueryParams,
  ReportGenerateParams,
  ReportExportParams,
  AISuggestion,
  DimensionFilter
} from '@/types/interfaces/reports'

// 统一解包响应数据
function unwrapData<T>(res: any): T {
  return (res && typeof res === 'object' && 'data' in res) ? (res.data as T) : (res as T)
}

/**
 * 获取看板数据
 * POST /customer/reports/dashboard
 */
export async function getDashboardData(params: DashboardQueryParams): Promise<DashboardData> {
  const res = await http.post<any>('/customer/reports/dashboard', params)
  return unwrapData<DashboardData>(res)
}

/**
 * 获取指标详情
 * POST /customer/reports/indicator/detail
 */

function clampComparisonTimeRange(params: IndicatorDetailQueryParams): IndicatorDetailQueryParams {
  if (!params || params.comparisonMode === 'none' || !params.timeRange) return params
  const clampDate = (dateStr: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
    if (!match) return dateStr
    const day = Math.min(28, Number(match[3]))
    const paddedDay = String(day).padStart(2, '0')
    return `${match[1]}-${match[2]}-${paddedDay}`
  }
  const nextRange = {
    ...params.timeRange,
    start: clampDate(params.timeRange.start),
    end: clampDate(params.timeRange.end)
  }
  return {
    ...params,
    timeRange: nextRange
  }
}

export async function getIndicatorDetail(
  params: IndicatorDetailQueryParams
): Promise<IndicatorDetailData> {
  const safeParams = clampComparisonTimeRange(params)
  const res = await http.post<any>('/customer/reports/indicator/detail', safeParams)
  return unwrapData<IndicatorDetailData>(res)
}

/**
 * 生成报告
 * POST /customer/reports/report/generate
 */
export async function generateReport(
  params: ReportGenerateParams
): Promise<{ reportId: number | string }> {
  const res = await http.post<any>('/customer/reports/report/generate', params)
  return unwrapData<{ reportId: number | string }>(res)
}

/**
 * 获取报告列表
 * GET /customer/reports/report/list
 */
export async function getReportList(
  params: ReportListQueryParams
): Promise<{ rows: Report[]; total: number }> {
  const res = await http.get<any>('/customer/reports/report/list', params)
  return unwrapData<{ rows: Report[]; total: number }>(res)
}

/**
 * 获取报告详情
 * GET /customer/reports/report/:id
 */
export async function getReportDetail(reportId: number | string): Promise<Report> {
  const res = await http.get<any>(`/customer/reports/report/${reportId}`)
  return unwrapData<Report>(res)
}

/**
 * 导出报告
 * POST /reports/report/:id/export
 */
export async function exportReport(reportId: number | string, format: 'pdf' | 'excel' = 'pdf'): Promise<{ url: string }> {
  const res = await http.post<any>(
    `/customer/reports/report/${reportId}/export`,
    { format }
  )
  return unwrapData<{ url: string }>(res)
}

/**
 * 分享报告
 * POST /reports/report/:id/share
 */
export async function shareReport(reportId: number | string, params: { userIds: number[]; message?: string }): Promise<void> {
  const res = await http.post<any>(`/customer/reports/report/${reportId}/share`, params)
  return unwrapData<void>(res)
}

/**
 * 获取AI建议
 * GET /reports/ai/suggestions
 */
export async function getAISuggestions(params: DimensionFilter): Promise<AISuggestion[]> {
  const res = await http.get<any>('/customer/reports/ai/suggestions', params)
  return unwrapData<AISuggestion[]>(res)
}
