/**
 * 字典相关接口定义
 */

import type { DictItem, PaginationParams } from './common'

/**
 * 字典类型
 */
export interface DictType {
  /** 字典主键 */
  dictId: number
  /** 字典名称 */
  dictName: string
  /** 字典类型 */
  dictType: string
  /** 状态 */
  status: string
  /** 创建者 */
  createBy?: string
  /** 创建时间 */
  createTime?: string
  /** 更新者 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
  /** 备注 */
  remark?: string
}

/**
 * 字典数据
 */
export interface DictData extends DictItem {
  /** 字典编码 */
  dictCode: number
  /** 创建者 */
  createBy?: string
  /** 创建时间 */
  createTime?: string
  /** 更新者 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 字典类型查询参数
 */
export interface DictTypeQueryParams extends PaginationParams {
  /** 字典名称 */
  dictName?: string
  /** 字典类型 */
  dictType?: string
  /** 状态 */
  status?: string
  /** 开始时间 */
  beginTime?: string
  /** 结束时间 */
  endTime?: string
}

/**
 * 字典数据查询参数
 */
export interface DictDataQueryParams extends PaginationParams {
  /** 字典类型 */
  dictType?: string
  /** 字典标签 */
  dictLabel?: string
  /** 状态 */
  status?: string
}

/**
 * 创建字典类型参数
 */
export interface CreateDictTypeParams {
  /** 字典名称 */
  dictName: string
  /** 字典类型 */
  dictType: string
  /** 状态 */
  status: string
  /** 备注 */
  remark?: string
}

/**
 * 更新字典类型参数
 */
export interface UpdateDictTypeParams extends Partial<CreateDictTypeParams> {
  /** 字典主键 */
  dictId: number
}

/**
 * 创建字典数据参数
 */
export interface CreateDictDataParams {
  /** 字典标签 */
  dictLabel: string
  /** 字典值 */
  dictValue: string
  /** 字典类型 */
  dictType: string
  /** 样式属性 */
  cssClass?: string
  /** 表格回显样式 */
  listClass?: string
  /** 是否默认 */
  isDefault?: string
  /** 状态 */
  status: string
  /** 备注 */
  remark?: string
}

/**
 * 更新字典数据参数
 */
export interface UpdateDictDataParams extends Partial<CreateDictDataParams> {
  /** 字典编码 */
  dictCode: number
}

/**
 * 字典状态选项
 */
export const DictStatusOptions = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
]

/**
 * 是否默认选项
 */
export const DictDefaultOptions = [
  { label: '是', value: 'Y' },
  { label: '否', value: 'N' }
]
