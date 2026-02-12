/**
 * 自动导入类型声明
 * 解决 unplugin-auto-import 导入的 Vue API 在 TypeScript 中的类型错误
 */

export {}

// Vue 核心 API
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // 全局组件类型声明
    NavBar: typeof import('../components/NavBar.vue')['default']
    EmptyState: typeof import('../components/EmptyState.vue')['default']
  }
}

// 全局方法
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $getImageUrl: (url: string) => string
    $formatDate: (date: string | Date, format?: string) => string
    $formatNumber: (num: number, decimals?: number) => string
    $getDictLabel: (dictType: string, value: any) => string
    useDict: any
    // 全局系统信息变量
    $navBarHeight: any
    $statusBarHeight: any
  }
}
