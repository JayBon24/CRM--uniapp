/**
 * 用户相关API接口
 */
import { http } from '@/utils/request'
import type { LoginParams, RegisterParams, UserInfo, UserProfile } from '@/types/user'

/**
 * 用户登录
 */
export const login = (params: {
  phone: string
  password: string
  code?: string
  uuid?: string
}) => {
  // 后端期望 username 字段，但支持通过手机号登录
  // 将 phone 映射为 username
  return http.post('/miniapp/login/', {
    username: params.phone,
    password: params.password
  })
}

/**
 * 获取用户信息
 * 注意：后端使用 /mine/profile/ 接口返回用户信息
 */
export const getInfo = () => {
  return http.get('/mine/profile/')
}

/**
 * 用户退出
 */
export const logout = () => {
  return http.post('/logout/')
}

/**
 * 验证码登录
 * @param params 登录参数
 * @returns 登录结果
 */
export function codeLogin(params: { phone: string; smsCode: string }) {
  return http.post('/auth/login/sms', params)
}

/**
 * 用户注册
 * @param params 注册参数
 * @returns 注册结果
 */
export function register(params: RegisterParams) {
  return http.post('/auth/register', params)
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo() {
  return http.get('/user/info')
}

/**
 * 更新用户信息
 * @param params 用户信息
 * @returns 更新结果
 */
export function updateUserInfo(params: Partial<UserInfo>) {
  return http.put('/user/info', params)
}

/**
 * 发送验证码
 * @param params 验证码参数
 * @returns 发送结果
 */
export function sendSmsCode(params: { phone: string; type: string }) {
  return http.post('/user/sms/send', params)
}

/**
 * 修改密码
 * @param params 密码参数
 * @returns 修改结果
 */
export function changePassword(params: { oldPassword: string; newPassword: string }) {
  return http.put('/user/password', params)
}

/**
 * 忘记密码
 * @param params 重置密码参数
 * @returns 重置结果
 */
export function resetPassword(params: { phone: string; smsCode: string; newPassword: string }) {
  return http.post('/auth/password/reset', params)
}

/**
 * 微信登录
 * @param params 微信登录参数
 * @returns 登录结果
 */
export function wechatLogin(params: { code: string; userInfo?: any }) {
  return http.post('/auth/wechat/login', params)
}

/**
 * 微信登录：检查用户是否已注册
 */
export function wechatLoginCheck(params: { code: string }) {
  return http.post('/auth/wechat/check', params)
}

/**
 * 微信注册：支持 encryptedData/iv 或 手机号+验证码 两种方式
 */
export function wechatRegister(params: {
  openid: string
  unionid?: string
  encryptedData?: string
  iv?: string
  phone?: string
  smsCode?: string
  userInfo?: any
}) {
  return http.post('/auth/wechat/register', params)
}

/**
 * 获取用户统计数据
 * @returns 用户统计数据
 */
export function getUserStats() {
  return http.get('/user/stats')
}

/**
 * 获取用户资料
 * @returns 用户资料信息
 */
export function getUserProfile() {
  return http.get<UserProfile>('/user/profile')
}

/**
 * 更新用户资料
 * @param params 用户资料信息
 * @returns 更新结果
 */
export function updateUserProfile(params: Partial<UserProfile>) {
  return http.put<UserProfile>('/user/profile', params)
}

/**
 * 修改绑定手机号（专用接口）
 * @param params { phone: 新手机号, smsCode: 验证码 }
 */
export function changeUserPhone(params: { phone: string; smsCode: string }) {
  return http.put('/user/phone/change', params)
}

/**
 * 获取用户列表（用于报表筛选）
 * @param params 查询参数
 * @returns 用户列表
 */
export function getUserList(params?: {
  search?: string
  page?: number
  limit?: number
}) {
  return http.get('/customer/users/', { params })
}

/**
 * 获取分所列表（用于报表筛选）
 * @returns 分所列表
 */
export function getBranchList() {
  return http.get('/customer/branches/')
}

/**
 * 获取组织架构树（用于经办人选择）
 * 根据当前用户角色返回对应层级的组织架构
 * @returns 组织架构树
 */
export function getOrganizationTree() {
  return http.get('/customer/organization/tree/')
}

/**
 * 获取分所下的团队列表
 * @param branchId 分所ID
 * @returns 团队列表
 */
export function getTeamsByBranch(branchId: number | string) {
  return http.get(`/customer/organization/branches/${branchId}/teams/`)
}

/**
 * 获取团队下的用户列表（仅TEAM和SALES角色）
 * @param teamId 团队ID
 * @returns 用户列表
 */
export function getUsersByTeam(teamId: number | string) {
  return http.get(`/customer/organization/teams/${teamId}/users/`)
}

/**
 * 搜索用户（跨层级搜索，仅返回TEAM和SALES角色）
 * @param params 搜索参数
 * @returns 用户列表
 */
export function searchUsers(params: {
  keyword?: string
  branchId?: number | string
  teamId?: number | string
}) {
  return http.get('/customer/organization/users/search/', { params })
}

/**
 * 获取部门树形结构（基于 lsl_system_dept）
 * @param parentId 父部门ID，为空则返回根部门
 * @returns 部门列表
 */
export function getDeptTree(parentId?: number | string) {
  const params: any = {}
  if (parentId !== undefined && parentId !== null) {
    params.parent = parentId
  }
  return http.get('/customer/dept/tree/', { params })
}

/**
 * 获取指定部门下的用户列表
 * @param deptId 部门ID
 * @param includeChildren 是否包含子部门用户
 * @returns 用户列表
 */
export function getUsersByDept(deptId: number | string, includeChildren: boolean = false) {
  return http.get(`/customer/dept/${deptId}/users/`, {
    params: {
      include_children: includeChildren
    }
  })
}

/**
 * 搜索部门用户（跨部门搜索）
 * @param params 搜索参数
 * @returns 用户列表
 */
export function searchDeptUsers(params: {
  keyword: string
  deptId?: number | string
}) {
  return http.get('/customer/dept/users/search/', { params })
}
