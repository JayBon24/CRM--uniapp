/**
 * 展览表单数据接口
 * 用于创建和编辑展览时的表单数据管理
 */

import type { ExhibitionType, ExhibitionStatus } from './exhibition'

/**
 * 展览表单数据接口
 */
export interface ExhibitionFormData {
  // 基本信息
  title: string // 展览标题
  type: ExhibitionType // 展览类型
  description: string // 展览描述
  coverImage: string // 封面图片地址
  submissionDeadline: string // 征稿截止日期
  maxParticipants: number // 最大参与人数
  organizerId: string | null // 主办方ID
}

/**
 * 展览表单默认值
 */
export const defaultExhibitionFormData: ExhibitionFormData = {
  // 基本信息
  title: '',
  type: 'mixed',
  description: '',
  coverImage: '',
  submissionDeadline: '',
  maxParticipants: 1,
  organizerId: null,

}

/**
 * 展览类型选项
 */
export const exhibitionTypeOptions = [
  { label: '书画展览', value: 'calligraphy' as ExhibitionType },
  { label: '绘画展览', value: 'painting' as ExhibitionType },
  { label: '篆刻展览', value: 'seal' as ExhibitionType },
  { label: '综合展览', value: 'mixed' as ExhibitionType }
]

/**
 * 评选模式选项
 */
export const evaluationModeOptions = [
  { label: '一次评选', value: 'single' as const },
  { label: '二次评选', value: 'double' as const }
]

/**
 * 可见性选项
 */
export const visibilityOptions = [
  { label: '公开', value: 'public' as const },
  { label: '私密', value: 'private' as const },
  { label: '仅参与者可见', value: 'participant' as const }
]

/**
 * 分数可见性选项
 */
export const scoreVisibilityOptions = [
  { label: '公开', value: 'public' as const },
  { label: '私密', value: 'private' as const },
  { label: '仅评委可见', value: 'judge' as const }
]

/**
 * 投稿方式选项
 */
export const submissionTypeOptions = [
  { label: '在线投稿', value: 'online' as const },
  { label: '线下投稿', value: 'offline' as const },
  { label: '线上线下', value: 'both' as const }
]
