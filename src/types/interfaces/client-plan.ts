/**
 * 客户计划相关类型定义
 */
import type { AiExtensionFields } from './ai'

export type ClientPlanType = 'effective_case' | 'case_plan' | 'payment_followup'

export interface ClientPlan {
  id: number | string
  client_id: number | string
  plan_type: ClientPlanType
  title: string
  time_points: string[]

  remind_method?: 'system' | 'sms' | 'email'
  remind_advance?: number
  sync_to_schedule?: boolean

  status?: 'pending' | 'completed' | 'cancelled'
  is_completed?: boolean

  extra_data?: Record<string, any>

  create_time: string
  update_time?: string

  // 兼容字段（旧页面使用）
  plan_content?: string
  plan_time?: string
  reminder_enabled?: boolean
  reminder_minutes?: number
}

export interface ClientPlanCreateParams extends AiExtensionFields {
  client_id: number | string
  plan_type: ClientPlanType
  title: string
  time_points: string[]
  remind_method?: 'system' | 'sms' | 'email'
  remind_advance?: number
  sync_to_schedule?: boolean
  extra_data?: Record<string, any>
}

export interface ClientPlanUpdateParams extends Partial<ClientPlanCreateParams>, AiExtensionFields {
  id: number | string
  status?: 'pending' | 'completed' | 'cancelled'
}
