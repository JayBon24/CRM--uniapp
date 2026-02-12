/**
 * 环境变量配置
 * 统一配置，不区分环境
 */

// 简单的布尔解析，兼容字符串与布尔值
function parseBool(val: any, defaultValue = false) {
  if (val === undefined || val === null) return defaultValue
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') return val.toLowerCase() === 'true'
  return defaultValue
}

const ENV = (import.meta as any).env || {}

// 真机调试后端地址（可在 .env 中通过 VITE_REAL_DEVICE_API_URL 配置）
const DEFAULT_REAL_DEVICE_API_BASE_URL = ''

function normalizeBaseUrl(url: string) {
  return (url || '').replace(/\/api\/?$/, '').replace(/\/$/, '')
}

function isWeixinRealDevice(): boolean {
  try {
    // #ifdef MP-WEIXIN
    const info = uni.getSystemInfoSync?.()
    const p = (info as any)?.platform
    return p === 'ios' || p === 'android'
    // #endif
  } catch {}
  return false
}

// 统一配置（优先读取 .env 中的 VITE_ 前缀变量）
const CONFIG = {
  // API配置（后端 API 地址，用于 Tab3 WebSocket 和 HTTP 请求）
  apiBaseUrl: (() => {
    const raw = ENV.VITE_APP_BASE_API || ENV.VITE_API_URL || ENV.VITE_API_BASE_URL || DEFAULT_REAL_DEVICE_API_BASE_URL
    let base = normalizeBaseUrl(raw)
    // 真机上如果拿到了 localhost/127.0.0.1（比如 .env.development 配置），会导致手机请求自己 -> 连接失败
    // 这里优先使用 VITE_REAL_DEVICE_API_URL，不再强制改为线上地址。
    if (isWeixinRealDevice() && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(base)) {
      const realDeviceApi = normalizeBaseUrl(ENV.VITE_REAL_DEVICE_API_URL || DEFAULT_REAL_DEVICE_API_BASE_URL)
      if (realDeviceApi) {
        base = realDeviceApi
      } else {
        console.warn('⚠️ 检测到真机调试且 API 指向 localhost/127.0.0.1，请在 .env.development 配置 VITE_REAL_DEVICE_API_URL（例如你的局域网 IP）')
      }
    }
    try {
      // 仅输出必要信息，不输出敏感信息
      // #ifdef MP-WEIXIN
      const info = uni.getSystemInfoSync?.() as any
      console.log('🌍 apiBaseUrl resolved:', {
        platform: info?.platform,
        isRealDevice: isWeixinRealDevice(),
        apiBaseUrl: base
      })
      // #endif
    } catch {}
    return base
  })(),
  // // API配置
  // apiBaseUrl: ENV.VITE_API_URL || ENV.VITE_API_BASE_URL || 'https://api.iexpo.online',

  // XpertAI ChatKit API 配置
  xpertaiApiUrl: ENV.VITE_XPERTAI_API_URL || 'https://api.mtda.cloud/api/ai/',

  // 地图API Key
  amapKey: ENV.VITE_AMAP_KEY || '1dc675ee5608855c204f0c0152182186',
  qqmapKey: ENV.VITE_QQMAP_KEY || 'WNMBZ-ZPU35-ZIOIT-IEKS3-LDJOK-OFBXO',

  // 应用配置
  appTitle: ENV.VITE_APP_TITLE || '抖音商城',

  // 客服配置（保持默认值，可按需扩展 env）
  customerService: {
    phone: '400-123-4567',
    workTime: '9:00-18:00',
    email: 'service@douyin.com',
    wechat: 'douyin_service'
  },

  // 功能开关
  useMock: parseBool(ENV.VITE_USE_MOCK, false),
}

// 获取环境变量配置
export function getEnvConfig() {
  return CONFIG
}

// 获取环境变量（简化版本）
export const getEnv = () => {
  return {
    // 地图API Key
    AMAP_KEY: CONFIG.amapKey,
    QQMAP_KEY: CONFIG.qqmapKey,

    // API配置
    API_BASE_URL: CONFIG.apiBaseUrl,
    XPERTAI_API_URL: CONFIG.xpertaiApiUrl,

    // 应用配置
    APP_TITLE: CONFIG.appTitle,

    // 客服配置
    CUSTOMER_SERVICE: CONFIG.customerService,

    // 功能开关
    USE_MOCK: CONFIG.useMock,
  }
}

// 导出环境配置
export const env = getEnv()
