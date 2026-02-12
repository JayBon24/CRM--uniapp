<!-- @ts-nocheck -->
<template>
  <view class="followup-create-page">
    <scroll-view class="form-container" scroll-y>
      <view v-if="clientName" class="client-header">
        <text class="client-header__label">当前客户</text>
        <text class="client-header__name">{{ clientName }}</text>
      </view>

      <view class="form-section">
        <view class="section-title">跟进方式</view>
        <view class="type-selector">
          <view
            v-for="type in followupTypes"
            :key="type.value"
            class="type-item"
            :class="{ active: formData.followup_type === type.value }"
            @click="formData.followup_type = type.value"
          >
            <u-icon :name="type.icon" size="30" :color="formData.followup_type === type.value ? '#667eea' : '#909399'" />
            <text class="type-text">{{ type.label }}</text>
          </view>
        </view>
        <view v-if="formData.followup_type === 'other'" class="form-item">
          <text class="label">其他方式</text>
          <input
            v-model="formData.method_other"
            class="input"
            placeholder="请填写具体方式"
            placeholder-style="color: #C0C4CC"
          />
        </view>
      </view>

      <view class="form-section">
        <view class="section-header">
          <view class="section-title">跟进地点</view>
          <view class="locate-inline-btn" :class="{ 'is-loading': isGettingLocation }" @click="handleGetLocation">
            <u-loading-icon v-if="isGettingLocation" mode="spinner" size="18" color="#667eea" />
            <u-icon v-else name="map" size="18" color="#667eea" />
            <text class="locate-inline-text">定位</text>
          </view>
        </view>
        <view v-if="locationStatus === 'success' && formData.address" class="address-display">
          <u-icon name="map" size="18" color="#67C23A" />
          <text class="address-text">{{ formData.address }}</text>
        </view>
        <LocationStatusBadge
          v-if="locationStatus !== 'fail'"
          :status="locationStatus"
          :show-retry="false"
        />
        <view class="tip-box">
          <u-icon name="info-circle" size="16" color="#E6A23C" />
          <text class="tip-text">定位非必须但建议开启，或手动输入地址保存</text>
        </view>
        <view class="address-input">
          <input
            v-model="formData.address"
            class="input"
            placeholder="或手动输入跟进地址"
            placeholder-style="color: #C0C4CC"
          />
          <view class="geo-btn" @click="handleSaveAddress">
            <text class="geo-text">手动保存</text>
          </view>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">拍照附件</view>
        <view class="upload-area">
          <view
            v-for="(url, index) in attachmentsForRender"
            :key="index"
            class="upload-slot"
          >
            <ImageUploader
              :model-value="url"
              label="图片"
              placeholder="点击选择图片"
              width="200rpx"
              height="200rpx"
              @update:modelValue="(val) => handleAttachmentChange(index, val)"
              @change="(payload) => handleAttachmentMeta(index, payload)"
            />
          </view>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">时间信息</view>
        <view class="form-item required">
          <text class="label">跟进时间</text>
          <view class="datetime-picker" @click="showFollowupTimePicker = true">
            <text v-if="formData.followup_time" class="datetime-text">{{ formattedFollowupTime }}</text>
            <text v-else class="placeholder">请选择跟进时间</text>
            <u-icon name="clock" size="22" color="#909399" />
          </view>
        </view>
        <view class="form-item">
          <text class="label">洽谈时长（分钟）</text>
          <input
            v-model.number="formData.duration"
            class="input"
            type="number"
            placeholder="可选"
            placeholder-style="color: #C0C4CC"
          />
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">跟进内容</view>
        <view class="form-item required">
          <text class="label">跟进摘要</text>
          <textarea
            v-model="formData.summary"
            class="textarea"
            placeholder="请描述本次跟进的主要内容"
            placeholder-style="color: #C0C4CC"
            :maxlength="500"
          />
          <text class="char-count">{{ formData.summary?.length || 0 }}/500</text>
        </view>

        <view class="form-item">
          <text class="label">关键结论</text>
          <textarea
            v-model="formData.conclusion"
            class="textarea short"
            placeholder="记录关键结论（可选）"
            placeholder-style="color: #C0C4CC"
            :maxlength="200"
          />
          <text class="char-count">{{ formData.conclusion?.length || 0 }}/200</text>
        </view>

      </view>

      <view class="form-section">
        <view class="section-title">参与人员</view>
        <view class="form-item">
          <text class="label">内部参与人员</text>
          <UserSelector v-model="formData.internal_participants" />
        </view>
        <view class="form-item">
          <text class="label">客户方参与人员</text>
          <ClientContactSelector v-model="formData.customer_participants" :client-id="clientId" />
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">下次跟进时间</view>
        <view class="datetime-picker" @click="showNextFollowupPicker = true">
          <text v-if="formData.next_followup_time" class="datetime-text">{{ formatTime(formData.next_followup_time) }}</text>
          <text v-else class="placeholder">选择下次跟进时间（可选）</text>
          <u-icon name="clock" size="22" color="#909399" />
        </view>
        <view v-if="formData.next_followup_time" class="clear-time" @click="formData.next_followup_time = ''">
          <text class="clear-text">清除</text>
        </view>
      </view>

      <view class="form-section">
        <view class="form-item">
          <view class="switch-row">
            <text class="label">同步到日程</text>
            <switch
              :checked="formData.sync_to_schedule"
              @change="(e) => formData.sync_to_schedule = e.detail.value"
              color="#667eea"
            />
          </view>
          <text class="sync-hint">自动在日程表中创建本次跟进记录</text>
        </view>
      </view>
    </scroll-view>

    <view class="submit-bar">
      <view class="submit-btn" @click="handleSubmit">
        提交跟进记录
      </view>
    </view>

    <u-datetime-picker
      v-model:show="showFollowupTimePicker"
      v-model="followupTimeValue"
      mode="datetime"
      @confirm="onFollowupTimeConfirm"
      @cancel="showFollowupTimePicker = false"
      @close="showFollowupTimePicker = false"
    />

    <u-datetime-picker
      v-model:show="showNextFollowupPicker"
      v-model="nextFollowupValue"
      mode="datetime"
      :minDate="Date.now()"
      @confirm="onNextFollowupConfirm"
      @cancel="showNextFollowupPicker = false"
      @close="showNextFollowupPicker = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import SvgIcon from '@/components/SvgIcon/index.vue'
import ImageUploader from '@/components/ImageUploader/index.vue'
import UserSelector from '@/components/UserSelector/index.vue'
import ClientContactSelector from '@/components/ClientContactSelector/index.vue'
import LocationStatusBadge from '@/components/LocationStatusBadge/index.vue'
import { getAttachmentUrl } from '@/utils/attachment'
import { createFollowup, getClientDetail } from '@/api/client'
import { createSchedule } from '@/api/schedule'
import { confirmTab3Action, getTab3ActionDraft } from '@/api/ai'
import { askToSyncCalendar } from '../../utils/calendar'
import { getEnvConfig } from '@/config/env'
import { useUserStore } from '@/stores/user'
import { http } from '@/utils/request'
import type { ClientFollowupCreateParams, FollowupType, FollowupParticipant } from '@/types/interfaces/client-followup'
import type { AiAttachment } from '@/types/interfaces/ai'

const clientId = ref<number | string>('')
const clientName = ref('')
const aiOperationId = ref('')
const env = getEnvConfig()
const userStore = useUserStore()

const showFollowupTimePicker = ref(false)
const followupTimeValue = ref(Date.now())
const showNextFollowupPicker = ref(false)
const nextFollowupValue = ref(Date.now() + 7 * 24 * 60 * 60 * 1000)

const locationStatus = ref('fail')
const isGettingLocation = ref(false)

const followupTypes: Array<{ value: FollowupType; label: string; icon: string }> = [
  { value: 'phone', label: '电话', icon: 'phone' },
  { value: 'wechat', label: '微信', icon: 'weixin-fill' },
  { value: 'meeting', label: '面谈', icon: 'account' },
  { value: 'email', label: '邮件', icon: 'email' },
  { value: 'other', label: '其他', icon: 'more-dot-fill' }
]

const aiExtension = ref({
  trace_id: '',
  ai_source: 'manual'
})

const formData = ref({
  followup_type: 'phone' as FollowupType,
  method_other: '',
  followup_time: '',
  duration: null as number | null,
  address: '',
  lng: null as number | null,
  lat: null as number | null,
  summary: '',
  conclusion: '',
  attachments: [] as AiAttachment[],
  internal_participants: [] as FollowupParticipant[],
  customer_participants: [] as any[],
  next_followup_time: '',
  sync_to_schedule: true,
  client_id: 0 as number | string
})

const attachmentsForRender = computed(() => {
  const arr = (formData.value.attachments || []).map(a => getAttachmentUrl(a))
  if (arr.length < 9) arr.push('')
  return arr
})

const formattedFollowupTime = computed(() => {
  return formData.value.followup_time
    ? dayjs(formData.value.followup_time).format('YYYY-MM-DD HH:mm')
    : ''
})

const methodToUiMap: Record<string, FollowupType> = {
  PHONE: 'phone',
  WECHAT: 'wechat',
  EMAIL: 'email',
  VISIT: 'meeting',
  OTHER: 'other'
}

const uiToMethodMap: Record<FollowupType, string> = {
  phone: 'PHONE',
  wechat: 'WECHAT',
  email: 'EMAIL',
  meeting: 'VISIT',
  other: 'OTHER'
}

function handleAttachmentChange(index: number, val: string) {
  const current = [...(formData.value.attachments || [])]

  if (index === current.length) {
    if (val) {
      current.push({
        url: val,
        name: `附件_${Date.now()}`,
        mime: 'image/jpeg'
      })
    }
    formData.value.attachments = current
    return
  }

  if (val) {
    current[index] = {
      ...current[index],
      url: val
    }
  } else {
    current.splice(index, 1)
  }
  formData.value.attachments = current
}

function handleAttachmentMeta(index: number, payload: any) {
  if (!payload || typeof payload !== 'object') return
  const current = [...(formData.value.attachments || [])]
  const target = current[index]
  if (!target) return
  current[index] = {
    ...target,
    attachment_id: payload.file_id || target.attachment_id,
    name: payload.name || target.name || `附件_${Date.now()}`,
    mime: payload.mime || target.mime,
    size: payload.raw?.data?.size || target.size,
    storage_key: payload.storage_key || target.storage_key,
    preview_url: payload.preview_url || target.preview_url || target.url
  }
  formData.value.attachments = current
}

function formatTime(time: string) {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

function onFollowupTimeConfirm(e: any) {
  formData.value.followup_time = dayjs(e.value).format('YYYY-MM-DD HH:mm:ss')
  showFollowupTimePicker.value = false
}

function onNextFollowupConfirm(e: any) {
  formData.value.next_followup_time = dayjs(e.value).format('YYYY-MM-DD HH:mm:ss')
  showNextFollowupPicker.value = false
}

async function reverseGeocode(lng: number, lat: number) {
  try {
    // 通过后端代理调用高德逆地理编码，避免前端域名/Key 限制
    // 注意：后端路由前缀已经包含 /api/customer，这里只写 /customer/geo/reverse/
    const data = await http.get('/customer/geo/reverse/', {
      params: { lng, lat }
    })
    return (data as any)?.formatted_address || null
  } catch (e) {
    console.error('reverseGeocode 调用后端失败:', e)
    return null
  }
}

async function geocodeAddress(address: string) {
  try {
    const data = await http.get('/customer/geo/geocode/', {
      params: { address }
    })
    return {
      lng: (data as any)?.lng ?? null,
      lat: (data as any)?.lat ?? null
    }
  } catch (e) {
    console.error('geocodeAddress 调用后端失败:', e)
    return null
  }
}

async function handleGetLocation() {
  if (isGettingLocation.value) return
  isGettingLocation.value = true
  try {
    const networkInfo = await uni.getNetworkType()
    if (networkInfo.networkType === 'none') {
      locationStatus.value = 'offline'
      uni.showToast({ title: '网络未连接，无法获取定位', icon: 'none' })
      return
    }

    // #ifdef H5
    if (navigator.geolocation) {
      uni.showLoading({ title: '正在获取定位...' })
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          locationStatus.value = 'success'
          const lng = position.coords.longitude
          const lat = position.coords.latitude
          formData.value.lng = lng
          formData.value.lat = lat
          try {
            const address = await reverseGeocode(lng, lat)
            formData.value.address = address || '定位成功，未获取到详细地址，请手动填写'
          } catch (e) {
            formData.value.address = '定位成功，未获取到详细地址，请手动填写'
          }
          uni.hideLoading()
          uni.showToast({ title: '定位成功', icon: 'success', duration: 1500 })
        },
        (error) => {
          uni.hideLoading()
          if (error.code === error.PERMISSION_DENIED) {
            locationStatus.value = 'denied'
            uni.showModal({
              title: '定位权限被拒绝',
              content: '请在浏览器设置中允许访问位置',
              confirmText: '知道了',
              showCancel: false
            })
          } else {
            locationStatus.value = 'fail'
            uni.showToast({ title: '定位失败，请检查网络或手动输入地址', icon: 'none', duration: 2000 })
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    } else {
      locationStatus.value = 'fail'
      uni.showToast({ title: '浏览器不支持定位功能', icon: 'none' })
    }
    // #endif

    // #ifndef H5
    uni.showLoading({ title: '正在获取定位...' })
    const res = await uni.getLocation({
      type: 'gcj02',
      geocode: true,
      altitude: false
    })
    locationStatus.value = 'success'
    const lng = res.longitude
    const lat = res.latitude
    formData.value.lng = lng
    formData.value.lat = lat
    try {
      const address = await reverseGeocode(lng, lat)
      formData.value.address = address || res.address || '定位成功，未获取到详细地址，请手动填写'
    } finally {
      uni.hideLoading()
    }
    uni.showToast({ title: '定位成功', icon: 'success', duration: 1500 })
    // #endif
  } catch (error: any) {
    uni.hideLoading()
    if (error.errMsg?.includes('auth deny') || error.errMsg?.includes('permission')) {
      locationStatus.value = 'denied'
      uni.showModal({
        title: '定位权限被拒绝',
        content: '建议前往系统设置开启定位权限',
        confirmText: '知道了',
        showCancel: false
      })
    } else if (error.errMsg?.includes('timeout')) {
      locationStatus.value = 'fail'
      uni.showToast({ title: '定位超时，请重试或手动输入地址', icon: 'none', duration: 2000 })
    } else {
      locationStatus.value = 'fail'
      uni.showToast({ title: '定位失败，请手动输入地址', icon: 'none', duration: 2000 })
    }
  } finally {
    isGettingLocation.value = false
  }
}

async function handleSaveAddress() {
  if (!formData.value.address) {
    uni.showToast({ title: '请先输入或获取地址', icon: 'none' })
    return
  }
  // 目前地址已经保存在 formData 中，这里仅给出确认提示
  uni.showToast({ title: '地址已保存', icon: 'success' })
}

async function handleGeocodeAddress() {
  if (!formData.value.address) {
    uni.showToast({ title: '请先输入地址', icon: 'none' })
    return
  }
  try {
    uni.showLoading({ title: '解析地址...' })
    const result = await geocodeAddress(formData.value.address)
    if (result?.lng && result?.lat) {
      formData.value.lng = result.lng
      formData.value.lat = result.lat
      locationStatus.value = 'success'
      uni.showToast({ title: '解析成功', icon: 'success' })
    } else {
      locationStatus.value = 'fail'
      uni.showToast({ title: '解析失败，请检查地址', icon: 'none' })
    }
  } catch (error) {
    locationStatus.value = 'fail'
    uni.showToast({ title: '解析失败，请稍后重试', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

function validateForm(): boolean {
  if (!formData.value.client_id) {
    uni.showToast({ title: '请选择客户', icon: 'none' })
    return false
  }
  if (!formData.value.followup_time) {
    uni.showToast({ title: '请选择跟进时间', icon: 'none' })
    return false
  }
  if (!formData.value.summary?.trim()) {
    uni.showToast({ title: '请输入跟进摘要', icon: 'none' })
    return false
  }
  if (formData.value.followup_type === 'other' && !formData.value.method_other?.trim()) {
    uni.showToast({ title: '请填写其他方式', icon: 'none' })
    return false
  }
  return true
}

async function loadAiDraft(operationId: string) {
  try {
    const res: any = await getTab3ActionDraft(operationId)
    const card = res?.card || {}
    const prefilled = card?.prefilled_fields || res?.draft_payload?.prefilled_fields || {}
    if (prefilled.client_id) {
      clientId.value = prefilled.client_id
      formData.value.client_id = prefilled.client_id
      await hydrateClientDefaults(prefilled.client_id)
    } else if (prefilled.customer_name) {
      clientName.value = prefilled.customer_name
    }
    if (prefilled.summary) formData.value.summary = String(prefilled.summary)
    if (prefilled.conclusion) formData.value.conclusion = String(prefilled.conclusion)
    if (prefilled.followup_time) formData.value.followup_time = String(prefilled.followup_time)
    if (prefilled.next_followup_time) formData.value.next_followup_time = String(prefilled.next_followup_time)
    if (prefilled.duration !== undefined && prefilled.duration !== null && prefilled.duration !== '') {
      formData.value.duration = Number(prefilled.duration)
    }
    if (prefilled.address) formData.value.address = String(prefilled.address)
    if (prefilled.lng) formData.value.lng = Number(prefilled.lng)
    if (prefilled.lat) formData.value.lat = Number(prefilled.lat)
    if (prefilled.method_other) formData.value.method_other = String(prefilled.method_other)
    const method = String(prefilled.method || '').toUpperCase()
    if (method && methodToUiMap[method]) {
      formData.value.followup_type = methodToUiMap[method]
    }
    if (Array.isArray(prefilled.attachments)) {
      formData.value.attachments = prefilled.attachments as any[]
    }
    if (Array.isArray(prefilled.internal_participants)) {
      formData.value.internal_participants = prefilled.internal_participants as any[]
    }
    if (Array.isArray(prefilled.customer_participants)) {
      formData.value.customer_participants = prefilled.customer_participants as any[]
    }
  } catch (error: any) {
    uni.showToast({ title: error?.message || '加载AI草稿失败', icon: 'none' })
  }
}

function buildAiEditedFields() {
  const attachmentsPayload = (formData.value.attachments || []).map((item: any) => {
    if (!item) return item
    const { preview_url, ...rest } = item
    return rest
  })
  return {
    client_id: formData.value.client_id,
    customer_name: clientName.value || undefined,
    summary: formData.value.summary,
    conclusion: formData.value.conclusion || '',
    method: uiToMethodMap[formData.value.followup_type] || 'OTHER',
    method_other: formData.value.method_other || undefined,
    followup_time: formData.value.followup_time,
    next_followup_time: formData.value.next_followup_time || undefined,
    duration: formData.value.duration || undefined,
    location_status: locationStatus.value,
    address: formData.value.address || '',
    lng: formData.value.lng || undefined,
    lat: formData.value.lat || undefined,
    internal_participants: formData.value.internal_participants || [],
    customer_participants: formData.value.customer_participants || [],
    attachments: attachmentsPayload,
  }
}

function getFallbackParticipant() {
  if (!userStore.id) return []
  return [{ id: userStore.id, name: userStore.name || userStore.nickName || `用户${userStore.id}` }]
}

function normalizeHandlerParticipants(detail: any) {
  const handlers = Array.isArray(detail?.handlers) ? detail.handlers : []
  return handlers
    .map((handler: any) => ({
      id: handler?.id,
      name: handler?.name || handler?.nick_name || handler?.real_name || handler?.username || ''
    }))
    .filter((item: any) => item.id !== undefined && item.id !== null && item.name)
}

async function hydrateClientDefaults(id: number | string) {
  try {
    const detail: any = await getClientDetail(id)
    clientName.value = detail?.client_name || detail?.customer_name || ''
    const handlerParticipants = normalizeHandlerParticipants(detail)
    if (handlerParticipants.length > 0) {
      formData.value.internal_participants = handlerParticipants
      return
    }
    if (detail?.owner_user_id && detail?.owner_user_name) {
      formData.value.internal_participants = [
        { id: detail.owner_user_id, name: detail.owner_user_name }
      ]
      return
    }
  } catch (error) {
    console.warn('[followup] 加载客户详情失败，使用默认参与人:', error)
  }
  formData.value.internal_participants = getFallbackParticipant()
}

async function handleSubmit() {
  if (!validateForm()) return

  uni.showLoading({ title: '提交中...' })
  try {
    const attachmentsPayload = (formData.value.attachments || []).map((item: any) => {
      if (!item) return item
      const { preview_url, ...rest } = item
      return rest
    })

    const submitData: ClientFollowupCreateParams = {
      client_id: formData.value.client_id,
      time: formData.value.followup_time,
      type: formData.value.followup_type,
      summary: formData.value.summary,
      conclusion: formData.value.conclusion,
      method_other: formData.value.method_other || undefined,
      next_plan_at: formData.value.next_followup_time || undefined,
      duration: formData.value.duration || undefined,
      location_status: locationStatus.value,
      address: formData.value.address,
      lng: formData.value.lng || undefined,
      lat: formData.value.lat || undefined,
      internal_participants: formData.value.internal_participants,
      customer_participants: formData.value.customer_participants,
      attachments: attachmentsPayload,
      ...aiExtension.value
    }

    let followupResult: any
    if (aiOperationId.value) {
      const confirmRes = await confirmTab3Action(aiOperationId.value, {
        edited_fields: buildAiEditedFields(),
        idempotency_key: `${Date.now()}-${Math.random()}`
      })
      if (!confirmRes?.success) {
        throw new Error(confirmRes?.error || 'AI确认提交失败')
      }
      followupResult = { data: confirmRes }
    } else {
      followupResult = await createFollowupSafe(submitData)
    }

    let createdSchedule: any = null
    if (formData.value.sync_to_schedule) {
      try {
        const typeLabel = followupTypes.find(t => t.value === formData.value.followup_type)?.label || '跟进'
        const scheduleData = {
          title: `${typeLabel}跟进 - ${formData.value.summary.substring(0, 20)}${formData.value.summary.length > 20 ? '...' : ''}`,
          description: `跟进摘要：${formData.value.summary}${formData.value.conclusion ? '\n关键结论：' + formData.value.conclusion : ''}`,
          schedule_type: 'meeting' as const,
          start_time: dayjs(formData.value.followup_time).toISOString(),
          end_time: formData.value.duration
            ? dayjs(formData.value.followup_time).add(formData.value.duration, 'minute').toISOString()
            : undefined,
          location: formData.value.address || '',
          status: 'completed' as const,
          priority: 'medium' as const,
          is_all_day: false,
          reminder_enabled: false,
          related_type: 'customer' as const,
          related_id: formData.value.client_id as number,
          remark: '来自跟进记录自动生成'
        }

        const scheduleRes = await createSchedule(scheduleData)
        createdSchedule = scheduleRes?.data || {
          ...scheduleData,
          id: Date.now(),
          create_datetime: new Date().toISOString(),
          update_datetime: new Date().toISOString(),
          creator: { id: 1, username: 'user', name: '用户' }
        }
      } catch (error) {
        console.error('同步日程失败:', error)
      }
    }

    if (formData.value.next_followup_time) {
      try {
        const typeLabel = followupTypes.find(t => t.value === formData.value.followup_type)?.label || '跟进'
        const nextScheduleData = {
          title: `${typeLabel}跟进提醒 - ${formData.value.summary.substring(0, 15)}...`,
          description: `上次跟进摘要：${formData.value.summary}${formData.value.conclusion ? '\n关键结论：' + formData.value.conclusion : ''}`,
          schedule_type: 'reminder' as const,
          start_time: dayjs(formData.value.next_followup_time).toISOString(),
          location: formData.value.address || '',
          status: 'pending' as const,
          priority: 'medium' as const,
          is_all_day: false,
          reminder_enabled: true,
          reminder_time: 30,
          reminder_method: 'system',
          related_type: 'customer' as const,
          related_id: formData.value.client_id as number,
          remark: '来自跟进记录自动生成的提醒'
        }

        await createSchedule(nextScheduleData)
      } catch (error) {
        console.error('创建下次跟进提醒失败:', error)
      }
    }

    uni.hideLoading()

    if (createdSchedule) {
      uni.showToast({ title: '已同步到日程', icon: 'success', duration: 2000 })
      setTimeout(async () => {
        await askToSyncCalendarSafe(createdSchedule, true)
      }, 1500)
    } else {
      uni.showToast({ title: '提交成功', icon: 'success', duration: 1500 })
    }

    setTimeout(() => {
      uni.navigateBack()
    }, 2000)
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({ title: error?.message || '提交失败', icon: 'none' })
    console.error('创建跟进记录失败:', error)
  }
}

async function createFollowupSafe(data: ClientFollowupCreateParams) {
  let canUseApi = false
  try {
    canUseApi = typeof createFollowup === 'function'
  } catch {
    canUseApi = false
  }

  if (canUseApi) {
    return createFollowup(data)
  }

  // 兜底：避免小程序打包环境下模块导入异常导致无法调用
  return http.post('/crm/client/followup', data)
}

async function askToSyncCalendarSafe(schedule: any, showRememberOption = true) {
  if (typeof askToSyncCalendar === 'function') {
    return askToSyncCalendar(schedule, showRememberOption)
  }
  return false
}

onLoad((options: any) => {
  if (options?.trace_id) aiExtension.value.trace_id = options.trace_id
  if (options?.ai_source) aiExtension.value.ai_source = options.ai_source
  if (options?.ai_operation_id) {
    aiOperationId.value = String(options.ai_operation_id)
  }

  if (options.clientId) {
    clientId.value = options.clientId
    formData.value.client_id = clientId.value
    void hydrateClientDefaults(clientId.value)
  } else {
    formData.value.internal_participants = getFallbackParticipant()
  }
  if (aiOperationId.value) {
    void loadAiDraft(aiOperationId.value)
  }
})
</script>

<style scoped lang="scss">
.followup-create-page {
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

.client-header {
  margin-bottom: 24rpx;
  padding: 22rpx 24rpx;
  background: #fff;
  border-radius: 12rpx;
}

.client-header__label {
  display: block;
  font-size: 24rpx;
  color: #6b7280;
}

.client-header__name {
  display: block;
  margin-top: 8rpx;
  font-size: 34rpx;
  font-weight: 600;
  color: #111827;
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

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;

  .section-title {
    margin-bottom: 0;
  }
}

.locate-inline-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  min-width: 132rpx;
  height: 56rpx;
  padding: 0 16rpx;
  border-radius: 28rpx;
  border: 1rpx solid #dbeafe;
  background: #eff6ff;

  &.is-loading {
    opacity: 0.8;
  }
}

.locate-inline-text {
  font-size: 24rpx;
  color: #667eea;
  font-weight: 500;
}

.required {
  color: #F56C6C;
  margin-left: 4rpx;
}

.type-selector {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 6rpx;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  min-width: 142rpx;
  padding: 24rpx 12rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  border: 2rpx solid transparent;

  &.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-color: #667eea;
  }
}

.type-text {
  font-size: 24rpx;
  color: #606266;
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
  font-size: 28rpx;
  color: #303133;
  font-weight: 500;
  margin-bottom: 16rpx;
  display: block;
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

.address-display {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 16rpx;
  padding: 16rpx 20rpx;
  background: #F0F9FF;
  border-radius: 8rpx;
  width: 100%;
  box-sizing: border-box;
}

.address-text {
  flex: 1;
  font-size: 26rpx;
  color: #67C23A;
  word-break: break-all;
}

.tip-box {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin: 16rpx 0;
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

.address-input {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.geo-btn {
  min-width: 140rpx;
  padding: 0 18rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
  border-radius: 8rpx;
  border: 1rpx solid #EBEEF5;
}

.geo-text {
  font-size: 24rpx;
  color: #667eea;
  white-space: nowrap;
  line-height: 1;
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
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #909399;
  text-align: right;
}

.upload-area {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.upload-slot {
  display: flex;
  justify-content: center;
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

.clear-time {
  margin-top: 16rpx;
  text-align: right;
}

.clear-text {
  font-size: 26rpx;
  color: #F56C6C;
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #EBEEF5;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 1200;
}

.submit-btn {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;

  &:active {
    opacity: 0.8;
  }
}
</style>
