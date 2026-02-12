/**
 * 通用接口定义
 * 包含分页、响应格式等通用类型
 */

/**
 * 分页查询参数
 */
export interface PaginationParams {
  /** 当前页码 */
  pageNum?: number
  /** 每页显示记录数 */
  pageSize?: number
  /** 排序列 */
  orderByColumn?: string
  /** 排序方式 */
  isAsc?: 'asc' | 'desc'
}

/**
 * 分页响应格式
 */
export interface PaginationResponse<T> {
  /** 总记录数 */
  total: number
  /** 分页数据列表 */
  rows: T[]
  /** 当前页码 */
  pageNum: number
  /** 每页显示记录数 */
  pageSize: number
  /** 是否有更多数据 */
  hasMore: boolean
}

/**
 * 标准响应格式（分页查询）
 */
export interface TableDataInfo<T> {
  /** 状态码 */
  code: number
  /** 消息提示 */
  msg: string
  /** 总记录数 */
  total: number
  /** 分页数据列表 */
  rows: T[]
}

/**
 * 标准响应格式（单条数据）
 */
export interface AjaxResult<T> {
  /** 状态码 */
  code: number
  /** 消息提示 */
  msg: string
  /** 响应数据 */
  data: T
}

/**
 * 排序选项
 */
export interface SortOption {
  /** 显示标签 */
  label: string
  /** 排序值 */
  value: string
}

/**
 * 字典数据项
 */
export interface DictItem {
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
  isDefault?: boolean
  /** 状态 */
  status?: string
  /** 备注 */
  remark?: string
}

/**
 * 区域信息
 */
export interface AreaInfo {
  /** 区域ID */
  id: string
  /** 区域名称 */
  name: string
  /** 区域代码 */
  code: string
  /** 父级ID */
  parentId: string
  /** 层级 */
  level: number
  /** 排序 */
  sort?: number
  /** 状态 */
  status?: string
}

/**
 * 文件上传响应
 */
export interface UploadResponse {
  /** 文件名 */
  fileName: string
  /** 文件URL */
  url: string
  /** 文件大小 */
  size: number
  /** 文件类型 */
  type: string
}

/**
 * 查询参数基类
 */
export interface BaseQueryParams extends PaginationParams {
  /** 关键词搜索 */
  keyword?: string
  /** 状态筛选 */
  status?: string
  /** 开始时间 */
  beginTime?: string
  /** 结束时间 */
  endTime?: string
}
