<template>
  <view class="page ai-page">
    <view class="chat-header">
      <view class="header-left">
        <text class="header-title">{{ currentConversationTitle }}</text>
        <text class="header-scope" v-if="scopeHintText">{{ scopeHintText }}</text>
        <text class="header-capability" v-if="capabilityHintText">{{ capabilityHintText }}</text>
      </view>
      <view class="header-right">
        <button class="header-btn" @click="openConversationMenu">会话</button>
        <button class="header-btn primary" @click="createConversationByPrompt">新建</button>
      </view>
    </view>
    <scroll-view
      class="messages"
      :scroll-y="true"
      :scroll-with-animation="true"
      :scroll-into-view="scrollIntoView"
      :style="messagesStyle"
    >
      <view v-for="m in messages" :key="m.id" :id="m.id" class="msg" :class="m.role">
        <view class="bubble">
          <view v-if="m.attachments && m.attachments.length" class="attachment-list">
            <view
              v-for="(file, idx) in m.attachments"
              :key="`${m.id}-file-${idx}`"
              class="attachment-item"
              :class="{ 'is-file': file.type === 'file' }"
            >
              <image
                v-if="file.type === 'image'"
                :src="file.url"
                mode="aspectFill"
                class="attachment-image"
                @tap="previewAttachment(file)"
              />
              <view v-else class="attachment-file" @tap="openAttachment(file)">
                <SvgIcon name="file-document" :size="28" color="#64748b" />
                <text class="attachment-name">{{ file.name || '文件' }}</text>
              </view>
            </view>
          </view>
          <view v-if="m.messageType === 'card' && m.card" class="card-body">
            <view class="card-title">待确认操作</view>
            <view class="card-line">客户：{{ m.card.prefilled_fields?.customer_name || '-' }}</view>
            <view class="card-line">摘要：{{ m.card.prefilled_fields?.summary || '-' }}</view>
            <view class="card-line card-line-row">
              <text>时间：{{ m.card.prefilled_fields?.followup_time || '-' }}</text>
              <button
                class="inline-edit-btn"
                @click="openCardTimeEditor(m)"
                :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
              >
                选择时间
              </button>
            </view>
            <view class="card-line card-line-row">
              <text>
                方式：{{ m.card.prefilled_fields?.method || '-' }}
              {{ m.card.prefilled_fields?.method === 'OTHER' && m.card.prefilled_fields?.method_other ? `(${m.card.prefilled_fields?.method_other})` : '' }}
              </text>
              <button
                class="inline-edit-btn"
                @click="selectCardMethod(m)"
                :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
              >
                选择方式
              </button>
            </view>
            <view v-if="m.card.prefilled_fields?.method === 'OTHER'" class="candidate-search-row">
              <input
                class="candidate-search-input"
                :value="m.card.prefilled_fields?.method_other || ''"
                placeholder="请输入其他方式说明"
                placeholder-class="candidate-search-placeholder"
                :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
                @input="onCardMethodOtherInput(m, $event)"
              />
            </view>
            <view class="card-line">结论：{{ m.card.prefilled_fields?.conclusion || '-' }}</view>
            <view class="card-line">风险：{{ m.card.risk_level || 'low' }}</view>
            <view
              v-if="m.card.required_fields?.length"
              class="card-required"
            >
              必填字段：{{ renderRequiredFields(m.card) }}
            </view>
            <view v-if="m.card.missing_fields?.length" class="card-warn">
              缺少字段：{{ renderMissingFields(m.card) }}
            </view>
            <view class="card-candidates">
              <view class="candidate-title">选择客户（当前权限范围）</view>
              <view class="candidate-search-row">
                <input
                  class="candidate-search-input"
                  v-model="m.customerSearchKeyword"
                  placeholder="输入客户名，边输入边搜索"
                  placeholder-class="candidate-search-placeholder"
                  :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
                  @input="onCardCustomerInput(m)"
                />
                <button
                  class="candidate-search-btn"
                  @click="chooseCustomerForCard(m)"
                  :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
                >
                  搜索
                </button>
              </view>
              <view v-if="m.customerSearchLoading" class="card-hint">正在搜索客户...</view>
              <view v-else-if="m.card.customer_candidates?.length" class="candidate-list">
                <button
                  v-for="candidate in m.card.customer_candidates"
                  :key="`cand-${candidate.id}`"
                  class="candidate-btn"
                  @click="pickCustomerCandidate(m, candidate)"
                  :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
                >
                  {{ candidate.name }}
                </button>
              </view>
              <view v-else class="card-hint">未自动匹配到客户，可继续输入关键词搜索。</view>
            </view>
            <view class="card-candidates">
              <view class="candidate-title">内部参与人员（当前权限范围）</view>
              <view v-if="normalizedParticipants(m).length" class="participant-selected">
                <view
                  v-for="person in normalizedParticipants(m)"
                  :key="`p-selected-${person.id}`"
                  class="participant-chip"
                  @click="removeParticipantFromCard(m, person.id)"
                >
                  {{ person.name }}
                </view>
              </view>
              <view class="candidate-search-row">
                <input
                  class="candidate-search-input"
                  v-model="m.participantSearchKeyword"
                  placeholder="输入姓名，边输入边搜索参与人员"
                  placeholder-class="candidate-search-placeholder"
                  :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
                  @input="onCardParticipantInput(m)"
                />
                <button
                  class="candidate-search-btn"
                  @click="chooseParticipantsForCard(m)"
                  :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
                >
                  搜索
                </button>
              </view>
              <view v-if="m.participantSearchLoading" class="card-hint">正在搜索人员...</view>
              <view v-else-if="m.card.participants_candidates?.length" class="candidate-list">
                <button
                  v-for="candidate in m.card.participants_candidates"
                  :key="`p-candidate-${candidate.id}`"
                  class="candidate-btn"
                  @click="toggleParticipantCandidate(m, candidate)"
                  :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
                >
                  {{ isParticipantSelected(m, candidate.id) ? '已选 · ' : '' }}{{ candidate.name }}
                </button>
              </view>
              <view v-else class="card-hint">可输入姓名搜索后添加内部参与人员。</view>
            </view>
            <view class="card-actions">
              <button
                class="card-btn confirm"
                @click="confirmCard(m)"
                :disabled="isCardConfirmDisabled(m)"
              >
                确认
              </button>
              <button
                class="card-btn edit"
                @click="editCard(m)"
                :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
              >
                编辑
              </button>
              <button
                class="card-btn cancel"
                @click="cancelCard(m)"
                :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
              >
                取消
              </button>
              <button
                class="card-btn open-form"
                @click="openCardInForm(m)"
                :disabled="m.cardState === 'confirmed' || m.cardState === 'cancelled'"
              >
                去完善页
              </button>
            </view>
          </view>
          <text v-if="m.text" class="bubble-text">{{ m.text }}</text>
        </view>
      </view>
      <view v-if="loading" class="msg ai">
        <text class="bubble">AI 正在思考...</text>
      </view>
      <!-- 底部占位，防止输入框遮挡 -->
      <view id="bottom" style="height: 20rpx;"></view>
    </scroll-view>

    <view v-if="isRecording" class="recording-overlay">
      <view class="recording-panel" :class="{ canceling: isCanceling }">
        <u-icon name="mic" size="30" :color="isCanceling ? '#ef4444' : '#667eea'" />
        <text class="recording-text">{{ isCanceling ? '松开手指，取消发送' : '正在录音，上滑取消' }}</text>
      </view>
    </view>
    
    <view class="composer">
      <view class="composer-left">
        <view class="attach-btn" @click="handleAttach">
          <SvgIcon name="image" :size="36" color="#667eea" />
        </view>
      </view>
      <view class="composer-main">
        <view v-if="inputMode === 'keyboard'" class="input-wrapper">
          <input
            class="input with-send"
            v-model="input"
            type="text"
            placeholder="请输入问题"
            placeholder-class="input-placeholder"
          />
          <button class="send-btn" @click="send" :disabled="sending || !input.trim()">发送</button>
        </view>
        <view
          v-else
          class="voice-button"
          :class="{ recording: isRecording, canceling: isCanceling, recognizing: isRecognizing, disabled: isRecognizing }"
          @touchstart.stop="handleRecordStart"
          @touchend.stop="handleRecordEnd"
          @touchmove.stop.prevent="handleRecordMove"
          @touchcancel.stop="handleRecordCancel"
        >
          <u-icon name="mic" size="22" color="#667eea" />
          <text class="voice-text">{{ voiceButtonText }}</text>
        </view>
      </view>
      <view class="composer-right">
        <view class="mode-toggle" @click="toggleInputMode">
          <u-icon v-if="inputMode === 'voice'" name="edit-pen" size="20" color="#667eea" />
          <u-icon v-else name="mic" size="20" color="#667eea" />
          <text class="mode-text">{{ inputMode === 'voice' ? '键盘' : '语音' }}</text>
        </view>
      </view>
    </view>

    <u-datetime-picker
      v-model:show="showCardTimePicker"
      v-model="cardTimePickerValue"
      mode="datetime"
      @confirm="onCardTimeConfirm"
      @cancel="showCardTimePicker = false"
      @close="showCardTimePicker = false"
    />
  </view>
</template>

<script setup lang="ts">
// Vue API 通过 auto-imports 自动导入，无需显式导入
import { onShow, onHide } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import { AISocket } from '@/utils/ai-socket'
import { useUserStore } from '@/stores/user'
import { getEnvConfig } from '@/config/env'
import { createVoiceRecorder, type VoiceRecorder } from '@/utils/voiceRecorder'
import { recognizeVoice } from '@/api/voice'
import { uploadFileToServer } from '@/utils/upload'
import { recognizeGeneral } from '@/api/ocr'
import { extractDocumentText } from '@/api/document'
import { openAttachmentDocument, resolveAttachmentUrl } from '@/utils/attachment'
import {
  cancelTab3Action,
  clearTab3Conversation,
  createTab3Conversation,
  getTab3Capabilities,
  searchTab3Customers,
  searchTab3Users,
  deleteTab3Conversation,
  getTab3ConversationMessages,
  getTab3Scope,
  listTab3Conversations,
  updateTab3Conversation,
  type Tab3Conversation,
  type Tab3Message,
} from '@/api/ai'

const userStore = useUserStore()

type ChatAttachment = {
  url: string
  name?: string
  type: 'image' | 'file'
}

type ChatMessage = {
  id: string
  role: 'user' | 'ai' | 'system'
  text: string
  messageType?: 'text' | 'card' | 'action_result' | 'scope_hint' | 'error'
  operationId?: string
  card?: Record<string, any>
  cardState?: 'pending' | 'confirmed' | 'cancelled'
  customerSearchKeyword?: string
  customerSearchLoading?: boolean
  participantSearchKeyword?: string
  participantSearchLoading?: boolean
  attachments?: ChatAttachment[]
}

const messages = ref<ChatMessage[]>([])
const conversations = ref<Tab3Conversation[]>([])
const currentConversationId = ref<number | null>(null)
const scopeHintText = ref('')
const capabilityItems = ref<Array<Record<string, any>>>([])
const input = ref('')
const loading = ref(false)
const sending = ref(false)
const uploadingAttachment = ref(false)
const inputMode = ref<'keyboard' | 'voice'>('keyboard')
const isRecording = ref(false)
const isCanceling = ref(false)
const recordingDuration = ref(0)
const isRecognizing = ref(false)
const scrollIntoView = ref('bottom')
const messagesHeightPx = ref(0)

let socket: AISocket | null = null
let recorder: VoiceRecorder | null = null
let recordTimer: ReturnType<typeof setInterval> | null = null
let touchStartY = 0
let isStopping = false
let currentAiMessageId: string | null = null
const onWindowResizeHandler = () => {
  recalcMessagesHeight()
}
const showCardTimePicker = ref(false)
const cardTimePickerValue = ref(Date.now())
const editingCardMessageId = ref<string | null>(null)
const customerSearchTimerMap = new Map<string, ReturnType<typeof setTimeout>>()
const participantSearchTimerMap = new Map<string, ReturnType<typeof setTimeout>>()

const maxRecordSeconds = 60
const minRecordSeconds = 1
const cancelThreshold = 60
// 使用统一的配置管理，优先使用环境变量，否则使用默认值
const envConfig = getEnvConfig()
// baseApi 应该是基础 URL，不包含路径，例如：https://api.wanfanglaw.cn 或 http://127.0.0.1:8000
const baseApi = (envConfig.apiBaseUrl || 'https://api.wanfanglaw.cn').replace(/\/$/, '')
const voiceButtonText = computed(() => {
  if (isRecognizing.value) return '识别中...'
  if (isRecording.value) return isCanceling.value ? '松开取消' : '松开结束'
  return '按住说话'
})
const currentConversationTitle = computed(() => {
  if (!currentConversationId.value) return 'AI 助理'
  const current = conversations.value.find(item => Number(item.id) === Number(currentConversationId.value))
  return current?.title || 'AI 助理'
})
const capabilityHintText = computed(() => {
  const enabled = (capabilityItems.value || []).filter(item => item?.enabled)
  if (!enabled.length) return ''
  const readCount = enabled.filter(item => item?.mode === 'read').length
  const writeCount = enabled.filter(item => item?.mode === 'write').length
  return `可执行能力：查询${readCount}项，写入${writeCount}项（写入需确认）`
})
const messagesStyle = computed(() => {
  if (!messagesHeightPx.value) return 'flex:1;min-height:0;'
  return `height:${messagesHeightPx.value}px;min-height:${messagesHeightPx.value}px;`
})

function recalcMessagesHeight() {
  nextTick(() => {
    const query = uni.createSelectorQuery()
    query.select('.chat-header').boundingClientRect()
    query.select('.composer').boundingClientRect()
    query.exec((rects: any[]) => {
      const headerRect = rects?.[0]
      const composerRect = rects?.[1]
      if (headerRect && composerRect) {
        const height = Math.floor((composerRect.top || 0) - (headerRect.bottom || 0))
        messagesHeightPx.value = Math.max(260, height)
        return
      }
      const sys = uni.getSystemInfoSync()
      const safeBottom = (sys as any)?.safeAreaInsets?.bottom || 0
      const headerApprox = uni.upx2px(140)
      const composerApprox = uni.upx2px(132) + uni.upx2px(100) + safeBottom
      const fallback = Math.floor((sys.windowHeight || 640) - headerApprox - composerApprox)
      messagesHeightPx.value = Math.max(260, fallback)
    })
  })
}

function detectMissingFields(card: Record<string, any> | undefined): string[] {
  if (!card) return []
  const prefilled = card.prefilled_fields || {}
  const required = Array.isArray(card.required_fields) && card.required_fields.length
    ? card.required_fields
    : (Array.isArray(card.missing_fields) ? card.missing_fields : [])
  const missing: string[] = []
  required.forEach((field: string) => {
    const value = prefilled?.[field]
    if (value === undefined || value === null) {
      missing.push(field)
      return
    }
    if (typeof value === 'string' && !value.trim()) {
      missing.push(field)
      return
    }
    if (Array.isArray(value) && !value.length) {
      missing.push(field)
    }
  })
  return missing
}

function syncCardMissingFields(card: Record<string, any> | undefined) {
  if (!card) return
  card.missing_fields = detectMissingFields(card)
}

function resolveFieldLabel(card: Record<string, any> | undefined, field: string): string {
  const meta = card?.field_meta || {}
  return meta?.[field]?.label || field
}

function renderRequiredFields(card: Record<string, any> | undefined): string {
  const required = Array.isArray(card?.required_fields) ? card.required_fields : []
  if (!required.length) return '-'
  return required.map((field: string) => resolveFieldLabel(card, field)).join('、')
}

function renderMissingFields(card: Record<string, any> | undefined): string {
  const missing = detectMissingFields(card)
  if (!missing.length) return '-'
  return missing.map((field: string) => resolveFieldLabel(card, field)).join('、')
}

function isCardConfirmDisabled(message: ChatMessage): boolean {
  if (message.cardState === 'confirmed' || message.cardState === 'cancelled') return true
  return detectMissingFields(message.card).length > 0
}

function pickCustomerCandidate(message: ChatMessage, candidate: Record<string, any>) {
  if (!message.card) message.card = {}
  if (!message.card.prefilled_fields) message.card.prefilled_fields = {}
  message.card.prefilled_fields.client_id = candidate?.id
  message.card.prefilled_fields.customer_name = candidate?.name || ''
  message.customerSearchKeyword = candidate?.name || message.customerSearchKeyword || ''
  syncCardMissingFields(message.card)
}

function normalizedParticipants(message: ChatMessage): Array<{ id: number; name: string }> {
  const source = message.card?.prefilled_fields?.internal_participants
  if (!Array.isArray(source)) return []
  const rows: Array<{ id: number; name: string }> = []
  source.forEach((item: any) => {
    if (item === null || item === undefined) return
    if (typeof item === 'object') {
      const id = Number(item.id)
      if (!id) return
      rows.push({ id, name: String(item.name || item.username || `用户${id}`) })
      return
    }
    const id = Number(item)
    if (!id) return
    rows.push({ id, name: `用户${id}` })
  })
  const dedup = new Map<number, { id: number; name: string }>()
  rows.forEach((row) => dedup.set(row.id, row))
  return Array.from(dedup.values())
}

function isParticipantSelected(message: ChatMessage, candidateId: number) {
  return normalizedParticipants(message).some(item => Number(item.id) === Number(candidateId))
}

function toggleParticipantCandidate(message: ChatMessage, candidate: Record<string, any>) {
  if (!message.card) message.card = {}
  if (!message.card.prefilled_fields) message.card.prefilled_fields = {}
  const participants = normalizedParticipants(message)
  const current = new Map<number, { id: number; name: string }>()
  participants.forEach(item => current.set(Number(item.id), item))
  const candidateId = Number(candidate?.id)
  if (!candidateId) return
  if (current.has(candidateId)) {
    current.delete(candidateId)
  } else {
    current.set(candidateId, { id: candidateId, name: String(candidate?.name || `用户${candidateId}`) })
  }
  message.card.prefilled_fields.internal_participants = Array.from(current.values())
}

function removeParticipantFromCard(message: ChatMessage, participantId: number) {
  if (!message.card?.prefilled_fields) return
  const filtered = normalizedParticipants(message).filter(item => Number(item.id) !== Number(participantId))
  message.card.prefilled_fields.internal_participants = filtered
}

function inferCustomerKeyword(message: ChatMessage): string {
  const name = String(message.card?.prefilled_fields?.customer_name || '').trim()
  if (name) return name
  const summary = String(message.card?.prefilled_fields?.summary || '')
  const matched = summary.match(/(?:去了|到|拜访|跟进)\s*([^\s，。,；;：:]{2,20})/)
  return matched?.[1]?.trim() || ''
}

async function chooseCustomerForCard(message: ChatMessage) {
  await searchCustomersForCard(message, true)
}

function onCardCustomerInput(message: ChatMessage) {
  if (message.cardState === 'confirmed' || message.cardState === 'cancelled') return
  const key = message.id
  const existed = customerSearchTimerMap.get(key)
  if (existed) {
    clearTimeout(existed)
  }
  const timer = setTimeout(() => {
    void searchCustomersForCard(message, false)
  }, 300)
  customerSearchTimerMap.set(key, timer)
}

async function searchCustomersForCard(message: ChatMessage, fromButton: boolean) {
  if (message.cardState === 'confirmed' || message.cardState === 'cancelled') return
  const keyword = String(message.customerSearchKeyword || '').trim() || inferCustomerKeyword(message)
  message.customerSearchKeyword = keyword
  if (!keyword) {
    if (fromButton) {
      uni.showToast({ title: '请输入客户关键词', icon: 'none' })
    }
    return
  }
  if (!message.card) message.card = {}
  message.customerSearchLoading = true
  try {
    const rows = await searchTab3Customers(keyword, 10)
    message.card.customer_candidates = rows
    if (!rows.length && fromButton) {
      uni.showToast({ title: '未找到匹配客户', icon: 'none' })
      return
    }
    if (rows.length === 1) {
      pickCustomerCandidate(message, rows[0] as any)
      if (fromButton) {
        uni.showToast({ title: '已自动选中客户', icon: 'none' })
      }
    }
  } catch (error: any) {
    if (fromButton) {
      uni.showToast({ title: error?.message || '搜索客户失败', icon: 'none' })
    }
  } finally {
    message.customerSearchLoading = false
  }
}

async function chooseParticipantsForCard(message: ChatMessage) {
  await searchParticipantsForCard(message, true)
}

function onCardParticipantInput(message: ChatMessage) {
  if (message.cardState === 'confirmed' || message.cardState === 'cancelled') return
  const key = message.id
  const existed = participantSearchTimerMap.get(key)
  if (existed) clearTimeout(existed)
  const timer = setTimeout(() => {
    void searchParticipantsForCard(message, false)
  }, 300)
  participantSearchTimerMap.set(key, timer)
}

async function searchParticipantsForCard(message: ChatMessage, fromButton: boolean) {
  if (message.cardState === 'confirmed' || message.cardState === 'cancelled') return
  const keyword = String(message.participantSearchKeyword || '').trim()
  if (!keyword) {
    if (fromButton) uni.showToast({ title: '请输入姓名关键词', icon: 'none' })
    return
  }
  if (!message.card) message.card = {}
  message.participantSearchLoading = true
  try {
    const rows = await searchTab3Users(keyword, 10)
    message.card.participants_candidates = rows
    if (!rows.length && fromButton) {
      uni.showToast({ title: '未找到匹配人员', icon: 'none' })
      return
    }
    if (rows.length === 1) {
      toggleParticipantCandidate(message, rows[0] as any)
    }
  } catch (error: any) {
    if (fromButton) {
      uni.showToast({ title: error?.message || '搜索人员失败', icon: 'none' })
    }
  } finally {
    message.participantSearchLoading = false
  }
}

function onCardMethodOtherInput(message: ChatMessage, event: any) {
  if (!message.card) message.card = {}
  if (!message.card.prefilled_fields) message.card.prefilled_fields = {}
  const value = String(event?.detail?.value || '').trim()
  message.card.prefilled_fields.method_other = value
}

function openCardTimeEditor(message: ChatMessage) {
  editingCardMessageId.value = message.id
  const raw = String(message.card?.prefilled_fields?.followup_time || '').trim()
  const parsed = raw ? dayjs(raw) : dayjs()
  cardTimePickerValue.value = parsed.isValid() ? parsed.valueOf() : Date.now()
  showCardTimePicker.value = true
}

function selectCardMethod(message: ChatMessage) {
  if (!message.card) message.card = {}
  if (!message.card.prefilled_fields) message.card.prefilled_fields = {}
  const options = [
    { label: '电话', value: 'PHONE' },
    { label: '微信', value: 'WECHAT' },
    { label: '邮件', value: 'EMAIL' },
    { label: '面谈', value: 'VISIT' },
    { label: '其他', value: 'OTHER' },
  ]
  uni.showActionSheet({
    itemList: options.map(item => item.label),
    success: (res) => {
      const chosen = options[res.tapIndex]
      if (!chosen) return
      message.card!.prefilled_fields.method = chosen.value
      if (chosen.value !== 'OTHER') {
        message.card!.prefilled_fields.method_other = ''
      }
    }
  })
}

function onCardTimeConfirm(e: any) {
  const messageId = editingCardMessageId.value
  if (!messageId) {
    showCardTimePicker.value = false
    return
  }
  const target = messages.value.find(item => item.id === messageId)
  if (!target?.card) {
    showCardTimePicker.value = false
    editingCardMessageId.value = null
    return
  }
  if (!target.card.prefilled_fields) target.card.prefilled_fields = {}
  target.card.prefilled_fields.followup_time = dayjs(e?.value || Date.now()).format('YYYY-MM-DD HH:mm:ss')
  syncCardMissingFields(target.card)
  showCardTimePicker.value = false
  editingCardMessageId.value = null
}

async function refreshScopeHint() {
  try {
    const scope = await getTab3Scope()
    scopeHintText.value = scope?.scope_text || ''
  } catch {}
}

async function refreshCapabilities() {
  try {
    const capabilities = await getTab3Capabilities()
    capabilityItems.value = capabilities?.items || []
  } catch {}
}

async function refreshTab3Meta() {
  await Promise.allSettled([
    refreshScopeHint(),
    refreshCapabilities(),
  ])
}

function appendMessage(
  role: 'user' | 'ai' | 'system',
  text: string,
  attachments?: ChatAttachment[],
  extra?: Partial<ChatMessage>,
) {
  const id = `msg-${Date.now()}-${Math.random()}`
  const customerKeyword = String(extra?.card?.prefilled_fields?.customer_name || '').trim()
  messages.value.push({
    id,
    role,
    text,
    messageType: extra?.messageType || 'text',
    operationId: extra?.operationId,
    card: extra?.card,
    cardState: extra?.cardState || 'pending',
    customerSearchKeyword: extra?.customerSearchKeyword ?? customerKeyword,
    customerSearchLoading: false,
    participantSearchKeyword: extra?.participantSearchKeyword ?? '',
    participantSearchLoading: false,
    attachments: attachments?.length ? attachments : undefined
  })
  // 滚动到底部（使用 scroll-into-view）
  nextTick(() => {
    scrollIntoView.value = 'bottom'
    recalcMessagesHeight()
  })
  return id
}

function getOperationIdFromMessage(message: ChatMessage): string {
  return (
    message.operationId ||
    message.card?.operation_id ||
    message.card?.operationId ||
    ''
  )
}

function mapServerMessage(item: Tab3Message): ChatMessage | null {
  const payload = item?.content_json || {}
  const text = String(payload.text || payload.answer || payload.message || '')
  const attachmentRows = Array.isArray(payload.attachments) ? payload.attachments : []
  const attachments: ChatAttachment[] = attachmentRows
    .filter((url: any) => typeof url === 'string' && !!url)
    .map((url: string, index: number) => ({
      url,
      name: `附件${index + 1}`,
      type: isImageFile(url) ? 'image' : 'file'
    }))
  if (item.message_type === 'card') {
    const card = payload.card || payload
    const status = String(card?.status || '').toLowerCase()
    const cardState: ChatMessage['cardState'] = status === 'executed'
      ? 'confirmed'
      : (status === 'cancelled' ? 'cancelled' : 'pending')
    return {
      id: `msg-${item.id}`,
      role: item.role === 'user' ? 'user' : 'ai',
      text: '',
      messageType: 'card',
      card,
      operationId: payload?.card?.operation_id || payload?.operation_id,
      cardState,
      customerSearchKeyword: String(card?.prefilled_fields?.customer_name || '').trim(),
      participantSearchKeyword: '',
      customerSearchLoading: false,
      participantSearchLoading: false,
    }
  }
  if (item.message_type === 'action_result') {
    return {
      id: `msg-${item.id}`,
      role: 'ai',
      text: payload?.success ? `操作成功${payload.record_id ? `，记录ID：${payload.record_id}` : ''}` : (payload?.error || '操作结果已返回'),
      messageType: 'action_result'
    }
  }
  if (item.message_type === 'scope_hint') {
    const scopeText = String(payload.scope_text || payload.scopeText || '')
    if (scopeText) {
      scopeHintText.value = scopeText
    }
    return null
  }
  return {
    id: `msg-${item.id}`,
    role: item.role === 'user' ? 'user' : 'ai',
    text,
    messageType: 'text',
    attachments: attachments.length ? attachments : undefined
  }
}

async function loadConversationMessages(conversationId: number) {
  try {
    const data = await getTab3ConversationMessages(conversationId, 300)
    messages.value = (data?.rows || [])
      .map(mapServerMessage)
      .filter((item): item is ChatMessage => !!item)
    currentAiMessageId = null
    nextTick(() => {
      scrollIntoView.value = 'bottom'
      recalcMessagesHeight()
    })
  } catch (error) {
    console.warn('[Tab3] 加载会话消息失败', error)
    messages.value = []
  }
}

function getCurrentConversationSessionId(): string | null {
  if (!socket || !currentConversationId.value) return null
  const map = socket.getSessionMap()
  return map[String(currentConversationId.value)] || null
}

async function loadConversations(preferredConversationId?: number | null) {
  const res = await listTab3Conversations()
  conversations.value = res?.rows || []

  if (!conversations.value.length) {
    const created = await createTab3Conversation({ title: '新会话' })
    conversations.value = [created]
    currentConversationId.value = created.id
    await loadConversationMessages(created.id)
    socket?.setConversation(created.id, created.session_id || null)
    await refreshScopeHint()
    return
  }

  const targetId = preferredConversationId || currentConversationId.value || conversations.value[0].id
  const found = conversations.value.find(item => Number(item.id) === Number(targetId))
  const active = found || conversations.value[0]
  currentConversationId.value = active.id
  await loadConversationMessages(active.id)
  socket?.setConversation(active.id, active.session_id || null)
  await refreshScopeHint()
}

async function switchConversation(conversationId: number) {
  currentConversationId.value = conversationId
  await loadConversationMessages(conversationId)
  ensureSocket()
  socket?.setConversation(conversationId, getCurrentConversationSessionId())
  socket?.sendSwitchConversation(conversationId)
  await refreshScopeHint()
}

async function createConversationByPrompt() {
  uni.showModal({
    title: '新建会话',
    editable: true,
    placeholderText: '请输入会话标题（可选）',
    success: async (res) => {
      if (!res.confirm) return
      try {
        const title = (res.content || '').trim() || '新会话'
        const created = await createTab3Conversation({ title })
        await loadConversations(created.id)
        ensureSocket()
        socket?.setConversation(created.id, created.session_id || null)
        await refreshScopeHint()
      } catch (error: any) {
        uni.showToast({ title: error?.message || '创建会话失败', icon: 'none' })
      }
    }
  })
}

async function renameConversation(conversation: Tab3Conversation) {
  uni.showModal({
    title: '重命名会话',
    editable: true,
    placeholderText: '请输入新标题',
    content: conversation.title || '',
    success: async (res) => {
      if (!res.confirm) return
      const title = (res.content || '').trim()
      if (!title) return
      try {
        await updateTab3Conversation(conversation.id, { title })
        await loadConversations(conversation.id)
      } catch (error: any) {
        uni.showToast({ title: error?.message || '重命名失败', icon: 'none' })
      }
    }
  })
}

async function pinConversation(conversation: Tab3Conversation) {
  try {
    await updateTab3Conversation(conversation.id, { pinned: !conversation.pinned })
    await loadConversations(conversation.id)
  } catch (error: any) {
    uni.showToast({ title: error?.message || '置顶操作失败', icon: 'none' })
  }
}

async function clearConversation(conversation: Tab3Conversation) {
  try {
    await clearTab3Conversation(conversation.id)
    if (Number(currentConversationId.value) === Number(conversation.id)) {
      messages.value = []
      currentAiMessageId = null
    }
    await loadConversations(conversation.id)
  } catch (error: any) {
    uni.showToast({ title: error?.message || '清空失败', icon: 'none' })
  }
}

async function removeConversation(conversation: Tab3Conversation) {
  try {
    await deleteTab3Conversation(conversation.id)
    const fallback = conversations.value.find(item => Number(item.id) !== Number(conversation.id))
    await loadConversations(fallback?.id || null)
  } catch (error: any) {
    uni.showToast({ title: error?.message || '删除失败', icon: 'none' })
  }
}

function manageCurrentConversation() {
  const current = conversations.value.find(item => Number(item.id) === Number(currentConversationId.value))
  if (!current) return
  const pinText = current.pinned ? '取消置顶' : '置顶'
  uni.showActionSheet({
    itemList: ['重命名', pinText, '清空消息', '删除会话'],
    success: async (res) => {
      if (res.tapIndex === 0) {
        await renameConversation(current)
      } else if (res.tapIndex === 1) {
        await pinConversation(current)
      } else if (res.tapIndex === 2) {
        await clearConversation(current)
      } else if (res.tapIndex === 3) {
        await removeConversation(current)
      }
    }
  })
}

function openConversationMenu() {
  if (!conversations.value.length) {
    void loadConversations()
    return
  }
  const itemList = conversations.value.map(item => `${item.pinned ? '[置顶] ' : ''}${item.title}`)
  itemList.push('管理当前会话')
  uni.showActionSheet({
    itemList,
    success: async (res) => {
      if (res.tapIndex === itemList.length - 1) {
        manageCurrentConversation()
        return
      }
      const selected = conversations.value[res.tapIndex]
      if (selected) {
        await switchConversation(selected.id)
      }
    }
  })
}

function confirmCard(message: ChatMessage) {
  const operationId = getOperationIdFromMessage(message)
  if (!operationId) {
    uni.showToast({ title: '缺少操作ID', icon: 'none' })
    return
  }
  syncCardMissingFields(message.card)
  if (detectMissingFields(message.card).length) {
    uni.showToast({ title: '请先补全必填字段', icon: 'none' })
    return
  }
  ensureSocket()
  socket?.confirmAction(
    operationId,
    message.card?.prefilled_fields || {},
    `${Date.now()}-${Math.random()}`
  )
}

function editCard(message: ChatMessage) {
  const operationId = getOperationIdFromMessage(message)
  if (!operationId) {
    uni.showToast({ title: '缺少操作ID', icon: 'none' })
    return
  }
  if (!message.card) message.card = {}
  if (!message.card.prefilled_fields) message.card.prefilled_fields = {}
  const editableFields = [
    { key: 'customer', label: '客户', placeholder: '搜索并选择客户' },
    { key: 'participants', label: '内部参与人员', placeholder: '搜索并选择内部参与人员' },
    { key: 'summary', label: '跟进摘要', placeholder: '请输入跟进摘要' },
    { key: 'followup_time', label: '跟进时间', placeholder: 'YYYY-MM-DD HH:mm:ss' },
    { key: 'method', label: '跟进方式', placeholder: 'PHONE/WECHAT/EMAIL/VISIT/OTHER' },
    { key: 'conclusion', label: '关键结论', placeholder: '请输入关键结论（可选）' },
  ]
  uni.showActionSheet({
    itemList: editableFields.map(item => `编辑${item.label}`),
    success: (sheetRes) => {
      const target = editableFields[sheetRes.tapIndex]
      if (!target) return
      if (target.key === 'customer') {
        void chooseCustomerForCard(message)
        return
      }
      if (target.key === 'participants') {
        void chooseParticipantsForCard(message)
        return
      }
      const currentValue = String(message.card?.prefilled_fields?.[target.key] || '')
      if (target.key === 'followup_time') {
        openCardTimeEditor(message)
        return
      }
      if (target.key === 'method') {
        selectCardMethod(message)
        return
      }
      uni.showModal({
        title: `编辑${target.label}`,
        editable: true,
        content: currentValue,
        placeholderText: target.placeholder,
        success: (res) => {
          if (!res.confirm) return
          const value = target.key === 'conclusion' ? String(res.content || '') : String(res.content || '').trim()
          message.card!.prefilled_fields[target.key] = value
          syncCardMissingFields(message.card)
          uni.showToast({ title: '已更新卡片内容', icon: 'none' })
        }
      })
    }
  })
}

async function cancelCard(message: ChatMessage) {
  const operationId = getOperationIdFromMessage(message)
  if (!operationId) {
    uni.showToast({ title: '缺少操作ID', icon: 'none' })
    return
  }
  message.cardState = 'cancelled'
  ensureSocket()
  socket?.cancelAction(operationId)
  try {
    await cancelTab3Action(operationId)
  } catch {}
}

function openCardInForm(message: ChatMessage) {
  const operationId = getOperationIdFromMessage(message)
  if (!operationId) {
    uni.showToast({ title: '缺少操作ID', icon: 'none' })
    return
  }
  const clientId = message.card?.prefilled_fields?.client_id
  if (!clientId) {
    uni.showToast({ title: '请先在卡片中选择客户', icon: 'none' })
    return
  }
  const encodedOp = encodeURIComponent(operationId)
  const encodedClientId = encodeURIComponent(String(clientId))
  uni.navigateTo({
    url: `/pages/other/customer/followup/create?ai_operation_id=${encodedOp}&clientId=${encodedClientId}&ai_source=tab3`
  })
}

async function toggleInputMode() {
  if (isRecording.value || isRecognizing.value) return
  if (inputMode.value === 'keyboard') {
    if (!(await ensureRecordPermission())) return
    uni.hideKeyboard()
  }
  inputMode.value = inputMode.value === 'keyboard' ? 'voice' : 'keyboard'
}

async function ensureRecordPermission(): Promise<boolean> {
  try {
    const res = await uni.getSetting()
    const auth = res.authSetting?.['scope.record']
    if (auth === true) return true
    if (auth === false) {
      uni.showModal({
        title: '需要录音权限',
        content: '使用语音输入功能需要麦克风权限，请在设置中开启',
        confirmText: '去设置',
        success: (r) => r.confirm && uni.openSetting()
      })
      return false
    }
    try {
      await uni.authorize({ scope: 'scope.record' })
      return true
    } catch {
      return false
    }
  } catch {
    return false
  }
}

function ensureRecorder() {
  if (!recorder) {
    recorder = createVoiceRecorder()
  }
}

function startRecordTimer() {
  stopRecordTimer()
  recordTimer = setInterval(() => {
    if (!recorder || !isRecording.value) return
    const duration = Math.floor(recorder.getDuration() / 1000)
    recordingDuration.value = duration
    if (duration >= maxRecordSeconds) {
      finishRecord(false, true)
    }
  }, 200)
}

function stopRecordTimer() {
  if (recordTimer) {
    clearInterval(recordTimer)
    recordTimer = null
  }
}

async function handleRecordStart(event: any) {
  if (inputMode.value !== 'voice' || isRecording.value || isRecognizing.value) return
  if (!(await ensureRecordPermission())) return
  
  ensureRecorder()
  const touch = event.touches?.[0]
  touchStartY = touch?.clientY || 0
  isCanceling.value = false
  recordingDuration.value = 0
  isRecording.value = true

  try {
    await recorder?.start({ duration: maxRecordSeconds * 1000 })
    startRecordTimer()
  } catch (error) {
    isRecording.value = false
    stopRecordTimer()
    console.error('[Tab3] Start record failed:', error)
    uni.showToast({ title: '录音启动失败', icon: 'none' })
  }
}

function handleRecordMove(event: any) {
  if (!isRecording.value) return
  const touch = event.touches?.[0]
  if (!touch) return
  const deltaY = touchStartY - touch.clientY
  isCanceling.value = deltaY > cancelThreshold
}

function handleRecordEnd() {
  if (!isRecording.value || isStopping) return
  finishRecord(isCanceling.value)
}

function handleRecordCancel() {
  if (!isRecording.value || isStopping) return
  finishRecord(true)
}

async function finishRecord(cancelled: boolean, isTimeout = false) {
  if (isStopping) return
  isStopping = true
  isRecording.value = false
  stopRecordTimer()

  if (!recorder) {
    isStopping = false
    return
  }

  try {
    const result = await recorder.stop()
    const durationSeconds = Math.round(result.duration / 1000)
    recordingDuration.value = durationSeconds

    if (cancelled) {
      uni.showToast({ title: '已取消录音', icon: 'none' })
      return
    }

    if (durationSeconds < minRecordSeconds) {
      uni.showToast({ title: '录音时间太短', icon: 'none' })
      return
    }

    if (isTimeout) {
      uni.showToast({ title: '已达最长录音时间', icon: 'none' })
    }

    await recognizeAndSend(result.tempFilePath)
  } catch (error) {
    if (!cancelled) {
      console.error('[Tab3] Stop record failed:', error)
      uni.showToast({ title: '录音失败，请重试', icon: 'none' })
    }
  } finally {
    isCanceling.value = false
    isStopping = false
  }
}

async function forceResetRecording() {
  stopRecordTimer()
  const wasRecording = isRecording.value
  isRecording.value = false
  isCanceling.value = false
  isRecognizing.value = false
  isStopping = false
  recordingDuration.value = 0
  if (wasRecording && recorder) {
    try {
      await recorder.stop()
    } catch {}
  }
}

async function recognizeAndSend(filePath: string) {
  isRecognizing.value = true
  try {
    const result = await recognizeVoice(filePath, baseApi)
    const text = result?.text?.trim()
    if (!text) {
      uni.showToast({ title: '未识别到内容', icon: 'none' })
      return
    }
    const sent = sendText(text)
    if (!sent) {
      input.value = text
      inputMode.value = 'keyboard'
    }
  } catch (error: any) {
    console.error('[Tab3] Voice recognize failed:', error)
    const msg = error?.msg || error?.message || '语音识别失败'
    uni.showToast({ title: msg, icon: 'none' })
  } finally {
    isRecognizing.value = false
  }
}

function ensureSocket() {
  if (socket) return
  const token = userStore.token || ''
  
  // 构建 WebSocket URL
  // baseApi 应该是 http://localhost:8000 或 http://127.0.0.1:8000
  // WebSocket 路由是 /api/ai/ws/tab3/（注意：后端路由已经包含了 /api 前缀）
  if (!baseApi) {
    uni.showToast({ title: 'API 地址未配置', icon: 'none' })
    return
  }
  
  // 确保 baseApi 不包含尾随斜杠
  let cleanBaseApi = baseApi.replace(/\/$/, '')
  // 防止 /api/api/ 重复：如果 baseApi 已经包含 /api，先移除，我们后面会统一加
  if (cleanBaseApi.endsWith('/api')) {
    cleanBaseApi = cleanBaseApi.slice(0, -4)
  }
  // 后端 WebSocket 路由：/api/ai/ws/tab3/
  let wsUrl = `${cleanBaseApi}/api/ai/ws/tab3/`
  
  console.log('[Tab3] Base API:', baseApi)
  console.log('[Tab3] Clean Base API:', cleanBaseApi)
  console.log('[Tab3] WebSocket URL:', wsUrl)
  
  socket = new AISocket({
    url: wsUrl,
    token,
    conversationId: currentConversationId.value,
  })
  socket.on('token', ({ textDelta }) => {
    loading.value = false
    if (currentAiMessageId) {
      const target = messages.value.find(item => item.id === currentAiMessageId)
      if (target) {
        target.text += textDelta
      } else {
        currentAiMessageId = appendMessage('ai', textDelta, undefined, { messageType: 'text' })
      }
    } else {
      currentAiMessageId = appendMessage('ai', textDelta, undefined, { messageType: 'text' })
    }
  })
  socket.on('final', async ({ answer, conversationId }) => {
    loading.value = false
    if (currentAiMessageId) {
      const target = messages.value.find(item => item.id === currentAiMessageId)
      if (target) {
        target.text = answer
      } else {
        appendMessage('ai', answer, undefined, { messageType: 'text' })
      }
    } else {
      appendMessage('ai', answer, undefined, { messageType: 'text' })
    }
    currentAiMessageId = null
    sending.value = false
    if (conversationId) {
      currentConversationId.value = Number(conversationId)
    }
    try {
      await loadConversations(currentConversationId.value)
    } catch {}
  })
  socket.on('error', ({ code, message }) => {
    loading.value = false
    sending.value = false
    currentAiMessageId = null
    console.error('[Tab3] Socket error:', code, message)
    
    // 根据错误码提供更友好的提示
    let toastMsg = message || '出错了'
    if (code === 'connect_failed') {
      toastMsg = 'WebSocket 连接失败，请检查网络或后端服务'
    } else if (code === 'socket_error') {
      toastMsg = '连接错误，请重试'
    } else if (code === 'not_connected') {
      toastMsg = '未连接，请稍后重试'
    }
    
    uni.showToast({ title: toastMsg, icon: 'none', duration: 3000 })
  })

  socket.on('scopeHint', ({ scope }) => {
    scopeHintText.value = scope?.scope_text || scope?.scopeText || ''
  })

  socket.on('capabilities', ({ capabilities }) => {
    capabilityItems.value = capabilities?.items || []
  })

  socket.on('conversationCreated', async ({ conversation }) => {
    if (!conversation?.id) return
    await loadConversations(conversation.id)
    socket?.setConversation(conversation.id, null)
  })

  socket.on('conversationMeta', ({ conversationId, sessionId }) => {
    if (conversationId) {
      currentConversationId.value = Number(conversationId)
      socket?.setConversation(Number(conversationId), sessionId || null)
    }
  })

  socket.on('session', ({ sessionId, conversationId }) => {
    if (conversationId) {
      socket?.setConversation(Number(conversationId), sessionId)
    } else if (currentConversationId.value) {
      socket?.setConversation(currentConversationId.value, sessionId)
    }
  })

  socket.on('card', ({ card, conversationId }) => {
    if (conversationId && Number(conversationId) !== Number(currentConversationId.value)) return
    const messageId = appendMessage('ai', '', undefined, {
      messageType: 'card',
      card,
      operationId: card?.operation_id || card?.operationId,
      cardState: 'pending'
    })
    const target = messages.value.find(item => item.id === messageId)
    if (target && !target.card?.prefilled_fields?.client_id) {
      void searchCustomersForCard(target, false)
    }
    sending.value = false
    loading.value = false
    currentAiMessageId = null
  })

  socket.on('cardUpdated', ({ card, operationId, conversationId }) => {
    if (conversationId && Number(conversationId) !== Number(currentConversationId.value)) return
    const targetOperationId = operationId || card?.operation_id || card?.operationId
    if (!targetOperationId) {
      appendMessage('ai', '', undefined, {
        messageType: 'card',
        card,
        operationId: card?.operation_id || card?.operationId,
        cardState: 'pending'
      })
      loading.value = false
      sending.value = false
      currentAiMessageId = null
      return
    }
    const existed = messages.value.find(item => getOperationIdFromMessage(item) === targetOperationId)
    if (existed) {
      existed.card = card
      existed.operationId = targetOperationId
      existed.cardState = 'pending'
      existed.customerSearchKeyword = String(card?.prefilled_fields?.customer_name || existed.customerSearchKeyword || '').trim()
      syncCardMissingFields(existed.card)
      if (!existed.card?.prefilled_fields?.client_id) {
        void searchCustomersForCard(existed, false)
      }
    } else {
      const newMessageId = appendMessage('ai', '', undefined, {
        messageType: 'card',
        card,
        operationId: targetOperationId,
        cardState: 'pending'
      })
      const target = messages.value.find(item => item.id === newMessageId)
      if (target && !target.card?.prefilled_fields?.client_id) {
        void searchCustomersForCard(target, false)
      }
    }
    loading.value = false
    sending.value = false
    currentAiMessageId = null
  })

  socket.on('needClarify', ({ payload, conversationId }) => {
    if (conversationId && Number(conversationId) !== Number(currentConversationId.value)) return
    const question = String(payload?.clarify_question || '请先确认统计口径。')
    appendMessage('ai', question, undefined, { messageType: 'text' })
    loading.value = false
    sending.value = false
    currentAiMessageId = null
  })

  socket.on('actionResult', ({ result, operationId, conversationId }) => {
    if (conversationId && Number(conversationId) !== Number(currentConversationId.value)) return
    const finalOperationId = operationId || result?.operation_id || result?.operationId
    if (finalOperationId) {
      const cardMsg = messages.value.find(item => getOperationIdFromMessage(item) === finalOperationId)
      if (cardMsg) {
        if (result?.status === 'cancelled') {
          cardMsg.cardState = 'cancelled'
        } else if (result?.success) {
          cardMsg.cardState = 'confirmed'
        }
      }
    }
    const text = result?.status === 'cancelled'
      ? '操作已取消'
      : result?.success
        ? `操作成功${result?.record_id ? `，记录ID：${result.record_id}` : ''}`
        : (result?.error || '操作失败')
    appendMessage('ai', text, undefined, { messageType: 'action_result' })
  })
  
  socket.on('close', ({ code }) => {
    console.log('[Tab3] Socket closed:', code)
    // 可以在这里实现自动重连逻辑
  })
  
  socket.connect()
}

function isExitEditIntent(text: string): boolean {
  const value = String(text || '').trim()
  if (!value) return false
  const exits = ['退出编辑', '取消编辑', '新查询', '结束编辑', '不改了', '不用改了']
  return exits.some(word => value.includes(word))
}

function getLatestPendingOperationId(): string | null {
  for (let i = messages.value.length - 1; i >= 0; i -= 1) {
    const item = messages.value[i]
    if (item.messageType !== 'card') continue
    if (item.cardState === 'confirmed' || item.cardState === 'cancelled') continue
    const op = getOperationIdFromMessage(item)
    if (op) return op
  }
  return null
}

function sendText(text: string, attachments?: ChatAttachment[], displayText?: string) {
  const trimmed = text.trim()
  if (!trimmed) return false
  if (sending.value) {
    uni.showToast({ title: '正在发送，请稍后', icon: 'none' })
    return false
  }
  if (!currentConversationId.value) {
    uni.showToast({ title: '会话初始化中，请稍后', icon: 'none' })
    return false
  }
  ensureSocket()
  appendMessage('user', displayText || trimmed, attachments)
  loading.value = true
  sending.value = true
  const attachmentUrls = (attachments || []).map(item => item.url).filter(Boolean)
  const pendingOperationId = getLatestPendingOperationId()
  if (!attachmentUrls.length && pendingOperationId && !isExitEditIntent(trimmed)) {
    currentAiMessageId = null
    socket?.editPendingAction(
      pendingOperationId,
      trimmed,
      {
        conversationId: currentConversationId.value,
        sessionId: getCurrentConversationSessionId(),
        idempotencyKey: `${Date.now()}-${Math.random()}`
      }
    )
    return true
  }
  currentAiMessageId = appendMessage('ai', '', undefined, { messageType: 'text' })
  socket?.sendMessage(trimmed, attachmentUrls, {
    conversationId: currentConversationId.value,
    sessionId: getCurrentConversationSessionId(),
  })
  return true
}

function send() {
  const sent = sendText(input.value)
  if (sent) {
    input.value = ''
  }
}

const imageExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp']

const isImageFile = (value?: string) => {
  if (!value) return false
  const lower = value.toLowerCase()
  return imageExts.some(ext => lower.endsWith(ext))
}

const previewAttachment = (file: ChatAttachment) => {
  const url = resolveAttachmentUrl(file?.url)
  if (!url) return
  uni.previewImage({ urls: [url] })
}

const openAttachment = (file: ChatAttachment) => {
  if (!file?.url) return
  openAttachmentDocument(file.url)
}

const buildAttachmentPayload = (
  userInput: string,
  attachments: ChatAttachment[],
  extractResults: Array<{ name?: string; text: string }>
) => {
  const trimmedInput = (userInput || '').trim()
  const hasImage = attachments.some(item => item.type === 'image')
  const lines: string[] = []

  if (trimmedInput) {
    lines.push(trimmedInput)
  }
  lines.push(hasImage ? '我上传了图片，请识别内容并按需要执行操作。' : '我上传了附件，请查看并按需要执行操作。')
  lines.push('请先给出识别结果与建议，任何新增/写入类操作必须先征得我确认后再执行。')
  lines.push('附件列表：')
  attachments.forEach((file, idx) => {
    const label = file.name || `${file.type === 'image' ? '图片' : '附件'}${idx + 1}`
    const typeLabel = file.type === 'image' ? '图片' : '文件'
    lines.push(`- ${label}（${typeLabel}）: ${file.url}`)
  })
  if (extractResults.length) {
    lines.push('识别/提取内容：')
    extractResults.forEach((item, idx) => {
      const label = item.name || `图片${idx + 1}`
      lines.push(`【${label}】${item.text}`)
    })
  }
  return lines.join('\n')
}

const buildAttachmentDisplayText = (userInput: string, attachments: ChatAttachment[]) => {
  const trimmedInput = (userInput || '').trim()
  if (trimmedInput) return trimmedInput
  const hasImage = attachments.some(item => item.type === 'image')
  return hasImage ? '已发送图片' : '已发送附件'
}

const handleAttach = () => {
  if (uploadingAttachment.value) return
  uni.showActionSheet({
    itemList: ['拍照', '相册', '聊天记录'],
    success: (res) => {
      if (res.tapIndex === 0) {
        chooseImageWithSource(['camera'])
        return
      }
      if (res.tapIndex === 1) {
        chooseImageWithSource(['album'])
        return
      }
      chooseChatFile()
    }
  })
}

const chooseImageWithSource = async (sourceType: string[]) => {
  try {
    const res = await uni.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType
    } as any)
    const tempFilePaths = (((res as any) || {}).tempFilePaths || []) as string[]
    await uploadAttachments(tempFilePaths.map(path => ({ path })))
  } catch (error) {
    console.error('[Tab3] 选择图片失败:', error)
  }
}

const chooseChatFile = async () => {
  try {
    const res = await uni.chooseMessageFile({
      count: 3,
      type: 'file'
    } as any)
    const tempFiles = (((res as any) || {}).tempFiles || []) as Array<{ path: string; name?: string }>
    const files = tempFiles.map(file => ({ path: file.path, name: file.name }))
    await uploadAttachments(files)
  } catch (error) {
    console.error('[Tab3] 选择文件失败:', error)
  }
}

const uploadAttachments = async (files: Array<{ path: string; name?: string }>) => {
  if (!files?.length) return
  if (sending.value) {
    uni.showToast({ title: '正在发送，请稍后', icon: 'none' })
    return
  }
  uploadingAttachment.value = true
  uni.showLoading({ title: '上传中...' })
  const attachments: ChatAttachment[] = []
  const extractResults: Array<{ name?: string; text: string }> = []
  try {
    for (const file of files) {
      const uploaded = await uploadFileToServer(file.path, file.name)
      if (uploaded?.url) {
        const resolvedUrl = resolveAttachmentUrl(uploaded.url)
        if (!resolvedUrl) continue
        const name = uploaded.name || file.name || ''
        const isImage = (uploaded.mime && uploaded.mime.startsWith('image/')) || isImageFile(file.name) || isImageFile(file.path)
        attachments.push({ url: resolvedUrl, name, type: isImage ? 'image' : 'file' })

        if (isImage) {
          try {
            const ocr = await recognizeGeneral(file.path)
            const text = ocr?.rawText?.trim()
            if (text) {
              extractResults.push({ name: name || '图片', text })
            }
          } catch (error) {
            console.warn('[Tab3] OCR识别失败:', error)
          }
        } else {
          try {
            const extract = await extractDocumentText({
              url: uploaded.url,
              file_name: name,
              force_ocr: true,
              ocr_all_pages: true
            })
            const text = extract?.text?.trim()
            if (text) {
              extractResults.push({ name: name || '附件', text })
            }
          } catch (error) {
            console.warn('[Tab3] 附件解析失败:', error)
          }
        }
      }
    }
    if (!attachments.length) return
    const payload = buildAttachmentPayload(input.value, attachments, extractResults)
    const displayText = buildAttachmentDisplayText(input.value, attachments)
    const sent = sendText(payload, attachments, displayText)
    if (sent) {
      input.value = ''
    }
  } catch (error) {
    console.error('[Tab3] 上传失败:', error)
    uni.showToast({ title: '上传失败', icon: 'none' })
  } finally {
    uploadingAttachment.value = false
    uni.hideLoading()
  }
}

onShow(async () => {
  await refreshTab3Meta()
  recalcMessagesHeight()
  if (inputMode.value === 'voice') {
    await ensureRecordPermission()
  }
})

onHide(() => {
  void forceResetRecording()
})

onMounted(() => {
  recorder = createVoiceRecorder()
  ;(async () => {
    await refreshTab3Meta()
    try {
      await loadConversations()
    } catch (error) {
      console.warn('[Tab3] 加载会话失败', error)
    }
    setTimeout(() => {
      ensureSocket()
      recalcMessagesHeight()
    }, 250)
  })()
  uni.onWindowResize?.(onWindowResizeHandler)
})

onUnmounted(() => {
  void forceResetRecording()
  customerSearchTimerMap.forEach(timer => clearTimeout(timer))
  customerSearchTimerMap.clear()
  participantSearchTimerMap.forEach(timer => clearTimeout(timer))
  participantSearchTimerMap.clear()
  recorder?.destroy()
  recorder = null
  socket?.close()
  socket = null
  uni.offWindowResize?.(onWindowResizeHandler)
})
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  box-sizing: border-box;
}
.ai-page {
  position: relative;
  z-index: 1;
}
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  padding: 16rpx 20rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #e5e7eb;
}
.header-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.header-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.header-scope {
  font-size: 22rpx;
  color: #64748b;
}
.header-capability {
  font-size: 20rpx;
  color: #94a3b8;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.header-btn {
  margin: 0;
  padding: 0 16rpx;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 10rpx;
  font-size: 24rpx;
  color: #475569;
  background: #f1f5f9;
  border: none;
}
.header-btn.primary {
  background: #667eea;
  color: #fff;
}
.messages {
  flex: 1;
  min-height: 0;
  width: 100%;
  padding: 16rpx;
  padding-bottom: 32rpx;
  box-sizing: border-box;
}
.msg {
  display: flex;
  margin-bottom: 24rpx;
}
.msg.user {
  justify-content: flex-end;
}
.msg.ai {
  justify-content: flex-start;
}
.msg.system {
  justify-content: center;
}
.bubble {
  max-width: 85%;
  padding: 20rpx 24rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  line-height: 1.6;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  word-break: break-all;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  box-sizing: border-box;
}
.bubble-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: inherit;
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 12rpx;
  border-radius: 12rpx;
  background: #f8fafc;
  border: 1rpx solid #e2e8f0;
  overflow: visible;
}
.card-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #0f172a;
}
.card-line {
  font-size: 24rpx;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-all;
}
.card-line-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}
.inline-edit-btn {
  margin: 0;
  height: 44rpx;
  line-height: 44rpx;
  padding: 0 14rpx;
  border-radius: 8rpx;
  border: 1rpx solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 20rpx;
  flex-shrink: 0;
}
.inline-edit-btn[disabled] {
  opacity: 0.5;
}
.card-warn {
  font-size: 22rpx;
  color: #b45309;
}
.card-hint {
  font-size: 22rpx;
  color: #64748b;
}
.card-required {
  font-size: 22rpx;
  color: #0f766e;
}
.card-candidates {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.candidate-search-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.candidate-search-input {
  flex: 1;
  height: 56rpx;
  min-height: 56rpx;
  line-height: 56rpx;
  padding: 0 16rpx;
  border-radius: 10rpx;
  border: 1rpx solid #cbd5e1;
  background: #fff;
  font-size: 24rpx;
  color: #334155;
  box-sizing: border-box;
}
.candidate-search-placeholder {
  color: #94a3b8;
}
.candidate-search-btn {
  margin: 0;
  height: 56rpx;
  line-height: 56rpx;
  padding: 0 18rpx;
  border-radius: 10rpx;
  border: 1rpx solid #bfdbfe;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 24rpx;
}
.candidate-title {
  font-size: 22rpx;
  color: #334155;
}
.candidate-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}
.participant-selected {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}
.participant-chip {
  padding: 0 12rpx;
  height: 44rpx;
  line-height: 44rpx;
  border-radius: 22rpx;
  font-size: 22rpx;
  color: #065f46;
  background: #d1fae5;
  border: 1rpx solid #a7f3d0;
}
.candidate-btn {
  margin: 0;
  padding: 0 14rpx;
  height: 48rpx;
  line-height: 48rpx;
  border-radius: 24rpx;
  font-size: 22rpx;
  color: #334155;
  border: 1rpx solid #cbd5e1;
  background: #f8fafc;
}
.card-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}
.card-btn {
  margin: 0;
  height: 56rpx;
  line-height: 56rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  font-size: 24rpx;
  border: none;
}
.card-btn.confirm {
  background: #10b981;
  color: #fff;
}
.card-btn.edit {
  background: #e2e8f0;
  color: #334155;
}
.card-btn.pick-customer {
  background: #e0f2fe;
  color: #0369a1;
}
.card-btn.cancel {
  background: #e5e7eb;
  color: #475569;
}
.card-btn.open-form {
  background: #dbeafe;
  color: #1d4ed8;
}
.card-btn[disabled] {
  opacity: 0.5;
}
.msg.user .bubble {
  background: #667eea;
  color: #fff;
  border-top-right-radius: 4rpx;
}
.msg.ai .bubble {
  background: #fff;
  color: #333;
  border-top-left-radius: 4rpx;
}
.msg.system .bubble {
  background: #eef2ff;
  color: #334155;
  border-radius: 12rpx;
}
.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.attachment-item {
  width: 100%;
}
.attachment-image {
  width: 360rpx;
  max-width: 100%;
  height: 240rpx;
  border-radius: 12rpx;
  background: #f1f5f9;
}
.attachment-file {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 16rpx;
  border-radius: 12rpx;
  background: #f1f5f9;
  box-sizing: border-box;
}
.attachment-name {
  font-size: 24rpx;
  color: #475569;
}
.msg.user .attachment-file {
  background: rgba(255, 255, 255, 0.9);
}
.msg.user .attachment-name {
  color: #1f2937;
}
.composer {
  position: fixed;
  left: 0;
  right: 0;
  /* TabBar 高度 100rpx，输入框紧贴 TabBar，无间距 */
  bottom: 100rpx;
  display: flex;
  gap: 12rpx;
  padding: 16rpx 20rpx;
  padding-bottom: 16rpx;
  background: #fff;
  border-top: 1rpx solid #eee;
  align-items: center;
  /* z-index 必须大于 TabBar 的 999 */
  z-index: 1000;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
}
.composer-left,
.composer-right {
  flex-shrink: 0;
}

.attach-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attach-btn:active {
  background: #e2e8f0;
}

.mode-toggle {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  background: #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mode-toggle:active {
  background: #e2e8f0;
}
.mode-text {
  font-size: 20rpx;
  color: #667eea;
  margin-top: 4rpx;
}
.composer-main {
  flex: 1;
}
.input-wrapper {
  position: relative;
}

.input {
  width: 100%;
  height: 88rpx;
  min-height: 88rpx;
  max-height: 88rpx;
  padding: 0 20rpx;
  line-height: 88rpx;
  font-size: 28rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  box-sizing: border-box;
  background: #f8f8f8;
  display: block;
}

.input.with-send {
  padding-right: 150rpx;
}

.input-placeholder {
  color: #9ca3af;
  font-size: 28rpx;
  line-height: 88rpx;
}

.send-btn {
  position: absolute;
  right: 2rpx;
  top: 2rpx;
  bottom: 2rpx;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24rpx;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 10rpx;
  font-size: 24rpx;
}

.send-btn:active {
  opacity: 0.85;
}

.send-btn:disabled {
  background: #e0e0e5;
  color: #999;
}
.voice-button {
  width: 100%;
  height: 88rpx;
  padding: 0 18rpx;
  border-radius: 16rpx;
  border: 1rpx solid #e5e7eb;
  background: #f8fafc;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.2s;
  gap: 12rpx;
}
.voice-button.recording {
  background: #fff5f5;
  border-color: #fca5a5;
}
.voice-button.canceling {
  background: #ffe4e6;
  border-color: #f87171;
}
.voice-button.recognizing {
  background: #eef2ff;
  border-color: #c7d2fe;
}
.voice-button.disabled {
  opacity: 0.7;
}
.voice-text {
  font-size: 28rpx;
  color: #1f2937;
  font-weight: 600;
}

.recording-overlay {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 260rpx;
  display: flex;
  justify-content: center;
  z-index: 1200;
}

.recording-panel {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 18rpx 26rpx;
  border-radius: 999rpx;
  background: rgba(31, 41, 55, 0.86);
}

.recording-panel.canceling {
  background: rgba(185, 28, 28, 0.9);
}

.recording-text {
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
}
</style>
