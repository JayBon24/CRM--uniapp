/**
 * 客户拜访相关类型定义
 */
import type { AiExtensionFields, AiAttachment } from './ai'

/**
 * 定位状态
 */
export type LocationStatus = 'success' | 'fail' | 'denied' | 'offline'

/**
 * 拜访记录
 */
export interface ClientVisit {
  id: number | string
  client_id: number | string
  
  // 时间与时长
  visit_time: string
  duration?: number // 洽谈时长（分钟）
  
  // 地点与定位
  location_status: LocationStatus
  lng?: number
  lat?: number
  address?: string
  
  // 参与人员（结构化）
  system_users: number[] // 内部参与人员 ID 列表
  system_users_info?: Array<{
    id: number
    name: string
    avatar?: string
  }>
  
  client_contacts: Array<number | string | { id?: number | string; name: string; mobile?: string }> // 客户方参与人员
  client_contacts_info?: Array<{
    id?: number | string
    name: string
    mobile?: string
    position?: string
  }>
  
  // 核心价值信息
  value_info: string // 诉求/项目进展/竞争对手/意向等
  
  // 附件
  attachments?: AiAttachment[]
  
  // 创建信息
  creator_id?: number | string
  creator_name?: string
  create_time: string
  update_time?: string
}

/**
 * 拜访创建参数
 */
export interface ClientVisitCreateParams extends AiExtensionFields {
  client_id: number | string
  visit_time: string
  duration?: number
  location_status: LocationStatus
  lng?: number
  lat?: number
  address?: string
  system_users: number[]
  client_contacts: Array<number | string | { name: string; mobile?: string }>
  value_info: string
  attachments?: AiAttachment[]
}

