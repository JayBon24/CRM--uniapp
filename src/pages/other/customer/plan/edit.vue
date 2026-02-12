<!-- @ts-nocheck -->
<template>
  <view class="plan-edit-page">
    <scroll-view class="form-container" scroll-y>
      <view class="form-section">
        <view class="section-title">{{ pageTitle }}</view>

        <template v-if="!isCollectionMode && isEffectiveCase">
          <BusinessCardOCR
            ocrType="general"
            @recognized="handleCaseOcrRecognized"
          />
          <view class="form-item">
            <text class="label">项目名称</text>
            <input v-model="formData.extra_data.project_name" class="input" placeholder="请输入项目名称" placeholder-style="color: #C0C4CC" />
          </view>
          <view class="form-item required">
            <text class="label">欠付标的</text>
            <input v-model="formData.extra_data.debt_subject" class="input" placeholder="请输入欠付标的" placeholder-style="color: #C0C4CC" />
          </view>
          <view class="form-item required">
            <text class="label">项目背景</text>
            <textarea v-model="formData.extra_data.project_background" class="textarea short" placeholder="请输入项目背景" placeholder-style="color: #C0C4CC" :maxlength="300" />
          </view>
          <view class="form-item">
            <text class="label">备注</text>
            <textarea v-model="formData.extra_data.remark" class="textarea short" placeholder="请输入备注（非必填）" placeholder-style="color: #C0C4CC" :maxlength="200" />
          </view>

          <view class="form-divider">案件信息</view>
          <view class="form-item required">
            <text class="label">案件名称</text>
            <input v-model="formData.extra_data.case_name" class="input" placeholder="请输入案件名称" placeholder-style="color: #C0C4CC" />
          </view>
          <view class="form-item required">
            <text class="label">案件类型</text>
            <input v-model="formData.extra_data.case_type" class="input" placeholder="如：诉讼/仲裁/调解" placeholder-style="color: #C0C4CC" />
          </view>
          <view class="form-item">
            <text class="label">案件描述</text>
            <textarea v-model="formData.extra_data.case_description" class="textarea short" placeholder="请输入案件描述" placeholder-style="color: #C0C4CC" :maxlength="300" />
          </view>

          <view class="form-divider">原告信息</view>
          <CreditCodeAutoFill
            v-model="formData.extra_data.plaintiff_credit_code"
            v-model:companyNameModelValue="formData.extra_data.plaintiff_name"
            label="原告名称"
            placeholder="请输入原告名称"
            @select="handlePlaintiffSelect"
          />
          <view class="form-item">
            <text class="label">原告地址</text>
            <input v-model="formData.extra_data.plaintiff_address" class="input" placeholder="请输入原告地址" placeholder-style="color: #C0C4CC" />
          </view>
          <view class="form-item">
            <text class="label">法定代表人</text>
            <input v-model="formData.extra_data.plaintiff_legal_representative" class="input" placeholder="请输入法定代表人" placeholder-style="color: #C0C4CC" />
          </view>

          <view class="form-divider">被告信息</view>
          <CreditCodeAutoFill
            v-model="formData.extra_data.defendant_credit_code"
            v-model:companyNameModelValue="formData.extra_data.defendant_name"
            label="被告名称"
            placeholder="请输入被告名称"
            @select="handleDefendantSelect"
          />
          <view class="form-item">
            <text class="label">被告地址</text>
            <input v-model="formData.extra_data.defendant_address" class="input" placeholder="请输入被告地址" placeholder-style="color: #C0C4CC" />
          </view>
          <view class="form-item">
            <text class="label">法定代表人</text>
            <input v-model="formData.extra_data.defendant_legal_representative" class="input" placeholder="请输入法定代表人" placeholder-style="color: #C0C4CC" />
          </view>

          <view class="form-divider">金额信息</view>
          <view class="form-item">
            <text class="label">合同金额</text>
            <input v-model="formData.extra_data.contract_amount" class="input" type="number" placeholder="请输入合同金额" placeholder-style="color: #C0C4CC" />
          </view>
          <view class="form-item">
            <text class="label">律师费</text>
            <input v-model="formData.extra_data.lawyer_fee" class="input" type="number" placeholder="请输入律师费" placeholder-style="color: #C0C4CC" />
          </view>

          <view class="form-divider">诉讼信息</view>
          <view class="form-item">
            <text class="label">诉讼请求</text>
            <textarea v-model="formData.extra_data.litigation_request" class="textarea short" placeholder="请输入诉讼请求" placeholder-style="color: #C0C4CC" :maxlength="300" />
          </view>
          <view class="form-item">
            <text class="label">事实与理由</text>
            <textarea v-model="formData.extra_data.facts_and_reasons" class="textarea short" placeholder="请输入事实与理由" placeholder-style="color: #C0C4CC" :maxlength="500" />
          </view>
          <view class="form-item">
            <text class="label">管辖法院</text>
            <input v-model="formData.extra_data.jurisdiction" class="input" placeholder="请输入管辖法院" placeholder-style="color: #C0C4CC" />
          </view>
          <view class="form-item">
            <text class="label">立案日期</text>
            <input v-model="formData.extra_data.filing_date" class="input" placeholder="YYYY-MM-DD" placeholder-style="color: #C0C4CC" />
          </view>

          <view class="form-divider">其他信息</view>
          <view class="form-item">
            <text class="label">申请人</text>
            <input v-model="formData.extra_data.petitioner" class="input" placeholder="请输入申请人" placeholder-style="color: #C0C4CC" />
          </view>
          <view class="form-item">
            <text class="label">拟稿人</text>
            <input v-model="formData.extra_data.draft_person" class="input" placeholder="请输入拟稿人" placeholder-style="color: #C0C4CC" />
          </view>
        </template>

        <template v-else-if="!isCollectionMode">
          <view class="form-item required">
            <text class="label">{{ titleLabel }}</text>
            <textarea
              v-model="formData.title"
              class="textarea"
              placeholder="请输入计划事项内容"
              placeholder-style="color: #C0C4CC"
              :maxlength="500"
            />
            <view class="char-count">{{ formData.title.length }} / 500</view>
          </view>
        </template>

        <template v-else>
          <view class="form-item required">
            <text class="label">总金额（万）</text>
          <input
            v-model.number="collectionForm.total_amount"
            class="input"
            type="number"
            placeholder="请输入待收款总金额"
            placeholder-style="color: #C0C4CC"
            @blur="applyAverageAmounts"
          />
          </view>
          <view class="form-item required">
            <text class="label">期数</text>
            <input v-model.number="collectionForm.installment_count" class="input" type="number" min="1" placeholder="请输入期数" placeholder-style="color: #C0C4CC" @blur="handleInstallmentChange" />
          </view>
          <view class="form-item">
            <view class="toggle-row">
              <text class="label">收款金额</text>
              <view class="toggle-buttons">
                <view class="toggle-btn" :class="{ active: collectionForm.mode === 'average' }" @click="setCollectionMode('average')">平均</view>
                <view class="toggle-btn" :class="{ active: collectionForm.mode === 'manual' }" @click="setCollectionMode('manual')">自选</view>
              </view>
            </view>
            <view v-for="(item, index) in collectionForm.installments" :key="index" class="installment-row">
              <text class="installment-label">第{{ index + 1 }}期</text>
              <input
                v-model.number="item.amount"
                class="input"
                type="number"
                :disabled="collectionForm.mode === 'average'"
                placeholder="金额"
                placeholder-style="color: #C0C4CC"
              />
            </view>
          </view>
          <view class="form-item required">
            <text class="label">收款时间</text>
            <view v-for="(item, index) in collectionForm.installments" :key="index" class="installment-row">
              <text class="installment-label">第{{ index + 1 }}期</text>
              <view class="datetime-picker" @click="selectInstallmentTime(index)">
                <text v-if="item.time" class="datetime-text">{{ formatDateTime(item.time) }}</text>
                <text v-else class="placeholder">请选择时间</text>
                <SvgIcon name="calendar" :size="28" color="#909399" />
              </view>
            </view>
          </view>
        </template>
      </view>

      <view class="form-section">
        <view class="section-title">关联客户</view>
        <view class="client-info" @click="handleSelectClient">
          <SvgIcon name="user" :size="32" color="#667eea" />
          <text class="client-name">{{ clientName }}</text>
          <u-icon v-if="!isEdit" name="arrow-right" color="#ccc" size="16"></u-icon>
        </view>
      </view>

      <template v-if="!isCollectionMode">
        <view class="form-section">
          <view class="section-title">
            {{ timePointLabel }} <text class="required">*</text>
            <text class="tip-text">（可添加多个时间点）</text>
          </view>

          <view v-for="(timePoint, index) in formData.time_points" :key="index" class="time-point-item">
            <view class="datetime-picker" @click="selectTimePoint(index)">
              <text class="datetime-text">{{ formatDateTime(timePoint) }}</text>
              <SvgIcon name="calendar" :size="32" color="#909399" />
            </view>
            <view v-if="formData.time_points.length > 1" class="remove-btn" @click="removeTimePoint(index)">
              <SvgIcon name="close" :size="32" color="#F56C6C" />
            </view>
          </view>

          <view class="add-time-btn" @click="addTimePoint">
            <SvgIcon name="add" :size="28" color="#667eea" />
            <text class="add-text">添加时间点</text>
          </view>
        </view>
      </template>

      <view class="form-section">
        <view class="form-item">
          <view class="radio-group">
            <view
              v-for="method in remindMethods"
              :key="method.value"
              class="radio-item"
              :class="{ active: remindForm.remind_method === method.value }"
              @click="remindForm.remind_method = method.value"
            >
              <view class="radio-circle">
                <view v-if="remindForm.remind_method === method.value" class="radio-dot" />
              </view>
              <text class="radio-label">{{ method.label }}</text>
            </view>
          </view>
        </view>

        <view class="form-item">
          <view class="radio-group">
            <view
              v-for="advance in remindAdvances"
              :key="advance.value"
              class="radio-item"
              :class="{ active: remindForm.remind_advance === advance.value }"
              @click="remindForm.remind_advance = advance.value"
            >
              <view class="radio-circle">
                <view v-if="remindForm.remind_advance === advance.value" class="radio-dot" />
              </view>
              <text class="radio-label">{{ advance.label }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="form-section">
        <view class="form-item">
          <view class="switch-row">
            <text class="label">同步到日程</text>
            <switch
              :checked="remindForm.sync_to_schedule"
              @change="(e) => remindForm.sync_to_schedule = e.detail.value"
              color="#667eea"
            />
          </view>
          <text class="sync-hint">保存后自动在日程表中创建对应事项</text>
        </view>
      </view>
    </scroll-view>

    <view class="footer-actions">
      <view class="btn cancel-btn" @click="handleCancel">
        <text class="btn-text">取消</text>
      </view>
      <view class="btn submit-btn" @click="handleSubmit">
        <text class="btn-text">{{ isEdit ? '保存' : '创建' }}</text>
      </view>
    </view>

    <u-popup :show="showClientSelector" mode="bottom" @close="showClientSelector = false" round="16">
      <view class="selector-header">
        <text class="title">选择关联客户</text>
        <u-icon name="close" @click="showClientSelector = false"></u-icon>
      </view>
      <view class="selector-content">
        <view v-if="loadingClients" class="loading-box">
          <u-loading-icon mode="spinner"></u-loading-icon>
        </view>
        <view
          v-for="client in clientOptions"
          :key="client.id"
          class="user-item"
          @click="confirmClient(client)"
        >
          <view class="user-info">
            <text class="user-name">{{ client.client_name }}</text>
            <text class="user-role">{{ client.contact_name }} | {{ client.mobile }}</text>
          </view>
          <u-icon name="arrow-right" color="#ccc"></u-icon>
        </view>
      </view>
    </u-popup>

    <u-datetime-picker
      v-model:show="showTimePicker"
      v-model="currentTimeValue"
      mode="datetime"
      :minDate="minDate"
      @confirm="onTimeConfirm"
      @cancel="showTimePicker = false"
      @close="showTimePicker = false"
    />

    <u-datetime-picker
      v-model:show="showInstallmentPicker"
      v-model="installmentTimeValue"
      mode="datetime"
      :minDate="minDate"
      @confirm="onInstallmentTimeConfirm"
      @cancel="showInstallmentPicker = false"
      @close="showInstallmentPicker = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import SvgIcon from '@/components/SvgIcon/index.vue'
import BusinessCardOCR from '@/components/BusinessCardOCR/index.vue'
import CreditCodeAutoFill from '@/components/CreditCodeAutoFill/index.vue'
import { getClientDetail, getClientList, createPlan, updatePlan, getPlanList, createCollectionProgress, getCollectionProgressList } from '@/api/client'
import type { ClientPlanCreateParams, ClientPlanType } from '@/types/interfaces/client-plan'
import type { CollectionProgressCreateParams } from '@/types/interfaces/client-collection-progress'

const clientId = ref<number | string>('')
const clientName = ref('请选择客户')
const planId = ref<number | string>('')
const collectionId = ref<number | string>('')
const salesStage = ref('')

const isEdit = computed(() => !!planId.value || !!collectionId.value)
const isCollectionMode = computed(() => salesStage.value === 'WON')
const isEffectiveCase = computed(() => ['BLANK', 'MEETING'].includes(salesStage.value))

const planType = computed<ClientPlanType>(() => {
  if (isEffectiveCase.value) return 'effective_case'
  if (salesStage.value === 'PAYMENT') return '计划回款时间点'
  return 'case_plan'
})

const pageTitle = computed(() => {
  if (salesStage.value === 'WON') return '收款进度'
  if (isEffectiveCase.value) return '有效交案'
  if (salesStage.value === 'CASE') return '办案计划'
  if (salesStage.value === 'PAYMENT') return '计划回款时间点'
  return '计划'
})

const titleLabel = computed(() => {
  if (salesStage.value === 'PAYMENT') return '计划回款时间点'
  return '计划事项'
})

const timePointLabel = computed(() => {
  if (salesStage.value === 'PAYMENT') return '计划回款时间点'
  return '计划时间点'
})

const showClientSelector = ref(false)
const clientOptions = ref<any[]>([])
const loadingClients = ref(false)

const formData = ref({
  title: '',
  time_points: [dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')],
  remind_method: 'system' as 'system' | 'sms' | 'email',
  remind_advance: 30,
  sync_to_schedule: true,
  extra_data: {
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
  }
})

const collectionForm = ref({
  total_amount: null as number | null,
  installment_count: 2,
  mode: 'average' as 'average' | 'manual',
  installments: [] as Array<{ amount?: number; time?: string }>,
  remind_method: 'system' as 'system' | 'sms' | 'email',
  remind_advance: 30,
  sync_to_schedule: true
})

function handleCaseOcrRecognized(payload: any) {
  const raw = payload?.raw || {}
  const extracted = raw.extractedFields || {}
  const extra = formData.value.extra_data

  if (extracted.plaintiffName && !extra.plaintiff_name) {
    extra.plaintiff_name = extracted.plaintiffName
  }
  if (extracted.defendantName && !extra.defendant_name) {
    extra.defendant_name = extracted.defendantName
  }
  if (extracted.amount && !extra.contract_amount) {
    extra.contract_amount = String(extracted.amount)
  }
  if (raw.rawText) {
    if (!extra.case_description) {
      extra.case_description = raw.rawText
    } else if (!extra.project_background) {
      extra.project_background = raw.rawText
    }
  }
}

function handlePlaintiffSelect(candidate: any) {
  const extra = formData.value.extra_data
  if (candidate.legal_representative && !extra.plaintiff_legal_representative) {
    extra.plaintiff_legal_representative = candidate.legal_representative
  }
  if (candidate.address && !extra.plaintiff_address) {
    extra.plaintiff_address = candidate.address
  }
}

function handleDefendantSelect(candidate: any) {
  const extra = formData.value.extra_data
  if (candidate.legal_representative && !extra.defendant_legal_representative) {
    extra.defendant_legal_representative = candidate.legal_representative
  }
  if (candidate.address && !extra.defendant_address) {
    extra.defendant_address = candidate.address
  }
}

const remindMethods = [
  { value: 'system', label: '系统通知' },
  { value: 'sms', label: '短信' },
  { value: 'email', label: '邮件' }
]

const remindAdvances = [
  { value: 0, label: '准时' },
  { value: 15, label: '提前15分钟' },
  { value: 30, label: '提前30分钟' },
  { value: 60, label: '提前1小时' },
  { value: 1440, label: '提前1天' },
]

const remindForm = computed(() => (isCollectionMode.value ? collectionForm.value : formData.value))

const showTimePicker = ref(false)
const currentTimeValue = ref(Date.now())
const currentTimeIndex = ref(0)
const minDate = ref(Date.now())

const showInstallmentPicker = ref(false)
const installmentTimeValue = ref(Date.now())
const installmentIndex = ref(0)

onLoad(async (options: any) => {
  if (options?.clientId) {
    clientId.value = options.clientId
    fetchClientName(options.clientId)
  } else {
    clientName.value = '请选择客户'
    loadClientOptions()
  }

  if (options?.salesStage) {
    salesStage.value = options.salesStage
  }

  if (options?.id) {
    planId.value = options.id
    await loadPlanDetail(options.id)
  }

  if (options?.collectionId) {
    collectionId.value = options.collectionId
    await loadCollectionDetail(options.collectionId)
  }

  initInstallments()
})

async function fetchClientName(id: number | string) {
  try {
    const detail = await getClientDetail(id)
    clientName.value = detail.client_name
  } catch (error) {
    clientName.value = '未知客户'
  }
}

async function loadClientOptions() {
  loadingClients.value = true
  try {
    const res = await getClientList({ pageSize: 50 })
    clientOptions.value = res.rows
  } catch (error) {
    console.error('加载客户列表失败')
  } finally {
    loadingClients.value = false
  }
}

function handleSelectClient() {
  if (!isEdit.value) {
    showClientSelector.value = true
    if (clientOptions.value.length === 0) {
      loadClientOptions()
    }
  }
}

function confirmClient(client: any) {
  clientId.value = client.id
  clientName.value = client.client_name
  showClientSelector.value = false
}

async function loadPlanDetail(id: number | string) {
  if (!clientId.value) return
  try {
    const res = await getPlanList(clientId.value)
    const plan = res.rows.find((item: any) => String(item.id) === String(id))
    if (!plan) return
    formData.value.title = plan.title || ''
    formData.value.time_points = plan.time_points?.length ? plan.time_points : formData.value.time_points
    formData.value.remind_method = plan.remind_method || 'system'
    formData.value.remind_advance = plan.remind_advance || 30
    formData.value.sync_to_schedule = plan.sync_to_schedule !== false
    formData.value.extra_data = {
      project_name: plan.extra_data?.project_name || '',
      debt_subject: plan.extra_data?.debt_subject || '',
      project_background: plan.extra_data?.project_background || '',
      remark: plan.extra_data?.remark || '',
      case_name: plan.extra_data?.case_name || '',
      case_type: plan.extra_data?.case_type || '',
      case_description: plan.extra_data?.case_description || '',
      plaintiff_name: plan.extra_data?.plaintiff_name || '',
      plaintiff_credit_code: plan.extra_data?.plaintiff_credit_code || '',
      plaintiff_address: plan.extra_data?.plaintiff_address || '',
      plaintiff_legal_representative: plan.extra_data?.plaintiff_legal_representative || '',
      defendant_name: plan.extra_data?.defendant_name || '',
      defendant_credit_code: plan.extra_data?.defendant_credit_code || '',
      defendant_address: plan.extra_data?.defendant_address || '',
      defendant_legal_representative: plan.extra_data?.defendant_legal_representative || '',
      contract_amount: plan.extra_data?.contract_amount || '',
      lawyer_fee: plan.extra_data?.lawyer_fee || '',
      litigation_request: plan.extra_data?.litigation_request || '',
      facts_and_reasons: plan.extra_data?.facts_and_reasons || '',
      jurisdiction: plan.extra_data?.jurisdiction || '',
      filing_date: plan.extra_data?.filing_date || '',
      petitioner: plan.extra_data?.petitioner || '',
      draft_person: plan.extra_data?.draft_person || ''
    }
  } catch (error) {
    console.error('加载计划详情失败:', error)
  }
}

async function loadCollectionDetail(id: number | string) {
  if (!clientId.value) return
  try {
    const res = await getCollectionProgressList(clientId.value)
    const item = res.rows.find((row: any) => String(row.id) === String(id))
    if (!item) return
    collectionForm.value.total_amount = item.total_amount
    collectionForm.value.installment_count = item.installment_count
    collectionForm.value.mode = item.mode || 'manual'
    collectionForm.value.installments = item.installments || []
    collectionForm.value.remind_method = item.remind_method || 'system'
    collectionForm.value.remind_advance = item.remind_advance || 30
    collectionForm.value.sync_to_schedule = item.sync_to_schedule !== false
  } catch (error) {
    console.error('加载收款进度失败:', error)
  }
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return '请选择时间'
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}

function selectTimePoint(index: number) {
  currentTimeIndex.value = index
  currentTimeValue.value = new Date(formData.value.time_points[index]).getTime()
  showTimePicker.value = true
}

function onTimeConfirm(value: any) {
  const formattedTime = dayjs(value.value || value).format('YYYY-MM-DD HH:mm:ss')
  formData.value.time_points[currentTimeIndex.value] = formattedTime
  showTimePicker.value = false
}

function addTimePoint() {
  if (formData.value.time_points.length >= 10) {
    uni.showToast({ title: '最多添加10个时间点', icon: 'none' })
    return
  }
  const lastTime = formData.value.time_points[formData.value.time_points.length - 1]
  const nextTime = dayjs(lastTime).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  formData.value.time_points.push(nextTime)
}

function removeTimePoint(index: number) {
  if (formData.value.time_points.length <= 1) {
    uni.showToast({ title: '至少保留一个时间点', icon: 'none' })
    return
  }
  formData.value.time_points.splice(index, 1)
}

function initInstallments() {
  const count = Math.max(1, Number(collectionForm.value.installment_count) || 1)
  const current = collectionForm.value.installments || []
  collectionForm.value.installments = Array.from({ length: count }).map((_, idx) => current[idx] || {})
  if (collectionForm.value.mode === 'average') {
    applyAverageAmounts()
  }
}

function handleInstallmentChange() {
  initInstallments()
}

function setCollectionMode(mode: 'average' | 'manual') {
  collectionForm.value.mode = mode
  if (mode === 'average') {
    applyAverageAmounts()
  }
}

function applyAverageAmounts() {
  if (collectionForm.value.mode !== 'average') return
  const total = Number(collectionForm.value.total_amount || 0)
  const count = Math.max(1, Number(collectionForm.value.installment_count) || 1)
  if (!total || !count) return
  const avg = Number((total / count).toFixed(2))
  collectionForm.value.installments = Array.from({ length: count }).map((item, idx) => ({
    ...collectionForm.value.installments[idx],
    amount: avg
  }))
}

function selectInstallmentTime(index: number) {
  installmentIndex.value = index
  installmentTimeValue.value = Date.now()
  showInstallmentPicker.value = true
}

function onInstallmentTimeConfirm(value: any) {
  const formattedTime = dayjs(value.value || value).format('YYYY-MM-DD HH:mm:ss')
  collectionForm.value.installments[installmentIndex.value].time = formattedTime
  showInstallmentPicker.value = false
}

function handleCancel() {
  uni.showModal({
    title: '确认取消',
    content: '当前编辑的内容将不会保存',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    }
  })
}

function validatePlanForm() {
  if (!clientId.value) {
    uni.showToast({ title: '请选择客户', icon: 'none' })
    return false
  }
  if (isEffectiveCase.value) {
    const data = formData.value.extra_data
    if (!data.project_name || !data.debt_subject || !data.project_background || !data.case_name || !data.case_type) {
      uni.showToast({ title: '请完整填写有效交案信息', icon: 'none' })
      return false
    }
  } else if (!formData.value.title.trim()) {
    uni.showToast({ title: `请输入${titleLabel.value}`, icon: 'none' })
    return false
  }
  if (!formData.value.time_points.length) {
    uni.showToast({ title: '请至少添加一个时间点', icon: 'none' })
    return false
  }
  return true
}

function validateCollectionForm() {
  if (!clientId.value) {
    uni.showToast({ title: '请选择客户', icon: 'none' })
    return false
  }
  if (!collectionForm.value.total_amount || collectionForm.value.total_amount <= 0) {
    uni.showToast({ title: '请输入总金额', icon: 'none' })
    return false
  }
  if (!collectionForm.value.installment_count || collectionForm.value.installment_count <= 0) {
    uni.showToast({ title: '请输入期数', icon: 'none' })
    return false
  }
  if (collectionForm.value.installments.length !== collectionForm.value.installment_count) {
    initInstallments()
  }
  const missingTime = collectionForm.value.installments.some(item => !item.time)
  if (missingTime) {
    uni.showToast({ title: '请选择全部收款时间', icon: 'none' })
    return false
  }
  const missingAmount = collectionForm.value.installments.some(item => item.amount === undefined || item.amount === null)
  if (missingAmount) {
    uni.showToast({ title: '请填写全部收款金额', icon: 'none' })
    return false
  }
  if (collectionForm.value.mode === 'manual') {
    const sum = collectionForm.value.installments.reduce((acc, item) => acc + Number(item.amount || 0), 0)
    if (Math.abs(sum - Number(collectionForm.value.total_amount)) > 0.01) {
      uni.showToast({ title: '收款金额合计需等于总金额', icon: 'none' })
      return false
    }
  }
  return true
}

async function handleSubmit() {
  if (isCollectionMode.value) {
    if (!validateCollectionForm()) return
    try {
      uni.showLoading({ title: isEdit.value ? '保存中...' : '创建中...' })
      const payload: CollectionProgressCreateParams = {
        client_id: clientId.value,
        total_amount: Number(collectionForm.value.total_amount),
        installment_count: Number(collectionForm.value.installment_count),
        mode: collectionForm.value.mode,
        installments: collectionForm.value.installments,
        remind_method: collectionForm.value.remind_method,
        remind_advance: collectionForm.value.remind_advance,
        sync_to_schedule: collectionForm.value.sync_to_schedule
      }
      await createCollectionProgress(payload)
      uni.hideLoading()
      uni.showToast({ title: '创建成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)
    } catch (error) {
      uni.hideLoading()
      uni.showToast({ title: '操作失败，请重试', icon: 'none' })
      console.error('提交收款进度失败:', error)
    }
    return
  }

  if (!validatePlanForm()) return
  try {
    uni.showLoading({ title: isEdit.value ? '保存中...' : '创建中...' })
    const title = isEffectiveCase.value
      ? (formData.value.extra_data.project_name || '有效交案')
      : formData.value.title.trim()
    const submitData: ClientPlanCreateParams = {
      client_id: clientId.value,
      plan_type: planType.value,
      title,
      time_points: formData.value.time_points,
      remind_method: formData.value.remind_method,
      remind_advance: formData.value.remind_advance,
      sync_to_schedule: formData.value.sync_to_schedule,
      extra_data: formData.value.extra_data
    }

    if (isEdit.value && planId.value) {
      await updatePlan({ ...submitData, id: planId.value } as any)
    } else {
      await createPlan(submitData)
    }

    uni.hideLoading()
    uni.showToast({ title: isEdit.value ? '保存成功' : '创建成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '操作失败，请重试', icon: 'none' })
    console.error('提交计划失败:', error)
  }
}
</script>

<style scoped lang="scss">
.plan-edit-page {
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
  margin: 16rpx 0 24rpx;
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

.form-item {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &.required .label::before {
    content: '*';
    color: #F56C6C;
    margin-right: 6rpx;
  }
}

.label {
  display: block;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #606266;
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
  min-height: 200rpx;
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #303133;
  line-height: 1.6;
  border: 1rpx solid transparent;
  box-sizing: border-box;

  &.short {
    min-height: 120rpx;
  }

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

.client-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  background: #F0F2F5;
  border-radius: 8rpx;
}

.client-name {
  font-size: 28rpx;
  color: #303133;
  font-weight: 500;
}

.time-point-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.datetime-picker {
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

.datetime-text {
  font-size: 28rpx;
  color: #303133;
}

.placeholder {
  font-size: 28rpx;
  color: #C0C4CC;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
}

.add-time-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 72rpx;
  background: #F5F7FA;
  border: 1rpx dashed #DCDFE6;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.add-text {
  font-size: 26rpx;
  color: #667eea;
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

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sync-hint {
  font-size: 24rpx;
  color: #909399;
  margin-top: 12rpx;
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

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f2f5;
}

.selector-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20rpx 0;
}

.loading-box {
  padding: 100rpx 0;
  display: flex;
  justify-content: center;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f8f9fa;

  &:active {
    background: #f5f7fa;
  }
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 30rpx;
  color: #303133;
  font-weight: 500;
}

.user-role {
  font-size: 24rpx;
  color: #909399;
  margin-top: 4rpx;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.toggle-buttons {
  display: flex;
  gap: 12rpx;
}

.toggle-btn {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  background: #F5F7FA;
  font-size: 24rpx;
  color: #606266;

  &.active {
    background: #667eea;
    color: #fff;
  }
}

.installment-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.installment-label {
  width: 120rpx;
  font-size: 24rpx;
  color: #909399;
}
</style>
