/**
 * Token 调试工具
 * 在浏览器控制台运行以下代码来检查 token 状态
 */

export function debugToken() {
  console.log('=== Token 调试信息 ===')
  
  // 1. 检查 localStorage
  const token = uni.getStorageSync('token')
  console.log('1. Storage 中的 token:', token ? `${token.substring(0, 20)}...` : '无')
  
  // 2. 检查 Pinia store
  try {
    const { useUserStore } = require('@/stores/user')
    const userStore = useUserStore()
    console.log('2. Pinia store 中的 token:', userStore.token ? `${userStore.token.substring(0, 20)}...` : '无')
    console.log('3. 用户信息:', {
      id: userStore.id,
      name: userStore.name,
      nickName: userStore.nickName
    })
  } catch (e) {
    console.error('无法访问 Pinia store:', e)
  }
  
  console.log('===================')
}

// 在浏览器控制台运行: debugToken()
if (typeof window !== 'undefined') {
  (window as any).debugToken = debugToken
}
