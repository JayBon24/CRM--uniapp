// 创办方资料接口定义
export interface IOrganizer {
  id: string
  userId: string
  unitName: string // 单位名称
  unitLogo: string // 单位LOGO
  phone: string // 联系电话
  contactPerson: string // 负责人
  unitImage: string // 证件图片
  province: string // 省份
  city: string // 城市
  district: string // 区县
  address: string // 详细地址
  status: 'active' | 'inactive' // 状态：激活/未激活
  provinceCode?: string
  cityCode?: string
  districtCode?: string
  createTime: string // 创建时间
  updateTime: string // 更新时间
}

// 创办方资料创建参数
export interface ICreateOrganizerParams {
  unitName: string
  unitLogo: string
  phone: string
  contactPerson: string
  unitImage: string
  province: string
  city: string
  district: string
  address: string
  provinceCode?: string
  cityCode?: string
  districtCode?: string
}

// 创办方资料更新参数
export interface IUpdateOrganizerParams extends ICreateOrganizerParams {
  id: string
}

// 创办方资料查询参数
export interface IOrganizerQueryParams {
  pageNum?: number
  pageSize?: number
  keyword?: string
  status?: 'active' | 'inactive'
}

// 导入通用接口
import type { TableDataInfo } from './common'

// 分页响应格式
export type IOrganizerPageResult = TableDataInfo<IOrganizer>
