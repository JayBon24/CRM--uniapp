// 导入通用接口
import type { SortOption, TableDataInfo, AjaxResult } from './common'

/**
 * 展览信息接口
 */
export interface Exhibition {
  id: string
  title: string
  type: ExhibitionType
  description: string
  coverImage: string
  startTime: string
  endTime: string
  address: string
  detailAddress: string
  isPublic: boolean
  needReview: boolean
  maxParticipants: number
  currentParticipants: number
  status: ExhibitionStatus
  evaluationMode: 'single' | 'double' // 评选模式：一次评选或二次评选
  currentStage: 'first' | 'final' // 当前评选阶段
  evaluationStatus?: 'primary' | 'secondary' // 当前评选阶段
  creatorId: string
  creatorName: string
  creatorAvatar: string
  createTime: string
  updateTime: string
  viewCount: number
  likeCount: number
  collectCount: number
  // Mock数据中使用的额外字段
  startDate?: string
  endDate?: string
  deadline?: string
  submissionDeadline?: string // 征稿截止日期
  organizer?: string
  organizerId?: number
  artworkCount?: number
  submissionCount?: number
  entryFee?: number
  prizePool?: number
  clickCount?: number
  commentCount?: number
  isCollected?: boolean
  isLiked?: boolean
  submissionType?: string
  standardVisibility?: string
  scoreVisibility?: string
  judgeIdentity?: string
  commentVisibility?: string
  publicationType?: string
  scoreDistribution?: string
  maxSubmissionsPerUser?: number
  judgeSubmitRule?: string
  normalStandards?: Array<{
    id: string
    name: string
    description: string
    maxScore: number
    weight: number
    percentage: number
  }>
  // 地区信息字段
  provinceCode?: string
  cityCode?: string
  countyCode?: string
  provinceName?: string
  cityName?: string
  countyName?: string
  // 评选进度（二次评选时使用）
  primaryStatus?: 'pending' | 'in_progress' | 'completed'
  secondaryStatus?: 'pending' | 'in_progress' | 'completed'
  primaryTotal?: number
  primaryScored?: number
  primaryPassed?: number
  secondaryTotal?: number
  secondaryScored?: number
  secondaryPassed?: number
}

/**
 * 展览类型
 */
export type ExhibitionType = 'calligraphy' | 'painting' | 'seal' | 'mixed'

/**
 * 展览状态
 */
export type ExhibitionStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'ongoing' | 'ended' | 'cancelled' | 'submitting' | 'statistics' | 'reviewing' | 'published'

/**
 * 创建展览参数
 */
export interface CreateExhibitionParams {
  title: string
  type: ExhibitionType
  description: string
  startTime: string
  endTime: string
  address: string
  detailAddress?: string
  isPublic: boolean
  needReview: boolean
  maxParticipants?: number
  coverImage?: string
}

/**
 * 更新展览参数
 */
export interface UpdateExhibitionParams extends Partial<CreateExhibitionParams> {
  id: string
}

/**
 * 展览列表查询参数
 */
export interface ExhibitionListParams {
  pageNum?: number
  pageSize?: number
  type?: ExhibitionType
  status?: ExhibitionStatus
  keyword?: string
  city?: string
  region?: string
  sortBy?: 'createTime' | 'startTime' | 'viewCount' | 'likeCount'
  sortOrder?: 'asc' | 'desc'
}

/**
 * 展览详情响应
 */
export interface ExhibitionDetailResponse {
  exhibition: Exhibition
  isCreator: boolean
  isParticipant: boolean
  isLiked: boolean
  isCollected: boolean
}

/**
 * 展览统计数据
 */
export interface ExhibitionStats {
  totalCount: number
  ongoingCount: number
  upcomingCount: number
  endedCount: number
  myCreatedCount: number
  myParticipatedCount: number
}

/**
 * 展览类型选项
 */
export const ExhibitionTypeOptions = [
  { label: '书画展览', value: 'calligraphy' },
  { label: '绘画展览', value: 'painting' },
  { label: '篆刻展览', value: 'seal' },
  { label: '综合展览', value: 'mixed' }
]

/**
 * 展览状态选项
 */
export const ExhibitionStatusOptions = [
  { label: '草稿', value: 'draft' },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '进行中', value: 'ongoing' },
  { label: '已结束', value: 'ended' },
  { label: '已取消', value: 'cancelled' }
]

/**
 * 展览状态文本映射
 */
export const ExhibitionStatusText: Record<ExhibitionStatus, string> = {
  draft: '草稿',
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
  ongoing: '进行中',
  ended: '已结束',
  cancelled: '已取消',
  submitting: '征稿中',
  statistics: '统计中',
  reviewing: '评审中',
  published: '已发布'
}

/**
 * 展览状态颜色映射
 */
export const ExhibitionStatusColor: Record<ExhibitionStatus, string> = {
  draft: '#999',
  pending: '#ffa500',
  approved: '#52c41a',
  rejected: '#ff4d4f',
  ongoing: '#1890ff',
  ended: '#666',
  cancelled: '#ff4d4f',
  submitting: '#1890ff',
  statistics: '#722ed1',
  reviewing: '#fa8c16',
  published: '#52c41a'
}

/**
 * 展览类型文本映射
 */
export const ExhibitionTypeText: Record<ExhibitionType, string> = {
  calligraphy: '书画展览',
  painting: '绘画展览',
  seal: '篆刻展览',
  mixed: '综合展览'
}

/**
 * 展览类型颜色映射
 */
export const ExhibitionTypeColor: Record<ExhibitionType, string> = {
  calligraphy: '#722ed1',
  painting: '#13c2c2',
  seal: '#fa8c16',
  mixed: '#eb2f96'
}

/**
 * 城市信息接口
 */
export interface City {
  id: string
  name: string
  code: string
  sort?: number
}

/**
 * 区域信息接口
 */
export interface Region {
  id: string
  name: string
  code: string
  cityCode: string
  sort?: number
}

/**
 * 展览筛选参数
 */
export interface ExhibitionFilter {
  cityCode?: string
  regionCode?: string
  status?: ExhibitionStatus
  sortBy?: string
  page?: number
  pageSize?: number
}

// API接口类型别名 - 为了保持向后兼容
export type IExhibition = Exhibition
export type ICreateExhibitionParams = CreateExhibitionParams
export type IUpdateExhibitionParams = UpdateExhibitionParams
export type IExhibitionQueryParams = ExhibitionListParams
export type IExhibitionDetailResponse = AjaxResult<Exhibition>
export type IExhibitionListResponse = TableDataInfo<Exhibition>
export type IExhibitionPageResult = TableDataInfo<Exhibition>
