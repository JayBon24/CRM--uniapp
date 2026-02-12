<template>
  <view class="page" :style="{ '--status-bar-height': statusBarHeight + 'px' }">
    <view class="topbar" :style="{ paddingTop: topbarPadding + 'px' }">
      <view class="topbar__left">
        <view class="user-avatar">
          <image v-if="userAvatar" :src="userAvatar" mode="aspectFill" class="avatar-image" />
          <text v-else class="user-avatar__text">{{ userInitial }}</text>
        </view>
        <view class="topbar-texts">
          <text class="topbar-account">{{ userName }}</text>
          <picker mode="date" fields="month" :value="monthValue" @change="onPickMonth">
            <view class="month-dropdown">
              <text class="month__text">{{ monthLabel }}</text>
            </view>
          </picker>
        </view>
      </view>
    </view>

    <view class="calendar" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <!-- 星期栏 -->
      <view class="week">
        <view v-for="w in weekNames" :key="w" class="week__cell">{{ w }}</view>
      </view>

      <!-- 日历网格 -->
      <view class="grid">
        <view
          v-for="(cell, idx) in gridCells"
          :key="idx"
          class="cell"
          :class="{ 'is-other': !cell.isCurrentMonth }"
          @tap="onSelect(cell)"
        >
          <!-- 
            修改点：选中状态的类名 is-selected 加在这里 
          -->
          <view class="cell__inner" :class="{ 'is-selected': cell.key === selectedKey }">
            <view class="date-wrapper">
              <view class="cell__dayRow">
                <text class="cell__day" :class="{ 'is-selectedText': cell.key === selectedKey }">
                  {{ cell.dayText }}
                </text>
                <text v-if="cell.eventCount > maxVisibleEvents" class="cell__eventCount">
                  +{{ cell.eventCount - maxVisibleEvents }}
                </text>
              </view>
              <text class="cell__lunar">{{ cell.lunar }}</text>
            </view>
            
            <!-- 修改点：日程条放在这里，样式里会做绝对定位处理 -->
            <view v-if="cell.eventItems && cell.eventItems.length" class="cell__event">
              <view
                v-for="(item, idx) in cell.eventItems.slice(0, maxVisibleEvents)"
                :key="`${cell.key}-${item.id}-${idx}`"
                class="cell__eventBar"
                :class="{ 'is-start': item.isStart, 'is-end': item.isEnd }"
              >
                <text v-if="item.isStart || item.isEnd" class="cell__eventText">
                  {{ item.title }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <DraggableFab
      icon="plus"
      class="schedule-fab"
      :top-gap="fabTopGap"
      :bottom-gap="fabBottomGap"
      :offset-right="24"
      :offset-bottom="24"
      @click="onAddSchedule"
    />

  </view>
</template>

<script setup lang="ts">
// ... JS 代码部分逻辑完全不需要动，保持你原样即可 ...
// 为了节省篇幅，这里省略 Script 内容，直接用你原来的 Script 即可
// 注意：如果你原来的 Script 没动，确保 import 和变量名对得上就行
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { Solar } from 'lunar-javascript'
import { getCalendarView } from '@/api/schedule'
import { useUserStore } from '@/stores/user'
import DraggableFab from '@/components/DraggableFab/index.vue'

onShow(() => {
  // 移除手动设置 tabBar 选中状态，由 custom-tab-bar 统一管理
  // const tabBar = getCurrentInstance()?.proxy?.getTabBar?.()
  // tabBar?.setSelected?.(1)
  loadCalendarData()
  updateFabBounds()
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    const resetScroll = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      const scrollableElements = document.querySelectorAll('*')
      scrollableElements.forEach(el => {
        if (el.scrollTop > 0) { el.scrollTop = 0 }
      })
    }
    resetScroll()
    setTimeout(resetScroll, 50)
    setTimeout(resetScroll, 100)
    setTimeout(resetScroll, 200)
  }
})

const onHide = () => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }
}
uni.$on('onHide', onHide)

const userStore = useUserStore()
const statusBarHeight = uni.getSystemInfoSync?.().statusBarHeight || 0
const topbarPadding = ref(0)
// #ifdef H5
topbarPadding.value = statusBarHeight
// #endif
const userName = computed(() => userStore.nickName || userStore.name || '用户')
const userInitial = computed(() => (userName.value || '用户').slice(0, 1))
const userAvatar = computed(() => userStore.avatar)
const weekNames = ['日', '一', '二', '三', '四', '五', '六']

// 浮动按钮可活动区域（与客户列表页保持一致的思路）
const fabTopGap = ref(0)
const fabBottomGap = ref(0)

const pxToUpx = (px: number) => {
  const unit = uni.upx2px(1)
  if (!unit) return Math.round(px)
  return Math.round(px / unit)
}

function updateFabBounds() {
  nextTick(() => {
    const query = uni.createSelectorQuery()
    // 以日历区域为基准，避免挡住顶部和底部
    query.select('.calendar').boundingClientRect(rect => {
      if (!rect) return
      const sys = uni.getSystemInfoSync()
      const topPx = Math.max(0, rect.top)
      const bottomHeight = Math.max(0, sys.windowHeight - (rect.top + rect.height))
      const tabBarReserve = uni.upx2px(100) + (sys.safeAreaInsets?.bottom || 0) + uni.upx2px(20)
      fabTopGap.value = pxToUpx(topPx)
      fabBottomGap.value = pxToUpx(Math.max(bottomHeight, tabBarReserve))
    }).exec()
  })
}

onMounted(() => {
  loadCalendarData()
  updateFabBounds()
  // #ifdef H5
  const preventScroll = (e) => { e.preventDefault(); e.stopPropagation() }
  const pageElement = document.querySelector('.page')
  if (pageElement) {
    pageElement.addEventListener('wheel', preventScroll, { passive: false })
    onUnmounted(() => { pageElement.removeEventListener('wheel', preventScroll) })
  }
  // #endif
})

const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth() + 1)
const selectedKey = ref(formatKey(year.value, month.value, today.getDate()))
const monthLabel = computed(() => `${year.value}年${month.value}月`)
const monthValue = computed(() => `${year.value}-${String(month.value).padStart(2, '0')}-01`)
const eventMap = ref<Record<string, { items: Array<{ id: number | string; title: string; isStart: boolean; isEnd: boolean }>; count: number }>>({})
const touchStartX = ref(0)
const touchStartY = ref(0)
const swipeThreshold = 50
const maxVisibleEvents = 3

async function loadCalendarData() {
  try {
    const data = await getCalendarView(year.value, month.value)
    const newEvents: Record<string, { items: Array<{ id: number | string; title: string; isStart: boolean; isEnd: boolean }>; count: number }> = {}
    const seen = new Set<string>()

    const ensureBucket = (dateKey: string) => {
      if (!newEvents[dateKey]) {
        newEvents[dateKey] = { items: [], count: 0 }
      }
    }

    const addEvent = (dateKey: string, schedule: any, isStart: boolean, isEnd: boolean) => {
      const id = schedule.id ?? schedule.title ?? dateKey
      const uniq = `${id}-${dateKey}`
      if (seen.has(uniq)) return
      seen.add(uniq)
      ensureBucket(dateKey)
      newEvents[dateKey].items.push({
        id,
        title: schedule.title || '日程',
        isStart,
        isEnd
      })
      newEvents[dateKey].count += 1
    }

    if (data?.days) {
      data.days.forEach(day => {
        if (!day || !day.date) return
        const schedules = day.schedules || []
        schedules.forEach((schedule: any) => {
          const start = schedule.start_time ? schedule.start_time.slice(0, 10) : day.date
          const end = schedule.end_time ? schedule.end_time.slice(0, 10) : start
          const startDate = new Date(`${start}T00:00:00`)
          const endDate = new Date(`${end}T00:00:00`)
          const dayMs = 24 * 60 * 60 * 1000
          for (let t = startDate.getTime(); t <= endDate.getTime(); t += dayMs) {
            const d = new Date(t)
            const dateKey = formatKey(d.getFullYear(), d.getMonth() + 1, d.getDate())
            addEvent(dateKey, schedule, dateKey === start, dateKey === end)
          }
        })
      })
    }
    eventMap.value = newEvents
  } catch (error) { console.error(error) }
}

watch([year, month], () => { loadCalendarData() })

const gridCells = computed(() => {
  const y = year.value
  const m = month.value
  const first = new Date(y, m - 1, 1)
  const firstWeekday = first.getDay()
  const daysInMonth = new Date(y, m, 0).getDate()
  const daysInPrevMonth = new Date(y, m - 1, 0).getDate()
  const cells = []
  // 保持35天或改为42天以防有的月份跨6周，这里还是按你原来的35
  for (let i = 0; i < 42; i++) { // 建议改成42，因为有的月份横跨6周，只写35会导致月底最后几天显示不出来
    const dayIndex = i - firstWeekday + 1
    let cy = y, cm = m, d = dayIndex, isCurrentMonth = true
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
    const eventInfo = eventMap.value[key]
    const eventItems = eventInfo?.items || []
    const eventCount = eventInfo?.count || 0
    const lunar = getLunarPlaceholder(cy, cm, d)
    cells.push({ key, isCurrentMonth, dayText: String(d), lunar, eventItems, eventCount })
  }
  return cells.slice(0, 35) // 5 行 35 格，避免多出下个月日历
})

function onPickMonth(e) {
  const val = e?.detail?.value
  if (!val) return
  const [yStr, mStr] = val.split('-')
  year.value = Number(yStr)
  month.value = Number(mStr)
  selectedKey.value = formatKey(year.value, month.value, 1)
}

function shiftMonth(delta: number) {
  let y = year.value
  let m = month.value + delta
  if (m < 1) {
    m = 12
    y -= 1
  } else if (m > 12) {
    m = 1
    y += 1
  }
  year.value = y
  month.value = m
  selectedKey.value = formatKey(year.value, month.value, 1)
}

function onTouchStart(e: any) {
  const t = e?.touches?.[0]
  if (!t) return
  touchStartX.value = t.clientX
  touchStartY.value = t.clientY
}

function onTouchEnd(e: any) {
  const t = e?.changedTouches?.[0]
  if (!t) return
  const dx = t.clientX - touchStartX.value
  const dy = t.clientY - touchStartY.value
  if (Math.abs(dx) < swipeThreshold || Math.abs(dx) < Math.abs(dy)) return
  if (dx < 0) {
    shiftMonth(1)
  } else {
    shiftMonth(-1)
  }
}

function onSelect(cell) {
  if (!cell?.key) return
  selectedKey.value = cell.key
  uni.navigateTo({ url: `/pages/other/customer/schedule/day-detail?date=${cell.key}` })
}

function onAddSchedule() {
  const targetDate = selectedKey.value || formatKey(today.getFullYear(), today.getMonth() + 1, today.getDate())
  uni.navigateTo({
    url: `/pages/other/customer/schedule/edit?date=${targetDate}`
  })
}
function formatKey(y, m, d) {
  const mm = String(m).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

function getLunarPlaceholder(y, m, d) {
  try {
    const solar = Solar.fromYmd(y, m, d)
    const lunar = solar.getLunar()
    const jieQi = lunar.getJieQi()
    if (jieQi) return jieQi
    const festivals = lunar.getFestivals()
    if (festivals && festivals.length > 0) return festivals[0]
    if (lunar.getDay() === 1) return lunar.getMonthInChinese() + '\u6708'
    return lunar.getDayInChinese()
  } catch (e) { return '' }
}
</script>

<style scoped>
.page {
  background: #fff;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx 8rpx;
  flex-shrink: 0;
}

.topbar__left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.topbar-texts {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.topbar-account {
  font-size: 24rpx;
  color: #111;
  font-weight: 600;
}

.user-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #3370ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar__text {
  color: #fff;
  font-size: 26rpx;
  line-height: 1;
  font-weight: 600;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.month-dropdown {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.month {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.month__text {
  font-size: 42rpx;
  font-weight: 600;
  color: #111;
}

/* --- 核心修改区域开始 --- */



.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 20rpx 0; /* 稍微增加一点上下的呼吸感 */
  color: #9aa0a6;
  font-size: 24rpx;
  flex-shrink: 0; /* 防止被挤压 */
}

.week__cell {
  text-align: center;
}



/* --- 1. 日历容器 --- */
/* --- 替换这一整段 --- */
.calendar {
  width: 100%;
  
  /* 让它占满剩余空间 */
  flex: 1; 
  display: flex;
  flex-direction: column;
  min-height: 0;
  
  /* --- 核心修改 --- */
  padding-bottom: calc(90rpx + env(safe-area-inset-bottom));
  
  /* 确保内边距算在总高度里 */
  box-sizing: border-box; 
  padding-left: 12rpx;
  padding-right: 12rpx;
}

/* --- 网格布局：改为“分散对齐” --- */
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  row-gap: 6rpx;
  column-gap: 10rpx;
  height: 100%;
  width: 100%;
}

/* --- 单元格：改为固定高度 --- */
.cell {
  /* 核心修改 3：改回固定高度 */
  /* 160rpx 是一个手指点击很舒服、视觉也不显太大的高度 */
  /* 你可以根据喜好在 150rpx - 170rpx 之间调整 */
  height: 160rpx; 
  
  position: relative;
  display: flex;
  flex-direction: column;
}

/* #ifdef MP-WEIXIN */
.grid {
  display: flex;
  flex-wrap: wrap;
  row-gap: 0;
  column-gap: 0;
  align-content: stretch;
}

.cell {
  width: 14.2857%;
  padding: 0 6rpx 10rpx;
  box-sizing: border-box;
  height: calc((100% - 20rpx) / 5);
}

.cell__inner {
  width: 100%;
}
/* #endif */
.cell__inner {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
  
  /* 布局核心：相对定位，方便内部元素布局 */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  /* 重点：不再垂直居中，而是靠上对齐，然后给一个固定的 padding-top */
  /* 这样无论下面有没有日程，日期数字永远在同一个位置 */
  justify-content: flex-start;
  padding-top: 14rpx; 
  box-sizing: border-box;
  transition: background-color 0.2s;
}

/* 选中状态 */
.cell__inner.is-selected {
  background: rgba(37, 99, 235, 0.08);
}

.date-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.cell__dayRow {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.cell__eventCount {
  font-size: 20rpx;
  color: #9aa0a6;
  line-height: 1;
}

.cell__day {
  font-size: 32rpx;
  color: #111;
  line-height: 1;
  font-weight: 500;
}

.cell.is-other .cell__day {
  color: #c9cdd3;
}

.cell__day.is-selectedText {
  color: #2563eb;
  font-weight: 700;
}

.cell__lunar {
  font-size: 20rpx;
  color: #9aa0a6;
  line-height: 1;
  transform: scale(0.9); /* 让农历字再小一点点，更精致 */
}

/* --- 1. 日程容器：去掉定位，让它自然排在农历下面 --- */
.cell__event {
  margin-top: 8rpx;
  width: 96%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6rpx;
  box-sizing: border-box;
}

.cell__eventBar {
  flex: 1;
  height: 28rpx;
  display: flex;
  align-items: center;
  background: #e7efff;
  border-left: 4rpx solid #2563eb;
  padding: 0 6rpx;
  border-radius: 6rpx;
  box-sizing: border-box;
}

.cell__eventBar.is-start {
  border-top-left-radius: 8rpx;
  border-bottom-left-radius: 8rpx;
}

.cell__eventBar.is-end {
  border-top-right-radius: 8rpx;
  border-bottom-right-radius: 8rpx;
}

.cell__eventText {
  font-size: 20rpx;
  color: #2563eb;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.schedule-fab {
  z-index: 10;
}
</style>
