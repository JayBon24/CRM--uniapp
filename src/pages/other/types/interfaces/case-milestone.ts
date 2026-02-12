/**
 * 案件关键节点类型定义
 * 用于自动生成日程
 */

// 关键节点类型
export type MilestoneType = 
  | 'court_hearing'      // 开庭时间
  | 'mediation'          // 调解时间
  | 'payment_deadline'   // 回款截止时间
  | 'evidence_deadline'  // 举证截止时间
  | 'appeal_deadline'    // 上诉截止时间
  | 'execution'          // 执行时间
  | 'other'              // 其他

// 关键节点
export interface CaseMilestone {
  id?: number | string
  case_id?: number | string
  client_id?: number | string
  milestone_type: MilestoneType
  title: string
  scheduled_time: string      // 预定时间
  location?: string           // 地点（如法院地址）
  description?: string        // 描述
  reminder_enabled?: boolean  // 是否开启提醒
  reminder_minutes?: number   // 提前提醒分钟数
  schedule_id?: number        // 关联的日程ID（自动生成后回填）
  create_time?: string
  update_time?: string
}

// 关键节点创建参数
export interface CaseMilestoneCreateParams {
  case_id?: number | string
  client_id?: number | string
  milestone_type: MilestoneType
  title: string
  scheduled_time: string
  location?: string
  description?: string
  reminder_enabled?: boolean
  reminder_minutes?: number
}

// 批量创建关键节点参数
export interface CaseMilestoneBatchCreateParams {
  case_id?: number | string
  client_id: number | string
  case_name: string
  milestones: CaseMilestoneCreateParams[]
}

// 关键节点配置（用于表单）
export interface MilestoneConfig {
  type: MilestoneType
  label: string
  icon: string
  color: string
  defaultReminderMinutes: number
  scheduleType: 'court' | 'meeting' | 'deadline' | 'reminder' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

// 关键节点配置映射
export const MILESTONE_CONFIGS: Record<MilestoneType, MilestoneConfig> = {
  court_hearing: {
    type: 'court_hearing',
    label: '开庭时间',
    icon: 'court',
    color: '#F56C6C',
    defaultReminderMinutes: 1440, // 提前1天
    scheduleType: 'court',
    priority: 'urgent'
  },
  mediation: {
    type: 'mediation',
    label: '调解时间',
    icon: 'mediation',
    color: '#E6A23C',
    defaultReminderMinutes: 1440,
    scheduleType: 'meeting',
    priority: 'high'
  },
  payment_deadline: {
    type: 'payment_deadline',
    label: '回款截止',
    icon: 'money',
    color: '#67C23A',
    defaultReminderMinutes: 4320, // 提前3天
    scheduleType: 'deadline',
    priority: 'high'
  },
  evidence_deadline: {
    type: 'evidence_deadline',
    label: '举证截止',
    icon: 'document',
    color: '#409EFF',
    defaultReminderMinutes: 4320,
    scheduleType: 'deadline',
    priority: 'high'
  },
  appeal_deadline: {
    type: 'appeal_deadline',
    label: '上诉截止',
    icon: 'warning',
    color: '#F56C6C',
    defaultReminderMinutes: 4320,
    scheduleType: 'deadline',
    priority: 'urgent'
  },
  execution: {
    type: 'execution',
    label: '执行时间',
    icon: 'execute',
    color: '#909399',
    defaultReminderMinutes: 1440,
    scheduleType: 'reminder',
    priority: 'medium'
  },
  other: {
    type: 'other',
    label: '其他节点',
    icon: 'more',
    color: '#909399',
    defaultReminderMinutes: 60,
    scheduleType: 'other',
    priority: 'medium'
  }
}

// 获取关键节点配置
export function getMilestoneConfig(type: MilestoneType): MilestoneConfig {
  return MILESTONE_CONFIGS[type] || MILESTONE_CONFIGS.other
}
