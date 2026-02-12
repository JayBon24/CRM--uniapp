/**
 * 客户管理相关类型定义
 */
import type { AiExtensionFields } from './ai'

/**
 * 客户生命周期状态：
 * 公海、跟进、交案、回款、赢单
 */
export type ClientStatus = 'PUBLIC_POOL' | 'FOLLOW_UP' | 'CASE' | 'PAYMENT' | 'WON'

/**
 * 展业状态（派生字段，由后端计算返回）：
 * 公海、空白、面谈、交案、回款、赢单
 */
export type SalesStage = 'PUBLIC_POOL' | 'BLANK' | 'MEETING' | 'CASE' | 'PAYMENT' | 'WON'

/**
 * 客户页悬浮球快捷动作
 */
export type QuickActionType =
  | 'FOLLOWUP_RECORD'
  | 'VALID_CASE'
  | 'CONFIRM_CONTRACT'
  | 'CASE_PLAN'
  | 'ADD_PAYMENT'
  | 'PAYMENT_FOLLOWUP'
  | 'ADD_LEGAL_FEE'
  | 'COLLECTION_PROGRESS'

/**
 * 客户等级
 */
export type ClientGrade = 'A' | 'B' | 'C' | 'D'

/**
 * 客户类别
 */
export type ClientCategory = 'construction' | 'material'

/**
 * 客户等级来源
 */
export type GradeSource = 'ai' | 'manual'

/**
 * 催收类别
 */
export type CollectionCategory = 'arbitration' | 'mediation' | 'litigation'

/**
 * 保全状态
 */
export type PreservationStatus = 'preserved' | 'not_preserved'

/**
 * 回收风险等级
 */
export type RecycleRiskLevel = 'none' | 'low' | 'medium' | 'high'

/**
 * 客户列表项（列表页展示）
 */
export interface ClientListItem {
  id: number | string
  customer_id?: number | string
  customer_name?: string
  case_id?: number | string
  case_name?: string
  case_number?: string
  display_name?: string
  status: ClientStatus
  sales_stage: SalesStage
  client_name: string
  contact_name?: string
  mobile?: string
  region?: string
  
  // AI/人工标记
  grade?: ClientGrade
  grade_source?: GradeSource
  category?: ClientCategory
  collection_category?: CollectionCategory[]
  collection_source?: GradeSource
  preservation_status?: PreservationStatus
  court?: string
  lawyer?: string
  
  // 经办人与组织
  owner_user_id: number | string
  owner_user_name?: string
  handler_ids?: Array<number | string>
  handler_names?: string[]
  handlers?: Array<{ id: number | string; name: string }>
  org_scope?: string
  team_id?: number | string
  team_name?: string
  branch_id?: number | string
  branch_name?: string
  
  // 列表统计字段（后端返回）
  followup_count: number
  valid_followup_count?: number
  visit_count: number
  valid_visit_count: number
  
  // 列表聚合字段（后端返回）
  last_followup_at?: string
  last_visit_at?: string
  next_plan_at?: string
  recycle_risk_level: RecycleRiskLevel
  recycle_deadline?: string
  last_deal_time?: string

  // 案件统计（案源清单）
  total_cases?: number
  case_count?: number
  payment_count?: number
  won_count?: number
  
  // 时间戳
  create_time?: string
  update_time?: string
}

export interface CaseSummary {
  id: number | string
  case_name?: string
  case_number?: string
  case_type?: string
  status?: ClientStatus
  sales_stage?: SalesStage
  create_time?: string
  update_time?: string
}

export interface CaseStatistics {
  total: number
  follow_up: number
  case: number
  payment: number
  won: number
}

/**
 * 客户详情
 */
export interface ClientDetail extends ClientListItem {
  source_channel?: string
  referrer?: string
  demand_summary?: string
  cases?: CaseSummary[]
  case_statistics?: CaseStatistics
  
  // 完整 AI 标记信息
  ai_tags?: {
    grade?: {
      value: ClientGrade
      source: GradeSource
      updated_at?: string
      updated_by?: string
    }
    collection_category?: {
      value: CollectionCategory[]
      primary?: CollectionCategory
      source: GradeSource
      updated_at?: string
    }
    preservation_status?: {
      value: PreservationStatus
      progress?: string
      updated_at?: string
    }
    court?: {
      value: string
      candidates?: string[]
      updated_at?: string
    }
    lawyer?: {
      value: string
      updated_at?: string
    }
  }
}

/**
 * 客户创建参数
 */
export interface ClientCreateParams extends AiExtensionFields {
  client_name: string
  contact_name?: string
  mobile?: string
  region?: string
  source_channel?: string
  referrer?: string
  demand_summary?: string
  owner_user_id?: number | string // 默认当前人；管理可改
  handler_ids?: Array<number | string>
  grade?: ClientGrade
  category?: ClientCategory
  last_deal_time?: string
  collection_category?: CollectionCategory[] | CollectionCategory
  grade_source?: GradeSource
  collection_source?: GradeSource
}

export interface OwnerCustomerItem {
  id: number | string
  name: string
  contact_person?: string
  contact_phone?: string
  address?: string
  status?: ClientStatus
  sales_stage?: SalesStage
}

export interface CreateClientWithCaseParams {
  customer_id: number | string
  case_name?: string
  case_type?: string
  case_description?: string
  plaintiff_name?: string
  plaintiff_credit_code?: string
  plaintiff_address?: string
  plaintiff_legal_representative?: string
  defendant_name?: string
  defendant_credit_code?: string
  defendant_address?: string
  defendant_legal_representative?: string
  contract_amount?: string | number
  lawyer_fee?: string | number
  litigation_request?: string
  facts_and_reasons?: string
  jurisdiction?: string
  filing_date?: string
  petitioner?: string
  draft_person?: string
}

/**
 * 客户更新参数
 */
export interface ClientUpdateParams extends Partial<ClientCreateParams>, AiExtensionFields {
  id: number | string
}

/**
 * 客户列表查询参数
 */
export interface ClientListParams {
  // 分段筛选
  status?: ClientStatus
  sales_stage?: SalesStage
  sales_stage_list?: SalesStage[]
  
  // 搜索
  keyword?: string
  
  // 筛选
  grade?: ClientGrade
  collection_category?: CollectionCategory | CollectionCategory[]
  owner_user_id?: number | string | Array<number | string>
  team_id?: number | string
  branch_id?: number | string
  recycle_risk_level?: RecycleRiskLevel
  
  // 排序
  order_by?: 'last_followup' | 'create_time' | 'last_visit'
  order_direction?: 'asc' | 'desc'
  
  // 分页
  page?: number
  pageSize?: number
}

/**
 * 客户列表响应
 */
export interface ClientListResponse {
  rows: ClientListItem[]
  total: number
  page: number
  pageSize: number
}

/**
 * 客户申领参数
 */
export interface ClientApplyParams {
  client_id: number | string
  reason?: string
}

/**
 * 客户分配参数
 */
export interface ClientAssignParams {
  client_id: number | string
  owner_user_id?: number | string
  handler_ids?: Array<number | string>
  reason?: string
}

/**
 * 审批参数
 */
export interface ApprovalParams {
  apply_id: number | string
  approved: boolean
  reason?: string
}
