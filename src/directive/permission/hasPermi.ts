import { useUserStore } from '@/stores/user'

/**
 * 操作权限指令
 * 用于控制按钮等元素的显示/隐藏
 */
export default {
  mounted(el: any, binding: any) {
    try {
      const { value } = binding
      const all_permission = "*:*:*"
      const userStore = useUserStore()
      const permissions = userStore.permissions || []

      if (value && Array.isArray(value) && value.length > 0) {
        const permissionFlag = value

        const hasPermissions = permissions.some(permission => {
          return all_permission === permission || permissionFlag.includes(permission)
        })

        if (!hasPermissions) {
          // 隐藏元素而不是移除
          if (el && el.style) {
            el.style.display = 'none'
          }
        }
      } else {
        console.warn('权限指令使用错误：请传入权限数组')
      }
    } catch (error) {
      console.error('权限指令执行错误:', error)
    }
  }
}
