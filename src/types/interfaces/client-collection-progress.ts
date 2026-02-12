/**
 * 收款进度相关类型定义
 */
import type { AiExtensionFields } from './ai'

export type CollectionProgressMode = 'average' | 'manual'

export interface CollectionInstallment {
  amount?: number
  time?: string
}

export interface CollectionProgress {
  id: number | string
  client_id: number | string
  total_amount: number
  installment_count: number
  mode: CollectionProgressMode
  installments: CollectionInstallment[]
  remind_method?: 'system' | 'sms' | 'email'
  remind_advance?: number
  sync_to_schedule?: boolean
  create_time: string
}

export interface CollectionProgressCreateParams extends AiExtensionFields {
  client_id: number | string
  total_amount: number
  installment_count: number
  mode: CollectionProgressMode
  installments: CollectionInstallment[]
  remind_method?: 'system' | 'sms' | 'email'
  remind_advance?: number
  sync_to_schedule?: boolean
}
