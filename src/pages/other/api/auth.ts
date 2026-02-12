// 使用统一的请求工具发起网络请求
// 说明：短信发送接口，供前端触发验证码发送
import { http } from '@/utils/request'

/**
 * 发送短信验证码
 * @param {string} phone 手机号
 * @param {string} scene 业务场景（可选，如 bind_new/change_phone）
 * @returns Promise 标准响应
 */
export function sendSmsCode(data: { phone: string; scene?: string }) {
  // 按项目规范，使用 @/utils/request，异常统一在拦截器处理
  return http.post('/user/sms/send', data)
}
