/**
 * 作品类型定义
 * 说明：该类型与 Mock 数据结构保持一致，便于在页面中获得完整的类型提示
 */
export interface Artwork {
  /** 作品ID */
  id: string
  /** 作品标题 */
  title: string
  /** 艺术家名称（可选） */
  authorName?: string
  /** 作品图片地址（使用全局 $getImageUrl 处理） */
  image: string
  /** 作品描述（可选） */
  description?: string
  /** 投稿时间（可选） */
  submitTime?: string
  /** 评分（可选） */
  score?: number
  /** 评论数量（可选） */
  commentCount?: number
  /** 点赞数量（可选） */
  likeCount?: number
  /** 收藏数量（可选） */
  collectCount?: number
  /** 所属展览ID（可选） */
  exhibitionId?: string
  /** 所属展览名称（可选） */
  exhibitionName?: string
  /** 所属展览封面（可选） */
  exhibitionCover?: string
  /** 状态（submitted/reviewing/selected/rejected 等，可选） */
  status?: string
  /** 浏览量（部分页面使用，可选） */
  viewCount?: number
  /** 作品高度（cm，可选） */
  height?: number
  /** 作品宽度（cm，可选） */
  width?: number
  /** 作品编号（可选） */
  artworkNo?: string
}

/**
 * 作品列表查询参数
 */
export interface ArtworkListParams {
  /** 当前页码 */
  pageNum?: number
  /** 每页显示记录数 */
  pageSize?: number
  /** 展览ID */
  exhibitionId?: string
  /** 状态筛选 */
  status?: string
  /** 关键词搜索 */
  keyword?: string
  /** 排序列 */
  orderByColumn?: string
  /** 排序方式 */
  isAsc?: 'asc' | 'desc'
}

/**
 * 作品评论
 */
export interface ArtworkComment {
  /** 评论ID */
  id: string
  /** 作品ID */
  artworkId: string
  /** 用户ID */
  userId: string
  /** 用户昵称 */
  userName: string
  /** 用户头像 */
  userAvatar: string
  /** 评论内容 */
  content: string
  /** 评论时间 */
  createTime: string
  /** 点赞数量 */
  likeCount?: number
  /** 是否已点赞 */
  isLiked?: boolean
}

/**
 * 创建评论参数
 */
export interface CreateCommentParams {
  /** 评论内容 */
  content: string
}

/**
 * 评分详情
 */
export interface ScoreDetail {
  /** 评分项ID */
  id: string
  /** 评分项名称 */
  name: string
  /** 分数 */
  score: number
  /** 权重 */
  weight: number
  /** 拒绝原因 */
  rejectReason?: string
  /** 加权分数 */
  weightedScore: number
}

/**
 * 评委评分数据
 */
export interface JudgeScore {
  /** 评分ID */
  id: string
  /** 展览ID */
  exhibitionId: string
  /** 作品ID */
  artworkId: string
  /** 用户ID */
  userId: number
  /** 阶段 */
  stage: string
  /** 状态 */
  status?: string
  /** 总分 */
  totalScore: {
    source: string
    parsedValue: number
  }
  /** 加权分数 */
  weightedScore: number
  /** 评分详情 */
  scoreDetails: ScoreDetail[]
  /** 评论 */
  comment?: string
  /** 评分时间 */
  scoreTime: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 用户信息 */
  userInfo: {
    userId: number
    nickName: string
    avatar: string
  }
}

/**
 * 作品状态枚举
 */
export enum ArtworkStatus {
  /** 已提交 */
  SUBMITTED = 'submitted',
  /** 审核中 */
  REVIEWING = 'reviewing',
  /** 已通过 */
  SELECTED = 'selected',
  /** 已拒绝 */
  REJECTED = 'rejected'
}

/**
 * 作品状态选项
 */
export const ArtworkStatusOptions = [
  { label: '已提交', value: ArtworkStatus.SUBMITTED },
  { label: '审核中', value: ArtworkStatus.REVIEWING },
  { label: '已通过', value: ArtworkStatus.SELECTED },
  { label: '已拒绝', value: ArtworkStatus.REJECTED }
]
