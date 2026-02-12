<!-- @ts-nocheck -->
<template>
  <view class="visit-create-page">
    <scroll-view class="form-container" scroll-y>
      <!-- 拜访时间 -->
      <view class="form-section">
        <view class="section-title">拜访时间 <text class="required">*</text></view>
        <view class="datetime-picker" @click="showVisitTimePicker = true">
          <text v-if="formData.visit_time" class="datetime-text">{{ formattedVisitTime }}</text>
          <text v-else class="placeholder">请选择拜访时间</text>
          <SvgIcon name="calendar" :size="32" color="#909399" />
        </view>
      </view>

      <!-- 洽谈时长 -->
      <view class="form-section">
        <view class="section-title">洽谈时长（分钟）</view>
        <input
          v-model.number="formData.duration"
          class="input"
          type="number"
          placeholder="请输入洽谈时长"
          placeholder-style="color: #C0C4CC"
        />
      </view>

      <!-- 地点定位 -->
      <view class="form-section">
        <view class="section-title">拜访地点</view>
        <view v-if="locationStatus === 'success' && formData.address" class="address-display">
          <SvgIcon name="location" :size="28" color="#67C23A" />
          <text class="address-text">{{ formData.address }}</text>
        </view>
        <view v-else class="location-action-area">
          <view 
            class="get-location-btn" 
            :class="{ 'is-loading': isGettingLocation }"
            @click="handleGetLocation"
          >
            <u-loading-icon v-if="isGettingLocation" mode="spinner" size="28" color="#667eea" />
            <SvgIcon v-else name="location" :size="32" color="#667eea" />
            <text class="btn-text">{{ isGettingLocation ? '正在获取定位...' : '获取当前位置' }}</text>
          </view>
          <LocationStatusBadge
            v-if="locationStatus !== 'fail'"
            :status="locationStatus"
            :show-retry="false"
          />
        </view>
        <view class="tip-box">
          <u-icon name="info-circle" size="16" color="#E6A23C" />
          <text class="tip-text">定位非必须但强烈建议开启，可提升记录完整性</text>
        </view>
        <!-- 手动输入地址 -->
        <input
          v-model="formData.address"
          class="input"
          placeholder="或手动输入拜访地址"
          placeholder-style="color: #C0C4CC"
        />
      </view>

      <!-- 核心价值信息 -->
      <view class="form-section">
        <view class="section-title">核心价值信息 <text class="required">*</text></view>
        <textarea
          v-model="formData.value_info"
          class="textarea"
          placeholder="请输入本次拜访的核心价值信息、客户需求、意向程度等关键内容..."
          placeholder-style="color: #C0C4CC"
          :maxlength="500"
        />
        <text class="char-count">{{ formData.value_info.length }}/500</text>
      </view>

      <!-- 参与人员 - 内部 -->
      <view class="form-section">
        <view class="section-title">内部参与人员</view>
        <UserSelector v-model="formData.system_users" />
      </view>

      <!-- 参与人员 - 客户方 -->
      <view class="form-section">
        <view class="section-title">客户方参与人员</view>
        <ClientContactSelector v-model="formData.client_contacts" :client-id="clientId" />
      </view>

      <!-- 附件上传 -->
      <view class="form-section">
        <view class="section-title">照片/文档附件</view>
        <view class="attachments">
          <view v-for="(file, index) in formData.attachments" :key="index" class="attachment-item">
            <image v-if="isImage(file)" :src="file" class="attachment-preview" mode="aspectFill" />
            <view v-else class="file-icon">
              <SvgIcon name="file" :size="48" color="#909399" />
            </view>
            <view class="remove-attachment" @click="removeAttachment(index)">
              <SvgIcon name="close" :size="24" color="#fff" />
            </view>
          </view>
          <view class="upload-btn" @click="handleUpload">
            <SvgIcon name="add" :size="48" color="#909399" />
            <text class="upload-text">上传附件</text>
          </view>
        </view>
      </view>

      <!-- 下次拜访时间 -->
      <view class="form-section">
        <view class="section-title">下次拜访时间</view>
        <view class="datetime-picker" @click="showNextVisitTimePicker = true">
          <text v-if="formData.next_visit_time" class="datetime-text">{{ dayjs(formData.next_visit_time).format('YYYY-MM-DD HH:mm') }}</text>
          <text v-else class="placeholder">选择下次拜访时间（可选）</text>
          <SvgIcon name="calendar" :size="32" color="#909399" />
        </view>
        <view v-if="formData.next_visit_time" class="clear-time" @click="formData.next_visit_time = ''">
          <text class="clear-text">清除</text>
        </view>
      </view>

      <!-- 同步日程选项 -->
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
          <text class="sync-hint">自动在日程表中创建本次拜访记录</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部提交栏 -->
    <view class="submit-bar">
      <view class="submit-btn" @click="handleSubmit">
        <text class="btn-text">提交拜访记录</text>
      </view>
    </view>

    <!-- 时间选择器 -->
    <u-datetime-picker
      v-model:show="showVisitTimePicker"
      v-model="visitTimeValue"
      mode="datetime"
      @confirm="onVisitTimeConfirm"
      @cancel="showVisitTimePicker = false"
      @close="showVisitTimePicker = false"
    />

    <!-- 下次拜访时间选择器 -->
    <u-datetime-picker
      v-model:show="showNextVisitTimePicker"
      v-model="nextVisitTimeValue"
      mode="datetime"
      :minDate="Date.now()"
      @confirm="onNextVisitTimeConfirm"
      @cancel="showNextVisitTimePicker = false"
      @close="showNextVisitTimePicker = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import LocationStatusBadge from '@/components/LocationStatusBadge/index.vue'
import UserSelector from '@/components/UserSelector/index.vue'
import ClientContactSelector from '@/components/ClientContactSelector/index.vue'
import type { LocationStatus, ClientVisitCreateParams } from '@/types/interfaces/client-visit'
import type { AiAttachment } from '@/types/interfaces/ai'
import dayjs from 'dayjs'
import { getEnvConfig } from '@/config/env'
import { createVisit } from '@/api/client'
import { createSchedule } from '@/api/schedule'
import { uploadFileToServer } from '@/utils/upload'
import { askToSyncCalendar } from '../../utils/calendar'
import SvgIcon from '@/components/SvgIcon/index.vue'

const clientId = ref<number | string>('')
const env = getEnvConfig()

// AI 扩展字段
const aiExtension = ref({
  trace_id: '',
  ai_source: 'manual'
})

const formData = ref({
  visit_time: '',
  duration: null as number | null,
  address: '',
  lng: null as number | null,
  lat: null as number | null,
  value_info: '',
  system_users: [] as any[],
  client_contacts: [] as any[],
  attachments: [] as AiAttachment[],
  // 下次拜访相关
  next_visit_time: '',
  sync_to_schedule: true
})

const locationStatus = ref<LocationStatus>('fail') // 初始状态为未定位
const showVisitTimePicker = ref(false)
const visitTimeValue = ref(Date.now())
const isGettingLocation = ref(false) // 是否正在获取定位

// 下次拜访时间选择器
const showNextVisitTimePicker = ref(false)
const nextVisitTimeValue = ref(Date.now() + 7 * 24 * 60 * 60 * 1000) // 默认一周后

onLoad((options: any) => {
  if (options?.trace_id) aiExtension.value.trace_id = options.trace_id
  if (options?.ai_source) aiExtension.value.ai_source = options.ai_source

  if (options?.clientId) {
    clientId.value = options.clientId
  }
  // 不自动获取定位，等待用户点击按钮
})

const formattedVisitTime = computed(() => {
  return formData.value.visit_time 
    ? dayjs(formData.value.visit_time).format('YYYY-MM-DD HH:mm')
    : ''
})

// 获取定位
async function getLocation() {
  try {
    // 检查网络状态
    const networkInfo = await uni.getNetworkType()
    if (networkInfo.networkType === 'none') {
      locationStatus.value = 'offline'
      uni.showToast({
        title: '网络未连接，无法获取定位',
        icon: 'none'
      })
      return
    }

    // H5 环境下使用浏览器原生 API（Mock 和真实环境都使用真实定位）
    // #ifdef H5
    // 使用浏览器 geolocation API 获取真实定位
    if (navigator.geolocation) {
      uni.showLoading({ title: '正在获取定位...' })
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          locationStatus.value = 'success'
          formData.value.lng = position.coords.longitude
          formData.value.lat = position.coords.latitude
          
          // 尝试通过逆地理编码获取地址名称
          try {
            const address = await reverseGeocode(position.coords.longitude, position.coords.latitude)
            formData.value.address = address || '定位成功，未获取到详细地址，请手动填写'
          } catch (e) {
            // 如果逆地理编码失败，给出友好提示
            formData.value.address = '定位成功，未获取到详细地址，请手动填写'
          }
          
          uni.hideLoading()
          uni.showToast({
            title: '定位成功',
            icon: 'success',
            duration: 1500
          })
        },
        (error) => {
          uni.hideLoading()
          console.error('H5定位失败:', error)
          if (error.code === error.PERMISSION_DENIED) {
            locationStatus.value = 'denied'
            uni.showModal({
              title: '定位权限被拒绝',
              content: '请在浏览器设置中允许网站访问您的位置信息',
              confirmText: '知道了',
              showCancel: false
            })
          } else {
            locationStatus.value = 'fail'
            uni.showToast({
              title: '定位失败，请检查网络或手动输入地址',
              icon: 'none',
              duration: 2000
            })
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      locationStatus.value = 'fail'
      uni.showToast({
        title: '浏览器不支持定位功能',
        icon: 'none'
      })
    }
    // #endif
    
    // #ifndef H5
    // 小程序/App 环境使用 uni.getLocation
    uni.showLoading({ title: '正在获取定位...' })
    
    const res = await uni.getLocation({
      type: 'gcj02',
      geocode: true, // 自动获取地址信息
      altitude: false
    })
    
    locationStatus.value = 'success'
    formData.value.lng = res.longitude
    formData.value.lat = res.latitude
    formData.value.address = res.address || '定位成功，未获取到详细地址，请手动填写'
    
    uni.hideLoading()
    uni.showToast({
      title: '定位成功',
      icon: 'success',
      duration: 1500
    })
    // #endif
    
  } catch (error: any) {
    uni.hideLoading()
    console.error('定位失败:', error)
    if (error.errMsg?.includes('auth deny') || error.errMsg?.includes('permission')) {
      locationStatus.value = 'denied'
      uni.showModal({
        title: '定位权限被拒绝',
        content: '建议前往系统设置开启定位权限，以便记录准确的拜访位置',
        confirmText: '知道了',
        showCancel: false
      })
    } else if (error.errMsg?.includes('timeout')) {
      locationStatus.value = 'fail'
      uni.showToast({
        title: '定位超时，请重试或手动输入地址',
        icon: 'none',
        duration: 2000
      })
    } else {
      locationStatus.value = 'fail'
      uni.showToast({
        title: '定位失败，请手动输入地址',
        icon: 'none',
        duration: 2000
      })
    }
  }
}

// 逆地理编码（H5 环境，使用浏览器 API 或第三方服务）
async function reverseGeocode(lng: number, lat: number): Promise<string | null> {
  // #ifdef H5
  // 可以使用高德/百度地图 API，这里先用简单的方案
  // 注意：实际项目中需要配置 API Key
  try {
    // 示例：使用高德地图逆地理编码 API（需要配置 API Key）
    // const response = await fetch(`https://restapi.amap.com/v3/geocode/regeo?key=YOUR_API_KEY&location=${lng},${lat}`)
    // const data = await response.json()
    // return data.regeocode?.formatted_address || null
    
    // 临时方案：如果逆地理编码不可用，只返回 null，让上层逻辑给出提示语
    return null
  } catch (e) {
    return null
  }
  // #endif
  
  // #ifndef H5
  // 小程序/App 环境 uni.getLocation 已包含地址信息
  return null
  // #endif
}

// 手动获取定位（用户点击按钮触发）
async function handleGetLocation() {
  if (isGettingLocation.value) return
  
  isGettingLocation.value = true
  await getLocation()
  isGettingLocation.value = false
}

// 时间确认
function onVisitTimeConfirm(e: any) {
  formData.value.visit_time = dayjs(e.value).format('YYYY-MM-DD HH:mm:ss')
  showVisitTimePicker.value = false
}

// 下次拜访时间确认
function onNextVisitTimeConfirm(e: any) {
  formData.value.next_visit_time = dayjs(e.value).format('YYYY-MM-DD HH:mm:ss')
  showNextVisitTimePicker.value = false
}

// 判断是否为图片
function isImage(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

// 上传附件
async function handleUpload() {
  try {
    const res = await uni.chooseImage({
      count: 9 - formData.value.attachments.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    })

    const newAttachments: AiAttachment[] = []
    for (const filePath of res.tempFilePaths) {
      try {
        const uploaded = await uploadFileToServer(filePath)
        if (uploaded?.url) {
          newAttachments.push({
            url: uploaded.url,
            name: uploaded.name || `附件_${Date.now()}`,
            mime: uploaded.mime || 'image/jpeg'
          })
        }
      } catch (error) {
        console.error('上传失败:', error)
      }
    }
    if (newAttachments.length) {
      formData.value.attachments.push(...newAttachments)
      uni.showToast({
        title: `已添加 ${newAttachments.length} 个附件`,
        icon: 'success'
      })
    }
  } catch (error) {
    console.error('上传失败:', error)
  }
}

// 删除附件
function removeAttachment(index: number) {
  formData.value.attachments.splice(index, 1)
}

// 表单校验
function validateForm() {
  if (!formData.value.visit_time) {
    uni.showToast({ title: '请选择拜访时间', icon: 'none' })
    return false
  }
  if (!formData.value.value_info.trim()) {
    uni.showToast({ title: '请输入核心价值信息', icon: 'none' })
    return false
  }
  return true
}

// 提交表单
async function handleSubmit() {
  if (!validateForm()) return

  try {
    uni.showLoading({ title: '提交中...' })

    const submitData: ClientVisitCreateParams = {
      client_id: clientId.value,
      visit_time: formData.value.visit_time,
      duration: formData.value.duration || undefined,
      address: formData.value.address,
      lng: formData.value.lng || undefined,
      lat: formData.value.lat || undefined,
      location_status: locationStatus.value,
      value_info: formData.value.value_info,
      system_users: formData.value.system_users.map(u => u.id),
      client_contacts: formData.value.client_contacts,
      attachments: formData.value.attachments,
      ...aiExtension.value
    }

    // 调用 API（Mock 会写入并更新客户的 valid_visit_count/sales_stage）
    const visitResult = await createVisit(submitData)
    console.log('提交拜访记录:', submitData)

    // 同步本次拜访到日程
    let createdSchedule: any = null
    if (formData.value.sync_to_schedule) {
      try {
        const scheduleData = {
          title: `客户拜访 - ${formData.value.value_info.substring(0, 20)}${formData.value.value_info.length > 20 ? '...' : ''}`,
          description: `拜访核心信息：${formData.value.value_info}`,
          schedule_type: 'meeting' as const,
          start_time: dayjs(formData.value.visit_time).toISOString(),
          end_time: formData.value.duration 
            ? dayjs(formData.value.visit_time).add(formData.value.duration, 'minute').toISOString() 
            : undefined,
          location: formData.value.address || '',
          status: 'completed' as const,
          priority: 'medium' as const,
          is_all_day: false,
          reminder_enabled: false,
          related_type: 'visit' as const,
          related_id: visitResult?.data?.id || clientId.value as number,
          remark: `来自拜访记录自动生成`
        }

        const scheduleRes = await createSchedule(scheduleData)
        console.log('createSchedule 返回结果:', scheduleRes)
        console.log('scheduleRes.data:', scheduleRes?.data)
        createdSchedule = scheduleRes?.data || {
          ...scheduleData,
          id: Date.now(),
          create_datetime: new Date().toISOString(),
          update_datetime: new Date().toISOString(),
          creator: { id: 1, username: 'user', name: '用户' }
        }
        console.log('createdSchedule:', createdSchedule)
        console.log('已同步拜访到日程:', scheduleData)
      } catch (error) {
        console.error('同步日程失败:', error)
      }
    }

    // 如果填写了下次拜访时间，额外创建一个提醒日程
    if (formData.value.next_visit_time) {
      try {
        const nextScheduleData = {
          title: `回访提醒 - ${formData.value.value_info.substring(0, 15)}...`,
          description: `上次拜访核心信息：${formData.value.value_info}`,
          schedule_type: 'reminder' as const,
          start_time: dayjs(formData.value.next_visit_time).toISOString(),
          location: formData.value.address || '',
          status: 'pending' as const,
          priority: 'medium' as const,
          is_all_day: false,
          reminder_enabled: true,
          reminder_time: 60,
          reminder_method: 'system',
          related_type: 'visit' as const,
          related_id: visitResult?.data?.id || clientId.value as number,
          remark: `来自拜访记录自动生成的回访提醒`
        }

        await createSchedule(nextScheduleData)
        console.log('已创建下次拜访提醒:', nextScheduleData)
      } catch (error) {
        console.error('创建回访提醒失败:', error)
      }
    }

    uni.hideLoading()

    // 如果创建了日程，询问是否同步到系统日历
    if (createdSchedule) {
      uni.showToast({
        title: '已同步到日程',
        icon: 'success',
        duration: 2000
      })
      
      // 延迟一下，让用户看到创建成功的提示
      setTimeout(async () => {
        await askToSyncCalendar(createdSchedule, true)
      }, 1500)
    } else {
      uni.showToast({
        title: '提交成功',
        icon: 'success'
      })
    }

    setTimeout(() => {
      uni.navigateBack()
    }, 2000)

  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({
      title: error?.message || '提交失败，请重试',
      icon: 'none'
    })
    console.error('提交失败:', error)
  }
}
</script>

<style scoped lang="scss">
.visit-create-page {
  min-height: 100vh;
  background: #F5F7FA;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; /* 防止横向溢出 */
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
  box-sizing: border-box; /* 确保 padding 不会导致溢出 */
  width: 100%; /* 确保不超出容器宽度 */
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

.datetime-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  border: 1rpx solid transparent;
  box-sizing: border-box; /* 防止 padding 导致溢出 */

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

.input {
  width: 100%;
  height: 72rpx;
  padding: 0 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #303133;
  border: 1rpx solid transparent;
  box-sizing: border-box; /* 防止 padding 导致溢出 */

  &:focus {
    border-color: #667eea;
    background: #fff;
  }
}

.address-display {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 16rpx;
  padding: 16rpx 20rpx;
  background: #F0F9FF;
  border-radius: 8rpx;
  box-sizing: border-box;
  width: 100%;
}

.address-text {
  flex: 1;
  font-size: 26rpx;
  color: #67C23A;
  word-break: break-all;
}

.location-action-area {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 16rpx;
}

.get-location-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
  box-sizing: border-box;
  width: 100%;
  transition: opacity 0.3s;

  &:active {
    opacity: 0.8;
  }

  &.is-loading {
    opacity: 0.7;
  }
}

.get-location-btn .btn-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
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
  box-sizing: border-box; /* 防止 padding 导致溢出 */

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

.attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  width: 100%;
  box-sizing: border-box;
}

.attachment-item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.attachment-preview {
  width: 100%;
  height: 100%;
}

.file-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
}

.remove-attachment {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
}

.upload-btn {
  width: 160rpx;
  height: 160rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  background: #F5F7FA;
  border: 1rpx dashed #DCDFE6;
  border-radius: 8rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #909399;
}

.clear-time {
  margin-top: 16rpx;
  text-align: right;
}

.clear-text {
  font-size: 26rpx;
  color: #F56C6C;
}

.form-item {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  font-size: 28rpx;
  color: #303133;
  font-weight: 500;
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

  &:active {
    opacity: 0.8;
  }
}

.btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
}
</style>
