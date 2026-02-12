/**
 * AI 相关扩展字段接口
 */
export interface AiExtensionFields {
  /**
   * AI 追溯 ID，用于关联特定的 AI 会话或建议
   */
  trace_id?: string
  
  /**
   * 来源标识（例如 'ai_chat', 'ai_extract', 'manual'）
   */
  ai_source?: string
}

/**
 * 附件结构（统一 AI 处理后的附件信息）
 */
export interface AiAttachment {
  attachment_id?: string | number
  url: string
  name: string
  mime?: string
  size?: number
  hash?: string
  storage_key?: string
  preview_url?: string
  biz_type?: string
  biz_id?: string | number
  
  // AI 预留：是否已入知识库
  is_ingested?: boolean
}
