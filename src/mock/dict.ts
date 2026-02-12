/**
 * 字典模块 Mock 数据
 * 包含系统字典数据的获取和管理
 */

import type { MockHandler } from './utils'
import {
  createMockResponse,
  createMockError,
  MockErrorCode,
  validateRequiredParams
} from './utils'

// 字典数据接口
interface DictData {
  dictCode: number
  dictSort: number
  dictLabel: string
  dictValue: string
  dictType: string
  cssClass: string
  listClass: string
  isDefault: string
  status: string
  remark: string
  createTime: string
}

// 模拟字典数据
const mockDictData: DictData[] = [
  // 展览状态
  {
    dictCode: 101,
    dictSort: 1,
    dictLabel: '建档中',
    dictValue: 'draft',
    dictType: 'exhibition_status',
    cssClass: '',
    listClass: 'info',
    isDefault: 'Y',
    status: '0',
    remark: '展览信息建档阶段',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 作品分数分布方式（默认公开/不公开）
  {
    dictCode: 30,
    dictSort: 1,
    dictLabel: '默认公开',
    dictValue: 'public',
    dictType: 'exhibition_score_distribution',
    cssClass: '',
    listClass: 'success',
    isDefault: 'Y',
    status: '0',
    remark: '作品分数分布默认公开',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 31,
    dictSort: 2,
    dictLabel: '不公开',
    dictValue: 'private',
    dictType: 'exhibition_score_distribution',
    cssClass: '',
    listClass: 'warning',
    isDefault: 'N',
    status: '0',
    remark: '作品分数分布不公开',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 102,
    dictSort: 2,
    dictLabel: '征稿中',
    dictValue: 'submitting',
    dictType: 'exhibition_status',
    cssClass: '',
    listClass: 'primary',
    isDefault: 'N',
    status: '0',
    remark: '开放用户投稿阶段',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 103,
    dictSort: 3,
    dictLabel: '统计中',
    dictValue: 'statistics',
    dictType: 'exhibition_status',
    cssClass: '',
    listClass: 'warning',
    isDefault: 'N',
    status: '0',
    remark: '停止投稿，整理作品信息',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 104,
    dictSort: 4,
    dictLabel: '评选中',
    dictValue: 'reviewing',
    dictType: 'exhibition_status',
    cssClass: '',
    listClass: 'success',
    isDefault: 'N',
    status: '0',
    remark: '开始评选流程阶段',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 105,
    dictSort: 5,
    dictLabel: '公布展示',
    dictValue: 'published',
    dictType: 'exhibition_status',
    cssClass: '',
    listClass: 'success',
    isDefault: 'N',
    status: '0',
    remark: '评选完成，公布结果',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 展览标准可见性
  {
    dictCode: 1,
    dictSort: 1,
    dictLabel: '公开',
    dictValue: 'public',
    dictType: 'exhibition_standard_visibility',
    cssClass: '',
    listClass: 'success',
    isDefault: 'Y',
    status: '0',
    remark: '标准公开可见',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 2,
    dictSort: 2,
    dictLabel: '私密',
    dictValue: 'private',
    dictType: 'exhibition_standard_visibility',
    cssClass: '',
    listClass: 'info',
    isDefault: 'N',
    status: '0',
    remark: '标准私密不可见',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 3,
    dictSort: 3,
    dictLabel: '仅参与者可见',
    dictValue: 'participant',
    dictType: 'exhibition_standard_visibility',
    cssClass: '',
    listClass: 'warning',
    isDefault: 'N',
    status: '0',
    remark: '仅展览参与者可见',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 展览评分可见性
  {
    dictCode: 4,
    dictSort: 1,
    dictLabel: '公开',
    dictValue: 'public',
    dictType: 'exhibition_score_visibility',
    cssClass: '',
    listClass: 'success',
    isDefault: 'Y',
    status: '0',
    remark: '评分公开可见',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 5,
    dictSort: 2,
    dictLabel: '私密',
    dictValue: 'private',
    dictType: 'exhibition_score_visibility',
    cssClass: '',
    listClass: 'info',
    isDefault: 'N',
    status: '0',
    remark: '评分私密不可见',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 6,
    dictSort: 3,
    dictLabel: '仅评委可见',
    dictValue: 'judge',
    dictType: 'exhibition_score_visibility',
    cssClass: '',
    listClass: 'warning',
    isDefault: 'N',
    status: '0',
    remark: '仅评委可见评分',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 评委身份
  {
    dictCode: 7,
    dictSort: 1,
    dictLabel: '公开',
    dictValue: 'public',
    dictType: 'exhibition_judge_identity',
    cssClass: '',
    listClass: 'success',
    isDefault: 'Y',
    status: '0',
    remark: '评委身份公开',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 8,
    dictSort: 2,
    dictLabel: '匿名',
    dictValue: 'anonymous',
    dictType: 'exhibition_judge_identity',
    cssClass: '',
    listClass: 'info',
    isDefault: 'N',
    status: '0',
    remark: '评委身份匿名',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 评论可见性
  {
    dictCode: 9,
    dictSort: 1,
    dictLabel: '公开',
    dictValue: 'public',
    dictType: 'exhibition_comment_visibility',
    cssClass: '',
    listClass: 'success',
    isDefault: 'Y',
    status: '0',
    remark: '评论公开可见',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 10,
    dictSort: 2,
    dictLabel: '私密',
    dictValue: 'private',
    dictType: 'exhibition_comment_visibility',
    cssClass: '',
    listClass: 'info',
    isDefault: 'N',
    status: '0',
    remark: '评论私密不可见',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 11,
    dictSort: 3,
    dictLabel: '仅参与者可见',
    dictValue: 'participant',
    dictType: 'exhibition_comment_visibility',
    cssClass: '',
    listClass: 'warning',
    isDefault: 'N',
    status: '0',
    remark: '仅展览参与者可见评论',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 作品公布方式（仅公开/不公开）
  {
    dictCode: 12,
    dictSort: 1,
    dictLabel: '公开',
    dictValue: 'public',
    dictType: 'exhibition_publication_type',
    cssClass: '',
    listClass: 'success',
    isDefault: 'Y',
    status: '0',
    remark: '作品公布：公开',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 13,
    dictSort: 2,
    dictLabel: '不公开',
    dictValue: 'private',
    dictType: 'exhibition_publication_type',
    cssClass: '',
    listClass: 'warning',
    isDefault: 'N',
    status: '0',
    remark: '作品公布：不公开',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 投稿类型
  {
    dictCode: 14,
    dictSort: 1,
    dictLabel: '在线投稿',
    dictValue: 'online',
    dictType: 'exhibition_submission_type',
    cssClass: '',
    listClass: 'success',
    isDefault: 'Y',
    status: '0',
    remark: '支持在线投稿',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 15,
    dictSort: 2,
    dictLabel: '线下投稿',
    dictValue: 'offline',
    dictType: 'exhibition_submission_type',
    cssClass: '',
    listClass: 'info',
    isDefault: 'N',
    status: '0',
    remark: '仅支持线下投稿',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 16,
    dictSort: 3,
    dictLabel: '线上线下',
    dictValue: 'both',
    dictType: 'exhibition_submission_type',
    cssClass: '',
    listClass: 'primary',
    isDefault: 'N',
    status: '0',
    remark: '支持线上线下',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 用户性别
  {
    dictCode: 17,
    dictSort: 1,
    dictLabel: '男',
    dictValue: '0',
    dictType: 'sys_user_sex',
    cssClass: '',
    listClass: 'primary',
    isDefault: 'Y',
    status: '0',
    remark: '男性',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 18,
    dictSort: 2,
    dictLabel: '女',
    dictValue: '1',
    dictType: 'sys_user_sex',
    cssClass: '',
    listClass: 'success',
    isDefault: 'N',
    status: '0',
    remark: '女性',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 19,
    dictSort: 3,
    dictLabel: '未知',
    dictValue: '2',
    dictType: 'sys_user_sex',
    cssClass: '',
    listClass: 'info',
    isDefault: 'N',
    status: '0',
    remark: '未知性别',
    createTime: '2024-01-01T10:00:00.000Z'
  }
  ,
  // 评选模式（新增字典）
  {
    dictCode: 20,
    dictSort: 1,
    dictLabel: '一次评选',
    dictValue: 'single',
    dictType: 'exhibition_evaluation_mode',
    cssClass: '',
    listClass: 'success',
    isDefault: 'Y',
    status: '0',
    remark: '一次评选模式',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 21,
    dictSort: 2,
    dictLabel: '二次评选',
    dictValue: 'double',
    dictType: 'exhibition_evaluation_mode',
    cssClass: '',
    listClass: 'primary',
    isDefault: 'N',
    status: '0',
    remark: '二次评选模式',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 评选阶段状态
  {
    dictCode: 22,
    dictSort: 1,
    dictLabel: '待开始',
    dictValue: 'pending',
    dictType: 'evaluation_stage_status',
    cssClass: '',
    listClass: 'warning',
    isDefault: 'Y',
    status: '0',
    remark: '评选阶段待开始',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 23,
    dictSort: 2,
    dictLabel: '进行中',
    dictValue: 'in_progress',
    dictType: 'evaluation_stage_status',
    cssClass: '',
    listClass: 'primary',
    isDefault: 'N',
    status: '0',
    remark: '评选阶段进行中',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 24,
    dictSort: 3,
    dictLabel: '已完成',
    dictValue: 'completed',
    dictType: 'evaluation_stage_status',
    cssClass: '',
    listClass: 'success',
    isDefault: 'N',
    status: '0',
    remark: '评选阶段已完成',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 评选阶段
  {
    dictCode: 25,
    dictSort: 1,
    dictLabel: '初评',
    dictValue: 'primary',
    dictType: 'evaluation_stage',
    cssClass: '',
    listClass: 'primary',
    isDefault: 'N',
    status: '0',
    remark: '初评阶段',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 26,
    dictSort: 2,
    dictLabel: '复评',
    dictValue: 'secondary',
    dictType: 'evaluation_stage',
    cssClass: '',
    listClass: 'success',
    isDefault: 'N',
    status: '0',
    remark: '复评阶段',
    createTime: '2024-01-01T10:00:00.000Z'
  },

  // 展览参与状态
  {
    dictCode: 27,
    dictSort: 1,
    dictLabel: '已投稿',
    dictValue: 'submitted',
    dictType: 'exhibition_participation_status',
    cssClass: '',
    listClass: 'primary',
    isDefault: 'Y',
    status: '0',
    remark: '已投稿作品',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 28,
    dictSort: 2,
    dictLabel: '评审中',
    dictValue: 'reviewing',
    dictType: 'exhibition_participation_status',
    cssClass: '',
    listClass: 'warning',
    isDefault: 'N',
    status: '0',
    remark: '作品评审中',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 29,
    dictSort: 3,
    dictLabel: '已通过',
    dictValue: 'approved',
    dictType: 'exhibition_participation_status',
    cssClass: '',
    listClass: 'success',
    isDefault: 'N',
    status: '0',
    remark: '作品已通过评审',
    createTime: '2024-01-01T10:00:00.000Z'
  },
  {
    dictCode: 28,
    dictSort: 4,
    dictLabel: '未通过',
    dictValue: 'rejected',
    dictType: 'exhibition_participation_status',
    cssClass: '',
    listClass: 'error',
    isDefault: 'N',
    status: '0',
    remark: '作品未通过评审',
    createTime: '2024-01-01T10:00:00.000Z'
  }
]

// Mock 处理函数

/**
 * 根据字典类型获取字典数据
 */
function mockGetDictsByType(params: any) {
  const { dictType } = params

  if (!dictType) {
    return createMockError(MockErrorCode.BAD_REQUEST, '字典类型不能为空')
  }

  const dictList = mockDictData.filter(item => item.dictType === dictType)

  // 使用新的响应格式，返回rows字段
  return {
    code: MockErrorCode.SUCCESS,
    msg: '操作成功',
    rows: dictList
  }
}

/**
 * 获取字典数据列表
 */
function mockGetDictDataList(params: any) {
  const { dictType, dictLabel, status, pageNum = 1, pageSize = 10 } = params

  let result = [...mockDictData]

  // 字典类型过滤
  if (dictType) {
    result = result.filter(item => item.dictType === dictType)
  }

  // 字典标签过滤
  if (dictLabel) {
    result = result.filter(item => item.dictLabel.includes(dictLabel))
  }

  // 状态过滤
  if (status !== undefined && status !== '') {
    result = result.filter(item => item.status === status)
  }

  // 分页处理
  const total = result.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = result.slice(start, end)

  return createMockResponse({
    rows,
    total
  })
}

/**
 * 获取字典数据详情
 */
function mockGetDictDataDetail(params: any) {
  const { dictCode } = params

  if (!dictCode) {
    return createMockError(MockErrorCode.BAD_REQUEST, '字典编码不能为空')
  }

  const dictData = mockDictData.find(item => item.dictCode === Number(dictCode))

  if (!dictData) {
    return createMockError(MockErrorCode.NOT_FOUND, '字典数据不存在')
  }

  return createMockResponse(dictData)
}

// 导出 Mock 处理器
export default [
  {
    url: '/system/dict/data/type/:dictType',
    method: 'GET',
    response: (params: any, url?: string) => {
      // 中文注释：优先从路径参数中解析 dictType，其次尝试从params中读取
      const dictTypeFromUrl = url ? url.split('/').pop() : undefined
      const dictType = params?.dictType || dictTypeFromUrl
      console.log('字典类型请求:', dictType)

      if (!dictType) {
        return createMockError(MockErrorCode.BAD_REQUEST, '字典类型不能为空')
      }

      const dictList = mockDictData.filter(item => item.dictType === String(dictType))
      console.log('返回字典数据:', dictList)

      // 使用新的响应格式，返回rows字段
      return {
        code: MockErrorCode.SUCCESS,
        msg: '操作成功',
        rows: dictList
      }
    }
  },
  {
    url: '/system/dict/data/list',
    method: 'GET',
    response: mockGetDictDataList
  },
  {
    url: '/system/dict/data/:dictCode',
    method: 'GET',
    response: mockGetDictDataDetail
  },

] as MockHandler[]
