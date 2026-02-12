/**
 * 字典相关API接口
 */
import { http } from '@/utils/request'
import type {
  DictType,
  DictData,
  DictTypeQueryParams,
  DictDataQueryParams,
  CreateDictTypeParams,
  UpdateDictTypeParams,
  CreateDictDataParams,
  UpdateDictDataParams
} from '@/types/interfaces/dict'
import type { TableDataInfo, AjaxResult } from '@/types/interfaces/common'

/**
 * 根据字典类型查询字典数据
 */
export function getDicts(dictType: string) {
  return http.get<TableDataInfo<DictData>>('/dict/data/type/' + dictType)
}

/**
 * 查询字典数据列表
 */
export function listDictData(query: DictDataQueryParams) {
  return http.get<TableDataInfo<DictData>>('/dict/data/list', query)
}

/**
 * 查询字典数据详细
 */
export function getDictData(dictCode: number) {
  return http.get<AjaxResult<DictData>>('/dict/data/' + dictCode)
}

