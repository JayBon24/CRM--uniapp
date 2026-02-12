<!-- @ts-nocheck -->
<template>
  <view class="contract-confirm-page">
    <view class="form-container">
      <!-- 合同附件上传 -->
      <view class="form-section">
        <view class="section-title">合同附件 <text class="required">*</text></view>
        <view class="tip-box">
          <u-icon name="info-circle" size="16" color="#E6A23C" />
          <text class="tip-text">支持上传 PDF、Word 或图片格式的合同文件</text>
        </view>
        <ImageUploader
          v-model="formData.attachments"
          :maxCount="9"
          accept="image,pdf,doc"
        />
      </view>

      <!-- 合同基本信息 -->
      <view class="form-section">
        <view class="section-title">合同信息</view>
        
        <!-- 合同编号 -->
        <view class="form-item">
          <text class="label">合同编号 <text class="required">*</text></text>
          <input
            v-model="formData.contract_no"
            class="input"
            placeholder="请输入合同编号"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <!-- 合同金额 -->
        <view class="form-item">
          <text class="label">合同金额（元）<text class="required">*</text></text>
          <input
            v-model="formData.contract_amount"
            class="input"
            type="digit"
            placeholder="请输入合同金额"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <!-- 合同期限 -->
        <view class="form-item">
          <text class="label">合同期限 <text class="required">*</text></text>
          <view class="date-range">
            <view class="date-picker" @click="showStartDatePicker = true">
              <text v-if="formData.start_date" class="date-text">{{ formData.start_date }}</text>
              <text v-else class="placeholder">开始日期</text>
              <SvgIcon name="calendar" :size="28" color="#909399" />
            </view>
            <text class="date-separator">至</text>
            <view class="date-picker" @click="showEndDatePicker = true">
              <text v-if="formData.end_date" class="date-text">{{ formData.end_date }}</text>
              <text v-else class="placeholder">结束日期</text>
              <SvgIcon name="calendar" :size="28" color="#909399" />
            </view>
          </view>
        </view>

        <!-- 服务类型 -->
        <view class="form-item">
          <text class="label">服务类型 <text class="required">*</text></text>
          <view class="radio-group">
            <view
              v-for="type in serviceTypes"
              :key="type.value"
              class="radio-item"
              :class="{ active: formData.service_type === type.value }"
              @click="formData.service_type = type.value"
            >
              <view class="radio-circle">
                <view v-if="formData.service_type === type.value" class="radio-dot" />
              </view>
              <text class="radio-label">{{ type.label }}</text>
            </view>
          </view>
        </view>

        <!-- 客户主体 -->
        <view class="form-item">
          <text class="label">客户主体 <text class="required">*</text></text>
          <input
            v-model="formData.client_entity"
            class="input"
            placeholder="请输入客户主体名称"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <!-- 备注 -->
        <view class="form-item">
          <text class="label">备注</text>
          <textarea
            v-model="formData.remark"
            class="textarea"
            placeholder="选填，可补充其他信息"
            placeholder-style="color: #C0C4CC"
            :maxlength="500"
          />
        </view>
      </view>

      <!-- 案件基本信息（最小字段） -->
      <view class="form-section">
        <view class="section-title">
          关联案件信息
          <text class="tip-text">（自动创建）</text>
        </view>

        <BusinessCardOCR
          ocrType="general"
          @recognized="handleCaseOcrRecognized"
        />
        
        <view class="form-item">
          <text class="label">案件名称 <text class="required">*</text></text>
          <input
            v-model="formData.case_name"
            class="input"
            placeholder="请输入案件名称"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <view class="form-item">
          <text class="label">案件类型</text>
          <view class="radio-group">
            <view
              v-for="type in caseTypes"
              :key="type.value"
              class="radio-item"
              :class="{ active: formData.case_type === type.value }"
              @click="formData.case_type = type.value"
            >
              <view class="radio-circle">
                <view v-if="formData.case_type === type.value" class="radio-dot" />
              </view>
              <text class="radio-label">{{ type.label }}</text>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="label">案件描述</text>
          <textarea
            v-model="formData.case_description"
            class="textarea"
            placeholder="请输入案件描述"
            placeholder-style="color: #C0C4CC"
            :maxlength="500"
          />
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
          <input
            v-model="formData.plaintiff_address"
            class="input"
            placeholder="请输入原告地址"
            placeholder-style="color: #C0C4CC"
          />
        </view>
        <view class="form-item">
          <text class="label">法定代表人</text>
          <input
            v-model="formData.plaintiff_legal_representative"
            class="input"
            placeholder="请输入法定代表人"
            placeholder-style="color: #C0C4CC"
          />
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
          <input
            v-model="formData.defendant_address"
            class="input"
            placeholder="请输入被告地址"
            placeholder-style="color: #C0C4CC"
          />
        </view>
        <view class="form-item">
          <text class="label">法定代表人</text>
          <input
            v-model="formData.defendant_legal_representative"
            class="input"
            placeholder="请输入法定代表人"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <view class="form-divider">金额与诉讼信息</view>
        <view class="form-item">
          <text class="label">律师费</text>
          <input
            v-model="formData.lawyer_fee"
            class="input"
            type="digit"
            placeholder="请输入律师费"
            placeholder-style="color: #C0C4CC"
          />
        </view>
        <view class="form-item">
          <text class="label">诉讼请求</text>
          <textarea
            v-model="formData.litigation_request"
            class="textarea"
            placeholder="请输入诉讼请求"
            placeholder-style="color: #C0C4CC"
            :maxlength="300"
          />
        </view>
        <view class="form-item">
          <text class="label">事实与理由</text>
          <textarea
            v-model="formData.facts_and_reasons"
            class="textarea"
            placeholder="请输入事实与理由"
            placeholder-style="color: #C0C4CC"
            :maxlength="500"
          />
        </view>
        <view class="form-item">
          <text class="label">管辖法院</text>
          <input
            v-model="formData.jurisdiction"
            class="input"
            placeholder="请输入管辖法院"
            placeholder-style="color: #C0C4CC"
          />
        </view>
        <view class="form-item">
          <text class="label">立案日期</text>
          <input
            v-model="formData.filing_date"
            class="input"
            placeholder="YYYY-MM-DD"
            placeholder-style="color: #C0C4CC"
          />
        </view>
        <view class="form-item">
          <text class="label">申请人</text>
          <input
            v-model="formData.petitioner"
            class="input"
            placeholder="请输入申请人"
            placeholder-style="color: #C0C4CC"
          />
        </view>
        <view class="form-item">
          <text class="label">拟稿人</text>
          <input
            v-model="formData.draft_person"
            class="input"
            placeholder="请输入拟稿人"
            placeholder-style="color: #C0C4CC"
          />
        </view>
      </view>

      <!-- 案件关键节点（自动生成日程） -->
      <view class="form-section">
        <view class="section-title">
          案件关键节点
          <text class="tip-text">（自动写入日历）</text>
        </view>
        <view class="tip-box milestone-tip">
          <SvgIcon name="calendar" :size="28" color="#409EFF" />
          <text class="tip-text blue">填写后将自动创建日程提醒，确保不错过重要时间节点</text>
        </view>

        <!-- 开庭时间 -->
        <view class="form-item">
          <text class="label">
            <text class="milestone-icon court">庭</text>
            开庭时间
          </text>
          <view class="datetime-picker" @click="showCourtTimePicker = true">
            <text v-if="formData.court_hearing_time" class="datetime-text">{{ formData.court_hearing_time }}</text>
            <text v-else class="placeholder">选择开庭时间（选填）</text>
            <SvgIcon name="calendar" :size="28" color="#909399" />
          </view>
        </view>

        <!-- 开庭地点 -->
        <view v-if="formData.court_hearing_time" class="form-item sub-item">
          <text class="label">开庭地点</text>
          <input
            v-model="formData.court_location"
            class="input"
            placeholder="如：XX市中级人民法院"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <!-- 调解时间 -->
        <view class="form-item">
          <text class="label">
            <text class="milestone-icon mediation">调</text>
            调解时间
          </text>
          <view class="datetime-picker" @click="showMediationTimePicker = true">
            <text v-if="formData.mediation_time" class="datetime-text">{{ formData.mediation_time }}</text>
            <text v-else class="placeholder">选择调解时间（选填）</text>
            <SvgIcon name="calendar" :size="28" color="#909399" />
          </view>
        </view>

        <!-- 调解地点 -->
        <view v-if="formData.mediation_time" class="form-item sub-item">
          <text class="label">调解地点</text>
          <input
            v-model="formData.mediation_location"
            class="input"
            placeholder="如：XX仲裁委员会"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <!-- 回款截止时间 -->
        <view class="form-item">
          <text class="label">
            <text class="milestone-icon payment">款</text>
            回款截止
          </text>
          <view class="datetime-picker" @click="showPaymentDeadlinePicker = true">
            <text v-if="formData.payment_deadline" class="datetime-text">{{ formData.payment_deadline }}</text>
            <text v-else class="placeholder">选择回款截止时间（选填）</text>
            <SvgIcon name="calendar" :size="28" color="#909399" />
          </view>
        </view>

        <!-- 举证截止时间 -->
        <view class="form-item">
          <text class="label">
            <text class="milestone-icon evidence">证</text>
            举证截止
          </text>
          <view class="datetime-picker" @click="showEvidenceDeadlinePicker = true">
            <text v-if="formData.evidence_deadline" class="datetime-text">{{ formData.evidence_deadline }}</text>
            <text v-else class="placeholder">选择举证截止时间（选填）</text>
            <SvgIcon name="calendar" :size="28" color="#909399" />
          </view>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="info-box">
        <u-icon name="info-circle" size="18" color="#409EFF" />
        <text class="info-text">确认后将自动创建合同档案和关联案件，客户状态将变更为"交案"</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer-actions">
      <view class="btn cancel-btn" @click="handleCancel">
        <text class="btn-text">取消</text>
      </view>
      <view class="btn submit-btn" @click="handleSubmit">
        <text class="btn-text">确认交案</text>
      </view>
    </view>

    <!-- 日期选择器 -->
    <u-datetime-picker
      v-model:show="showStartDatePicker"
      v-model="startDateValue"
      mode="date"
      @confirm="onStartDateConfirm"
      @cancel="showStartDatePicker = false"
      @close="showStartDatePicker = false"
    />
    <u-datetime-picker
      v-model:show="showEndDatePicker"
      v-model="endDateValue"
      mode="date"
      :minDate="startDateValue"
      @confirm="onEndDateConfirm"
      @cancel="showEndDatePicker = false"
      @close="showEndDatePicker = false"
    />
    <!-- 案件关键节点日期选择器 -->
    <u-datetime-picker
      v-model:show="showCourtTimePicker"
      v-model="courtTimeValue"
      mode="datetime"
      @confirm="onCourtTimeConfirm"
      @cancel="showCourtTimePicker = false"
      @close="showCourtTimePicker = false"
    />
    <u-datetime-picker
      v-model:show="showMediationTimePicker"
      v-model="mediationTimeValue"
      mode="datetime"
      @confirm="onMediationTimeConfirm"
      @cancel="showMediationTimePicker = false"
      @close="showMediationTimePicker = false"
    />
    <u-datetime-picker
      v-model:show="showPaymentDeadlinePicker"
      v-model="paymentDeadlineValue"
      mode="datetime"
      @confirm="onPaymentDeadlineConfirm"
      @cancel="showPaymentDeadlinePicker = false"
      @close="showPaymentDeadlinePicker = false"
    />
    <u-datetime-picker
      v-model:show="showEvidenceDeadlinePicker"
      v-model="evidenceDeadlineValue"
      mode="datetime"
      @confirm="onEvidenceDeadlineConfirm"
      @cancel="showEvidenceDeadlinePicker = false"
      @close="showEvidenceDeadlinePicker = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ImageUploader from '@/components/ImageUploader/index.vue'
import BusinessCardOCR from '@/components/BusinessCardOCR/index.vue'
import CreditCodeAutoFill from '@/components/CreditCodeAutoFill/index.vue'
import { confirmContract, getPlanList } from '@/api/client'
import { createSchedulesFromContractConfirm } from '../../services/case-schedule'
import dayjs from 'dayjs'

const clientId = ref<number | string>('')
const clientName = ref('客户名称')

const formData = ref({
  // 合同信息
  attachments: [] as string[],
  contract_no: '',
  contract_amount: '',
  start_date: '',
  end_date: '',
  service_type: 'arbitration' as string,
  client_entity: '',
  remark: '',
  // 案件信息
  case_name: '',
  case_type: 'arbitration' as string,
  case_description: '',
  plaintiff_name: '',
  plaintiff_credit_code: '',
  plaintiff_address: '',
  plaintiff_legal_representative: '',
  defendant_name: '',
  defendant_credit_code: '',
  defendant_address: '',
  defendant_legal_representative: '',
  lawyer_fee: '',
  litigation_request: '',
  facts_and_reasons: '',
  jurisdiction: '',
  filing_date: '',
  petitioner: '',
  draft_person: '',
  // 案件关键节点
  court_hearing_time: '',
  court_location: '',
  mediation_time: '',
  mediation_location: '',
  payment_deadline: '',
  evidence_deadline: ''
})

// 服务类型选项
const serviceTypes = [
  { value: 'arbitration', label: '仲裁' },
  { value: 'mediation', label: '调解' },
  { value: 'litigation', label: '诉讼' },
  { value: 'other', label: '其他' }
]

// 案件类型选项
const caseTypes = [
  { value: 'arbitration', label: '仲裁' },
  { value: 'mediation', label: '调解' },
  { value: 'litigation', label: '诉讼' }
]

// 日期选择器相关
const showStartDatePicker = ref(false)
const showEndDatePicker = ref(false)
const startDateValue = ref(Date.now())
const endDateValue = ref(Date.now())

// 案件关键节点日期选择器
const showCourtTimePicker = ref(false)
const showMediationTimePicker = ref(false)
const showPaymentDeadlinePicker = ref(false)
const showEvidenceDeadlinePicker = ref(false)
const courtTimeValue = ref(Date.now())
const mediationTimeValue = ref(Date.now())
const paymentDeadlineValue = ref(Date.now())
const evidenceDeadlineValue = ref(Date.now())

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

onLoad((options: any) => {
  if (options?.clientId) {
    clientId.value = options.clientId
    clientName.value = options.clientName || '客户名称'
    
    // 默认案件名称与客户名称关联
    formData.value.case_name = `${clientName.value}案件`
    loadEffectiveCasePlan(options.clientId)
  }
})

async function loadEffectiveCasePlan(id: number | string) {
  try {
    const res = await getPlanList(id)
    const plans = res.rows || []
    const effectiveCase = plans.find((item: any) => item.plan_type === 'effective_case')
    if (!effectiveCase?.extra_data) return
    const data = effectiveCase.extra_data || {}

    formData.value.case_name = formData.value.case_name || data.case_name || formData.value.case_name
    formData.value.case_type = data.case_type || formData.value.case_type
    formData.value.case_description = data.case_description || ''
    formData.value.plaintiff_name = data.plaintiff_name || ''
    formData.value.plaintiff_credit_code = data.plaintiff_credit_code || ''
    formData.value.plaintiff_address = data.plaintiff_address || ''
    formData.value.plaintiff_legal_representative = data.plaintiff_legal_representative || ''
    formData.value.defendant_name = data.defendant_name || ''
    formData.value.defendant_credit_code = data.defendant_credit_code || ''
    formData.value.defendant_address = data.defendant_address || ''
    formData.value.defendant_legal_representative = data.defendant_legal_representative || ''
    formData.value.lawyer_fee = data.lawyer_fee || ''
    formData.value.litigation_request = data.litigation_request || ''
    formData.value.facts_and_reasons = data.facts_and_reasons || ''
    formData.value.jurisdiction = data.jurisdiction || ''
    formData.value.filing_date = data.filing_date || ''
    formData.value.petitioner = data.petitioner || ''
    formData.value.draft_person = data.draft_person || ''

    if (!formData.value.contract_amount && data.contract_amount) {
      formData.value.contract_amount = data.contract_amount
    }
  } catch (error) {
    console.error('加载有效交案数据失败:', error)
  }
}

// 开始日期确认
function onStartDateConfirm(value: any) {
  const date = dayjs(value.value || value).format('YYYY-MM-DD')
  formData.value.start_date = date
  startDateValue.value = new Date(date).getTime()
  showStartDatePicker.value = false
}

// 结束日期确认
function onEndDateConfirm(value: any) {
  const date = dayjs(value.value || value).format('YYYY-MM-DD')
  formData.value.end_date = date
  endDateValue.value = new Date(date).getTime()
  showEndDatePicker.value = false
}

// 开庭时间确认
function onCourtTimeConfirm(value: any) {
  const datetime = dayjs(value.value || value).format('YYYY-MM-DD HH:mm')
  formData.value.court_hearing_time = datetime
  courtTimeValue.value = new Date(datetime).getTime()
  showCourtTimePicker.value = false
}

// 调解时间确认
function onMediationTimeConfirm(value: any) {
  const datetime = dayjs(value.value || value).format('YYYY-MM-DD HH:mm')
  formData.value.mediation_time = datetime
  mediationTimeValue.value = new Date(datetime).getTime()
  showMediationTimePicker.value = false
}

// 回款截止时间确认
function onPaymentDeadlineConfirm(value: any) {
  const datetime = dayjs(value.value || value).format('YYYY-MM-DD HH:mm')
  formData.value.payment_deadline = datetime
  paymentDeadlineValue.value = new Date(datetime).getTime()
  showPaymentDeadlinePicker.value = false
}

// 举证截止时间确认
function onEvidenceDeadlineConfirm(value: any) {
  const datetime = dayjs(value.value || value).format('YYYY-MM-DD HH:mm')
  formData.value.evidence_deadline = datetime
  evidenceDeadlineValue.value = new Date(datetime).getTime()
  showEvidenceDeadlinePicker.value = false
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
  if (formData.value.attachments.length === 0) {
    uni.showToast({
      title: '请上传合同附件',
      icon: 'none'
    })
    return
  }

  if (!formData.value.contract_no.trim()) {
    uni.showToast({
      title: '请输入合同编号',
      icon: 'none'
    })
    return
  }

  if (!formData.value.contract_amount || parseFloat(formData.value.contract_amount) <= 0) {
    uni.showToast({
      title: '请输入正确的合同金额',
      icon: 'none'
    })
    return
  }

  if (!formData.value.start_date || !formData.value.end_date) {
    uni.showToast({
      title: '请选择合同期限',
      icon: 'none'
    })
    return
  }

  if (!formData.value.client_entity.trim()) {
    uni.showToast({
      title: '请输入客户主体',
      icon: 'none'
    })
    return
  }

  if (!formData.value.case_name.trim()) {
    uni.showToast({
      title: '请输入案件名称',
      icon: 'none'
    })
    return
  }

  if (!formData.value.case_type) {
    uni.showToast({
      title: '请选择案件类型',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({ title: '提交中...' })

    const submitData = {
      client_id: clientId.value,
      // 合同信息
      attachments: formData.value.attachments,
      contract_no: formData.value.contract_no.trim(),
      contract_amount: parseFloat(formData.value.contract_amount),
      start_date: formData.value.start_date,
      end_date: formData.value.end_date,
      service_type: formData.value.service_type,
      client_entity: formData.value.client_entity.trim(),
      remark: formData.value.remark.trim(),
      // 案件信息
      case_name: formData.value.case_name.trim(),
      case_type: formData.value.case_type,
      case_description: formData.value.case_description?.trim(),
      plaintiff_name: formData.value.plaintiff_name?.trim(),
      plaintiff_credit_code: formData.value.plaintiff_credit_code?.trim(),
      plaintiff_address: formData.value.plaintiff_address?.trim(),
      plaintiff_legal_representative: formData.value.plaintiff_legal_representative?.trim(),
      defendant_name: formData.value.defendant_name?.trim(),
      defendant_credit_code: formData.value.defendant_credit_code?.trim(),
      defendant_address: formData.value.defendant_address?.trim(),
      defendant_legal_representative: formData.value.defendant_legal_representative?.trim(),
      lawyer_fee: formData.value.lawyer_fee ? parseFloat(formData.value.lawyer_fee) : undefined,
      litigation_request: formData.value.litigation_request?.trim(),
      facts_and_reasons: formData.value.facts_and_reasons?.trim(),
      jurisdiction: formData.value.jurisdiction?.trim(),
      filing_date: formData.value.filing_date?.trim(),
      petitioner: formData.value.petitioner?.trim(),
      draft_person: formData.value.draft_person?.trim()
    }

    // 调用 API（实际项目中）
    console.log('确认合同交案:', submitData)
    await confirmContract(submitData as any)

    // 检查是否有关键节点需要创建日程
    const hasMilestones = formData.value.court_hearing_time || 
                          formData.value.mediation_time || 
                          formData.value.payment_deadline ||
                          formData.value.evidence_deadline

    if (hasMilestones) {
      uni.showLoading({ title: '创建日程...' })
      
      try {
        const scheduleResult = await createSchedulesFromContractConfirm({
          clientId: clientId.value,
          caseName: formData.value.case_name.trim(),
          courtHearingTime: formData.value.court_hearing_time || undefined,
          courtLocation: formData.value.court_location || undefined,
          mediationTime: formData.value.mediation_time || undefined,
          mediationLocation: formData.value.mediation_location || undefined,
          paymentDeadline: formData.value.payment_deadline || undefined,
          evidenceDeadline: formData.value.evidence_deadline || undefined
        })

        console.log('日程创建结果:', scheduleResult)
        
        if (scheduleResult.created > 0) {
          uni.hideLoading()
          uni.showToast({
            title: `交案成功，已创建${scheduleResult.created}个日程`,
            icon: 'success',
            duration: 2000
          })
        } else {
          uni.hideLoading()
          uni.showToast({
            title: '交案成功',
            icon: 'success'
          })
        }
      } catch (scheduleError) {
        console.error('创建日程失败:', scheduleError)
        uni.hideLoading()
        uni.showToast({
          title: '交案成功，日程创建失败',
          icon: 'none'
        })
      }
    } else {
      uni.hideLoading()
      uni.showToast({
        title: '交案成功',
        icon: 'success'
      })
    }

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
.contract-confirm-page {
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

.form-divider {
  margin: 12rpx 0 24rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #606266;
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

.date-range {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.date-picker {
  flex: 1;
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

.date-text {
  font-size: 28rpx;
  color: #303133;
}

.placeholder {
  font-size: 28rpx;
  color: #C0C4CC;
}

.date-separator {
  font-size: 24rpx;
  color: #909399;
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
    background: #F0F2FF;
    border-color: #667eea;
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
    border-color: #667eea;
  }
}

.radio-dot {
  width: 16rpx;
  height: 16rpx;
  background: #667eea;
  border-radius: 50%;
}

.radio-label {
  font-size: 26rpx;
  color: #606266;

  .radio-item.active & {
    color: #667eea;
    font-weight: 500;
  }
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 24rpx;
  background: #F0F9FF;
  border-radius: 8rpx;
  border-left: 4rpx solid #409EFF;
  box-sizing: border-box;
  width: 100%;
}

.info-text {
  flex: 1;
  font-size: 26rpx;
  color: #409EFF;
  line-height: 1.6;
  word-break: break-word;
}

// 案件关键节点样式
.milestone-tip {
  background: #F0F9FF;
  border-left-color: #409EFF;
  
  .tip-text.blue {
    color: #409EFF;
  }
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

.milestone-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36rpx;
  height: 36rpx;
  border-radius: 6rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: #fff;
  margin-right: 12rpx;
  
  &.court {
    background: linear-gradient(135deg, #F56C6C 0%, #E74C3C 100%);
  }
  
  &.mediation {
    background: linear-gradient(135deg, #E6A23C 0%, #F39C12 100%);
  }
  
  &.payment {
    background: linear-gradient(135deg, #67C23A 0%, #27AE60 100%);
  }
  
  &.evidence {
    background: linear-gradient(135deg, #409EFF 0%, #3498DB 100%);
  }
}

.sub-item {
  margin-left: 48rpx;
  padding-left: 24rpx;
  border-left: 2rpx solid #EBEEF5;
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
