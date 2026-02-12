// Mock: 短信发送接口
import { createMockResponse } from '@/mock/utils'

export default [
  {
    url: '/user/sms/send',
    method: 'POST',
    response: (options: any) => {
      // 简单返回成功，模拟发送成功
      const body = options?.body || {}
      const phone = body?.phone || ''
      // 返回提示信息与过期时间（60s）
      return createMockResponse({ success: true, phone, expiresIn: 60 })
    }
  }
]

