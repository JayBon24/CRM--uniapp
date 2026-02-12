/**
 * 系统配置 Mock 数据
 */

import type { MockHandler } from './utils'
import { createMockResponse, createMockError } from './utils'
import type { CrmConfig } from '@/types/interfaces/config'
import { getStorage, setStorage } from '@/utils/storage'
import { useUserStore } from '@/stores/user'

const CONFIG_KEY = 'mock_crm_config'

// 默认配置
const defaultConfig: CrmConfig = {
  recycle_timeout: {
    grade_a_days: 90, // A级客户：90天
    grade_b_days: 60, // B级客户：60天
    grade_c_days: 30, // C级客户：30天
    grade_d_days: 15  // D级客户：15天
  },
  followup_frequency: {
    meeting_days: 3,  // 面谈阶段：3天内有跟进
    case_days: 7,     // 交案阶段：7天内有跟进
    payment_days: 14  // 回款阶段：14天内有跟进
  },
  recycle_warning_enabled: true, // 回收预警开关：默认开启
  stage_transition_threshold: {
    meeting_requires_visit: false, // 面谈阶段是否需要有效拜访（默认不强制）
    case_requires_contract: true,   // 交案阶段是否需要合同（默认需要）
    payment_requires_amount: 0     // 回款阶段是否需要达到金额（默认0，不限制）
  }
}

function getCrmConfig(): CrmConfig {
  const stored = getStorage(CONFIG_KEY)
  if (stored && typeof stored === 'object') {
    // 合并默认配置和存储的配置
    return {
      ...defaultConfig,
      ...stored,
      recycle_timeout: {
        ...defaultConfig.recycle_timeout,
        ...(stored.recycle_timeout || {})
      },
      followup_frequency: {
        ...defaultConfig.followup_frequency,
        ...(stored.followup_frequency || {})
      }
    }
  }
  return defaultConfig
}

function saveCrmConfig(config: CrmConfig) {
  setStorage(CONFIG_KEY, config)
}

const configMock: MockHandler[] = [
  {
    url: '/sys/config/crm',
    method: 'GET',
    response: () => {
      const userStore = useUserStore()
      // 只有HQ角色可以配置规则
      if (userStore.roleLevel !== 'HQ') {
        return Promise.resolve(createMockError(403, '只有总所管理（HQ）可以配置规则'))
      }
      
      const config = getCrmConfig()
      return Promise.resolve(createMockResponse({ config }))
    }
  },
  {
    url: '/sys/config/crm',
    method: 'POST',
    response: (params: any) => {
      const userStore = useUserStore()
      // 只有HQ角色可以配置规则
      if (userStore.roleLevel !== 'HQ') {
        return Promise.resolve(createMockError(403, '只有总所管理（HQ）可以配置规则'))
      }
      
      const config = params.config as CrmConfig
      if (!config) {
        return Promise.resolve(createMockError(400, '配置参数不能为空'))
      }
      
      // 校验配置数据
      if (config.recycle_timeout) {
        const { grade_a_days, grade_b_days, grade_c_days, grade_d_days } = config.recycle_timeout
        if (grade_a_days < 1 || grade_b_days < 1 || grade_c_days < 1 || grade_d_days < 1) {
          return Promise.resolve(createMockError(400, '回收时限天数必须大于0'))
        }
      }
      
      if (config.followup_frequency) {
        const { meeting_days, case_days, payment_days } = config.followup_frequency
        if (meeting_days < 1 || case_days < 1 || payment_days < 1) {
          return Promise.resolve(createMockError(400, '跟进频率天数必须大于0'))
        }
      }
      
      saveCrmConfig(config)
      return Promise.resolve(createMockResponse({ ok: true }))
    }
  }
]

export default configMock
