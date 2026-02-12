/**
 * 案件管理 Mock 处理器
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
      return Promise.resolve({
        code: 200,
        data: result
      })
    }
  },
  
  // 获取案件详情
  {
    url: '/case/cases/:id/',
    response: (params: any) => {
      console.log('Mock: 获取案件详情', params)
      const caseItem = mockCases.find(c => c.id === Number(params.id))
      if (!caseItem) {
        return Promise.resolve({
          code: 404,
          msg: '案件不存在',
          data: null
        })
      }
      return Promise.resolve({
        code: 200,
        data: caseItem
      })
    }
  }
]

export default caseMockHandlers
