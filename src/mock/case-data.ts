/**
 * 案件管理 Mock 数据
 */

import type { Case } from '@/types/interfaces/case'

// Mock 案件数据
export const mockCases: Case[] = [
  {
    id: 1,
    case_number: 'CASE-2025-001',
    case_name: '张三诉李四合同纠纷案',
    case_type: 'civil',
    case_status: 'in_progress',
    case_description: '关于房屋买卖合同纠纷',
    plaintiff_name: '张三',
    defendant_name: '李四',
    draft_person: '王律师',
    create_datetime: '2025-01-15T10:00:00+08:00',
    update_datetime: '2025-01-20T14:30:00+08:00',
    is_deleted: false
  },
  {
    id: 2,
    case_number: 'CASE-2025-002',
    case_name: '王五诉赵六劳动争议案',
    case_type: 'civil',
    case_status: 'in_progress',
    case_description: '关于劳动合同解除赔偿纠纷',
    plaintiff_name: '王五',
    defendant_name: '赵六',
    draft_person: '李律师',
    create_datetime: '2025-01-18T09:00:00+08:00',
    update_datetime: '2025-01-22T16:00:00+08:00',
    is_deleted: false
  },
  {
    id: 3,
    case_number: 'CASE-2025-003',
    case_name: '某公司诉某公司知识产权侵权案',
    case_type: 'civil',
    case_status: 'draft',
    case_description: '关于商标侵权纠纷',
    plaintiff_name: 'ABC科技有限公司',
    defendant_name: 'XYZ网络有限公司',
    draft_person: '张律师',
    create_datetime: '2025-01-20T11:00:00+08:00',
    update_datetime: '2025-01-20T11:00:00+08:00',
    is_deleted: false
  },
  {
    id: 4,
    case_number: 'CASE-2025-004',
    case_name: '刘某盗窃案',
    case_type: 'criminal',
    case_status: 'in_progress',
    case_description: '涉嫌盗窃罪',
    plaintiff_name: '人民检察院',
    defendant_name: '刘某',
    draft_person: '陈律师',
    create_datetime: '2025-01-10T08:30:00+08:00',
    update_datetime: '2025-01-25T10:00:00+08:00',
    is_deleted: false
  },
  {
    id: 5,
    case_number: 'CASE-2025-005',
    case_name: '某公司诉税务局行政诉讼案',
    case_type: 'administrative',
    case_status: 'in_progress',
    case_description: '关于税务处罚决定不服',
    plaintiff_name: '某贸易有限公司',
    defendant_name: '市税务局',
    draft_person: '赵律师',
    create_datetime: '2025-01-12T14:00:00+08:00',
    update_datetime: '2025-01-23T09:30:00+08:00',
    is_deleted: false
  },
  {
    id: 6,
    case_number: 'CASE-2024-089',
    case_name: '陈某诉孙某离婚案',
    case_type: 'civil',
    case_status: 'closed',
    case_description: '关于离婚财产分割纠纷',
    plaintiff_name: '陈某',
    defendant_name: '孙某',
    draft_person: '吴律师',
    create_datetime: '2024-11-05T10:00:00+08:00',
    update_datetime: '2024-12-28T15:00:00+08:00',
    is_deleted: false
  },
  {
    id: 7,
    case_number: 'CASE-2025-006',
    case_name: '周某交通肇事案',
    case_type: 'criminal',
    case_status: 'in_progress',
    case_description: '涉嫌交通肇事罪',
    plaintiff_name: '人民检察院',
    defendant_name: '周某',
    draft_person: '郑律师',
    create_datetime: '2025-01-16T09:00:00+08:00',
    update_datetime: '2025-01-24T11:00:00+08:00',
    is_deleted: false
  },
  {
    id: 8,
    case_number: 'CASE-2025-007',
    case_name: '某公司诉某公司股权转让纠纷案',
    case_type: 'civil',
    case_status: 'draft',
    case_description: '关于股权转让合同纠纷',
    plaintiff_name: '甲投资公司',
    defendant_name: '乙科技公司',
    draft_person: '王律师',
    create_datetime: '2025-01-22T10:30:00+08:00',
    update_datetime: '2025-01-22T10:30:00+08:00',
    is_deleted: false
  }
]

// 模拟搜索案件
export function searchMockCases(keyword: string, limit: number = 20): Case[] {
  if (!keyword) {
    return mockCases.slice(0, limit)
  }
  
  const lowerKeyword = keyword.toLowerCase()
  return mockCases
    .filter(c => 
      c.case_number.toLowerCase().includes(lowerKeyword) ||
      c.case_name.toLowerCase().includes(lowerKeyword) ||
      c.plaintiff_name?.toLowerCase().includes(lowerKeyword) ||
      c.defendant_name?.toLowerCase().includes(lowerKeyword)
    )
    .slice(0, limit)
}

// 模拟获取案件列表
export function getMockCaseList(params: any = {}) {
  const { page = 1, limit = 20, search = '' } = params
  
  let filtered = mockCases
  
  // 搜索过滤
  if (search) {
    filtered = searchMockCases(search, 999)
  }
  
  // 分页
  const start = (page - 1) * limit
  const end = start + limit
  const results = filtered.slice(start, end)
  
  return {
    count: filtered.length,
    next: end < filtered.length ? `page=${page + 1}` : null,
    previous: page > 1 ? `page=${page - 1}` : null,
    results
  }
}
