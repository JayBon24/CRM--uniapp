/**
 * 客户管理相关枚举展示映射
 */

import type {
  ClientStatus,
  SalesStage,
  ClientGrade,
  ClientCategory,
  CollectionCategory,
  PreservationStatus,
  RecycleRiskLevel
} from '@/types/interfaces/client'
import type { LocationStatus } from '@/types/interfaces/client-visit'
import type { FollowupType } from '@/types/interfaces/client-followup'

/**
 * 客户生命周期状态映射
 */
export const CLIENT_STATUS_MAP: Record<
  ClientStatus,
  {
    label: string
    color: string
    icon?: string
  }
> = {
  PUBLIC_POOL: {
    label: '公海',
    color: '#909399',
    icon: 'grid'
  },
  FOLLOW_UP: {
    label: '跟进',
    color: '#409EFF',
    icon: 'account-group'
  },
  CASE: {
    label: '交案',
    color: '#E6A23C',
    icon: 'file-document'
  },
  PAYMENT: {
    label: '回款',
    color: '#67C23A',
    icon: 'shopping'
  },
  WON: {
    label: '赢单',
    color: '#F56C6C',
    icon: 'target'
  }
}

/**
 * 展业状态映射
 */
export const SALES_STAGE_MAP: Record<
  SalesStage,
  {
    label: string
    color: string
    description?: string
  }
> = {
  PUBLIC_POOL: {
    label: '公海',
    color: '#909399',
    description: '未分配的线索'
  },
  BLANK: {
    label: '商机',
    color: '#C0C4CC',
    description: '已跟进但无拜访记录'
  },
  MEETING: {
    label: '跟进',
    color: '#409EFF',
    description: '已进行有效拜访'
  },
  CASE: {
    label: '交案',
    color: '#E6A23C',
    description: '已签订合同'
  },
  PAYMENT: {
    label: '回款',
    color: '#67C23A',
    description: '已回款'
  },
  WON: {
    label: '赢单',
    color: '#F56C6C',
    description: '已支付律师费'
  }
}

/**
 * 展业状态筛选项（默认顺序）
 */
export const SALES_STAGE_FILTER_OPTIONS: Array<{
  value: SalesStage
  label: string
}> = [
  { value: 'MEETING', label: '跟进' },
  { value: 'CASE', label: '交案' },
  { value: 'PAYMENT', label: '回款' },
  { value: 'WON', label: '赢单' },
  { value: 'PUBLIC_POOL', label: '公海' },
  { value: 'BLANK', label: '商机' }
]

/**
 * 客户等级映射
 */
export const CLIENT_GRADE_MAP: Record<
  ClientGrade,
  {
    label: string
    color: string
    bgColor: string
  }
> = {
  A: {
    label: 'A',
    color: '#F56C6C',
    bgColor: '#FEF0F0'
  },
  B: {
    label: 'B',
    color: '#E6A23C',
    bgColor: '#FDF6EC'
  },
  C: {
    label: 'C',
    color: '#409EFF',
    bgColor: '#ECF5FF'
  },
  D: {
    label: 'D',
    color: '#909399',
    bgColor: '#F4F4F5'
  }
}

/**
 * 客户类别映射
 */
export const CLIENT_CATEGORY_MAP: Record<
  ClientCategory,
  {
    label: string
    color: string
    bgColor: string
  }
> = {
  construction: {
    label: '建工',
    color: '#409EFF',
    bgColor: '#ECF5FF'
  },
  material: {
    label: '建材',
    color: '#E6A23C',
    bgColor: '#FDF6EC'
  }
}

/**
 * 催收类别映射
 */
export const COLLECTION_CATEGORY_MAP: Record<
  CollectionCategory,
  {
    label: string
    color: string
  }
> = {
  arbitration: {
    label: '仲裁',
    color: '#409EFF'
  },
  mediation: {
    label: '调解',
    color: '#67C23A'
  },
  litigation: {
    label: '诉讼',
    color: '#E6A23C'
  }
}

/**
 * 保全状态映射
 */
export const PRESERVATION_STATUS_MAP: Record<
  PreservationStatus,
  {
    label: string
    color: string
  }
> = {
  preserved: {
    label: '保全',
    color: '#409EFF'
  },
  not_preserved: {
    label: '非保全',
    color: '#909399'
  }
}

/**
 * 回收风险等级映射
 */
export const RECYCLE_RISK_LEVEL_MAP: Record<
  RecycleRiskLevel,
  {
    label: string
    color: string
    icon?: string
  }
> = {
  none: {
    label: '无风险',
    color: '#67C23A'
  },
  low: {
    label: '低风险',
    color: '#909399'
  },
  medium: {
    label: '中风险',
    color: '#E6A23C'
  },
  high: {
    label: '高风险',
    color: '#F56C6C'
  }
}

/**
 * 定位状态映射
 */
export const LOCATION_STATUS_MAP: Record<
  LocationStatus,
  {
    label: string
    color: string
    icon: string
  }
> = {
  success: {
    label: '定位成功',
    color: '#67C23A',
    icon: 'checkmark-circle'
  },
  fail: {
    label: '定位失败',
    color: '#F56C6C',
    icon: 'close-circle'
  },
  denied: {
    label: '拒绝授权',
    color: '#E6A23C',
    icon: 'alert-circle'
  },
  offline: {
    label: '无网络',
    color: '#909399',
    icon: 'wifi-off'
  }
}

/**
 * 跟进方式映射
 */
export const FOLLOWUP_TYPE_MAP: Record<
  FollowupType,
  {
    label: string
    icon?: string
  }
> = {
  phone: {
    label: '电话',
    icon: 'phone'
  },
  wechat: {
    label: '微信',
    icon: 'wechat'
  },
  meeting: {
    label: '面谈',
    icon: 'account-group'
  },
  email: {
    label: '邮件',
    icon: 'email'
  },
  other: {
    label: '其他',
    icon: 'dots-horizontal'
  }
}

/**
 * 获取状态标签样式
 */
export function getStatusStyle(status: ClientStatus) {
  const config = CLIENT_STATUS_MAP[status]
  return {
    color: config.color,
    backgroundColor: `${config.color}15`
  }
}

/**
 * 获取展业阶段标签样式
 */
export function getSalesStageStyle(stage: SalesStage) {
  const config = SALES_STAGE_MAP[stage]
  return {
    color: config.color,
    backgroundColor: `${config.color}15`
  }
}

/**
 * 获取等级标签样式
 */
export function getGradeStyle(grade: ClientGrade) {
  const config = CLIENT_GRADE_MAP[grade]
  return {
    color: config.color,
    backgroundColor: config.bgColor
  }
}

/**
 * 获取客户类别标签样式
 */
const CATEGORY_ALIAS: Record<string, ClientCategory> = {
  construction: 'construction',
  material: 'material',
  CONSTRUCTION: 'construction',  // 处理大写
  MATERIAL: 'material',  // 处理大写
  建工: 'construction',
  建材: 'material'
}

function normalizeCategoryKey(category?: string) {
  if (!category) return ''
  const trimmed = String(category).trim().toLowerCase()  // 转换为小写
  // 先尝试直接匹配
  if (CATEGORY_ALIAS[trimmed]) {
    return CATEGORY_ALIAS[trimmed]
  }
  // 尝试匹配原始值（可能包含大写）
  const original = String(category).trim()
  return CATEGORY_ALIAS[original] || ''
}

export function getCategoryLabel(category?: string) {
  if (!category) return ''
  const normalized = String(category).trim()
  const parts = normalized
    .split(/[\\/|、,]/)
    .map(part => part.trim())
    .filter(Boolean)
  if (parts.length > 1) {
    const labels = parts.map(part => {
      // 转换为小写后查找别名
      const lowerPart = part.toLowerCase()
      const key = CATEGORY_ALIAS[lowerPart] || CATEGORY_ALIAS[part] || lowerPart
      return CLIENT_CATEGORY_MAP[key as ClientCategory]?.label || part
    })
    return labels.join('/')
  }
  // 转换为小写后查找别名
  const lowerNormalized = normalized.toLowerCase()
  const key = CATEGORY_ALIAS[lowerNormalized] || CATEGORY_ALIAS[normalized] || lowerNormalized
  return CLIENT_CATEGORY_MAP[key as ClientCategory]?.label || normalized
}

export function getCategoryStyle(category?: string) {
  const key = normalizeCategoryKey(category)
  const config = CLIENT_CATEGORY_MAP[key as ClientCategory] || {
    color: '#909399',
    bgColor: '#F4F4F5'
  }
  return {
    color: config.color,
    backgroundColor: config.bgColor
  }
}

/**
 * 获取回收风险标签样式
 */
export function getRecycleRiskStyle(level: RecycleRiskLevel) {
  const config = RECYCLE_RISK_LEVEL_MAP[level]
  return {
    color: config.color,
    backgroundColor: `${config.color}15`
  }
}

