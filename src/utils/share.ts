/**
 * 微信小程序分享工具函数
 * 统一管理分享逻辑，支持不同页面类型的分享配置
 */

import { getImageUrl } from './global'

// 分享类型枚举
export enum ShareType {
  EXHIBITION = 'exhibition',      // 展览分享
  ARTWORK = 'artwork',           // 作品分享
  ORGANIZER = 'organizer',       // 创办方分享
  USER_PROFILE = 'user_profile', // 用户主页分享
  APP = 'app'                    // 应用分享
}

// 分享配置接口
export interface ShareConfig {
  title: string
  path: string
  imageUrl?: string
  query?: string
}

/**
 * 获取分享配置
 * @param type 分享类型
 * @param data 相关数据
 * @returns 分享配置
 */
export function getShareConfig(type: ShareType, data: any = {}): ShareConfig {
  // 默认分享图片
  // 微信小程序端使用分包下的 logo，避免触发主包 common/assets.js
  // 其他平台仍然使用原来的 /static 路径或自行替换为 CDN 地址
  let baseUrl = '/static/logo.png'
  // #ifdef MP-WEIXIN
  baseUrl = '/pages/other/static/logo.png'
  // #endif

  switch (type) {
    case ShareType.EXHIBITION:
      return {
        title: data.title ? `【${data.title}】精彩展览，邀您共赏` : '精彩展览，邀您共赏',
        path: `/pages/exhibition/detail?id=${data.id}`,
        imageUrl: data.coverImage ? getImageUrl(data.coverImage) : baseUrl,
        query: `id=${data.id}`
      }

    case ShareType.ARTWORK:
      return {
        title: data.title ? `【${data.title}】精美作品，值得一看` : '精美作品，值得一看',
        path: `/pages/artwork/detail?id=${data.id}`,
        imageUrl: data.coverImage ? getImageUrl(data.coverImage) : baseUrl,
        query: `id=${data.id}`
      }

    case ShareType.ORGANIZER:
      return {
        title: data.unitName ? `【${data.unitName}】专业创办方` : '专业创办方',
        path: `/pages/organizer/detail?id=${data.id}`,
        imageUrl: data.unitLogo ? getImageUrl(data.unitLogo) : baseUrl,
        query: `id=${data.id}`
      }

    case ShareType.USER_PROFILE:
      return {
        title: data.nickName ? `【${data.nickName}】的个人主页` : '用户主页',
        path: `/pages/mine/index?userId=${data.id}`,
        imageUrl: data.avatar ? getImageUrl(data.avatar) : baseUrl,
        query: `userId=${data.id}`
      }

    case ShareType.APP:
    default:
      return {
        title: '书画展览平台 - 发现艺术之美',
        path: '/pages/index/index',
        imageUrl: baseUrl,
        query: ''
      }
  }
}

/**
 * 启用微信小程序分享菜单
 * 在页面 onLoad 中调用
 */
export function enableWechatShare() {
  // #ifdef MP-WEIXIN
  // @ts-ignore
  wx?.showShareMenu?.({
    withShareTicket: false,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  // #endif
}

/**
 * 创建分享按钮配置
 * @param text 按钮文字
 * @param className 样式类名
 * @returns 按钮配置
 */
export function createShareButton(text: string = '分享', className: string = 'share-btn') {
  return {
    text,
    className,
    openType: 'share'
  }
}
