/**
 * mp-html组件类型声明
 */
declare namespace MpHtml {
  interface Props {
    /**
     * 用于渲染的 html 字符串
     */
    content: string;
    
    /**
     * 是否开启懒加载
     */
    lazyLoad?: boolean;
    
    /**
     * 是否允许长按复制内容
     */
    selectable?: boolean;
    
    /**
     * 是否使用锚点跳转
     */
    useAnchor?: boolean;
    
    /**
     * 是否允许图片被点击时显示菜单
     */
    showImgMenu?: boolean;
    
    /**
     * 是否允许图片被点击时预览
     */
    previewImg?: boolean;
    
    /**
     * 是否允许外部链接被点击时自动复制
     */
    copyLink?: boolean;
    
    /**
     * 主域名，用于拼接链接
     */
    domain?: string;
    
    /**
     * 标签的默认样式
     */
    tagStyle?: Record<string, string>;
    
    /**
     * 图片出错时的占位图链接
     */
    errorImg?: string;
    
    /**
     * 图片加载过程中的占位图链接
     */
    loadingImg?: string;
    
    /**
     * 是否允许长表格横向滚动
     */
    scrollTable?: boolean;
    
    /**
     * 是否给图片添加预览属性
     */
    useCache?: boolean;
  }
  
  interface Events {
    /**
     * 渲染开始事件
     */
    load: any;
    
    /**
     * 渲染完成事件
     */
    ready: any;
    
    /**
     * 图片被点击事件
     */
    imgTap: any;
    
    /**
     * 链接被点击事件
     */
    linkTap: any;
    
    /**
     * 渲染错误事件
     */
    error: any;
  }
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    'mp-html': {
      new (): {
        $props: MpHtml.Props;
        $emit: <T extends keyof MpHtml.Events>(event: T, ...args: any[]) => void;
      };
    };
  }
}

export {}; 