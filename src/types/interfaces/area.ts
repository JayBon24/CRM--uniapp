/**
 * 区域相关接口定义
 */

import type { AreaInfo } from './common'

/**
 * 区域查询参数
 */
export interface AreaQueryParams {
  /** 父级ID */
  parentId?: string
  /** 区域名称 */
  name?: string
  /** 区域代码 */
  code?: string
  /** 层级 */
  level?: number
  /** 状态 */
  status?: string
}

/**
 * 激活城市列表查询参数
 */
export interface ActivateCityListParams {
  /** 关键词搜索 */
  keyword?: string
  /** 状态 */
  status?: string
}

/**
 * 省份信息
 */
export interface Province extends AreaInfo {
  /** 省份代码 */
  provinceCode: string
  /** 省份名称 */
  provinceName: string
}

/**
 * 城市信息
 */
export interface City extends AreaInfo {
  /** 城市代码 */
  cityCode: string
  /** 城市名称 */
  cityName: string
  /** 所属省份代码 */
  provinceCode: string
}

/**
 * 区县信息
 */
export interface County extends AreaInfo {
  /** 区县代码 */
  countyCode: string
  /** 区县名称 */
  countyName: string
  /** 所属城市代码 */
  cityCode: string
}

/**
 * 区域层级枚举
 */
export enum AreaLevel {
  /** 省份 */
  PROVINCE = 1,
  /** 城市 */
  CITY = 2,
  /** 区县 */
  COUNTY = 3
}

/**
 * 区域状态枚举
 */
export enum AreaStatus {
  /** 正常 */
  NORMAL = '0',
  /** 停用 */
  DISABLED = '1'
}

/**
 * 区域状态选项
 */
export const AreaStatusOptions = [
  { label: '正常', value: AreaStatus.NORMAL },
  { label: '停用', value: AreaStatus.DISABLED }
]

/**
 * 区域层级选项
 */
export const AreaLevelOptions = [
  { label: '省份', value: AreaLevel.PROVINCE },
  { label: '城市', value: AreaLevel.CITY },
  { label: '区县', value: AreaLevel.COUNTY }
]
