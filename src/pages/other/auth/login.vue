<template>
  <view class="login-container">
    <view class="login-spacer"></view>
    <view class="login-content">
      <view class="logo-section">
        <view class="logo-wrapper">
          <image class="logo" :src="logoUrl" mode="aspectFit"></image>
        </view>
        <text class="company-name">万方律师事务所</text>
        <text class="company-slogan">专业 · 高效 · 值得信赖</text>
      </view>

      <view class="login-header">
        <text class="title">欢迎登录</text>
        <text class="subtitle">Law Smart Link CRM</text>
      </view>

      <view class="login-tabs">
        <view class="tab-item" :class="{ active: loginType === 'password' }" @click="loginType = 'password'">
          密码登录
        </view>
        <view class="tab-item" :class="{ active: loginType === 'code' }" @click="loginType = 'code'">
          验证码登录
        </view>
      </view>

      <view class="login-form">
        <view class="form-item">
          <u-input
            v-model="account"
            placeholder="请输入用户名或手机号"
            :border="false"
            clearable
            @change="validateAccount"
          >
            <template #prefix>
              <SvgIcon name="user" :size="28" color="#666" />
            </template>
          </u-input>
        </view>

        <template v-if="loginType === 'password'">
          <view class="form-item password-item">
            <u-input
              v-model="password"
              password
              placeholder="请输入密码"
              :border="false"
            >
              <template #prefix>
                <SvgIcon name="lock" :size="28" color="#666" />
              </template>
            </u-input>
          </view>
        </template>

        <template v-else>
          <view class="form-item code-item">
            <u-input v-model="code" type="number" maxlength="6" placeholder="请输入验证码" :border="false">
              <template #prefix>
                <SvgIcon name="lock" :size="28" color="#666" />
              </template>
            </u-input>
            <view class="send-code-btn">
              <u-button size="small" type="primary" @click="handleSendCode" :text="counting ? `${countdown}秒后重发` : '获取验证码'"></u-button>
            </view>
          </view>
        </template>

        <u-button
          type="primary"
          @click="handleLogin"
          :loading="loading"
          :disabled="loading"
          text="登录"
          class="submit-btn"
        ></u-button>
      </view>

      <view class="register-tip">
        <text>没有账号？</text>
        <text class="register-link" @click="goToRegister">去注册</text>
      </view>

      <view class="wechat-login-section">
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">或</text>
          <view class="divider-line"></view>
        </view>
        <view class="wechat-login-item" @click="handleWechatLogin">
          <view class="wechat-icon-wrapper" :class="{ loading: wechatLogging }">
            <u-loading-icon v-if="wechatLogging" mode="spinner" size="20" color="#07c160"></u-loading-icon>
            <u-icon v-else name="weixin-fill" size="40" color="#07c160"></u-icon>
          </view>
          <text class="wechat-text">微信登录</text>
        </view>
      </view>
    </view>
    <view class="login-spacer"></view>

    <u-popup v-model:show="showBindPhonePopup" mode="bottom" :safe-area-inset-bottom="true" :close-on-click-overlay="true" :z-index="999" round="24">
      <view class="bind-phone-popup">
        <view class="popup-drag-bar"></view>
        <view class="popup-header">
          <text class="popup-header-title">完善信息</text>
          <text class="popup-header-desc">首次登录需要授权手机号完成注册</text>
        </view>

        <!-- #ifdef MP-WEIXIN -->
        <button class="wechat-phone-btn" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
          <text class="wechat-phone-btn-text">一键获取手机号</text>
        </button>
        <!-- #endif -->

        <view class="bind-divider">
          <view class="bind-divider-line"></view>
          <text class="bind-divider-text">或手动输入</text>
          <view class="bind-divider-line"></view>
        </view>

        <view class="popup-form">
          <view class="popup-field">
            <view class="field-icon">
              <u-icon name="phone" size="26" color="#667eea"></u-icon>
            </view>
            <view class="field-input-wrap">
              <input v-model="bindPhone" placeholder="请输入手机号" type="number" maxlength="11" class="field-input" />
            </view>
          </view>

          <view class="popup-field">
            <view class="field-icon">
              <u-icon name="lock" size="26" color="#667eea"></u-icon>
            </view>
            <view class="field-input-wrap">
              <input v-model="bindCode" placeholder="请输入验证码" type="number" maxlength="6" class="field-input" />
            </view>
            <view class="code-btn" :class="{ disabled: bindCodeCountdown > 0 || !isValidBindPhone }" @click="sendBindSmsCode">
              {{ bindCodeCountdown > 0 ? bindCodeCountdown + 's' : '获取验证码' }}
            </view>
          </view>
        </view>

        <view class="popup-btn-area">
          <view class="popup-btn cancel-btn" @click="closeBindPhonePopup">取消</view>
          <view class="popup-btn confirm-btn" :class="{ disabled: !canConfirmBind }" @click="confirmBindPhone">确认绑定</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import SvgIcon from '@/components/SvgIcon/index.vue'

const userStore = useUserStore()

const loginType = ref<'password' | 'code'>('password')
const account = ref('')
const password = ref('')
const code = ref('')
const loading = ref(false)
const wechatLogging = ref(false)

const counting = ref(false)
const countdown = ref(60)
let timer: number | null = null

const showBindPhonePopup = ref(false)
const bindPhone = ref('')
const bindCode = ref('')
const bindCodeCountdown = ref(0)
let bindCodeTimer: number | null = null
const pendingWechatInfo = ref<{ openid?: string; unionid?: string } | null>(null)
const pendingWechatUserInfo = ref<{ nickName?: string; avatarUrl?: string } | null>(null)

const isPhoneNumber = computed(() => /^1[3-9]\d{9}$/.test(account.value))
const isValidAccount = ref(false)
const isValidBindPhone = computed(() => /^1[3-9]\d{9}$/.test(bindPhone.value))
const canConfirmBind = computed(() => isValidBindPhone.value && bindCode.value.length === 6)

const logoUrl = (() => {
  // #ifdef MP-WEIXIN
  return '/pages/other/static/logo.png'
  // #endif
  // #ifndef MP-WEIXIN
  return '/static/logo.png'
  // #endif
})()

function validateAccount(value: string) {
  const phoneOk = /^1[3-9]\d{9}$/.test(value)
  if (loginType.value === 'code') {
    isValidAccount.value = phoneOk
  } else {
    isValidAccount.value = !!value && (phoneOk || value.length >= 3)
  }
}

function normalizeWechatUserInfo(userInfo: any) {
  const nickName = typeof userInfo?.nickName === 'string' ? userInfo.nickName.trim() : ''
  const avatarUrl = typeof userInfo?.avatarUrl === 'string' ? userInfo.avatarUrl.trim() : ''
  return {
    nickName: nickName || '',
    avatarUrl: avatarUrl || ''
  }
}

async function getWechatUserInfo() {
  // #ifdef MP-WEIXIN
  try {
    const profileRes: any = await new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: '用于完善账号资料',
        success: resolve,
        fail: reject
      })
    })
    return normalizeWechatUserInfo(profileRes?.userInfo || {})
  } catch (error) {
    return { nickName: '', avatarUrl: '' }
  }
  // #endif

  // #ifndef MP-WEIXIN
  return { nickName: '', avatarUrl: '' }
  // #endif
}

async function handleSendCode() {
  if (counting.value) return
  if (!isPhoneNumber.value) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  const result = await userStore.sendSmsCode({ phone: account.value, type: 'login' })
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
  if (result.success) {
    startCountdown()
  }
}

function startCountdown() {
  counting.value = true
  countdown.value = 60
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      stopCountdown()
    }
  }, 1000)
}

function stopCountdown() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  counting.value = false
  countdown.value = 60
}

async function handleLogin() {
  validateAccount(account.value)
  if (!isValidAccount.value) {
    const msg = loginType.value === 'password' ? '请输入正确的手机号或用户名' : '请输入正确的手机号'
    uni.showToast({ title: msg, icon: 'none' })
    return
  }

  loading.value = true
  try {
    if (loginType.value === 'password') {
      if (password.value.length < 6) {
        uni.showToast({ title: '密码至少6位', icon: 'none' })
        return
      }
      const result = await userStore.loginWithPassword({ phone: account.value, password: password.value })
      if (result.success) {
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.switchTab({ url: '/pages/tab/customers' })
        }, 1500)
      } else {
        uni.showToast({ title: result.message || '登录失败', icon: 'none' })
      }
    } else {
      if (code.value.length !== 6) {
        uni.showToast({ title: '请输入6位验证码', icon: 'none' })
        return
      }
      const result = await userStore.loginWithCode({ phone: account.value, smsCode: code.value })
      if (result.success) {
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.switchTab({ url: '/pages/tab/customers' })
        }, 1500)
      } else {
        uni.showToast({ title: result.message || '登录失败', icon: 'none' })
      }
    }
  } finally {
    loading.value = false
  }
}

async function handleWechatLogin() {
  wechatLogging.value = true
  try {
    // #ifdef MP-WEIXIN
    pendingWechatUserInfo.value = await getWechatUserInfo()
    const loginResult = await uni.login({ provider: 'weixin' })
    if (!loginResult.code) {
      uni.showToast({ title: '获取微信登录凭证失败', icon: 'none' })
      return
    }
    const checkResult = await userStore.wechatLoginCheck({ code: loginResult.code })
    if (checkResult.success && !checkResult.data?.needRegister) {
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        uni.switchTab({ url: '/pages/tab/customers' })
      }, 1500)
      return
    }
    if (checkResult.data?.needRegister) {
      pendingWechatInfo.value = { openid: checkResult.data?.openid, unionid: checkResult.data?.unionid }
      showBindPhonePopup.value = true
      return
    }
    uni.showToast({ title: checkResult.message || '登录失败', icon: 'none' })
    // #endif

    // #ifndef MP-WEIXIN
    uni.showToast({ title: '当前环境不支持微信登录', icon: 'none' })
    // #endif
  } catch (error: any) {
    uni.showToast({ title: error.message || '微信登录失败', icon: 'none' })
  } finally {
    wechatLogging.value = false
  }
}

function closeBindPhonePopup() {
  showBindPhonePopup.value = false
  bindPhone.value = ''
  bindCode.value = ''
  pendingWechatInfo.value = null
  if (bindCodeTimer) {
    clearInterval(bindCodeTimer)
    bindCodeTimer = null
  }
  bindCodeCountdown.value = 0
  pendingWechatUserInfo.value = null
}

async function onGetPhoneNumber(e: any) {
  const detail = e?.detail || {}
  if (detail.errMsg && detail.errMsg.includes('deny')) {
    uni.showToast({ title: '您已取消授权', icon: 'none' })
    return
  }
  if (!detail.encryptedData || !detail.iv) {
    uni.showToast({ title: '获取手机号失败，请手动输入', icon: 'none' })
    return
  }
  if (!pendingWechatInfo.value) {
    uni.showToast({ title: '微信授权信息已过期，请重新登录', icon: 'none' })
    closeBindPhonePopup()
    return
  }
  wechatLogging.value = true
  try {
    const registerResult = await userStore.wechatRegister({
      openid: pendingWechatInfo.value.openid!,
      unionid: pendingWechatInfo.value.unionid,
      encryptedData: detail.encryptedData,
      iv: detail.iv,
      userInfo: pendingWechatUserInfo.value || {}
    })
    if (registerResult.success) {
      closeBindPhonePopup()
      uni.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => {
        uni.switchTab({ url: '/pages/tab/customers' })
      }, 1500)
    } else {
      uni.showToast({ title: registerResult.message || '注册失败', icon: 'none' })
    }
  } finally {
    wechatLogging.value = false
  }
}

async function sendBindSmsCode() {
  if (bindCodeCountdown.value > 0) return
  if (!isValidBindPhone.value) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  const result = await userStore.sendSmsCode({ phone: bindPhone.value, type: 'bind_phone' })
  uni.showToast({ title: result.message, icon: result.success ? 'success' : 'none' })
  if (result.success) {
    bindCodeCountdown.value = 60
    bindCodeTimer = setInterval(() => {
      if (bindCodeCountdown.value > 0) {
        bindCodeCountdown.value--
      } else {
        if (bindCodeTimer) {
          clearInterval(bindCodeTimer)
          bindCodeTimer = null
        }
      }
    }, 1000)
  }
}

async function confirmBindPhone() {
  if (!canConfirmBind.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  if (!pendingWechatInfo.value) {
    uni.showToast({ title: '微信授权信息已过期，请重新登录', icon: 'none' })
    closeBindPhonePopup()
    return
  }
  wechatLogging.value = true
  try {
    const registerResult = await userStore.wechatRegister({
      openid: pendingWechatInfo.value.openid!,
      unionid: pendingWechatInfo.value.unionid,
      phone: bindPhone.value,
      smsCode: bindCode.value,
      userInfo: pendingWechatUserInfo.value || {}
    })
    if (registerResult.success) {
      closeBindPhonePopup()
      uni.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => {
        uni.switchTab({ url: '/pages/tab/customers' })
      }, 1500)
    } else {
      uni.showToast({ title: registerResult.message || '注册失败', icon: 'none' })
    }
  } finally {
    wechatLogging.value = false
  }
}

function goToRegister() {
  uni.navigateTo({ url: '/pages/other/auth/register' })
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (bindCodeTimer) clearInterval(bindCodeTimer)
})
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  height: 100vh;
  padding: calc(env(safe-area-inset-top) + 40rpx) 60rpx calc(env(safe-area-inset-bottom) + 40rpx);
  padding-top: calc(constant(safe-area-inset-top) + 40rpx);
  padding-bottom: calc(constant(safe-area-inset-bottom) + 40rpx);
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.login-spacer {
  flex: 1;
}

.login-content {
  flex-shrink: 0;
  width: 100%;
  max-width: 700rpx;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0;
  transform: translateY(60rpx);
}

.logo-section {
  text-align: center;
  margin-bottom: 60rpx;

  .logo-wrapper {
    width: 160rpx;
    height: 160rpx;
    margin: 0 auto 30rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);

    .logo {
      width: 120rpx;
      height: 120rpx;
    }
  }

  .company-name {
    font-size: 48rpx;
    font-weight: bold;
    color: #fff;
    display: block;
    margin-bottom: 16rpx;
    letter-spacing: 4rpx;
  }

  .company-slogan {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 2rpx;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40rpx;

  .title {
    font-size: 44rpx;
    font-weight: 600;
    color: #fff;
    display: block;
    margin-bottom: 16rpx;
  }

  .subtitle {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.login-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 30rpx;

  .tab-item {
    padding: 12rpx 30rpx;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.7);
    border-bottom: 4rpx solid transparent;
    margin: 0 20rpx;
  }

  .tab-item.active {
    color: #fff;
    border-bottom-color: #fff;
  }
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 40rpx 32rpx;

  .form-item {
    background: #f7f8fa;
    border-radius: 16rpx;
    padding: 20rpx 24rpx;
    margin-bottom: 24rpx;
    min-height: 92rpx;
    box-sizing: border-box;
  }

  .code-item {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .send-code-btn {
      flex-shrink: 0;
      width: 200rpx !important;
    }
  }

  .submit-btn {
    margin-top: 20rpx;
    height: 96rpx !important;
    border-radius: 45rpx !important;
    font-size: 32rpx !important;
  }

  :deep(.u-input__content) {
    min-height: 52rpx;
  }
}

.register-tip {
  margin-top: 24rpx;
  text-align: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);

  .register-link {
    color: #fff;
    margin-left: 8rpx;
    font-weight: 600;
  }
}

.wechat-login-section {
  margin-top: 40rpx;
  text-align: center;

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24rpx;

    .divider-line {
      height: 1px;
      width: 120rpx;
      background: rgba(255, 255, 255, 0.4);
    }

    .divider-text {
      color: rgba(255, 255, 255, 0.8);
      font-size: 24rpx;
      margin: 0 16rpx;
    }
  }

  .wechat-login-item {
    display: inline-flex;
    align-items: center;
    gap: 16rpx;
    padding: 14rpx 30rpx;
    border-radius: 40rpx;
    background: rgba(255, 255, 255, 0.12);

    .wechat-text {
      color: #fff;
      font-size: 28rpx;
    }
  }
}

.bind-phone-popup {
  padding: 32rpx;

  .popup-drag-bar {
    width: 80rpx;
    height: 8rpx;
    background: #e5e7eb;
    border-radius: 999rpx;
    margin: 0 auto 16rpx;
  }

  .popup-header-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #111827;
  }

  .popup-header-desc {
    font-size: 24rpx;
    color: #6b7280;
    margin-top: 8rpx;
  }

  .wechat-phone-btn {
    margin: 24rpx 0;
    background: #07c160;
    color: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
  }

  .bind-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16rpx 0;

    .bind-divider-line {
      height: 1px;
      width: 120rpx;
      background: #e5e7eb;
    }

    .bind-divider-text {
      color: #9ca3af;
      font-size: 24rpx;
      margin: 0 16rpx;
    }
  }

  .popup-field {
    display: flex;
    align-items: center;
    gap: 16rpx;
    background: #f7f8fa;
    border-radius: 16rpx;
    padding: 18rpx 20rpx;
    margin-bottom: 16rpx;

    .field-input {
      flex: 1;
      font-size: 28rpx;
    }

    .code-btn {
      font-size: 24rpx;
      color: #2a6df5;
    }

    .code-btn.disabled {
      color: #9ca3af;
    }
  }

  .popup-btn-area {
    display: flex;
    gap: 20rpx;
    margin-top: 10rpx;

    .popup-btn {
      flex: 1;
      text-align: center;
      padding: 18rpx 0;
      border-radius: 16rpx;
      font-size: 28rpx;
    }

    .cancel-btn {
      background: #f3f4f6;
      color: #111827;
    }

    .confirm-btn {
      background: #2a6df5;
      color: #fff;
    }

    .confirm-btn.disabled {
      background: #9ca3af;
    }
  }
}
</style>
