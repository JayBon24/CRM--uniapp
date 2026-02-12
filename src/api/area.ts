/**
 * 区域相关API接口
 */
import { http } from '@/utils/request'
import type {
  AreaQueryParams,
  ActivateCityListParams,
  AreaInfo,
  Province,
  City,
  County
} from '@/types/interfaces/area'
import type { TableDataInfo } from '@/types/interfaces/common'

/**
 * 根据父级ID获取区域列表
 */
export function listActivateList(query: ActivateCityListParams) {
  return http.get<TableDataInfo<AreaInfo>>('/sysArea/activateCityList', query)
}

/**
 * 根据父级ID获取区域列表
 */
export function getAreaListByPid(pid: string) {
  return http.get<TableDataInfo<AreaInfo>>(`/sysArea/listByPid/${pid}`)
}

/**
 * 获取所有省份
 */
export function getProvinceList() {
  return http.get<TableDataInfo<Province>>('/sysArea/listByPid/0')
}

/**
 * 根据省份ID获取城市列表
 */
export function getCityList(pid: string) {
  return http.get<TableDataInfo<City>>(`/sysArea/listByPid/${pid}`)
}

/**
 * 根据城市ID获取区县列表
 */
export function getDistrictList(pid: string) {
  return http.get<TableDataInfo<County>>(`/sysArea/listByPid/${pid}`)
}

/**
 * 城市搜索（根据关键词）
 * 接口地址：/sysArea/cityList
 * 说明：返回城市列表，遵循 TableDataInfo 标准格式
 */
export function searchCityList(params: { keyword?: string }) {
  // 中文注释：统一通过 http 客户端发起请求，异常由 request.ts 统一处理
  return http.get<TableDataInfo<City>>('/sysArea/cityList', params)
}
