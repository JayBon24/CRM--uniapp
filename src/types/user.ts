/**
 * 用户信息接口
 */
export interface IUser {
  /** 用户ID */
  userId: string
  /** 部门ID */
  deptId: string
  /** 用户账号 */
  userName: string
  /** 用户昵称 */
  nickName: string
  /** 用户类型 */
  userType?: string
  /** 用户邮箱 */
  email?: string
  /** 手机号码 */
  phonenumber?: string
  /** 用户性别 */
  sex?: string
  /** 头像地址 */
  avatar?: string
  /** 密码 */
  password?: string
  /** 帐号状态 */
  status: string
  /** 删除标志 */
  delFlag: string
  /** 最后登录IP */
  loginIp?: string
  /** 最后登录时间 */
  loginDate?: string
  /** 密码最后更新时间 */
  pwdUpdateDate?: string
  /** 创建者 */
  createBy?: string
  /** 创建时间 */
  createTime?: string
  /** 更新者 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
  /** 备注 */
  remark?: string
  /** 部门对象 */
  dept?: IDept
  /** 角色对象 */
  roles?: IRole[]
  /** 角色组 */
  roleIds?: number[]
  /** 岗位组 */
  postIds?: number[]
  /** 角色ID */
  roleId?: number
  /** 是否为管理员 */
  admin?: boolean
  /** 参数 */
  params?: any
  // 新增用户资料字段（用于投稿验证）
  pinYin?: string          // 姓名拼音
  birthDate?: string       // 出生年月
  address?: string         // 通讯地址
  workUnit?: string        // 工作单位
  jobPosition?: string     // 职业岗位
}

/**
 * 部门接口
 */
export interface IDept {
  deptId: string
  parentId: string
  deptName: string
  orderNum: number
  leader?: string
  status: string
}

/**
 * 角色接口
 */
export interface IRole {
  roleId: number
  roleName: string
  roleKey: string
  roleSort: number
  status: string
}

/**
 * 登录参数
 */
export interface LoginParams {
  username: string
  password: string
}

/**
 * 注册参数
 */
export interface RegisterParams {
  phone: string
  password: string
  username: string
  code?: string
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string
  refreshToken: string
  expiresIn: number
  userInfo: IUser
}

/**
 * 用户统计数据
 */
export interface UserStats {
  createdCount: number
  participatedCount: number
  artworkCount: number
  collectCount: number
  followerCount: number
  followingCount: number
  totalLikes: number
  totalViews: number
}

/**
 * 用户权限
 */
export interface UserPermissions {
  canCreateExhibition: boolean
  canManageExhibition: boolean
  canReviewArtwork: boolean
  canUploadArtwork: boolean
  canViewAllArtworks: boolean
  canManageUsers: boolean
}

/**
 * 用户等级文本映射
 */
export const UserLevelText: Record<string, string> = {
  normal: '普通用户',
  vip: 'VIP用户',
  expert: '专家用户',
  master: '大师用户',
  admin: '管理员'
}

/**
 * 验证码类型
 */
export type SmsCodeType = 'login' | 'register' | 'reset'

/**
 * 发送验证码参数
 */
export interface SendSmsParams {
  phone: string
  type: SmsCodeType
}

/**
 * 修改密码参数
 */
export interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
}

// 为了向后兼容，保留原有的UserInfo别名
export type UserInfo = IUser

/**
 * 重置密码参数
 */
export interface ResetPasswordParams {
  phone: string
  smsCode: string
  newPassword: string
}

/**
 * 微信登录参数
 */
export interface WechatLoginParams {
  code: string
  userInfo: {
    nickName: string
    avatarUrl: string
    gender: number
    country: string
    province: string
    city: string
    language: string
  }
}

/**
 * 更新用户信息参数
 */
export interface UpdateUserParams {
  nickname?: string
  avatar?: string
  email?: string
}

/**
 * 用户资料接口
 */
export interface UserProfile extends IUser {
  /** 资料是否完整 */
  profileComplete: boolean
  /** 最后登录时间 */
  lastLoginTime?: string
  /** 注册时间 */
  registerTime?: string
  /** 用户等级 */
  level: string
  /** 用户等级文本 */
  levelText: string
}

/**
 * 关注用户参数
 */
export interface FollowUserParams {
  userId: string
  action: 'follow' | 'unfollow'
}

// 导入通用接口
import type { PaginationParams, PaginationResponse } from './interfaces/common'
