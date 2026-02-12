declare namespace UniApp {
  interface SystemInfo {
    platform: string;
    statusBarHeight: number;
    // 其他系统信息属性...
  }
}

declare const uni: {
  getSystemInfoSync(): UniApp.SystemInfo;
  // 其他 uni 方法...
}; 