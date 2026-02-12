<!-- @ts-nocheck -->
<template>
  <view class="credit-code-auto-fill">
    <view class="form-item">
      <text class="label">{{ label }}</text>
      <view class="input-wrapper">
        <input
          v-model="companyName"
          class="input"
          :placeholder="placeholder"
          placeholder-style="color: #C0C4CC"
          @blur="handleCompanyNameBlur"
          @input="handleCompanyNameInput"
        />
        <button 
          class="query-btn" 
          :disabled="!canQuery || loading"
          @click="handleQueryClick"
        >
          <u-loading-icon v-if="loading" mode="spinner" size="16" color="#fff" />
          <text v-else>查询</text>
        </button>
      </view>
      <view v-if="loading" class="loading-hint">
        <u-loading-icon mode="spinner" size="20" />
        <text class="loading-text">查询中...</text>
      </view>
    </view>
    
    <view class="form-item">
      <text class="label">统一社会信用代码</text>
      <input
        v-model="creditCode"
        class="input"
        placeholder="请输入统一社会信用代码"
        placeholder-style="color: #C0C4CC"
        @input="handleCreditCodeInput"
      />
      <view v-if="showCandidates && candidates.length > 0" class="candidates-dropdown">
        <view
          v-for="(item, index) in candidates"
          :key="index"
          class="candidate-item"
          @click="handleSelectCandidate(item)"
        >
          <view class="candidate-name">{{ item.name }}</view>
          <view class="candidate-code">{{ item.credit_code }}</view>
          <view v-if="item.legal_representative" class="candidate-meta">
            法定代表人：{{ item.legal_representative }}
          </view>
        </view>
      </view>
      <view v-if="showCandidates && candidates.length === 0 && !loading" class="no-result">
        <text>未找到匹配的企业信息，请手动填写</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, watch, computed } from 'vue'
import { getCompanyCreditCode } from '@/api/client'

interface Props {
  modelValue?: string
  companyNameModelValue?: string
  label?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '公司名称',
  placeholder: '请输入公司名称'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:companyNameModelValue': [value: string]
  'select': [candidate: any]
}>()

const companyName = ref(props.companyNameModelValue || '')
const creditCode = ref(props.modelValue || '')
const candidates = ref<any[]>([])
const showCandidates = ref(false)
const loading = ref(false)

// 计算是否可以查询（公司名称至少2个字符）
const canQuery = computed(() => {
  return companyName.value.trim().length >= 2 && !loading.value
})

// 监听外部传入的值变化
watch(() => props.modelValue, (val) => {
  if (val !== creditCode.value) {
    creditCode.value = val || ''
  }
})

watch(() => props.companyNameModelValue, (val) => {
  if (val !== companyName.value) {
    companyName.value = val || ''
  }
})

// 公司名称输入
function handleCompanyNameInput() {
  emit('update:companyNameModelValue', companyName.value)
  // 清空信用代码和候选列表，等待重新查询
  if (creditCode.value) {
    creditCode.value = ''
    emit('update:modelValue', '')
  }
  // 清空候选列表
  candidates.value = []
  showCandidates.value = false
}

// 点击查询按钮
function handleQueryClick() {
  if (!canQuery.value) {
    return
  }
  queryCreditCode()
}

// 公司名称失焦
function handleCompanyNameBlur() {
  // 延迟隐藏候选列表，给用户时间点击选择
  setTimeout(() => {
    showCandidates.value = false
  }, 200)
}

// 信用代码输入
function handleCreditCodeInput() {
  emit('update:modelValue', creditCode.value)
  // 手动输入时隐藏候选列表
  showCandidates.value = false
}

// 查询统一社会信用代码
async function queryCreditCode() {
  const name = companyName.value.trim()
  if (!name || name.length < 2) {
    return
  }
  
  loading.value = true
  showCandidates.value = false
  
  try {
    const result = await getCompanyCreditCode(name)
    candidates.value = result.candidates || []
    showCandidates.value = true
    
    // 如果只有一个候选，自动填充
    if (candidates.value.length === 1) {
      handleSelectCandidate(candidates.value[0])
    }
  } catch (error: any) {
    console.error('查询统一社会信用代码失败:', error)
    candidates.value = []
    showCandidates.value = false
    // 不显示错误提示，允许用户手动填写
  } finally {
    loading.value = false
  }
}

// 选择候选
function handleSelectCandidate(candidate: any) {
  creditCode.value = candidate.credit_code || ''
  emit('update:modelValue', creditCode.value)
  emit('select', candidate)
  showCandidates.value = false
}
</script>

<style scoped lang="scss">
.credit-code-auto-fill {
  .form-item {
    margin-bottom: 16rpx;
    position: relative;
  }
  
  .label {
    display: block;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #303133;
  }
  
  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }
  
  .input {
    width: 100%;
    height: 72rpx;
    padding: 0 24rpx;
    background: #F5F7FA;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #303133;
    border: 1rpx solid transparent;
    box-sizing: border-box;
    
    &:focus {
      border-color: #667eea;
      background: #fff;
    }
  }
  
  .input-wrapper .input {
    flex: 1;
    width: auto;
  }
  
  .query-btn {
    width: 120rpx;
    height: 72rpx;
    padding: 0;
    background: #409EFF;
    color: #fff;
    border: none;
    border-radius: 8rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    &:disabled {
      background: #C0C4CC;
      opacity: 0.6;
    }
    
    &:active:not(:disabled) {
      background: #337ECC;
    }
  }
  
  .loading-hint {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-top: 8rpx;
    font-size: 24rpx;
    color: #909399;
    
    .loading-text {
      font-size: 24rpx;
    }
  }
  
  .candidates-dropdown {
    margin-top: 8rpx;
    background: #fff;
    border-radius: 8rpx;
    border: 1rpx solid #EBEEF5;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    max-height: 400rpx;
    overflow-y: auto;
  }
  
  .candidate-item {
    padding: 20rpx 24rpx;
    border-bottom: 1rpx solid #F5F7FA;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:active {
      background: #F5F7FA;
    }
  }
  
  .candidate-name {
    font-size: 28rpx;
    font-weight: 500;
    color: #303133;
    margin-bottom: 8rpx;
  }
  
  .candidate-code {
    font-size: 26rpx;
    color: #409EFF;
    margin-bottom: 4rpx;
  }
  
  .candidate-meta {
    font-size: 24rpx;
    color: #909399;
  }
  
  .no-result {
    margin-top: 8rpx;
    padding: 16rpx;
    font-size: 24rpx;
    color: #909399;
    text-align: center;
    background: #F5F7FA;
    border-radius: 8rpx;
  }
}
</style>
