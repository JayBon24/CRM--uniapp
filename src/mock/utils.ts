/**
 * Mock 工具函数
 * 提供统一的响应格式化和错误处理
 */

// 错误码常量
export const MockErrorCode = {
  SUCCESS: 200,      // 操作成功
  CREATED: 201,      // 创建成功
  BAD_REQUEST: 400,  // 参数错误
  UNAUTHORIZED: 401, // 未授权
  FORBIDDEN: 403,    // 权限不足
  NOT_FOUND: 404,    // 资源不存在
  SERVER_ERROR: 500  // 服务器错误
} as const

// Mock 处理器类型定义
export interface MockHandler {
  url: string
  method?: UniApp.RequestOptions['method']
  response: (params: any) => any
}

/**
 * 创建标准响应格式
 * @param data 响应数据
 * @returns 标准响应格式
 */
export function createMockResponse(data: any) {
  return {
    code: MockErrorCode.SUCCESS,
    msg: '操作成功',
    data: data
  }
}

/**
 * 创建列表型标准响应格式
 * @param options 包含 rows 与 total 的对象
 * @returns 标准列表响应格式
 */
export function createMockListResponse(options: { rows: any[]; total: number; code?: number; msg?: string }) {
  const { rows, total, code = MockErrorCode.SUCCESS, msg = '查询成功' } = options
  return {
    code,
    msg,
    rows,
    total
  }
}

/**
 * 创建错误响应
 * @param code 错误码
 * @param message 错误消息
 * @returns 错误响应格式
 */
export function createMockError(code: number, message: string) {
  return {
    code,
    msg: message,
    data: null
  }
}

/**
 * 生成随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成随机日期
 * @param start 开始日期
 * @param end 结束日期
 * @returns 随机日期字符串
 */
export function randomDate(start: Date = new Date('2024-01-01'), end: Date = new Date()): string {
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
  return new Date(randomTime).toISOString()
}

/**
 * 生成随机ID
 * @param prefix 前缀
 * @returns 随机ID
 */
export function generateRandomId(prefix: string = ''): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `${prefix}${timestamp}_${random}`
}

/**
 * 获取随机图片URL
 * @param category 图片分类
 * @param width 宽度
 * @param height 高度
 * @returns 随机图片URL
 */
export function getRandomImage(category: string, width: number = 400, height: number = 300): string {
  const seed = Math.floor(Math.random() * 1000)
  return `https://picsum.photos/${width}/${height}?random=${seed}`
}

/**
 * 获取用户头像URL
 * @param userId 用户ID
 * @returns 用户头像URL
 */
export function getUserAvatarUrl(userId: number | string): string {
  return getRandomImage('avatar', 200, 200)
}

/**
 * 获取展览封面URL
 * @param exhibitionId 展览ID
 * @returns 展览封面URL
 */
export function getExhibitionCoverUrl(exhibitionId: number | string): string {
  return getRandomImage('exhibition', 400, 300)
}

/**
 * 分页处理工具
 * @param data 原始数据
 * @param pageNum 页码
 * @param pageSize 每页大小
 * @returns 分页结果
 */
export function paginateData<T>(data: T[], pageNum: number = 1, pageSize: number = 10) {
  const total = data.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = data.slice(start, end)

  return {
    rows,
    total
  }
}

/**
 * 过滤数据工具
 * @param data 原始数据
 * @param filters 过滤条件
 * @returns 过滤后的数据
 */
export function filterData<T>(data: T[], filters: Record<string, any>): T[] {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return true
      }

      const itemValue = (item as any)[key]
      if (typeof value === 'string') {
        return itemValue && itemValue.toString().includes(value)
      }

      return itemValue === value
    })
  })
}

/**
 * 排序数据工具
 * @param data 原始数据
 * @param orderByColumn 排序字段
 * @param isAsc 是否升序
 * @returns 排序后的数据
 */
export function sortData<T>(data: T[], orderByColumn?: string, isAsc: 'asc' | 'desc' = 'desc'): T[] {
  if (!orderByColumn) {
    return data
  }

  return [...data].sort((a, b) => {
    const aValue = (a as any)[orderByColumn]
    const bValue = (b as any)[orderByColumn]

    if (aValue === bValue) return 0

    const comparison = aValue < bValue ? -1 : 1
    return isAsc === 'asc' ? comparison : -comparison
  })
}

/**
 * 模拟网络延迟
 * @param min 最小延迟（毫秒）
 * @param max 最大延迟（毫秒）
 * @returns Promise
 */
export function mockDelay(min: number = 200, max: number = 800): Promise<void> {
  const delay = randomInt(min, max)
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * 验证必需参数
 * @param params 参数对象
 * @param requiredFields 必需字段数组
 * @returns 验证结果
 */
export function validateRequiredParams(params: any, requiredFields: string[]): { valid: boolean; message?: string } {
  for (const field of requiredFields) {
    if (params[field] === undefined || params[field] === null || params[field] === '') {
      return {
        valid: false,
        message: `${field} 不能为空`
      }
    }
  }
  return { valid: true }
}
