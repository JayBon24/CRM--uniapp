// 简单的事件总线实现
class EventBus {
  events: Map<string, Function[]> = new Map()

  // 监听事件
  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)
  }

  // 触发事件
  emit(event: string, data?: any) {
    if (this.events.has(event)) {
      this.events.get(event)!.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('事件回调执行失败:', error)
        }
      })
    }
  }

  // 移除事件监听
  off(event: string, callback?: Function) {
    if (!this.events.has(event)) return

    if (callback) {
      const callbacks = this.events.get(event)!
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    } else {
      this.events.delete(event)
    }
  }

  // 清空所有事件
  clear() {
    this.events.clear()
  }
}

// 创建全局事件总线实例
const eventBus = new EventBus()

export default eventBus
