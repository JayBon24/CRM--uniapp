/**
 * 客户联系人相关类型定义
 */

/**
 * 客户联系人（外部参与人员）
 */
export interface ClientContact {
  id: number | string
  client_id: number | string
  
  // 联系人信息
  name: string
  mobile?: string
  position?: string // 职位
  email?: string
  wechat?: string
  
  // 是否主要联系人
  is_primary?: boolean
  
  // 备注
  remark?: string
  
  // 创建信息
  creator_id?: number | string
  creator_name?: string
  create_time: string
  update_time?: string
}

/**
 * 联系人创建参数
 */
export interface ClientContactCreateParams {
  client_id: number | string
  name: string
  mobile?: string
  position?: string
  email?: string
  wechat?: string
  is_primary?: boolean
  remark?: string
}

/**
 * 联系人更新参数
 */
export interface ClientContactUpdateParams extends Partial<ClientContactCreateParams> {
  id: number | string
}

