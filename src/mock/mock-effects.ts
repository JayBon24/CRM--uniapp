import type { ApprovalTask } from '@/types/interfaces/mine'
import { mockClientsDb } from './mock-shared'

// 中文注释：最终审批通过后，执行对业务数据的影响（仅 mock）
export function applyApprovalEffect(task: ApprovalTask) {
  if (task.type === 'LEAD_CLAIM') {
    const cid = Number((task.payload as any).client_id)
    const client: any = mockClientsDb.find(c => Number(c.id) === cid)
    if (!client) return
    // 申领通过：分配经办人=申请人，状态转 FOLLOW_UP
    client.owner_user_id = Number(task.applicant_user_id) || 1
    client.owner_user_name = task.applicant_user_name || '经办人'
    client.status = 'FOLLOW_UP'
    client.sales_stage = 'BLANK'
    client.valid_visit_count = 0 // 重置有效拜访计数
    client.visit_count = 0 // 重置拜访计数
    client.update_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    return
  }

  if (task.type === 'CLIENT_TRANSFER') {
    const cid = Number((task.payload as any).client_id)
    const to = (task.payload as any).to_user
    const client: any = mockClientsDb.find(c => Number(c.id) === cid)
    if (!client) return
    client.owner_user_id = Number(to?.id) || client.owner_user_id
    client.owner_user_name = String(to?.name || client.owner_user_name || '')
    client.update_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    return
  }

  if (task.type === 'LEAD_CREATE') {
    // 一期：只做审批流转示例，不自动生成客户（后续可接 createClient）
    return
  }
}


