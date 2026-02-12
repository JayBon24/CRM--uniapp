<!-- @ts-nocheck -->
<template>
  <view class="ocr-box">
    <view class="ocr-header">
      <text class="ocr-title">OCR识别</text>
      <text class="ocr-subtitle">拍照/上传名片快速填充</text>
    </view>

    <view class="ocr-actions">
      <view class="ocr-btn" :class="{ disabled: loading }" @click="handleChoose('camera')">拍照识别</view>
      <view class="ocr-btn ghost" :class="{ disabled: loading }" @click="handleChoose('album')">上传识别</view>
    </view>

    <view v-if="loading" class="ocr-loading">
      <u-loading-icon mode="spinner" size="24" />
      <text class="loading-text">识别中...</text>
    </view>

    <view v-if="previewImage" class="preview">
      <image :src="previewImage" mode="aspectFit" class="preview-img"></image>
    </view>

    <view v-if="resultData" class="result-card">
      <view class="result-header">
        <text class="result-title">识别结果</text>
        <view class="result-actions">
          <view class="action-btn ghost" @click="clearResult">重置</view>
          <view class="action-btn" @click="confirmFill">确认填入</view>
        </view>
      </view>

      <view v-if="ocrType === 'business-card'" class="result-body">
        <view v-for="field in businessFields" :key="field.key" class="result-item">
          <text class="label">{{ field.label }}</text>
          <input v-model="resultData[field.key]" class="input" placeholder="-" placeholder-style="color: #C0C4CC" />
        </view>
      </view>

      <view v-else class="result-body">
        <view class="result-item full">
          <text class="label">识别文本</text>
          <textarea v-model="resultData.rawText" class="textarea" placeholder="-" placeholder-style="color: #C0C4CC" />
        </view>
        <view v-if="resultData.extractedFields" class="extracted">
          <view v-for="(value, key) in resultData.extractedFields" :key="key" class="result-item">
            <text class="label">{{ key }}</text>
            <input v-model="resultData.extractedFields[key]" class="input" placeholder="-" placeholder-style="color: #C0C4CC" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { recognizeBusinessCard, recognizeGeneral } from '@/api/ocr'

const props = defineProps({
  ocrType: {
    type: String,
    default: 'business-card'
  },
  fieldMapping: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['recognized'])

const loading = ref(false)
const previewImage = ref('')
const resultData = ref<any>(null)

const businessFields = [
  { key: 'company', label: '公司' },
  { key: 'name', label: '姓名' },
  { key: 'position', label: '职位' },
  { key: 'mobile', label: '手机' },
  { key: 'phone', label: '电话' },
  { key: 'email', label: '邮箱' },
  { key: 'address', label: '地址' },
  { key: 'website', label: '网站' },
  { key: 'wechat', label: '微信' },
  { key: 'qq', label: 'QQ' }
]

function handleChoose(source: 'camera' | 'album') {
  if (loading.value) return
  uni.chooseImage({
    count: 1,
    sourceType: [source],
    success: async (res) => {
      const filePath = res.tempFilePaths[0]
      previewImage.value = filePath
      await handleRecognize(filePath)
    }
  })
}

async function handleRecognize(filePath: string) {
  loading.value = true
  try {
    if (props.ocrType === 'general') {
      resultData.value = await recognizeGeneral(filePath)
    } else {
      resultData.value = await recognizeBusinessCard(filePath)
    }
  } catch (error: any) {
    uni.showToast({ title: error?.message || '识别失败', icon: 'none' })
    resultData.value = null
  } finally {
    loading.value = false
  }
}

function applyMapping(raw: any) {
  const mapping = props.fieldMapping || {}
  const mapped: Record<string, any> = {}
  Object.keys(mapping).forEach((key) => {
    const rule = mapping[key]
    if (Array.isArray(rule)) {
      mapped[key] = rule.map(field => raw?.[field]).find(val => val)
    } else if (typeof rule === 'string') {
      mapped[key] = raw?.[rule]
    } else if (typeof rule === 'function') {
      mapped[key] = rule(raw)
    }
  })
  return mapped
}

function confirmFill() {
  if (!resultData.value) return
  emit('recognized', {
    raw: resultData.value,
    mapped: applyMapping(resultData.value)
  })
}

function clearResult() {
  resultData.value = null
  previewImage.value = ''
}
</script>

<style scoped lang="scss">
.ocr-box {
  padding: 24rpx;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.ocr-header {
  margin-bottom: 16rpx;
}

.ocr-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #303133;
}

.ocr-subtitle {
  display: block;
  font-size: 24rpx;
  color: #909399;
  margin-top: 6rpx;
}

.ocr-actions {
  display: flex;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.ocr-btn {
  flex: 1;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  background: #667eea;
  color: #fff;
  font-size: 26rpx;
}

.ocr-btn.ghost {
  background: #f0f2f5;
  color: #606266;
}

.ocr-btn.disabled {
  opacity: 0.6;
}

.ocr-loading {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 16rpx 0;
}

.loading-text {
  font-size: 24rpx;
  color: #909399;
}

.preview {
  margin-top: 10rpx;
}

.preview-img {
  width: 100%;
  height: 240rpx;
  border-radius: 8rpx;
  background: #f5f7fa;
}

.result-card {
  margin-top: 16rpx;
  border-top: 1rpx dashed #ebeef5;
  padding-top: 16rpx;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.result-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
}

.result-actions {
  display: flex;
  gap: 10rpx;
}

.action-btn {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  background: #667eea;
  color: #fff;
  font-size: 24rpx;
}

.action-btn.ghost {
  background: #f0f2f5;
  color: #606266;
}

.result-item {
  margin-bottom: 16rpx;
}

.result-item.full {
  margin-bottom: 24rpx;
}

.label {
  display: block;
  font-size: 24rpx;
  color: #606266;
  margin-bottom: 8rpx;
}

.input,
.textarea {
  width: 100%;
  padding: 16rpx 20rpx;
  background: #f5f7fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #303133;
  border: 1rpx solid transparent;
  box-sizing: border-box;
}

.textarea {
  min-height: 160rpx;
}
</style>
