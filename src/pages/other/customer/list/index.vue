<template>
  <view class="customers-list-page">
    <ClientFilterBar
      v-model="filterData"
      :show-manager-filters="isManager"
      :show-case-status-filter="showCaseStatusFilter"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <scroll-view
      class="list-container"
      scroll-y
      enable-back-to-top
      enable-flex
      lower-threshold="100"
      @scrolltolower="handleLoadMore"
      @refresherrefresh="handleRefresh"
      refresher-enabled
      :refresher-triggered="refreshing"
    >
      <view v-if="clientStore.list.length > 0" class="list">
        <ClientCard
          v-for="client in clientStore.list"
          :key="client.id"
          :client="client"
          :show-owner="true"
          :show-actions="true"
          :is-manager="isManager"
          :role-level="userStore.roleLevel"
          :show-case-stats="isFromCaseList"
          :show-sales-actions="userStore.roleLevel === 'SALES' || userStore.roleLevel === 'TEAM' || userStore.roleLevel === 'BRANCH'"
          :sales-stage="currentStageValue"
          :current-user-id="userStore.id"
          :current-user-team-id="userStore.teamId"
          :current-user-branch-id="userStore.branchId"
          :has-pending-approval="false"
          @click="handleClientClick"
          @claim="handleClaim"
          @assign="handleAssign"
          @audit="handleAudit"
          @followup="handleFollowup"
          @plan="handlePlan"
          @contract="handleContract"
          @payment="handlePayment"
          @legal="handleLegal"
        />
      </view>

      <view v-else-if="!clientStore.loading" class="empty">
        <text class="empty-text">暂无客户数据</text>
      </view>

      <!-- 加载中提示 -->
      <view v-if="clientStore.loading" class="loading">
        <u-loading-icon mode="spinner" size="28" />
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 下拉查看更多提示：有更多数据且不在加载中时显示 -->
      <view v-if="!clientStore.loading && hasMoreData && clientStore.list.length > 0" class="load-more-tip">
        <text class="load-more-text">下拉查看更多内容</text>
      </view>

      <!-- 没有更多了提示 -->
      <view v-if="!clientStore.loading && !hasMoreData && clientStore.list.length > 0" class="no-more">
        <text>没有更多了</text>
      </view>
    </scroll-view>

    <DraggableFab
      icon="plus"
      clickMode="emit"
      :top-gap="fabTopGap"
      :bottom-gap="fabBottomGap"
      :offset-right="24"
      :offset-bottom="24"
      @click="handleAdd"
    />

    <CustomerQuickActionSheet
      v-model:show="showQuickActionSheet"
      :stage="quickActionStage"
      :mode="isManagementQuickAction ? 'manager' : 'sales'"
      @select="handleQuickActionSelect"
    />

    <CustomerPickerSheet
      v-model:show="showCustomerPicker"
      :clients="pickerClients"
      :action-label="pendingActionLabel"
      @confirm="handleCustomerPicked"
    />

    <!-- 经办人选择器（用于分配客户） -->
    <OwnerSelector
      v-model="showAssignPopup"
      :selectedUserIds="selectedAssignUserIds"
      :multiple="true"
      @confirm="handleAssignConfirm"
      @close="handleAssignClose"
    />
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, nextTick } from 'vue'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { useClientStore } from '../../stores/client'
import { useUserStore } from '@/stores/user'
import type { ClientListItem, QuickActionType, SalesStage } from '@/types/interfaces/client'
import { applyClient, assignClient } from '@/api/client'
import ClientFilterBar from '@/components/ClientFilterBar/index.vue'
import ClientCard from '@/components/ClientCard/index.vue'
import DraggableFab from '@/components/DraggableFab/index.vue'
import OwnerSelector from '@/components/OwnerSelector/index.vue'
import CustomerQuickActionSheet from '@/components/CustomerQuickActionSheet.vue'
import CustomerPickerSheet from '@/components/CustomerPickerSheet.vue'

const clientStore = useClientStore()
const userStore = useUserStore()

const currentStageValue = ref<string>('')
const showCaseStatusFilter = ref(false)

const filterData = ref<any>({})
const refreshing = ref(false)
const isManager = computed(() => userStore.isManager)

// 计算是否还有更多数据
const hasMoreData = computed(() => {
  return clientStore.list.length < clientStore.total
})

const showAssignPopup = ref(false)
const assigningClient = ref<ClientListItem | null>(null)
const selectedAssignUserIds = ref<Array<number | string>>([])
const fabTopGap = ref(0)
const fabBottomGap = ref(220)
const showQuickActionSheet = ref(false)
const showCustomerPicker = ref(false)
const pendingAction = ref<QuickActionType | ''>('')
const isManagementQuickAction = computed(() => {
  const level = String(userStore.roleLevel || '').toUpperCase()
  return level === 'HQ' || level === 'BRANCH'
})
// 标记是否来自案源清单入口，以及进入前的分页大小
let isFromCaseList = false
let prevPageSize: number | null = null
// 防抖：防止 scrolltolower 事件重复触发
let loadMoreTimer: ReturnType<typeof setTimeout> | null = null

const pxToUpx = (px: number) => {
  const unit = uni.upx2px(1)
  if (!unit) return Math.round(px)
  return Math.round(px / unit)
}

const resolveClientId = (client: ClientListItem) => {
  return client.customer_id || client.id
}

function applyOwnerScope(stage: SalesStage | '') {
  const filtersRef = clientStore.filters
  if (!filtersRef) return
  if (!filtersRef.value) {
    filtersRef.value = {}
  }
  const filters = filtersRef.value
  const roleLevel = userStore.roleLevel
  const userId = userStore.id ? String(userStore.id).trim() : ''

  if (roleLevel === 'SALES') {
    if (userId) {
      filters.owner_user_id = userId
    } else {
      delete filters.owner_user_id
    }
  } else {
    delete filters.owner_user_id
  }

  if (stage === 'PUBLIC_POOL') {
    delete filters.owner_user_id
  }
}

function setStageFromParam(stage: SalesStage | '') {
  currentStageValue.value = stage
  applyOwnerScope(stage)
  clientStore.setSalesStage(stage)
}

function handleSearch(keyword: string) {
  clientStore.setKeyword(keyword)
}

function handleFilter(data: any) {
  clientStore.setFilters(data)

  if (data?.status || data?.sales_stage) {
    if (data.status) {
      clientStore.setStatus(data.status)
      applyOwnerScope(data.status)
    } else if (data.sales_stage) {
      clientStore.setSalesStage(data.sales_stage)
      applyOwnerScope(data.sales_stage)
    }
  }
}

function handleReset() {
  filterData.value = {}
  clientStore.resetFilters()
  const stage = (currentStageValue.value || '') as SalesStage | ''

  if (stage) {
    clientStore.setSalesStage(stage)
  }
  applyOwnerScope(stage)
}

async function handleRefresh() {
  refreshing.value = true
  try {
    await clientStore.refresh()
  } finally {
    refreshing.value = false
  }
}

function handleLoadMore() {
  // 清除之前的定时器
  if (loadMoreTimer) {
    clearTimeout(loadMoreTimer)
  }
  
  // 防抖：延迟执行，避免快速滚动时重复触发
  loadMoreTimer = setTimeout(() => {
    // 防止重复触发：如果正在加载，直接返回
    if (clientStore.loading) {
      console.log(`[客户列表] 正在加载中，忽略重复触发`)
      return
    }
    
    // 使用计算属性判断是否还有更多数据
    if (hasMoreData.value) {
      console.log(`[客户列表] 滚动到底部，加载更多数据。当前已加载：${clientStore.list.length}，总数：${clientStore.total}`)
      clientStore.loadMore()
    } else {
      console.log(`[客户列表] 无法加载更多：hasMoreData=${hasMoreData.value}, 已加载=${clientStore.list.length}, 总数=${clientStore.total}`)
    }
  }, 200) // 200ms 防抖延迟
}

function handleAdd() {
  if (!pickerClients.value.length) {
    uni.showToast({
      title: '暂无可选客户',
      icon: 'none'
    })
    return
  }
  showQuickActionSheet.value = true
}

const quickActionStage = computed<SalesStage>(() => {
  const stage = String(currentStageValue.value || '').toUpperCase()
  if (stage === 'CASE' || stage === 'PAYMENT' || stage === 'WON') {
    return stage as SalesStage
  }
  if (stage === 'PUBLIC_POOL') return 'BLANK'
  if (stage === 'MEETING') return 'MEETING'
  return 'BLANK'
})

const pickerClients = computed<ClientListItem[]>(() => {
  return (clientStore.list || []).filter(item => !!resolveClientId(item))
})

const salesActionLabelMap: Record<QuickActionType, string> = {
  FOLLOWUP_RECORD: '跟进记录',
  VALID_CASE: '有效交案',
  CONFIRM_CONTRACT: '确认合同',
  CASE_PLAN: '办案计划',
  ADD_PAYMENT: '录入回款',
  PAYMENT_FOLLOWUP: '回款跟进',
  ADD_LEGAL_FEE: '录入律师费',
  COLLECTION_PROGRESS: '收款进度'
}

const managerActionLabelMap: Record<QuickActionType, string> = {
  FOLLOWUP_RECORD: '查看跟进记录',
  VALID_CASE: '查看交案',
  CONFIRM_CONTRACT: '查看合同',
  CASE_PLAN: '查看交案',
  ADD_PAYMENT: '查看回款',
  PAYMENT_FOLLOWUP: '查看回款',
  ADD_LEGAL_FEE: '查看律师费',
  COLLECTION_PROGRESS: '查看收款进度'
}

const pendingActionLabel = computed(() => {
  if (!pendingAction.value) return ''
  const labelMap = isManagementQuickAction.value ? managerActionLabelMap : salesActionLabelMap
  return labelMap[pendingAction.value]
})

function handleQuickActionSelect(action: QuickActionType) {
  pendingAction.value = action
  showCustomerPicker.value = true
}

function navigateToDetailPanel(clientId: number | string, focusPanel: string) {
  uni.navigateTo({ url: `/pages/other/customer/detail/index?id=${clientId}&focusPanel=${focusPanel}` })
}

function navigateByManagerQuickAction(action: QuickActionType, client: ClientListItem) {
  const clientId = resolveClientId(client)
  const stage = String(client.sales_stage || quickActionStage.value || '').toUpperCase()

  if (action === 'FOLLOWUP_RECORD') {
    navigateToDetailPanel(clientId, 'followup')
    return
  }
  if (action === 'VALID_CASE' || action === 'CASE_PLAN') {
    navigateToDetailPanel(clientId, 'plan')
    return
  }
  if (action === 'CONFIRM_CONTRACT') {
    navigateToDetailPanel(clientId, 'contract')
    return
  }
  if (action === 'ADD_LEGAL_FEE') {
    navigateToDetailPanel(clientId, 'legal')
    return
  }
  if (action === 'COLLECTION_PROGRESS') {
    navigateToDetailPanel(clientId, stage === 'WON' ? 'legal' : 'payment')
    return
  }
  navigateToDetailPanel(clientId, 'payment')
}

function navigateByQuickAction(action: QuickActionType, client: ClientListItem) {
  if (isManagementQuickAction.value) {
    navigateByManagerQuickAction(action, client)
    return
  }
  const clientId = resolveClientId(client)
  const clientName = encodeURIComponent(client.client_name || client.customer_name || '')
  const clientStage = (client.sales_stage || quickActionStage.value || 'BLANK') as SalesStage

  if (action === 'FOLLOWUP_RECORD') {
    uni.navigateTo({ url: `/pages/other/customer/followup/create?clientId=${clientId}` })
    return
  }

  if (action === 'VALID_CASE') {
    uni.navigateTo({ url: `/pages/other/customer/plan/edit?clientId=${clientId}&salesStage=${clientStage}` })
    return
  }

  if (action === 'CONFIRM_CONTRACT') {
    uni.navigateTo({ url: `/pages/other/customer/contract/confirm?clientId=${clientId}&clientName=${clientName}` })
    return
  }

  if (action === 'CASE_PLAN') {
    uni.navigateTo({ url: `/pages/other/customer/plan/edit?clientId=${clientId}&salesStage=CASE` })
    return
  }

  if (action === 'ADD_PAYMENT') {
    uni.navigateTo({ url: `/pages/other/customer/payment/create?clientId=${clientId}&clientName=${clientName}` })
    return
  }

  if (action === 'PAYMENT_FOLLOWUP') {
    uni.navigateTo({ url: `/pages/other/customer/plan/edit?clientId=${clientId}&salesStage=PAYMENT` })
    return
  }

  if (action === 'ADD_LEGAL_FEE') {
    uni.navigateTo({ url: `/pages/other/customer/legal-fee/create?clientId=${clientId}&clientName=${clientName}` })
    return
  }

  if (action === 'COLLECTION_PROGRESS') {
    uni.navigateTo({ url: `/pages/other/customer/plan/edit?clientId=${clientId}&salesStage=WON` })
  }
}

function handleCustomerPicked(client: ClientListItem) {
  const action = pendingAction.value
  pendingAction.value = ''
  if (!action) return
  navigateByQuickAction(action, client)
}

function handleClientClick(client: ClientListItem) {
  const clientId = resolveClientId(client)
  uni.navigateTo({
    url: `/pages/other/customer/detail/index?id=${clientId}`
  })
}

function handleFollowup(client: ClientListItem) {
  const clientId = resolveClientId(client)
  uni.navigateTo({
    url: `/pages/other/customer/followup/create?clientId=${clientId}`
  })
}

function handlePlan(client: ClientListItem) {
  const clientId = resolveClientId(client)
  const stage = client.sales_stage || currentStageValue.value || ''
  uni.navigateTo({
    url: `/pages/other/customer/plan/edit?clientId=${clientId}&salesStage=${stage}`
  })
}

function handleContract(client: ClientListItem) {
  const clientId = resolveClientId(client)
  uni.navigateTo({
    url: `/pages/other/customer/contract/confirm?clientId=${clientId}&clientName=${client.client_name || ''}`
  })
}

function handlePayment(client: ClientListItem) {
  const clientId = resolveClientId(client)
  uni.navigateTo({
    url: `/pages/other/customer/payment/create?clientId=${clientId}&clientName=${client.client_name || ''}`
  })
}

function handleLegal(client: ClientListItem) {
  const clientId = resolveClientId(client)
  uni.navigateTo({
    url: `/pages/other/customer/legal-fee/create?clientId=${clientId}&clientName=${client.client_name || ''}`
  })
}

async function handleClaim(client: ClientListItem) {
  try {
    const clientId = resolveClientId(client)
    await applyClient({ client_id: clientId })
    await clientStore.refresh()
  } catch (error: any) {
    uni.showToast({
      title: error?.message || '操作失败',
      icon: 'none'
    })
  }
}

function handleAssign(client: ClientListItem) {
  assigningClient.value = {
    ...client,
    id: resolveClientId(client)
  }
  selectedAssignUserIds.value = []
  showAssignPopup.value = true
}

function handleAssignClose() {
  showAssignPopup.value = false
  assigningClient.value = null
  selectedAssignUserIds.value = []
}

async function handleAssignConfirm(users: any) {
  if (!assigningClient.value) return

  // OwnerSelector 已经过滤了只返回 TEAM 和 SALES 角色，这里不需要再检查
  try {
    uni.showLoading({ title: '分配中...' })

    await assignClient({
      client_id: assigningClient.value.id,
      handler_ids: (Array.isArray(users) ? users : [users]).map((item: any) => item.id).filter((id: any) => id !== undefined),
      owner_user_id: (Array.isArray(users) ? users : [users])[0]?.id,
      user_name: (Array.isArray(users) ? users : [users])[0]?.name,
      target_user_role_level: (Array.isArray(users) ? users : [users])[0]?.roleLevel
    } as any)

    uni.hideLoading()
    uni.showToast({
      title: '分配成功',
      icon: 'success'
    })

    showAssignPopup.value = false
    assigningClient.value = null
    selectedAssignUserIds.value = []

    await clientStore.refresh()
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({
      title: error?.message || '分配失败',
      icon: 'none'
    })
  }
}

function handleAudit(client: ClientListItem) {
  const clientId = resolveClientId(client)
  uni.navigateTo({
    url: '/pages/other/mine/approval/index?client_id=' + clientId
  })
}

function updateFabBounds() {
  nextTick(() => {
    const query = uni.createSelectorQuery()
    query.select('.list-container').boundingClientRect(rect => {
      if (!rect) return
      const sys = uni.getSystemInfoSync()
      const topPx = Math.max(0, rect.top)
      const bottomHeight = Math.max(0, sys.windowHeight - (rect.top + rect.height))
      const tabBarReserve = uni.upx2px(100) + (sys.safeAreaInsets?.bottom || 0) + uni.upx2px(20)
      fabTopGap.value = pxToUpx(topPx)
      fabBottomGap.value = pxToUpx(Math.max(bottomHeight, tabBarReserve))
    })
    query.exec()
  })
}

onLoad((options: any) => {
  const stage = (options?.stage || '') as SalesStage | ''
  const title = options?.title || ''
  const fromCaseList = options?.fromCaseList === '1' || options?.fromCaseList === 'true'

  if (title) {
    uni.setNavigationBarTitle({ title })
  }

  if (fromCaseList) {
    // 案源清单入口：重置状态/展业阶段筛选，但保留排序等默认配置
    isFromCaseList = true
    currentStageValue.value = ''
    showCaseStatusFilter.value = true

    // 清空全局 store 中的当前阶段/状态，避免继续按上一次的阶段过滤
    try {
      // Pinia 会自动解包 ref，这里直接赋值即可
      ;(clientStore as any).currentSalesStage = ''
      ;(clientStore as any).currentStatus = ''

      // 记录进入前的分页大小，案源清单使用适中的分页大小（50），通过下拉加载更多实现"不封顶"
      if ((clientStore as any).pageSize != null) {
        prevPageSize = Number((clientStore as any).pageSize) || 10
      }
      // 使用 50 作为分页大小，避免单次请求过大导致超时，通过滚动加载更多实现完整展示
      ;(clientStore as any).pageSize = 50
    } catch (e) {
      // 忽略兼容性错误，避免影响运行
      console.warn('[案源清单] 重置阶段状态失败:', e)
    }

    if (clientStore.filters && clientStore.filters.value) {
      const filters = clientStore.filters.value
      delete filters.status
      delete filters.sales_stage
      delete filters.sales_stage_list
    }

    // 按角色应用数据范围（销售=只看自己，管理=按角色范围）
    applyOwnerScope('')
    // 触发列表刷新，加载最新的多状态案源数据（第一页）
    // 注意：refresh() 会重置 page=1 并清空列表，然后加载第一页数据
    console.log('[案源清单] 初始化：重置筛选条件，开始加载第一页数据')
    clientStore.setListMode('caseSource')
    return
  }

  clientStore.setListMode('default')

  if (stage) {
    setStageFromParam(stage)
  }
})

onShow(() => {
  if (!userStore.token) return
  updateFabBounds()
})

onMounted(() => {
  if (!userStore.token) return
  updateFabBounds()
})

// 离开案源清单页面时，还原之前的分页大小，避免影响其他入口
onUnload(() => {
  // 清理防抖定时器
  if (loadMoreTimer) {
    clearTimeout(loadMoreTimer)
    loadMoreTimer = null
  }
  
  if (isFromCaseList && prevPageSize) {
    ;(clientStore as any).pageSize = prevPageSize
  }
  if (isFromCaseList) {
    clientStore.setListMode('default')
  }
})
</script>

<style scoped lang="scss">
.customers-list-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F5F7FA;
}

.list-container {
  flex: 1;
  height: 0; // 配合 flex: 1 使用，确保高度正确计算
  padding: 20rpx;
  box-sizing: border-box;
}

.list {
  padding-bottom: 100rpx;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #909399;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
  gap: 20rpx;
}

.loading-text {
  font-size: 24rpx;
  color: #909399;
}

.load-more-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
}

.load-more-text {
  font-size: 24rpx;
  color: #909399;
  position: relative;
  padding-left: 40rpx;
}

.load-more-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 8rpx solid #909399;
  border-top: 6rpx solid transparent;
  border-bottom: 6rpx solid transparent;
  animation: arrow-bounce 1.5s infinite;
}

@keyframes arrow-bounce {
  0%, 100% {
    transform: translateY(-50%) translateX(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-50%) translateX(-10rpx);
    opacity: 0.6;
  }
}

.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
  font-size: 24rpx;
  color: #C0C4CC;
}
</style>
