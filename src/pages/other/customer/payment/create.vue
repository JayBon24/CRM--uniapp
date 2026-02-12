<!-- @ts-nocheck -->
<template>
  <view class="payment-create-page">
    <view class="form-container">
      <!-- 回款时间 -->
      <view class="form-section">
        <view class="section-title">回款时间 <text class="required">*</text></view>
        <view class="datetime-picker" @click="showPaymentTimePicker = true">
          <text v-if="formData.payment_time" class="datetime-text">{{ formattedPaymentTime }}</text>
          <text v-else class="placeholder">请选择回款时间</text>
          <SvgIcon name="calendar" :size="32" color="#909399" />
        </view>
      </view>

      <!-- 回款金额 -->
      <view class="form-section">
        <view class="section-title">回款金额（元）<text class="required">*</text></view>
        <view class="amount-input-wrapper">
          <text class="currency-symbol">¥</text>
          <input
            v-model="formData.amount"
            class="amount-input"
            type="digit"
            placeholder="请输入回款金额"
            placeholder-style="color: #C0C4CC"
          />
        </view>
      </view>

      <!-- 催收类别 -->
      <view class="form-section">
        <view class="section-title">催收类别 <text class="required">*</text></view>
        <view class="radio-group">
          <view
            v-for="category in collectionCategories"
            :key="category.value"
            class="radio-item"
            :class="{ active: formData.collection_category === category.value }"
            @click="formData.collection_category = category.value"
          >
            <view class="radio-circle">
              <view v-if="formData.collection_category === category.value" class="radio-dot" />
            </view>
            <text class="radio-label">{{ category.label }}</text>
          </view>
        </view>
      </view>

      <!-- 回款凭证 -->
      <view class="form-section">
        <view class="section-title">
          回款凭证
          <text class="tip-text">（建议上传）</text>
        </view>
        <view class="tip-box">
          <u-icon name="info-circle" size="16" color="#E6A23C" />
          <text class="tip-text">可上传银行转账记录、收据等凭证</text>
        </view>
        <ImageUploader
          v-model="formData.attachments"
          :maxCount="9"
        />
      </view>

      <!-- 备注 -->
      <view class="form-section">
        <view class="section-title">备注</view>
        <textarea
          v-model="formData.remark"
          class="textarea"
          placeholder="选填，可补充其他信息"
          placeholder-style="color: #C0C4CC"
          :maxlength="500"
        />
        <view class="char-count">{{ formData.remark.length }} / 500</view>
      </view>

      <!-- 提示信息 -->
      <view class="info-box">
        <u-icon name="info-circle" size="18" color="#67C23A" />
        <text class="info-text">保存后客户状态将变更为"回款"，支持录入多笔回款记录</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer-actions">
      <view class="btn cancel-btn" @click="handleCancel">
        <text class="btn-text">取消</text>
      </view>
      <view class="btn submit-btn" @click="handleSubmit">
        <text class="btn-text">保存回款</text>
      </view>
    </view>

    <!-- 时间选择器 -->
    <u-datetime-picker
      v-model:show="showPaymentTimePicker"
      v-model="paymentTimeValue"
      mode="datetime"
      :maxDate="Date.now()"
      @confirm="onPaymentTimeConfirm"
      @cancel="showPaymentTimePicker = false"
      @close="showPaymentTimePicker = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ImageUploader from '@/components/ImageUploader/index.vue'
import { createPayment } from '@/api/client'
import dayjs from 'dayjs'

const clientId = ref<number | string>('')
const clientName = ref('客户名称')

const formData = ref({
  payment_time: '',
  amount: '',
  collection_category: 'arbitration' as string,
  attachments: [] as string[],
  remark: ''
})

// 催收类别选项
const collectionCategories = [
  { value: 'arbitration', label: '仲裁' },
  { value: 'mediation', label: '调解' },
  { value: 'litigation', label: '诉讼' }
]

// 时间选择器相关
const showPaymentTimePicker = ref(false)
const paymentTimeValue = ref(Date.now())

// 格式化回款时间
const formattedPaymentTime = computed(() => {
  if (!formData.value.payment_time) return ''
  return dayjs(formData.value.payment_time).format('YYYY-MM-DD HH:mm')
})

onLoad((options: any) => {
  if (options?.clientId) {
    clientId.value = options.clientId
    clientName.value = options.clientName || '客户名称'
  }
})

// 回款时间确认
function onPaymentTimeConfirm(value: any) {
  const formattedTime = dayjs(value.value || value).format('YYYY-MM-DD HH:mm:ss')
  formData.value.payment_time = formattedTime
  showPaymentTimePicker.value = false
}

// 取消
function handleCancel() {
  uni.showModal({
    title: '确认取消',
    content: '当前填写的内容将不会保存',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    }
  })
}

// 提交
async function handleSubmit() {
  // 表单验证
  if (!formData.value.payment_time) {
    uni.showToast({
      title: '请选择回款时间',
      icon: 'none'
    })
    return
  }

  if (!formData.value.amount || parseFloat(formData.value.amount) <= 0) {
    uni.showToast({
      title: '请输入正确的回款金额',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({ title: '保存中...' })

    const submitData = {
      client_id: clientId.value,
      payment_time: formData.value.payment_time,
      amount: parseFloat(formData.value.amount),
      collection_category: formData.value.collection_category,
      attachments: formData.value.attachments,
      remark: formData.value.remark.trim()
    }

    // 调用 API（实际项目中）
    console.log('保存回款记录:', submitData)
    await createPayment(submitData as any)

    uni.hideLoading()
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)

  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '保存失败，请重试',
      icon: 'none'
    })
    console.error('保存失败:', error)
  }
}
</script>

<style scoped lang="scss">
.payment-create-page {
  min-height: 100vh;
  background: #F5F7FA;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.form-container {
  flex: 1;
  padding: 24rpx;
  padding-bottom: calc(220rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(220rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
}

.form-section {
  margin-bottom: 32rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: 12rpx;
  box-sizing: border-box;
  width: 100%;
}

.section-title {
  display: block;
  margin-bottom: 24rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #303133;
}

.required {
  color: #F56C6C;
  margin-left: 4rpx;
}

.tip-text {
  font-size: 24rpx;
  font-weight: 400;
  color: #909399;
  margin-left: 8rpx;
}

.datetime-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  border: 1rpx solid transparent;
  box-sizing: border-box;

  &:active {
    border-color: #667eea;
  }
}

.datetime-text {
  font-size: 28rpx;
  color: #303133;
}

.placeholder {
  font-size: 28rpx;
  color: #C0C4CC;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  border: 1rpx solid transparent;
  box-sizing: border-box;

  &:focus-within {
    border-color: #67C23A;
    background: #fff;
  }
}

.currency-symbol {
  font-size: 32rpx;
  font-weight: 600;
  color: #67C23A;
  margin-right: 12rpx;
}

.amount-input {
  flex: 1;
  height: 72rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
  background: transparent;
  border: none;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  border: 1rpx solid transparent;
  box-sizing: border-box;

  &.active {
    background: #F0F9FF;
    border-color: #67C23A;
  }
}

.radio-circle {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #DCDFE6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  .radio-item.active & {
    border-color: #67C23A;
  }
}

.radio-dot {
  width: 16rpx;
  height: 16rpx;
  background: #67C23A;
  border-radius: 50%;
}

.radio-label {
  font-size: 26rpx;
  color: #606266;

  .radio-item.active & {
    color: #67C23A;
    font-weight: 500;
  }
}

.tip-box {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 24rpx;
  padding: 20rpx;
  background: #FFF7E6;
  border-radius: 8rpx;
  border-left: 4rpx solid #E6A23C;
  box-sizing: border-box;
  width: 100%;
}

.tip-text {
  flex: 1;
  font-size: 24rpx;
  color: #E6A23C;
  line-height: 1.6;
  word-break: break-word;
}

.textarea {
  width: 100%;
  min-height: 150rpx;
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #303133;
  line-height: 1.6;
  border: 1rpx solid transparent;
  box-sizing: border-box;

  &:focus {
    border-color: #667eea;
    background: #fff;
  }
}

.char-count {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #909399;
  text-align: right;
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 24rpx;
  background: #F0F9FF;
  border-radius: 8rpx;
  border-left: 4rpx solid #67C23A;
  box-sizing: border-box;
  width: 100%;
}

.info-text {
  flex: 1;
  font-size: 26rpx;
  color: #67C23A;
  line-height: 1.6;
  word-break: break-word;
}

.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #EBEEF5;
  box-sizing: border-box;
  z-index: 1200;
}

.btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
}

.cancel-btn {
  background: #F5F7FA;
  
  .btn-text {
    color: #606266;
  }
}

.submit-btn {
  background: linear-gradient(135deg, #67C23A 0%, #85CE61 100%);
  
  .btn-text {
    color: #fff;
  }
}

.btn-text {
  font-size: 28rpx;
  font-weight: 500;
}
</style>
