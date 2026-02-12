import { http } from '@/utils/request'

function unwrapData<T>(res: any): T {
  return (res && typeof res === 'object' && 'data' in res) ? (res.data as T) : (res as T)
}

export type Tab3Conversation = {
  id: number
  title: string
  pinned: boolean
  last_message_time?: string
  session_id?: string | null
}

export type Tab3Message = {
  id: number
  role: 'user' | 'assistant' | 'system'
  message_type: 'text' | 'card' | 'action_result' | 'scope_hint' | 'error'
  content_json: Record<string, any>
  create_time?: string
}

export type Tab3Scope = {
  role_level: string
  team_id?: number | null
  branch_id?: number | null
  hq_id?: number | null
  scope_text: string
}

export type Tab3CapabilityItem = {
  id: string
  name: string
  tool: string
  mode: 'read' | 'write'
  risk_level: 'low' | 'high'
  requires_confirm: boolean
  enabled: boolean
}

export type Tab3Capabilities = {
  version: string
  items: Tab3CapabilityItem[]
}

export async function listTab3Conversations() {
  const res = await http.get<any>('/ai/tab3/conversations/')
  return unwrapData<{ rows: Tab3Conversation[]; total: number }>(res)
}

export async function createTab3Conversation(payload: { title?: string; pinned?: boolean }) {
  const res = await http.post<any>('/ai/tab3/conversations/', payload)
  return unwrapData<Tab3Conversation>(res)
}

export async function updateTab3Conversation(id: number | string, payload: { title?: string; pinned?: boolean }) {
  const res = await http.put<any>(`/ai/tab3/conversations/${id}/`, payload)
  return unwrapData<Tab3Conversation>(res)
}

export async function deleteTab3Conversation(id: number | string) {
  const res = await http.delete<any>(`/ai/tab3/conversations/${id}/`)
  return unwrapData<{ id: number; deleted: boolean }>(res)
}

export async function clearTab3Conversation(id: number | string) {
  const res = await http.post<any>(`/ai/tab3/conversations/${id}/clear/`, {})
  return unwrapData<{ id: number; cleared: boolean }>(res)
}

export async function getTab3ConversationMessages(id: number | string, limit = 200) {
  const res = await http.get<any>(`/ai/tab3/conversations/${id}/messages/`, { limit })
  return unwrapData<{ rows: Tab3Message[]; total: number }>(res)
}

export async function getTab3Scope() {
  const res = await http.get<any>('/ai/tab3/scope/')
  return unwrapData<Tab3Scope>(res)
}

export async function getTab3Capabilities() {
  const res = await http.get<any>('/ai/tab3/capabilities/')
  return unwrapData<Tab3Capabilities>(res)
}

export type Tab3CustomerCandidate = {
  id: number
  name: string
  contact_person?: string
  contact_phone?: string
}

export type Tab3UserCandidate = {
  id: number
  name: string
  username?: string
  mobile?: string
  role_level?: string
  team_id?: number | null
  branch_id?: number | null
}

export async function searchTab3Customers(query: string, limit = 10) {
  const res = await http.post<any>('/ai/tab3/mcp/call/', {
    tool: 'crm_search_customer',
    args: { query, limit }
  })
  const payload = unwrapData<any>(res)
  return (payload?.result?.rows || []) as Tab3CustomerCandidate[]
}

export async function searchTab3Users(query: string, limit = 10) {
  const res = await http.get<any>('/ai/tab3/users/search/', { q: query, limit })
  const payload = unwrapData<any>(res)
  return (payload?.rows || []) as Tab3UserCandidate[]
}

export async function getTab3ActionDraft(operationId: string) {
  const res = await http.get<any>(`/ai/tab3/actions/${operationId}/draft/`)
  return unwrapData<any>(res)
}

export async function confirmTab3Action(
  operationId: string,
  payload: { edited_fields?: Record<string, any>; idempotency_key?: string } = {},
) {
  const res = await http.post<any>(`/ai/tab3/actions/${operationId}/confirm/`, payload)
  return unwrapData<any>(res)
}

export async function cancelTab3Action(operationId: string) {
  const res = await http.post<any>(`/ai/tab3/actions/${operationId}/cancel/`, {})
  return unwrapData<any>(res)
}

export async function patchTab3Action(
  operationId: string,
  payload: { patch_text?: string; edited_fields?: Record<string, any>; conversation_id?: number | null; idempotency_key?: string } = {},
) {
  const res = await http.post<any>(`/ai/tab3/actions/${operationId}/patch/`, payload)
  return unwrapData<any>(res)
}
