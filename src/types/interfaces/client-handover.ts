/**
 * 客户转交相关类型定义
 */
import type { AiExtensionFields, AiAttachment } from './ai'

/**
 * 转交状态
 */
export type HandoverStatus = 'pending' | 'approved' | 'rejected'

/**
 * 转交记录/日志
 */
export interface ClientHandover {
  id: number | string
  client_id: number | string
  
  // 转交信息
  from_owner_id: number | string
  from_owner_name?: string
  to_owner_id?: number | string
  to_owner_name?: string
  to_owner_ids?: Array<number | string>
  to_owner_names?: string[]
  reason: string
  
  // 审批信息
  status: HandoverStatus
  approver_id?: number | string
  approver_name?: string
  approval_reason?: string
  approval_time?: string
  
  // 附件
  attachments?: AiAttachment[]
  
  // 备注
  remark?: string
  
  // 创建信息
  create_time: string
  update_time?: string
}

export interface ClientHandoverLog {
  id: number | string
  client_id: number | string
  from_user_id?: number | string
  from_user_name?: string
  to_user_id?: number | string
  to_user_name?: string
  to_user_ids?: Array<number | string>
  to_user_names?: string[]
  transfer_reason?: string
  status?: HandoverStatus | 'completed'
  create_time?: string
  approver_name?: string
  approval_time?: string
}

/**
 * 转交申请参数
 */
export interface ClientHandoverApplyParams extends AiExtensionFields {
  client_id: number | string
  to_owner_ids: Array<number | string>
  transfer_mode?: 'append' | 'replace'
  reason: string
  remark?: string
  attachments?: AiAttachment[]
}

/**
 * 转交审批参数
 */
export interface ClientHandoverApprovalParams {
  handover_id: number | string
  approved: boolean
  reason?: string
}

