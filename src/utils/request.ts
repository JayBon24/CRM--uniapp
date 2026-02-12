// 中文注释：将网络请求从 axios 改为使用 uni.request，保留统一拦截与 Mock 能力
// 使用用户状态管理仓库
import { useUserStore } from '@/stores/user'
import { removeToken } from '@/utils/auth'
import { getEnvConfig } from '@/config/env'

// 开发阶段：静态引入 mock 注册
// 注意：不要在此处引入 mock，否则会产生循环依赖导致 mockHandlers 未初始化


// 接口返回格式
interface IApiResponse<T = any> {
  code: number
  msg?: string
  message?: string // 支持另一种错误消息字段
  data?: T
  rows?: T[]
  total?: number
}

// 模拟数据处理器类型
type MockHandler<T = any, P = any> = (params?: P, url?: string) => Promise<T>

// 模拟数据处理器配置
interface IMockHandler {
  pattern: string | RegExp
  handler: MockHandler
}

// 获取环境配置
const envConfig = getEnvConfig()
console.log('🌍 envConfig 初始化 (来自 src/config/env.ts):', {
  useMock: envConfig.useMock,
  apiBaseUrl: envConfig.apiBaseUrl,
})

// 模拟数据处理器列表
const mockHandlers: IMockHandler[] = []

// 防抖：避免401触发多个登录跳转
let isLoginModalOpen = false

/**
 * 注册模拟数据处理器
 * @param pattern API路径或正则表达式
 * @param handler 处理函数
 */
export function registerMockHandler<T = any, P = any>(
  pattern: string | RegExp,
  handler: MockHandler<T, P>,
) {
  mockHandlers.push({ pattern, handler })
}

/**
 * 注册 Mock 处理器数组
 * @param handlers Mock 处理器数组
 */
export function registerMockHandlers(handlers: Array<{ url: string; method?: string; response: (params: any) => any }>) {
  handlers.forEach(({ url, response }, index) => {
    registerMockHandler(url, response)
  })
}

/**
 * 获取模拟数据处理器
 * @param url 请求URL
 * @returns 处理器或undefined
 */
function getMockHandler(url: string): { handler: MockHandler, matchedUrl: string, params?: any } | undefined {
  // 移除可能的/api前缀
  const path = url.replace(/^\/api/, '')

  console.log('=== 查找 Mock 处理器 ===')
  console.log('请求 URL:', url)
  console.log('处理后的路径:', path)
  // 遍历所有处理器
  for (const { pattern, handler } of mockHandlers) {
    // 字符串模式匹配
    if (typeof pattern === 'string') {
      // 检查是否包含参数占位符（如 :id）
      if (pattern.includes(':')) {
        // 将模式转换为正则表达式
        const regexPattern = pattern.replace(/:\w+/g, '([^/]+)')
        const regex = new RegExp(`^${regexPattern}$`)
        const match = path.match(regex)
        if (match) {
          console.log('✅ 参数模式匹配成功:', pattern)
          // 提取参数
          const paramNames = pattern.match(/:\w+/g)?.map(name => name.substring(1)) || []
          const params: any = {}
          paramNames.forEach((name, index) => {
            params[name] = match[index + 1]
          })
          console.log('提取的参数:', params)
          return { handler, matchedUrl: url, params }
        }
      } else {
        // 普通字符串匹配
        const variants = [
          path,
          path.startsWith('/') ? path.substring(1) : `/${path}`,
          path.endsWith('/') ? path.substring(0, path.length - 1) : `${path}/`,
        ]

        // 检查精确匹配
        if (variants.includes(pattern)) {
          console.log('✅ 精确匹配成功:', pattern)
          return { handler, matchedUrl: url }
        }

        // 检查路径前缀匹配（用于字典类型查询等）
        // 注意：只有当路径完全匹配或只有查询参数时才匹配，避免 /schedules/ 匹配 /schedules/6/
        if (pattern.endsWith('/')) {
          const pathWithoutTrailingSlash = path.endsWith('/') ? path.slice(0, -1) : path
          const patternWithoutTrailingSlash = pattern.slice(0, -1)
          if (pathWithoutTrailingSlash === patternWithoutTrailingSlash) {
            console.log('✅ 精确匹配成功（带斜杠）:', pattern)
            return { handler, matchedUrl: url }
          }
        }
      }
    }
    // 正则表达式匹配
    else if (pattern.test(path)) {
      console.log('✅ 正则匹配成功:', pattern)
      return { handler, matchedUrl: url }
    }
  }

  console.log('❌ 未找到匹配的处理器')
  return undefined
}

/**
 * 过滤空值和空字符串参数
 * @param obj 要过滤的对象
 * @returns 过滤后的对象
 */
function filterEmptyParams(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => filterEmptyParams(item))
  }

  if (typeof obj === 'object') {
    const filtered: any = {}
    for (const [key, value] of Object.entries(obj)) {
      // 过滤空值、空字符串、空数组
      if (value !== null &&
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)) {
        filtered[key] = filterEmptyParams(value)
      }
    }
    return filtered
  }

  return obj
}

// 中文注释：统一请求执行函数，替代 axios 的实例与拦截器
async function performRequest<T = any>(
  method: UniApp.RequestOptions['method'],
  url: string,
  options?: { params?: any; data?: any; headers?: Record<string, string> },
): Promise<T> {
  const userStore = useUserStore()
  const token = userStore.token
  const useMock = getEnvConfig().useMock
  let requestMode = useMock ? 'Mock' : 'API'

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  }
  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`
  }

  // 过滤空值和空字符串参数
  let filteredParams: any = filterEmptyParams(options?.params || {})
  const filteredData = filterEmptyParams(options?.data || {})

  // 兼容处理：若误传了 { params: {...} }，自动解包为普通查询对象，避免 ?params=JSON
  if (
    method === 'GET' &&
    filteredParams &&
    typeof filteredParams === 'object' &&
    'params' in filteredParams &&
    Object.keys(filteredParams).length === 1 &&
    typeof (filteredParams as any).params === 'object'
  ) {
    filteredParams = (filteredParams as any).params
  }

  // 中文注释：打印请求信息用于调试
  console.log('🚀 发起请求 ====>', {
    url,
    method,
    isMock: useMock,
    requestMode,
    originalParams: options?.params || {},
    originalData: options?.data || {},
    filteredParams,
    filteredData,
    headers: finalHeaders,
  })

  // 中文注释：Mock 处理优先
  if (useMock && url) {
    const match = getMockHandler(url)
    if (match) {
      const { handler, matchedUrl, params: pathParams } = match
      requestMode = 'Mock'
      console.log('🧪 本次请求使用 Mock 处理器:', matchedUrl)
      try {
        const mergedParams = { ...filteredData, ...filteredParams, ...(pathParams || {}) }
        console.log('Mock处理器接收到的params:', mergedParams)
        const mockData: any = await Promise.resolve(handler(mergedParams, matchedUrl))

        console.log('📦 模拟数据响应 <====', { url, data: mockData })
        // 中文注释：与原响应拦截逻辑保持一致——成功返回完整响应对象，失败统一报错
        if (mockData && typeof mockData.code === 'number') {
          // 支持多种成功状态码：200, 2000, 0
          if (mockData.code === 200 || mockData.code === 2000 || mockData.code === 0) {
            return mockData as T
          }

          // 非200状态码，提取并显示详细错误信息
          const errorMsg = mockData.msg || mockData.message || `Mock请求失败 (错误码: ${mockData.code})`
          console.error('❌ Mock业务错误:', {
            url: matchedUrl,
            code: mockData.code,
            message: errorMsg,
            data: mockData
          })

          // 异步处理业务错误，不等待结果
          handleBusinessError(mockData.code, errorMsg).catch(error => {
            console.error('处理业务错误失败:', error)
          })
          throw new Error(errorMsg)
        }
        return mockData as T
      } catch (error: any) {
        console.error('❌ 模拟数据处理异常:', error)
        const errorMsg = error?.message || '模拟数据处理异常'
        uni.showModal({
          title: 'Mock数据错误',
          content: errorMsg,
          showCancel: false,
          confirmText: '确定'
        })
        throw error
      }
    } else {
      // Mock模式下找不到处理器，应该报错而不是fallback到真实网络
      console.error('❌ Mock模式：未找到模拟数据处理器:', url)
      console.error('已注册的Mock处理器数量:', mockHandlers.length)
      console.error('请检查Mock处理器是否正确注册')
      
      // 在Mock模式下，如果找不到处理器，抛出错误
      const errorMsg = `Mock模式：未找到接口 ${url} 的Mock处理器`
      uni.showModal({
        title: 'Mock配置错误',
        content: errorMsg,
        showCancel: false,
        confirmText: '确定'
      })
      throw new Error(errorMsg)
    }
  }

  // 中文注释：真实请求走 uni.request（只有在非Mock模式下才会执行到这里）
  requestMode = 'API'
  console.log('🌐 本次请求走真实 API')

  const isAbsolute = /^https?:\/\//.test(url)
  // URL路径处理逻辑：
  // 1. 绝对路径（http://或https://开头）：直接使用
  // 2. /admin-api/ 开头的路径：后端完整路径，不需要添加 /api 前缀
  // 3. /api/ 开头的路径：已经有 /api 前缀，不需要再次添加
  // 4. 其他路径：添加 /api 前缀，例如：/crm/client/list -> /api/crm/client/list
  
  let finalUrl = url
  
  // 处理相对路径
  if (!isAbsolute) {
    // /admin-api/ 路径：直接使用，不添加前缀
    if (url.startsWith('/admin-api')) {
      finalUrl = url
    }
    // /api/ 路径：已经有前缀，直接使用
    else if (url.startsWith('/api')) {
      finalUrl = url
    }
    // 其他路径：添加 /api 前缀
    else {
      finalUrl = `/api${url}`
    }
  }
  
  // 确保 apiBaseUrl 不包含 /api/ 后缀，避免重复拼接
  let baseUrl = envConfig.apiBaseUrl || ''
  // 去除末尾的 /api 或 /api/
  baseUrl = baseUrl.replace(/\/api\/?$/, '')
  
  const fullUrl = isAbsolute ? url : `${baseUrl}${finalUrl}`
  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method,
      data: method === 'GET' ? filteredParams : filteredData,
      header: finalHeaders,
      timeout: 10000,
      success: (resp) => {
        const statusCode = Number((resp as any)?.statusCode || 0)
        const responseData = resp.data as IApiResponse | any
        console.log('📨 接口响应 <====', { url, data: responseData })

        // uni.request 在 HTTP 4xx/5xx 仍会进入 success，这里统一拦截
        if (statusCode >= 400) {
          let httpErrorMsg = `HTTP ${statusCode} 请求失败`
          if (responseData && typeof responseData === 'object') {
            httpErrorMsg = responseData.msg || responseData.message || responseData.detail || httpErrorMsg
          } else if (typeof responseData === 'string') {
            if (responseData.includes('Page not found')) {
              httpErrorMsg = `接口不存在：${fullUrl}`
            }
          }
          console.error('❌ HTTP状态错误:', { url: fullUrl, statusCode, message: httpErrorMsg })

          // 对认证类HTTP错误走统一逻辑
          if (statusCode === 401 || statusCode === 403) {
            handleBusinessError(statusCode, httpErrorMsg).catch(error => {
              console.error('处理业务错误失败:', error)
            })
          } else {
            uni.showModal({
              title: '请求失败',
              content: httpErrorMsg,
              showCancel: false,
              confirmText: '确定'
            })
          }
          reject(new Error(httpErrorMsg))
          return
        }

        if (responseData && typeof responseData.code === 'number') {
          // 支持多种成功状态码：200, 2000, 0
          if (responseData.code === 200 || responseData.code === 2000 || responseData.code === 0) {
            resolve(responseData as unknown as T)
            return
          }

          // 非200状态码，提取并显示详细错误信息
          const errorMsg = responseData.msg || responseData.message || `请求失败 (错误码: ${responseData.code})`
          console.error('❌ API业务错误:', {
            url: fullUrl,
            code: responseData.code,
            message: errorMsg,
            data: responseData
          })

          // 异步处理业务错误，不等待结果
          handleBusinessError(responseData.code, errorMsg).catch(error => {
            console.error('处理业务错误失败:', error)
          })
          reject(new Error(errorMsg))
          return
        }

        // 非标准格式，直接返回
        resolve(responseData as unknown as T)
      },
      fail: (error) => {
        const networkError = error?.errMsg || '网络异常'
        console.error('❌ 网络请求失败:', {
          url: fullUrl,
          method,
          error: networkError,
          fullError: error
        })

        // 根据不同的网络错误类型提供不同的提示
        let errorTitle = '网络错误'
        let errorMessage = '网络异常'

        if (networkError.includes('timeout')) {
          errorTitle = '请求超时'
          errorMessage = '请求超时，请检查网络连接'
        } else if (networkError.includes('fail')) {
          errorTitle = '连接失败'
          errorMessage = '网络连接失败，请检查网络设置'
        } else if (networkError.includes('abort')) {
          errorTitle = '请求取消'
          errorMessage = '请求已取消'
        }

        uni.showModal({
          title: errorTitle,
          content: errorMessage,
          showCancel: false,
          confirmText: '确定'
        })

        reject(new Error(networkError))
      },
    })
  })
}

/**
 * 从响应中提取数据
 * 支持多种数据格式：
 * 1. { code: 200, data: any } - 单条数据
 * 2. { code: 200, rows: any[], total: number } - 分页数据
 */
function extractResponseData(res: IApiResponse): any {
  // 检查是否有标准状态码
  if (res && typeof res.code === 'number') {
    // 分页数据格式
    if (res.rows !== undefined) {
      return {
        rows: res.rows,
        total: res.total || 0
      }
    }
    // 单条数据格式
    if (res.data !== undefined) {
      return res.data
    }
  }

  // 如果没有标准格式，返回原始数据
  return res
}

// 中文注释：统一处理业务错误（与原响应拦截逻辑一致）
async function handleBusinessError(code: number, errorMsg: string) {
  const userStore = useUserStore()
  const authMissing = /身份认证信息未提供|Authentication credentials were not provided/i.test(errorMsg || '')

  if (authMissing) {
    try { removeToken() } catch {}
    userStore.token = ''
    if (isLoginModalOpen) return
    isLoginModalOpen = true
    userStore.logOut()
    uni.reLaunch({ url: '/pages/other/auth/login' })
    setTimeout(() => {
      isLoginModalOpen = false
    }, 1000)
    return
  }

  // 根据错误码提供更具体的错误处理
  switch (code) {
    case 400:
      uni.showModal({
        title: '请求错误',
        content: `请求参数错误: ${errorMsg}`,
        showCancel: false,
        confirmText: '确定'
      })
      break
    case 401:
      // 立即清空本地token，防止继续携带无效token请求
      try { removeToken() } catch {}
      userStore.token = ''

      // 如果已经在处理登录跳转，直接返回
      if (isLoginModalOpen) return

      // 先尝试自动登录
      try {
        const autoLoginResult = await userStore.executeAutoLogin()
        if (autoLoginResult.success) {
          uni.showToast({ title: '自动登录成功', icon: 'success', duration: 1500 })
          setTimeout(() => {
            const pages = getCurrentPages()
            const currentPage = pages[pages.length - 1]
            if (currentPage && currentPage.onLoad) currentPage.onLoad()
          }, 1200)
          return
        }
      } catch (error) {
        console.error('自动登录失败:', error)
      }

      // 自动登录失败，直接跳转到登录页面
      isLoginModalOpen = true
      userStore.logOut()
      uni.reLaunch({ url: '/pages/other/auth/login' })

      // 延迟重置状态，避免重复跳转
      setTimeout(() => {
        isLoginModalOpen = false
      }, 1000)
      break
    case 403:
      uni.showModal({
        title: '权限不足',
        content: `权限不足: ${errorMsg}`,
        showCancel: false,
        confirmText: '确定'
      })
      break
    case 404:
      uni.showModal({
        title: '资源不存在',
        content: `资源不存在: ${errorMsg}`,
        showCancel: false,
        confirmText: '确定'
      })
      break
    case 422:
      uni.showModal({
        title: '数据验证失败',
        content: `数据验证失败: ${errorMsg}`,
        showCancel: false,
        confirmText: '确定'
      })
      break
    case 429:
      uni.showModal({
        title: '请求频繁',
        content: '请求过于频繁，请稍后重试',
        showCancel: false,
        confirmText: '确定'
      })
      break
    case 500:
      uni.showModal({
        title: '提示',
        content: `${errorMsg}`,
        showCancel: false,
        confirmText: '确定'
      })
      break
    case 502:
      uni.showModal({
        title: '网关错误',
        content: '服务器网关错误，请稍后重试',
        showCancel: false,
        confirmText: '确定'
      })
      break
    case 503:
      uni.showModal({
        title: '服务不可用',
        content: '服务不可用，请稍后重试',
        showCancel: false,
        confirmText: '确定'
      })
      break
    case 504:
      uni.showModal({
        title: '响应超时',
        content: '服务器响应超时，请稍后重试',
        showCancel: false,
        confirmText: '确定'
      })
      break
    default:
      // 其他错误码，显示完整的错误信息
      const displayMsg = errorMsg || `请求失败 (错误码: ${code})`
      uni.showModal({
        title: '请求失败',
        content: displayMsg,
        showCancel: false,
        confirmText: '确定'
      })
  }
}

// 封装请求方法
export const http = {
  get<T = any>(url: string, params?: any): Promise<T> {
    return performRequest<T>('GET', url, { params })
  },

  post<T = any>(url: string, data?: any): Promise<T> {
    return performRequest<T>('POST', url, { data })
  },

  put<T = any>(url: string, data?: any): Promise<T> {
    return performRequest<T>('PUT', url, { data })
  },

  delete<T = any>(url: string, params?: any): Promise<T> {
    return performRequest<T>('DELETE', url, { params })
  },
}

// 中文注释：保持默认导出供历史代码兼容
export default http
