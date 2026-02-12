/**
 * 客户律师费用相关类型定义
 */
import type { AiExtensionFields, AiAttachment } from './ai'

/**
 * 律师费用记录
 */
export interface ClientLegalFee {
  id: number | string
  client_id: number | string
  
  // 费用信息
  pay_time: string
  amount: number
  method?: string // 支付方式（可选）
  
  // 凭证
  voucher_attachments: AiAttachment[]
  
  // 备注
  remark?: string
  
  // 创建信息
  creator_id?: number | string
  creator_name?: string
  create_time: string
  update_time?: string
}

/**
 * 律师费用创建参数
 */
export interface ClientLegalFeeCreateParams extends AiExtensionFields {
  client_id: number | string
  pay_time: string
  amount: number
  method?: string
  voucher_attachments: AiAttachment[]
  remark?: string
}

