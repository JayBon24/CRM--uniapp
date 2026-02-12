<template>
  <view class="page-container">
    <!-- 设置列表 -->
    <scroll-view class="content" scroll-y>
      <view class="list-container">
        <!-- 提醒偏好：仅提前量设置（15/30） -->
        <view class="form-section">
          <view class="section-title">提醒设置</view>
          <view class="form">
            <view class="form-item" @click="pickAdvance">
              <text class="label">提前量</text>
              <view class="right-inline">
                <text class="value">{{ advanceMinutes }} 分钟</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view class="form-item tip-item">
              <text class="tip">说明：一期仅保留 15/30 分钟，渠道选择已隐藏。</text>
            </view>
          </view>
        </view>

        <!-- 其他设置 -->
        <view class="form-section">
          <view class="section-title">其他</view>
          <view class="form">
            <view class="form-item">
              <text class="label">清除缓存</text>
              <view class="button-wrapper-100">
                <u-button @click="clearCache" type="warning" size="mini" text="清除"/>
              </view>
            </view>
            <view class="form-item" @click="goAgreement">
              <text class="label">用户协议</text>
              <text class="arrow">›</text>
            </view>
            <view class="form-item" @click="goPrivacy">
              <text class="label">隐私政策</text>
              <text class="arrow">›</text>
            </view>
          </view>
        </view>

        <!-- 开发者（仅 Mock 环境显示） -->
        <view v-if="env.useMock" class="form-section">
          <view class="section-title">开发者</view>
          <view class="form">
            <view class="form-item">
              <text class="label">当前角色</text>
              <text style="color:#606266;">{{ devRoleLabel() }}</text>
              <view class="button-wrapper-100">
                <u-button @click="changeDevRole" type="primary" size="mini" text="切换"/>
              </view>
            </view>
          </view>
        </view>

        <!-- 退出登录 -->
        <view class="form-section logout-section">
          <view class="form">
            <view class="form-item logout-item">
              <u-button @click="handleLogout" type="error" size="large" text="退出登录" style="width: 100%;"/>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { getEnvConfig } from '@/config/env'
import { getReminderPreference, setReminderPreference } from '@/api/mine'

// 用户状态管理
const userStore = useUserStore()
const env = getEnvConfig()

const advanceMinutes = ref(15)

const loadAdvance = async () => {
  try {
    const res = await getReminderPreference()
    advanceMinutes.value = Number(res.default_remind_advance_minutes) === 30 ? 30 : 15
  } catch (e) {
    // ignore
  }
}
loadAdvance()

// 开发者：Mock 角色切换（仅 Mock 环境显示）
const devRoleLabel = () => {
  const map: Record<string, string> = { SALES: '销售', TEAM: '团队管理', BRANCH: '分所管理', HQ: '总所管理' }
  return map[userStore.roleLevel] || userStore.roleLevel || '-'
}

const changeDevRole = () => {
  const roles = [
    { value: 'SALES', label: '销售' },
    { value: 'TEAM', label: '团队管理' },
    { value: 'BRANCH', label: '分所管理' },
    { value: 'HQ', label: '总所管理' },
  ]
  uni.showActionSheet({
    itemList: roles.map(r => r.label),
    success: (res) => {
      const picked = roles[res.tapIndex]
      userStore.setDevRoleLevel(picked.value as any)
      uni.showToast({ title: `已切换为${picked.label}`, icon: 'none' })
    }
  })
}

const pickAdvance = () => {
  uni.showActionSheet({
    itemList: ['15分钟', '30分钟'],
    success: async (res) => {
      const v = res.tapIndex === 1 ? 30 : 15
      advanceMinutes.value = v
      await setReminderPreference({ default_remind_advance_minutes: v as any })
      uni.showToast({ title: '已保存', icon: 'none' })
    }
  })
}

// 清除缓存
const clearCache = () => {
  uni.showModal({
    title: '确认清除',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        console.log('清除缓存')
      }
    }
  })
}

const goAgreement = () => uni.navigateTo({ url: '/pages/other/mine/legal/user-agreement' })
const goPrivacy = () => uni.navigateTo({ url: '/pages/other/mine/legal/privacy-policy' })

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？退出后将清除所有登录信息。',
    success: async (res) => {
      if (res.confirm) {
        try {
          // 显示加载提示
          uni.showLoading({
            title: '退出中...'
          })

          // 调用退出登录方法（即使API失败也会清除本地数据）
          await userStore.logOut()

          // 清除本地缓存数据
          try {
            uni.clearStorageSync()
            console.log('本地缓存已清除')
          } catch (e) {
            console.error('清除缓存失败:', e)
          }

          // 隐藏加载提示
          uni.hideLoading()

          // 显示成功提示
          uni.showToast({
            title: '退出成功',
            icon: 'none',
            duration: 2000
          })

          // 跳转到登录页面
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/other/auth/login'
            })
          }, 2000)

        } catch (error) {
          // 隐藏加载提示
          uni.hideLoading()

          // 即使API调用失败，也要清除本地数据并跳转
          console.error('退出登录API失败，但继续清除本地数据:', error)

          // 强制清除用户状态
          userStore.resetState()

          // 清除本地缓存
          try {
            uni.clearStorageSync()
          } catch (e) {
            console.error('清除缓存失败:', e)
          }

          // 显示提示并跳转
          uni.showToast({
            title: '已退出登录',
            icon: 'none',
            duration: 2000
          })

          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/other/auth/login'
            })
          }, 2000)
        }
      }
    }
  })
}
</script>

<style scoped>
@import '@/styles/common.css';

/* 表单区域样式 */
.form-section {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-sizing: border-box;
}

.section-title {
  padding: 30rpx 20rpx 20rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  background-color: #f8f9fa;
  box-sizing: border-box;
}

.form {
  padding: 0 20rpx 20rpx;
  box-sizing: border-box;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  box-sizing: border-box;
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.right-inline {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.value {
  color: #666;
  font-size: 28rpx;
}
.arrow {
  color: #bbb;
  font-size: 34rpx;
}
.tip-item {
  padding-top: 14rpx;
  padding-bottom: 10rpx;
}
.tip {
  color: #999;
  font-size: 24rpx;
}

/* 退出登录按钮样式 */
.logout-section {
  margin-top: 40rpx;
  border: 2rpx solid #ff4757;
  background-color: #fff5f5;
}

.logout-item {
  padding: 40rpx 0;
  border-bottom: none;
}

.logout-item .u-button {
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(255, 71, 87, 0.2);
}
</style>
