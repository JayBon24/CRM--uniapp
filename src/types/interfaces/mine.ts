import type { UserRoleLevel, OrgScope } from './user'
import type { ClientCreateParams } from './client'

export type FeedbackType = 'bug' | 'suggestion' | 'ai_tag_feedback'
export type FeedbackStatus = 'open' | 'processing' | 'resolved'

export interface FeedbackContext {
  client_id?: string
  field?: string
}

export interface FeedbackTicket {
  id: string
  type: FeedbackType
  content: string
  images?: string[]
  contact?: string
  context?: FeedbackContext
  status: FeedbackStatus
  created_at: string
}

// 设置：仅提前量（分钟）
export type RemindAdvanceMinutes = 15 | 30

export interface ReminderPreference {
  default_remind_advance_minutes: RemindAdvanceMinutes
}

// 审批中心
export type ApprovalType = 'LEAD_CLAIM' | 'LEAD_CREATE' | 'CLIENT_TRANSFER' | 'HANDOVER'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface ApprovalHistoryItem {
  step_role: UserRoleLevel
  approver_user_id: string
  approver_user_name: string
  decision: 'approved' | 'rejected'
  reject_reason?: string
  decided_at: string
}

export interface LeadClaimPayload {
  client_id: string
  name: string
  reason: string
}

export interface LeadCreatePayload {
  form: ClientCreateParams
}

export interface ClientTransferPayload {
  client_id: string
  from_user: { id: string; name: string }
  to_user: { id: string; name: string }
  reason: string
}

export type ApprovalPayload =
  | { type: 'LEAD_CLAIM'; payload: LeadClaimPayload }
  | { type: 'LEAD_CREATE'; payload: LeadCreatePayload }
  | { type: 'CLIENT_TRANSFER'; payload: ClientTransferPayload }
  | { type: 'HANDOVER'; payload: ClientTransferPayload }

export interface ApprovalTaskBase {
  id: string
  type: ApprovalType
  status: ApprovalStatus
  applicant_user_id: string
  applicant_user_name: string
  client_id?: string
  client_name?: string
  created_at: string
  approved_at?: string
  reject_reason?: string

  // 中文注释：层层审批（TEAM → BRANCH → HQ）
  approval_chain: UserRoleLevel[]
  current_step_index: number
  current_approver_role: UserRoleLevel
  history: ApprovalHistoryItem[]
}

export type ApprovalTask =
  | (ApprovalTaskBase & { type: 'LEAD_CLAIM'; payload: LeadClaimPayload })
  | (ApprovalTaskBase & { type: 'LEAD_CREATE'; payload: LeadCreatePayload })
  | (ApprovalTaskBase & { type: 'CLIENT_TRANSFER'; payload: ClientTransferPayload })
  | (ApprovalTaskBase & { type: 'HANDOVER'; payload: ClientTransferPayload })

export interface MineProfile {
  user_id: string
  name: string
  avatar?: string
  roleLevel: UserRoleLevel
  orgScope: OrgScope
  teamName?: string
  branchName?: string
  email?: string
  phonenumber?: string
  deptId?: number | string | null
  deptName?: string
}

