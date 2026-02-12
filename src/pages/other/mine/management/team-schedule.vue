<template>
  <view class="container">
    <view class="content">
      <!-- 权限提示 -->
      <view v-if="!isManager" class="permission-tip">
        <u-icon name="info-circle" color="#E6A23C" size="20"></u-icon>
        <text class="tip-text">只有管理角色可以查看团队日程</text>
      </view>
      
      <!-- 日历视图 -->
      <view v-else class="calendar-section">
        <!-- 月份选择 -->
        <view class="month-selector">
          <picker mode="date" fields="month" :value="monthValue" @change="onPickMonth">
            <view class="month-display">
              <text class="month-text">{{ monthLabel }}</text>
              <u-icon name="arrow-down" size="14" color="#333"></u-icon>
            </view>
          </picker>
        </view>
        
        <!-- 日历网格 -->
        <view class="calendar">
          <view class="week-header">
            <view v-for="w in weekNames" :key="w" class="week-cell">{{ w }}</view>
          </view>
          
          <view class="calendar-grid">
            <view
              v-for="(cell, idx) in gridCells"
              :key="idx"
              class="calendar-cell"
              :class="{ 'is-other': !cell.isCurrentMonth, 'is-selected': cell.key === selectedKey }"
              @click="onSelectDate(cell)"
            >
              <view class="cell-inner">
                <text class="cell-day" :class="{ 'is-selected-text': cell.key === selectedKey }">
                  {{ cell.dayText }}
                </text>
                <view v-if="cell.eventCount > 0" class="cell-event">
                  <text class="event-text">{{ cell.eventCount }}个</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 选中日期的日程明细 -->
        <view v-if="selectedDateSchedules.length > 0" class="schedule-list">
          <view class="list-header">
            <text class="list-title">{{ selectedDateText }} 的日程</text>
            <text class="list-count">共{{ selectedDateSchedules.length }}个</text>
          </view>
          
          <view class="schedule-items">
            <view
              v-for="schedule in selectedDateSchedules"
              :key="schedule.id"
              class="schedule-item"
              @click="handleScheduleClick(schedule)"
            >
              <!-- 左上角：头像和经办人 -->
              <view class="schedule-top-left">
                <view v-if="schedule.user_name" class="user-info">
                  <u-avatar
                    v-if="schedule.user_avatar"
                    :src="schedule.user_avatar"
                    size="40"
                    :text="schedule.user_name.charAt(0)"
                  ></u-avatar>
                  <view v-else class="avatar-placeholder">
                    {{ schedule.user_name.charAt(0) }}
                  </view>
                  <text class="user-name">{{ schedule.user_name }}</text>
                </view>
              </view>
              
              <!-- 右上角：时间 -->
              <view class="schedule-top-right">
                <view class="time-info">
                  <text class="time-text">{{ formatScheduleTime(schedule.start_time) }}</text>
                  <text v-if="schedule.end_time" class="time-end">
                    - {{ formatScheduleTime(schedule.end_time) }}
                  </text>
                </view>
              </view>
              
              <!-- 下面：事件名 -->
              <view class="schedule-bottom">
                <view class="schedule-title">{{ schedule.title }}</view>
                <view v-if="schedule.description" class="schedule-desc">{{ schedule.description }}</view>
                <view v-if="schedule.location" class="schedule-location">
                  <u-icon name="map-pin" size="14" color="#909399"></u-icon>
                  <text>{{ schedule.location }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-else-if="selectedKey" class="empty-schedule">
          <u-empty mode="data" text="该日期暂无日程"></u-empty>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getTeamSchedule } from '@/api/schedule'
import type { Schedule } from '@/types/interfaces/schedule'

const userStore = useUserStore()

// 权限检查
const isManager = computed(() => userStore.isManager)

// 当前年月
const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth() + 1)
const selectedKey = ref(formatKey(year.value, month.value, today.getDate()))

const weekNames = ['日', '一', '二', '三', '四', '五', '六']
const monthLabel = computed(() => `${year.value} 年 ${month.value} 月`)
const monthValue = computed(() => `${year.value}-${String(month.value).padStart(2, '0')}-01`)

// 日程数据
const scheduleData = ref<Record<string, Array<Schedule & { user_name?: string; user_avatar?: string; user_id?: number | string }>>>({})

// 加载团队日程数据
async function loadTeamSchedule() {
  if (!isManager.value) return
  
  try {
    // 计算当前月的开始和结束日期
    const startDate = new Date(year.value, month.value - 1, 1)
    const endDate = new Date(year.value, month.value, 0)
    const startStr = startDate.toISOString().slice(0, 10)
    const endStr = endDate.toISOString().slice(0, 10)
    
    const params: any = {
      start_date: startStr,
      end_date: endStr
    }
    
    // 根据角色添加数据范围参数
    if (userStore.roleLevel === 'TEAM' && userStore.teamId) {
      params.team_id = userStore.teamId
    } else if (userStore.roleLevel === 'BRANCH' && userStore.branchId) {
      params.branch_id = userStore.branchId
    }
    // HQ不需要传参数，查看全所
    
    const res = await getTeamSchedule(params)
    
    // 转换为按日期索引的对象
    const dataMap: Record<string, Array<Schedule & { user_name?: string; user_avatar?: string; user_id?: number | string }>> = {}
    res.days.forEach(day => {
      dataMap[day.date] = day.schedules
    })
    scheduleData.value = dataMap
  } catch (error) {
    console.error('加载团队日程失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

// 日历网格
const gridCells = computed(() => {
  const y = year.value
  const m = month.value
  const first = new Date(y, m - 1, 1)
  const firstWeekday = first.getDay()
  const daysInMonth = new Date(y, m, 0).getDate()
  const daysInPrevMonth = new Date(y, m - 1, 0).getDate()

  const cells = []

  for (let i = 0; i < 42; i++) {
    const dayIndex = i - firstWeekday + 1
    let cy = y
    let cm = m
    let d = dayIndex
    let isCurrentMonth = true

    if (dayIndex <= 0) {
      isCurrentMonth = false
      const prevMonth = m - 1
      cm = prevMonth <= 0 ? 12 : prevMonth
      cy = prevMonth <= 0 ? y - 1 : y
      d = daysInPrevMonth + dayIndex
    } else if (dayIndex > daysInMonth) {
      isCurrentMonth = false
      const nextMonth = m + 1
      cm = nextMonth >= 13 ? 1 : nextMonth
      cy = nextMonth >= 13 ? y + 1 : y
      d = dayIndex - daysInMonth
    }

    const key = formatKey(cy, cm, d)
    const schedules = scheduleData.value[key] || []
    const eventCount = schedules.length

    cells.push({
      key,
      isCurrentMonth,
      dayText: String(d),
      eventCount
    })
  }

  return cells
})

// 选中日期的日程列表
const selectedDateSchedules = computed(() => {
  if (!selectedKey.value) return []
  return scheduleData.value[selectedKey.value] || []
})

// 选中日期文本
const selectedDateText = computed(() => {
  if (!selectedKey.value) return ''
  const [y, m, d] = selectedKey.value.split('-')
  return `${y}年${parseInt(m)}月${parseInt(d)}日`
})

// 选择月份
function onPickMonth(e: any) {
  const val = e?.detail?.value
  if (!val) return
  const [yStr, mStr] = val.split('-')
  const y = Number(yStr)
  const m = Number(mStr)
  if (!y || !m) return

  year.value = y
  month.value = m
  loadTeamSchedule()
  
  // 重置选中日期为当月第一天
  const newKey = formatKey(y, m, 1)
  selectedKey.value = newKey
}

// 选择日期
function onSelectDate(cell: any) {
  if (!cell?.key) return
  selectedKey.value = cell.key
}

// 格式化日期key
function formatKey(y: number, m: number, d: number) {
  const mm = String(m).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

// 格式化日程时间
function formatScheduleTime(timeStr: string) {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${hour}:${minute}`
}

// 点击日程项
function handleScheduleClick(schedule: any) {
  // 可以跳转到日程详情页或客户详情页
  if (schedule.related_type === 'customer' && schedule.related_id) {
    uni.navigateTo({
      url: `/pages/other/customer/detail/index?id=${schedule.related_id}`
    })
  }
}

onMounted(() => {
  loadTeamSchedule()
})
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f7fa;
  overflow-x: hidden;
}

.content {
  padding: 24rpx;
  box-sizing: border-box;
  overflow-x: hidden;
}

.permission-tip {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx;
  background: #FFF7E6;
  border-radius: 12rpx;
  
  .tip-text {
    font-size: 28rpx;
    color: #E6A23C;
  }
}

.calendar-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}

.month-selector {
  margin-bottom: 24rpx;
}

.month-display {
  display: flex;
  align-items: center;
  gap: 12rpx;
  
  .month-text {
    font-size: 36rpx;
    font-weight: 600;
    color: #303133;
  }
}

.calendar {
  margin-bottom: 32rpx;
  width: 100%;
  overflow: hidden;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 16rpx 0;
  border-bottom: 1rpx solid #EBEEF5;
  width: 100%;
  box-sizing: border-box;
}

.week-cell {
  text-align: center;
  font-size: 24rpx;
  color: #909399;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.calendar-cell {
  height: 96rpx;
  min-width: 0;
  padding: 8rpx;
  box-sizing: border-box;
  
  &.is-other {
    opacity: 0.3;
  }
  
  &.is-selected {
    .cell-inner {
      background: #667eea;
      border-radius: 8rpx;
    }
  }
}

.cell-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}

.cell-day {
  font-size: 26rpx;
  color: #303133;
  
  &.is-selected-text {
    color: #fff;
    font-weight: 600;
  }
}

.cell-event {
  .event-text {
    font-size: 20rpx;
    color: #667eea;
    background: #F0F2F5;
    padding: 2rpx 8rpx;
    border-radius: 4rpx;
  }
}

.calendar-cell.is-selected .cell-event .event-text {
  color: #fff;
  background: rgba(255, 255, 255, 0.3);
}

.schedule-list {
  margin-top: 32rpx;
  padding-top: 32rpx;
  border-top: 1rpx solid #EBEEF5;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  
  .list-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #303133;
  }
  
  .list-count {
    font-size: 24rpx;
    color: #909399;
  }
}

.schedule-items {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.schedule-item {
  position: relative;
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 12rpx;
  min-height: 120rpx;
}

.schedule-top-left {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.avatar-placeholder {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #667eea;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.user-name {
  font-size: 26rpx;
  color: #303133;
  font-weight: 500;
  white-space: nowrap;
}

.schedule-top-right {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  .time-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #667eea;
  }
  
  .time-end {
    font-size: 24rpx;
    color: #909399;
  }
}

.schedule-bottom {
  margin-top: 60rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.schedule-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #303133;
  margin-top: 8rpx;
}

.schedule-desc {
  font-size: 24rpx;
  color: #606266;
  margin-top: 4rpx;
}

.schedule-location {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #909399;
  margin-top: 4rpx;
}

.empty-schedule {
  margin-top: 32rpx;
  padding: 80rpx 0;
}
</style>
