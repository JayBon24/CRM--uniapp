/**
 * 客户跟进相关类型定义
 */
import type { AiExtensionFields, AiAttachment } from './ai'

export type FollowupType = 'phone' | 'wechat' | 'meeting' | 'email' | 'other'

export interface FollowupParticipant {
  id?: number | string
  name?: string
  [key: string]: any
}

export interface ClientFollowup {
  id: number | string
  client_id: number | string

  time: string
  type: FollowupType
  summary: string
  conclusion?: string
  method_other?: string

  next_plan_at?: string

  duration?: number
  location_status?: string
  address?: string
  lng?: number
  lat?: number

  internal_participants?: FollowupParticipant[]
  customer_participants?: FollowupParticipant[]
  attachments?: AiAttachment[]

  creator_id?: number | string
  creator_name?: string
  create_time: string
  update_time?: string
}

export interface ClientFollowupCreateParams extends AiExtensionFields {
  client_id: number | string
  time: string
  type: FollowupType
  summary: string
  conclusion?: string
  method_other?: string
  next_plan_at?: string

  duration?: number
  location_status?: string
  address?: string
  lng?: number
  lat?: number

  internal_participants?: FollowupParticipant[]
  customer_participants?: FollowupParticipant[]
  attachments?: AiAttachment[]
}
