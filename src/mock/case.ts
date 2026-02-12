/**
 * 案件管理 Mock 数据
 * 注意：此文件仅用于模拟数据，实际使用的是 case-handlers.ts
 */

import type { MockHandler } from './utils'
import { mockCases, getMockCaseList } from './case-data'

const caseMockHandlers: MockHandler[] = [
  // 获取案件列表
  {
    url: '/case/cases/',
    response: (params: any) => {
      console.log('Mock: 获取案件列表', params)
      const result = getMockCaseList(params)
      return {
        code: 2000,
        msg: '获取成功',
        data: result
      }
    }
  },
  
  // 获取案件详情
  {
    url: '/case/cases/:id/',
    response: (params: any) => {
      console.log('Mock: 获取案件详情', params)
      const caseItem = mockCases.find(c => c.id === Number(params.id))
      if (!caseItem) {
        return {
          code: 4004,
          msg: '案件不存在',
          data: null
        }
      }
      return {
        code: 2000,
        msg: '获取成功',
        data: caseItem
      }
    }
  }
]

export default caseMockHandlers
