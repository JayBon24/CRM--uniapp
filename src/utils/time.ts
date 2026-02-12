/**
 * 时间处理工具函数
 */

import dayjs from 'dayjs'

/**
 * 格式化时间
 * @param time 时间
 * @param format 格式
 * @returns 格式化后的时间
 */
export function formatTime(time: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!time)
    return ''
  return dayjs(time).format(format)
}

/**
 * 获取相对时间
 * @param time 时间
 * @returns 相对时间
 */
export function getRelativeTime(time: string | number | Date): string {
  if (!time)
    return ''
  const now = dayjs()
  const target = dayjs(time)
  const diff = now.diff(target, 'minute')

  if (diff < 1)
    return '刚刚'
  if (diff < 60)
    return `${diff}分钟前`

  const hours = Math.floor(diff / 60)
  if (hours < 24)
    return `${hours}小时前`

  const days = Math.floor(hours / 24)
  if (days < 30)
    return `${days}天前`

  const months = Math.floor(days / 30)
  if (months < 12)
    return `${months}个月前`

  return `${Math.floor(months / 12)}年前`
}

/**
 * 判断是否为同一天
 * @param time1 时间1
 * @param time2 时间2
 * @returns boolean
 */
export function isSameDay(time1: string | number | Date, time2: string | number | Date): boolean {
  return dayjs(time1).isSame(time2, 'day')
}

/**
 * 获取指定时间范围
 * @param type 类型：today-今天, week-本周, month-本月, year-今年
 * @returns [开始时间, 结束时间]
 */
export function getTimeRange(type: 'today' | 'week' | 'month' | 'year'): [Date, Date] {
  const now = dayjs()

  switch (type) {
    case 'today':
      return [
        now.startOf('day').toDate(),
        now.endOf('day').toDate(),
      ]
    case 'week':
      return [
        now.startOf('week').toDate(),
        now.endOf('week').toDate(),
      ]
    case 'month':
      return [
        now.startOf('month').toDate(),
        now.endOf('month').toDate(),
      ]
    case 'year':
      return [
        now.startOf('year').toDate(),
        now.endOf('year').toDate(),
      ]
  }
}
