/**
 * 日程管理 API
 */

import { http } from '@/utils/request'
import type {
  Schedule,
  ScheduleListParams,
  ScheduleListResponse,
  ScheduleCreateParams,
  ScheduleUpdateParams,
  ScheduleStatistics,
  CalendarViewData
} from '@/types/interfaces/schedule'

// 统一解包响应数据
function unwrapData<T>(res: any): T {
  return (res && typeof res === 'object' && 'data' in res) ? (res.data as T) : (res as T)
}

/**
 * 获取日程列表
 */
export async function getScheduleList(params: ScheduleListParams): Promise<ScheduleListResponse> {
  const res = await http.get<any>('/customer/schedules/', params)
  const data = unwrapData<any>(res)
  
  // 兼容两种数据格式：
  // 1. DRF 标准分页格式: { results: [], count: 0 }
  // 2. 直接返回数组: []
  if (Array.isArray(data)) {
    return {
      results: data,
      count: data.length
    }
  }
  
  return data as ScheduleListResponse
}

/**
 * 获取日程详情
 */
export async function getScheduleDetail(id: number | string): Promise<Schedule> {
  const res = await http.get<any>(`/customer/schedules/${id}/`)
  return unwrapData<Schedule>(res)
}

/**
 * 创建日程
 */
export function createSchedule(data: ScheduleCreateParams) {
  return http.post('/customer/schedules/', data)
}

/**
 * 更新日程
 */
export function updateSchedule(id: number | string, data: ScheduleUpdateParams) {
  return http.put(`/customer/schedules/${id}/`, data)
}

/**
 * 删除日程
 */
export function deleteSchedule(id: number | string) {
  return http.delete(`/customer/schedules/${id}/`)
}

/**
 * 批量删除日程
 */
export function batchDeleteSchedules(ids: number[]) {
  return http.post('/customer/schedules/batch_delete/', { ids })
}

/**
 * 更新日程状态
 */
export function updateScheduleStatus(id: number | string, status: string) {
  return http.post(`/customer/schedules/${id}/update_status/`, { status })
}

/**
 * 获取今日日程
 */
export async function getTodaySchedules(): Promise<Schedule[]> {
  const res = await http.get<any>('/customer/schedules/today/')
  return unwrapData<Schedule[]>(res)
}

/**
 * 获取本周日程
 */
export async function getWeekSchedules(): Promise<Schedule[]> {
  const res = await http.get<any>('/customer/schedules/this_week/')
  return unwrapData<Schedule[]>(res)
}

/**
 * 获取日程统计
 */
export async function getScheduleStatistics(params?: { start_date?: string; end_date?: string }): Promise<ScheduleStatistics> {
  const res = await http.get<any>('/customer/schedules/statistics/', params)
  return unwrapData<ScheduleStatistics>(res)
}

/**
 * 获取日历视图数据
 */
export async function getCalendarView(year: number, month: number): Promise<CalendarViewData> {
  const res = await http.get<any>('/customer/schedules/calendar_view/', { year, month })
  return unwrapData<CalendarViewData>(res)
}

/**
 * 从客户计划创建日程
 */
export function createScheduleFromPlan(data: {
  customer_id: number
  plan_title: string
  plan_time: string
  plan_description?: string
  reminder_time?: number
}) {
  return http.post('/customer/schedules/create_from_customer_plan/', data)
}

/**
 * 获取关联对象的日程列表
 */
export async function getSchedulesByRelated(relatedType: string, relatedId: number): Promise<Schedule[]> {
  const res = await http.get<any>('/customer/schedules/by_related/', {
    related_type: relatedType,
    related_id: relatedId
  })
  return unwrapData<Schedule[]>(res)
}

/**
 * 获取即将到来的提醒
 */
export async function getUpcomingReminders(hours: number = 24): Promise<any> {
  const res = await http.get<any>('/customer/schedules/upcoming_reminders/', { hours })
  return unwrapData<any>(res)
}

/**
 * 发送短信提醒（定时任务接口）
 */
export function sendSmsNotification(data: {
  phone: string
  template_code: string
  params: {
    title: string
    time: string
  }
}) {
  return http.post('/customer/schedules/notification/sms/send/', data)
}

/**
 * 发送邮件提醒（定时任务接口）
 */
export function sendEmailNotification(data: {
  to: string
  subject: string
  content: string
  template: string
}) {
  return http.post('/customer/schedules/notification/email/send/', data)
}

/**
 * 获取团队日程数据（管理角色）
 */
export async function getTeamSchedule(params: {
  start_date: string
  end_date: string
  team_id?: number | string
  branch_id?: number | string
}): Promise<{
  days: Array<{
    date: string
    schedules: Array<Schedule & { user_name?: string; user_avatar?: string; user_id?: number | string }>
    count: number
  }>
}> {
  const res = await http.get<any>('/crm/team/schedule', params)
  return unwrapData<{
    days: Array<{
      date: string
      schedules: Array<Schedule & { user_name?: string; user_avatar?: string; user_id?: number | string }>
      count: number
    }>
  }>(res)
}