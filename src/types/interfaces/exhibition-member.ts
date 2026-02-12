/**
 * 作品信息接口
 */
export interface IArtwork {
  /** 作品ID */
  id: number
  /** 作品标题 */
  title: string
  /** 作品图片 */
  image: string
  /** 投稿时间 */
  submitTime: string
  /** 作品评分 */
  score: number
  /** 作品状态 */
  status: string
  /** 展览ID */
  exhibitionId: number
}

/**
 * 展览信息接口
 */
export interface IExhibitionInfo {
  /** 展览ID */
  id: number
  /** 展览标题 */
  title: string
  /** 封面图片 */
  coverImage: string
  /** 展览状态 */
  status: string
  /** 浏览数 */
  viewCount: number
  /** 点赞数 */
  likeCount: number
  /** 收藏数 */
  collectCount: number
  /** 作品数 */
  artworkCount: number
}

/**
 * 参展会员信息接口
 */
export interface IExhibitionMember {
  /** 用户ID */
  userId: number
  /** 用户昵称 */
  nickname: string
  /** 用户头像 */
  avatar: string
  /** 用户手机号 */
  phone: string
  /** 最后投稿时间 */
  lastSubmitTime: string
  /** 首次投稿时间 */
  firstSubmitTime: string
  /** 作品列表 */
  artworkList: IArtwork[]
  /** 展览列表 */
  exhibitionList: IExhibitionInfo[]
}

/**
 * 参展会员查询参数接口
 */
export interface IExhibitionMemberQueryParams {
  /** 当前页码 */
  pageNum?: number
  /** 每页显示记录数 */
  pageSize?: number
  /** 创办方ID */
  organizerId?: string
  /** 展览ID */
  exhibitionId?: string
  /** 关键词搜索（昵称、手机号） */
  keyword?: string
  /** 状态筛选 */
  status?: string
  /** 排序字段 */
  orderByColumn?: string
  /** 排序方式 */
  isAsc?: string
}

// 导入通用接口
import type { TableDataInfo } from './common'

/**
 * 参展会员分页结果接口
 */
export type IExhibitionMemberPageResult = TableDataInfo<IExhibitionMember>

/**
 * 参展会员审核参数接口
 */
export interface IExhibitionMemberReviewParams {
  /** 会员ID */
  id: string
  /** 审核状态 */
  status: 'approved' | 'rejected'
  /** 审核备注 */
  note?: string
}
