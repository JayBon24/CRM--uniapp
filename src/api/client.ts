/**
 * 客户管理 API
 */

import { http } from '@/utils/request'
import type {
  ClientListParams,
  ClientListResponse,
  ClientDetail,
  ClientCreateParams,
  ClientUpdateParams,
  ClientApplyParams,
  ClientAssignParams,
  ApprovalParams,
  CreateClientWithCaseParams,
  OwnerCustomerItem
} from '@/types/interfaces/client'
import type { ClientFollowup, ClientFollowupCreateParams } from '@/types/interfaces/client-followup'
import type { ClientVisit, ClientVisitCreateParams } from '@/types/interfaces/client-visit'
import type { ClientPlan, ClientPlanCreateParams, ClientPlanUpdateParams } from '@/types/interfaces/client-plan'
import type { CollectionProgress, CollectionProgressCreateParams } from '@/types/interfaces/client-collection-progress'
import type { ClientContract, ClientContractConfirmParams } from '@/types/interfaces/client-contract'
import type { ClientPayment, ClientPaymentCreateParams } from '@/types/interfaces/client-payment'
import type { ClientLegalFee, ClientLegalFeeCreateParams } from '@/types/interfaces/client-legal-fee'
import type {
  ClientHandover,
  ClientHandoverApplyParams,
  ClientHandoverApprovalParams,
  ClientHandoverLog
} from '@/types/interfaces/client-handover'
import type { ClientContact, ClientContactCreateParams } from '@/types/interfaces/client-contacts'

// 中文注释：本项目的 request/http 默认返回整包响应（含 code/msg/data），
// Tab1 模块在 API 层统一解包 data，避免 store/页面处理响应格式差异。
function unwrapData<T>(res: any): T {
  return (res && typeof res === 'object' && 'data' in res) ? (res.data as T) : (res as T)
}

/**
 * 获取客户列表
 */
export async function getClientList(params: ClientListParams): Promise<ClientListResponse> {
  const res = await http.get<any>('/crm/client/list', params)
  return unwrapData<ClientListResponse>(res)
}

/**
 * 获取案源清单（客户维度 + 案件统计）
 */
export async function getCaseSourceList(params: ClientListParams): Promise<ClientListResponse> {
  const res = await http.get<any>('/crm/client/case-source-list', params)
  return unwrapData<ClientListResponse>(res)
}

/**
 * 获取当前用户经办客户（用于案件新增检索）
 */
export async function getOwnerCustomers(params: { keyword?: string }): Promise<OwnerCustomerItem[]> {
  const res = await http.get<any>('/crm/client/owner-customers', params)
  return unwrapData<OwnerCustomerItem[]>(res)
}

/**
 * 获取客户详情
 */
export async function getClientDetail(id: number | string): Promise<ClientDetail> {
  const res = await http.get<any>(`/crm/client/${id}`)
  return unwrapData<ClientDetail>(res)
}

/**
 * 创建客户/线索
 */
export function createClient(data: ClientCreateParams) {
  return http.post('/crm/client', data)
}

/**
 * 老客立案（新增案件）
 */
export function createClientWithCase(data: CreateClientWithCaseParams) {
  return http.post('/crm/client/create-with-case', data)
}

/**
 * 更新客户信息
 */
export function updateClient(data: ClientUpdateParams) {
  return http.put(`/crm/client/${data.id}`, data)
}

/**
 * 申领公海客户
 */
export function applyClient(data: ClientApplyParams) {
  return http.post(`/crm/client/${data.client_id}/apply`, data)
}

/**
 * 申领公海客户（别名：兼容旧调用）
 * 中文注释：部分页面/Store 使用 claimClient 命名，这里做一层兼容，避免运行时导入报错
 */
export function claimClient(clientId: number | string) {
  return applyClient({ client_id: clientId } as ClientApplyParams)
}

/**
 * 分配客户（管理权限）
 */
export function assignClient(data: ClientAssignParams) {
  return http.post(`/crm/client/${data.client_id}/assign`, data)
}

/**
 * 审批客户申领
 */
export function approveClientApply(data: ApprovalParams) {
  return http.post(`/crm/client/approve/${data.apply_id}`, data)
}

// ============ 跟进记录相关 ============

/**
 * 创建跟进记录
 */
export function createFollowup(data: ClientFollowupCreateParams) {
  return http.post('/crm/client/followup', data)
}

/**
 * 获取跟进记录列表
 */
export async function getFollowupList(clientId: number | string): Promise<{ rows: ClientFollowup[]; total: number }> {
  const res = await http.get<any>(`/crm/client/${clientId}/followup`)
  return unwrapData<{ rows: ClientFollowup[]; total: number }>(res)
}

// ============ 拜访记录相关 ============

/**
 * 创建拜访记录
 */
export function createVisit(data: ClientVisitCreateParams) {
  return http.post('/crm/client/visit', data)
}

/**
 * 获取拜访记录列表
 */
export async function getVisitList(clientId: number | string): Promise<{ rows: ClientVisit[]; total: number }> {
  const res = await http.get<any>(`/crm/client/${clientId}/visit`)
  return unwrapData<{ rows: ClientVisit[]; total: number }>(res)
}

// ============ 跟进计划相关 ============

/**
 * 创建跟进计划
 */
export function createPlan(data: ClientPlanCreateParams) {
  return http.post('/crm/client/plan', data)
}

/**
 * 更新跟进计划
 */
export function updatePlan(data: ClientPlanUpdateParams) {
  return http.put(`/crm/client/plan/${data.id}`, data)
}

/**
 * 获取跟进计划列表
 */
export async function getPlanList(clientId: number | string): Promise<{ rows: ClientPlan[]; total: number }> {
  const res = await http.get<any>(`/crm/client/${clientId}/plan`)
  return unwrapData<{ rows: ClientPlan[]; total: number }>(res)
}

// ============ 收款进度相关 ============

export async function getCollectionProgressList(clientId: number | string): Promise<{ rows: CollectionProgress[]; total: number }> {
  const res = await http.get<any>(`/crm/client/${clientId}/collection-progress`)
  return unwrapData<{ rows: CollectionProgress[]; total: number }>(res)
}

export function createCollectionProgress(data: CollectionProgressCreateParams) {
  return http.post('/crm/client/collection-progress', data)
}

// ============ 合同相关 ============

/**
 * 确认合同
 */
export function confirmContract(data: ClientContractConfirmParams) {
  return http.post('/crm/client/contract', data)
}

/**
 * 获取合同列表
 */
export async function getContractList(clientId: number | string): Promise<ClientContract[]> {
  const res = await http.get<any>(`/crm/client/${clientId}/contracts`)
  const data = unwrapData<any>(res)
  // 后端返回格式为 {results: [...], total: ...}，需要提取 results
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results || []
  }
  return Array.isArray(data) ? data : []
}

// ============ 回款记录相关 ============

/**
 * 创建回款记录
 */
export function createPayment(data: ClientPaymentCreateParams) {
  return http.post('/crm/client/payment', data)
}

/**
 * 获取回款记录列表
 */
export async function getPaymentList(clientId: number | string): Promise<ClientPayment[]> {
  const res = await http.get<any>(`/crm/client/${clientId}/recovery-payments`)
  const data = unwrapData<any>(res)
  // 后端返回格式为 {results: [...], total: ...}，需要提取 results
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results || []
  }
  return Array.isArray(data) ? data : []
}

// ============ 律师费用相关 ============

/**
 * 创建律师费用记录
 */
export function createLegalFee(data: ClientLegalFeeCreateParams) {
  return http.post('/crm/client/legal-fee', data)
}

/**
 * 获取律师费用列表
 */
export async function getLegalFeeList(clientId: number | string): Promise<ClientLegalFee[]> {
  const res = await http.get<any>(`/crm/client/${clientId}/legal-fees`)
  const data = unwrapData<any>(res)
  // 后端返回格式为 {results: [...], total: ...}，需要提取 results
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results || []
  }
  return Array.isArray(data) ? data : []
}

// ============ 转交相关 ============

/**
 * 申请客户转交
 */
export function applyHandover(data: ClientHandoverApplyParams) {
  return http.post('/crm/client/handover', data)
}

/**
 * 审批客户转交
 */
export function approveHandover(data: ClientHandoverApprovalParams) {
  return http.post(`/crm/client/handover/${data.handover_id}/approve`, data)
}

/**
 * 获取转交日志
 */
export async function getHandoverLog(clientId: number | string): Promise<ClientHandover[]> {
  const res = await http.get<any>(`/crm/client/${clientId}/handover`)
  return unwrapData<ClientHandover[]>(res)
}

/**
 * 获取客户转交历史（日志）
 */
export async function getTransferLogList(clientId: number | string): Promise<{ results: ClientHandoverLog[]; total: number }> {
  const res = await http.get<any>(`/crm/client/${clientId}/transfer-logs`)
  return unwrapData<{ results: ClientHandoverLog[]; total: number }>(res)
}

// ============ 客户联系人相关 ============

/**
 * 获取客户联系人列表
 */
export async function getClientContacts(clientId: number | string): Promise<ClientContact[]> {
  const res = await http.get<any>(`/crm/client/${clientId}/contacts`)
  return unwrapData<ClientContact[]>(res)
}

/**
 * 创建客户联系人
 */
export function createClientContact(data: ClientContactCreateParams) {
  return http.post('/crm/client/contacts', data)
}

/**
 * 根据公司名称查询统一社会信用代码
 */
export async function getCompanyCreditCode(companyName: string): Promise<{
  company_name: string
  candidates: Array<{
    name: string
    credit_code: string
    legal_representative?: string
    address?: string
    status?: string
  }>
  count: number
}> {
  const res = await http.get<any>('/crm/company/credit-code', { company_name: companyName })
  return unwrapData(res)
}

// ============ 提醒相关 ============
export async function getReminderList(params: {
  page?: number
  pageSize?: number
  reminder_type?: string
  is_read?: boolean | number | string
}) {
  return http.get('/crm/reminders', params)
}

export async function markReminderRead(id: number | string) {
  return http.post(`/crm/reminders/${id}/read/`)
}

export async function triggerReminderScan() {
  return http.post('/crm/reminders/scan/')
}

export async function getUnreadReminderCount() {
  return http.get('/crm/reminders/unread-count/')
}
