/**
 * 全局工具函数
 */
import { getEnvConfig } from '@/config/env'
import { useDictStore } from '@/stores/dict'
import { getToken } from '@/utils/auth'

/**
 * 处理图片地址
 * @param url 图片地址
 * @param width 图片宽度（可选）
 * @param height 图片高度（可选）
 * @returns 处理后的图片地址
 */
export function getImageUrl(url: string, width?: number, height?: number): string {
  if (!url)
    return ''

  // 小程序本地临时文件、base64、blob 直接返回
  if (
    url.startsWith('wxfile://')
    || url.startsWith('file://')
    || url.startsWith('blob:')
    || url.startsWith('data:')
  ) {
    return url
  }

  const appendAccessToken = (target: string) => {
    const token = getToken()
    if (!token) return target
    if (!/\/media\//.test(target) && !/\/admin-api\/system\/file\//.test(target)) return target
    if (/[\?&]access_token=/.test(target)) return target
    const sep = target.includes('?') ? '&' : '?'
    return `${target}${sep}access_token=${encodeURIComponent(token)}`
  }

  // 如果是完整的 URL，则直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // 如果需要调整尺寸，特殊处理不同的图片服务
    if (width || height) {
      // 对于 picsum.photos，使用指定的尺寸
      if (url.includes('picsum.photos')) {
        if (width && height) {
          return url.replace(/\/(\d+)\/(\d+)/, `/${width}/${height}`)
        } else if (width) {
          // 只指定宽度，按16:9比例计算高度
          const calculatedHeight = Math.round(width * 9 / 16)
          return url.replace(/\/(\d+)\/(\d+)/, `/${width}/${calculatedHeight}`)
        }
      }
      // 对于其他服务，添加width和height参数
      const params = new URLSearchParams()
      if (width) params.append('width', width.toString())
      if (height) params.append('height', height.toString())

      if (params.toString()) {
        return url + (url.includes('?') ? '&' : '?') + params.toString()
      }
    }
    return appendAccessToken(url)
  }

  // 如果是相对路径，则拼接基础路径
  // 统一去除 /api 后缀，避免出现 /apimedia 之类错误地址
  const baseUrl = (getEnvConfig().apiBaseUrl || '').replace(/\/api\/?$/, '').replace(/\/$/, '')
  const normalizedPath = url.startsWith('/') ? url : `/${url}`
  if (!baseUrl) {
    return normalizedPath
  }
  let finalUrl = `${baseUrl}${normalizedPath}`

  // 如果需要调整尺寸，添加width和height参数
  // if (width || height) {
  //   const params = new URLSearchParams()
  //   if (width) params.append('width', width.toString())
  //   if (height) params.append('height', height.toString())

  //   if (params.toString()) {
  //     finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.toString()
  //   }
  // }

  return appendAccessToken(finalUrl)
}

/**
 * 生成随机图片URL
 * @param width 图片宽度
 * @param height 图片高度
 * @param seed 随机种子（可选）
 * @returns picsum.photos 图片URL
 */
export function getRandomImageUrl(width: number = 200, height: number = 200, seed?: string | number): string {
  const randomSeed = seed || Math.floor(Math.random() * 1000)
  return `https://picsum.photos/${width}/${height}?random=${randomSeed}`
}

/**
 * 生成用户头像URL
 * @param userId 用户ID
 * @returns 用户头像URL
 */
export function getUserAvatarUrl(userId: number | string): string {
  return getRandomImageUrl(200, 200, `user_${userId}`)
}

/**
 * 生成展览封面URL
 * @param exhibitionId 展览ID
 * @returns 展览封面URL
 */
export function getExhibitionCoverUrl(exhibitionId: number | string): string {
  return getRandomImageUrl(400, 300, `exhibition_${exhibitionId}`)
}

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 格式化模板
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date, format: string = 'YYYY-MM-DD'): string {
  if (!date || isNaN(new Date(date).getTime())) {
    return ''
  }

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 格式化数字（添加单位：万、亿）
 * @param num 数字
 * @param decimals 小数位数
 * @returns 格式化后的数字
 */
export function formatNumber(num: number | string, decimals = 2): string {
  if (!num && num !== 0)
    return ''

  const number = typeof num === 'string' ? Number.parseFloat(num) : num
  if (number < 10000) {
    return number.toString()
  }
  else if (number < 100000000) {
    return `${(number / 10000).toFixed(decimals)}万`
  }
  else {
    return `${(number / 100000000).toFixed(decimals)}亿`
  }
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: number | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * 显示提示信息
 * @param message 提示内容
 * @param type 提示类型
 */
export function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
  uni.showToast({
    title: message,
    icon: type === 'success' ? 'success' : type === 'error' ? 'error' : 'none',
    duration: 2000
  })
}

/**
 * 显示确认对话框
 * @param title 标题
 * @param content 内容
 * @returns Promise<boolean>
 */
export function showConfirm(title: string, content: string): Promise<boolean> {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

// 注意：getSystemInfoAsync 已移至 src/utils/system.ts 中，避免重复定义

/**
 * 检查网络状态
 * @returns Promise<boolean>
 */
export function checkNetworkStatus(): Promise<boolean> {
  return new Promise((resolve) => {
    uni.getNetworkType({
      success: (res) => {
        resolve(res.networkType !== 'none')
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/**
 * 根据字典值获取字典标签（全局函数）
 * @param dictType 字典类型
 * @param value 字典值
 * @returns 字典标签（找不到则回退为原值）
 */


/**
 * 保存登录前页面
 */
export function saveBeforeLoginPage() {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    const currentRoute = `/${currentPage.route}`
    // 不保存登录相关页面
    if (!currentRoute.includes('/pages/auth/')) {
      uni.setStorageSync('beforeLoginPage', currentRoute)
    }
  }
}


/**
 * 页面导航
 * @param url 页面路径
 * @param params 页面参数
 */
export function navigateTo(url: string, params?: Record<string, any>) {
  if (params) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
    url = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
  }
  uni.navigateTo({ url })
}


/**
 * 统一的返回函数
 * 如果有上一页则返回上一页
 * 如果没有上一页则返回首页
 * @param delta 返回的页面数，默认1
 */
export function goBack(delta: number = 1) {
  const pages = getCurrentPages()

  // 如果当前只有一个页面，或者返回的页面数超过了历史栈的长度，则跳转到首页
  if (pages.length <= 1 || pages.length <= delta) {
    uni.switchTab({
      url: '/pages/index/index'
    })
    return
  }

  // 正常返回上一页
  uni.navigateBack({
    delta
  })
}

/**
 * 返回到登录页面之前的页面
 * 跳过登录页面和注册页面，直到找到非认证页面
 * 如果没有找到合适的页面则返回首页
 */
export function goBackToBeforeLogin() {
  const pages = getCurrentPages()

  // 如果当前只有一个页面，直接跳转到首页
  if (pages.length <= 1) {
    uni.switchTab({
      url: '/pages/index/index'
    })
    return
  }

  // 需要跳过的认证相关页面
  const authPages = [
    '/pages/auth/login',
    '/pages/auth/register',
    '/pages/auth/bind',
    '/pages/other/auth/login',
    '/pages/other/auth/register',
    '/pages/other/auth/bind'
  ]

  // 从倒数第二个页面开始查找（跳过当前页面）
  let targetDelta = 1
  for (let i = pages.length - 2; i >= 0; i--) {
    const page = pages[i]
    const route = `/${page.route}`

    // 如果不是认证页面，则返回到该页面
    if (!authPages.includes(route)) {
      uni.navigateBack({
        delta: targetDelta
      })
      return
    }

    targetDelta++
  }

  // 如果所有历史页面都是认证页面，则跳转到首页
  uni.switchTab({
    url: '/pages/index/index'
  })
}
