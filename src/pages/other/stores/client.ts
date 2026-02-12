// @ts-nocheck
/**
 * 客户管理状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import type {
  ClientListItem,
  ClientListParams,
  ClientStatus,
  SalesStage,
  ClientGrade,
  RecycleRiskLevel,
  ClientDetail
} from '@/types/interfaces/client'
import { getClientList, getClientDetail, claimClient, getCaseSourceList } from '@/api/client'

export const useClientStore = defineStore('client', () => {
  // ============ 状态 ============

  // 列表数据
  const list = ref<ClientListItem[]>([])
  const total = ref(0)
  const loading = ref(false)

  // 分页
  const page = ref(1)
  const pageSize = ref(10)
  const listMode = ref<'default' | 'caseSource'>('default')

  // 当前选中的状态分段
  const currentStatus = ref<ClientStatus | ''>('')
  const currentSalesStage = ref<SalesStage | ''>('')

  // 筛选条件
  const filters = ref<{
    keyword?: string
    status?: ClientStatus
    sales_stage?: SalesStage
    sales_stage_list?: SalesStage[]
    grade?: ClientGrade
    collection_category?: string | string[]
    owner_user_id?: number | string
    team_id?: number | string
    branch_id?: number | string
    recycle_risk_level?: RecycleRiskLevel
    order_by?: 'last_followup' | 'create_time' | 'last_visit'
    order_direction?: 'asc' | 'desc'
  }>({
    order_by: 'create_time',
    order_direction: 'desc'
  })

  // 当前客户详情
  const currentClient = ref<ClientDetail | null>(null)

  // ============ 计算属性 ============

  // 是否有更多数据
  const hasMore = computed(() => {
    return list.value.length < total.value
  })

  // 当前查询参数
  const queryParams = computed<ClientListParams>(() => {
    return {
      status: currentStatus.value || undefined,
      sales_stage: currentSalesStage.value || undefined,
      ...filters.value,
      page: page.value,
      pageSize: pageSize.value
    }
  })

  // ============ 方法 ============

  /**
   * 获取列表
   */
  async function fetchList(refresh = false) {
    // 如果是刷新操作，即使 loading 为 true，也允许强制刷新
    // 这样可以确保在页面返回时能够正常发起请求
    if (loading.value && !refresh) return

    if (refresh) {
      page.value = 1
      list.value = []
      // 强制刷新时，重置 loading 状态，确保请求能够发起
      loading.value = false
    }

    try {
      loading.value = true

      const response =
        listMode.value === 'caseSource'
          ? await getCaseSourceList(queryParams.value)
          : await getClientList(queryParams.value)

      const normalizedRows = normalizeClientList(response.rows || [])

      if (refresh) {
        list.value = uniqueById(normalizedRows)
        console.log(`[客户列表] 刷新完成：加载第 ${response.page} 页，返回 ${response.rows?.length || 0} 条，总数 ${response.total}`)
      } else {
        const newItems = normalizedRows
        // 如果返回的数据为空，说明已经加载完所有数据
        if (newItems.length === 0) {
          console.log(`[客户列表] 第 ${response.page} 页返回空数据，已加载完所有数据`)
        } else {
          list.value = uniqueById([...(list.value || []), ...newItems])
          console.log(`[客户列表] 加载更多完成：第 ${response.page} 页，新增 ${newItems.length} 条，累计 ${list.value.length} 条，总数 ${response.total}`)
        }
      }

      total.value = response.total || 0
      // 更新页码为返回的页码，确保与服务端同步
      page.value = response.page || page.value

      return response
    } catch (error) {
      console.error('获取客户列表失败:', error)
      uni.showToast({
        title: '获取列表失败',
        icon: 'none'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  function uniqueById(items: ClientListItem[]) {
    const seen = new Set<string | number>()
    const result: ClientListItem[] = []
    items.forEach(item => {
      const key = item?.id
      if (key === undefined || key === null) return
      if (seen.has(key)) return
      seen.add(key)
      result.push(item)
    })
    return result
  }

  function normalizeDeadlineValue(value: any) {
    if (!value) return ''
    if (typeof value === 'number') {
      return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : String(value)
    }
    if (typeof value === 'string') {
      const trimmed = value.trim()
      const normalized = trimmed.replace(/\//g, '-')
      const parsed = dayjs(normalized, ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm'], true)
      if (parsed.isValid()) {
        return parsed.format('YYYY-MM-DD')
      }
      const fallback = dayjs(normalized)
      return fallback.isValid() ? fallback.format('YYYY-MM-DD') : trimmed
    }
    return value
  }

  function normalizeHandlerNames(raw: any): string[] | undefined {
    if (Array.isArray(raw) && raw.length > 0) return raw.map((s: any) => String(s || '').trim()).filter(Boolean)
    if (typeof raw === 'string' && raw.trim()) return raw.split(/[、,，;；]/).map((s: string) => s.trim()).filter(Boolean)
    return undefined
  }

  function normalizeHandlers(raw: any): Array<{ id: number | string; name: string }> | undefined {
    if (!Array.isArray(raw) || raw.length === 0) return undefined
    const list = raw.map((h: any) => {
      if (!h || typeof h !== 'object') return null
      const name = (h.name ?? h.username ?? '').trim() || String(h.id ?? '')
      return { id: h.id, name }
    }).filter(Boolean) as Array<{ id: number | string; name: string }>
    return list.length ? list : undefined
  }

  function normalizeClientItem<T extends ClientListItem | ClientDetail>(item: T): T {
    if (!item) return item
    const deadline =
      (item as any).recycle_deadline ||
      (item as any).recycle_deadline_at ||
      (item as any).recycle_deadline_time ||
      (item as any).recycle_deadline_date
    const mappedCategory = (item as any).category || (item as any).client_category
    const normalizedCategory =
      typeof mappedCategory === 'string' ? mappedCategory.trim().toLowerCase() : mappedCategory
    const mappedLastDealTime = (item as any).last_deal_time || (item as any).lastDealTime
    const handlerNames = normalizeHandlerNames((item as any).handler_names ?? (item as any).handlerNames)
    const handlers = normalizeHandlers((item as any).handlers)
    const out = {
      ...item,
      recycle_deadline: deadline ? normalizeDeadlineValue(deadline) : (item as any).recycle_deadline,
      category: normalizedCategory || (item as any).category,
      last_deal_time: mappedLastDealTime || (item as any).last_deal_time
    } as T
    if (handlerNames !== undefined) (out as any).handler_names = handlerNames
    if (handlers !== undefined) (out as any).handlers = handlers
    return out
  }

  function normalizeClientList(items: ClientListItem[]) {
    return (items || []).map(item => normalizeClientItem(item))
  }

  /**
   * 加载更多
   */
  async function loadMore() {
    // 检查是否还有更多数据：已加载数量 < 总数
    const hasMoreData = list.value.length < total.value
    if (!hasMoreData || loading.value) {
      console.log(`[客户列表] 无法加载更多：hasMoreData=${hasMoreData}, loading=${loading.value}, 已加载=${list.value.length}, 总数=${total.value}`)
      return
    }

    const nextPage = page.value + 1
    console.log(`[客户列表] 加载第 ${nextPage} 页，当前已加载 ${list.value.length} 条，总数 ${total.value}`)
    page.value = nextPage
    await fetchList()
  }

  /**
   * 刷新列表
   */
  async function refresh() {
    await fetchList(true)
  }

  /**
   * 设置状态分段
   */
  function setStatus(status: ClientStatus | '') {
    if (currentStatus.value !== status) {
      currentStatus.value = status
      currentSalesStage.value = '' // 切换 status 时清空 sales_stage
      refresh()
    }
  }

  /**
   * 设置展业分段
   */
  function setSalesStage(stage: SalesStage | '') {
    if (currentSalesStage.value !== stage) {
      currentSalesStage.value = stage
      currentStatus.value = '' // 切换 sales_stage 时清空 status
      refresh()
    }
  }

  /**
   * 设置筛选条件
   */
  function setListMode(mode: 'default' | 'caseSource') {
    if (listMode.value !== mode) {
      listMode.value = mode
      refresh()
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    // 如果传入 undefined 或空数组，表示要清除该字段
    const cleanedFilters: any = { ...filters.value }
    Object.keys(newFilters).forEach(key => {
      const value = newFilters[key as keyof typeof newFilters]
      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        delete cleanedFilters[key]
      } else {
        cleanedFilters[key] = value
      }
    })
    filters.value = cleanedFilters
    refresh()
  }

  /**
   * 设置搜索关键词
   */
  function setKeyword(keyword: string) {
    filters.value.keyword = keyword
    refresh()
  }

  /**
   * 设置排序
   */
  function setOrder(
    orderBy: 'last_followup' | 'create_time' | 'last_visit',
    orderDirection: 'asc' | 'desc' = 'desc'
  ) {
    filters.value.order_by = orderBy
    filters.value.order_direction = orderDirection
    refresh()
  }

  /**
   * 重置筛选条件
   */
  function resetFilters() {
    filters.value = {
      order_by: 'create_time',
      order_direction: 'desc'
    }
    currentStatus.value = ''
    currentSalesStage.value = ''
    refresh()
  }

  /**
   * 根据 ID 查找客户
   */
  function findClientById(id: number | string) {
    return list.value.find(item => item.id === id)
  }

  /**
   * 更新列表中的某个客户
   */
  function updateClientInList(id: number | string, data: Partial<ClientListItem>) {
    const index = list.value.findIndex(item => item.id === id)
    if (index !== -1) {
      list.value[index] = {
        ...list.value[index],
        ...data
      }
    }
  }

  /**
   * 从列表中移除客户
   */
  function removeClientFromList(id: number | string) {
    const index = list.value.findIndex(item => item.id === id)
    if (index !== -1) {
      list.value.splice(index, 1)
      total.value -= 1
    }
  }

  /**
   * 获取客户详情
   */
  async function fetchDetail(id: number | string): Promise<ClientDetail> {
    loading.value = true
    try {
      const detail = await getClientDetail(id)
      const normalized = normalizeClientItem(detail)
      currentClient.value = normalized
      return normalized
    } catch (error) {
      console.error('获取客户详情失败:', error)
      uni.showToast({
        title: '获取详情失败',
        icon: 'none'
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 申领客户
   */
  async function claimClientById(id: number | string) {
    try {
      await claimClient(id)
      // 刷新列表
      await refresh()
      return true
    } catch (error) {
      console.error('申领客户失败:', error)
      uni.showToast({
        title: '申领失败',
        icon: 'none'
      })
      throw error
    }
  }

  return {
    // 状态
    list,
    total,
    loading,
    page,
    pageSize,
    listMode,
    currentStatus,
    currentSalesStage,
    filters,
    currentClient,

    // 计算属性
    hasMore,
    queryParams,

    // 方法
    fetchList,
    loadMore,
    refresh,
    setStatus,
    setSalesStage,
    setListMode,
    setFilters,
    setKeyword,
    setOrder,
    resetFilters,
    findClientById,
    updateClientInList,
    removeClientFromList,
    fetchDetail,
    claimClient: claimClientById
  }
})
