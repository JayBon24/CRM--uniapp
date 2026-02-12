import { createSSRApp } from 'vue'
import App from './App.vue'
// 不需要导入mp-html组件，已通过easycom配置
import uviewPlus from 'uview-plus'
import store from './stores'
// Mock 处理器改为动态导入，避免在生产环境打包进主包
// 注册所有 Mock 处理器，避免在 request 中引入造成循环依赖
// import { setupMockHandlers } from '@/mock' // 改为动态导入
// 导入全局工具函数
import { getImageUrl,formatDate,formatNumber} from '@/utils/global'
// 导入环境配置工具函数
import { getEnvConfig } from '@/config/env'
import { createPinia } from 'pinia'
import { useDict, getDictLabel } from '@/utils/dict'
import permissionDirectives from './directive/permission'
// 导入系统信息初始化和全局变量
import { initSystemInfo, getNavBarHeight, getStatusBarHeight, getNativeTitleBarHeight} from '@/utils/system'
// 导入全局组件
import SvgIcon from '@/components/SvgIcon/index.vue'
import AppHeader from '@/components/AppHeader/index.vue'
import AiHeader from '@/components/AiHeader/index.vue'
import DraggableFab from '@/components/DraggableFab/index.vue'

import PageHeader from '@/components/PageHeader/index.vue'

import * as compatApiAuth from '@/api/auth'
import * as compatApiChatkit from '@/api/chatkit'
import * as compatApiConfig from '@/api/config'
import * as compatCommonAssets from '@/common/assets'
import * as compatUseIndicatorDetail from '@/composables/useIndicatorDetail'
import * as compatCaseSchedule from '@/services/case-schedule'
import * as compatCaseMilestone from '@/types/interfaces/case-milestone'
import * as compatStoreClient from '@/stores/client'
import * as compatAddressParser from '@/utils/addressParser'
import * as compatAttachment from '@/utils/attachment'
import * as compatCalendar from '@/utils/calendar'
import * as compatPinyin from '@/utils/pinyin'

import 'uview-plus/index.scss'
import './styles/myflex.css'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(store)
  app.use(uviewPlus)

  // 注册全局函数
  app.config.globalProperties.$getImageUrl = getImageUrl
  app.config.globalProperties.$formatDate = formatDate
  app.config.globalProperties.$formatNumber = formatNumber
  app.config.globalProperties.$getDictLabel = getDictLabel // 中文注释：全局字典取标签函数
  app.config.globalProperties.useDict = useDict

  // 初始化系统信息（需先初始化再注册全局数值，避免小程序出现 [object Object]）
  initSystemInfo()

  // 注册全局系统信息数值（使用数字而不是 ref，避免模板中拼接出现 [object Object]）
  const __NAV_BAR_HEIGHT__ = getNavBarHeight()
  const __STATUS_BAR_HEIGHT__ = getStatusBarHeight()
  const __NATIVE_TITLE_BAR_HEIGHT__ = getNativeTitleBarHeight()
  app.config.globalProperties.$navBarHeight = __NAV_BAR_HEIGHT__
  app.config.globalProperties.$statusBarHeight = __STATUS_BAR_HEIGHT__
  app.config.globalProperties.$nativeTitleBarHeight = __NATIVE_TITLE_BAR_HEIGHT__

  // 注册全局组件SvgIcon
  app.component('SvgIcon', SvgIcon)
  app.component('AppHeader', AppHeader)
  app.component('AiHeader', AiHeader)
  app.component('DraggableFab', DraggableFab)
  app.component('PageHeader', PageHeader)

  // 注册权限指令
  app.directive('hasPermi', permissionDirectives.hasPermi)

  // 注册 Mock（根据环境变量控制，使用动态导入避免打包进主包）
  const envConfig = getEnvConfig()
  if (envConfig.useMock) {
    console.log('🔧 启用 Mock 模式，正在注册 Mock 处理器...')
    // 动态导入 mock，仅在启用 Mock 时加载，避免打包进主包
    import('@/mock').then(({ setupMockHandlers }) => {
      // setupMockHandlers 现在是异步函数，需要 await
      setupMockHandlers().catch((err) => {
        console.error('❌ Mock 处理器注册失败:', err)
      })
    }).catch((err) => {
      console.error('❌ Mock 模块加载失败:', err)
    })
  } else {
    console.log('🌐 使用真实 API 模式')
  }

  // 可选：在 H5 下同步到 CSS 变量，便于样式中直接使用
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--status-bar-height', `${__STATUS_BAR_HEIGHT__}px`)
    document.documentElement.style.setProperty('--nav-bar-height', `${__NAV_BAR_HEIGHT__}px`)
  }

  void [
    compatApiAuth,
    compatApiChatkit,
    compatApiConfig,
    compatCommonAssets,
    compatUseIndicatorDetail,
    compatCaseSchedule,
    compatCaseMilestone,
    compatStoreClient,
    compatAddressParser,
    compatAttachment,
    compatCalendar,
    compatPinyin,
  ]

  return {
    app,
  }
}
