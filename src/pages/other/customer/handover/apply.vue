<!-- @ts-nocheck -->
<template>
  <view class="handover-apply-page">
    <view class="form-container">
      <!-- 当前客户信息 -->
      <view class="form-section">
        <view class="section-title">转交客户</view>
        <view class="client-card">
          <view class="client-header">
            <text class="client-name">{{ clientName }}</text>
            <view class="status-tag">
              <text class="status-text">{{ clientStatus }}</text>
            </view>
          </view>
          <view class="client-info-row">
            <text class="info-label">当前经办人：</text>
            <text class="info-value">{{ currentOwner }}</text>
          </view>
        </view>
      </view>

      <!-- 目标经办人 -->
      <view class="form-section">
        <view class="section-title">目标经办人 <text class="required">*</text></view>
        <view class="tip-box">
          <u-icon name="info-circle" size="16" color="#409EFF" />
          <text class="tip-text">请选择客户转交后的新经办人</text>
        </view>
          <UserSelector
            v-model="formData.target_users"
          />
        </view>
        <view class="form-section">
          <view class="section-title">转交方式 <text class="required">*</text></view>
          <view class="mode-options">
            <view
              class="mode-option"
              :class="{ active: formData.transfer_mode === 'append' }"
              @click="formData.transfer_mode = 'append'"
            >
              新增经办人
            </view>
            <view
              class="mode-option"
              :class="{ active: formData.transfer_mode === 'replace' }"
              @click="formData.transfer_mode = 'replace'"
            >
              替换经办人
            </view>
          </view>
        </view>

      <!-- 转交原因 -->
      <view class="form-section">
        <view class="section-title">转交原因 <text class="required">*</text></view>
        <textarea
          v-model="formData.reason"
          class="textarea"
          placeholder="请详细说明转交原因（必填）"
          placeholder-style="color: #C0C4CC"
          :maxlength="500"
        />
        <view class="char-count">{{ formData.reason.length }} / 500</view>
      </view>

      <!-- 备注与附件 -->
      <view class="form-section">
        <view class="section-title">备注与附件</view>
        
        <view class="form-item">
          <text class="label">补充说明</text>
          <textarea
            v-model="formData.remark"
            class="textarea"
            placeholder="选填，可补充其他信息"
            placeholder-style="color: #C0C4CC"
            :maxlength="500"
          />
        </view>

        <view class="form-item">
          <text class="label">相关附件</text>
          <ImageUploader
            v-model="formData.attachments"
            :maxCount="9"
          />
        </view>
      </view>

      <!-- 审批流程说明 -->
      <view class="info-box">
        <u-icon name="info-circle" size="18" color="#E6A23C" />
        <view class="info-content">
          <text class="info-title">审批流程说明</text>
          <text class="info-text">• 同团队转交：团队管理人员审批</text>
          <text class="info-text">• 同分所跨团队：分所管理人员审批</text>
          <text class="info-text">• 跨分所转交：总所管理人员审批</text>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer-actions">
      <view class="btn cancel-btn" @click="handleCancel">
        <text class="btn-text">取消</text>
      </view>
      <view class="btn submit-btn" @click="handleSubmit">
        <text class="btn-text">提交申请</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UserSelector from '@/components/UserSelector/index.vue'
import ImageUploader from '@/components/ImageUploader/index.vue'
import { applyHandover } from '@/api/client'

const clientId = ref<number | string>('')
const clientName = ref('客户名称')
const clientStatus = ref('跟进中')
const currentOwner = ref('')

  const formData = ref({
    target_users: [] as any[],
    transfer_mode: 'append',
    reason: '',
    remark: '',
    attachments: [] as string[]
  })

function decodeParam(value?: string) {
  if (!value) return ''
  try {
    return decodeURIComponent(value)
  } catch (error) {
    return value
  }
}

onLoad((options: any) => {
  if (options?.clientId) {
    clientId.value = options.clientId
    clientName.value = decodeParam(options.clientName) || '客户名称'
    clientStatus.value = decodeParam(options.clientStatus) || '跟进中'
    currentOwner.value = decodeParam(options.currentOwner || options.owner_user_name) || ''
  }
})

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
    if (formData.value.target_users.length === 0) {
      uni.showToast({
        title: '请选择目标经办人',
        icon: 'none'
    })
    return
  }

  if (!formData.value.reason.trim()) {
    uni.showToast({
      title: '请填写转交原因',
      icon: 'none'
    })
    return
  }

  if (formData.value.reason.trim().length < 10) {
    uni.showToast({
      title: '转交原因至少10个字',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({ title: '提交中...' })

      const submitData = {
        client_id: clientId.value,
        to_owner_ids: formData.value.target_users.map((item: any) => item.id),
        transfer_mode: formData.value.transfer_mode,
        reason: formData.value.reason.trim(),
        remark: formData.value.remark.trim(),
        attachments: formData.value.attachments
      }

    // 调用 API
    await applyHandover(submitData)

    uni.hideLoading()
    uni.showToast({
      title: '申请已提交',
      icon: 'success'
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)

  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none'
    })
    console.error('提交失败:', error)
  }
}
</script>

<style scoped lang="scss">
.handover-apply-page {
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

.mode-options {
  display: flex;
  gap: 16rpx;
}

.mode-option {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  background: #f5f6f8;
  border-radius: 10rpx;
  font-size: 26rpx;
  color: #606266;
}

.mode-option.active {
  background: #667eea;
  color: #fff;
}

.required {
  color: #F56C6C;
  margin-left: 4rpx;
}

.client-card {
  padding: 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12rpx;
  box-sizing: border-box;
}

.client-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.client-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
}

.status-tag {
  padding: 8rpx 20rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
}

.status-text {
  font-size: 24rpx;
  color: #fff;
}

.client-info-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.info-label {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.info-value {
  font-size: 26rpx;
  color: #fff;
  font-weight: 500;
}

.tip-box {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 24rpx;
  padding: 20rpx;
  background: #F0F9FF;
  border-radius: 8rpx;
  border-left: 4rpx solid #409EFF;
  box-sizing: border-box;
  width: 100%;
}

.tip-text {
  flex: 1;
  font-size: 24rpx;
  color: #409EFF;
  line-height: 1.6;
  word-break: break-word;
}

.form-item {
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  display: block;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #303133;
}

.textarea {
  width: 100%;
  min-height: 200rpx;
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
  background: #FFF7E6;
  border-radius: 8rpx;
  border-left: 4rpx solid #E6A23C;
  box-sizing: border-box;
  width: 100%;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #E6A23C;
  margin-bottom: 8rpx;
}

.info-text {
  font-size: 24rpx;
  color: #E6A23C;
  line-height: 1.6;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .btn-text {
    color: #fff;
  }
}

.btn-text {
  font-size: 28rpx;
  font-weight: 500;
}
</style>
