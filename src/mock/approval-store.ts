import type { ApprovalTask, ApprovalType } from '@/types/interfaces/mine'
import type { UserRoleLevel } from '@/types/interfaces/user'

// 中文注释：Mock 审批共享内存库（Tab1/Tab5 共用）
export const approvalStore: ApprovalTask[] = []

export function buildApprovalChain(applicantRole: UserRoleLevel): UserRoleLevel[] {
  // 规则：根据权限对比表，只有TEAM和SALES可以申领公海客户
  // HQ/BRANCH不能申领，但保留兜底逻辑以防万一
  if (applicantRole === 'HQ') {
    // 兜底：如果允许HQ申领，自己审批即可
    return ['HQ']
  }
  if (applicantRole === 'BRANCH') {
    // 兜底：如果允许BRANCH申领，BRANCH → HQ
    return ['BRANCH', 'HQ']
  }
  if (applicantRole === 'TEAM') {
    // ✅ TEAM申领时，跳过自己，审批链改为 BRANCH → HQ
    return ['BRANCH', 'HQ']
  }
  // SALES申领：TEAM → BRANCH → HQ
  return ['TEAM', 'BRANCH', 'HQ']
}

export function initApprovalSeed(seed: ApprovalTask[]) {
  if (approvalStore.length) return
  approvalStore.push(...seed)
}

export function findApprovalById(id: string) {
  return approvalStore.find(t => t.id === id)
}

export function hasPendingApproval(type: ApprovalType, client_id?: string) {
  return approvalStore.some(t => t.status === 'pending' && t.type === type && (!!client_id ? t.client_id === client_id : true))
}


