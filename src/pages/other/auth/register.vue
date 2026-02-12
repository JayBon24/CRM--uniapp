<template>
  <view class="auth-container">
    <view class="auth-content">
      <!-- 注册标题 -->
      <view class="auth-header">
        <text class="title">注册账号</text>
        <text class="subtitle">Law Smart Link CRM</text>
      </view>

      <!-- 注册表单 -->
      <view class="auth-form">
        <!-- 手机号输入 -->
        <view class="form-item">
          <u-input v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" :border="false"
            @change="validatePhone">
            <template #prefix>
              <u-icon name="phone" size="20" color="#666"></u-icon>
            </template>
          </u-input>
        </view>

        <!-- 验证码输入 -->
        <view class="form-item code-item">
          <u-input v-model="code" type="number" maxlength="6" placeholder="请输入验证码" :border="false">
            <template #prefix>
              <u-icon name="lock" size="20" color="#666"></u-icon>
            </template>
          </u-input>
          <view class="send-code-btn">
            <u-button @click="handleSendCode" type="primary" size="small"
              :text="counting ? `${countdown}秒后重发` : '获取验证码'"></u-button>
          </view>
        </view>

        <!-- 密码输入 -->
        <view class="form-item">
          <u-input v-model="password" type="password" :password-icon="true" maxlength="20" placeholder="请输入密码"
            :border="false">
            <template #prefix>
              <u-icon name="lock" size="20" color="#666"></u-icon>
            </template>
          </u-input>
        </view>

        <!-- 注册按钮 -->
        <u-button type="primary" @click="handleRegister" text="注册" class="submit-btn"></u-button>

        <!-- 用户协议 -->
        <view class="agreement">
          <u-checkbox shape="square" size="18" name="agree" usedAlone v-model:checked="agreed"
            @change="handleAgreementChange" />
          <text class="agreement-text">
            我已阅读并同意
            <text class="link" @click="goToAgreement('user')">《用户协议》</text>
            和
            <text class="link" @click="goToAgreement('privacy')">《隐私政策》</text>
          </text>
        </view>
      </view>

      <!-- 已有账号引导 -->
      <view class="auth-tip">
        <text>已有账号？</text>
        <text class="link" @click="goToLogin">去登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { goBack, goBackToBeforeLogin } from '@/utils/global'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const password = ref('')
const agreed = ref(false)
const isValidPhone = ref(false)

// 验证码倒计时相关
const counting = ref(false)
const countdown = ref(60)
let timer: number | null = null

// 是否可以发送验证码
const canSendCode = computed(() => isValidPhone.value && !counting.value)

// 验证手机号
function validatePhone(value: string) {
  isValidPhone.value = /^1[3-9]\d{9}$/.test(value)
}

// 发送验证码处理
async function handleSendCode() {
  // 如果正在倒计时，不允许发送
  if (counting.value) {
    return
  }

  // 验证手机号
  if (!isValidPhone.value) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }

  const result = await userStore.sendSmsCode({ phone: phone.value, type: 'register' })
  uni.showToast({
    title: result.message,
    icon: result.success ? 'success' : 'none',
    duration: 2000
  })

  if (result.success) {
    startCountdown()
  }
}

// 开始倒计时
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

// 停止倒计时
function stopCountdown() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  counting.value = false
  countdown.value = 60
}

// 处理协议勾选
function handleAgreementChange(value: boolean) {
  agreed.value = value
}

// 注册处理函数
async function handleRegister() {
  if (!isValidPhone.value) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!code.value || code.value.length !== 6) {
    uni.showToast({ title: '请输入6位验证码', icon: 'none' })
    return
  }
  if (!password.value || password.value.length < 6) {
    uni.showToast({ title: '请输入至少6位密码', icon: 'none' })
    return
  }
  if (!agreed.value) {
    uni.showToast({ title: '请阅读并同意用户协议', icon: 'none' })
    return
  }

  const result = await userStore.userRegister({
    phone: phone.value,
    password: password.value,
    username: phone.value,
    code: code.value
  })

  if (result.success) {
    uni.showToast({ title: result.message, icon: 'none' })
    setTimeout(() => { goBackToBeforeLogin() }, 1500)
  } else {
    uni.showToast({ title: result.message, icon: 'none' })
  }
}

// 查看协议
function goToAgreement(type: 'user' | 'privacy') {
  const url = type === 'user' ? '/pages/agreement/user' : '/pages/agreement/privacy'
  uni.navigateTo({ url })
}

// 去登录页
function goToLogin() {
  uni.navigateTo({ url: '/pages/other/auth/login' })
}

// 返回上一页
function handleBack() {
  goBack()
}

// 组件销毁时清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="scss" scoped>
.auth-container {
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

.auth-content {
  width: 100%;
}

.auth-header {
  text-align: center;
  margin-bottom: 40rpx;

  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 16rpx;
    display: block;
  }

  .subtitle {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.auth-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 40rpx 32rpx;

  .form-item {
    background-color: #f7f8fa;
    border-radius: 16rpx;
    padding: 20rpx 30rpx;
    margin-bottom: 30rpx;

    &.code-item {
      display: flex;
      align-items: center;
      gap: 20rpx;

      .send-code-btn {
        flex-shrink: 0;
        width: 200rpx !important;
        font-size: 24rpx !important;
      }
    }
  }

  .submit-btn {
    margin-top: 20rpx;
    height: 90rpx !important;
    border-radius: 45rpx !important;
    font-size: 32rpx !important;
  }
}

.agreement {
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  .agreement-text {
    font-size: 24rpx;
    color: #6b7280;
    margin-left: 8rpx;
  }

  .link {
    color: #2a6df5;
    padding: 0 4rpx;
  }
}

.auth-tip {
  margin-top: 28rpx;
  text-align: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);

  .link {
    color: #fff;
    margin-left: 10rpx;
    font-weight: 500;
  }
}
</style>
