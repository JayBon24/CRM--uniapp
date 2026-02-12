<template>
  <view class="page">
    <view v-if="loading" class="loading">
      <view class="loading-spinner"></view>
    </view>

    <view v-else-if="schedule" class="detail">
      <!-- 标题卡片 -->
      <view class="title-card">
        <view class="title-header">
          <view class="type-badge" :class="`type-${schedule.schedule_type}`">
            {{ getTypeDisplayText(schedule.schedule_type, schedule.other_type_content) }}
          </view>
          <view v-if="schedule.priority === 'urgent' || schedule.priority === 'high'" 
                class="priority-badge" :class="`priority-${schedule.priority}`">
            {{ getPriorityText(schedule.priority) }}
          </view>
        </view>
        <view class="title-text">{{ schedule.title }}</view>
      </view>

      <!-- 时间卡片 -->
      <view class="info-card">
        <view class="card-row">
          <view class="row-icon">🕐</view>
          <view class="row-content">
            <view class="row-label">开始时间</view>
            <view class="row-value">{{ formatDateTime(schedule.start_time) }}</view>
          </view>
        </view>
        <view v-if="schedule.end_time" class="card-row">
          <view class="row-icon">🕐</view>
          <view class="row-content">
            <view class="row-label">结束时间</view>
            <view class="row-value">{{ formatDateTime(schedule.end_time) }}</view>
          </view>
        </view>
      </view>

      <!-- 地点卡片 -->
      <view v-if="schedule.location" class="info-card">
        <view class="card-row">
          <view class="row-icon">📍</view>
          <view class="row-content">
            <view class="row-label">地点</view>
            <view class="row-value">{{ schedule.location }}</view>
          </view>
        </view>
      </view>

      <!-- 描述卡片 -->
      <view v-if="schedule.description" class="info-card">
        <view class="card-row">
          <view class="row-icon">📝</view>
          <view class="row-content">
            <view class="row-label">描述</view>
            <view class="row-value desc-text">{{ schedule.description }}</view>
          </view>
        </view>
      </view>

      <!-- 提醒卡片 -->
      <view v-if="schedule.reminder_enabled" class="info-card">
        <view class="card-row">
          <view class="row-icon">🔔</view>
          <view class="row-content">
            <view class="row-label">提醒</view>
            <view class="row-value">{{ formatReminderTime(schedule.reminder_time) }}</view>
          </view>
        </view>
      </view>

      <!-- 参与人员 -->
      <view v-if="schedule.participants && schedule.participants.length > 0" class="info-card">
        <view class="card-row">
          <view class="row-icon">👥</view>
          <view class="row-content">
            <view class="row-label">参与人员</view>
            <view class="participants-list">
              <view v-for="(p, idx) in schedule.participants" :key="idx" class="participant">
                <text class="participant-name">{{ p.name }}</text>
                <text v-if="p.role" class="participant-role">{{ p.role }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 备注 -->
      <view v-if="schedule.remark" class="info-card">
        <view class="card-row">
          <view class="row-icon">💬</view>
          <view class="row-content">
            <view class="row-label">备注</view>
            <view class="row-value desc-text">{{ schedule.remark }}</view>
          </view>
        </view>
      </view>
      
      <!-- 关联信息 -->
      <view v-if="schedule.related_type && schedule.related_id" class="info-card">
        <view class="card-row clickable" @tap="onViewRelated">
          <view class="row-icon">🔗</view>
          <view class="row-content">
            <view class="row-label">关联{{ getRelatedTypeText(schedule.related_type) }}</view>
            <view class="row-value related-link">
              <text>{{ getRelatedName() }}</text>
              <text class="link-arrow">›</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view v-if="schedule" class="footer">
      <view class="action-buttons">
        <view class="action-btn sync" @tap="onSyncToCalendar">
          同步到日历
        </view>
        <view
          v-if="schedule.status === 'pending'"
          class="action-btn primary"
          @tap="onUpdateStatus('in_progress')"
        >
          开始处理
        </view>
        <view
          v-if="schedule.status === 'in_progress'"
          class="action-btn success"
          @tap="onUpdateStatus('completed')"
        >
          标记完成
        </view>
        <view class="action-btn secondary" @tap="onEdit">编辑</view>
        <view class="action-btn danger" @tap="onDelete">删除</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { getScheduleDetail, updateScheduleStatus, deleteSchedule } from '@/api/schedule'
import type { Schedule } from '@/types/interfaces/schedule'
import { addToPhoneCalendar } from '../../utils/calendar'

const scheduleId = ref<number>(0)
const schedule = ref<Schedule | null>(null)
const loading = ref(true)  // 默认为 true，等待 onLoad

onLoad((options: any) => {
  if (options && options.id) {
    scheduleId.value = Number(options.id)
    loadScheduleDetail()
  } else {
    loading.value = false
    uni.showModal({
      title: '参数错误',
      content: '未找到日程ID，请返回重试',
      showCancel: false,
      success: () => {
        uni.navigateBack({
          fail: () => {
            // 如果无法返回，跳转到日程列表页
            uni.reLaunch({
              url: '/pages/tab/schedule'
            })
          }
        })
      }
    })
  }
})

async function loadScheduleDetail() {
  loading.value = true
  try {
    const result = await getScheduleDetail(scheduleId.value)

    if (result && result.title) {
      schedule.value = result
    } else {
      throw new Error('返回数据格式异常')
    }
  } catch (error) {
    console.error('加载日程详情失败:', error)
    uni.showModal({
      title: '加载失败',
      content: `无法加载日程详情：${error instanceof Error ? error.message : '未知错误'}`,
      showCancel: false
    })
  } finally {
    loading.value = false
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

function getTypeText(type: string) {
  const typeMap: Record<string, string> = {
    meeting: '会议',
    court: '开庭',
    deadline: '截止日期',
    reminder: '提醒',
    other: '其他'
  }
  return typeMap[type] || type
}

function getTypeDisplayText(type: string, otherTypeContent?: string) {
  const baseText = getTypeText(type)
  // 如果是"其他"类型且有填写内容，显示为"其他(填写内容)"格式
  if (type === 'other' && otherTypeContent && otherTypeContent.trim()) {
    return `${baseText}(${otherTypeContent})`
  }
  return baseText
}

function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

function getPriorityText(priority: string) {
  const priorityMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '重要',
    urgent: '紧急'
  }
  return priorityMap[priority] || priority
}

function getReminderMethodText(method?: string) {
  if (!method) return '无'
  const methods = method.split(',')
  const methodMap: Record<string, string> = {
    system: '系统通知',
    email: '邮件',
    sms: '短信',
    wechat: '微信'
  }
  return methods.map(m => methodMap[m] || m).join('、')
}
function formatReminderTime(reminderTime?: number) {
  if (reminderTime === 0) return '准时提醒'
  if (reminderTime === undefined || reminderTime === null) return '无'
  return `提前${reminderTime}分钟`
}


function getRelatedTypeText(type?: string) {
  const typeMap: Record<string, string> = {
    case: '案件',
    customer: '客户',
    customer_plan: '客户计划',
    visit: '拜访记录'
  }
  return type ? typeMap[type] || type : ''
}

function getRelatedName() {
  if (!schedule.value) return ''
  
  // 优先使用 related_info 中的名称
  if (schedule.value.related_info?.name) {
    return schedule.value.related_info.name
  }
  
  // 否则使用默认名称
  const typeText = getRelatedTypeText(schedule.value.related_type)
  return `${typeText} #${schedule.value.related_id}`
}

function onViewRelated() {
  if (!schedule.value?.related_type || !schedule.value?.related_id) return
  
  const { related_type, related_id } = schedule.value
  
  if (related_type === 'customer') {
    uni.navigateTo({
      url: `/pages/other/customer/detail/index?id=${related_id}`
    })
  } else if (related_type === 'case') {
    uni.showToast({
      title: '案件详情页面待开发',
      icon: 'none'
    })
  } else {
    uni.showToast({
      title: '该类型暂不支持跳转',
      icon: 'none'
    })
  }
}

async function onSyncToCalendar() {
  if (!schedule.value) return

  try {
    await addToPhoneCalendar(schedule.value)
    uni.showToast({
      title: '已同步到系统日历',
      icon: 'success'
    })
  } catch (error: any) {
    if (error.errMsg && error.errMsg.includes('cancel')) {
      uni.showToast({
        title: '已取消同步',
        icon: 'none'
      })
    } else {
      uni.showToast({
        title: '同步失败',
        icon: 'none'
      })
    }
  }
}

async function onUpdateStatus(status: string) {
  try {
    await updateScheduleStatus(scheduleId.value, status)
    uni.showToast({ title: '状态更新成功', icon: 'success' })
    loadScheduleDetail()
  } catch (error) {
    console.error('更新状态失败:', error)
    uni.showToast({ title: '更新失败', icon: 'none' })
  }
}

function onEdit() {
  uni.navigateTo({
    url: `/pages/other/customer/schedule/edit?id=${scheduleId.value}`
  })
}

async function onDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个日程吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteSchedule(scheduleId.value)
          uni.showToast({ title: '删除成功', icon: 'success' })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } catch (error) {
          console.error('删除失败:', error)
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 24rpx 32rpx 160rpx;
  box-sizing: border-box;
}

.loading {
  padding: 120rpx 0;
  display: flex;
  justify-content: center;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f4f6;
  border-top-color: #3370ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

// 标题卡片
.title-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.title-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.type-badge {
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 500;

  &.type-meeting {
    background: #e8f3ff;
    color: #3370ff;
  }

  &.type-court {
    background: #ffece8;
    color: #f54a45;
  }

  &.type-deadline {
    background: #fff7e8;
    color: #ff8800;
  }

  &.type-reminder {
    background: #e8ffea;
    color: #00b42a;
  }

  &.type-other {
    background: #f2f3f5;
    color: #646a73;
  }
}

.priority-badge {
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 500;

  &.priority-urgent {
    background: #ffece8;
    color: #f54a45;
  }

  &.priority-high {
    background: #fff7e8;
    color: #ff8800;
  }
}

.title-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #1f2329;
  line-height: 1.4;
}

// 信息卡片
.info-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx 32rpx;
  margin-bottom: 16rpx;
}

.card-row {
  display: flex;
  gap: 20rpx;
  padding: 16rpx 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  & + .card-row {
    border-top: 1px solid #f2f3f5;
  }
}

.row-icon {
  font-size: 36rpx;
  line-height: 1;
  flex-shrink: 0;
}

.row-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.row-label {
  font-size: 26rpx;
  color: #8f959e;
}

.row-value {
  font-size: 28rpx;
  color: #1f2329;
  line-height: 1.6;

  &.desc-text {
    line-height: 1.8;
  }
}

// 参与人员
.participants-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.participant {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.participant-name {
  font-size: 28rpx;
  color: #1f2329;
}

.participant-role {
  font-size: 24rpx;
  color: #8f959e;
  padding: 4rpx 12rpx;
  background: #f2f3f5;
  border-radius: 6rpx;
}

// 关联信息样式
.clickable {
  cursor: pointer;
  
  &:active {
    background: #f7f8fa;
  }
}

.related-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #3370ff !important;
}

.link-arrow {
  font-size: 40rpx;
  font-weight: 300;
  margin-left: 8rpx;
}

// 底部操作栏
.footer {
  position: fixed;
  bottom: 100rpx;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  background: #fff;
  border-top: 1px solid #f2f3f5;
  z-index: 100;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.action-btn {
  min-width: calc(50% - 8rpx);
  flex: 1;
  height: 72rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.2s;

  &:active {
    transform: scale(0.96);
    opacity: 0.8;
  }

  &.sync {
    background: #e8f3ff;
    color: #3370ff;
    border: 1px solid #3370ff;
  }

  &.primary {
    background: #3370ff;
    color: #fff;
  }

  &.success {
    background: #00b42a;
    color: #fff;
  }

  &.secondary {
    background: #f2f3f5;
    color: #1f2329;
  }

  &.danger {
    background: #ffece8;
    color: #f54a45;
  }
}
</style>
