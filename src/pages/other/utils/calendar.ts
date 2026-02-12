/**
 * 系统日历工具函数
 * 用于将日程同步到手机系统日历
 */

import type { Schedule } from '@/types/interfaces/schedule'

// 用户偏好设置的key
const CALENDAR_SYNC_PREFERENCE_KEY = 'calendar_sync_preference'

// 同步偏好类型
export type SyncPreference = 'always' | 'never' | 'ask'

/**
 * 获取用户的日历同步偏好
 */
export function getSyncPreference(): SyncPreference {
  try {
    const preference = uni.getStorageSync(CALENDAR_SYNC_PREFERENCE_KEY)
    return preference || 'ask'
  } catch (error) {
    return 'ask'
  }
}

/**
 * 设置用户的日历同步偏好
 */
export function setSyncPreference(preference: SyncPreference) {
  try {
    uni.setStorageSync(CALENDAR_SYNC_PREFERENCE_KEY, preference)
  } catch (error) {
    console.error('保存同步偏好失败:', error)
  }
}

/**
 * 将日程添加到系统日历
 */
export function addToPhoneCalendar(schedule: Schedule): Promise<void> {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    const startDate = new Date(schedule.start_time)
    const endDate = schedule.end_time ? new Date(schedule.end_time) : new Date(startDate.getTime() + 60 * 60 * 1000)

    // 构建日历事件数据
    const calendarEvent: any = {
      title: schedule.title,
      startTime: Math.floor(startDate.getTime() / 1000), // 转换为秒级时间戳
      endTime: Math.floor(endDate.getTime() / 1000),
      allDay: schedule.is_all_day || false
    }

    // 添加描述
    if (schedule.description) {
      calendarEvent.description = schedule.description
    }

    // 添加地点
    if (schedule.location) {
      calendarEvent.location = schedule.location
    }

    // 添加提醒
    if (schedule.reminder_enabled && schedule.reminder_time !== undefined && schedule.reminder_time !== null) {
      calendarEvent.alarm = true
      calendarEvent.alarmOffset = schedule.reminder_time * 60 // 转换为秒
    }

    // 调用微信API
    // @ts-ignore
    if (typeof wx !== 'undefined' && wx.addPhoneCalendar) {
      // @ts-ignore
      wx.addPhoneCalendar({
        ...calendarEvent,
        success: () => {
          console.log('日程已同步到系统日历')
          resolve()
        },
        fail: (error: any) => {
          console.error('同步到系统日历失败:', error)
          reject(error)
        }
      })
    } else {
      reject(new Error('不支持的平台'))
    }
    // #endif

    // #ifndef MP-WEIXIN
    // 非微信小程序环境，提示不支持
    uni.showToast({
      title: '当前环境不支持同步到系统日历',
      icon: 'none'
    })
    reject(new Error('不支持的平台'))
    // #endif
  })
}

/**
 * 询问用户是否同步到系统日历
 * @param schedule 日程对象
 * @param showRememberOption 是否显示"记住我的选择"选项
 */
export async function askToSyncCalendar(schedule: Schedule, showRememberOption: boolean = true): Promise<boolean> {
  // 检查用户偏好
  const preference = getSyncPreference()

  // 如果用户选择了"从不同步"，直接返回
  if (preference === 'never') {
    return false
  }

  // 如果用户选择了"总是同步"，直接同步
  if (preference === 'always') {
    try {
      await addToPhoneCalendar(schedule)
      uni.showToast({
        title: '已同步到系统日历',
        icon: 'success'
      })
      return true
    } catch (error) {
      uni.showToast({
        title: '同步失败',
        icon: 'none'
      })
      return false
    }
  }

  // 询问用户
  return new Promise((resolve) => {
    uni.showModal({
      title: '同步到日历',
      content: showRememberOption 
        ? '是否将此日程同步到手机系统日历？\n\n提示：可在设置中修改同步偏好'
        : '是否将此日程同步到手机系统日历？',
      confirmText: '同步',
      cancelText: '取消',
      success: async (res) => {
        if (res.confirm) {
          // 用户点击了同步
          try {
            await addToPhoneCalendar(schedule)
            uni.showToast({
              title: '已同步到系统日历',
              icon: 'success',
              duration: 2000
            })
            resolve(true)
          } catch (error: any) {
            // 同步失败
            if (error.errMsg && error.errMsg.includes('cancel')) {
              // 用户取消了系统日历授权
              uni.showToast({
                title: '已取消同步',
                icon: 'none'
              })
            } else {
              uni.showToast({
                title: '同步失败，请稍后重试',
                icon: 'none'
              })
            }
            resolve(false)
          }
        } else {
          // 用户点击了取消
          resolve(false)
        }
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/**
 * 批量同步日程到系统日历
 * @param schedules 日程列表
 * @param onProgress 进度回调
 */
export async function batchSyncToCalendar(
  schedules: Schedule[],
  onProgress?: (current: number, total: number) => void
): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0

  for (let i = 0; i < schedules.length; i++) {
    try {
      await addToPhoneCalendar(schedules[i])
      success++
    } catch (error) {
      failed++
    }

    if (onProgress) {
      onProgress(i + 1, schedules.length)
    }

    // 添加延迟，避免频繁调用API
    if (i < schedules.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }

  return { success, failed }
}
