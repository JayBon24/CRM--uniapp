/**
 * CRM规则配置相关类型定义
 */

/**
 * 客户等级
 */
export type ClientGrade = 'A' | 'B' | 'C' | 'D'

/**
 * 销售阶段
 */
export type SalesStage = 'MEETING' | 'CASE' | 'PAYMENT'

/**
 * 回收时限配置（按客户等级）
 */
export interface RecycleTimeoutConfig {
  grade_a_days: number // A级客户：无有效跟进/无拜访后X天自动收回公海（已废弃，改为按无赢单天数）
  grade_b_days: number // B级客户：无有效跟进/无拜访后X天自动收回公海（已废弃，改为按无赢单天数）
  grade_c_days: number // C级客户：无有效跟进/无拜访后X天自动收回公海（已废弃，改为按无赢单天数）
  grade_d_days: number // D级客户：无有效跟进/无拜访后X天自动收回公海（已废弃，改为按无赢单天数）
  no_won_days: number // 公海回收规则：多少天内没有成交(赢单)自动回收
}

/**
 * 跟进频率标准配置（按销售阶段）
 */
export interface FollowupFrequencyConfig {
  meeting_days: number // 面谈阶段：最小跟进频率（如：3天内有跟进）
  case_days: number // 交案阶段：最小跟进频率
  payment_days: number // 回款阶段：最小跟进频率
}

/**
 * 跟进提醒配置
 */
export interface FollowupReminderConfig {
  enabled: boolean // 是否启用跟进提醒
  days: number // 当经办人多少天内没有进行对应的跟进会发送提醒（默认15天，半个月）
}

/**
 * CRM规则配置
 */
export interface CrmConfig {
  // 回收时限配置
  recycle_timeout: RecycleTimeoutConfig
  // 跟进频率标准配置
  followup_frequency: FollowupFrequencyConfig
  // 回收预警开关
  recycle_warning_enabled: boolean
  // 跟进提醒配置
  followup_reminder: FollowupReminderConfig
  // 销售阶段转化阈值（可选，二期功能）
  stage_transition_threshold?: {
    meeting_requires_visit?: boolean // 面谈阶段是否需要有效拜访
    case_requires_contract?: boolean // 交案阶段是否需要合同
    payment_requires_amount?: number // 回款阶段是否需要达到金额
  }
}

/**
 * 获取规则配置响应
 */
export interface CrmConfigResponse {
  config: CrmConfig
}

/**
 * 保存规则配置参数
 */
export interface CrmConfigSaveParams {
  config: CrmConfig
}
