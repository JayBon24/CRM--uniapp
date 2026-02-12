/**
 * 案件日程自动生成服务
 * 基于案件关键节点自动创建日程
 */

import { createSchedule } from '@/api/schedule'
import type { ScheduleCreateParams, ScheduleType, SchedulePriority } from '@/types/interfaces/schedule'
import type { 
  CaseMilestone, 
  CaseMilestoneCreateParams,
  CaseMilestoneBatchCreateParams,
  MilestoneType 
} from '../types/interfaces/case-milestone'
import { getMilestoneConfig } from '../types/interfaces/case-milestone'

/**
 * 根据关键节点类型获取日程类型
 */
function getScheduleType(milestoneType: MilestoneType): ScheduleType {
  const config = getMilestoneConfig(milestoneType)
  return config.scheduleType
}

/**
 * 根据关键节点类型获取优先级
 */
function getPriority(milestoneType: MilestoneType): SchedulePriority {
  const config = getMilestoneConfig(milestoneType)
  return config.priority
}

/**
 * 生成日程标题
 */
function generateScheduleTitle(milestone: CaseMilestoneCreateParams, caseName?: string): string {
  const config = getMilestoneConfig(milestone.milestone_type)
  if (milestone.title) {
    return milestone.title
  }
  return caseName ? `【${config.label}】${caseName}` : `【${config.label}】`
}

/**
 * 从单个关键节点创建日程
 */
export async function createScheduleFromMilestone(
  milestone: CaseMilestoneCreateParams,
  options?: {
    caseName?: string
    caseId?: number | string
    clientId?: number | string
  }
): Promise<{ success: boolean; scheduleId?: number; error?: string }> {
  try {
    const config = getMilestoneConfig(milestone.milestone_type)
    
    // 格式化时间为 ISO 格式
    let startTime = milestone.scheduled_time
    if (startTime && !startTime.includes('T')) {
      // 如果是 "YYYY-MM-DD HH:mm" 格式，转换为 ISO 格式
      startTime = startTime.replace(' ', 'T') + ':00+08:00'
    } else if (startTime && startTime.length === 10) {
      // 如果只有日期 "YYYY-MM-DD"，添加默认时间
      startTime = startTime + 'T09:00:00+08:00'
    }
    
    const scheduleData: ScheduleCreateParams = {
      title: generateScheduleTitle(milestone, options?.caseName),
      description: milestone.description || `案件关键节点：${config.label}`,
      schedule_type: getScheduleType(milestone.milestone_type),
      start_time: startTime,
      location: milestone.location,
      status: 'pending',
      priority: getPriority(milestone.milestone_type),
      is_all_day: false,
      reminder_enabled: milestone.reminder_enabled !== false,
      reminder_time: milestone.reminder_minutes || config.defaultReminderMinutes,
      reminder_method: 'system',
      related_type: options?.caseId ? 'case' : (options?.clientId ? 'customer' : undefined),
      related_id: options?.caseId ? Number(options.caseId) : (options?.clientId ? Number(options.clientId) : undefined),
      remark: `自动生成自案件关键节点`
    }

    const result = await createSchedule(scheduleData)
    const scheduleId = (result as any)?.data?.id || (result as any)?.id
    
    return { success: true, scheduleId }
  } catch (error: any) {
    console.error('创建日程失败:', error)
    return { success: false, error: error.message || '创建日程失败' }
  }
}

/**
 * 批量从关键节点创建日程
 */
export async function createSchedulesFromMilestones(
  params: CaseMilestoneBatchCreateParams
): Promise<{
  success: boolean
  total: number
  created: number
  failed: number
  results: Array<{ milestone: CaseMilestoneCreateParams; success: boolean; scheduleId?: number; error?: string }>
}> {
  const results: Array<{ milestone: CaseMilestoneCreateParams; success: boolean; scheduleId?: number; error?: string }> = []
  let created = 0
  let failed = 0

  for (const milestone of params.milestones) {
    const result = await createScheduleFromMilestone(milestone, {
      caseName: params.case_name,
      caseId: params.case_id,
      clientId: params.client_id
    })
    
    results.push({
      milestone,
      ...result
    })

    if (result.success) {
      created++
    } else {
      failed++
    }
  }

  return {
    success: failed === 0,
    total: params.milestones.length,
    created,
    failed,
    results
  }
}

/**
 * 从合同确认数据创建案件关键节点日程
 * 用于合同确认时自动生成日程
 */
export async function createSchedulesFromContractConfirm(data: {
  clientId: number | string
  caseName: string
  caseId?: number | string
  courtHearingTime?: string      // 开庭时间
  courtLocation?: string         // 开庭地点
  mediationTime?: string         // 调解时间
  mediationLocation?: string     // 调解地点
  paymentDeadline?: string       // 回款截止时间
  evidenceDeadline?: string      // 举证截止时间
  appealDeadline?: string        // 上诉截止时间
}): Promise<{
  success: boolean
  created: number
  scheduleIds: number[]
}> {
  const milestones: CaseMilestoneCreateParams[] = []
  const scheduleIds: number[] = []

  // 开庭时间
  if (data.courtHearingTime) {
    milestones.push({
      client_id: data.clientId,
      case_id: data.caseId,
      milestone_type: 'court_hearing',
      title: `【开庭】${data.caseName}`,
      scheduled_time: data.courtHearingTime,
      location: data.courtLocation,
      description: `案件开庭：${data.caseName}`,
      reminder_enabled: true,
      reminder_minutes: 1440 // 提前1天提醒
    })
  }

  // 调解时间
  if (data.mediationTime) {
    milestones.push({
      client_id: data.clientId,
      case_id: data.caseId,
      milestone_type: 'mediation',
      title: `【调解】${data.caseName}`,
      scheduled_time: data.mediationTime,
      location: data.mediationLocation,
      description: `案件调解：${data.caseName}`,
      reminder_enabled: true,
      reminder_minutes: 1440
    })
  }

  // 回款截止时间
  if (data.paymentDeadline) {
    milestones.push({
      client_id: data.clientId,
      case_id: data.caseId,
      milestone_type: 'payment_deadline',
      title: `【回款截止】${data.caseName}`,
      scheduled_time: data.paymentDeadline,
      description: `回款截止日期：${data.caseName}`,
      reminder_enabled: true,
      reminder_minutes: 4320 // 提前3天提醒
    })
  }

  // 举证截止时间
  if (data.evidenceDeadline) {
    milestones.push({
      client_id: data.clientId,
      case_id: data.caseId,
      milestone_type: 'evidence_deadline',
      title: `【举证截止】${data.caseName}`,
      scheduled_time: data.evidenceDeadline,
      description: `举证截止日期：${data.caseName}`,
      reminder_enabled: true,
      reminder_minutes: 4320
    })
  }

  // 上诉截止时间
  if (data.appealDeadline) {
    milestones.push({
      client_id: data.clientId,
      case_id: data.caseId,
      milestone_type: 'appeal_deadline',
      title: `【上诉截止】${data.caseName}`,
      scheduled_time: data.appealDeadline,
      description: `上诉截止日期：${data.caseName}`,
      reminder_enabled: true,
      reminder_minutes: 4320
    })
  }

  if (milestones.length === 0) {
    return { success: true, created: 0, scheduleIds: [] }
  }

  const result = await createSchedulesFromMilestones({
    client_id: data.clientId,
    case_id: data.caseId,
    case_name: data.caseName,
    milestones
  })

  result.results.forEach(r => {
    if (r.scheduleId) {
      scheduleIds.push(r.scheduleId)
    }
  })

  return {
    success: result.success,
    created: result.created,
    scheduleIds
  }
}
