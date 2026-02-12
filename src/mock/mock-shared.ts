import type { ClientListItem } from '@/types/interfaces/client'
import type { ClientVisit } from '@/types/interfaces/client-visit'
import type { ClientPlan } from '@/types/interfaces/client-plan'
import { getUserAvatarUrl } from './utils'

// 用户信息接口（与 user.ts 和 mine.ts 中的保持一致）
export interface UserInfo {
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
  [key: string]: any       // 允许其他字段
}

// 中文注释：共享的 Mock 用户数据，供 user.ts 和 mine.ts 统一使用，确保数据源一致
// 与 user.ts 中的 mockUsers 完全一致，方便后续在小程序后台统一管理
export const mockUsers: UserInfo[] = [
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
  // 5. SALES - 销售（额外测试账号）
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

// 中文注释：把 mock 的客户数据共享出来，供审批效果写回（TEAM→BRANCH→HQ 最终通过后更新客户状态/经办人）
export const mockClientsDb: ClientListItem[] = []

// 拜访足迹 Mock 数据库
export const mockVisitsDb: ClientVisit[] = [
  {
    id: 1,
    client_id: 2,
    visit_time: '2024-12-20 14:00:00',
    duration: 90,
    value_info: '详细了解客户业务背景，确认案件关键证据',
    location_status: 'success',
    address: '北京市朝阳区建外SOHO',
    lng: 116.457,
    lat: 39.909,
    system_users: [1],
    system_users_info: [{ id: 1, name: '张三' }],
    client_contacts: [1],
    client_contacts_info: [{ id: 1, name: '李总' }],
    create_time: '2024-12-20 15:00:00'
  },
  {
    id: 2,
    client_id: 2,
    visit_time: '2024-12-15 10:30:00',
    duration: 60,
    value_info: '初步沟通，建立信任关系',
    location_status: 'fail',
    address: '',
    lng: null,
    lat: null,
    system_users: [1],
    system_users_info: [{ id: 1, name: '张三' }],
    client_contacts: [],
    create_time: '2024-12-15 11:30:00'
  }
]

// 跟进计划 Mock 数据库
export const mockPlansDb: ClientPlan[] = [
  {
    id: 1,
    client_id: 2,
    title: '电话回访，确认合同签署时间',
    time_points: ['2024-12-26 14:00:00'],
    is_completed: false,
    reminder_enabled: true,
    reminder_minutes: 30,
    remind_method: 'system',
    remind_advance: 30,
    create_time: '2024-12-24 10:00:00'
  },
  {
    id: 2,
    client_id: 2,
    title: '准备案件材料，整理证据清单',
    time_points: ['2024-12-28 10:00:00'],
    is_completed: false,
    reminder_enabled: true,
    reminder_minutes: 60,
    remind_method: 'system',
    remind_advance: 60,
    create_time: '2024-12-24 10:00:00'
  }
]


