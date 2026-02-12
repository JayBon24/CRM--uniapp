/**
 * 客户管理 Mock 数据
 */

import type { MockHandler } from './utils'
import type {
  ClientListItem,
  ClientDetail,
  ClientListParams,
  ClientListResponse,
  ClientStatus,
  SalesStage,
  ClientGrade,
  RecycleRiskLevel
} from '@/types/interfaces/client'
import { approvalStore, buildApprovalChain, hasPendingApproval } from './approval-store'
import { mockClientsDb, mockVisitsDb, mockPlansDb } from './mock-shared'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'

function computeSalesStage(c: any): SalesStage {
  // 公海：等同 status
  if (c.status === 'PUBLIC_POOL') return 'PUBLIC_POOL'
  // 跟进：只要没有有效拜访，就算空白；有有效拜访则面谈
  if (c.status === 'FOLLOW_UP') return (Number(c.valid_visit_count || 0) > 0 ? 'MEETING' : 'BLANK')
  // 其他状态：等同 status
  return c.status as SalesStage
}

// 模拟客户数据
const mockClients: ClientListItem[] = [
  {
    id: 1,
    status: 'PUBLIC_POOL',
    sales_stage: 'PUBLIC_POOL',
    client_name: '北京建工集团有限公司',
    contact_name: '张经理',
    mobile: '13800138001',
    region: '北京市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['litigation'],
    preservation_status: 'preserved',
    owner_user_id: 0,
    owner_user_name: '未分配',
    followup_count: 0,
    visit_count: 0,
    valid_visit_count: 0,
    recycle_risk_level: 'none',
    create_time: '2024-01-15 10:30:00',
    update_time: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    status: 'FOLLOW_UP',
    sales_stage: 'BLANK', // FOLLOW_UP 且 valid_visit_count=0，所以是 BLANK（空白）
    client_name: '上海城建集团',
    contact_name: '李总',
    mobile: '13900139002',
    region: '上海市',
    grade: 'B',
    grade_source: 'ai',
    collection_category: ['arbitration', 'mediation'],
    owner_user_id: 1001,
    owner_user_name: '系统管理员',
    followup_count: 2,
    visit_count: 1, // 已有一次拜访记录
    valid_visit_count: 0, // 但不是有效拜访（定位失败或无坐标）
    last_followup_at: '2024-01-20 14:30:00',
    last_visit_at: '2024-01-21 10:00:00',
    next_plan_at: '2024-01-25 10:00:00',
    recycle_risk_level: 'low',
    recycle_deadline: '2024-02-20 00:00:00',
    create_time: '2024-01-10 09:00:00',
    update_time: '2024-01-20 14:30:00'
  },
  {
    id: 3,
    status: 'FOLLOW_UP',
    sales_stage: 'MEETING', // FOLLOW_UP 且 valid_visit_count=2 > 0，所以是 MEETING（面谈）
    client_name: '深圳建筑工程公司',
    contact_name: '陈主任',
    mobile: '13700137003',
    region: '广东省深圳市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['litigation'],
    preservation_status: 'preserved',
    court: '深圳市中级人民法院',
    owner_user_id: 1001,
    owner_user_name: '系统管理员',
    team_name: '华南团队',
    branch_name: '深圳分所',
    followup_count: 5,
    visit_count: 3,
    valid_visit_count: 2, // 有有效拜访，所以是 MEETING
    last_followup_at: '2024-01-22 16:00:00',
    last_visit_at: '2024-01-22 16:00:00',
    next_plan_at: '2024-01-28 14:00:00',
    recycle_risk_level: 'none',
    create_time: '2024-01-05 11:00:00',
    update_time: '2024-01-22 16:00:00'
  },
  {
    id: 4,
    status: 'CASE',
    sales_stage: 'CASE',
    client_name: '广州市政建设集团',
    contact_name: '刘经理',
    mobile: '13600136004',
    region: '广东省广州市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['arbitration'],
    owner_user_id: 1004, // 修改为测试账号 user_id (sales_rep)
    owner_user_name: '销售-赵销售',
    team_name: '华南团队',
    branch_name: '广州分所',
    followup_count: 8,
    visit_count: 5,
    valid_visit_count: 4,
    last_followup_at: '2024-01-18 10:30:00',
    last_visit_at: '2024-01-18 10:30:00',
    recycle_risk_level: 'none',
    create_time: '2023-12-20 15:00:00',
    update_time: '2024-01-18 10:30:00'
  },
  {
    id: 5,
    status: 'PAYMENT',
    sales_stage: 'PAYMENT',
    client_name: '杭州建设发展有限公司',
    contact_name: '周总',
    mobile: '13500135005',
    region: '浙江省杭州市',
    grade: 'B',
    grade_source: 'manual',
    collection_category: ['mediation'],
    owner_user_id: 1005, // 修改为测试账号 user_id (sales_rep2)
    owner_user_name: '销售-孙销售',
    team_name: '华东团队',
    branch_name: '杭州分所',
    followup_count: 10,
    visit_count: 6,
    valid_visit_count: 5,
    last_followup_at: '2024-01-19 09:00:00',
    last_visit_at: '2024-01-15 14:00:00',
    recycle_risk_level: 'none',
    create_time: '2023-11-15 10:00:00',
    update_time: '2024-01-19 09:00:00'
  },
  {
    id: 6,
    status: 'WON',
    sales_stage: 'WON',
    client_name: '成都建筑工程集团',
    contact_name: '吴总监',
    mobile: '13400134006',
    region: '四川省成都市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['litigation'],
    preservation_status: 'preserved',
    owner_user_id: 1004, // 修改为测试账号 user_id (sales_rep)
    owner_user_name: '销售-赵销售',
    team_name: '西南团队',
    branch_name: '成都分所',
    followup_count: 15,
    visit_count: 10,
    valid_visit_count: 9,
    last_followup_at: '2024-01-10 11:00:00',
    last_visit_at: '2024-01-08 15:30:00',
    recycle_risk_level: 'low',
    recycle_deadline: '2024-07-10 00:00:00',
    create_time: '2023-10-01 09:00:00',
    update_time: '2024-01-10 11:00:00'
  },
  {
    id: 7,
    status: 'FOLLOW_UP',
    sales_stage: 'BLANK',
    client_name: '武汉城市建设集团',
    contact_name: '郑经理',
    mobile: '13300133007',
    region: '湖北省武汉市',
    grade: 'C',
    grade_source: 'ai',
    owner_user_id: 1001,
    owner_user_name: '系统管理员',
    followup_count: 1,
    visit_count: 0,
    valid_visit_count: 0,
    last_followup_at: '2024-01-21 16:00:00',
    next_plan_at: '2024-01-26 10:00:00',
    recycle_risk_level: 'medium',
    recycle_deadline: '2024-02-21 00:00:00',
    create_time: '2024-01-12 14:00:00',
    update_time: '2024-01-21 16:00:00'
  },
  {
    id: 8,
    status: 'PUBLIC_POOL',
    sales_stage: 'PUBLIC_POOL',
    client_name: '重庆市政工程公司',
    contact_name: '冯主任',
    mobile: '13200132008',
    region: '重庆市',
    grade: 'B',
    grade_source: 'ai',
    collection_category: ['arbitration'],
    owner_user_id: 0,
    owner_user_name: '未分配',
    followup_count: 0,
    visit_count: 0,
    valid_visit_count: 0,
    recycle_risk_level: 'none',
    create_time: '2024-01-18 11:00:00',
    update_time: '2024-01-18 11:00:00'
  },
  // 新增：跟进中-空白状态客户
  {
    id: 9,
    status: 'FOLLOW_UP',
    sales_stage: 'BLANK',
    client_name: '南京建设工程有限公司',
    contact_name: '王总监',
    mobile: '13100131009',
    region: '江苏省南京市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['litigation', 'arbitration'],
    owner_user_id: 1001,
    owner_user_name: '系统管理员',
    followup_count: 3,
    visit_count: 1,
    valid_visit_count: 0,
    last_followup_at: '2024-01-23 10:00:00',
    next_plan_at: '2024-01-30 14:00:00',
    recycle_risk_level: 'low',
    recycle_deadline: '2024-02-23 00:00:00',
    create_time: '2024-01-08 09:00:00',
    update_time: '2024-01-23 10:00:00'
  },
  // 新增：跟进中-面谈状态客户
  {
    id: 10,
    status: 'FOLLOW_UP',
    sales_stage: 'MEETING',
    client_name: '天津港务建设集团',
    contact_name: '赵经理',
    mobile: '13000130010',
    region: '天津市',
    grade: 'A',
    grade_source: 'ai',
    collection_category: ['mediation'],
    preservation_status: 'preserved',
    court: '天津市第一中级人民法院',
    owner_user_id: 1001,
    owner_user_name: '系统管理员',
    team_name: '华北团队',
    branch_name: '天津分所',
    followup_count: 6,
    visit_count: 4,
    valid_visit_count: 3,
    last_followup_at: '2024-01-24 15:00:00',
    last_visit_at: '2024-01-24 15:00:00',
    next_plan_at: '2024-01-29 10:00:00',
    recycle_risk_level: 'none',
    create_time: '2024-01-02 14:00:00',
    update_time: '2024-01-24 15:00:00'
  },
  // 补充：公海状态客户（用于测试公海分配）
  {
    id: 11,
    status: 'PUBLIC_POOL',
    sales_stage: 'PUBLIC_POOL',
    client_name: '苏州工业园区建设集团',
    contact_name: '钱总',
    mobile: '12900129011',
    region: '江苏省苏州市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['litigation'],
    owner_user_id: 0,
    owner_user_name: '未分配',
    followup_count: 0,
    visit_count: 0,
    valid_visit_count: 0,
    recycle_risk_level: 'none',
    create_time: '2024-01-20 09:00:00',
    update_time: '2024-01-20 09:00:00'
  },
  {
    id: 12,
    status: 'PUBLIC_POOL',
    sales_stage: 'PUBLIC_POOL',
    client_name: '宁波港务集团',
    contact_name: '孙经理',
    mobile: '12800128012',
    region: '浙江省宁波市',
    grade: 'B',
    grade_source: 'ai',
    collection_category: ['arbitration'],
    owner_user_id: 0,
    owner_user_name: '未分配',
    followup_count: 0,
    visit_count: 0,
    valid_visit_count: 0,
    recycle_risk_level: 'none',
    create_time: '2024-01-22 10:00:00',
    update_time: '2024-01-22 10:00:00'
  },
  // 补充：交案状态客户（owner_user_id分布：1, 2, 3）
  {
    id: 13,
    status: 'CASE',
    sales_stage: 'CASE',
    client_name: '长沙中联重科股份有限公司',
    contact_name: '周总监',
    mobile: '12700127013',
    region: '湖南省长沙市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['litigation'],
    preservation_status: 'preserved',
    court: '长沙市中级人民法院',
    owner_user_id: 1003, // 修改为测试账号 user_id (team_leader)
    owner_user_name: '团队管理-王组长',
    team_name: '华中团队',
    branch_name: '长沙分所',
    followup_count: 12,
    visit_count: 8,
    valid_visit_count: 7,
    last_followup_at: '2024-01-19 14:00:00',
    last_visit_at: '2024-01-19 14:00:00',
    recycle_risk_level: 'none',
    create_time: '2023-11-10 09:00:00',
    update_time: '2024-01-19 14:00:00'
  },
  {
    id: 14,
    status: 'CASE',
    sales_stage: 'CASE',
    client_name: '郑州宇通客车股份有限公司',
    contact_name: '吴总',
    mobile: '12600126014',
    region: '河南省郑州市',
    grade: 'B',
    grade_source: 'ai',
    collection_category: ['arbitration', 'mediation'],
    owner_user_id: 1004, // 修改为测试账号 user_id (sales_rep)
    owner_user_name: '销售-赵销售',
    team_name: '华中团队',
    branch_name: '郑州分所',
    followup_count: 9,
    visit_count: 6,
    valid_visit_count: 5,
    last_followup_at: '2024-01-17 11:00:00',
    last_visit_at: '2024-01-17 11:00:00',
    recycle_risk_level: 'none',
    create_time: '2023-12-05 10:00:00',
    update_time: '2024-01-17 11:00:00'
  },
  {
    id: 15,
    status: 'CASE',
    sales_stage: 'CASE',
    client_name: '济南重工集团',
    contact_name: '郑经理',
    mobile: '12500125015',
    region: '山东省济南市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['litigation'],
    owner_user_id: 1005, // 修改为测试账号 user_id (sales_rep2)
    owner_user_name: '销售-孙销售',
    team_name: '华北团队',
    branch_name: '济南分所',
    followup_count: 11,
    visit_count: 7,
    valid_visit_count: 6,
    last_followup_at: '2024-01-16 15:00:00',
    last_visit_at: '2024-01-16 15:00:00',
    recycle_risk_level: 'none',
    create_time: '2023-11-20 14:00:00',
    update_time: '2024-01-16 15:00:00'
  },
  // 补充：回款状态客户（owner_user_id分布：1, 2, 3）
  {
    id: 16,
    status: 'PAYMENT',
    sales_stage: 'PAYMENT',
    client_name: '福州建工集团',
    contact_name: '冯总',
    mobile: '12400124016',
    region: '福建省福州市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['mediation'],
    owner_user_id: 1003, // 修改为测试账号 user_id (team_leader)
    owner_user_name: '团队管理-王组长',
    team_name: '华南团队',
    branch_name: '福州分所',
    followup_count: 14,
    visit_count: 9,
    valid_visit_count: 8,
    last_followup_at: '2024-01-20 10:00:00',
    last_visit_at: '2024-01-18 16:00:00',
    recycle_risk_level: 'none',
    create_time: '2023-10-15 09:00:00',
    update_time: '2024-01-20 10:00:00'
  },
  {
    id: 17,
    status: 'PAYMENT',
    sales_stage: 'PAYMENT',
    client_name: '厦门建发集团',
    contact_name: '陈总监',
    mobile: '12300123017',
    region: '福建省厦门市',
    grade: 'B',
    grade_source: 'ai',
    collection_category: ['arbitration'],
    owner_user_id: 1004, // 修改为测试账号 user_id (sales_rep)
    owner_user_name: '销售-赵销售',
    team_name: '华南团队',
    branch_name: '厦门分所',
    followup_count: 13,
    visit_count: 8,
    valid_visit_count: 7,
    last_followup_at: '2024-01-21 09:00:00',
    last_visit_at: '2024-01-19 14:00:00',
    recycle_risk_level: 'none',
    create_time: '2023-10-20 10:00:00',
    update_time: '2024-01-21 09:00:00'
  },
  {
    id: 18,
    status: 'PAYMENT',
    sales_stage: 'PAYMENT',
    client_name: '石家庄钢铁集团',
    contact_name: '褚经理',
    mobile: '12200122018',
    region: '河北省石家庄市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['litigation', 'arbitration'],
    owner_user_id: 1005, // 修改为测试账号 user_id (sales_rep2)
    owner_user_name: '销售-孙销售',
    team_name: '华北团队',
    branch_name: '石家庄分所',
    followup_count: 15,
    visit_count: 10,
    valid_visit_count: 9,
    last_followup_at: '2024-01-22 11:00:00',
    last_visit_at: '2024-01-20 15:00:00',
    recycle_risk_level: 'none',
    create_time: '2023-09-25 11:00:00',
    update_time: '2024-01-22 11:00:00'
  },
  // 补充：赢单状态客户（owner_user_id分布：1, 2, 3）
  {
    id: 19,
    status: 'WON',
    sales_stage: 'WON',
    client_name: '昆明建工集团',
    contact_name: '卫总',
    mobile: '12100121019',
    region: '云南省昆明市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['litigation'],
    preservation_status: 'preserved',
    owner_user_id: 1003, // 修改为测试账号 user_id (team_leader)
    owner_user_name: '团队管理-王组长',
    team_name: '西南团队',
    branch_name: '昆明分所',
    followup_count: 18,
    visit_count: 12,
    valid_visit_count: 11,
    last_followup_at: '2024-01-11 10:00:00',
    last_visit_at: '2024-01-09 16:00:00',
    recycle_risk_level: 'low',
    recycle_deadline: '2024-07-11 00:00:00',
    create_time: '2023-08-15 09:00:00',
    update_time: '2024-01-11 10:00:00'
  },
  {
    id: 20,
    status: 'WON',
    sales_stage: 'WON',
    client_name: '贵阳建工集团',
    contact_name: '蒋总监',
    mobile: '12000120020',
    region: '贵州省贵阳市',
    grade: 'B',
    grade_source: 'ai',
    collection_category: ['mediation'],
    owner_user_id: 1004, // 修改为测试账号 user_id (sales_rep)
    owner_user_name: '销售-赵销售',
    team_name: '西南团队',
    branch_name: '贵阳分所',
    followup_count: 16,
    visit_count: 11,
    valid_visit_count: 10,
    last_followup_at: '2024-01-12 14:00:00',
    last_visit_at: '2024-01-10 10:00:00',
    recycle_risk_level: 'none',
    create_time: '2023-08-20 10:00:00',
    update_time: '2024-01-12 14:00:00'
  },
  {
    id: 21,
    status: 'WON',
    sales_stage: 'WON',
    client_name: '南宁建工集团',
    contact_name: '沈经理',
    mobile: '11900119021',
    region: '广西壮族自治区南宁市',
    grade: 'A',
    grade_source: 'manual',
    collection_category: ['arbitration'],
    preservation_status: 'preserved',
    owner_user_id: 1005, // 修改为测试账号 user_id (sales_rep2)
    owner_user_name: '销售-孙销售',
    team_name: '华南团队',
    branch_name: '南宁分所',
    followup_count: 17,
    visit_count: 12,
    valid_visit_count: 11,
    last_followup_at: '2024-01-13 15:00:00',
    last_visit_at: '2024-01-11 11:00:00',
    recycle_risk_level: 'low',
    recycle_deadline: '2024-07-13 00:00:00',
    create_time: '2023-08-25 11:00:00',
    update_time: '2024-01-13 15:00:00'
  }
]

// 共享给审批效果写回
// 每次模块重新加载时，同步 mockClients 到 mockClientsDb（解决热更新时数据不一致问题）
mockClientsDb.length = 0  // 清空旧数据
mockClientsDb.push(...(mockClients as any))  // 重新填充新数据

// Mock 处理器
const clientMock: MockHandler[] = [
  {
    url: '/crm/client/list',
    method: 'GET',
    response: (params: ClientListParams) => {
      console.log('Mock: 客户列表请求', params)

      let filteredClients = [...mockClients].map(c => ({
        ...c,
        sales_stage: computeSalesStage(c),
      }))

      // 筛选：status
      if (params.status) {
        filteredClients = filteredClients.filter(c => c.status === params.status)
      }

      // 筛选：sales_stage
      if (params.sales_stage) {
        filteredClients = filteredClients.filter(c => c.sales_stage === params.sales_stage)
      }

      // 筛选：grade
      if (params.grade) {
        filteredClients = filteredClients.filter(c => c.grade === params.grade)
      }

      // 筛选：collection_category（支持数组或多选）
      if (params.collection_category) {
        const categories = Array.isArray(params.collection_category) 
          ? params.collection_category 
          : [params.collection_category]
        if (categories.length > 0) {
          filteredClients = filteredClients.filter(c => {
            if (!c.collection_category || c.collection_category.length === 0) return false
            return categories.some(cat => c.collection_category?.includes(cat))
          })
        }
      }

      // 筛选：collection_category（已在上面处理，这里删除重复代码）

      // 筛选：owner_user_id
      // SALES/TEAM 角色：能看到自己的客户（owner_user_id = 自己）和公海客户（owner_user_id = 0）
      // 管理角色（HQ/BRANCH）：不应用此筛选，能看到所有客户
      if (params.owner_user_id) {
        const ownerUserId = Number(params.owner_user_id)
        filteredClients = filteredClients.filter(
          c => c.owner_user_id == ownerUserId || c.owner_user_id == 0  // 自己的客户或公海客户
        )
      }

      // 筛选：recycle_risk_level
      if (params.recycle_risk_level) {
        filteredClients = filteredClients.filter(
          c => c.recycle_risk_level === params.recycle_risk_level
        )
      }

      // 搜索：keyword
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredClients = filteredClients.filter(
          c =>
            c.client_name.toLowerCase().includes(keyword) ||
            c.contact_name?.toLowerCase().includes(keyword) ||
            c.mobile?.includes(keyword)
        )
      }

      // 排序
      if (params.order_by) {
        filteredClients.sort((a, b) => {
          let aValue: any
          let bValue: any

          switch (params.order_by) {
            case 'last_followup':
              aValue = a.last_followup_at || ''
              bValue = b.last_followup_at || ''
              break
            case 'last_visit':
              aValue = a.last_visit_at || ''
              bValue = b.last_visit_at || ''
              break
            case 'create_time':
            default:
              aValue = a.create_time || ''
              bValue = b.create_time || ''
              break
          }

          if (params.order_direction === 'asc') {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        })
      }

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = filteredClients.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const rows = filteredClients.slice(start, end)

      const response: ClientListResponse = {
        rows,
        total,
        page,
        pageSize
      }

      console.log('Mock: 客户列表响应', response)

      return Promise.resolve({
        code: 200,
        data: response,
        msg: 'success'
      })
    }
  },
  {
    url: '/crm/client/:id',
    method: 'GET',
    response: (params: any) => {
      console.log('Mock: 客户详情请求', params)

      const id = parseInt(params.id)
      const client = mockClients.find(c => c.id === id)

      if (!client) {
        return Promise.resolve({
          code: 404,
          msg: '客户不存在'
        })
      }

      // 构造详情数据（比列表更完整）
      const detail: ClientDetail = {
        ...client,
        sales_stage: computeSalesStage(client),
        source_channel: '朋友介绍',
        referrer: (client as any).referrer || '',
        // 需求摘要：如果没有明确整理出来就先留空，避免污染编辑表单
        demand_summary: (client as any).demand_summary || '',
        ai_tags: {
          grade: {
            value: client.grade || 'B',
            source: client.grade_source || 'ai',
            updated_at: '2024-01-20 10:00:00'
          },
          collection_category: {
            value: client.collection_category || [],
            primary: client.collection_category?.[0],
            source: 'ai',
            updated_at: '2024-01-20 10:00:00'
          },
          preservation_status: client.preservation_status
            ? {
                value: client.preservation_status,
                progress: '已申请，等待法院审批',
                updated_at: '2024-01-18 14:00:00'
              }
            : undefined,
          court: client.court
            ? {
                value: client.court,
                candidates: [client.court, '高级人民法院'],
                updated_at: '2024-01-15 09:00:00'
              }
            : undefined
        }
      }

      return Promise.resolve({
        code: 200,
        data: detail,
        msg: 'success'
      })
    }
  },
  {
    url: '/crm/client',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 创建客户', params)
      const userStore = useUserStore()
      const isManager = userStore.isManager
      
      // 管理角色：直接创建线索进公海，不需要审批
      if (isManager) {
        // 直接创建客户到公海
        const newClient: any = {
          id: Date.now(),
          client_name: params.client_name || '新客户',
          short_name: params.short_name || '',
          contact_name: params.contact_name || '',
          mobile: params.phone || params.mobile || '',
          province: params.province || '',
          city: params.city || '',
          district: params.district || '',
          source_channel: params.source_channel || '未知',
          referrer: params.referrer_name || params.referrer || '',
          demand_summary: params.requirement_summary || params.demand_summary || '',
          status: 'PUBLIC_POOL',
          sales_stage: 'PUBLIC_POOL',
          owner_user_id: params.owner_user_id || 0, // 管理创建时，如果指定了经办人则分配，否则进公海
          owner_user_name: params.owner_user_name || '',
          grade: params.grade || 'C',
          grade_source: 'manual',
          followup_count: 0,
          visit_count: 0,
          valid_visit_count: 0,
          create_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
          update_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
        
        // 如果指定了经办人，则直接分配（状态转为跟进）
        if (newClient.owner_user_id && newClient.owner_user_id !== 0) {
          newClient.status = 'FOLLOW_UP'
          newClient.sales_stage = 'BLANK'
        }
        
        mockClients.push(newClient)
        // 同步到共享数据库
        mockClientsDb.push(newClient as any)
        
        return Promise.resolve({
          code: 200,
          data: { id: newClient.id },
          msg: '创建成功'
        })
      }
      
      // 销售角色：需要审批，创建审批任务
      const chain = buildApprovalChain(userStore.roleLevel)
      const taskId = `appr_create_${Date.now()}`
      const nowStr = () => new Date().toISOString().slice(0, 19).replace('T', ' ')
      
      // 创建新增线索审批任务
      approvalStore.unshift({
        id: taskId,
        type: 'LEAD_CREATE',
        status: 'pending',
        applicant_user_id: String(userStore.id || '1'),
        applicant_user_name: String(userStore.nickName || userStore.name || '申请人'),
        client_id: undefined, // 新增线索还没有客户ID
        client_name: params.client_name || '新线索',
        created_at: nowStr(),
        payload: {
          form: params as any
        },
        approval_chain: chain,
        current_step_index: 0,
        current_approver_role: chain[0],
        history: []
      } as any)
      
      return Promise.resolve({
        code: 200,
        data: { apply_id: taskId },
        msg: '已提交新增线索审批（审批通过后将进入公海池）'
      })
    }
  },
  {
    // 更新客户信息（用于基础信息编辑）
    url: '/crm/client/:id',
    method: 'PUT',
    response: (params: any) => {
      console.log('Mock: 更新客户', params)
      const id = parseInt(params.id)
      const idx = mockClients.findIndex(c => c.id === id)
      if (idx === -1) {
        return Promise.resolve({ code: 404, msg: '客户不存在' })
      }

      // 兼容前端表单字段命名：phone -> mobile；requirement_summary -> demand_summary；referrer_name -> referrer
      const next = {
        ...(mockClients[idx] as any),
        client_name: params.client_name ?? (mockClients[idx] as any).client_name,
        short_name: params.short_name ?? (mockClients[idx] as any).short_name,
        contact_name: params.contact_name ?? (mockClients[idx] as any).contact_name,
        mobile: params.mobile ?? params.phone ?? (mockClients[idx] as any).mobile,
        region: params.region ?? (mockClients[idx] as any).region,
        source_channel: params.source_channel ?? (mockClients[idx] as any).source_channel,
        referrer: params.referrer ?? params.referrer_name ?? (mockClients[idx] as any).referrer,
        demand_summary: params.demand_summary ?? params.requirement_summary ?? (mockClients[idx] as any).demand_summary,
        update_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      ;(next as any).sales_stage = computeSalesStage(next)
      ;(mockClients as any)[idx] = next

      return Promise.resolve({
        code: 200,
        data: next,
        msg: '更新成功'
      })
    }
  },
  {
    // 获取拜访记录列表
    url: '/crm/client/:client_id/visit',
    method: 'GET',
    response: (params: any) => {
      const clientId = params.client_id
      const rows = mockVisitsDb.filter(v => !clientId || String(v.client_id) === String(clientId))
      return Promise.resolve({
        code: 200,
        data: {
          rows: rows.sort((a, b) => dayjs(b.visit_time).unix() - dayjs(a.visit_time).unix()),
          total: rows.length
        },
        msg: 'success'
      })
    }
  },
  {
    // 获取跟进计划列表
    url: '/crm/client/:client_id/plan',
    method: 'GET',
    response: (params: any) => {
      const clientId = params.client_id
      const rows = mockPlansDb.filter(p => !clientId || String(p.client_id) === String(clientId))
      return Promise.resolve({
        code: 200,
        data: {
          rows: rows.sort((a, b) => dayjs(a.plan_time).unix() - dayjs(b.plan_time).unix()),
          total: rows.length
        },
        msg: 'success'
      })
    }
  },
  {
    // 创建拜访记录：会影响 valid_visit_count -> sales_stage（BLANK->MEETING）
    url: '/crm/client/visit',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 创建拜访记录', params)
      const clientId = parseInt(params.client_id)
      const idx = mockClients.findIndex(c => c.id === clientId)
      if (idx === -1) return Promise.resolve({ code: 404, msg: '客户不存在' })

      const isValidVisit =
        params.location_status === 'success' ||
        (params.lng !== undefined && params.lng !== null && params.lat !== undefined && params.lat !== null)

      const curr: any = mockClients[idx]
      curr.visit_count = Number(curr.visit_count || 0) + 1
      if (isValidVisit) curr.valid_visit_count = Number(curr.valid_visit_count || 0) + 1
      curr.last_visit_at = params.visit_time || new Date().toISOString().slice(0, 19).replace('T', ' ')

      // FOLLOW_UP：有有效拜访则自动面谈
      curr.sales_stage = computeSalesStage(curr)
      curr.update_time = new Date().toISOString().slice(0, 19).replace('T', ' ')

      // 存入数据库
      const newVisit: any = {
        id: Date.now(),
        client_id: clientId,
        visit_time: params.visit_time,
        duration: params.duration,
        value_info: params.value_info,
        location_status: params.location_status || 'fail',
        lng: params.lng,
        lat: params.lat,
        address: params.address || '',
        system_users: params.system_users || [],
        system_users_info: params.system_users?.map((id: number) => ({ id, name: '职员' + id })) || [],
        client_contacts: params.client_contacts || [],
        client_contacts_info: params.client_contacts?.map((c: any) => (typeof c === 'object' ? c : { id: c, name: '联系人' + c })) || [],
        attachments: params.attachments || [],
        create_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      mockVisitsDb.unshift(newVisit)

      return Promise.resolve({
        code: 200,
        data: newVisit,
        msg: '创建成功'
      })
    }
  },
  {
    // 创建跟进计划
    url: '/crm/client/plan',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 创建跟进计划', params)
      const newPlan: any = {
        id: Date.now(),
        client_id: params.client_id,
        title: params.title,
        time_points: params.time_points || [],
        remind_method: params.remind_method || 'system',
        remind_advance: params.remind_advance || 30,
        is_completed: false,
        reminder_enabled: true,
        reminder_minutes: params.remind_advance || 30,
        create_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      mockPlansDb.unshift(newPlan)
      return Promise.resolve({
        code: 200,
        data: newPlan,
        msg: '创建成功'
      })
    }
  },
  {
    url: '/crm/client/:id/apply',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 申领客户', params)
      const userStore = useUserStore()
      const clientId = String(params.id || params.client_id || '')

      // 防重复：同一客户同类型只允许一个 pending
      if (hasPendingApproval('LEAD_CLAIM', clientId)) {
        return Promise.resolve({ code: 400, msg: '该线索已存在待审批申领，请勿重复提交' })
      }

      const client = mockClients.find(c => String(c.id) === clientId)
      if (!client) return Promise.resolve({ code: 404, msg: '客户不存在' })

      const chain = buildApprovalChain(userStore.roleLevel)
      const taskId = `appr_${Date.now()}`
      approvalStore.unshift({
        id: taskId,
        type: 'LEAD_CLAIM',
        status: 'pending',
        applicant_user_id: String(userStore.id || '1'),
        applicant_user_name: String(userStore.nickName || userStore.name || '申请人'),
        client_id: String(client.id),
        client_name: (client as any).client_name,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        payload: { client_id: String(client.id), name: (client as any).client_name, reason: String(params.reason || '申领跟进') },
        approval_chain: chain,
        current_step_index: 0,
        current_approver_role: chain[0],
        history: []
      } as any)

      return Promise.resolve({
        code: 200,
        data: { apply_id: taskId },
        msg: '已提交申领审批（将按 TEAM→BRANCH→HQ 逐级审批）'
      })
    }
  },
  {
    url: '/crm/client/:id/assign',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 分配客户', params)
      const userStore = useUserStore()
      const id = parseInt(params.id)
      const targetUserId = parseInt(params.user_id)
      const client = mockClients.find(c => c.id === id)
      
      if (!client) return Promise.resolve({ code: 404, msg: '客户不存在' })
      
      // 后端校验：检查分配目标用户的角色，如果是HQ/BRANCH则拒绝
      const targetUserRoleLevel = params.target_user_role_level
      if (targetUserRoleLevel === 'HQ' || targetUserRoleLevel === 'BRANCH') {
        return Promise.resolve({ 
          code: 403, 
          msg: '不能分配给管理角色（HQ/BRANCH），只能分配给销售人员（TEAM/SALES）' 
        })
      }
      
      // 创建审批任务记录（直接通过，用于追溯）
      const nowStr = () => new Date().toISOString().slice(0, 19).replace('T', ' ')
      const taskId = `appr_assign_${Date.now()}`
      const assignerRole = userStore.roleLevel || 'HQ'
      const chain = buildApprovalChain(assignerRole)
      
      // 使用 CLIENT_TRANSFER 类型记录分配操作（分配可以视为从"无"转交给目标用户）
      approvalStore.unshift({
        id: taskId,
        type: 'CLIENT_TRANSFER',
        status: 'approved', // 管理分配直接通过
        applicant_user_id: String(userStore.id || '1'),
        applicant_user_name: String(userStore.nickName || userStore.name || '分配人'),
        client_id: String(client.id),
        client_name: (client as any).client_name || '客户',
        created_at: nowStr(),
        approved_at: nowStr(), // 立即通过
        approval_chain: chain,
        current_step_index: chain.length - 1, // 已到最后一步
        current_approver_role: chain[chain.length - 1] || assignerRole,
        history: [{
          step_role: assignerRole,
          approver_user_id: String(userStore.id || '1'),
          approver_user_name: String(userStore.nickName || userStore.name || '分配人'),
          decision: 'approved',
          decided_at: nowStr()
        }],
        payload: {
          client_id: String(client.id),
          from_user: { id: String(client.owner_user_id || '0'), name: client.owner_user_name || '公海' }, // 原经办人或公海
          to_user: { id: String(targetUserId), name: params.user_name || '新经办人' },
          reason: '管理分配'
        }
      } as any)
      
      // 模拟更新经办人
      client.owner_user_id = targetUserId
      client.owner_user_name = params.user_name || '新经办人'
      
      // 如果是公海客户被分配，转为跟进中
      if (client.status === 'PUBLIC_POOL') {
        client.status = 'FOLLOW_UP'
        client.sales_stage = 'BLANK'
      }

      return Promise.resolve({
        code: 200,
        data: client,
        msg: '分配成功'
      })
    }
  },
  {
    // 申请客户转交
    url: '/crm/client/handover',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 申请客户转交', params)
      const userStore = useUserStore()
      const clientId = String(params.client_id || '')
      // 兼容两种参数名：to_owner_id（API定义）和 target_user_id（前端可能使用）
      const targetUserId = String(params.to_owner_id || params.target_user_id || '')
      
      if (!clientId || !targetUserId) {
        return Promise.resolve({ code: 400, msg: '客户ID和目标用户ID不能为空' })
      }
      
      // 防重复：同一客户同类型只允许一个 pending
      if (hasPendingApproval('CLIENT_TRANSFER', clientId)) {
        return Promise.resolve({ code: 400, msg: '该客户已存在待审批转交申请，请勿重复提交' })
      }
      
      const client = mockClients.find(c => String(c.id) === clientId)
      if (!client) return Promise.resolve({ code: 404, msg: '客户不存在' })
      
      // 检查当前用户是否为该客户的经办人（只有经办人可以申请转交）
      if (String(client.owner_user_id) !== String(userStore.id)) {
        return Promise.resolve({ code: 403, msg: '只能转交自己负责的客户' })
      }
      
      // 构建审批链
      const chain = buildApprovalChain(userStore.roleLevel)
      const taskId = `appr_transfer_${Date.now()}`
      const nowStr = () => new Date().toISOString().slice(0, 19).replace('T', ' ')
      
      // 创建转交审批任务
      approvalStore.unshift({
        id: taskId,
        type: 'CLIENT_TRANSFER',
        status: 'pending',
        applicant_user_id: String(userStore.id || '1'),
        applicant_user_name: String(userStore.nickName || userStore.name || '申请人'),
        client_id: clientId,
        client_name: (client as any).client_name || '客户',
        created_at: nowStr(),
        payload: {
          client_id: clientId,
          from_user: { 
            id: String(client.owner_user_id || userStore.id || '1'), 
            name: client.owner_user_name || String(userStore.nickName || userStore.name || '原经办人')
          },
          to_user: { 
            id: targetUserId, 
            name: params.target_user_name || params.to_owner_name || '新经办人'
          },
          reason: String(params.reason || '客户转交')
        },
        approval_chain: chain,
        current_step_index: 0,
        current_approver_role: chain[0],
        history: []
      } as any)
      
      return Promise.resolve({
        code: 200,
        data: { handover_id: taskId },
        msg: '已提交转交审批（将按审批链逐级审批）'
      })
    }
  },
  {
    // 确认合同交案
    url: '/crm/client/contract',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 确认合同', params)
      const clientId = parseInt(params.client_id)
      const idx = mockClients.findIndex(c => c.id === clientId)
      if (idx === -1) return Promise.resolve({ code: 404, msg: '客户不存在' })

      const curr: any = mockClients[idx]
      curr.status = 'CASE'
      curr.sales_stage = 'CASE'
      curr.update_time = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return Promise.resolve({
        code: 200,
        data: { id: Date.now(), ...params },
        msg: '确认成功'
      })
    }
  },
  {
    // 录入回款
    url: '/crm/client/payment',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 录入回款', params)
      const clientId = parseInt(params.client_id)
      const idx = mockClients.findIndex(c => c.id === clientId)
      if (idx === -1) return Promise.resolve({ code: 404, msg: '客户不存在' })

      const curr: any = mockClients[idx]
      curr.status = 'PAYMENT'
      curr.sales_stage = 'PAYMENT'
      curr.update_time = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return Promise.resolve({
        code: 200,
        data: { id: Date.now(), ...params },
        msg: '保存成功'
      })
    }
  },
  {
    // 录入律师费
    url: '/crm/client/legal-fee',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 录入律师费', params)
      const clientId = parseInt(params.client_id)
      const idx = mockClients.findIndex(c => c.id === clientId)
      if (idx === -1) return Promise.resolve({ code: 404, msg: '客户不存在' })

      const curr: any = mockClients[idx]
      curr.status = 'WON'
      curr.sales_stage = 'WON'
      curr.update_time = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return Promise.resolve({
        code: 200,
        data: { id: Date.now(), ...params },
        msg: '保存成功'
      })
    }
  },
  {
    url: '/crm/client/approve/:applyId',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 审批申领', params)

      return Promise.resolve({
        code: 200,
        msg: params.approved ? '审批通过' : '审批驳回'
      })
    }
  },
  {
    // 创建跟进记录
    url: '/crm/client/followup',
    method: 'POST',
    response: (params: any) => {
      console.log('Mock: 创建跟进记录', params)
      const clientId = parseInt(params.client_id)
      const idx = mockClients.findIndex(c => c.id === clientId)
      
      if (idx !== -1) {
        const curr: any = mockClients[idx]
        curr.followup_count = (curr.followup_count || 0) + 1
        curr.last_followup_at = params.time || new Date().toISOString().slice(0, 19).replace('T', ' ')
        if (params.next_plan_at) {
          curr.next_plan_at = params.next_plan_at
        }
        curr.update_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
      }

      return Promise.resolve({
        code: 200,
        data: { 
          id: Date.now(), 
          ...params,
          create_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
        },
        msg: '创建成功'
      })
    }
  },
  {
    // 获取跟进记录列表
    url: '/crm/client/:clientId/followup',
    method: 'GET',
    response: (params: any) => {
      console.log('Mock: 获取跟进记录列表', params)
      // 返回空列表，实际项目中应该从数据库获取
      return Promise.resolve({
        code: 200,
        data: [],
        msg: '获取成功'
      })
    }
  }
]

export default clientMock

