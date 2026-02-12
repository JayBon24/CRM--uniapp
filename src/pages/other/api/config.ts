/**
 * 系统配置 API
 */

import { http } from '@/utils/request'
import type { CrmConfig, CrmConfigResponse, CrmConfigSaveParams } from '@/types/interfaces/config'

function unwrapData<T>(res: any): T {
  return (res && typeof res === 'object' && 'data' in res) ? (res.data as T) : (res as T)
}

/**
 * 获取CRM规则配置
 */
export async function getCrmConfig(): Promise<CrmConfig> {
  const res = await http.get<any>('/sys/config/crm')
  return unwrapData<CrmConfigResponse>(res).config
}

/**
 * 保存CRM规则配置
 */
export async function saveCrmConfig(params: CrmConfigSaveParams): Promise<{ ok: boolean }> {
  const res = await http.post<any>('/sys/config/crm', params)
  return unwrapData<{ ok: boolean }>(res)
}
