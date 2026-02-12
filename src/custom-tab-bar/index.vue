<template>
  <view class="tabbar" :style="{ paddingBottom: safeAreaInsetBottom + 'px' }">
    <view class="tabbar__wrap">
      <view
        v-for="(item, index) in tabs"
        :key="item.pagePath"
        class="tabbar__item"
        @tap="onTap(index, item)"
      >
        <view class="tabbar__normal">
          <image
            class="tabbar__icon"
            :src="getIcon(item, index === selected)"
            mode="aspectFit"
          />
          <text
            class="tabbar__text"
            :style="{ color: index === selected ? selectedColor : color }"
          >
            {{ item.text }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 全局状态存储，确保所有组件实例共享同一个 selected 状态
const globalTabBarState = {
  selected: 0,
  lastUpdateTime: 0,
  lastUpdateInstanceId: null
}

// 追踪所有组件实例
const allInstances = new Set()

// 存储所有组件实例的引用，用于通知状态更新
const allInstanceRefs = new Map()

export default {
  data() {
    return {
      selected: 0,
      color: '#7A7E83',
      selectedColor: '#667eea',
      syncTimer: null, // 防抖定时器
      attachedTimer: null, // attached() 中创建的定时器
      switchTabTimer: null, // switchTab success 中创建的定时器
      tabs: [
        {
          pagePath: 'pages/tab/customers',
          iconPath: 'static/tabbar/home.png',
          selectedIconPath: 'static/tabbar/home-active.png',
          text: '\u5BA2\u6237'
        },
        {
          pagePath: 'pages/tab/schedule',
          iconPath: 'static/tabbar/category.png',
          selectedIconPath: 'static/tabbar/category-active.png',
          text: '\u65E5\u7A0B'
        },
        {
          pagePath: 'pages/tab/ai',
          iconPath: 'static/tabbar/order.png',
          selectedIconPath: 'static/tabbar/order-active.png',
          text: 'AI'
        },
        {
          pagePath: 'pages/tab/reports-wrapper',
          iconPath: 'static/tabbar/cart.png',
          selectedIconPath: 'static/tabbar/cart-active.png',
          text: '\u62A5\u8868'
        },
        {
          pagePath: 'pages/tab/mine',
          iconPath: 'static/tabbar/mine.png',
          selectedIconPath: 'static/tabbar/mine-active.png',
          text: '\u6211\u7684'
        }
      ]
    }
  },
  computed: {
    safeAreaInsetBottom() {
      return (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets?.bottom) || 0
    }
  },
  lifetimes: {
    attached() {
      const instanceId = Math.random().toString(36).substr(2, 9)
      this._instanceId = instanceId
      allInstances.add(instanceId)
      allInstanceRefs.set(instanceId, this)
      
      // 关键修复：先从全局状态恢复 selected，确保所有组件实例状态一致
      if (globalTabBarState.selected !== this.selected) {
        this.selected = globalTabBarState.selected
      }
      
      // 关键修复：在 attached() 中立即同步状态
      // 组件重新创建时，selected 被重置为 0，但此时页面可能已经在其他 Tab
      // 立即同步确保状态正确，而不是延迟
      this.syncSelected('attached-immediate')
      
      // 备用机制：延迟同步，以防页面栈还未完全更新
      // 第一次延迟同步：100ms
      const timerId1 = setTimeout(() => {
        this.syncSelected('attached-timer-100ms')
      }, 100)
      
      // 第二次延迟同步：200ms（双重保障）
      setTimeout(() => {
        this.syncSelected('attached-timer-200ms')
      }, 200)
      
      this.attachedTimer = timerId1
    }
  },
  pageLifetimes: {
    // 注意：pageLifetimes.show() 在 switchTab 后可能不会触发
    // 因此不依赖它进行状态同步，主要使用 switchTab success 回调和 mounted() 生命周期
    show() {
      // 使用防抖，避免快速跳转时频繁触发
      if (this.syncTimer) {
        clearTimeout(this.syncTimer)
      }
      const timer = setTimeout(() => {
        this.syncSelected('show-timer-100ms')
      }, 100)
      this.syncTimer = timer
    }
  },
  methods: {
    /**
     * 同步选中状态
     * 逻辑：
     * 1. 如果当前页面是 Tab 页面，直接匹配并设置选中状态
     * 2. 如果当前页面不是 Tab 页面，从页面栈中查找最近的 Tab 页面
     * 3. 如果找不到 Tab 页面，保持当前选中状态不变
     */
    syncSelected(source = 'unknown') {
      const pages = getCurrentPages()
      
      if (!pages || pages.length === 0) {
        // 页面栈为空，可能是组件刚创建时页面栈还未更新，直接返回
        return
      }
      
      // 获取当前页面
      const current = pages[pages.length - 1]
      if (!current || !current.route) {
        return
      }
      
      const currentRoute = current.route
      
      // 先尝试直接匹配当前页面
      let index = this.tabs.findIndex(item => item.pagePath === currentRoute)
      
      // 如果当前页面不是 Tab 页面，从页面栈中查找最近的 Tab 页面
      if (index < 0) {
        // 从后往前遍历页面栈，找到最近的 Tab 页面
        for (let i = pages.length - 1; i >= 0; i--) {
          const page = pages[i]
          if (page && page.route) {
            const tabIndex = this.tabs.findIndex(item => item.pagePath === page.route)
            if (tabIndex >= 0) {
              index = tabIndex
              break
            }
          }
        }
      }
      
      // 只有在找到匹配的 Tab 页面且与当前选中状态不同时才更新
      if (index >= 0 && index !== this.selected) {
        // 同时更新全局状态
        globalTabBarState.selected = index
        globalTabBarState.lastUpdateTime = Date.now()
        globalTabBarState.lastUpdateInstanceId = this._instanceId || 'unknown'
        
        this.selected = index
      } else if (index >= 0 && this.selected !== index) {
        // 即使值相同，也强制更新一次，确保界面同步
        // 同时更新全局状态
        globalTabBarState.selected = index
        globalTabBarState.lastUpdateTime = Date.now()
        globalTabBarState.lastUpdateInstanceId = this._instanceId || 'unknown'
        
        this.selected = index
        this.$forceUpdate() // 强制 Vue 更新视图
      }
    },
    /**
     * 设置选中状态（由外部调用，如 Tab 页面跳转时）
     * 注意：这个方法不应该被 Tab 页面的 onShow 调用，而是由 syncSelected 统一管理
     */
    setSelected(index) {
      if (typeof index === 'number' && index >= 0 && index < this.tabs.length) {
        this.selected = index
      }
    },
    getIcon(item, isSelected) {
      const raw = isSelected ? item.selectedIconPath : item.iconPath
      if (!raw) return ''
      return raw.startsWith('/') ? raw : '/' + raw
    },
    onTap(index, item) {
      const nextIndex = Number(index)
      
      // 如果点击的是当前选中的 Tab，直接返回
      if (this.selected === nextIndex) {
        return
      }
      
      if (!item) {
        return
      }
      
      // 同时更新全局状态
      globalTabBarState.selected = nextIndex
      globalTabBarState.lastUpdateTime = Date.now()
      globalTabBarState.lastUpdateInstanceId = this._instanceId || 'unknown'
      
      // 通知所有其他组件实例同步全局状态
      allInstanceRefs.forEach((instance, instanceId) => {
        if (instanceId !== this._instanceId) {
          if (instance && instance.selected !== undefined && instance.selected !== nextIndex) {
            instance.selected = nextIndex
            instance.$forceUpdate() // 强制 Vue 更新视图
          }
        }
      })
      
      this.selected = nextIndex
      
      const url = '/' + item.pagePath
      
      // 执行跳转
      uni.switchTab({ 
        url,
        success: () => {
          // 关键发现：switchTab 会导致组件重新创建
          // switchTab success 回调在旧组件实例中执行，但界面显示的是新组件实例
          // 因此不需要在这里同步状态，新组件会在 attached() 中自动同步
          
          // 清理旧的 switchTabTimer（如果存在）
          if (this.switchTabTimer) {
            clearTimeout(this.switchTabTimer)
            this.switchTabTimer = null
          }
        },
        fail: (err) => {
          console.error('switchTab fail:', err)
        }
      })
    }
  },
  beforeDestroy() {
    const instanceId = this._instanceId || 'unknown'
    allInstances.delete(instanceId)
    allInstanceRefs.delete(instanceId)
    
    // 清理所有定时器
    if (this.syncTimer) {
      clearTimeout(this.syncTimer)
      this.syncTimer = null
    }
    if (this.attachedTimer) {
      clearTimeout(this.attachedTimer)
      this.attachedTimer = null
    }
    if (this.switchTabTimer) {
      clearTimeout(this.switchTabTimer)
      this.switchTabTimer = null
    }
  },
  // Vue 组件中需要添加 ready 生命周期
  mounted() {
    // 关键修复：在 mounted() 中同步状态
    // mounted() 生命周期在组件完全准备好后触发，此时页面栈应该已经更新
    // 这是双重保障机制，确保状态能够正确同步
    this.syncSelected('mounted')
  }
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.tabbar__wrap {
  height: 100rpx;
  display: flex;
  align-items: stretch;
}

.tabbar__item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabbar__normal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tabbar__icon {
  width: 44rpx;
  height: 44rpx;
}

.tabbar__text {
  margin-top: 6rpx;
  font-size: 22rpx;
  line-height: 1;
}
</style>
