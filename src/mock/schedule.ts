/**
 * 日程管理 Mock 数据
 */

import type { MockHandler } from './utils'
import {
  createMockResponse,
  createMockError,
  MockErrorCode,
  mockDelay,
  validateRequiredParams
} from './utils'
import type { Schedule, ScheduleCreateParams, ScheduleUpdateParams } from '@/types/interfaces/schedule'

// 客户ID到名称的映射（从 client.ts 中的数据同步）
const customerNameMap: Record<number, { name: string; contact: string }> = {
  1: { name: '北京建工集团有限公司', contact: '张经理' },
  2: { name: '上海浦东发展银行', contact: '李总' },
  3: { name: '深圳腾讯科技有限公司', contact: '王总监' },
  4: { name: '广州汽车集团股份有限公司', contact: '刘经理' },
  5: { name: '杭州阿里巴巴网络技术有限公司', contact: '陈总' },
  6: { name: '成都蜀道投资集团', contact: '周经理' },
  7: { name: '武汉长江实业集团', contact: '吴总' },
  8: { name: '南京扬子江药业集团', contact: '郑经理' },
  9: { name: '西安陕煤化工集团', contact: '孙总' },
  10: { name: '天津港务建设集团', contact: '赵经理' },
  11: { name: '重庆钢铁集团', contact: '钱经理' },
  12: { name: '青岛海尔集团', contact: '赵总' },
  13: { name: '大连万达集团', contact: '孙经理' },
  14: { name: '沈阳机床集团', contact: '李经理' },
  15: { name: '长沙中联重科', contact: '周总' }
}

// 模拟日程数据（包含创建者和组织信息用于权限控制）
const mockSchedules: Schedule[] = [
  {
    id: 1,
    title: `与${customerNameMap[10].name}洽谈合同`,
    description: '讨论合同细节和付款方式',
    schedule_type: 'meeting',
    start_time: '2025-12-27T14:00:00+08:00',
    end_time: '2025-12-27T16:00:00+08:00',
    location: `${customerNameMap[10].name}总部`,
    participants: [
      { name: '赵销售', role: '销售' },
      { name: customerNameMap[10].contact, role: '客户' }
    ],
    status: 'pending',
    priority: 'high',
    is_all_day: false,
    reminder_enabled: true,
    reminder_time: 30,
    reminder_method: 'system,email',
    related_type: 'customer',
    related_id: 10,
    remark: '',
    create_datetime: '2025-12-26T10:00:00+08:00',
    update_datetime: '2025-12-26T10:00:00+08:00',
    creator: {
      id: 1004,
      username: 'sales_rep',
      name: '赵销售'
    },
    // 权限控制字段
    creator_id: 1004,
    team_id: '300',
    branch_id: '200',
    hq_id: '100'
  },
  {
    id: 2,
    title: '案件开庭',
    description: '民事诉讼案件第一次开庭',
    schedule_type: 'court',
    start_time: '2025-12-28T09:00:00+08:00',
    end_time: '2025-12-28T12:00:00+08:00',
    location: '市中级人民法院',
    participants: [
      { name: '王组长', role: '主办律师' },
      { name: '赵销售', role: '协办律师' }
    ],
    status: 'pending',
    priority: 'urgent',
    is_all_day: false,
    reminder_enabled: true,
    reminder_time: 60,
    reminder_method: 'system,sms',
    related_type: 'case',
    related_id: 5,
    remark: '需要准备相关证据材料',
    create_datetime: '2025-12-25T15:00:00+08:00',
    update_datetime: '2025-12-25T15:00:00+08:00',
    creator: {
      id: 1003,
      username: 'team_leader',
      name: '王组长'
    },
    creator_id: 1003,
    team_id: '300',
    branch_id: '200',
    hq_id: '100'
  },
  {
    id: 3,
    title: `${customerNameMap[15].name}合同审核截止`,
    description: `${customerNameMap[15].name}的合同需要在今天完成审核`,
    schedule_type: 'deadline',
    start_time: '2025-12-26T18:00:00+08:00',
    location: '',
    status: 'in_progress',
    priority: 'high',
    is_all_day: false,
    reminder_enabled: true,
    reminder_time: 120,
    reminder_method: 'system',
    related_type: 'customer',
    related_id: 15,
    remark: '',
    create_datetime: '2025-12-24T09:00:00+08:00',
    update_datetime: '2025-12-26T14:00:00+08:00',
    creator: {
      id: 1005,
      username: 'sales_rep2',
      name: '孙销售'
    },
    creator_id: 1005,
    team_id: '300',
    branch_id: '200',
    hq_id: '100'
  },
  {
    id: 4,
    title: '回访重点客户',
    description: '定期回访，了解客户需求',
    schedule_type: 'reminder',
    start_time: '2025-12-29T10:00:00+08:00',
    location: '',
    status: 'pending',
    priority: 'medium',
    is_all_day: false,
    reminder_enabled: true,
    reminder_time: 30,
    reminder_method: 'system',
    related_type: 'customer_plan',
    related_id: 20,
    remark: '',
    create_datetime: '2025-12-26T11:00:00+08:00',
    update_datetime: '2025-12-26T11:00:00+08:00',
    creator: {
      id: 1004,
      username: 'sales_rep',
      name: '赵销售'
    },
    creator_id: 1004,
    team_id: '300',
    branch_id: '200',
    hq_id: '100'
  },
  {
    id: 5,
    title: '团队周会',
    description: '每周例行团队会议',
    schedule_type: 'meeting',
    start_time: '2025-12-30T15:00:00+08:00',
    end_time: '2025-12-30T16:30:00+08:00',
    location: '会议室B',
    participants: [
      { name: '全体成员', role: '参会人员' }
    ],
    status: 'pending',
    priority: 'medium',
    is_all_day: false,
    reminder_enabled: true,
    reminder_time: 15,
    reminder_method: 'system',
    remark: '',
    create_datetime: '2025-12-23T10:00:00+08:00',
    update_datetime: '2025-12-23T10:00:00+08:00',
    creator: {
      id: 1003,
      username: 'team_leader',
      name: '王组长'
    },
    creator_id: 1003,
    team_id: '300',
    branch_id: '200',
    hq_id: '100'
  },
  // 添加今天的测试数据（使用固定格式）
  {
    id: 6,
    title: '早会',
    description: '团队早会',
    schedule_type: 'meeting',
    start_time: '2025-12-26T09:00:00+08:00',
    end_time: '2025-12-26T10:00:00+08:00',
    location: '会议室',
    status: 'completed',
    priority: 'medium',
    is_all_day: false,
    reminder_enabled: true,
    reminder_time: 15,
    reminder_method: 'system',
    create_datetime: '2025-12-26T08:00:00+08:00',
    update_datetime: '2025-12-26T08:00:00+08:00',
    creator: {
      id: 1003,
      username: 'team_leader',
      name: '王组长'
    },
    creator_id: 1003,
    team_id: '300',
    branch_id: '200',
    hq_id: '100'
  },
  {
    id: 7,
    title: '客户拜访',
    description: '拜访重要客户',
    schedule_type: 'meeting',
    start_time: '2025-12-26T14:00:00+08:00',
    end_time: '2025-12-26T16:00:00+08:00',
    location: '客户公司',
    status: 'pending',
    priority: 'high',
    is_all_day: false,
    reminder_enabled: true,
    reminder_time: 30,
    reminder_method: 'system',
    create_datetime: '2025-12-26T08:00:00+08:00',
    update_datetime: '2025-12-26T08:00:00+08:00',
    creator: {
      id: 1004,
      username: 'sales_rep',
      name: '赵销售'
    },
    creator_id: 1004,
    team_id: '300',
    branch_id: '200',
    hq_id: '100'
  },
  {
    id: 8,
    title: '分所管理会议',
    description: '分所月度管理会议',
    schedule_type: 'meeting',
    start_time: '2025-12-26T09:00:00+08:00',
    end_time: '2025-12-26T10:00:00+08:00',
    location: '分所会议室',
    status: 'pending',
    priority: 'medium',
    is_all_day: false,
    reminder_enabled: true,
    reminder_time: 15,
    reminder_method: 'system',
    create_datetime: '2025-12-26T08:00:00+08:00',
    update_datetime: '2025-12-26T08:00:00+08:00',
    creator: {
      id: 1002,
      username: 'branch_manager',
      name: '李经理'
    },
    creator_id: 1002,
    team_id: null,
    branch_id: '200',
    hq_id: '100'
  },
  {
    id: 9,
    title: '总部战略会议',
    description: '全所战略规划会议',
    schedule_type: 'meeting',
    start_time: '2025-12-31T10:00:00+08:00',
    end_time: '2025-12-31T12:00:00+08:00',
    location: '总部大会议室',
    status: 'pending',
    priority: 'urgent',
    is_all_day: false,
    reminder_enabled: true,
    reminder_time: 60,
    reminder_method: 'system,email',
    create_datetime: '2025-12-26T08:00:00+08:00',
    update_datetime: '2025-12-26T08:00:00+08:00',
    creator: {
      id: 1001,
      username: 'hq_admin',
      name: '张总'
    },
    creator_id: 1001,
    team_id: null,
    branch_id: null,
    hq_id: '100'
  }
]

let scheduleIdCounter = 10

/**
 * 获取当前用户的角色信息（用于权限过滤）
 */
function getCurrentUserRole() {
  try {
    // 从 localStorage 读取 Mock 保存的用户信息
    const mockUserInfoStr = localStorage.getItem('__mock_user_info__')
    if (mockUserInfoStr) {
      const userInfo = JSON.parse(mockUserInfoStr)
      console.log('[getCurrentUserRole] 从 localStorage 获取到用户信息:', userInfo)
      return userInfo
    }
    
    console.warn('[getCurrentUserRole] 未找到用户信息，使用默认 SALES 角色')
  } catch (e) {
    console.warn('[getCurrentUserRole] 获取用户信息失败:', e)
  }
  
  // 默认返回 SALES 角色
  return {
    roleLevel: 'SALES',
    id: null,
    teamId: null,
    branchId: null,
    hqId: null
  }
}

/**
 * 根据用户角色过滤日程数据
 */
function filterSchedulesByRole(schedules: Schedule[], userInfo: any): Schedule[] {
  const { roleLevel, id, teamId, branchId } = userInfo

  console.log('[日程权限过滤]', {
    roleLevel,
    userId: id,
    teamId,
    branchId,
    totalSchedules: schedules.length
  })

  // HQ：查看全所所有日程
  if (roleLevel === 'HQ') {
    console.log('[日程权限] HQ 可查看全所日程')
    return schedules
  }

  // BRANCH：查看本分所所有日程（包括本分所下的所有团队，但不包括其他分所和总部专属日程）
  if (roleLevel === 'BRANCH') {
    const filtered = schedules.filter(s => {
      // 如果日程的 branch_id 是 null 或 undefined，不显示（总部级别的日程）
      if (s.branch_id === null || s.branch_id === undefined) {
        return false
      }
      // 如果日程有 branch_id，必须严格匹配当前分所
      return s.branch_id === branchId
    })
    console.log('[日程权限] BRANCH 可查看本分所日程，过滤后:', filtered.length)
    return filtered
  }

  // TEAM：查看本团队所有日程
  if (roleLevel === 'TEAM') {
    const filtered = schedules.filter(s => {
      // 如果日程有 team_id，必须匹配当前团队
      if (s.team_id) {
        return s.team_id === teamId
      }
      // 如果日程没有 team_id 但有 branch_id，不显示（分所级别的日程）
      return false
    })
    console.log('[日程权限] TEAM 可查看本团队日程，过滤后:', filtered.length)
    return filtered
  }

  // SALES：只能查看自己创建的日程
  if (roleLevel === 'SALES') {
    const filtered = schedules.filter(s => s.creator_id === Number(id))
    console.log('[日程权限] SALES 只能查看自己的日程，过滤后:', filtered.length)
    return filtered
  }

  // 默认：只返回自己的日程
  return schedules.filter(s => s.creator_id === Number(id))
}

/**
 * 检查用户是否有权限操作日程
 */
function checkSchedulePermission(schedule: Schedule, userInfo: any, operation: 'view' | 'edit' | 'delete'): boolean {
  const { roleLevel, id, teamId, branchId } = userInfo

  // HQ：全部权限
  if (roleLevel === 'HQ') {
    return true
  }

  // BRANCH：本分所范围内的日程（必须有 branch_id 且匹配）
  if (roleLevel === 'BRANCH') {
    return schedule.branch_id === branchId
  }

  // TEAM：本团队范围内的日程（必须有 team_id 且匹配）
  if (roleLevel === 'TEAM') {
    return schedule.team_id === teamId
  }

  // SALES：只能操作自己创建的日程
  if (roleLevel === 'SALES') {
    return schedule.creator_id === Number(id)
  }

  return false
}

/**
 * 获取日程列表
 */
function mockGetScheduleList(params: any) {
  const {
    page = 1,
    limit = 20,
    schedule_type,
    status,
    priority,
    start_time_after,
    start_time_before,
    search
  } = params

  let filtered = [...mockSchedules]

  // 权限过滤
  const userInfo = getCurrentUserRole()
  filtered = filterSchedulesByRole(filtered, userInfo)

  // 筛选
  if (schedule_type) {
    filtered = filtered.filter(s => s.schedule_type === schedule_type)
  }
  if (status) {
    filtered = filtered.filter(s => s.status === status)
  }
  if (priority) {
    filtered = filtered.filter(s => s.priority === priority)
  }
  if (start_time_after) {
    filtered = filtered.filter(s => s.start_time >= start_time_after)
  }
  if (start_time_before) {
    filtered = filtered.filter(s => s.start_time <= start_time_before)
  }
  if (search) {
    const keyword = search.toLowerCase()
    filtered = filtered.filter(s =>
      s.title.toLowerCase().includes(keyword) ||
      s.description?.toLowerCase().includes(keyword) ||
      s.location?.toLowerCase().includes(keyword)
    )
  }

  // 排序（默认按开始时间倒序）
  filtered.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())

  // 分页
  const start = (page - 1) * limit
  const end = start + limit
  const results = filtered.slice(start, end)

  return mockDelay(300).then(() => {
    return createMockResponse({
      count: filtered.length,
      next: end < filtered.length ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results
    })
  })
}

/**
 * 获取日程详情
 */
function mockGetScheduleDetail(params: any) {
  console.log('mockGetScheduleDetail 接收到的参数:', params)
  const id = params.id || params.pathParams?.id
  console.log('提取的 ID:', id)
  const schedule = mockSchedules.find(s => s.id === Number(id))
  console.log('找到的日程:', schedule)

  if (!schedule) {
    console.error('日程不存在，ID:', id)
    return createMockError(MockErrorCode.NOT_FOUND, '日程不存在')
  }

  // 权限检查
  const userInfo = getCurrentUserRole()
  if (!checkSchedulePermission(schedule, userInfo, 'view')) {
    console.error('[日程权限] 无权查看此日程')
    return createMockError(MockErrorCode.FORBIDDEN, '无权查看此日程')
  }

  // 添加关联信息和提醒记录
  let related_info = undefined
  if (schedule.related_type === 'customer' && schedule.related_id) {
    const customerInfo = customerNameMap[schedule.related_id]
    related_info = {
      id: schedule.related_id,
      name: customerInfo?.name || `客户 #${schedule.related_id}`,
      contact_person: customerInfo?.contact || '未知'
    }
  } else if (schedule.related_type === 'case' && schedule.related_id) {
    related_info = {
      id: schedule.related_id,
      name: `案件 #${schedule.related_id}`,
      case_number: `2024-案-${schedule.related_id}`
    }
  }

  const detailSchedule = {
    ...schedule,
    related_info,
    reminders: schedule.reminder_enabled ? [{
      id: 1,
      remind_time: new Date(new Date(schedule.start_time).getTime() - (schedule.reminder_time || 30) * 60000).toISOString(),
      remind_method: 'system',
      is_sent: false
    }] : []
  }

  return mockDelay(200).then(() => {
    return createMockResponse(detailSchedule)
  })
}

/**
 * 创建日程
 */
function mockCreateSchedule(params: any) {
  const data = params.body || params as ScheduleCreateParams

  // 验证必填字段
  const validation = validateRequiredParams(data, ['title', 'schedule_type', 'start_time'])
  if (!validation.valid) {
    return createMockError(MockErrorCode.BAD_REQUEST, validation.message!)
  }

  // 获取当前用户信息
  const userInfo = getCurrentUserRole()
  const currentUser = {
    id: Number(userInfo.id) || 1,
    username: userInfo.id ? `user_${userInfo.id}` : 'admin',
    name: userInfo.id ? `用户${userInfo.id}` : '管理员'
  }
  const teamId = userInfo.teamId || null
  const branchId = userInfo.branchId || null
  const hqId = userInfo.hqId || '100'

  const newSchedule: Schedule = {
    id: scheduleIdCounter++,
    title: data.title,
    description: data.description,
    schedule_type: data.schedule_type,
    start_time: data.start_time,
    end_time: data.end_time,
    location: data.location,
    participants: data.participants,
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    is_all_day: data.is_all_day || false,
    reminder_enabled: data.reminder_enabled !== false,
    reminder_time: data.reminder_time || 30,
    reminder_method: data.reminder_method || 'system',
    related_type: data.related_type,
    related_id: data.related_id,
    recurrence_rule: data.recurrence_rule,
    attachments: data.attachments,
    remark: data.remark,
    create_datetime: new Date().toISOString(),
    update_datetime: new Date().toISOString(),
    creator: currentUser,
    // 权限控制字段
    creator_id: currentUser.id,
    team_id: teamId,
    branch_id: branchId,
    hq_id: hqId
  }

  mockSchedules.push(newSchedule)

  return mockDelay(400).then(() => {
    return createMockResponse(newSchedule)
  })
}

/**
 * 更新日程
 */
function mockUpdateSchedule(params: any) {
  const id = params.id || params.pathParams?.id
  const data = params.body || params as ScheduleUpdateParams
  const index = mockSchedules.findIndex(s => s.id === Number(id))

  if (index === -1) {
    return createMockError(MockErrorCode.NOT_FOUND, '日程不存在')
  }

  // 权限检查
  const userInfo = getCurrentUserRole()
  if (!checkSchedulePermission(mockSchedules[index], userInfo, 'edit')) {
    console.error('[日程权限] 无权编辑此日程')
    return createMockError(MockErrorCode.FORBIDDEN, '无权编辑此日程')
  }

  mockSchedules[index] = {
    ...mockSchedules[index],
    ...data,
    id: mockSchedules[index].id,
    update_datetime: new Date().toISOString()
  }

  return mockDelay(300).then(() => {
    return createMockResponse(mockSchedules[index])
  })
}

/**
 * 删除日程
 */
function mockDeleteSchedule(params: any) {
  const id = params.id || params.pathParams?.id
  const index = mockSchedules.findIndex(s => s.id === Number(id))

  if (index === -1) {
    return createMockError(MockErrorCode.NOT_FOUND, '日程不存在')
  }

  // 权限检查
  let userStore: any = null
  try {
    const { useUserStore } = require('@/stores/user')
    userStore = useUserStore()
    if (userStore && !checkSchedulePermission(mockSchedules[index], userStore, 'delete')) {
      console.error('[日程权限] 无权删除此日程')
      return createMockError(MockErrorCode.FORBIDDEN, '无权删除此日程')
    }
  } catch (e) {
    console.warn('[日程权限] 无法获取 userStore，跳过权限检查')
  }

  mockSchedules.splice(index, 1)

  return mockDelay(200).then(() => {
    return createMockResponse({})
  })
}

/**
 * 批量删除日程
 */
function mockBatchDeleteSchedules(params: any) {
  const { ids } = params.body || params

  if (!ids || !Array.isArray(ids)) {
    return createMockError(MockErrorCode.BAD_REQUEST, '参数错误')
  }

  let deletedCount = 0
  ids.forEach(id => {
    const index = mockSchedules.findIndex(s => s.id === id)
    if (index !== -1) {
      mockSchedules.splice(index, 1)
      deletedCount++
    }
  })

  return mockDelay(300).then(() => {
    return createMockResponse({
      deleted_count: deletedCount
    })
  })
}

/**
 * 更新日程状态
 */
function mockUpdateScheduleStatus(params: any) {
  const id = params.id || params.pathParams?.id
  const { status } = params.body || params
  const index = mockSchedules.findIndex(s => s.id === Number(id))

  if (index === -1) {
    return createMockError(MockErrorCode.NOT_FOUND, '日程不存在')
  }

  mockSchedules[index].status = status
  mockSchedules[index].update_datetime = new Date().toISOString()

  return mockDelay(200).then(() => {
    return createMockResponse(mockSchedules[index])
  })
}

/**
 * 获取今日日程
 */
function mockGetTodaySchedules() {
  // 权限过滤
  const userInfo = getCurrentUserRole()
  let filtered = filterSchedulesByRole([...mockSchedules], userInfo)

  const today = new Date().toISOString().split('T')[0]
  const todaySchedules = filtered.filter(s => s.start_time.startsWith(today))

  return mockDelay(200).then(() => {
    return createMockResponse({
      date: today,
      total_count: todaySchedules.length,
      by_status: {
        pending: todaySchedules.filter(s => s.status === 'pending').length,
        in_progress: todaySchedules.filter(s => s.status === 'in_progress').length,
        completed: todaySchedules.filter(s => s.status === 'completed').length
      },
      schedules: todaySchedules
    })
  })
}

/**
 * 获取日历视图数据
 */
function mockGetCalendarView(params: any) {
  const { year, month } = params

  if (!year || !month) {
    return createMockError(MockErrorCode.BAD_REQUEST, '年份和月份不能为空')
  }

  // 权限过滤
  const userInfo = getCurrentUserRole()
  let filtered = filterSchedulesByRole([...mockSchedules], userInfo)

  // 生成该月的所有日期
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = []

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const daySchedules = filtered.filter(s => s.start_time.startsWith(dateStr))

    days.push({
      date: dateStr,
      schedules: daySchedules,
      count: daySchedules.length
    })
  }

  return mockDelay(300).then(() => {
    return createMockResponse({
      year,
      month,
      days
    })
  })
}

/**
 * 获取日程统计
 */
function mockGetScheduleStatistics() {
  // 权限过滤
  const userInfo = getCurrentUserRole()
  let filtered = filterSchedulesByRole([...mockSchedules], userInfo)

  return mockDelay(200).then(() => {
    return createMockResponse({
      total_count: filtered.length,
      by_type: {
        meeting: filtered.filter(s => s.schedule_type === 'meeting').length,
        court: filtered.filter(s => s.schedule_type === 'court').length,
        deadline: filtered.filter(s => s.schedule_type === 'deadline').length,
        reminder: filtered.filter(s => s.schedule_type === 'reminder').length,
        other: filtered.filter(s => s.schedule_type === 'other').length
      },
      by_status: {
        pending: filtered.filter(s => s.status === 'pending').length,
        in_progress: filtered.filter(s => s.status === 'in_progress').length,
        completed: filtered.filter(s => s.status === 'completed').length,
        cancelled: filtered.filter(s => s.status === 'cancelled').length
      },
      by_priority: {
        low: filtered.filter(s => s.priority === 'low').length,
        medium: filtered.filter(s => s.priority === 'medium').length,
        high: filtered.filter(s => s.priority === 'high').length,
        urgent: filtered.filter(s => s.priority === 'urgent').length
      },
      upcoming_count: filtered.filter(s => new Date(s.start_time) > new Date() && s.status === 'pending').length,
      overdue_count: filtered.filter(s => new Date(s.start_time) < new Date() && s.status === 'pending').length
    })
  })
}

/**
 * 发送短信提醒（Mock）
 */
function mockSendSmsNotification(params: any) {
  const { phone, template_code, params: smsParams } = params.body || params

  // 验证必填字段
  const validation = validateRequiredParams(params.body || params, ['phone', 'template_code', 'params'])
  if (!validation.valid) {
    return createMockError(MockErrorCode.BAD_REQUEST, validation.message!)
  }

  // 简单的手机号格式验证
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return createMockError(MockErrorCode.BAD_REQUEST, '手机号格式不正确')
  }

  // 打印到控制台，方便调试
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📱 [Mock 短信] 模拟发送短信提醒')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📞 接收号码:', phone)
  console.log('📋 模板代码:', template_code)
  console.log('📝 短信内容:')
  console.log(`   日程标题: ${smsParams?.title || '未知'}`)
  console.log(`   日程时间: ${smsParams?.time || '未知'}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ 短信发送成功（Mock 模拟）')
  console.log('')

  // 模拟发送成功
  return mockDelay(500).then(() => {
    return createMockResponse({
      success: true,
      message: '短信发送成功',
      phone,
      send_time: new Date().toISOString(),
      mock: true
    })
  })
}

/**
 * 发送邮件提醒（Mock）
 */
function mockSendEmailNotification(params: any) {
  const { to, subject, content, template } = params.body || params

  // 验证必填字段
  const validation = validateRequiredParams(params.body || params, ['to', 'subject', 'content'])
  if (!validation.valid) {
    return createMockError(MockErrorCode.BAD_REQUEST, validation.message!)
  }

  // 简单的邮箱格式验证
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return createMockError(MockErrorCode.BAD_REQUEST, '邮箱格式不正确')
  }

  // 打印到控制台，方便调试
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 [Mock 邮件] 模拟发送邮件提醒')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📮 收件人:', to)
  console.log('📌 主题:', subject)
  console.log('📄 模板:', template || '默认模板')
  console.log('📝 邮件内容:')
  console.log('   ' + content.split('\n').join('\n   '))
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ 邮件发送成功（Mock 模拟）')
  console.log('')

  // 模拟发送成功
  return mockDelay(600).then(() => {
    return createMockResponse({
      success: true,
      message: '邮件发送成功',
      to,
      send_time: new Date().toISOString(),
      mock: true
    })
  })
}

// 团队日程Mock处理器（管理角色）
function mockGetTeamSchedule(params: any) {
  console.log('Mock: 获取团队日程', params)
  const { start_date, end_date, team_id, branch_id } = params
  
  // 生成指定日期范围内的团队日程数据
  const start = new Date(start_date)
  const end = new Date(end_date)
  const days: any[] = []
  
  // 模拟多个销售人员的日程
  const teamMembers = [
    { id: 1, name: '王销售', avatar: '', roleLevel: 'SALES' },
    { id: 2, name: '李律师', avatar: '', roleLevel: 'SALES' },
    { id: 3, name: '张经理', avatar: '', roleLevel: 'TEAM' },
    { id: 4, name: '赵销售', avatar: '', roleLevel: 'SALES' }
  ]
  
  // 遍历日期范围
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10)
    const daySchedules: any[] = []
    
    // 为每个团队成员随机生成一些日程
    teamMembers.forEach((member, index) => {
      // 随机决定是否生成日程（30%概率）
      if (Math.random() < 0.3) {
        const hour = 9 + Math.floor(Math.random() * 8) // 9-17点
        const schedule: any = {
          id: Date.now() + index + Math.random() * 1000,
          title: `${member.name}的拜访计划`,
          description: `拜访客户：${customerNameMap[1 + index]?.name || '客户'}`,
          schedule_type: 'meeting',
          start_time: `${dateStr}T${String(hour).padStart(2, '0')}:00:00+08:00`,
          end_time: `${dateStr}T${String(hour + 1).padStart(2, '0')}:00:00+08:00`,
          location: '客户公司',
          participants: [
            { name: member.name, role: '销售' },
            { name: customerNameMap[1 + index]?.contact || '客户', role: '客户' }
          ],
          status: 'pending',
          priority: 'high',
          is_all_day: false,
          reminder_enabled: true,
          reminder_time: 30,
          reminder_method: 'system',
          related_type: 'customer',
          related_id: 1 + index,
          user_id: member.id,
          user_name: member.name,
          user_avatar: member.avatar,
          create_datetime: new Date().toISOString(),
          update_datetime: new Date().toISOString(),
          creator: {
            id: member.id,
            username: member.name,
            name: member.name
          }
        }
        daySchedules.push(schedule)
      }
    })
    
    if (daySchedules.length > 0) {
      days.push({
        date: dateStr,
        schedules: daySchedules,
        count: daySchedules.length
      })
    }
  }
  
  return Promise.resolve(createMockResponse({ days }))
}

// 导出 Mock 处理器
export default [
  // 特定路由放在最前面，避免被 :id 匹配
  {
    url: '/crm/team/schedule',
    method: 'GET',
    response: mockGetTeamSchedule
  },
  {
    url: '/customer/schedules/batch_delete/',
    method: 'POST',
    response: mockBatchDeleteSchedules
  },
  {
    url: '/customer/schedules/today/',
    method: 'GET',
    response: mockGetTodaySchedules
  },
  {
    url: '/customer/schedules/calendar_view/',
    method: 'GET',
    response: mockGetCalendarView
  },
  {
    url: '/customer/schedules/statistics/',
    method: 'GET',
    response: mockGetScheduleStatistics
  },
  {
    url: '/customer/schedules/notification/sms/send/',
    method: 'POST',
    response: mockSendSmsNotification
  },
  {
    url: '/customer/schedules/notification/email/send/',
    method: 'POST',
    response: mockSendEmailNotification
  },
  // 带参数的路由
  {
    url: '/customer/schedules/:id/update_status/',
    method: 'POST',
    response: mockUpdateScheduleStatus
  },
  {
    url: '/customer/schedules/:id/',
    method: 'GET',
    response: mockGetScheduleDetail
  },
  {
    url: '/customer/schedules/:id/',
    method: 'PUT',
    response: mockUpdateSchedule
  },
  {
    url: '/customer/schedules/:id/',
    method: 'PATCH',
    response: mockUpdateSchedule
  },
  {
    url: '/customer/schedules/:id/',
    method: 'DELETE',
    response: mockDeleteSchedule
  },
  // 基础路由放在最后
  {
    url: '/customer/schedules/',
    method: 'GET',
    response: mockGetScheduleList
  },
  {
    url: '/customer/schedules/',
    method: 'POST',
    response: mockCreateSchedule
  }
] as MockHandler[]
