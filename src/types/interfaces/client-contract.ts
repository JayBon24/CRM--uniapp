/**
 * 客户合同相关类型定义
 */
import type { AiExtensionFields, AiAttachment } from './ai'

/**
 * 合同
 */
export interface ClientContract {
  id: number | string
  client_id: number | string
  
  // 合同基本信息（一期最小字段）
  contract_no: string
  amount: number
  term: string // 期限
  service_type: string
  client_subject: string // 客户主体
  contract_amount?: number
  start_date?: string
  end_date?: string
  client_entity?: string
  
  // 附件
  attachments: AiAttachment[]
  
  // 关联案件（一期最小字段）
  case_id?: number | string
  case_name?: string
  case_type?: string
  case_status?: string
  case_no?: string
  
  // 创建信息
  creator_id?: number | string
  creator_name?: string
  create_time: string
  update_time?: string
}

/**
 * 合同确认参数
 */
export interface ClientContractConfirmParams extends AiExtensionFields {
  client_id: number | string
  contract_no: string
  amount?: number
  term?: string
  contract_amount?: number
  start_date?: string
  end_date?: string
  service_type: string
  client_subject?: string
  client_entity?: string
  attachments: AiAttachment[]
  
  // 案件基本信息（可选）
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
  lawyer_fee?: number
  litigation_request?: string
  facts_and_reasons?: string
  jurisdiction?: string
  filing_date?: string
  petitioner?: string
  draft_person?: string
}

