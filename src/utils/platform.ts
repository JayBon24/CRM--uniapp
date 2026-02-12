/**
 * 平台检测工具
 * 用于检测当前运行的小程序平台
 */

/**
 * 获取当前平台类型
 * @returns 'wechat' | 'douyin' | 'alipay' | 'qq' | 'baidu' | 'unknown'
 */
export function getCurrentPlatform(): string {
  // #ifdef MP-WEIXIN
  return 'wechat'
  // #endif
  
  // #ifdef MP-TOUTIAO
  return 'douyin'
  // #endif
  
  // #ifdef MP-ALIPAY
  return 'alipay'
  // #endif
  
  // #ifdef MP-QQ
  return 'qq'
  // #endif
  
  // #ifdef MP-BAIDU
  return 'baidu'
  // #endif
  
  // 默认返回微信平台
  return 'wechat'
}

/**
 * 检查是否为微信小程序
 * @returns boolean
 */
export function isWechat(): boolean {
  return getCurrentPlatform() === 'wechat'
}

/**
 * 检查是否为抖音小程序
 * @returns boolean
 */
export function isDouyin(): boolean {
  return getCurrentPlatform() === 'douyin'
}

/**
 * 检查是否为支付宝小程序
 * @returns boolean
 */
export function isAlipay(): boolean {
  return getCurrentPlatform() === 'alipay'
}

/**
 * 检查是否为QQ小程序
 * @returns boolean
 */
export function isQQ(): boolean {
  return getCurrentPlatform() === 'qq'
}

/**
 * 检查是否为百度小程序
 * @returns boolean
 */
export function isBaidu(): boolean {
  return getCurrentPlatform() === 'baidu'
}

/**
 * 获取平台显示名称
 * @returns string
 */
export function getPlatformName(): string {
  const platform = getCurrentPlatform()
  const nameMap: Record<string, string> = {
    wechat: '微信',
    douyin: '抖音',
    alipay: '支付宝',
    qq: 'QQ',
    baidu: '百度'
  }
  return nameMap[platform] || '未知平台'
}

/**
 * 获取平台图标名称（用于uView图标）
 * @returns string
 */
export function getPlatformIcon(): string {
  const platform = getCurrentPlatform()
  const iconMap: Record<string, string> = {
    wechat: 'wechat',
    douyin: 'video',
    alipay: 'alipay',
    qq: 'qq',
    baidu: 'search'
  }
  return iconMap[platform] || 'help'
}

/**
 * 获取平台特定的分享配置
 * @returns object
 */
export function getPlatformShareConfig() {
  const platform = getCurrentPlatform()
  
  const configMap: Record<string, any> = {
    wechat: {
      shareType: 'wechat',
      qrCodeType: 'wechat_qr',
      shareTitle: '分享给微信好友',
      posterTitle: '生成微信海报'
    },
    douyin: {
      shareType: 'douyin',
      qrCodeType: 'douyin_qr',
      shareTitle: '分享到抖音',
      posterTitle: '生成抖音海报'
    },
    alipay: {
      shareType: 'alipay',
      qrCodeType: 'alipay_qr',
      shareTitle: '分享到支付宝',
      posterTitle: '生成支付宝海报'
    },
    qq: {
      shareType: 'qq',
      qrCodeType: 'qq_qr',
      shareTitle: '分享到QQ',
      posterTitle: '生成QQ海报'
    },
    baidu: {
      shareType: 'baidu',
      qrCodeType: 'baidu_qr',
      shareTitle: '分享到百度',
      posterTitle: '生成百度海报'
    }
  }
  
  return configMap[platform] || configMap.wechat
}

/**
 * 获取平台特定的API配置
 * @returns object
 */
export function getPlatformApiConfig() {
  const platform = getCurrentPlatform()
  
  const apiConfigMap: Record<string, any> = {
    wechat: {
      shareApi: 'uni.showShareAppMessage',
      saveImageApi: 'uni.saveImageToPhotosAlbum',
      chooseImageApi: 'uni.chooseImage'
    },
    douyin: {
      shareApi: 'uni.share',
      saveImageApi: 'uni.saveImageToPhotosAlbum',
      chooseImageApi: 'uni.chooseImage'
    },
    alipay: {
      shareApi: 'uni.share',
      saveImageApi: 'uni.saveImageToPhotosAlbum',
      chooseImageApi: 'uni.chooseImage'
    },
    qq: {
      shareApi: 'uni.showShareAppMessage',
      saveImageApi: 'uni.saveImageToPhotosAlbum',
      chooseImageApi: 'uni.chooseImage'
    },
    baidu: {
      shareApi: 'uni.share',
      saveImageApi: 'uni.saveImageToPhotosAlbum',
      chooseImageApi: 'uni.chooseImage'
    }
  }
  
  return apiConfigMap[platform] || apiConfigMap.wechat
} 