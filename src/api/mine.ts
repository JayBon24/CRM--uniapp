import { http } from '@/utils/request'
import type { ApprovalTask, MineProfile } from '@/types/interfaces/mine'
import type { FeedbackContext, FeedbackTicket, FeedbackType, RemindAdvanceMinutes } from '@/types/interfaces/mine'

function unwrapData<T>(res: any): T {
  return (res && typeof res === 'object' && 'data' in res) ? (res.data as T) : (res as T)
}

export async function getMineProfile(): Promise<MineProfile> {
  const res = await http.get<any>('/mine/profile')
  return unwrapData<MineProfile>(res)
}

export async function submitFeedback(params: {
  type: FeedbackType
  content: string
  images?: string[]
  contact?: string
  context?: FeedbackContext
}): Promise<{ id: string }> {
  const res = await http.post<any>('/mine/feedback', params)
  return unwrapData<{ id: string }>(res)
}

export async function getFeedbackList(): Promise<{ rows: FeedbackTicket[]; total: number }> {
  const res = await http.get<any>('/mine/feedback/list')
  return unwrapData<{ rows: FeedbackTicket[]; total: number }>(res)
}

export async function getApprovalList(params: { status: 'pending' | 'handled' }): Promise<{ rows: ApprovalTask[]; total: number }> {
  const res = await http.get<any>('/mine/approval/list', params)
  return unwrapData<{ rows: ApprovalTask[]; total: number }>(res)
}

export async function getPendingApprovalCount(): Promise<number> {
  const res = await getApprovalList({ status: 'pending' })
  return Number(res?.total || 0)
}

export async function approveTask(params: { id: string; approved: boolean; reject_reason?: string }): Promise<{ ok: boolean }> {
  const res = await http.post<any>(`/mine/approval/${params.id}/approve`, params)
  return unwrapData<{ ok: boolean }>(res)
}

export async function getReminderPreference(): Promise<{ default_remind_advance_minutes: RemindAdvanceMinutes }> {
  const res = await http.get<any>('/mine/settings/remind')
  return unwrapData<{ default_remind_advance_minutes: RemindAdvanceMinutes }>(res)
}

export async function setReminderPreference(params: { default_remind_advance_minutes: RemindAdvanceMinutes }): Promise<{ ok: boolean }> {
  const res = await http.post<any>('/mine/settings/remind', params)
  return unwrapData<{ ok: boolean }>(res)
}

export async function updateMineProfile(params: {
  name?: string
  email?: string
  phonenumber?: string
  dept_id?: number | string | null
}): Promise<MineProfile> {
  const res = await http.post<any>('/mine/profile/update', params)
  return unwrapData<MineProfile>(res)
}
