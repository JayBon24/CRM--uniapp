<!-- @ts-nocheck -->
<template>
  <view class="case-create-page">
    <view class="page-header">
      <text class="page-title">案件新增</text>
    </view>

    <scroll-view class="form-container" scroll-y>
      <view class="form-section">
        <view class="section-title">选择客户</view>
        <view class="search-box">
          <input
            v-model="keyword"
            class="input"
            placeholder="搜索客户名称/联系人/手机号"
            placeholder-style="color: #C0C4CC"
            @input="handleSearchInput"
            @focus="handleSearchFocus"
          />
          <view v-if="keyword" class="clear-btn" @click="handleClear">清空</view>
        </view>

        <view class="suggestion-toggle" @click="toggleSuggestions">
          <text class="toggle-text">{{ suggestionsExpanded ? '收起客户列表' : '展开客户列表' }}</text>
        </view>

        <view v-if="showSuggestions && suggestionsExpanded" class="suggestions">
          <view
            v-for="item in suggestions"
            :key="item.id"
            class="suggestion-item"
            @click="handleSelectCustomer(item)"
          >
            <view class="suggestion-main">
              <text class="suggestion-name">{{ item.name }}</text>
              <text class="suggestion-meta">
                {{ item.contact_person || '-' }} {{ item.contact_phone || '' }}
              </text>
            </view>
          </view>
          <view v-if="loadingCustomers" class="loading-hint">加载中...</view>
          <view v-else-if="suggestions.length === 0" class="loading-hint">暂无可选客户</view>
        </view>

        <view v-if="customerDetail" class="customer-card">
          <view class="info-row">
            <text class="label">客户名称</text>
            <text class="value">{{ customerDetail.client_name || customerDetail.customer_name }}</text>
          </view>
          <view class="info-row">
            <text class="label">联系人</text>
            <text class="value">{{ customerDetail.contact_name || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="label">手机号</text>
            <text class="value">{{ customerDetail.mobile || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="label">地址</text>
            <text class="value">{{ customerDetail.region || '-' }}</text>
          </view>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">案件信息</view>
        <BusinessCardOCR
          ocrType="general"
          @recognized="handleCaseOcrRecognized"
        />
        <view class="form-item">
          <text class="label">项目名称</text>
          <input v-model="formData.project_name" class="input" placeholder="请输入项目名称" placeholder-style="color: #C0C4CC" />
        </view>
        <view class="form-item required">
          <text class="label">欠付标的</text>
          <input v-model="formData.debt_subject" class="input" placeholder="请输入欠付标的" placeholder-style="color: #C0C4CC" />
        </view>
        <view class="form-item required">
          <text class="label">项目背景</text>
          <textarea v-model="formData.project_background" class="textarea short" placeholder="请输入项目背景" placeholder-style="color: #C0C4CC" :maxlength="300" />
        </view>
        <view class="form-item">
          <text class="label">备注</text>
          <textarea v-model="formData.remark" class="textarea short" placeholder="请输入备注（非必填）" placeholder-style="color: #C0C4CC" :maxlength="200" />
        </view>

        <view class="form-divider">案件信息</view>
        <view class="form-item">
          <text class="label">案件名称</text>
          <input v-model="formData.case_name" class="input" placeholder="客户名-案件类型" placeholder-style="color: #C0C4CC" />
        </view>
        <view class="form-item required">
          <text class="label">案件类型</text>
          <input v-model="formData.case_type" class="input" placeholder="如：诉讼/仲裁/调解" placeholder-style="color: #C0C4CC" />
        </view>
        <view class="form-item">
          <text class="label">案件描述</text>
          <textarea v-model="formData.case_description" class="textarea short" placeholder="请输入案件描述" placeholder-style="color: #C0C4CC" :maxlength="300" />
        </view>

        <view class="form-divider">原告信息</view>
        <CreditCodeAutoFill
          v-model="formData.plaintiff_credit_code"
          v-model:companyNameModelValue="formData.plaintiff_name"
          label="原告名称"
          placeholder="请输入原告名称"
          @select="handlePlaintiffSelect"
        />
        <view class="form-item">
          <text class="label">原告地址</text>
          <input v-model="formData.plaintiff_address" class="input" placeholder="请输入原告地址" placeholder-style="color: #C0C4CC" />
        </view>
        <view class="form-item">
          <text class="label">法定代表人</text>
          <input v-model="formData.plaintiff_legal_representative" class="input" placeholder="请输入法定代表人" placeholder-style="color: #C0C4CC" />
        </view>

        <view class="form-divider">被告信息</view>
        <CreditCodeAutoFill
          v-model="formData.defendant_credit_code"
          v-model:companyNameModelValue="formData.defendant_name"
          label="被告名称"
          placeholder="请输入被告名称"
          @select="handleDefendantSelect"
        />
        <view class="form-item">
          <text class="label">被告地址</text>
          <input v-model="formData.defendant_address" class="input" placeholder="请输入被告地址" placeholder-style="color: #C0C4CC" />
        </view>
        <view class="form-item">
          <text class="label">法定代表人</text>
          <input v-model="formData.defendant_legal_representative" class="input" placeholder="请输入法定代表人" placeholder-style="color: #C0C4CC" />
        </view>

        <view class="form-divider">金额信息</view>
        <view class="form-item">
          <text class="label">合同金额</text>
          <input v-model="formData.contract_amount" class="input" type="number" placeholder="请输入合同金额" placeholder-style="color: #C0C4CC" />
        </view>
        <view class="form-item">
          <text class="label">律师费</text>
          <input v-model="formData.lawyer_fee" class="input" type="number" placeholder="请输入律师费" placeholder-style="color: #C0C4CC" />
        </view>

        <view class="form-divider">诉讼信息</view>
        <view class="form-item">
          <text class="label">诉讼请求</text>
          <textarea v-model="formData.litigation_request" class="textarea short" placeholder="请输入诉讼请求" placeholder-style="color: #C0C4CC" :maxlength="300" />
        </view>
        <view class="form-item">
          <text class="label">事实与理由</text>
          <textarea v-model="formData.facts_and_reasons" class="textarea short" placeholder="请输入事实与理由" placeholder-style="color: #C0C4CC" :maxlength="500" />
        </view>
        <view class="form-item">
          <text class="label">管辖法院</text>
          <input v-model="formData.jurisdiction" class="input" placeholder="请输入管辖法院" placeholder-style="color: #C0C4CC" />
        </view>
        <view class="form-item">
          <text class="label">立案日期</text>
          <input v-model="formData.filing_date" class="input" placeholder="YYYY-MM-DD" placeholder-style="color: #C0C4CC" />
        </view>

        <view class="form-divider">其他信息</view>
        <view class="form-item">
          <text class="label">申请人</text>
          <input v-model="formData.petitioner" class="input" placeholder="请输入申请人" placeholder-style="color: #C0C4CC" />
        </view>
        <view class="form-item">
          <text class="label">拟稿人</text>
          <input v-model="formData.draft_person" class="input" placeholder="请输入拟稿人" placeholder-style="color: #C0C4CC" />
        </view>
      </view>
    </scroll-view>

    <view class="submit-bar">
      <view class="submit-btn" @click="handleSubmit">提交</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getOwnerCustomers, getClientDetail, createClientWithCase } from '@/api/client'
import type { ClientDetail, OwnerCustomerItem, CreateClientWithCaseParams } from '@/types/interfaces/client'
import BusinessCardOCR from '@/components/BusinessCardOCR/index.vue'
import CreditCodeAutoFill from '@/components/CreditCodeAutoFill/index.vue'

const keyword = ref('')
const suggestions = ref<OwnerCustomerItem[]>([])
const showSuggestions = ref(false)
const loadingCustomers = ref(false)
const customerDetail = ref<ClientDetail | null>(null)
const suggestionsExpanded = ref(true)

const formData = ref({
  project_name: '',
  debt_subject: '',
  project_background: '',
  remark: '',
  case_name: '',
  case_type: '',
  case_description: '',
  plaintiff_name: '',
  plaintiff_credit_code: '',
  plaintiff_address: '',
  plaintiff_legal_representative: '',
  defendant_name: '',
  defendant_credit_code: '',
  defendant_address: '',
  defendant_legal_representative: '',
  contract_amount: '',
  lawyer_fee: '',
  litigation_request: '',
  facts_and_reasons: '',
  jurisdiction: '',
  filing_date: '',
  petitioner: '',
  draft_person: ''
})

let searchTimer: any = null


function handleCaseOcrRecognized(payload: any) {
  const raw = payload?.raw || {}
  const extracted = raw.extractedFields || {}
  if (extracted.plaintiffName && !formData.value.plaintiff_name) {
    formData.value.plaintiff_name = extracted.plaintiffName
  }
  if (extracted.defendantName && !formData.value.defendant_name) {
    formData.value.defendant_name = extracted.defendantName
  }
  if (extracted.amount && !formData.value.contract_amount) {
    formData.value.contract_amount = String(extracted.amount)
  }
  if (raw.rawText) {
    if (!formData.value.case_description) {
      formData.value.case_description = raw.rawText
    } else if (!formData.value.project_background) {
      formData.value.project_background = raw.rawText
    }
  }
}

function handlePlaintiffSelect(candidate: any) {
  if (candidate.legal_representative && !formData.value.plaintiff_legal_representative) {
    formData.value.plaintiff_legal_representative = candidate.legal_representative
  }
  if (candidate.address && !formData.value.plaintiff_address) {
    formData.value.plaintiff_address = candidate.address
  }
}

function handleDefendantSelect(candidate: any) {
  if (candidate.legal_representative && !formData.value.defendant_legal_representative) {
    formData.value.defendant_legal_representative = candidate.legal_representative
  }
  if (candidate.address && !formData.value.defendant_address) {
    formData.value.defendant_address = candidate.address
  }
}

function handleSearchInput() {
  clearTimeout(searchTimer)
  const value = keyword.value.trim()
  showSuggestions.value = true
  searchTimer = setTimeout(fetchOwnerCustomers, value ? 300 : 0)
}

function handleClear() {
  keyword.value = ''
  suggestions.value = []
  showSuggestions.value = true
  customerDetail.value = null
  fetchOwnerCustomers()
}

async function fetchOwnerCustomers() {
  loadingCustomers.value = true
  try {
    const res = await getOwnerCustomers({ keyword: keyword.value.trim() || undefined })
    const unique: OwnerCustomerItem[] = []
    const seen = new Set<string>()
    ;(res || []).forEach((item: OwnerCustomerItem) => {
      const key = `name:${item.name || ''}-phone:${item.contact_phone || ''}`
      if (seen.has(key)) return
      seen.add(key)
      unique.push(item)
    })
    suggestions.value = unique
    showSuggestions.value = true
  } catch (error) {
    uni.showToast({ title: '客户搜索失败', icon: 'none' })
  } finally {
    loadingCustomers.value = false
  }
}

function handleSearchFocus() {
  showSuggestions.value = true
  if (suggestions.value.length === 0) {
    fetchOwnerCustomers()
  }
}

function toggleSuggestions() {
  suggestionsExpanded.value = !suggestionsExpanded.value
}

async function handleSelectCustomer(item: OwnerCustomerItem) {
  keyword.value = item.name
  showSuggestions.value = false
  suggestionsExpanded.value = false
  try {
    customerDetail.value = await getClientDetail(item.id)
  } catch (error) {
    customerDetail.value = null
  }
}

onMounted(() => {
  fetchOwnerCustomers()
  showSuggestions.value = true
})

watch(
  () => [customerDetail.value?.client_name, formData.value.case_type],
  () => {
    if (!customerDetail.value) return
    if (formData.value.case_name) return
    const baseName = customerDetail.value.client_name || customerDetail.value.customer_name || ''
    if (baseName && formData.value.case_type) {
      formData.value.case_name = `${baseName}-${formData.value.case_type}`
    } else if (baseName) {
      formData.value.case_name = `${baseName}案件`
    }
  }
)

async function handleSubmit() {
  if (!customerDetail.value) {
    uni.showToast({ title: '请选择客户', icon: 'none' })
    return
  }
  if (!formData.value.debt_subject.trim()) {
    uni.showToast({ title: '请输入欠付标的', icon: 'none' })
    return
  }
  if (!formData.value.project_background.trim()) {
    uni.showToast({ title: '请输入项目背景', icon: 'none' })
    return
  }
  if (!formData.value.case_type.trim()) {
    uni.showToast({ title: '请输入案件类型', icon: 'none' })
    return
  }

  const payload: CreateClientWithCaseParams = {
    customer_id: customerDetail.value.id,
    ...formData.value
  }

  if (!payload.case_name) {
    const baseName = customerDetail.value.client_name || customerDetail.value.customer_name || ''
    payload.case_name = payload.case_type ? `${baseName}-${payload.case_type}` : `${baseName}案件`
  }

  try {
    uni.showLoading({ title: '提交中...' })
    await createClientWithCase(payload)
    uni.hideLoading()
    uni.showToast({ title: '创建成功', icon: 'success' })
    uni.redirectTo({ url: '/pages/other/customer/list/index?stage=BLANK' })
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({ title: error?.message || '创建失败', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.case-create-page {
  min-height: 100vh;
  background: #F5F7FA;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 24rpx 20rpx 0;
}

.page-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #303133;
}

.form-container {
  flex: 1;
  padding: 20rpx;
}

.form-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16rpx;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.suggestion-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12rpx;
}

.toggle-text {
  font-size: 24rpx;
  color: #409EFF;
}

.clear-btn {
  font-size: 24rpx;
  color: #409EFF;
}

.suggestions {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx;
  border-radius: 12rpx;
  background: #F5F7FA;
}

.suggestion-main {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.suggestion-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #303133;
}

.suggestion-meta {
  font-size: 24rpx;
  color: #909399;
}


.loading-hint {
  padding: 12rpx 0;
  font-size: 24rpx;
  color: #909399;
}

.customer-card {
  margin-top: 16rpx;
  padding: 16rpx;
  border-radius: 12rpx;
  background: #F7F9FC;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 12rpx;
  font-size: 24rpx;
  color: #606266;
  margin-bottom: 8rpx;
}

.label {
  color: #909399;
}

.value {
  flex: 1;
  text-align: right;
  color: #303133;
}

.form-item {
  margin-bottom: 16rpx;
}

.form-item.required .label::after {
  content: '*';
  color: #F56C6C;
  margin-left: 6rpx;
}

.input {
  width: 100%;
  height: 72rpx;
  padding: 0 16rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 26rpx;
  box-sizing: border-box;
}

.textarea {
  width: 100%;
  min-height: 160rpx;
  padding: 16rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 26rpx;
  box-sizing: border-box;
}

.textarea.short {
  min-height: 120rpx;
}

.form-divider {
  margin: 20rpx 0 12rpx;
  font-size: 26rpx;
  color: #303133;
  font-weight: 600;
}

.submit-bar {
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.06);
}

.submit-btn {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  border-radius: 12rpx;
  background: #4F46E5;
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}
</style>
