/**
 * ChatKit API (uni.request based via @/utils/request)
 */
import { http } from '@/utils/request'

export type ChatKitConfig = {
  assistantId: string
  frameUrl: string
  h5Url?: string
  apiUrl?: string
}

export type ChatKitSessionResponse = {
  client_secret: string
  expires_after?: any
}

export async function getChatKitConfig(): Promise<ChatKitConfig> {
  const res = await http.get('/ai/chatkit/config/')
  return (res as any).data as ChatKitConfig
}

export async function createChatKitSession(payload: {
  assistantId?: string
  assistant_id?: string
  user_id?: string
  userId?: string
  openid?: string
  openId?: string
}): Promise<ChatKitSessionResponse> {
  const res = await http.post('/ai/chatkit/session/', payload)
  return (res as any).data as ChatKitSessionResponse
}
