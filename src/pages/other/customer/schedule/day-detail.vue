<template>
  <view class="page">
    <!-- 顶部日期信息 -->
    <view class="header">
      <view class="date-section">
        <text class="date-main">{{ dateText }}</text>
        <text class="date-sub">{{ weekdayText }} · 共{{ schedules.length }}个日程</text>
      </view>
      <view class="add-button" @tap="onAddSchedule">
        <text class="add-icon">+</text>
      </view>
    </view>

    <!-- 时间轴容器 -->
    <view class="timeline-wrapper">
      <!-- 长期事项区域（在所有时间框上方） -->
      <view v-if="longTermSchedules.length > 0" class="long-term-section">
        <view class="long-term-header">
          <text class="long-term-title">长期事项</text>
        </view>
        <view class="long-term-list">
          <view
            v-for="schedule in longTermSchedules"
            :key="schedule.id"
            class="long-term-item"
            :class="`type-${schedule.schedule_type}`"
            @tap="onScheduleClick(schedule)"
          >
            <view class="long-term-content">
              <view class="long-term-title-text">{{ schedule.title }}</view>
              <view class="long-term-time">
                {{ formatDateRange(schedule.start_time, schedule.end_time) }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 优化后的时间轴（4-24点） -->
      <scroll-view class="timeline-container" scroll-y scroll-x :scroll-into-view="scrollIntoView">
        <view class="timeline-grid">
        <!-- 时间刻度列 -->
        <view class="time-column">
          <!-- 0-6点合并时间段 -->
          <view
            class="time-slot time-slot-early"
            :class="{ 'has-schedule': hasScheduleInEarlyHours() }"
            :style="{ height: earlyHoursHeight + 'rpx' }"
            id="hour-early"
          >
            <view class="time-label-early">
              <text class="time-label-top">0:00</text>
              <view class="time-label-line">|</view>
              <text class="time-label-bottom">6:00</text>
            </view>
          </view>
          
          <!-- 6-24点时间段 -->
          <view
            v-for="hour in visibleHours"
            :key="hour"
            :id="`hour-${hour}`"
            class="time-slot"
            :class="{ 'has-schedule': hasScheduleInHour(hour) }"
            :style="{ height: getHourHeight(hour) + 'rpx' }"
          >
            <text class="time-label">{{ formatHour(hour) }}</text>
          </view>
        </view>

        <!-- 日程内容列 -->
        <view 
          class="schedule-column" 
          :style="{
            width: scheduleColumnMinWidth > 0 ? scheduleColumnMinWidth + 'rpx' : 'auto',
            minWidth: scheduleColumnMinWidth > 0 ? scheduleColumnMinWidth + 'rpx' : '100%',
            minHeight: totalHeight + 'rpx'
          }"
        >
          <!-- 背景网格线 -->
          <view class="grid-lines">
            <!-- 0-6点合并时间段的网格线 -->
            <view 
              class="grid-line grid-line-early"
              :class="{ 'has-schedule': hasScheduleInEarlyHours() }"
              :style="{ height: earlyHoursHeight + 'rpx' }"
            ></view>
            
            <!-- 6-24点时间段的网格线 -->
            <view 
              v-for="hour in visibleHours" 
              :key="hour" 
              class="grid-line"
              :class="{ 'has-schedule': hasScheduleInHour(hour) }"
              :style="{ height: getHourHeight(hour) + 'rpx' }"
            ></view>
          </view>

          <!-- 空状态提示 -->
          <view v-if="schedules.length === 0 && longTermSchedules.length === 0" class="empty-hint-inline">
            <text class="hint-text">暂无日程</text>
          </view>

          <!-- 日程卡片（只显示当日开始或结束的事件） -->
          <view
            v-for="col in scheduleColumns"
            :key="col.schedule.id"
            class="schedule-block"
            :class="`type-${col.schedule.schedule_type}`"
            :style="getScheduleStyle(col.schedule, col.column, col.totalColumns)"
            @tap="onScheduleClick(col.schedule)"
          >
            <view class="block-content">
              <view class="block-time">{{ formatScheduleTime(col.schedule) }}</view>
              <view class="block-title">{{ col.schedule.title }}</view>
              <!-- 跨日事件的额外说明 -->
              <view v-if="getMultiDayEventDescription(col.schedule)" class="block-multiday-info">
                {{ getMultiDayEventDescription(col.schedule) }}
              </view>
              <view v-if="col.schedule.location" class="block-location">
                📍 {{ col.schedule.location }}
              </view>
            </view>
          </view>
        </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getScheduleList } from '@/api/schedule'
import type { Schedule } from '@/types/interfaces/schedule'

const selectedDate = ref('')
const schedules = ref<Schedule[]>([])
const loading = ref(false)
const scrollIntoView = ref('')

const dateText = computed(() => {
  if (!selectedDate.value) return ''
  const date = parseDate(selectedDate.value)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

const weekdayText = computed(() => {
  if (!selectedDate.value) return ''
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const date = parseDate(selectedDate.value)
  return weekdays[date.getDay()]
})

// 高度配置常量
const HOUR_HEIGHT_EMPTY = 60      // 无日程时间段高度
const HOUR_HEIGHT_WITH_SCHEDULE = 280  // 有日程时间段基础高度
const HOUR_HEIGHT_ACTIVE = 320    // 有日程开始/结束的时间段高度
const EARLY_HOURS_EMPTY_HEIGHT = 120   // 0-6点无日程时的高度（需要容纳三个元素）
const EARLY_HOURS_END = 6         // 早期时间段结束（0-6点合并显示）

// 判断是否有0-6点的日程
function hasScheduleInEarlyHours(): boolean {
  // 只检查在时间轴上显示的事件（不包括长期事项）
  const dailyEvents = dailySchedules.value
  if (!dailyEvents || dailyEvents.length === 0) return false
  
  return dailyEvents.some(schedule => {
    const startDate = parseDate(schedule.start_time)
    const startHour = startDate.getHours()
    
    let endHour = startHour
    if (schedule.end_time) {
      const endDate = parseDate(schedule.end_time)
      endHour = endDate.getHours()
    }
    
    // 判断是否在0-6点范围内
    return startHour < EARLY_HOURS_END || endHour < EARLY_HOURS_END
  })
}

// 计算0-6点合并时间段的高度
const earlyHoursHeight = computed(() => {
  if (hasScheduleInEarlyHours()) {
    // 有日程时，使用放大后的高度
    return HOUR_HEIGHT_WITH_SCHEDULE
  }
  // 无日程时，使用专门的高度（比普通时间段稍大，避免文字溢出）
  return EARLY_HOURS_EMPTY_HEIGHT
})

// 可见的小时范围（6-24点）
const visibleHours = computed(() => {
  const hours: number[] = []
  for (let h = EARLY_HOURS_END; h < 24; h++) {
    hours.push(h)
  }
  return hours
})

// 判断某个小时是否有日程
function hasScheduleInHour(hour: number): boolean {
  // 只检查在时间轴上显示的事件（不包括长期事项）
  const dailyEvents = dailySchedules.value
  if (!dailyEvents || dailyEvents.length === 0) return false
  
  return dailyEvents.some(schedule => {
    // 对于跨日事件，检查它在时间轴上实际显示的位置
    if (isMultiDaySchedule(schedule)) {
      // 跨日事件在开始日期：使用开始时间所在的小时
      if (isStartDate(schedule)) {
        const startDate = parseDate(schedule.start_time)
        const startHour = startDate.getHours()
        return hour === startHour
      }
      // 跨日事件在结束日期：使用结束时间所在的小时
      if (isEndDate(schedule) && schedule.end_time) {
        const endDate = parseDate(schedule.end_time)
        const endHour = endDate.getHours()
        return hour === endHour
      }
      return false
    }
    
    // 单日事件：使用实际时间范围判断
    const startDate = parseDate(schedule.start_time)
    const startHour = startDate.getHours()
    const startMinute = startDate.getMinutes()
    
    let endHour = startHour
    let endMinute = startMinute + 60
    if (schedule.end_time) {
      const endDate = parseDate(schedule.end_time)
      endHour = endDate.getHours()
      endMinute = endDate.getMinutes()
    }
    
    // 判断当前小时是否在日程的时间范围内
    // 使用时间戳精确判断
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    const hourStart = hour * 60
    const hourEnd = (hour + 1) * 60
    
    // 判断时间段是否重叠
    return startTime < hourEnd && endTime > hourStart
  })
}

// 判断某个小时是否有日程的开始或结束
function hasScheduleStartOrEndInHour(hour: number): boolean {
  // 只检查在时间轴上显示的事件（不包括长期事项）
  const dailyEvents = dailySchedules.value
  if (!dailyEvents || dailyEvents.length === 0) return false
  
  return dailyEvents.some(schedule => {
    // 对于跨日事件，检查它在时间轴上实际显示的位置
    if (isMultiDaySchedule(schedule)) {
      // 跨日事件在开始日期：使用开始时间所在的小时
      if (isStartDate(schedule)) {
        const startDate = parseDate(schedule.start_time)
        const startHour = startDate.getHours()
        return hour === startHour
      }
      // 跨日事件在结束日期：使用结束时间所在的小时
      if (isEndDate(schedule) && schedule.end_time) {
        const endDate = parseDate(schedule.end_time)
        const endHour = endDate.getHours()
        return hour === endHour
      }
      return false
    }
    
    // 单日事件：检查开始或结束时间
    const startDate = parseDate(schedule.start_time)
    const startHour = startDate.getHours()
    
    let endHour = startHour
    if (schedule.end_time) {
      const endDate = parseDate(schedule.end_time)
      endHour = endDate.getHours()
    }
    
    return hour === startHour || hour === endHour
  })
}

// 计算每个小时应该显示的高度
function getHourHeight(hour: number): number {
  // 0-6点：合并显示，不单独计算
  if (hour < EARLY_HOURS_END) {
    return 0
  }
  
  // 有日程的时间段：放大显示
  if (hasScheduleInHour(hour)) {
    // 如果这个小时有日程开始或结束，使用最大高度
    if (hasScheduleStartOrEndInHour(hour)) {
      return HOUR_HEIGHT_ACTIVE
    }
    return HOUR_HEIGHT_WITH_SCHEDULE
  }
  
  // 无日程的时间段：压缩显示
  return HOUR_HEIGHT_EMPTY
}

// 计算长期事项区域的高度
const longTermSectionHeight = computed(() => {
  if (longTermSchedules.value.length === 0) return 0
  
  // 头部高度 + 列表项高度
  const headerHeight = 56 // 16rpx padding * 2 + 24rpx font
  const itemHeight = 100 // 每个事项大约100rpx（包括padding和gap）
  const listPadding = 24 // 上下padding
  const totalItemsHeight = longTermSchedules.value.length * itemHeight + (longTermSchedules.value.length - 1) * 12 // gap
  
  return headerHeight + listPadding + totalItemsHeight
})

// 计算总高度
const totalHeight = computed(() => {
  // 0-6点合并时间段的高度
  let height = earlyHoursHeight.value
  
  // 6-24点的高度
  for (let h = EARLY_HOURS_END; h < 24; h++) {
    height += getHourHeight(h)
  }
  return height
})

// 页面显示时刷新数据
onShow(() => {
  if (selectedDate.value) {
    loadSchedules()
  }
})

// 计算日程内容列需要的宽度
const scheduleColumnMinWidth = computed(() => {
  // 如果没有事件，返回0，让内容列自适应屏幕宽度
  if (scheduleColumns.value.length === 0) {
    return 0
  }
  
  let maxColumns = 1
  scheduleColumns.value.forEach(col => {
    if (col.totalColumns > maxColumns) {
      maxColumns = col.totalColumns
    }
  })
  
  // 每列至少240rpx
  const minWidth = maxColumns * 240
  
  // 获取屏幕宽度（rpx），确保至少占满屏幕
  try {
    const systemInfo = uni.getSystemInfoSync()
    const screenWidth = systemInfo.windowWidth * 2 // 转换为rpx（1px = 2rpx）
    const timeColumnWidth = 100 // 时间列宽度
    const minScreenWidth = screenWidth - timeColumnWidth
    
    // 返回较大的值：要么是内容需要的宽度，要么是屏幕宽度
    return Math.max(minWidth, minScreenWidth)
  } catch (e) {
    // 如果获取系统信息失败，只返回内容需要的宽度
    return minWidth
  }
})

// 检测日程是否重叠
function isOverlapping(schedule1: Schedule, schedule2: Schedule): boolean {
  const start1 = parseDate(schedule1.start_time).getTime()
  const end1 = schedule1.end_time ? parseDate(schedule1.end_time).getTime() : start1 + 60 * 60 * 1000
  const start2 = parseDate(schedule2.start_time).getTime()
  const end2 = schedule2.end_time ? parseDate(schedule2.end_time).getTime() : start2 + 60 * 60 * 1000
  
  return start1 < end2 && start2 < end1
}

// 判断是否是跨多日事件
function isMultiDaySchedule(schedule: Schedule): boolean {
  if (!schedule.end_time) return false
  
  // 使用统一的日期解析函数，兼容iOS
  const startDay = getDateOnly(schedule.start_time)
  const endDay = getDateOnly(schedule.end_time)
  
  // 判断是否跨多日
  return startDay.getTime() !== endDay.getTime()
}

// 辅助函数：兼容iOS的日期解析
function parseDate(dateStr: string): Date {
  // iOS不支持 "YYYY-MM-DD HH:mm:ss" 格式，需要转换
  // 支持的格式：yyyy/MM/dd, yyyy-MM-dd, yyyy-MM-ddTHH:mm:ss
  let normalizedStr = dateStr
  
  // 如果是 "YYYY-MM-DD HH:mm:ss" 格式，转换为 "YYYY-MM-DDTHH:mm:ss"
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(normalizedStr)) {
    normalizedStr = normalizedStr.replace(' ', 'T')
  }
  
  const date = new Date(normalizedStr)
  
  // 如果解析失败，尝试手动解析
  if (isNaN(date.getTime())) {
    // 手动解析 "YYYY-MM-DD" 或 "YYYY-MM-DD HH:mm:ss" 或 "YYYY-MM-DDTHH:mm:ss"
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}):(\d{2}))?/)
    if (match) {
      const [, year, month, day, hour = '0', minute = '0', second = '0'] = match
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second))
    }
    // 如果还是失败，返回当前时间作为fallback
    return new Date()
  }
  
  return date
}

// 辅助函数：从日期字符串或Date对象获取日期部分（本地时区）
function getDateOnly(dateStrOrDate: string | Date): Date {
  let date: Date
  if (typeof dateStrOrDate === 'string') {
    date = parseDate(dateStrOrDate)
  } else {
    date = dateStrOrDate
  }
  // 使用本地时区，避免UTC解析问题
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// 判断事件在当前日期是开始日期
function isStartDate(schedule: Schedule): boolean {
  if (!selectedDate.value) return false
  
  const startDay = getDateOnly(schedule.start_time)
  const currentDay = getDateOnly(selectedDate.value)
  
  return startDay.getTime() === currentDay.getTime()
}

// 判断事件在当前日期是结束日期
function isEndDate(schedule: Schedule): boolean {
  if (!schedule.end_time || !selectedDate.value) return false
  
  const endDay = getDateOnly(schedule.end_time)
  const currentDay = getDateOnly(selectedDate.value)
  
  return endDay.getTime() === currentDay.getTime()
}

// 判断事件在当前日期是中间日期
function isMiddleDate(schedule: Schedule): boolean {
  if (!isMultiDaySchedule(schedule) || !selectedDate.value) return false
  
  const startDay = getDateOnly(schedule.start_time)
  const endDay = getDateOnly(schedule.end_time)
  const currentDay = getDateOnly(selectedDate.value)
  
  // 判断是否在开始和结束日期之间（不包括开始和结束日期本身）
  // 必须是严格在中间：大于开始日期且小于结束日期
  return currentDay.getTime() > startDay.getTime() && currentDay.getTime() < endDay.getTime()
}

// 长期事项（中间日期的跨日事件，不包括开始和结束日期）
const longTermSchedules = computed(() => {
  const result = schedules.value.filter(schedule => {
    const isMultiDay = isMultiDaySchedule(schedule)
    
    if (!isMultiDay) {
      return false
    }
    
    // 明确排除开始日期和结束日期
    const isStart = isStartDate(schedule)
    const isEnd = isEndDate(schedule)
    const isMiddle = isMiddleDate(schedule)
    
    // 只保留严格在中间日期的事件
    return isMiddle && !isStart && !isEnd
  })
  
  return result
})

// 当日显示的日程（开始日期或结束日期的事件，以及非跨日事件）
const dailySchedules = computed(() => {
  return schedules.value.filter(schedule => {
    if (!isMultiDaySchedule(schedule)) {
      // 非跨日事件，正常显示
      return true
    }
    // 跨日事件，只显示开始日期或结束日期
    return isStartDate(schedule) || isEndDate(schedule)
  })
})

// 计算日程的列位置（处理重叠）- 只处理当日显示的日程
const scheduleColumns = computed(() => {
  const sorted = [...dailySchedules.value].sort((a, b) => 
    parseDate(a.start_time).getTime() - parseDate(b.start_time).getTime()
  )
  
  const columns: Array<{ schedule: Schedule; column: number; totalColumns: number }> = []
  
  // 第一遍：为每个日程分配列
  sorted.forEach((schedule, index) => {
    // 对于跨日事件，如果是结束日期，使用结束时间；否则使用开始时间
    let compareTime = parseDate(schedule.start_time).getTime()
    if (isMultiDaySchedule(schedule) && isEndDate(schedule) && schedule.end_time) {
      compareTime = parseDate(schedule.end_time).getTime()
    }
    
    // 找出与当前日程重叠的所有已处理日程
    const overlapping = sorted.slice(0, index).filter(s => {
      if (isMultiDaySchedule(schedule) && isEndDate(schedule)) {
        // 结束日期的事件，需要特殊处理重叠判断
        const sTime = isMultiDaySchedule(s) && isEndDate(s) && s.end_time
          ? parseDate(s.end_time).getTime()
          : parseDate(s.start_time).getTime()
        return Math.abs(sTime - compareTime) < 60 * 60 * 1000 // 1小时内视为重叠
      }
      return isOverlapping(schedule, s)
    })
    
    // 找出已占用的列
    const usedColumns = new Set(
      overlapping.map(s => columns.find(c => c.schedule.id === s.id)?.column || 0)
    )
    
    // 找到第一个未占用的列
    let column = 0
    while (usedColumns.has(column)) {
      column++
    }
    
    columns.push({ schedule, column, totalColumns: 1 })
  })
  
  // 第二遍：计算每组重叠日程的总列数
  columns.forEach((col, index) => {
    // 找出与当前日程重叠的所有日程（包括前后）
    const overlappingIndices = columns
      .map((c, i) => ({ ...c, index: i }))
      .filter(c => {
        if (isMultiDaySchedule(col.schedule) && isEndDate(col.schedule)) {
          const cTime = isMultiDaySchedule(c.schedule) && isEndDate(c.schedule) && c.schedule.end_time
            ? parseDate(c.schedule.end_time).getTime()
            : parseDate(c.schedule.start_time).getTime()
          const colTime = col.schedule.end_time ? parseDate(col.schedule.end_time).getTime() : parseDate(col.schedule.start_time).getTime()
          return Math.abs(cTime - colTime) < 60 * 60 * 1000
        }
        return isOverlapping(col.schedule, c.schedule)
      })
      .map(c => c.index)
    
    // 计算这组重叠日程的最大列数
    const maxColumn = Math.max(...overlappingIndices.map(i => columns[i].column))
    const totalColumns = maxColumn + 1
    
    // 更新所有重叠日程的总列数
    overlappingIndices.forEach(i => {
      columns[i].totalColumns = totalColumns
    })
  })
  
  return columns
})

onLoad((options: any) => {
  if (options.date) {
    selectedDate.value = options.date
    loadSchedules()
  }
})

async function loadSchedules() {
  if (!selectedDate.value) return

  loading.value = true
  try {
    const currentDate = parseDate(selectedDate.value)
    const currentDayOnly = getDateOnly(selectedDate.value)
    
    // 查询策略：查询开始时间在前后60天范围内的所有事件
    // 这样可以覆盖所有可能包含当前日期的跨日事件
    const dateBefore = new Date(currentDate)
    dateBefore.setDate(dateBefore.getDate() - 60)
    const dateAfter = new Date(currentDate)
    dateAfter.setDate(dateAfter.getDate() + 60)
    
    const extendedStartTime = `${dateBefore.getFullYear()}-${String(dateBefore.getMonth() + 1).padStart(2, '0')}-${String(dateBefore.getDate()).padStart(2, '0')}T00:00:00+08:00`
    const extendedEndTime = `${dateAfter.getFullYear()}-${String(dateAfter.getMonth() + 1).padStart(2, '0')}-${String(dateAfter.getDate()).padStart(2, '0')}T23:59:59+08:00`
    
    // 查询所有可能相关的事件
    // 设置较大的limit值，确保能获取到所有相关事件
    let allResults: Schedule[] = []
    let hasMore = true
    let page = 1
    const pageSize = 1000 // 每页1000条
    
    while (hasMore) {
      const res = await getScheduleList({
        start_time_after: extendedStartTime,
        start_time_before: extendedEndTime,
        ordering: 'start_time',
        limit: pageSize,
        page: page
      })
      
      if (res.results && res.results.length > 0) {
        allResults = allResults.concat(res.results)
        
        // 检查是否还有下一页
        hasMore = !!res.next && res.results.length === pageSize
        page++
      } else {
        hasMore = false
      }
    }

    // 过滤出与当前日期相关的事件
    const relevantSchedules: Schedule[] = []
    
    if (allResults.length > 0) {
      allResults.forEach((s, index) => {
        // 1. 首先判断事件类型：单日事件 or 跨日事件
        let isMultiDay = false
        let startDay: Date | null = null
        let endDay: Date | null = null
        
        if (s.end_time) {
          startDay = getDateOnly(s.start_time)
          endDay = getDateOnly(s.end_time)
          isMultiDay = startDay.getTime() !== endDay.getTime()
        } else {
          // 没有结束时间，视为单日事件
          startDay = getDateOnly(s.start_time)
          endDay = startDay
          isMultiDay = false
        }
        
        // 2. 判断当前日期是否在事件的时间段内
        let isCurrentDayInRange = false
        let isStartDate = false
        let isEndDate = false
        let isMiddleDate = false
        
        if (startDay && endDay) {
          const currentDayTime = currentDayOnly.getTime()
          const startDayTime = startDay.getTime()
          const endDayTime = endDay.getTime()
          
          isCurrentDayInRange = currentDayTime >= startDayTime && currentDayTime <= endDayTime
          
          if (isMultiDay && isCurrentDayInRange) {
            // 跨日事件：判断是开始日期、结束日期还是中间日期
            isStartDate = currentDayTime === startDayTime
            isEndDate = currentDayTime === endDayTime
            isMiddleDate = !isStartDate && !isEndDate
          } else if (!isMultiDay && isCurrentDayInRange) {
            // 单日事件：当前日期就是开始日期
            isStartDate = true
          }
        }
        
        // 3. 如果当前日期在事件的时间段内，就包含这个事件
        if (isCurrentDayInRange) {
          relevantSchedules.push(s)
        }
      })
    }
    
    // 去重（虽然理论上不应该有重复，但为了安全）
    const scheduleMap = new Map()
    relevantSchedules.forEach(s => scheduleMap.set(s.id, s))
    
    schedules.value = Array.from(scheduleMap.values())

    // 滚动到第一个日程的位置
    if (dailySchedules.value.length > 0) {
      const firstSchedule = dailySchedules.value[0]
      // 如果是跨日事件的结束日期，使用结束时间
      const useTime = isMultiDaySchedule(firstSchedule) && isEndDate(firstSchedule) && firstSchedule.end_time
        ? firstSchedule.end_time
        : firstSchedule.start_time
      const hour = parseDate(useTime).getHours()
      // 如果日程在0-6点，滚动到合并时间段
      if (hour < EARLY_HOURS_END) {
        scrollIntoView.value = 'hour-early'
      } else {
        scrollIntoView.value = `hour-${hour}`
      }
    } else if (longTermSchedules.value.length > 0) {
      // 如果有长期事项，滚动到顶部
      scrollIntoView.value = 'hour-early'
    }
  } catch (error) {
    console.error('加载日程失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`
}

function formatTime(timeStr: string) {
  if (!timeStr) return ''
  const date = parseDate(timeStr)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 格式化事件的时间显示（开始时间 - 结束时间）
function formatScheduleTime(schedule: Schedule): string {
  if (!schedule.start_time) return ''
  
  const startTime = formatTime(schedule.start_time)
  
  // 如果是跨日事件
  if (isMultiDaySchedule(schedule)) {
    // 在开始日期，显示开始时间
    if (isStartDate(schedule)) {
      return startTime
    }
    // 在结束日期，显示结束时间
    if (isEndDate(schedule) && schedule.end_time) {
      return formatTime(schedule.end_time)
    }
  }
  
  // 单日事件：如果有结束时间，显示开始时间 - 结束时间
  if (schedule.end_time) {
    const endTime = formatTime(schedule.end_time)
    return `${startTime} - ${endTime}`
  }
  
  // 只有开始时间，只显示开始时间
  return startTime
}

// 格式化跨日事件的说明文字
function getMultiDayEventDescription(schedule: Schedule): string {
  if (!isMultiDaySchedule(schedule) || !schedule.end_time) return ''
  
  const currentDayOnly = getDateOnly(selectedDate.value)
  const startDay = getDateOnly(schedule.start_time)
  const endDay = getDateOnly(schedule.end_time)
  
  const startTime = formatTime(schedule.start_time)
  const endTime = formatTime(schedule.end_time)
  
  // 在开始日期
  if (isStartDate(schedule)) {
    // 格式化结束日期和时间
    const endDateStr = formatDateForDescription(endDay)
    return `长期事项，开始时间：今天${startTime}，结束时间：${endDateStr}${endTime}`
  }
  
  // 在结束日期
  if (isEndDate(schedule)) {
    // 格式化开始日期和时间
    const startDateStr = formatDateForDescription(startDay)
    return `长期事项，开始时间：${startDateStr}${startTime}，结束时间：今天${endTime}`
  }
  
  return ''
}

// 格式化日期用于说明文字（如果是今天显示"今天"，否则显示日期）
function formatDateForDescription(date: Date): string {
  const currentDayOnly = getDateOnly(selectedDate.value)
  const dateOnly = getDateOnly(date)
  
  if (dateOnly.getTime() === currentDayOnly.getTime()) {
    return '今天'
  }
  
  // 格式化日期：月/日
  const month = dateOnly.getMonth() + 1
  const day = dateOnly.getDate()
  return `${month}月${day}日 `
}

// 格式化日期范围
function formatDateRange(startTime: string, endTime?: string): string {
  if (!endTime) return ''
  
  const start = parseDate(startTime)
  const end = parseDate(endTime)
  
  const startStr = `${start.getMonth() + 1}/${start.getDate()} ${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`
  const endStr = `${end.getMonth() + 1}/${end.getDate()} ${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`
  
  return `${startStr} - ${endStr}`
}

// 计算日程在时间轴上的位置和高度（使用动态高度）
function getScheduleStyle(schedule: Schedule, column: number = 0, totalColumns: number = 1) {
  let startHour: number
  let startMinute: number
  let endHour: number
  let endMinute: number
  
  // 跨日事件特殊处理：在开始/结束日期，从所在小时的整点开始显示
  if (isMultiDaySchedule(schedule)) {
    if (isStartDate(schedule)) {
      // 开始日期：使用开始时间所在的小时，从整点开始
      const startDate = parseDate(schedule.start_time)
      startHour = startDate.getHours()
      startMinute = 0 // 从整点开始
    } else if (isEndDate(schedule) && schedule.end_time) {
      // 结束日期：使用结束时间所在的小时，从整点开始
      const endDate = parseDate(schedule.end_time)
      startHour = endDate.getHours()
      startMinute = 0 // 从整点开始
    } else {
      // 不应该到这里，但为了安全起见
      const startDate = parseDate(schedule.start_time)
      startHour = startDate.getHours()
      startMinute = 0
    }
    // 跨日事件固定显示1小时高度
    endHour = startHour
    endMinute = 60
  } else {
    // 单日事件：使用实际时间
    const startDate = parseDate(schedule.start_time)
    startHour = startDate.getHours()
    startMinute = startDate.getMinutes()
    
    endHour = startHour
    endMinute = startMinute + 60
    if (schedule.end_time) {
      const endDate = parseDate(schedule.end_time)
      endHour = endDate.getHours()
      endMinute = endDate.getMinutes()
    }
  }
  
  // 计算累积高度
  let top = 0
  
  // 如果日程在0-6点，限制在合并时间段内
  if (startHour < EARLY_HOURS_END) {
    // 计算0-6点部分的位置和高度
    const earlyHoursTotalMinutes = EARLY_HOURS_END * 60 // 6小时 = 360分钟
    const scheduleStartMinutes = startHour * 60 + startMinute
    
    // 计算在合并时间段内的起始位置（按比例）
    const startRatio = scheduleStartMinutes / earlyHoursTotalMinutes
    top = earlyHoursHeight.value * startRatio
    
    // 计算高度
    let height = 0
    
    if (endHour < EARLY_HOURS_END) {
      // 完全在0-6点内：按比例计算高度
      const scheduleEndMinutes = endHour * 60 + endMinute
      const scheduleDuration = scheduleEndMinutes - scheduleStartMinutes
      const scheduleRatio = scheduleDuration / earlyHoursTotalMinutes
      height = earlyHoursHeight.value * scheduleRatio
    } else {
      // 超出6点：0-6点部分按比例，6点之后正常计算
      // 0-6点部分的高度
      const earlyPartEndMinutes = EARLY_HOURS_END * 60
      const earlyPartDuration = earlyPartEndMinutes - scheduleStartMinutes
      const earlyPartRatio = earlyPartDuration / earlyHoursTotalMinutes
      const earlyPartHeight = earlyHoursHeight.value * earlyPartRatio
      
      // 6点之后部分的高度
      let afterEarlyHeight = 0
      // 加上6点到结束小时之前的所有小时高度
      for (let h = EARLY_HOURS_END; h < endHour; h++) {
        afterEarlyHeight += getHourHeight(h)
      }
      // 加上结束小时内的分钟部分
      const endHourHeight = getHourHeight(endHour)
      afterEarlyHeight += (endMinute / 60) * endHourHeight
      
      // 总高度 = 0-6点部分 + 6点之后部分
      height = earlyPartHeight + afterEarlyHeight
    }
    
    // 确保最小高度
    if (height < 80) {
      height = 80
    }
    
    // 如果完全在0-6点内，确保不超过合并时间段高度
    if (endHour < EARLY_HOURS_END && top + height > earlyHoursHeight.value) {
      height = earlyHoursHeight.value - top
    }
    
    // 计算列位置和宽度（处理重叠）
    const minCardWidth = 240
    const columnWidth = minCardWidth
    const left = column * columnWidth
    
    return {
      top: `${top}rpx`,
      height: `${height}rpx`,
      left: `${left}rpx`,
      width: `${columnWidth - 8}rpx`
    }
  }
  
  // 日程在6点之后，正常计算
  // 累加0-6点合并时间段的高度
  top = earlyHoursHeight.value
  
  // 累加6点到开始小时之前的所有小时高度
  for (let h = EARLY_HOURS_END; h < startHour; h++) {
    top += getHourHeight(h)
  }
  
  // 加上当前小时内的分钟偏移
  const hourHeight = getHourHeight(startHour)
  const minuteOffset = (startMinute / 60) * hourHeight
  top += minuteOffset
  
  // 计算高度
  let height = 0
  
  if (endHour > startHour) {
    // 加上开始小时的剩余部分
    const startHourHeight = getHourHeight(startHour)
    const startHourRemaining = ((60 - startMinute) / 60) * startHourHeight
    height += startHourRemaining
    
    // 累加中间完整小时的高度
    for (let h = startHour + 1; h < endHour; h++) {
      height += getHourHeight(h)
    }
    
    // 加上结束小时内的分钟部分
    const endHourHeight = getHourHeight(endHour)
    const endMinuteOffset = (endMinute / 60) * endHourHeight
    height += endMinuteOffset
  } else {
    // 同小时内
    const hourHeight = getHourHeight(startHour)
    const duration = endMinute - startMinute
    height = (duration / 60) * hourHeight
  }
  
  // 确保最小高度
  if (height < 80) {
    height = 80
  }
  
  // 计算列位置和宽度（处理重叠）
  const minCardWidth = 240
  const columnWidth = minCardWidth
  const left = column * columnWidth
  
  return {
    top: `${top}rpx`,
    height: `${height}rpx`,
    left: `${left}rpx`,
    width: `${columnWidth - 8}rpx`
  }
}

function onScheduleClick(schedule: Schedule) {
  uni.navigateTo({
    url: `/pages/other/customer/schedule/detail?id=${schedule.id}`
  })
}

function onAddSchedule() {
  uni.navigateTo({
    url: `/pages/other/customer/schedule/edit?date=${selectedDate.value}`
  })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}

// 顶部日期区域
.header {
  background: #fff;
  padding: 40rpx 32rpx 32rpx;
  border-bottom: 1px solid #f2f3f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.date-section {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.date-main {
  font-size: 48rpx;
  font-weight: 600;
  color: #1f2329;
  letter-spacing: -0.5rpx;
}

.date-sub {
  font-size: 26rpx;
  color: #8f959e;
}

.add-button {
  width: 72rpx;
  height: 72rpx;
  background: #3370ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(51, 112, 255, 0.25);
  transition: all 0.2s;
  flex-shrink: 0;

  &:active {
    transform: scale(0.92);
    opacity: 0.9;
  }
}

.add-icon {
  font-size: 48rpx;
  color: #fff;
  font-weight: 300;
  line-height: 1;
}

// 时间轴包装器
.timeline-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}

// 时间轴容器（支持横向和纵向滚动）
.timeline-container {
  flex: 1;
  background: #fff;
  width: 100%;
  height: 100%;
}

// 时间轴网格
.timeline-grid {
  display: flex;
  min-height: 100%;
  width: 100%; // 默认占满屏幕宽度
  // 当内容超出时，允许横向滚动（通过schedule-column的宽度控制）
}

// 时间刻度列
.time-column {
  width: 100rpx;
  flex-shrink: 0;
  flex-grow: 0;
  background: #fafbfc;
  border-right: 1px solid #e5e6eb;
  position: sticky;
  left: 0;
  z-index: 10;
}

.time-slot {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8rpx;
  border-bottom: 1px solid #e5e6eb;
  transition: all 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  // 有日程的时间段：红色标记
  &.has-schedule {
    background: rgba(255, 77, 79, 0.05);
    border-left: 3rpx solid #ff4d4f;
    border-bottom-color: rgba(255, 77, 79, 0.2);
    
    .time-label {
      color: #ff4d4f;
      font-weight: 600;
      font-size: 24rpx;
    }
  }
}

// 0-6点合并时间段样式
.time-slot-early {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e5e6eb;
  transition: all 0.2s;
  position: relative;
  
  // 有日程的时间段：红色标记
  &.has-schedule {
    background: rgba(255, 77, 79, 0.05);
    border-left: 3rpx solid #ff4d4f;
    border-bottom-color: rgba(255, 77, 79, 0.2);
  }
}

// 0-6点时间标签容器
.time-label-early {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 12rpx 0;
  box-sizing: border-box;
  min-height: 100rpx; // 确保最小高度，避免文字挤压
}

.time-label-top,
.time-label-bottom {
  font-size: 22rpx;
  color: #8f959e;
  font-weight: 500;
  line-height: 1.2;
  transition: all 0.2s;
  flex-shrink: 0; // 防止被压缩
}

.time-label-line {
  font-size: 20rpx;
  color: #8f959e;
  line-height: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6rpx 0;
  min-height: 20rpx; // 确保竖线有足够空间
  transition: all 0.2s;
}

// 有日程时的样式
.time-slot-early.has-schedule {
  .time-label-top,
  .time-label-bottom {
    color: #ff4d4f;
    font-weight: 600;
    font-size: 24rpx;
  }
  
  .time-label-line {
    color: #ff4d4f;
    font-weight: 600;
  }
}

.time-label {
  font-size: 22rpx;
  color: #8f959e;
  font-weight: 500;
  transition: all 0.2s;
}

// 日程内容列
.schedule-column {
  flex: 0 0 auto; // 不自动伸缩，根据内容宽度
  position: relative;
  overflow: visible;
  // 宽度由内联样式动态设置
}

// 背景网格线
.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.grid-line {
  border-bottom: 1px solid #f2f3f5;
  transition: all 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  // 有日程的时间段网格线也标红
  &.has-schedule {
    border-bottom-color: rgba(255, 77, 79, 0.15);
    background: rgba(255, 77, 79, 0.02);
  }
}

// 0-6点合并时间段的网格线
.grid-line-early {
  border-bottom: 1px solid #f2f3f5;
  transition: all 0.2s;
  
  // 有日程的时间段网格线也标红
  &.has-schedule {
    border-bottom-color: rgba(255, 77, 79, 0.15);
    background: rgba(255, 77, 79, 0.02);
  }
}

// 长期事项区域（在所有时间框上方）
.long-term-section {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.long-term-header {
  padding: 16rpx 20rpx;
  background: #f7f8fa;
  border-bottom: 1px solid #e5e6eb;
}

.long-term-title {
  font-size: 24rpx;
  color: #646a73;
  font-weight: 600;
}

.long-term-list {
  padding: 12rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.long-term-item {
  background: #fff;
  border-radius: 8rpx;
  border: 1px solid #e5e6eb;
  padding: 16rpx 20rpx;
  transition: all 0.2s;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4rpx;
    background: #3370ff;
    border-radius: 8rpx 0 0 8rpx;
  }
  
  &.type-meeting::before {
    background: #3370ff;
  }
  
  &.type-court::before {
    background: #f54a45;
  }
  
  &.type-deadline::before {
    background: #ff8800;
  }
  
  &.type-reminder::before {
    background: #00b42a;
  }
  
  &.type-other::before {
    background: #86909c;
  }
  
  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

.long-term-content {
  padding-left: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.long-term-title-text {
  font-size: 28rpx;
  color: #1f2329;
  font-weight: 500;
  word-wrap: break-word;
  word-break: break-all;
}

.long-term-time {
  font-size: 22rpx;
  color: #8f959e;
  font-weight: 400;
}

// 空状态提示（内联）
.empty-hint-inline {
  position: absolute;
  top: 120rpx; // 调整位置，因为4点开始显示
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}

.hint-text {
  font-size: 28rpx;
  color: #c9cdd4;
}

// 日程块
.schedule-block {
  position: absolute;
  display: flex;
  background: #fff;
  border-radius: 8rpx;
  overflow: visible;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  z-index: 2;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6rpx;
    background: #ff4d4f; // 默认红色，强调有日程
    border-radius: 8rpx 0 0 8rpx;
  }
  
  // 根据日程类型保持原色，但增加红色强调
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 4rpx;
    background: #ff4d4f;
    opacity: 0.6;
  }
  
  &.type-meeting::before {
    background: #3370ff;
  }
  
  &.type-court::before {
    background: #f54a45;
  }
  
  &.type-deadline::before {
    background: #ff8800;
  }
  
  &.type-reminder::before {
    background: #00b42a;
  }
  
  &.type-other::before {
    background: #86909c;
  }
}

.block-content {
  flex: 1;
  padding: 16rpx 20rpx 16rpx 26rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.block-time {
  font-size: 22rpx;
  color: #8f959e;
  font-weight: 500;
}

.block-title {
  font-size: 28rpx;
  color: #1f2329;
  font-weight: 500;
  word-wrap: break-word;
  word-break: break-all;
}

.block-multiday-info {
  font-size: 22rpx;
  color: #8f959e;
  font-weight: 400;
  word-wrap: break-word;
  word-break: break-all;
  line-height: 1.4;
  margin-top: 4rpx;
}

.block-location {
  font-size: 22rpx;
  color: #646a73;
  word-wrap: break-word;
  word-break: break-all;
}

</style>
