/**
 * 案件管理相关类型定义
 */

// 案件类型
export type CaseType = 'civil' | 'criminal' | 'administrative' | 'other'

// 案件状态
export type CaseStatus = 'draft' | 'in_progress' | 'closed' | 'archived'

// 案件基本信息
export interface Case {
  id: number
  case_number: string
  case_name: string
  case_type: CaseType
  case_status: CaseStatus
  case_description?: string
  plaintiff_name?: string
  defendant_name?: string
  draft_person?: string
  customer_id?: number | string
  customer_name?: string
  owner_user_id?: number | string
  owner_user_name?: string
  handler_ids?: Array<number | string>
  handler_names?: string[]
  handlers?: Array<{ id: number | string; name: string }>
  create_datetime: string
  update_datetime: string
  is_deleted: boolean
}

// 案件列表查询参数
export interface CaseListParams {
  page?: number
  limit?: number
  case_type?: CaseType
  case_status?: CaseStatus
  draft_person?: string
  search?: string
  ordering?: string
}

// 案件列表响应
export interface CaseListResponse {
  count: number
  next?: string
  previous?: string
  results: Case[]
}
