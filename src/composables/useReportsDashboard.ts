/**
 * 数据看板 Composable
 * 管理看板数据获取、刷新和维度筛选逻辑
 */
import { ref } from 'vue'
import { getDashboardData } from '@/api/reports'
import type {
  DashboardData,
  DimensionFilter,
  DataScope
} from '@/types/interfaces/reports'
import type { UserRoleLevel } from '@/types/interfaces/user'
import { useUserStore } from '@/stores/user'

export function useReportsDashboard(roleLevel: UserRoleLevel) {
  // 获取当前用户信息
  const userStore = useUserStore()
  const currentUserId = userStore.id
  
  // 状态
  const loading = ref(false)
  const dashboardData = ref<DashboardData | null>(null)
  const error = ref<string | null>(null)

  // 维度筛选状态 - 初始化为默认值
  const getInitialScope = (): DataScope => {
    // HQ（总所管理）：默认查看全所数据，因为 HQ 角色无销售职能
    if (roleLevel === 'HQ') return 'HQ'
    // BRANCH（分所管理）：默认查看本分所数据
    if (roleLevel === 'BRANCH') return 'BRANCH'
    // TEAM（团队管理）：默认查看本团队数据
    if (roleLevel === 'TEAM') return 'TEAM'
    // SALES（销售）：默认查看个人数据
    if (roleLevel === 'SALES') return 'SELF'
    return 'SELF'
  }

  const dimensionFilter = ref<DimensionFilter>({
    scope: getInitialScope(),
    dimension: 'NONE',
    // 只有 SALES 角色才需要设置 userId，管理角色查看范围更广
    userId: roleLevel === 'SALES' ? currentUserId : undefined
  })

  // 构建查询参数
  const buildQueryParams = (): { dimensionFilter: DimensionFilter } => {
    return {
      dimensionFilter: dimensionFilter.value
    }
  }

  // 加载看板数据
  const loadDashboardData = async () => {
    loading.value = true
    error.value = null

    try {
      const params = buildQueryParams()
      console.log('[useReportsDashboard] 请求参数:', params)
      const response: any = await getDashboardData(params)
      // 提取响应数据：支持 { code: 200, data: {...} } 或直接返回数据
      dashboardData.value = response.data || response
    } catch (err: any) {
      error.value = err.message || '加载数据失败'
      console.error('加载看板数据失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refreshData = async () => {
    await loadDashboardData()
  }

  // 切换维度筛选
  const changeDimensionFilter = async (filter: DimensionFilter) => {
    dimensionFilter.value = filter
    await loadDashboardData()
  }

  return {
    // 状态
    loading,
    dashboardData,
    error,
    dimensionFilter,

    // 方法
    loadDashboardData,
    refreshData,
    changeDimensionFilter
  }
}
