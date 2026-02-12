/**
 * 案件管理 API
 */

import { http } from '@/utils/request'
import type { CaseListParams, CaseListResponse, Case } from '@/types/interfaces/case'

/**
 * 获取案件列表
 * 注意：小程序使用 /api/ 前缀，路径会由 request.ts 自动添加 /api 前缀
 */
export async function getCaseList(params: CaseListParams = {}): Promise<CaseListResponse> {
  const res = await http.get<any>('/case/cases/', params)
  
  // 处理不同的响应格式
  // 格式1: {code: 2000, data: {count, results}} - 标准API响应
  // 格式2: {count, results, next, previous} - DRF分页格式
  // 格式3: 直接返回数组格式
  const finalData = res.data || res
  
  return finalData
}

/**
 * 获取案件详情
 * 注意：小程序使用 /api/ 前缀，路径会由 request.ts 自动添加 /api 前缀
 */
export async function getCaseDetail(id: number | string): Promise<Case> {
  const res = await http.get<any>(`/case/cases/${id}/`)
  return res.data || res
}

/**
 * 搜索案件（用于选择器）
 */
export async function searchCases(keyword: string, limit: number = 20): Promise<Case[]> {
  const res = await getCaseList({
    search: keyword,
    limit,
    page: 1
  })
  return res.results || []
}
