import { useUserStore } from '@/stores/user'

/**
 * 权限验证工具
 * 兼容微信小程序环境
 */

// Token 管理
export function getToken(): string {
  return uni.getStorageSync('token') || ''
}

export function setToken(token: string) {
  uni.setStorageSync('token', token)
}

export function removeToken() {
  uni.removeStorageSync('token')
}

/**
 * 内部权限验证函数
 * @param permission 权限标识
 * @returns 是否有权限
 */
function authPermission(permission: string): boolean {
  try {
    const userStore = useUserStore()
    const permissions = userStore.permissions || []
    const all_permission = "*:*:*"

    return permissions.some(p => p === all_permission || p === permission)
  } catch (error) {
    console.error('权限验证错误:', error)
    return false
  }
}

/**
 * 权限验证工具对象
 * 提供多种权限验证方法
 */
export default {
  /**
   * 验证单个权限
   * @param permission 权限标识
   * @returns 是否有权限
   */
  hasPermi(permission: string): boolean {
    return authPermission(permission)
  },

  /**
   * 验证多个权限（或关系）
   * @param permissions 权限标识数组
   * @returns 是否有任一权限
   */
  hasPermiOr(permissions: string[]): boolean {
    try {
      return permissions.some(permission => authPermission(permission))
    } catch (error) {
      console.error('权限验证错误:', error)
      return false
    }
  },

  /**
   * 验证多个权限（且关系）
   * @param permissions 权限标识数组
   * @returns 是否同时具备所有权限
   */
  hasPermiAnd(permissions: string[]): boolean {
    try {
      return permissions.every(permission => authPermission(permission))
    } catch (error) {
      console.error('权限验证错误:', error)
      return false
    }
  },

  /**
   * 获取用户权限列表
   * @returns 权限列表
   */
  getUserPermissions(): string[] {
    try {
      const userStore = useUserStore()
      return userStore.permissions || []
    } catch (error) {
      console.error('获取用户权限错误:', error)
      return []
    }
  },

  /**
   * 检查用户是否已登录
   * @returns 是否已登录
   */
  isLoggedIn(): boolean {
    try {
      const userStore = useUserStore()
      return userStore.hasToken
    } catch (error) {
      console.error('检查登录状态错误:', error)
      return false
    }
  }
}
