/**
 * 日程管理相关类型定义
 */

// 日程类型
export type ScheduleType = 'meeting' | 'court' | 'deadline' | 'reminder' | 'other'

// 日程状态
export type ScheduleStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

// 优先级
export type SchedulePriority = 'low' | 'medium' | 'high' | 'urgent'

// 提醒方式
export type ReminderMethod = 'system' | 'email' | 'sms' | 'wechat'

// 关联类型
export type RelatedType = 'case' | 'customer' | 'customer_plan' | 'visit'

// 参与人员
export interface Participant {
  name: string
  role?: string
  phone?: string
  email?: string
}

// 附件
export interface Attachment {
  name: string
  url: string
  size: number
  upload_time: string
}

// 重复规则
export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  end_date?: string
  count?: number
  by_weekday?: number[]
  by_monthday?: number[]
}

// 日程提醒记录
export interface ScheduleReminder {
  id: number
  schedule: number
  remind_time: string
  remind_method: ReminderMethod
  is_sent: boolean
  sent_time?: string
  send_result?: string
  create_datetime: string
}

// 日程
export interface Schedule {
  id: number
  title: string
  description?: string
  schedule_type: ScheduleType
  other_type_content?: string
  start_time: string
  end_time?: string
  location?: string
  participants?: Participant[]
  status: ScheduleStatus
  priority: SchedulePriority
  is_all_day: boolean
  reminder_enabled: boolean
  reminder_time?: number
  reminder_method?: string
  related_type?: RelatedType
  related_id?: number
  related_info?: any
  recurrence_rule?: RecurrenceRule
  attachments?: Attachment[]
  remark?: string
  reminders?: ScheduleReminder[]
  create_datetime: string
  update_datetime: string
  creator: {
    id: number
    username: string
    name: string
  }
  // 权限控制字段
  creator_id?: number
  team_id?: string | null
  branch_id?: string | null
  hq_id?: string | null
}

// 日程列表查询参数
export interface ScheduleListParams {
  page?: number
  limit?: number
  schedule_type?: ScheduleType
  status?: ScheduleStatus
  priority?: SchedulePriority
  start_time_after?: string
  start_time_before?: string
  related_type?: RelatedType
  related_id?: number
  search?: string
  ordering?: string
}

// 日程列表响应
export interface ScheduleListResponse {
  count: number
  next?: string
  previous?: string
  results: Schedule[]
}

// 创建日程参数
export interface ScheduleCreateParams {
  title: string
  description?: string
  schedule_type: ScheduleType
  other_type_content?: string
  start_time: string
  end_time?: string
  location?: string
  participants?: Participant[]
  status?: ScheduleStatus
  priority?: SchedulePriority
  is_all_day?: boolean
  reminder_enabled?: boolean
  reminder_time?: number
  reminder_method?: string
  related_type?: RelatedType
  related_id?: number
  recurrence_rule?: RecurrenceRule
  attachments?: Attachment[]
  remark?: string
}

// 更新日程参数
export interface ScheduleUpdateParams extends Partial<ScheduleCreateParams> {
  id?: number
}

// 日程统计
export interface ScheduleStatistics {
  total_count: number
  by_type: Record<ScheduleType, number>
  by_status: Record<ScheduleStatus, number>
  by_priority: Record<SchedulePriority, number>
  upcoming_count: number
  overdue_count: number
}

// 日历视图数据
export interface CalendarViewData {
  year: number
  month: number
  days: Array<{
    date: string
    schedules: Schedule[]
    count: number
  }>
}
