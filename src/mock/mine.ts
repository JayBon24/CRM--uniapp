import type { MockHandler } from './utils'
import { createMockListResponse, createMockResponse, createMockError } from './utils'
import type { ApprovalHistoryItem, ApprovalTask, FeedbackTicket, MineProfile, RemindAdvanceMinutes } from '@/types/interfaces/mine'
import { getStorage, setStorage } from '@/utils/storage'
import { useUserStore } from '@/stores/user'
import { approvalStore, buildApprovalChain, findApprovalById, initApprovalSeed } from './approval-store'
import { applyApprovalEffect } from './mock-effects'
// 中文注释：从共享文件导入 mockUsers，确保数据源统一
import { mockUsers, type UserInfo } from './mock-shared'

// 获取当前用户（从 token 中获取用户ID，与 mockGetUserInfo 逻辑一致）
function getCurrentUser(): UserInfo | null {
  // 从 token 中提取用户ID（与 mockGetUserInfo 逻辑完全一致）
  const token = getStorage('token') || ''
  let userId: number | null = null
  
  // 优先从 token 中解析用户ID
  if (token && token.includes('mock-jwt-token-')) {
    const match = token.match(/mock-jwt-token-(\d+)-/)
    if (match && match[1]) {
      userId = parseInt(match[1])
      console.log('[getCurrentUser] 从 token 解析用户ID:', userId)
    }
  }
  
  // 如果解析失败，尝试从 localStorage 获取
  if (!userId) {
    const storedUserId = getStorage('currentUserId')
    if (storedUserId) {
      userId = parseInt(storedUserId)
      console.log('[getCurrentUser] 从 localStorage 获取用户ID:', userId)
    }
  }
  
  // 如果还是不存在，尝试从 userStore.id 获取
  const userStore = useUserStore()
  if (!userId && userStore.id) {
    userId = parseInt(String(userStore.id))
    console.log('[getCurrentUser] 从 userStore.id 获取用户ID:', userId)
  }
  
  // 如果还是不存在，使用默认值 1001
  if (!userId) {
    userId = 1001
    console.log('[getCurrentUser] 使用默认用户ID:', userId)
  }
  
  const user = mockUsers.find(u => u.userId === userId)
  if (!user) {
    console.error('[getCurrentUser] 用户不存在，userId:', userId)
    console.error('[getCurrentUser] 可用的用户ID列表:', mockUsers.map(u => u.userId))
    return null
  }
  
  console.log('[getCurrentUser] 找到用户:', {
    userId: user.userId,
    userName: user.userName,
    nickName: user.nickName,
    userType: user.userType,
    email: user.email,
    phonenumber: user.phonenumber,
    workUnit: user.workUnit,
    'phonenumber存在': !!user.phonenumber,
    'workUnit存在': !!user.workUnit
  })
  
  // 验证关键字段是否存在
  if (!user.phonenumber) {
    console.warn('[getCurrentUser] 警告：用户手机号为空，userId:', user.userId)
  }
  if (!user.workUnit) {
    console.warn('[getCurrentUser] 警告：用户工作单位为空，userId:', user.userId)
  }
  
  return user
}

const FEEDBACK_KEY = 'mock_feedback_list'
const REMIND_KEY = 'mock_remind_advance'

function nowStr() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function getRemindAdvance(): RemindAdvanceMinutes {
  const v = getStorage(REMIND_KEY)
  return (v === 30 || v === '30') ? 30 : 15
}

function setRemindAdvance(v: RemindAdvanceMinutes) {
  setStorage(REMIND_KEY, v)
}

function getFeedbackList(): FeedbackTicket[] {
  const v = getStorage(FEEDBACK_KEY)
  return Array.isArray(v) ? (v as any) : []
}

function saveFeedbackList(list: FeedbackTicket[]) {
  setStorage(FEEDBACK_KEY, list)
}

const seedApprovals: ApprovalTask[] = [
  {
    id: 'appr_1',
    type: 'LEAD_CLAIM',
    status: 'pending',
    applicant_user_id: 'u_1',
    applicant_user_name: '王销售',
    client_id: '3',
    client_name: '深圳建筑工程公司',
    created_at: nowStr(),
    payload: { client_id: '3', name: '深圳建筑工程公司', reason: '客户主动来访，需尽快跟进' },
    approval_chain: ['TEAM', 'BRANCH', 'HQ'],
    current_step_index: 0,
    current_approver_role: 'TEAM',
    history: []
  },
  {
    id: 'appr_2',
    type: 'CLIENT_TRANSFER',
    status: 'pending',
    applicant_user_id: 'u_2',
    applicant_user_name: '李律师',
    client_id: '4',
    client_name: '广州市政建设集团',
    created_at: nowStr(),
    payload: {
      client_id: '4',
      from_user: { id: 'u_2', name: '李律师' },
      to_user: { id: 'u_3', name: '张销售' },
      reason: '客户所在地变更，转交更合适的经办人'
    },
    approval_chain: ['TEAM', 'BRANCH', 'HQ'],
    current_step_index: 0,
    current_approver_role: 'TEAM',
    history: []
  },
  {
    id: 'appr_3',
    type: 'LEAD_CREATE',
    status: 'approved',
    applicant_user_id: 'u_1',
    applicant_user_name: '王销售',
    created_at: nowStr(),
    approved_at: nowStr(),
    payload: {
      form: {
        client_name: '南京工程设备公司',
        contact_name: '赵经理',
        mobile: '13800001111',
        region: '江苏省南京市',
        source_channel: '朋友推荐',
        demand_summary: ''
      }
    },
    approval_chain: ['TEAM', 'BRANCH', 'HQ'],
    current_step_index: 2,
    current_approver_role: 'HQ',
    history: [
      { step_role: 'TEAM', approver_user_id: 'u_team', approver_user_name: '团队主管', decision: 'approved', decided_at: nowStr() } as ApprovalHistoryItem,
      { step_role: 'BRANCH', approver_user_id: 'u_branch', approver_user_name: '分所主管', decision: 'approved', decided_at: nowStr() } as ApprovalHistoryItem,
      { step_role: 'HQ', approver_user_id: 'u_hq', approver_user_name: '总所主管', decision: 'approved', decided_at: nowStr() } as ApprovalHistoryItem,
    ]
  },
]

initApprovalSeed(seedApprovals)

// 个人资料处理函数（统一处理逻辑）
function handleMineProfile() {
  const userStore = useUserStore()
  const user = getCurrentUser()
  
  if (!user) {
    console.error('[Mine Profile API] 无法获取用户信息')
    return Promise.resolve(createMockError(401, '用户不存在'))
  }
  
  // 详细日志，确保数据正确
  console.log('[Mine Profile API] ===== 开始处理个人资料 =====')
  console.log('[Mine Profile API] 从 mockUsers 获取用户:', {
    userId: user.userId,
    userName: user.userName,
    nickName: user.nickName,
    userType: user.userType,
    email: user.email,
    phonenumber: user.phonenumber,
    workUnit: user.workUnit
  })
  console.log('[Mine Profile API] user 对象完整内容:', JSON.stringify(user, null, 2))
  
  // 根据用户类型映射角色信息（与 mockGetUserInfo 逻辑完全一致）
  const roleMapping: Record<string, { roleLevel: string; roleName: string; deptName: string }> = {
    HQ: { roleLevel: 'HQ', roleName: '总所管理', deptName: '总部' },
    BRANCH: { roleLevel: 'BRANCH', roleName: '分所管理', deptName: user.workUnit || '分所' },
    TEAM: { roleLevel: 'TEAM', roleName: '团队管理', deptName: user.workUnit || '销售团队' },
    SALES: { roleLevel: 'SALES', roleName: '销售', deptName: user.workUnit || '销售部' }
  }
  
  const roleInfo = roleMapping[user.userType || 'SALES'] || roleMapping['SALES']
  
  // 根据角色类型确定组织信息
  let branchName = ''
  let teamName = ''
  
  console.log('[Mine Profile API] 开始计算组织信息，userType:', user.userType, 'workUnit:', user.workUnit)
  
  if (user.userType === 'HQ') {
    // HQ：显示总部
    branchName = user.workUnit || '律所总部'
    teamName = ''
    console.log('[Mine Profile API] HQ角色，branchName:', branchName)
  } else if (user.userType === 'BRANCH') {
    // BRANCH：显示分所名称（workUnit）
    branchName = user.workUnit || '分所'
    teamName = ''
    console.log('[Mine Profile API] BRANCH角色，branchName:', branchName)
  } else if (user.userType === 'TEAM' || user.userType === 'SALES') {
    // TEAM/SALES：显示分所和团队
    // workUnit 格式：上海分所销售一组
    // 需要拆分：分所 = "上海分所"，团队 = "销售一组"
    if (user.workUnit) {
      console.log('[Mine Profile API] workUnit存在，开始拆分:', user.workUnit)
      // 尝试从 workUnit 中提取分所和团队
      // 如果 workUnit 包含"分所"，则分所是前面的部分+分所，团队是后面的部分
      const parts = user.workUnit.split('分所')
      console.log('[Mine Profile API] workUnit拆分结果:', parts)
      if (parts.length === 2 && parts[0] && parts[1]) {
        branchName = parts[0] + '分所'
        teamName = parts[1].trim() || ''
        console.log('[Mine Profile API] 拆分成功，branchName:', branchName, 'teamName:', teamName)
      } else {
        // 如果格式不匹配，使用默认值
        branchName = '上海分所'
        teamName = user.userType === 'TEAM' ? '销售一组' : ''
        console.log('[Mine Profile API] 拆分失败，使用默认值，branchName:', branchName, 'teamName:', teamName)
      }
    } else {
      branchName = '上海分所'
      teamName = user.userType === 'TEAM' ? '销售一组' : ''
      console.log('[Mine Profile API] workUnit不存在，使用默认值，branchName:', branchName, 'teamName:', teamName)
    }
  }
  
  console.log('[Mine Profile API] 最终组织信息:', { branchName, teamName })
  
  // 确保所有字段都有值，直接从 user 对象获取
  // 验证关键字段是否存在
  if (!user.phonenumber) {
    console.error('[Mine Profile API] 错误：用户手机号为空！userId:', user.userId, 'user对象:', user)
  }
  if (!user.workUnit) {
    console.error('[Mine Profile API] 错误：用户工作单位为空！userId:', user.userId, 'user对象:', user)
  }
  
  const profile: MineProfile = {
    user_id: String(user.userId),
    name: user.nickName || user.userName || '用户',
    avatar: userStore.avatar || '',
    roleLevel: roleInfo.roleLevel as any, // 使用 roleInfo.roleLevel，确保与 mockGetUserInfo 一致
    orgScope: (userStore as any).orgScope || 'SELF',
    teamName: teamName, // 使用计算出的值
    branchName: branchName, // 使用计算出的值
    email: user.email || '', // 确保从 user 对象获取，如果不存在则使用空字符串（前端会显示 '-'）
    phonenumber: user.phonenumber || '' // 确保从 user 对象获取，如果不存在则使用空字符串（前端会显示 '-'）
  }
  
  console.log('[Mine Profile API] ===== 构建的 profile 对象 =====')
  console.log('[Mine Profile API] profile 完整内容:', JSON.stringify(profile, null, 2))
  console.log('[Mine Profile API] 字段检查:', {
    email: profile.email,
    phonenumber: profile.phonenumber,
    branchName: profile.branchName,
    teamName: profile.teamName,
    'email存在': !!profile.email,
    'phonenumber存在': !!profile.phonenumber,
    'branchName存在': !!profile.branchName,
    'teamName存在': !!profile.teamName
  })
  console.log('[Mine Profile API] ===== 结束处理个人资料 =====')
  
  return Promise.resolve(createMockResponse(profile))
}

const mineMock: MockHandler[] = [
  {
    url: '/api/mine/profile',
    method: 'GET',
    response: handleMineProfile
  },
  // 添加不带 /api 前缀的URL，确保能匹配到（request.ts 会移除 /api 前缀）
  {
    url: '/mine/profile',
    method: 'GET',
    response: handleMineProfile
  },
  // 注意：/mine/profile/ 和 /api/mine/profile/ 由 user.ts 处理（用于 getInfo() 设置角色）
  // 这里只处理 /mine/profile（不带尾部斜杠），用于 getMineProfile() 显示个人资料
  {
    url: '/mine/settings/remind',
    method: 'GET',
    response: () => {
      return Promise.resolve(createMockResponse({ default_remind_advance_minutes: getRemindAdvance() }))
    }
  },
  {
    url: '/mine/settings/remind',
    method: 'POST',
    response: (params: any) => {
      const v = Number(params.default_remind_advance_minutes)
      if (v !== 15 && v !== 30) return Promise.resolve(createMockError(400, '提前量只支持 15/30 分钟'))
      setRemindAdvance(v as any)
      return Promise.resolve(createMockResponse({ ok: true }))
    }
  },
  {
    url: '/api/mine/profile/update',
    method: 'POST',
    response: (params: any) => {
      const userStore = useUserStore()
      const user = getCurrentUser()
      
      if (!user) {
        console.error('[Mine Profile Update API] 无法获取用户信息')
        return Promise.resolve(createMockError(401, '用户不存在'))
      }
      
      // 更新 userStore 中的用户信息
      if (params.name !== undefined) {
        userStore.nickName = params.name
        user.nickName = params.name // 同时更新 mockUsers 中的数据
      }
      if (params.email !== undefined) {
        (userStore as any).email = params.email
        user.email = params.email // 同时更新 mockUsers 中的数据
      }
      if (params.phonenumber !== undefined) {
        (userStore as any).phonenumber = params.phonenumber
        user.phonenumber = params.phonenumber // 同时更新 mockUsers 中的数据
      }
      
      // 根据用户类型映射角色信息（与 GET 接口保持一致）
      const roleMapping: Record<string, { roleLevel: string; roleName: string; deptName: string }> = {
        HQ: { roleLevel: 'HQ', roleName: '总所管理', deptName: '总部' },
        BRANCH: { roleLevel: 'BRANCH', roleName: '分所管理', deptName: user.workUnit || '分所' },
        TEAM: { roleLevel: 'TEAM', roleName: '团队管理', deptName: user.workUnit || '销售团队' },
        SALES: { roleLevel: 'SALES', roleName: '销售', deptName: user.workUnit || '销售部' }
      }
      
      const roleInfo = roleMapping[user.userType || 'SALES'] || roleMapping['SALES']
      
      // 根据角色类型确定组织信息（与 GET 接口保持一致）
      let branchName = ''
      let teamName = ''
      
      if (user.userType === 'HQ') {
        branchName = user.workUnit || '律所总部'
        teamName = ''
      } else if (user.userType === 'BRANCH') {
        branchName = user.workUnit || '分所'
        teamName = ''
      } else if (user.userType === 'TEAM' || user.userType === 'SALES') {
        if (user.workUnit) {
          const parts = user.workUnit.split('分所')
          if (parts.length === 2 && parts[0] && parts[1]) {
            branchName = parts[0] + '分所'
            teamName = parts[1].trim() || ''
          } else {
            branchName = '上海分所'
            teamName = user.userType === 'TEAM' ? '销售一组' : ''
          }
        } else {
          branchName = '上海分所'
          teamName = user.userType === 'TEAM' ? '销售一组' : ''
        }
      }
      
      // 返回更新后的 profile
      const profile: MineProfile = {
        user_id: String(user.userId),
        name: user.nickName || user.userName || '',
        avatar: userStore.avatar || '',
        roleLevel: roleInfo.roleLevel as any, // 使用 roleInfo.roleLevel，确保与 GET 接口一致
        orgScope: (userStore as any).orgScope || 'SELF',
        teamName: teamName,
        branchName: branchName,
        email: user.email || '', // 确保从 user 对象获取
        phonenumber: user.phonenumber || '' // 确保从 user 对象获取
      }
      
      console.log('[Mine Profile Update API] 返回更新后的 profile:', profile)
      
      return Promise.resolve(createMockResponse(profile))
    }
  },
  {
    url: '/mine/feedback',
    method: 'POST',
    response: (params: any) => {
      const id = `fb_${Date.now()}`
      const item: FeedbackTicket = {
        id,
        type: params.type,
        content: params.content,
        images: params.images || [],
        contact: params.contact || '',
        context: params.context || undefined,
        status: 'open',
        created_at: nowStr()
      }
      const list = getFeedbackList()
      list.unshift(item)
      saveFeedbackList(list)
      return Promise.resolve(createMockResponse({ id }))
    }
  },
  {
    url: '/mine/feedback/list',
    method: 'GET',
    response: () => {
      const rows = getFeedbackList()
      return Promise.resolve(createMockListResponse({ rows, total: rows.length }))
    }
  },
  {
    url: '/mine/approval/list',
    method: 'GET',
    response: (params: any) => {
      const userStore = useUserStore()
      const tab = params.status === 'handled' ? 'handled' : 'pending'

      // pending：只返回“当前应由我这个层级审批”的任务
      if (tab === 'pending') {
        const rows = approvalStore.filter(t => t.status === 'pending' && t.current_approver_role === userStore.roleLevel)
        return Promise.resolve(createMockListResponse({ rows, total: rows.length }))
      }

      // handled：返回“我本层级已处理过”的任务（即便后续还有上级审批） + 最终已结束任务
      const rows = approvalStore.filter(t => {
        const touchedByMe = Array.isArray(t.history) && t.history.some(h => h.step_role === userStore.roleLevel)
        return touchedByMe || t.status !== 'pending'
      })
      return Promise.resolve(createMockListResponse({ rows, total: rows.length }))
    }
  },
  {
    url: '/mine/approval/:id/approve',
    method: 'POST',
    response: (params: any) => {
      const userStore = useUserStore()
      const id = String(params.id || '')
      const approved = !!params.approved
      const task = findApprovalById(id)
      if (!task) return Promise.resolve(createMockError(404, '审批任务不存在'))

      // 必须当前层级审批
      if (task.status !== 'pending') return Promise.resolve(createMockError(400, '任务已结束'))
      if (task.current_approver_role !== userStore.roleLevel) return Promise.resolve(createMockError(403, '当前无权限审批该任务'))

      const historyItem: ApprovalHistoryItem = {
        step_role: userStore.roleLevel,
        approver_user_id: String(userStore.id || 'u_x'),
        approver_user_name: String(userStore.nickName || userStore.name || '审批人'),
        decision: approved ? 'approved' : 'rejected',
        reject_reason: approved ? '' : String(params.reject_reason || '').trim(),
        decided_at: nowStr()
      }
      if (!approved && !historyItem.reject_reason) return Promise.resolve(createMockError(400, 'reject_reason 必填'))

      task.history = Array.isArray(task.history) ? task.history : []
      task.history.push(historyItem)

      if (!approved) {
        task.status = 'rejected'
        task.approved_at = nowStr()
        task.reject_reason = historyItem.reject_reason
        return Promise.resolve(createMockResponse({ ok: true }))
      }

      // 通过：若还有上级，流转到下一层；否则最终通过并触发效果
      const nextIndex = Number(task.current_step_index || 0) + 1
      if (nextIndex < task.approval_chain.length) {
        task.current_step_index = nextIndex
        task.current_approver_role = task.approval_chain[nextIndex]
        return Promise.resolve(createMockResponse({ ok: true, next_role: task.current_approver_role }))
      }

      task.status = 'approved'
      task.approved_at = nowStr()
      task.reject_reason = ''
      try {
        applyApprovalEffect(task)
      } catch (e) {
        console.error('Mock: applyApprovalEffect failed', e)
      }
      return Promise.resolve(createMockResponse({ ok: true }))
    }
  },
]

export default mineMock


