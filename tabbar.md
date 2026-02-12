# Tabbar 实现文档

## 1. 整体架构

### 1.1 核心文件

- `src/components/tabbar/index.vue` - 主组件
- `src/uni_modules/vk-uview-ui/components/u-tabbar/u-tabbar.vue` - UI 组件
- `src/stores/tabbar.ts` - 状态管理
- `src/App.vue` - 预加载逻辑

### 1.2 配置文件

```json
// pages.json
{
  "tabBar": {
    "color": "#282828",
    "selectedColor": "#ff3366",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/coach/index",
        "text": "技师"
      },
      {
        "pagePath": "pages/shop/index",
        "text": "商家"
      },
      {
        "pagePath": "pages/order/index",
        "text": "订单"
      },
      {
        "pagePath": "pages/user/user",
        "text": "我的"
      }
    ]
  }
}
```

## 2. 状态管理实现

### 2.1 默认配置

```typescript
// stores/tabbar.ts
const defaultTabbarConfig = {
  style: {
    selected_color: '#007AFF', // 选中颜色
    default_color: '#999999' // 默认颜色
  },
  list: [] // tabbar 列表
}
```

### 2.2 Store 实现

```typescript
export const useTabbarStore = defineStore('tabbar', () => {
  const tabbarStyle = ref({
    activeColor: defaultTabbarConfig.style.selected_color,
    inactiveColor: defaultTabbarConfig.style.default_color
  })

  const tabbarList = ref<any>([])

  // 获取tabbar配置
  const getTabbarData = async () => {
    try {
      const res = await getTabbarConfig()
      const data = JSON.parse(res.data)

      // 设置样式
      tabbarStyle.value = {
        activeColor: data.style.selected_color,
        inactiveColor: data.style.default_color
      }

      // 设置列表
      tabbarList.value = data.list
        ?.filter((item: any) => item.is_show == 1)
        .map((item: any) => ({
          iconPath: item.unselected,
          selectedIconPath: item.selected,
          text: item.name,
          link: item.link,
          pagePath: item.link.path
        }))
    } catch (error) {
      console.error('Failed to get tabbar config:', error)
      // 使用默认配置
      tabbarStyle.value = {
        activeColor: defaultTabbarConfig.style.selected_color,
        inactiveColor: defaultTabbarConfig.style.default_color
      }
      tabbarList.value = defaultTabbarConfig.list
    }
  }

  return {
    tabbarStyle,
    tabbarList,
    getTabbarData
  }
})
```

## 3. 组件实现

### 3.1 Tabbar 组件

```vue
<!-- components/tabbar/index.vue -->
<template>
  <u-tabbar
    v-model="current"
    v-bind="tabbarStore.tabbarStyle"
    :list="tabbarStore.tabbarList"
    :hide-tab-bar="true"
    :height="100"
    :icon-size="44"
    :mid-button-size="90"
    :border-top="true"
    :before-switch="beforeSwitch"
    @change="handleChange"></u-tabbar>
</template>

<script setup>
  const nativeTabbar = [
    '/pages/index/index',
    '/pages/order/index',
    '/pages/coach/index',
    '/pages/user/user'
  ]

  // 切换前的回调
  const beforeSwitch = (index: number) => {
    return true
  }

  const handleChange = (index: number) => {
    const selectTab = tabbarStore.tabbarList[index]
    const navigateType = nativeTabbar.includes(selectTab.link.path) ? 'switchTab' : 'reLaunch'
    navigateTo(selectTab.link, navigateType)
  }
</script>

<style lang="scss" scoped>
  :deep(.u-tabbar),
  :deep(.u-tabbar__content),
  :deep(.u-tabbar__content__item),
  :deep(.u-tabbar__content__item__button),
  :deep(.u-tabbar__content__item__text) {
    transition: all 0.5s ease-in-out;
  }
</style>
```

## 4. 预加载机制

### 4.1 预加载实现

```typescript
// App.vue

// tabbar页面列表
const tabbarPages = [
  '/pages/index/index',
  '/pages/order/index',
  '/pages/coach/index',
  '/pages/shop/index',
  '/pages/user/user'
]

// 预加载状态记录
const preloadStatus = ref<Record<string, boolean>>({})

// 预加载tabbar页面
const preloadTabbarPages = () => {
  console.log('开始预加载tabbar页面')
  // #ifdef APP-PLUS || H5
  try {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]?.route || ''

    tabbarPages.forEach(path => {
      // 跳过当前页面
      if (path.includes(currentPage)) return

      // 如果已经预加载过，就跳过
      if (preloadStatus.value[path]) return

      const pagePath = path.startsWith('/') ? path.slice(1) : path
      console.log('预加载页面:', pagePath)

      // 使用setTimeout错开加载时间，避免同时加载太多页面
      setTimeout(() => {
        uni.preloadPage({
          url: `/${pagePath}`,
          success: () => {
            console.log(`预加载页面成功: ${pagePath}`)
            // 标记为已预加载
            preloadStatus.value[path] = true
          },
          fail: err => {
            console.error(`预加载页面失败: ${pagePath}`, err)
          }
        })
      }, 100)
    })
  } catch (error) {
    console.error('预加载失败:', error)
  }
  // #endif
}

// 在应用启动时初始化
onLaunch(async () => {
  // 隐藏系统tabbar
  uni.hideTabBar()

  // 初始化配置
  await getTheme()
  await getConfig()
  getSystemInfo()
  getLocationData()

  // 提前加载tabbar配置
  await getTabbarData()

  // #ifdef APP-PLUS || H5
  // 延迟执行预加载，确保应用已经完全初始化
  setTimeout(() => {
    preloadTabbarPages()
  }, 500)
  // #endif
})
```

### 4.2 预加载优势

1. **性能提升**：

   - 提前加载页面资源，减少切换时的加载时间
   - 错开加载时间，避免资源竞争
   - 只预加载未访问的页面，避免重复加载

2. **用户体验**：

   - 页面切换更流畅
   - 减少白屏时间
   - 提供更快的响应速度

3. **资源管理**：
   - 使用 `preloadStatus` 追踪加载状态
   - 避免重复预加载
   - 错开加载时间，优化资源使用

## 5. 使用方式

### 5.1 页面中使用

```vue
<template>
  <view>
    <!-- 页面内容 -->
    <Tabbar />
  </view>
</template>

<script setup>
  import Tabbar from '@/components/tabbar/index.vue'
</script>
```

### 5.2 注意事项

1. 确保在 `pages.json` 中正确配置 tabBar
2. 预加载功能仅在 APP-PLUS 和 H5 平台可用
3. 需要在应用启动时初始化 tabbar 配置
4. 建议使用 Pinia 进行状态管理
