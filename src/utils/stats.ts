/**
 * 统计信息处理工具函数
 * 确保统计数据在任何情况下都有默认值0
 */

/**
 * 安全地处理用户统计数据
 * @param data - API响应的统计数据
 * @returns 处理后的统计数据，确保所有字段都为数字
 */
export function safeUserStats(data: any) {
  if (!data || typeof data !== 'object') {
    return getDefaultUserStats()
  }

  return {
    createdCount: Number(data.createdCount) || 0,
    participatedCount: Number(data.participatedCount) || 0,
    artworkCount: Number(data.artworkCount) || 0,
    collectCount: Number(data.collectCount) || 0,
    followerCount: Number(data.followerCount) || 0,
    followingCount: Number(data.followingCount) || 0,
    totalLikes: Number(data.totalLikes) || 0,
    totalViews: Number(data.totalViews) || 0
  }
}

/**
 * 获取默认的用户统计数据
 * @returns 所有字段都为0的用户统计数据
 */
export function getDefaultUserStats() {
  return {
    createdCount: 0,
    participatedCount: 0,
    artworkCount: 0,
    collectCount: 0,
    followerCount: 0,
    followingCount: 0,
    totalLikes: 0,
    totalViews: 0
  }
}

/**
 * 安全地处理展览统计数据
 * @param data - API响应的展览统计数据
 * @returns 处理后的展览统计数据，确保所有字段都为数字
 */
export function safeExhibitionStats(data: any) {
  if (!data || typeof data !== 'object') {
    return getDefaultExhibitionStats()
  }

  return {
    viewCount: Number(data.viewCount) || 0,
    likeCount: Number(data.likeCount) || 0,
    collectCount: Number(data.collectCount) || 0,
    artworkCount: Number(data.artworkCount) || 0,
    submissionCount: Number(data.submissionCount) || 0,
    participantCount: Number(data.participantCount) || 0,
    commentCount: Number(data.commentCount) || 0
  }
}

/**
 * 获取默认的展览统计数据
 * @returns 所有字段都为0的展览统计数据
 */
export function getDefaultExhibitionStats() {
  return {
    viewCount: 0,
    likeCount: 0,
    collectCount: 0,
    artworkCount: 0,
    submissionCount: 0,
    participantCount: 0,
    commentCount: 0
  }
}

/**
 * 安全地处理作品统计数据
 * @param data - API响应的作品统计数据
 * @returns 处理后的作品统计数据，确保所有字段都为数字
 */
export function safeArtworkStats(data: any) {
  if (!data || typeof data !== 'object') {
    return getDefaultArtworkStats()
  }

  return {
    viewCount: Number(data.viewCount) || 0,
    likeCount: Number(data.likeCount) || 0,
    collectCount: Number(data.collectCount) || 0,
    commentCount: Number(data.commentCount) || 0,
    shareCount: Number(data.shareCount) || 0,
    score: Number(data.score) || 0,
    scoreCount: Number(data.scoreCount) || 0
  }
}

/**
 * 获取默认的作品统计数据
 * @returns 所有字段都为0的作品统计数据
 */
export function getDefaultArtworkStats() {
  return {
    viewCount: 0,
    likeCount: 0,
    collectCount: 0,
    commentCount: 0,
    shareCount: 0,
    score: 0,
    scoreCount: 0
  }
}

/**
 * 安全地处理收藏统计数据
 * @param data - API响应的收藏统计数据
 * @returns 处理后的收藏统计数据，确保所有字段都为数字
 */
export function safeCollectionStats(data: any) {
  if (!data || typeof data !== 'object') {
    return getDefaultCollectionStats()
  }

  return {
    exhibitionCount: Number(data.exhibitionCount) || 0,
    artworkCount: Number(data.artworkCount) || 0,
    userCount: Number(data.userCount) || 0,
    totalCount: Number(data.totalCount) || 0
  }
}

/**
 * 获取默认的收藏统计数据
 * @returns 所有字段都为0的收藏统计数据
 */
export function getDefaultCollectionStats() {
  return {
    exhibitionCount: 0,
    artworkCount: 0,
    userCount: 0,
    totalCount: 0
  }
}

/**
 * 格式化统计数字显示
 * @param num - 数字
 * @param defaultValue - 默认值，当num无效时使用
 * @returns 格式化后的字符串
 */
export function formatStatsNumber(num: any, defaultValue: number = 0): string {
  const number = Number(num) || defaultValue

  if (number >= 10000) {
    return (number / 10000).toFixed(1) + 'w'
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'k'
  } else {
    return number.toString()
  }
}

/**
 * 验证统计数据的完整性
 * @param data - 统计数据对象
 * @param requiredFields - 必需的字段数组
 * @returns 是否有效
 */
export function validateStatsData(data: any, requiredFields: string[]): boolean {
  if (!data || typeof data !== 'object') {
    return false
  }

  return requiredFields.every(field => {
    const value = data[field]
    return value !== undefined && value !== null && !isNaN(Number(value))
  })
}

/**
 * 日志统计数据的加载状态
 * @param module - 模块名称
 * @param success - 是否成功
 * @param data - 数据
 * @param error - 错误信息
 */
export function logStatsLoading(module: string, success: boolean, data?: any, error?: any) {
  if (success) {
    console.log(`${module}统计数据加载成功:`, data)
  } else {
    console.error(`${module}统计数据加载失败:`, error)
    console.log(`${module}统计数据已使用默认值`)
  }
}
