/**
 * 用户模块 Mock 数据
 * 包含用户信息、登录注册、个人资料等功能
 */

import type { MockHandler } from './utils'
import {
  createMockResponse,
  createMockError,
  MockErrorCode,
  randomInt,
  randomDate,
  generateRandomId,
  getUserAvatarUrl,
  paginateData,
  filterData,
  sortData,
  mockDelay,
  validateRequiredParams
} from './utils'
import { setStorage, getStorage } from '@/utils/storage'

// 用户信息接口
interface UserInfo {
  userId: number
  deptId: string
  userName: string
  nickName: string
  userType?: string
  email?: string
  phonenumber?: string
  sex?: string
  avatar?: string
  password?: string
  status: string
  delFlag: string
  loginIp?: string
  loginDate?: string
  pwdUpdateDate?: string
  createBy?: string
  createTime: string
  updateBy?: string
  updateTime: string
  remark?: string
  // 新增用户资料字段
  pinYin?: string          // 姓名拼音
  birthDate?: string       // 出生年月
  address?: string         // 通讯地址
  workUnit?: string        // 工作单位
  jobPosition?: string     // 职业岗位
}

// 用户统计数据接口
interface UserStats {
  createdCount: number
  participatedCount: number
  artworkCount: number
  collectCount: number
  followerCount: number
  followingCount: number
  totalLikes: number
  totalViews: number
}

// 用户权限接口
interface UserPermissions {
  canManageExhibition: boolean
  canReviewArtwork: boolean
  canUploadArtwork: boolean
  canDeleteArtwork: boolean
  canManageUser: boolean
}

// 模拟用户数据 - 根据系统角色权限配置
const mockUsers: UserInfo[] = [
  // 1. HQ - 总所管理（仅管理职能，无销售职能）
  {
    userId: 1001,
    deptId: '100',
    userName: 'hq_admin',
    nickName: '总所管理-张总',
    userType: 'HQ',
    email: 'hq@example.com',
    phonenumber: '13800001001',
    sex: '1',
    avatar: getUserAvatarUrl(1),
    password: '123456',
    status: '0',
    delFlag: '0',
    loginIp: '127.0.0.1',
    loginDate: '2024-01-01T10:00:00.000Z',
    pwdUpdateDate: '2024-01-01T10:00:00.000Z',
    createBy: 'admin',
    createTime: '2024-01-01T10:00:00.000Z',
    updateBy: 'admin',
    updateTime: '2024-01-15T14:30:00.000Z',
    remark: '总所管理-全所范围管理与审阅',
    pinYin: 'Zhang Zong',
    birthDate: '1975-03-15',
    address: '北京市朝阳区总部大厦',
    workUnit: '律所总部',
    jobPosition: '总经理'
  },
  // 2. BRANCH - 分所管理（仅管理职能，无销售职能）
  {
    userId: 1002,
    deptId: '200',
    userName: 'branch_manager',
    nickName: '分所管理-李经理',
    userType: 'BRANCH',
    email: 'branch@example.com',
    phonenumber: '13800001002',
    sex: '1',
    avatar: getUserAvatarUrl(2),
    password: '123456',
    status: '0',
    delFlag: '0',
    loginIp: '127.0.0.1',
    loginDate: '2024-01-02T09:00:00.000Z',
    pwdUpdateDate: '2024-01-02T09:00:00.000Z',
    createBy: 'admin',
    createTime: '2024-01-02T09:00:00.000Z',
    updateBy: 'admin',
    updateTime: '2024-01-10T16:20:00.000Z',
    remark: '分所管理-本所范围管理与审阅',
    pinYin: 'Li Jingli',
    birthDate: '1980-07-22',
    address: '上海市浦东新区分所办公楼',
    workUnit: '上海分所',
    jobPosition: '分所经理'
  },
  // 3. TEAM - 团队管理（双重职能：管理+销售）
  {
    userId: 1003,
    deptId: '300',
    userName: 'team_leader',
    nickName: '团队管理-王组长',
    userType: 'TEAM',
    email: 'team@example.com',
    phonenumber: '13800001003',
    sex: '0',
    avatar: getUserAvatarUrl(3),
    password: '123456',
    status: '0',
    delFlag: '0',
    loginIp: '127.0.0.1',
    loginDate: '2024-01-03T11:30:00.000Z',
    pwdUpdateDate: '2024-01-03T11:30:00.000Z',
    createBy: 'admin',
    createTime: '2024-01-03T11:30:00.000Z',
    updateBy: 'admin',
    updateTime: '2024-01-12T13:45:00.000Z',
    remark: '团队管理-基层管理+销售职能',
    pinYin: 'Wang Zuzhang',
    birthDate: '1985-05-10',
    address: '上海市浦东新区团队办公区',
    workUnit: '上海分所销售一组',
    jobPosition: '团队组长'
  },
  // 4. SALES - 销售（仅销售职能）
  {
    userId: 1004,
    deptId: '300',
    userName: 'sales_rep',
    nickName: '销售-赵销售',
    userType: 'SALES',
    email: 'sales@example.com',
    phonenumber: '13800001004',
    sex: '1',
    avatar: getUserAvatarUrl(4),
    password: '123456',
    status: '0',
    delFlag: '0',
    loginIp: '127.0.0.1',
    loginDate: '2024-01-04T08:00:00.000Z',
    pwdUpdateDate: '2024-01-04T08:00:00.000Z',
    createBy: 'admin',
    createTime: '2024-01-04T08:00:00.000Z',
    updateBy: 'admin',
    updateTime: '2024-01-14T10:15:00.000Z',
    remark: '销售-个人负责客户的执行与录入',
    pinYin: 'Zhao Xiaoshou',
    birthDate: '1992-11-20',
    address: '上海市浦东新区销售办公区',
    workUnit: '上海分所销售一组',
    jobPosition: '销售专员'
  },
  // 额外添加一个销售账号用于测试转交等功能
  {
    userId: 1005,
    deptId: '300',
    userName: 'sales_rep2',
    nickName: '销售-孙销售',
    userType: 'SALES',
    email: 'sales2@example.com',
    phonenumber: '13800001005',
    sex: '0',
    avatar: getUserAvatarUrl(5),
    password: '123456',
    status: '0',
    delFlag: '0',
    loginIp: '127.0.0.1',
    loginDate: '2024-01-05T08:30:00.000Z',
    pwdUpdateDate: '2024-01-05T08:30:00.000Z',
    createBy: 'admin',
    createTime: '2024-01-05T08:30:00.000Z',
    updateBy: 'admin',
    updateTime: '2024-01-15T09:20:00.000Z',
    remark: '销售-个人负责客户的执行与录入',
    pinYin: 'Sun Xiaoshou',
    birthDate: '1993-08-15',
    address: '上海市浦东新区销售办公区',
    workUnit: '上海分所销售一组',
    jobPosition: '销售专员'
  }
]

// 模拟用户统计数据
const mockUserStats: Record<number, UserStats> = {
  1001: {
    createdCount: 15,
    participatedCount: 8,
    artworkCount: 25,
    collectCount: 12,
    followerCount: 156,
    followingCount: 89,
    totalLikes: 1250,
    totalViews: 8900
  },
  1002: {
    createdCount: 8,
    participatedCount: 12,
    artworkCount: 18,
    collectCount: 6,
    followerCount: 89,
    followingCount: 45,
    totalLikes: 680,
    totalViews: 4200
  },
  1003: {
    createdCount: 3,
    participatedCount: 6,
    artworkCount: 12,
    collectCount: 4,
    followerCount: 34,
    followingCount: 23,
    totalLikes: 320,
    totalViews: 2100
  }
}

// 生成更真实的用户统计数据
function generateRealisticUserStats(userId: number): UserStats {
  const user = mockUsers.find(u => u.userId === userId)
  const level = user?.userType || 'normal'

  // 根据用户等级生成不同范围的统计数据
  let baseMultiplier = 1
  switch (level) {
    case '0': // admin
      baseMultiplier = 3
      break
    case '1': // user
      baseMultiplier = 2
      break
    default:
      baseMultiplier = 1
  }

  return {
    createdCount: Math.floor(randomInt(1, 20) * baseMultiplier),
    participatedCount: Math.floor(randomInt(5, 30) * baseMultiplier),
    artworkCount: Math.floor(randomInt(10, 50) * baseMultiplier),
    collectCount: Math.floor(randomInt(5, 25) * baseMultiplier),
    followerCount: Math.floor(randomInt(20, 300) * baseMultiplier),
    followingCount: Math.floor(randomInt(10, 150) * baseMultiplier),
    totalLikes: Math.floor(randomInt(100, 3000) * baseMultiplier),
    totalViews: Math.floor(randomInt(1000, 15000) * baseMultiplier)
  }
}

// 模拟用户权限数据
const mockUserPermissions: Record<number, UserPermissions> = {
  1001: {
    canManageExhibition: true,
    canReviewArtwork: true,
    canUploadArtwork: true,
    canDeleteArtwork: true,
    canManageUser: true
  },
  1002: {
    canManageExhibition: true,
    canReviewArtwork: true,
    canUploadArtwork: true,
    canDeleteArtwork: false,
    canManageUser: false
  },
  1003: {
    canManageExhibition: false,
    canReviewArtwork: false,
    canUploadArtwork: true,
    canDeleteArtwork: false,
    canManageUser: false
  }
}

// 生成用户统计数据
function generateUserStats(userId: number): UserStats {
  return {
    createdCount: randomInt(0, 20),
    participatedCount: randomInt(0, 15),
    artworkCount: randomInt(0, 30),
    collectCount: randomInt(0, 10),
    followerCount: randomInt(0, 200),
    followingCount: randomInt(0, 100),
    totalLikes: randomInt(0, 2000),
    totalViews: randomInt(0, 10000)
  }
}

// 生成用户权限数据
function generateUserPermissions(userId: number): UserPermissions {
  const user = mockUsers.find(u => u.userId === userId)
  const level = user?.userType || 'normal'

  return {
    canManageExhibition: level === '0', // admin
    canReviewArtwork: level === '0', // admin
    canUploadArtwork: true,
    canDeleteArtwork: level === '0', // admin
    canManageUser: level === '0' // admin
  }
}

// Mock 处理函数

/**
 * 密码登录
 * Mock模式：验证用户名和密码，必须匹配才能登录
 */
function mockPasswordLogin(params: any) {
  console.log('=== Mock登录调试信息 ===')
  console.log('params:', params)
  console.log('params类型:', typeof params)
  console.log('params键值:', params ? Object.keys(params) : '无参数')

  // 尝试不同的参数获取方式
  console.log('直接访问:', {
    username: params?.username,
    phone: params?.phone,
    user: params?.user
  })

  // 支持多种参数格式
  const username = params?.username || params?.phone || params?.user || ''
  const password = params?.password || params?.pwd || ''

  console.log('解析后的参数:', { username, password })

  // 验证必需参数
  if (!username || !password) {
    console.error('登录参数验证失败:', { username, password })
    return createMockError(MockErrorCode.BAD_REQUEST, '用户名和密码不能为空')
  }

  // Mock模式：验证用户名和密码
  // 1. 查找用户
  const user = mockUsers.find(u => u.userName === username || u.phonenumber === username)

  // 2. 用户不存在
  if (!user) {
    console.error('用户不存在:', username)
    return createMockError(MockErrorCode.UNAUTHORIZED, '用户名或密码错误')
  }

  // 3. 验证密码
  // 前端会用RSA加密密码，这里需要判断：
  // - 如果密码很长（>100字符），说明是RSA加密后的密码，Mock模式下跳过验证
  // - 如果密码较短，说明可能是明文密码（测试用），直接比对
  let passwordValid = false
  
  if (password.length > 100) {
    // RSA加密后的密码，Mock模式下跳过验证（因为Mock没有私钥无法解密）
    console.log('Mock模式：检测到RSA加密密码，跳过密码验证')
    passwordValid = true
  } else {
    // 明文密码，直接比对
    passwordValid = (user.password === password)
    if (!passwordValid) {
      console.error('密码错误:', { username, expectedPassword: user.password, actualPassword: password })
      return createMockError(MockErrorCode.UNAUTHORIZED, '用户名或密码错误')
    }
  }

  const token = `mock-jwt-token-${user.userId}-${Date.now()}`
  const refreshToken = `mock-refresh-token-${user.userId}-${Date.now()}`

  console.log('Mock登录成功，用户:', user.userName, user.nickName)

  // 保存当前用户ID到 localStorage，供 getInfo 使用
  setStorage('currentUserId', user.userId)

  return mockDelay(800).then(() => {
    // 返回后端格式：code: 2000, data: { access, refresh, username, name, userid, ... }
    return {
      code: 2000,
      msg: '请求成功',
      data: {
        access: token,
        refresh: refreshToken,
        username: user.userName,
        name: user.nickName,
        userid: user.userId,
        avatar: user.avatar,
        user_type: user.userType,
        dept_info: {
          dept_id: user.deptId,
          dept_name: '销售部'
        },
        role_info: [
          {
            id: 1,
            name: '销售员',
            key: 'sales'
          }
        ]
      }
    }
  })
}

/**
 * 验证码登录
 * Mock模式：验证手机号是否存在，验证码固定为888888
 */
function mockSmsLogin(params: any) {
  console.log('=== Mock验证码登录调试信息 ===')
  console.log('params:', params)
  console.log('params类型:', typeof params)
  console.log('params键值:', params ? Object.keys(params) : '无参数')

  // 如果params是字符串，尝试解析JSON
  let parsedParams = params
  if (typeof params === 'string') {
    try {
      parsedParams = JSON.parse(params)
      console.log('解析JSON后的params:', parsedParams)
    } catch (error) {
      console.error('JSON解析失败:', error)
      return createMockError(MockErrorCode.BAD_REQUEST, '参数格式错误')
    }
  }

  // 尝试不同的参数获取方式
  console.log('直接访问:', {
    username: parsedParams?.username,
    phone: parsedParams?.phone,
    user: parsedParams?.user,
    code: parsedParams?.code,
    smsCode: parsedParams?.smsCode,
    verifyCode: parsedParams?.verifyCode
  })

  // 支持多种参数格式
  const username = parsedParams?.username || parsedParams?.phone || parsedParams?.user || ''
  const code = parsedParams?.code || parsedParams?.smsCode || parsedParams?.verifyCode || ''

  console.log('解析后的参数:', { username, code })

  // 验证必需参数
  if (!username || !code) {
    console.error('验证码登录参数验证失败:', { username, code })
    return createMockError(MockErrorCode.BAD_REQUEST, '手机号和验证码不能为空')
  }

  // Mock模式：验证手机号和验证码
  // 1. 查找用户
  const user = mockUsers.find(u => u.phonenumber === username || u.userName === username)

  // 2. 用户不存在
  if (!user) {
    console.error('手机号未注册:', username)
    return createMockError(MockErrorCode.UNAUTHORIZED, '手机号未注册')
  }

  // 3. 验证验证码（Mock环境固定为888888）
  if (code !== '888888') {
    console.error('验证码错误:', { code, expectedCode: '888888' })
    return createMockError(MockErrorCode.UNAUTHORIZED, '验证码错误')
  }

  const token = `mock-sms-token-${user.userId}-${Date.now()}`
  const refreshToken = `mock-sms-refresh-token-${user.userId}-${Date.now()}`

  console.log('Mock验证码登录成功，用户:', user.userName, user.nickName)

  return mockDelay(600).then(() => {
    // 直接返回标准格式，不使用 createMockResponse 包装
    return {
      code: 200,
      msg: '操作成功',
      token,
      refreshToken,
      expiresIn: 7200,
      userInfo: user
    }
  })
}

/**
 * 发送验证码
 */
function mockSendSmsCode(params: any) {
  const { phone, type } = params

  // 验证必需参数
  const validation = validateRequiredParams(params, ['phone', 'type'])
  if (!validation.valid) {
    return createMockError(MockErrorCode.BAD_REQUEST, validation.message!)
  }

  // 模拟发送验证码
  const code = '888888' // 开发环境固定验证码

  return createMockResponse({
    expireTime: Date.now() + 5 * 60 * 1000, // 5分钟后过期
    code: code // 仅开发环境返回验证码
  })
}

/**
 * 用户注册
 */
function mockUserRegister(params: any) {
  const { username, password, phone, code } = params

  // 验证必需参数
  const validation = validateRequiredParams(params, ['username', 'password', 'phone', 'code'])
  if (!validation.valid) {
    return createMockError(MockErrorCode.BAD_REQUEST, validation.message!)
  }

  // 模拟验证码验证
  if (code !== '888888') {
    return createMockError(MockErrorCode.BAD_REQUEST, '验证码错误')
  }

  // 检查用户名是否已存在
  const existingUser = mockUsers.find(u => u.userName === username || u.phonenumber === phone)
  if (existingUser) {
    return createMockError(MockErrorCode.BAD_REQUEST, '用户名或手机号已存在')
  }

  // 创建新用户
  const newUser: UserInfo = {
    userId: 1000 + mockUsers.length + 1,
    deptId: '100', // 默认部门
    userName: username,
    nickName: username,
    userType: '1', // 默认用户类型
    email: `${username}@example.com`,
    phonenumber: phone,
    sex: '1', // 默认性别
    avatar: getUserAvatarUrl(mockUsers.length + 1),
    password: '123456', // 注册时密码固定
    status: '0', // 默认状态
    delFlag: '0',
    createBy: 'admin', // 默认创建者
    createTime: new Date().toISOString(),
    updateBy: 'admin',
    updateTime: new Date().toISOString(),
    remark: '新用户'
  }

  mockUsers.push(newUser)

  const token = `mock-register-token-${newUser.userId}-${Date.now()}`
  const refreshToken = `mock-register-refresh-token-${newUser.userId}-${Date.now()}`

  // 直接返回标准格式，不使用 createMockResponse 包装
  return {
    code: 200,
    msg: '操作成功',
    token,
    refreshToken,
    expiresIn: 7200,
    userInfo: newUser
  }
}

/**
 * 获取用户信息
 */
function mockGetUserInfo(params: any) {
  // 从 token 中提取用户ID
  // Mock token 格式: mock-jwt-token-{userId}-{timestamp}
  const token = params?.token || getStorage('token') || ''
  let userId = 1001 // 默认用户ID
  
  // 尝试从 token 中解析用户ID
  if (token && token.includes('mock-jwt-token-')) {
    const match = token.match(/mock-jwt-token-(\d+)-/)
    if (match && match[1]) {
      userId = parseInt(match[1])
      console.log('[mockGetUserInfo] 从 token 解析用户ID:', userId)
    }
  }
  
  // 如果解析失败，尝试从 localStorage 获取
  if (!userId || userId === 1001) {
    const storedUserId = getStorage('currentUserId')
    if (storedUserId) {
      userId = parseInt(storedUserId)
      console.log('[mockGetUserInfo] 从 localStorage 获取用户ID:', userId)
    }
  }

  const user = mockUsers.find(u => u.userId === userId)

  if (!user) {
    console.error('[mockGetUserInfo] 用户不存在，userId:', userId)
    return createMockError(MockErrorCode.UNAUTHORIZED, '用户不存在')
  }

  console.log('[mockGetUserInfo] 返回用户信息:', { userId: user.userId, userName: user.userName, nickName: user.nickName })

  // 清除开发模式下的本地角色缓存，避免干扰
  try {
    const { removeStorage } = require('@/utils/storage')
    removeStorage('dev_role_level')
    removeStorage('dev_org_scope')
    removeStorage('dev_team_id')
    removeStorage('dev_branch_id')
    removeStorage('dev_hq_id')
    console.log('[mockGetUserInfo] 已清除本地开发角色缓存')
  } catch (e) {
    // 忽略错误
  }

  // 确保 userName 和 nickName 字段存在
  if (!user.userName || !user.nickName) {
    console.warn('用户信息缺少必要字段:', { userName: user.userName, nickName: user.nickName })
  }

  // 模拟用户角色和权限
  const roles = ['admin']
  const permissions = [
    'system:user:query',
    'system:user:add',
    'system:user:edit',
    'system:user:remove',
    'zhule:agent:query',
    'zhule:agent:add',
    'zhule:agent:edit',
    'zhule:agent:remove'
  ]

  // 根据用户类型映射角色信息和组织信息
  const roleMapping: Record<string, { roleLevel: string; roleName: string; deptName: string }> = {
    HQ: { roleLevel: 'HQ', roleName: '总所管理', deptName: '总部' },
    BRANCH: { roleLevel: 'BRANCH', roleName: '分所管理', deptName: user.workUnit || '分所' },
    TEAM: { roleLevel: 'TEAM', roleName: '团队管理', deptName: user.workUnit || '销售团队' },
    SALES: { roleLevel: 'SALES', roleName: '销售', deptName: user.workUnit || '销售部' }
  }

  const roleInfo = roleMapping[user.userType || 'SALES'] || roleMapping['SALES']

  // 根据角色设置组织ID
  let teamId = null
  let branchId = null
  let hqId = '100'

  if (user.userType === 'HQ') {
    // HQ：只有 hqId
    hqId = '100'
  } else if (user.userType === 'BRANCH') {
    // BRANCH：有 branchId 和 hqId
    branchId = user.deptId || '200'
    hqId = '100'
  } else if (user.userType === 'TEAM' || user.userType === 'SALES') {
    // TEAM/SALES：有 teamId、branchId 和 hqId
    teamId = user.deptId || '300'
    branchId = '200'
    hqId = '100'
  }

  return mockDelay(500).then(() => {
    // 返回后端格式：code: 2000, data: { user_id, name, username, ... }
    const responseData = {
      code: 2000,
      msg: '获取成功',
      data: {
        user_id: String(user.userId),
        name: user.nickName,
        username: user.userName,
        avatar: user.avatar,
        roleLevel: roleInfo.roleLevel,
        dept_id: user.deptId,
        dept_name: roleInfo.deptName,
        role_info: [
          {
            id: user.userId,
            name: roleInfo.roleName,
            key: roleInfo.roleLevel.toLowerCase()
          }
        ],
        mobile: user.phonenumber,
        email: user.email,
        gender: user.sex,
        user_type: user.userType,
        is_superuser: user.userType === 'HQ',
        // 组织信息
        team_id: teamId,
        branch_id: branchId,
        hq_id: hqId
      },
      roles: roles,
      permissions: permissions
    }

    // 同时保存到 localStorage，供 Mock 函数使用
    try {
      localStorage.setItem('__mock_user_info__', JSON.stringify({
        roleLevel: roleInfo.roleLevel,
        id: user.userId,
        teamId: teamId,
        branchId: branchId,
        hqId: hqId
      }))
      console.log('[mockGetUserInfo] 已保存用户信息到 localStorage')
    } catch (e) {
      console.warn('[mockGetUserInfo] 保存用户信息失败:', e)
    }

    return responseData
  })
}

/**
 * 更新用户信息
 */
function mockUpdateUserInfo(params: any) {
  const {
    nickname,
    email,
    avatar,
      pinYin,
    gender,
    birthDate,
    address,
    workUnit,
    jobPosition
  } = params

  // 模拟从 token 中获取用户ID
  const userId = 1001
  const user = mockUsers.find(u => u.userId === userId)

  if (!user) {
    return createMockError(MockErrorCode.UNAUTHORIZED, '用户不存在')
  }

  // 更新用户信息
  if (nickname) user.nickName = nickname
  if (email) user.email = email
  if (avatar) user.avatar = avatar
  if (pinYin) user.pinYin = pinYin
  if (gender) user.sex = gender
  if (birthDate) user.birthDate = birthDate
  if (address) user.address = address
  if (workUnit) user.workUnit = workUnit
  if (jobPosition) user.jobPosition = jobPosition

  user.updateTime = new Date().toISOString()

  return createMockResponse(user)
}

/**
 * 更新用户资料
 */
function mockUpdateUserProfile(params: any) {
  const {
    nickName,
    email,
    avatar,
    pinYin,
    sex,
    birthDate,
    address,
    workUnit,
    jobPosition
  } = params

  // 模拟从 token 中获取用户ID
  const userId = 1001
  const user = mockUsers.find(u => u.userId === userId)

  if (!user) {
    return createMockError(MockErrorCode.UNAUTHORIZED, '用户不存在')
  }

  // 更新用户资料
  if (nickName) user.nickName = nickName
  if (email) user.email = email
  if (avatar) user.avatar = avatar
  if (pinYin) user.pinYin = pinYin
  if (sex) user.sex = sex
  if (birthDate) user.birthDate = birthDate
  if (address) user.address = address
  if (workUnit) user.workUnit = workUnit
  if (jobPosition) user.jobPosition = jobPosition

  user.updateTime = new Date().toISOString()

  // 返回完整的用户资料信息
  const userProfile = {
    ...user,
    profileComplete: !!(user.pinYin && user.birthDate && user.address && user.workUnit && user.jobPosition),
    lastLoginTime: user.loginDate,
    registerTime: user.createTime,
    level: user.userType === '0' ? 'admin' : 'normal',
    levelText: user.userType === '0' ? '管理员' : '普通用户'
  }

  return mockDelay(300).then(() => {
    return createMockResponse(userProfile)
  })
}

/**
 * 获取用户统计数据
 */
function mockGetUserStats(params: any) {
  const userId = 1001 // 模拟当前用户ID
  const stats = mockUserStats[userId] || generateRealisticUserStats(userId)

  return createMockResponse(stats)
}

/**
 * 获取用户权限
 */
function mockGetUserPermissions(params: any) {
  const userId = 1001 // 模拟当前用户ID
  const permissions = mockUserPermissions[userId] || generateUserPermissions(userId)

  return createMockResponse(permissions)
}

/**
 * 获取用户资料
 */
function mockGetUserProfile(params: any) {
  // 模拟从 token 中获取用户ID
  const userId = 1001
  const user = mockUsers.find(u => u.userId === userId)

  if (!user) {
    return createMockError(MockErrorCode.UNAUTHORIZED, '用户不存在')
  }

  // 返回用户资料信息（包含完整的用户信息）
  const userProfile = {
    ...user,
    // 添加一些额外的资料字段
    profileComplete: !!(user.pinYin && user.birthDate && user.address && user.workUnit && user.jobPosition),
    lastLoginTime: user.loginDate,
    registerTime: user.createTime,
    // 用户等级（根据用户类型判断）
    level: user.userType === '0' ? 'admin' : 'normal',
    levelText: user.userType === '0' ? '管理员' : '普通用户'
  }

  return mockDelay(300).then(() => {
    return createMockResponse(userProfile)
  })
}

/**
 * 用户退出登录
 */
function mockUserLogout(params: any) {
  // 模拟退出登录的延迟
  return mockDelay(500).then(() => {
    // 模拟清除 token 和会话
    return createMockResponse({
      code: 200,
      msg: '退出成功',
      data: {
        message: '用户已成功退出登录',
        timestamp: new Date().toISOString(),
        sessionCleared: true
      }
    })
  })
}

/**
 * 微信登录
 */
function mockWechatLogin(params: any) {
  const { code, userInfo } = params

  // 验证必需参数
  const validation = validateRequiredParams(params, ['code'])
  if (!validation.valid) {
    return createMockError(MockErrorCode.BAD_REQUEST, validation.message!)
  }

  // 验证code格式（微信code通常是32位字符串）
  if (!code || typeof code !== 'string' || code.length < 10) {
    return createMockError(MockErrorCode.BAD_REQUEST, '微信登录凭证无效')
  }

  // 模拟微信登录
  const user = mockUsers[0] // 使用第一个用户作为微信登录用户

  // 如果有userInfo，更新用户信息
  if (userInfo) {
    user.nickName = userInfo.nickName || user.nickName
    user.avatar = userInfo.avatarUrl || user.avatar
    // 注意：UserInfo 接口中没有这些字段，会导致类型错误
    // user.gender = userInfo.gender || user.gender
    // user.country = userInfo.country || user.country
    // user.province = userInfo.province || user.province
    // user.city = userInfo.city || user.city
    // user.language = userInfo.language || user.language
  }

  const token = `mock-wechat-token-${user.userId}-${Date.now()}`
  const refreshToken = `mock-wechat-refresh-token-${user.userId}-${Date.now()}`

  // 直接返回标准格式，不使用 createMockResponse 包装
  return {
    code: 200,
    msg: '操作成功',
    token,
    refreshToken,
    expiresIn: 7200,
    userInfo: user
  }
}

/**
 * 用户登录
 */
export const login = {
  code: 200,
  msg: '操作成功',
  token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYzNjU0NzIwMCwiZXhwIjoxNjM2NjMzNjAwfQ.example'
}

/**
 * 获取用户信息
 */
export const getInfo = {
  code: 200,
  msg: '操作成功',
  user: {
    userId: 'U2024001',
    userName: 'admin',
    nickName: '管理员',
    avatar: '',
    email: 'admin@example.com'
  },
  roles: ['admin'],
  permissions: [
    'system:user:query',
    'system:user:add',
    'system:user:edit',
    'system:user:remove',
    'zhule:agent:query',
    'zhule:agent:add',
    'zhule:agent:edit',
    'zhule:agent:remove'
  ]
}

/**
 * 用户退出
 */
export const logout = {
  code: 200,
  msg: '操作成功'
}

/**
 * 小程序登录（使用MD5加密密码）
 */
function mockMiniappLogin(params: any) {
  console.log('=== Mock小程序登录调试信息 ===')
  console.log('params:', params)
  console.log('params类型:', typeof params)

  // 支持多种参数格式
  const username = params?.username || params?.phone || params?.user || ''
  const password = params?.password || params?.pwd || ''

  console.log('解析后的参数:', { username, password })

  // 验证必需参数
  if (!username || !password) {
    console.error('登录参数验证失败:', { username, password })
    return createMockError(MockErrorCode.BAD_REQUEST, '用户名和密码不能为空')
  }

  // Mock模式：不验证密码（因为前端已经MD5加密），直接返回成功
  // 根据用户名查找用户
  let user = mockUsers.find(u => u.userName === username || u.phonenumber === username)

  // 如果找不到用户，使用默认用户
  if (!user) {
    console.log('用户不存在，使用默认用户')
    user = mockUsers[0] // 使用第一个用户作为默认用户
  }

  const token = `mock-miniapp-token-${user.userId}-${Date.now()}`

  console.log('Mock小程序登录成功，用户:', user.userName)

  return mockDelay(800).then(() => {
    return createMockResponse({
      code: 2000,
      msg: '登录成功',
      data: {
        token,
        userId: user.userId,
        username: user.userName,
        nickname: user.nickName,
        avatar: user.avatar,
        phone: user.phonenumber,
        email: user.email
      }
    })
  })
}

// 导出 Mock 处理器
export default [
  {
    url: '/miniapp/login/',
    response: mockPasswordLogin
  },
  {
    url: '/mine/profile/',
    response: mockGetUserInfo
  },
  {
    url: '/customer/user/user_info/',
    response: mockGetUserInfo
  },
  {
    url: '/user/getInfo',
    response: mockGetUserInfo
  },
  {
    url: '/auth/login/sms',
    response: mockSmsLogin
  },
  {
    url: '/user/sms/send',
    response: mockSendSmsCode
  },
  {
    url: '/auth/register',
    response: mockUserRegister
  },
  {
    url: '/user/info',
    response: mockGetUserInfo
  },
  {
    url: '/user/update',
    response: mockUpdateUserInfo
  },
  {
    url: '/user/stats',
    response: mockGetUserStats
  },
  {
    url: '/user/permissions',
    response: mockGetUserPermissions
  },
  {
    url: '/user/logout',
    response: mockUserLogout
  },
  {
    url: '/auth/logout',
    response: mockUserLogout
  },
  {
    url: '/auth/wechat/login',
    response: mockWechatLogin
  },
  {
    url: '/user/profile',
    response: mockGetUserProfile
  },
  {
    url: '/user/profile',
    method: 'PUT',
    response: mockUpdateUserProfile
  },
  {
    url: '/user/phone/change',
    method: 'PUT',
    response: (params: any) => {
      const body = params?.body || params
      const phone = body?.phone
      const smsCode = body?.smsCode
      if (!phone || !smsCode) {
        return createMockError(MockErrorCode.BAD_REQUEST, '手机号或验证码不能为空')
      }
      if (!/^1\d{10}$/.test(phone)) {
        return createMockError(MockErrorCode.BAD_REQUEST, '手机号格式不正确')
      }
      // 模拟验证码正确
      const userId = 1001
      const user = mockUsers.find(u => u.userId === userId)
      if (!user) return createMockError(MockErrorCode.UNAUTHORIZED, '用户不存在')
      user.phonenumber = phone
      user.updateTime = new Date().toISOString()
      return createMockResponse({ success: true, phone })
    }
  }
] as MockHandler[]

// 导出单个函数供其他模块使用
export { mockGetUserStats as getMockUserStats, mockGetUserPermissions as getMockUserPermissions }
