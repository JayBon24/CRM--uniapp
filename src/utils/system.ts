// 注意：ref 和 computed 通过 unplugin-auto-import 自动导入

interface SystemInfo {
  navBarHeight: number
  statusBarHeight: number
  menuButtonHeight: number
  menuButtonWidth: number
  menuButtonTop: number
  menuButtonRight: number
  windowWidth: number
  windowHeight: number
  screenHeight: number
}

let systemInfo: SystemInfo | null = null

// 全局响应式变量（用于外部响应式消费）
const _navBarHeight = ref<number>(0)
const _statusBarHeight = ref<number>(0)

// 简化：直接使用 uni.getSystemInfoSync 获取系统信息（uni 内部已做平台适配）
function readRawSystemInfo() {
  return uni.getSystemInfoSync() as any
}

// 获取系统信息（缓存）
export function getSystemInfo(): SystemInfo {
  if (systemInfo) return systemInfo

  const sys = readRawSystemInfo()

  // 胶囊按钮信息（非 H5 才尝试获取）
  let menuButtonInfo: any = { height: 32, width: 87, top: (sys.statusBarHeight || 0) + 6, right: 10 }
  try {
    if (uni.getMenuButtonBoundingClientRect && process.env.UNI_PLATFORM !== 'h5') {
      const rect = uni.getMenuButtonBoundingClientRect()
      if (rect) menuButtonInfo = rect
    }
  } catch {}

  // 状态栏高度处理，添加兜底逻辑
  let statusBarHeight = typeof sys.statusBarHeight === 'number' ? sys.statusBarHeight : 0

  // 调试信息：打印原始状态栏高度
  console.log('设备信息调试:', {
    platform: sys.platform,
    model: sys.model,
    system: sys.system,
    statusBarHeight: sys.statusBarHeight,
    windowHeight: sys.windowHeight,
    screenHeight: sys.screenHeight
  })

  // 真机兜底逻辑：如果状态栏高度异常，使用默认值
  if (statusBarHeight <= 0 || statusBarHeight > 100) {
    // 根据设备类型设置默认状态栏高度
    // #ifdef MP-WEIXIN
    statusBarHeight = 20 // 微信小程序默认值
    // #endif
    // #ifdef APP-PLUS
    statusBarHeight = 24 // App 默认值
    // #endif
    // #ifdef H5
    statusBarHeight = 0 // H5 默认值
    // #endif
  }

  const navBarHeight = statusBarHeight + 44

  systemInfo = {
    navBarHeight,
    statusBarHeight,
    menuButtonHeight: menuButtonInfo.height || 32,
    menuButtonWidth: menuButtonInfo.width || 87,
    menuButtonTop: menuButtonInfo.top || statusBarHeight,
    menuButtonRight: menuButtonInfo.right || 10,
    windowWidth: sys.windowWidth || 0,
    windowHeight: sys.windowHeight || 0,
    screenHeight: sys.screenHeight || 0
  }

  _navBarHeight.value = systemInfo.navBarHeight
  _statusBarHeight.value = systemInfo.statusBarHeight

  return systemInfo
}

// 获取导航栏高度（自定义头部：状态栏 + 44）
export function getNavBarHeight(): number {
  return getSystemInfo().navBarHeight
}

// 获取系统原生标题栏高度（统一口径：MP 返回 0，H5 返回 44，其它端兜底 44，若系统有 titleBarHeight 则用）
export function getNativeTitleBarHeight(): number {
  const sys: any = uni.getSystemInfoSync() || {}
  if (typeof sys.titleBarHeight === 'number' && !isNaN(sys.titleBarHeight)) return sys.titleBarHeight
  // #ifdef MP-WEIXIN
  return 0
  // #endif
  // #ifndef MP-WEIXIN
  // 非微信小程序平台（H5、APP等）都返回 44
  return 44
  // #endif
}

// 获取状态栏高度
export function getStatusBarHeight(): number {
  return getSystemInfo().statusBarHeight
}

// 响应式变量导出
export const navBarHeight = computed(() => _navBarHeight.value)
export const statusBarHeight = computed(() => _statusBarHeight.value)
export const nativeTitleBarHeight = computed(() => getNativeTitleBarHeight())

// 初始化（在应用启动时调用）
export function initSystemInfo() {
  getSystemInfo()
}

// 异步获取系统信息（推荐在真机上使用）
export function getSystemInfoAsync(): Promise<SystemInfo> {
  return new Promise((resolve) => {
    uni.getSystemInfo({
      success: (sys) => {
        // 胶囊按钮信息（非 H5 才尝试获取）
        let menuButtonInfo: any = { height: 32, width: 87, top: (sys.statusBarHeight || 0) + 6, right: 10 }
        try {
          if (uni.getMenuButtonBoundingClientRect && process.env.UNI_PLATFORM !== 'h5') {
            const rect = uni.getMenuButtonBoundingClientRect()
            if (rect) menuButtonInfo = rect
          }
        } catch {}

        // 状态栏高度处理，添加兜底逻辑
        let statusBarHeight = typeof sys.statusBarHeight === 'number' ? sys.statusBarHeight : 0

        // 调试信息：打印原始状态栏高度
        console.log('异步获取设备信息调试:', {
          platform: sys.platform,
          model: sys.model,
          system: sys.system,
          statusBarHeight: sys.statusBarHeight,
          windowHeight: sys.windowHeight,
          screenHeight: sys.screenHeight
        })

        // 真机兜底逻辑：如果状态栏高度异常，使用默认值
        if (statusBarHeight <= 0 || statusBarHeight > 100) {
          // 根据设备类型设置默认状态栏高度
          // #ifdef MP-WEIXIN
          statusBarHeight = 20 // 微信小程序默认值
          // #endif
          // #ifdef APP-PLUS
          statusBarHeight = 24 // App 默认值
          // #endif
          // #ifdef H5
          statusBarHeight = 0 // H5 默认值
          // #endif
        }

        const navBarHeight = statusBarHeight + 44

        const info: SystemInfo = {
          navBarHeight,
          statusBarHeight,
          menuButtonHeight: menuButtonInfo.height || 32,
          menuButtonWidth: menuButtonInfo.width || 87,
          menuButtonTop: menuButtonInfo.top || statusBarHeight,
          menuButtonRight: menuButtonInfo.right || 10,
          windowWidth: sys.windowWidth || 0,
          windowHeight: sys.windowHeight || 0,
          screenHeight: sys.screenHeight || 0
        }

        // 更新全局状态
        systemInfo = info
        _navBarHeight.value = info.navBarHeight
        _statusBarHeight.value = info.statusBarHeight

        resolve(info)
      },
      fail: () => {
        // 失败时使用同步方法作为兜底
        resolve(getSystemInfo())
      }
    })
  })
}

// 获取胶囊按钮信息
export function getMenuButtonInfo() {
  const info = getSystemInfo()
  return {
    height: info.menuButtonHeight,
    width: info.menuButtonWidth,
    top: info.menuButtonTop,
    right: info.menuButtonRight
  }
}

// 获取窗口信息
export function getWindowInfo() {
  const info = getSystemInfo()
  return {
    width: info.windowWidth,
    height: info.windowHeight,
    screenHeight: info.screenHeight
  }
}
