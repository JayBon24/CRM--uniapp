/**
 * 评选系统相关类型定义
 */

/**
 * 评选模式
 */
export type EvaluationMode = 'single' | 'double'

/**
 * 评选阶段
 */
export type EvaluationStage = 'primary' | 'secondary' | 'final'

/**
 * 评选状态
 */
export type EvaluationStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

/**
 * 评委角色
 */
export type JudgeRole = 'first_judge' | 'final_judge' | 'chief_judge'

/**
 * 评分标准类型
 */
export type ScoringCriteriaType = 'score' | 'reject'

/**
 * 展览评选配置
 */
export interface ExhibitionEvaluationConfig {
  id: string
  exhibitionId: string
  evaluationMode: EvaluationMode // 评选模式：一次评选或二次评选
  primaryStageConfig: PrimaryStageConfig // 初选阶段配置
  secondaryStageConfig?: SecondaryStageConfig // 复选阶段配置（二次评选时）
  currentStage: EvaluationStage // 当前评选阶段
  status: EvaluationStatus // 评选状态
  createTime: string
  updateTime: string
}

/**
 * 初选阶段配置
 */
export interface PrimaryStageConfig {
  id: string
  stageName: string
  stageDescription: string
  startTime: string
  endTime: string
  judgeGroupConfig: JudgeGroupConfig // 评委组配置
  scoringCriteria: ScoringCriteria[] // 评分标准
  status: EvaluationStatus
}

/**
 * 复选阶段配置
 */
export interface SecondaryStageConfig {
  id: string
  stageName: string
  stageDescription: string
  startTime: string
  endTime: string
  judgeGroupConfig: JudgeGroupConfig // 评委组配置
  scoringCriteria: ScoringCriteria[] // 评分标准
  status: EvaluationStatus
}

/**
 * 评委组配置
 */
export interface JudgeGroupConfig {
  id: string
  groupName: string
  groupDescription: string
  judgeRoles: JudgeRole[] // 支持的评委角色
  judges: Judge[] // 评委列表
  createTime: string
  updateTime: string
}

/**
 * 评委信息
 */
export interface Judge {
  id: number
  userId: number
  userName: string
  userAvatar: string
  role: JudgeRole // 评委角色
  expertise: string[] // 专业领域
  experience: string // 经验描述
  isActive: boolean // 是否激活
  joinTime: string
}

/**
 * 评分标准
 */
export interface ScoringCriteria {
  id: string
  exhibitionId?: string
  name: string
  description: string
  type: ScoringCriteriaType // 评分标准类型：分数型或否决型
  maxScore: number // 满分
  minScore: number // 最低分
  weight: number // 权重百分比
  sortOrder?: number // 排序顺序
  isRequired: boolean // 是否必填
  stage: EvaluationStage[] // 适用阶段
  rejectReasons?: string[] // 否决理由列表（否决型标准使用）
  isEnabled: boolean // 是否启用（必填属性）
  createTime?: string
  updateTime?: string
}

/**
 * 作品评分记录
 */
export interface WorkScore {
  id: string
  exhibitionId: string
  workId: string
  userId: number // 评委用户ID
  stage: EvaluationStage // 评选阶段
  totalScore: number // 总分
  weightedScore: number // 加权总分
  scoreDetails: string // 各项评分详情（JSON格式）
  comment: string // 评语
  scoreTime: string
  createTime: string
  updateTime: string
}

/**
 * 标准得分
 */
export interface CriteriaScore {
  criteriaId: string
  criteriaName: string
  score: number
  weight: number
  weightedScore: number
}

/**
 * 评选结果
 */
export interface EvaluationResult {
  id: string
  exhibitionId: string
  workId: string
  workTitle: string
  workImage: string
  primaryStageScore?: number // 初选得分
  secondaryStageScore?: number // 复选得分
  finalScore: number // 最终得分
  primaryStageRank?: number // 初选排名
  secondaryStageRank?: number // 复选排名
  finalRank: number // 最终排名
  isPassed: boolean // 是否通过
  stage: EvaluationStage // 当前阶段
  createTime: string
  updateTime: string
}

/**
 * 创建评选配置参数
 */
export interface CreateEvaluationConfigParams {
  exhibitionId: string
  evaluationMode: EvaluationMode
  primaryStageConfig: Omit<PrimaryStageConfig, 'id' | 'status'>
  secondaryStageConfig?: Omit<SecondaryStageConfig, 'id' | 'status'>
}

/**
 * 更新评选配置参数
 */
export interface UpdateEvaluationConfigParams extends Partial<CreateEvaluationConfigParams> {
  id: string
}

/**
 * 评委组查询参数
 */
export interface JudgeGroupQueryParams {
  pageNum?: number
  pageSize?: number
  groupName?: string
  judgeRole?: JudgeRole
  isActive?: boolean
}

/**
 * 评分记录查询参数
 */
export interface WorkScoreQueryParams {
  pageNum?: number
  pageSize?: number
  exhibitionId?: string
  workId?: string
  judgeId?: string
  stage?: EvaluationStage
}

/**
 * 评选结果查询参数
 */
export interface EvaluationResultQueryParams {
  pageNum?: number
  pageSize?: number
  exhibitionId?: string
  stage?: EvaluationStage
  isPassed?: boolean
  sortBy?: 'finalScore' | 'finalRank' | 'createTime'
  sortOrder?: 'asc' | 'desc'
}

/**
 * 评选模式选项
 */
export const EvaluationModeOptions = [
  { label: '一次评选', value: 'single' },
  { label: '二次评选', value: 'double' }
]

/**
 * 评选阶段选项
 */
export const EvaluationStageOptions = [
  { label: '初选', value: 'primary' },
  { label: '复选', value: 'secondary' },
  { label: '最终结果', value: 'final' }
]

/**
 * 评选状态选项
 */
export const EvaluationStatusOptions = [
  { label: '待开始', value: 'pending' },
  { label: '进行中', value: 'in_progress' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

/**
 * 评委角色选项
 */
export const JudgeRoleOptions = [
  { label: '初选评委', value: 'first_judge' },
  { label: '复选评委', value: 'final_judge' },
  { label: '首席评委', value: 'chief_judge' }
]

/**
 * 评分标准类型选项
 */
export const ScoringCriteriaTypeOptions = [
  { label: '分数型', value: 'score' },
  { label: '否决型', value: 'reject' }
]

/**
 * 评选状态文本映射
 */
export const EvaluationStatusText: Record<EvaluationStatus, string> = {
  pending: '待开始',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消'
}

/**
 * 评选状态颜色映射
 */
export const EvaluationStatusColor: Record<EvaluationStatus, string> = {
  pending: '#999',
  in_progress: '#1890ff',
  completed: '#52c41a',
  cancelled: '#ff4d4f'
}

/**
 * 评选阶段文本映射
 */
export const EvaluationStageText: Record<EvaluationStage, string> = {
  primary: '初选',
  secondary: '复选',
  final: '最终结果'
}

/**
 * 评委角色文本映射
 */
export const JudgeRoleText: Record<JudgeRole, string> = {
  first_judge: '初选评委',
  final_judge: '复选评委',
  chief_judge: '首席评委'
}
