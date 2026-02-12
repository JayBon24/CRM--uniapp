<template>
  <view class="container">
    <!-- 主要内容区域 -->
    <view class="content">
      <router-view></router-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

// 应用启动时执行
onLaunch(async () => {
  console.log('App Launch')

  // 检查并执行自动登录
  try {
    const userStore = useUserStore()
    const autoLoginInfo = userStore.getAutoLoginInfo()

    if (autoLoginInfo && !userStore.hasToken) {
      console.log('检测到自动登录信息，开始自动登录...')
      const result = await userStore.executeAutoLogin()

      if (result.success) {
        console.log('自动登录成功')
        // 可以在这里显示自动登录成功的提示
        uni.showToast({
          title: '自动登录成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        console.log('自动登录失败:', result.message)
        // 自动登录失败,跳转到登录页
        uni.reLaunch({
          url: '/pages/other/auth/login'
        })
      }
    } else if (userStore.hasToken) {
      // 如果有token，验证其有效性
      console.log('检测到token，验证有效性...')
      const isValid = await userStore.validateToken()
      if (!isValid) {
        console.log('Token无效，尝试自动登录...')
        const result = await userStore.executeAutoLogin()
        if (!result.success) {
          // 自动登录失败，清除无效token并跳转到登录页
          userStore.logOut()
          uni.reLaunch({
            url: '/pages/other/auth/login'
          })
        }
      }
    } else {
      // 没有token也没有自动登录信息,跳转到登录页
      console.log('没有登录信息，跳转到登录页')
      uni.reLaunch({
        url: '/pages/other/auth/login'
      })
    }
  } catch (error) {
    console.error('自动登录检查失败:', error)
    // 出错时也跳转到登录页
    uni.reLaunch({
      url: '/pages/other/auth/login'
    })
  }
})

// 监听页面显示
onShow(() => {
  console.log('App Show')
})

// 应用隐藏时执行
onHide(() => {
  // 应用隐藏逻辑
})
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */

page {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 28rpx;
  line-height: 1.5;
  color: #333333;
  background-color: #f5f5f5;
  overflow-x: hidden; /* 防止横向溢出，确保页面右边界正常显示 */
}

/* 全局兜底：小程序不支持通配选择器，需显式列出常用节点 */
/* #ifdef MP-WEIXIN */
page, view, text, image, button, input, textarea, scroll-view, swiper, swiper-item, cover-view, cover-image, navigator, rich-text {
  box-sizing: border-box;
}
/* #endif */
/* #ifndef MP-WEIXIN */
*, *::before, *::after {
  box-sizing: border-box;
}
/* #endif */

/* #ifdef H5 */
html, body {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

#app {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

/* uni-app H5 常见容器（不同版本类名可能不同，做兜底） */
.uni-app, .uni-app__container, .uni-page-wrapper, .uni-page-body, uni-page-body {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
/* #endif */

/* 通用样式 */
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 导航栏样式 */
.uni-navbar {
  background-color: #ffffff !important;
}

.uni-navbar__header {
  background-color: #ffffff !important;
}

.uni-navbar__header-btns-left {
  color: #333333 !important;
}

.uni-navbar-btn-text {
  color: #333333 !important;
}

/* 状态栏样式 */
.uni-status-bar {
  background-color: #ffffff;
}
</style>
