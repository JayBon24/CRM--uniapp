/**
 * Mock 数据入口文件
 * 统一注册所有 Mock 处理器
 * 
 * 优化：将大型 Mock 文件（如 area.ts）改为动态导入，避免打包进主包
 */

import type { MockHandler } from './utils'
import userMock from './user'
import dictMock from './dict'
// areaMock 改为动态导入，避免 414KB 的省市区数据被打包进主包
// import areaMock from './area'
import clientMock from './client'
import mineMock from './mine'
import scheduleMock from './schedule'
import caseMock from './case-handlers'
import reportsMock from './reports'
import configMock from './config'
import { registerMockHandlers } from '@/utils/request'


// 合并所有 Mock 处理器（areaMock 将在 setupMockHandlers 中动态加载）
const allMockHandlers: MockHandler[] = [
  ...userMock,
  ...dictMock,
  // areaMock 将在 setupMockHandlers 中动态加载
  ...clientMock,
  ...mineMock,
  ...scheduleMock,
  ...caseMock,
  ...reportsMock,
  ...configMock
]

// 注册 Mock 处理器到 request.ts
export async function setupMockHandlers() {
  console.log('=== Mock 系统初始化 ===')
  
  // 动态导入 areaMock，避免大型数据文件被打包进主包
  let areaMock: MockHandler[] = []
  try {
    const areaModule = await import('./area')
    areaMock = areaModule.default || []
    console.log('✅ areaMock 动态加载成功')
  } catch (err) {
    console.warn('⚠️ areaMock 加载失败（不影响其他 Mock）:', err)
  }
  
  // 合并所有 Mock 处理器（包括动态加载的 areaMock）
  const finalMockHandlers: MockHandler[] = [
    ...allMockHandlers,
    ...areaMock
  ]
  
  console.log('所有 Mock 处理器:', finalMockHandlers)

  // 中文注释：同步注册，避免首屏请求早于 mock 注册导致走真实网络并超时
  registerMockHandlers(finalMockHandlers)
  console.log('Mock 处理器已注册，共', finalMockHandlers.length, '个接口')
}

// 导出所有 Mock 处理器（不包含 areaMock，因为它需要动态加载）
export default allMockHandlers

// 导出各模块的 Mock 数据（用于测试，areaMock 需要动态导入）
export { userMock, dictMock, clientMock, mineMock, scheduleMock, caseMock, reportsMock, configMock }
