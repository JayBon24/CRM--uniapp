/**
 * 本地存储工具函数
 * 兼容微信小程序环境
 */

/**
 * 存储数据
 * @param key 键
 * @param value 值
 * @param expire 过期时间（毫秒）
 */
export function setStorage(key: string, value: any, expire?: number): boolean {
  try {
    const data = {
      value,
      time: Date.now(),
      expire,
    }
    uni.setStorageSync(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('存储数据失败:', error)
    return false
  }
}

/**
 * 获取数据
 * @param key 键
 * @returns any
 */
export function getStorage(key: string): any {
  try {
    const data = uni.getStorageSync(key)
    if (!data) {
      return null
    }

    const { value, time, expire } = JSON.parse(data)

    // 判断是否过期
    if (expire && Date.now() - time > expire) {
      uni.removeStorageSync(key)
      return null
    }

    return value
  } catch (error) {
    console.error('获取存储数据失败:', error)
    return null
  }
}

/**
 * 删除数据
 * @param key 键
 */
export function removeStorage(key: string): boolean {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (error) {
    console.error('删除存储数据失败:', error)
    return false
  }
}

/**
 * 清空所有数据
 */
export function clearStorage(): boolean {
  try {
    uni.clearStorageSync()
    return true
  } catch (error) {
    console.error('清空存储数据失败:', error)
    return false
  }
}

/**
 * 获取所有keys
 * @returns string[]
 */
export function getStorageKeys(): string[] {
  try {
    const res = uni.getStorageInfoSync()
    return res.keys || []
  } catch (error) {
    console.error('获取存储keys失败:', error)
    return []
  }
}

/**
 * 获取已用空间大小（KB）
 * @returns number
 */
export function getStorageSize(): number {
  try {
    const res = uni.getStorageInfoSync()
    return res.currentSize || 0
  } catch (error) {
    console.error('获取存储大小失败:', error)
    return 0
  }
}

/**
 * 获取限制空间大小（KB）
 * @returns number
 */
export function getStorageLimit(): number {
  try {
    const res = uni.getStorageInfoSync()
    return res.limitSize || 0
  } catch (error) {
    console.error('获取存储限制失败:', error)
    return 0
  }
}

/**
 * 检查存储是否可用
 * @returns boolean
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    uni.setStorageSync(testKey, 'test')
    uni.removeStorageSync(testKey)
    return true
  } catch (error) {
    console.error('存储不可用:', error)
    return false
  }
}

/**
 * 获取存储信息
 * @returns 存储信息对象
 */
export function getStorageInfo(): {
  keys: string[]
  currentSize: number
  limitSize: number
} {
  try {
    const res = uni.getStorageInfoSync()
    return {
      keys: res.keys || [],
      currentSize: res.currentSize || 0,
      limitSize: res.limitSize || 0
    }
  } catch (error) {
    console.error('获取存储信息失败:', error)
    return {
      keys: [],
      currentSize: 0,
      limitSize: 0
    }
  }
}
