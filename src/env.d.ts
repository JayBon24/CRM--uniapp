/// <reference types="vite/client" />
/// <reference types="@dcloudio/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// mp-html组件声明
declare module 'mp-html/dist/uni-app/components/mp-html/mp-html.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{
    content: string;
    domain?: string;
    lazyLoad?: boolean;
    scrollTable?: boolean;
    selectable?: boolean;
    showImgMenu?: boolean;
    tagStyle?: Record<string, string>;
    useAnchor?: boolean;
  }, {}, any>
  export default component
}

// 全局方法声明
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // 全局工具方法声明（中文注释：避免在模板中使用时报类型错误）
    $getImageUrl: (url: string, width?: number, height?: number) => string;
    $formatDate: (date: string | Date, format?: string) => string;
    $formatNumber: (num: number, precision?: number) => string;
    useDict: (...types: string[]) => any;
    $getDictLabel: (dictType: string, value: any) => string;
  }
}
