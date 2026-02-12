/**
 * 客户回款相关类型定义
 */
import type { AiExtensionFields, AiAttachment } from './ai'
import type { CollectionCategory } from './client'

/**
 * 回款记录
 */
export interface ClientPayment {
  id: number | string
  client_id: number | string
  
  // 回款信息
  pay_time: string
  amount: number
  collection_category: CollectionCategory // 催收类别（仲裁/调解/诉讼）
  
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
 * 回款创建参数
 */
export interface ClientPaymentCreateParams extends AiExtensionFields {
  client_id: number | string
  pay_time: string
  amount: number
  collection_category: CollectionCategory
  voucher_attachments: AiAttachment[]
  remark?: string
}

