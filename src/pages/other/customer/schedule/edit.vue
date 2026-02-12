<template>
  <view class="page">
    <scroll-view class="content" scroll-y>
      <!-- 标题 -->
      <view class="form-section">
        <view class="section-label">日程标题 *</view>
        <input
          v-model="formData.title"
          class="input-field"
          placeholder="请输入日程标题"
          placeholder-class="input-placeholder"
        />
      </view>

      <!-- 时间 -->
      <view class="form-section">
        <view class="section-label">时间 *</view>
        <view class="time-row" @tap="showStartTimePicker = true">
          <view class="time-label">开始</view>
          <view class="time-value">
            <text v-if="formData.start_time">{{ formData.start_time }}</text>
            <text v-else class="placeholder">选择开始时间</text>
          </view>
          <view class="time-arrow">›</view>
        </view>
        <view class="time-row" @tap="onOpenEndTimePicker">
          <view class="time-label">结束</view>
          <view class="time-value">
            <text v-if="formData.end_time">{{ formData.end_time }}</text>
            <text v-else class="placeholder">选择结束时间</text>
          </view>
          <view class="time-arrow">›</view>
        </view>
        <view class="switch-row">
          <text class="switch-label">全天</text>
          <switch
            :checked="formData.is_all_day"
            @change="formData.is_all_day = $event.detail.value"
            color="#3370ff"
          />
        </view>
      </view>

      <!-- 类型 -->
      <view class="form-section">
        <view class="section-label">日程类型 *</view>
        <view class="tag-group">
          <view
            v-for="item in scheduleTypes"
            :key="item.value"
            class="tag-item"
            :class="{ active: formData.schedule_type === item.value }"
            @tap="formData.schedule_type = item.value"
          >
            {{ item.label }}
          </view>
        </view>
        <view v-if="formData.schedule_type === 'other'" class="other-type-input">
          <view class="section-label">其他类型</view>
          <input
            v-model="formData.other_type_content"
            class="input-field"
            placeholder="请输入具体类型"
            placeholder-class="input-placeholder"
            maxlength="200"
          />
        </view>
      </view>

      <!-- 优先级 -->
      <view class="form-section">
        <view class="section-label">优先级 *</view>
        <view class="tag-group">
          <view
            v-for="item in priorities"
            :key="item.value"
            class="tag-item priority-tag"
            :class="{ active: formData.priority === item.value, [`priority-${item.value}`]: formData.priority === item.value }"
            @tap="formData.priority = item.value"
          >
            {{ item.label }}
          </view>
        </view>
      </view>

      <!-- 地点 -->
      <view class="form-section">
        <view class="section-label">地点</view>
        <input
          v-model="formData.location"
          class="input-field"
          placeholder="请输入地点"
          placeholder-class="input-placeholder"
        />
      </view>

      <!-- 描述 -->
      <view class="form-section">
        <view class="section-label">描述</view>
        <textarea
          v-model="formData.description"
          class="textarea-field"
          placeholder="请输入日程描述"
          placeholder-class="input-placeholder"
          :maxlength="500"
        />
      </view>

      <!-- 提醒 -->
      <view class="form-section">
        <view class="switch-row">
          <text class="switch-label">提醒</text>
          <switch
            :checked="formData.reminder_enabled"
            @change="formData.reminder_enabled = $event.detail.value"
            color="#3370ff"
          />
        </view>
        
        <!-- 提前时间 -->
        <view v-if="formData.reminder_enabled" class="reminder-options">
          <view class="reminder-label">提前时间</view>
          <view
            v-for="item in reminderTimes"
            :key="item.value"
            class="reminder-item"
            :class="{ active: formData.reminder_time === item.value }"
            @tap="formData.reminder_time = item.value"
          >
            {{ item.label }}
          </view>
        </view>
        
        <!-- 提醒方式 -->
        <view v-if="formData.reminder_enabled" class="reminder-methods">
          <view class="reminder-label">提醒方式</view>
          <view class="method-tags">
            <view
              v-for="method in reminderMethods"
              :key="method.value"
              class="method-tag"
              :class="{ 
                active: selectedMethods.includes(method.value),
                disabled: method.disabled 
              }"
              @tap="toggleReminderMethod(method.value, method.disabled)"
            >
              <text class="method-icon">{{ method.icon }}</text>
              <text class="method-label">{{ method.label }}</text>
              <text v-if="method.disabled" class="method-tip">{{ method.tip }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 关联对象 -->
      <view class="form-section">
        <view class="section-label">关联对象</view>
        
        <!-- 关联客户选择 -->
        <view class="related-select" @tap="onSelectCustomer">
          <view class="select-label">关联客户</view>
          <view class="select-value">
            <text v-if="selectedCustomer">{{ selectedCustomer.name }}</text>
            <text v-else class="placeholder">请选择客户</text>
          </view>
          <view class="select-arrow">›</view>
        </view>
        
        <!-- 关联案件选择 -->
        <view class="related-select" @tap="onSelectCase">
          <view class="select-label">关联案件</view>
          <view class="select-value">
            <text v-if="selectedCase">{{ selectedCase.name }}</text>
            <text v-else class="placeholder">请选择案件</text>
          </view>
          <view class="select-arrow">›</view>
        </view>
      </view>

      <!-- 备注 -->
      <view class="form-section">
        <view class="section-label">备注</view>
        <textarea
          v-model="formData.remark"
          class="textarea-field"
          placeholder="请输入备注"
          placeholder-class="input-placeholder"
          :maxlength="500"
        />
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="footer">
      <view class="submit-btn" @tap="onSubmit">
        {{ isEdit ? '保存' : '创建日程' }}
      </view>
    </view>

    <!-- 时间选择器 -->
    <u-datetime-picker
      v-model="startTimeValue"
      :show="showStartTimePicker"
      mode="datetime"
      @confirm="onStartTimeConfirm"
      @cancel="showStartTimePicker = false"
    ></u-datetime-picker>

    <u-datetime-picker
      v-model="endTimeValue"
      :show="showEndTimePicker"
      mode="datetime"
      :minDate="minEndTime"
      @confirm="onEndTimeConfirm"
      @cancel="showEndTimePicker = false"
    ></u-datetime-picker>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { getScheduleDetail, createSchedule, updateSchedule } from '@/api/schedule'
import type { ScheduleCreateParams, ReminderMethod } from '@/types/interfaces/schedule'
import { askToSyncCalendar } from '../../utils/calendar'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const scheduleId = ref<number>(0)
const isEdit = computed(() => scheduleId.value > 0)

const formData = reactive<ScheduleCreateParams>({
  title: '',
  description: '',
  schedule_type: 'meeting',
  other_type_content: '',
  start_time: '',
  end_time: '',
  location: '',
  status: 'pending',
  priority: 'medium',
  is_all_day: false,
  reminder_enabled: true,
  reminder_time: 30,
  reminder_method: 'system',
  remark: ''
})

const scheduleTypes = [
  { label: '会议', value: 'meeting' },
  { label: '开庭', value: 'court' },
  { label: '截止日期', value: 'deadline' },
  { label: '提醒', value: 'reminder' },
  { label: '其他', value: 'other' }
]

const priorities = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '重要', value: 'high' },
  { label: '紧急', value: 'urgent' }
]

const reminderTimes = [
  { label: '准时', value: 0 },
  { label: '提前15分钟', value: 15 },
  { label: '提前30分钟', value: 30 },
  { label: '提前1小时', value: 60 },
  { label: '提前2小时', value: 120 },
  { label: '提前1天', value: 1440 }
]

// 提醒方式配置
const reminderMethods = computed(() => [
  { 
    label: '系统通知', 
    value: 'system' as ReminderMethod, 
    icon: '🔔',
    disabled: false 
  },
  { 
    label: '短信', 
    value: 'sms' as ReminderMethod, 
    icon: '📱',
    disabled: !userInfo.value?.phonenumber,
    tip: !userInfo.value?.phonenumber ? '未设置手机号' : ''
  },
  { 
    label: '邮件', 
    value: 'email' as ReminderMethod, 
    icon: '📧',
    disabled: !userInfo.value?.email,
    tip: !userInfo.value?.email ? '未设置邮箱' : ''
  }
])

// 已选择的提醒方式
const selectedMethods = ref<ReminderMethod[]>(['system'])

// 切换提醒方式
function toggleReminderMethod(method: ReminderMethod, disabled?: boolean) {
  if (disabled) {
    if (method === 'sms' && !userInfo.value?.phonenumber) {
      uni.showModal({
        title: '提示',
        content: '您还未设置手机号，无法使用短信提醒。是否前往设置？',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({ url: '/pages/other/profile/edit' })
          }
        }
      })
    } else if (method === 'email' && !userInfo.value?.email) {
      uni.showModal({
        title: '提示',
        content: '您还未设置邮箱，无法使用邮件提醒。是否前往设置？',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({ url: '/pages/other/profile/edit' })
          }
        }
      })
    }
    return
  }
  
  const index = selectedMethods.value.indexOf(method)
  if (index > -1) {
    // 至少保留一个提醒方式
    if (selectedMethods.value.length === 1) {
      uni.showToast({ title: '至少选择一种提醒方式', icon: 'none' })
      return
    }
    selectedMethods.value.splice(index, 1)
  } else {
    selectedMethods.value.push(method)
  }
  
  // 更新formData
  formData.reminder_method = selectedMethods.value.join(',')
}

const selectedCustomer = ref<{ id: number; name: string } | null>(null)
const selectedCase = ref<{ id: number; name: string } | null>(null)
const selectedCustomerId = ref<number>()
const selectedCaseId = ref<number>()

const showStartTimePicker = ref(false)
const showEndTimePicker = ref(false)
const startTimeValue = ref(Date.now())
const endTimeValue = ref(Date.now())

// 计算结束时间选择器的最小时间（不能早于开始时间）
const minEndTime = computed(() => {
  if (formData.start_time) {
    const startDate = new Date(formData.start_time)
    return startDate.getTime()
  }
  return Date.now()
})

onLoad(async (options: any) => {
  // 监听客户选择事件
  uni.$on('customer-selected', (customer: { id: number; name: string }) => {
    selectedCustomer.value = customer
    selectedCustomerId.value = customer.id
  })
  
  // 监听案件选择事件
  uni.$on('case-selected', (caseItem: { id: number; name: string }) => {
    selectedCase.value = caseItem
    selectedCaseId.value = caseItem.id
  })
  
  // 如果有传入日期，设置默认开始时间
  if (options.date) {
    formData.start_time = `${options.date} 09:00`
    // 同时更新picker的值
    const defaultDate = new Date(`${options.date} 09:00`)
    startTimeValue.value = defaultDate.getTime()
  } else {
    // 默认设置为当前时间
    const now = new Date()
    startTimeValue.value = now.getTime()
    endTimeValue.value = now.getTime() + 60 * 60 * 1000 // 默认1小时后
  }

  // 如果是编辑模式，加载日程详情
  if (options.id) {
    scheduleId.value = Number(options.id)
    await loadScheduleDetail()
  }
})

onUnload(() => {
  // 清理事件监听
  uni.$off('customer-selected')
  uni.$off('case-selected')
})

async function loadScheduleDetail() {
  try {
    const schedule = await getScheduleDetail(scheduleId.value)
    Object.assign(formData, {
      title: schedule.title,
      description: schedule.description,
      schedule_type: schedule.schedule_type,
      other_type_content: schedule.other_type_content || '',
      start_time: formatDateTime(schedule.start_time),
      end_time: schedule.end_time ? formatDateTime(schedule.end_time) : '',
      location: schedule.location,
      priority: schedule.priority,
      is_all_day: schedule.is_all_day,
      reminder_enabled: schedule.reminder_enabled,
      reminder_time: schedule.reminder_time,
      reminder_method: schedule.reminder_method || 'system',
      remark: schedule.remark,
      related_type: schedule.related_type,
      related_id: schedule.related_id
    })
    
    // 解析提醒方式
    if (schedule.reminder_method) {
      selectedMethods.value = schedule.reminder_method.split(',') as ReminderMethod[]
    }
    
    // 加载关联对象信息
    if (schedule.related_type === 'customer' && schedule.related_id) {
      selectedCustomer.value = {
        id: schedule.related_id,
        name: schedule.related_info?.name || `客户 #${schedule.related_id}`
      }
      selectedCustomerId.value = schedule.related_id
    } else if (schedule.related_type === 'case' && schedule.related_id) {
      selectedCase.value = {
        id: schedule.related_id,
        name: schedule.related_info?.name || `案件 #${schedule.related_id}`
      }
      selectedCaseId.value = schedule.related_id
    }
    
    // 如果有额外的customer_id或case_id字段，也加载
    if ((schedule as any).customer_id) {
      selectedCustomer.value = {
        id: (schedule as any).customer_id,
        name: (schedule as any).customer_name || `客户 #${(schedule as any).customer_id}`
      }
      selectedCustomerId.value = (schedule as any).customer_id
    }
    
    if ((schedule as any).case_id) {
      selectedCase.value = {
        id: (schedule as any).case_id,
        name: (schedule as any).case_name || `案件 #${(schedule as any).case_id}`
      }
      selectedCaseId.value = (schedule as any).case_id
    }
    
    // 设置时间选择器的值
    if (formData.start_time) {
      const startDate = new Date(formData.start_time)
      startTimeValue.value = startDate.getTime()
    }
    
    if (formData.end_time) {
      const endDate = new Date(formData.end_time)
      const startTimestamp = formData.start_time ? new Date(formData.start_time).getTime() : 0
      
      // 如果结束时间早于开始时间，自动调整为开始时间+1小时
      if (startTimestamp > 0 && endDate.getTime() <= startTimestamp) {
        const adjustedEndTime = new Date(startTimestamp)
        adjustedEndTime.setHours(adjustedEndTime.getHours() + 1)
        formData.end_time = formatDateTime(adjustedEndTime.toISOString())
        endTimeValue.value = adjustedEndTime.getTime()
        
        uni.showToast({
          title: '已自动调整结束时间',
          icon: 'none',
          duration: 2000
        })
      } else {
        endTimeValue.value = endDate.getTime()
      }
    } else if (formData.start_time) {
      // 如果没有结束时间，默认设置为开始时间+1小时
      const startTimestamp = new Date(formData.start_time).getTime()
      const defaultEndTime = new Date(startTimestamp)
      defaultEndTime.setHours(defaultEndTime.getHours() + 1)
      formData.end_time = formatDateTime(defaultEndTime.toISOString())
      endTimeValue.value = defaultEndTime.getTime()
    }
  } catch (error) {
    console.error('加载日程详情失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

function formatDateTime(timeStr: string) {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

function onStartTimeConfirm(e: any) {
  // uview-plus的datetime-picker返回的是一个对象 { value: timestamp }
  let timestamp = e
  if (e && typeof e === 'object' && e.value !== undefined) {
    timestamp = e.value
  }
  
  const date = new Date(timestamp)
  const formatted = formatDateTime(date.toISOString())
  
  formData.start_time = formatted
  startTimeValue.value = timestamp
  
  // 如果结束时间存在且早于新的开始时间，自动调整为开始时间后1小时
  if (formData.end_time) {
    const endDate = new Date(formData.end_time)
    if (endDate.getTime() <= timestamp) {
      const adjustedEndTime = new Date(timestamp)
      adjustedEndTime.setHours(adjustedEndTime.getHours() + 1)
      formData.end_time = formatDateTime(adjustedEndTime.toISOString())
      endTimeValue.value = adjustedEndTime.getTime()
      
      uni.showToast({
        title: '已自动调整结束时间',
        icon: 'none',
        duration: 2000
      })
    }
  } else {
    // 如果没有结束时间，自动设置为开始时间后1小时
    const defaultEndTime = new Date(timestamp)
    defaultEndTime.setHours(defaultEndTime.getHours() + 1)
    formData.end_time = formatDateTime(defaultEndTime.toISOString())
    endTimeValue.value = defaultEndTime.getTime()
  }
  
  showStartTimePicker.value = false
}

function onEndTimeConfirm(e: any) {
  let timestamp = e
  if (e && typeof e === 'object' && e.value !== undefined) {
    timestamp = e.value
  }
  
  // 检查结束时间是否早于开始时间
  if (formData.start_time) {
    const startTimestamp = new Date(formData.start_time).getTime()
    if (timestamp <= startTimestamp) {
      uni.showToast({
        title: '结束时间必须大于开始时间',
        icon: 'none',
        duration: 2000
      })
      // 不关闭选择器，让用户重新选择
      return
    }
  }
  
  const date = new Date(timestamp)
  const formatted = formatDateTime(date.toISOString())
  
  formData.end_time = formatted
  endTimeValue.value = timestamp
  showEndTimePicker.value = false
  
  uni.showToast({
    title: '已选择时间',
    icon: 'none',
    duration: 1000
  })
}

// 打开结束时间选择器前的校验
function onOpenEndTimePicker() {
  // 如果还没有选择开始时间，提示用户先选择开始时间
  if (!formData.start_time) {
    uni.showToast({
      title: '请先选择开始时间',
      icon: 'none',
      duration: 2000
    })
    return
  }
  
  // 如果当前结束时间早于开始时间，自动调整为开始时间+1小时
  if (formData.end_time) {
    const startTimestamp = new Date(formData.start_time).getTime()
    const endTimestamp = new Date(formData.end_time).getTime()
    if (endTimestamp <= startTimestamp) {
      const adjustedEndTime = new Date(startTimestamp)
      adjustedEndTime.setHours(adjustedEndTime.getHours() + 1)
      formData.end_time = formatDateTime(adjustedEndTime.toISOString())
      endTimeValue.value = adjustedEndTime.getTime()
    } else {
      // 确保选择器的初始值不会小于开始时间
      endTimeValue.value = Math.max(endTimestamp, startTimestamp)
    }
  } else {
    // 如果没有结束时间，默认设置为开始时间+1小时
    const startTimestamp = new Date(formData.start_time).getTime()
    const defaultEndTime = new Date(startTimestamp)
    defaultEndTime.setHours(defaultEndTime.getHours() + 1)
    endTimeValue.value = defaultEndTime.getTime()
  }
  
  showEndTimePicker.value = true
}

function onSelectCustomer() {
  // 跳转到客户选择器
  uni.navigateTo({
    url: '/pages/other/selector/customer'
  })
}

function onSelectCase() {
  // 跳转到案件选择器
  uni.navigateTo({
    url: '/pages/other/selector/case'
  })
}

async function onSubmit() {
  // 简单验证
  if (!formData.title) {
    uni.showToast({ title: '请输入日程标题', icon: 'none' })
    return
  }
  if (!formData.start_time) {
    uni.showToast({ title: '请选择开始时间', icon: 'none' })
    return
  }
  if (formData.schedule_type === 'other' && !formData.other_type_content?.trim()) {
    uni.showToast({ title: '请填写其他类型', icon: 'none' })
    return
  }

  try {
    // 转换时间格式为ISO 8601
    const submitData: any = {
      ...formData,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: formData.end_time ? new Date(formData.end_time).toISOString() : undefined,
    }
    
    // 确保other_type_content字段被包含（即使为空字符串也要发送）
    // 因为request.ts中的filterEmptyParams会过滤掉空字符串，所以需要显式处理
    if (formData.schedule_type === 'other') {
      submitData.other_type_content = formData.other_type_content || ''
    } else {
      // 如果不是"其他"类型，设置为null（让后端忽略）
      submitData.other_type_content = null
    }
    
    // 添加客户和案件关联（如果有选择）
    if (selectedCustomerId.value) {
      submitData.customer_id = selectedCustomerId.value
      submitData.related_type = 'customer'
      submitData.related_id = selectedCustomerId.value
    }
    
    if (selectedCaseId.value) {
      submitData.case_id = selectedCaseId.value
      // 如果同时有客户和案件，优先使用案件作为主关联
      submitData.related_type = 'case'
      submitData.related_id = selectedCaseId.value
    }

    if (isEdit.value) {
      // 编辑模式
      await updateSchedule(scheduleId.value, submitData)
      uni.showToast({ title: '保存成功', icon: 'success' })
      
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      // 创建模式
      const res = await createSchedule(submitData)
      uni.showToast({ title: '创建成功', icon: 'success' })
      
      // 延迟一下，让用户看到成功提示
      setTimeout(async () => {
        // 询问是否同步到系统日历
        const scheduleData = res.data || {
          ...submitData,
          id: Date.now(),
          status: 'pending',
          create_datetime: new Date().toISOString(),
          update_datetime: new Date().toISOString(),
          creator: { id: 1, username: 'user', name: '用户' }
        }
        
        await askToSyncCalendar(scheduleData, true)
        
        // 返回上一页
        uni.navigateBack()
      }, 1500)
    }
  } catch (error) {
    console.error('提交失败:', error)
    uni.showToast({ title: '提交失败', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 24rpx 32rpx calc(220rpx + constant(safe-area-inset-bottom));
  padding: 24rpx 32rpx calc(220rpx + env(safe-area-inset-bottom));
}

// 表单区块
.form-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.section-label {
  font-size: 28rpx;
  color: #1f2329;
  font-weight: 500;
  margin-bottom: 20rpx;
}

// 输入框
.input-field {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #1f2329;
}

.input-placeholder {
  color: #c9cdd4;
}

.textarea-field {
  width: 100%;
  min-height: 200rpx;
  padding: 24rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #1f2329;
  line-height: 1.6;
}

// 时间选择
.time-row {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.time-label {
  font-size: 28rpx;
  color: #646a73;
  width: 80rpx;
}

.time-value {
  flex: 1;
  font-size: 28rpx;
  color: #1f2329;

  .placeholder {
    color: #c9cdd4;
  }
}

.time-arrow {
  font-size: 40rpx;
  color: #c9cdd4;
  font-weight: 300;
}

// 开关行
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
  margin-top: 16rpx;
}

.switch-label {
  font-size: 28rpx;
  color: #1f2329;
}

// 标签组
.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.other-type-input {
  margin-top: 24rpx;
}

.tag-item {
  padding: 16rpx 32rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #646a73;
  transition: all 0.2s;

  &.active {
    background: #e8f3ff;
    color: #3370ff;
    font-weight: 500;
  }

  &.priority-tag.active {
    &.priority-urgent {
      background: #ffece8;
      color: #f54a45;
    }

    &.priority-high {
      background: #fff7e8;
      color: #ff8800;
    }

    &.priority-medium {
      background: #e8f3ff;
      color: #3370ff;
    }

    &.priority-low {
      background: #e8ffea;
      color: #00b42a;
    }
  }
}

// 提醒选项
.reminder-options {
  margin-top: 20rpx;
}

.reminder-label {
  font-size: 26rpx;
  color: #646a73;
  margin-bottom: 12rpx;
  padding-left: 4rpx;
}

.reminder-item {
  height: 72rpx;
  padding: 0 24rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #646a73;
  transition: all 0.2s;
  margin-bottom: 12rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &.active {
    background: #e8f3ff;
    color: #3370ff;
    font-weight: 500;
  }
}

// 提醒方式
.reminder-methods {
  margin-top: 24rpx;
}

.method-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.method-tag {
  position: relative;
  padding: 20rpx 28rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  min-width: 140rpx;
  transition: all 0.2s;

  &.active {
    background: #e8f3ff;
    border: 2rpx solid #3370ff;
    
    .method-label {
      color: #3370ff;
      font-weight: 500;
    }
  }

  &.disabled {
    opacity: 0.5;
    
    .method-label {
      color: #c9cdd4;
    }
  }
}

.method-icon {
  font-size: 40rpx;
  line-height: 1;
}

.method-label {
  font-size: 24rpx;
  color: #646a73;
  line-height: 1;
}

.method-tip {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  padding: 4rpx 12rpx;
  background: #ff8800;
  color: #fff;
  font-size: 20rpx;
  border-radius: 20rpx;
  white-space: nowrap;
  transform: scale(0.9);
}

// 关联对象选择
.related-select {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
  margin-top: 20rpx;
  
  &:first-of-type {
    margin-top: 0;
  }
}

.select-label {
  font-size: 28rpx;
  color: #646a73;
  width: 120rpx;
}

.select-value {
  flex: 1;
  font-size: 28rpx;
  color: #1f2329;

  .placeholder {
    color: #c9cdd4;
  }
}

.select-arrow {
  font-size: 40rpx;
  color: #c9cdd4;
  font-weight: 300;
}

// 底部按钮
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid #f2f3f5;
  z-index: 1200;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: #3370ff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #fff;
  font-weight: 500;
  transition: all 0.2s;

  &:active {
    transform: scale(0.96);
    opacity: 0.9;
  }
}
</style>
