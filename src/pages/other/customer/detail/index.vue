<!-- @ts-nocheck -->
<template>
  <view class="customer-detail-page">
    <ClientDetailHeader
      v-if="clientDetail"
      :client="clientDetail"
    />

    <scroll-view class="action-bar" scroll-x>
      <view class="action-row">
        <view v-if="canAddFollowup" class="action-btn action-followup" @click="handleAddFollowup">
          <SvgIcon name="foot" :size="32" :color="actionColors.followup" />
          <text class="action-text" :style="{ color: actionColors.followup }">跟进情况</text>
        </view>
        <view v-if="canAddPlan" :class="['action-btn', planActionClass]" @click="handleAddPlan">
          <SvgIcon name="file-document" :size="32" :color="planActionColor" />
          <text class="action-text" :style="{ color: planActionColor }">{{ planActionText }}</text>
        </view>

        <view v-if="canConfirmContract && canAddFollowup" class="action-btn action-contract" @click="handleConfirmContract">
          <SvgIcon name="target" :size="32" :color="actionColors.contract" />
          <text class="action-text" :style="{ color: actionColors.contract }">确认合同</text>
        </view>
        <view v-if="canAddPayment && canAddFollowup" class="action-btn action-payment" @click="handleAddPayment">
          <SvgIcon name="shopping" :size="32" :color="actionColors.payment" />
          <text class="action-text" :style="{ color: actionColors.payment }">录入回款</text>
        </view>
        <view v-if="canAddLegalFee && canAddFollowup" class="action-btn action-legal" @click="handleAddLegalFee">
          <SvgIcon name="file-document" :size="32" :color="actionColors.legal" />
          <text class="action-text" :style="{ color: actionColors.legal }">录入律师费</text>
        </view>

        <view class="action-btn action-ai" @click="handleAiChat">
          <SvgIcon name="ai" :size="32" :color="actionColors.ai" />
          <text class="action-text" :style="{ color: actionColors.ai }">{{ aiActionText }}</text>
        </view>
      </view>
    </scroll-view>

    <scroll-view class="panels-container" scroll-y :scroll-into-view="panelScrollIntoView" :scroll-with-animation="true">
      <BaseInfoPanel v-if="clientDetail" :client="clientDetail" />
      <AiTagsPanel v-if="clientDetail" :client="clientDetail" @updated="handleAiTagsUpdated" />

      <view v-if="clientDetail?.case_statistics" class="case-summary-panel">
        <view class="panel-title">案件统计</view>
        <view class="case-summary-row">
          <text class="case-summary-item">案件总数 {{ clientDetail.case_statistics?.total || 0 }}</text>
          <text class="case-summary-item">跟进 {{ clientDetail.case_statistics?.follow_up || 0 }}</text>
          <text class="case-summary-item">交案 {{ clientDetail.case_statistics?.case || 0 }}</text>
          <text class="case-summary-item">回款 {{ clientDetail.case_statistics?.payment || 0 }}</text>
          <text class="case-summary-item">赢单 {{ clientDetail.case_statistics?.won || 0 }}</text>
        </view>
      </view>

      <view v-if="clientDetail?.cases?.length" class="case-list-panel">
        <view class="panel-title">案件列表</view>
        <view
          v-for="caseItem in clientDetail.cases"
          :key="caseItem.id"
          class="case-item"
          @click="handleCaseClick(caseItem)"
        >
          <view class="case-main">
            <text class="case-name">{{ caseItem.case_name || '-' }}</text>
            <text class="case-number">案件编号：{{ caseItem.case_number || '-' }}</text>
          </view>
          <view class="case-status">
            {{ getCaseStatusLabel(caseItem.status) }}
          </view>
        </view>
      </view>

      <view id="panel-followup">
        <FollowupTimelinePanel
          v-if="showFollowupPanel"
          ref="followupPanelRef"
          :client-id="clientId"
          :sales-stage="clientDetail?.sales_stage"
        />
      </view>

      <view id="panel-plan">
        <PlanPanel
          v-if="showPlanPanel"
          ref="planPanelRef"
          :client-id="clientId"
          :sales-stage="clientDetail?.sales_stage"
        />
      </view>

      <view id="panel-contract">
        <ContractPanel
          v-if="showContractPanel"
          :client-id="clientId"
        />
      </view>

      <view id="panel-payment">
        <PaymentPanel
          v-if="showPaymentPanel"
          :client-id="clientId"
        />
      </view>

      <view id="panel-legal">
        <LegalFeePanel
          v-if="showLegalFeePanel"
          :client-id="clientId"
        />
      </view>

      <HandoverLogPanel
        v-if="showHandoverPanel"
        :client-id="clientId"
      />
    </scroll-view>

    <view v-if="showBottomActions" class="bottom-actions">
      <view
        v-if="canClaim"
        class="action-button primary"
        @click="handleClaim"
      >
        申领线索
      </view>
      <view
        v-if="canAssign"
        class="action-button"
        @click="handleAssign"
      >
        分配
      </view>
      <view
        v-if="canTransfer"
        class="action-button"
        @click="handleTransfer"
      >
        转交
      </view>
    </view>

    <!-- 经办人选择器：用于在客户详情页分配公海客户 -->
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
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useClientStore } from '../../stores/client'
import { useUserStore } from '@/stores/user'
import type { ClientDetail, CaseSummary, ClientStatus } from '@/types/interfaces/client'
// 引入客户分配接口
import { assignClient } from '@/api/client'
import ClientDetailHeader from '@/components/ClientDetailHeader/index.vue'
import BaseInfoPanel from '@/components/ClientPanels/BaseInfoPanel.vue'
import AiTagsPanel from '@/components/ClientPanels/AiTagsPanel.vue'
import FollowupTimelinePanel from '@/components/ClientPanels/FollowupTimelinePanel.vue'
import PlanPanel from '@/components/ClientPanels/PlanPanel.vue'
import ContractPanel from '@/components/ClientPanels/ContractPanel.vue'
import PaymentPanel from '@/components/ClientPanels/PaymentPanel.vue'
import LegalFeePanel from '@/components/ClientPanels/LegalFeePanel.vue'
import HandoverLogPanel from '@/components/ClientPanels/HandoverLogPanel.vue'
// 引入经办人选择组件，与列表页保持一致
import OwnerSelector from '@/components/OwnerSelector/index.vue'
import { CLIENT_STATUS_MAP } from '@/utils/client-enums'

const clientStore = useClientStore()
const userStore = useUserStore()

const clientId = ref<number>(0)
const clientDetail = ref<ClientDetail | null>(null)
const loading = ref(false)

// 详情页分配弹窗相关状态
const showAssignPopup = ref(false)
const selectedAssignUserIds = ref<Array<number | string>>([])

const followupPanelRef = ref<any>(null)
const planPanelRef = ref<any>(null)
const panelScrollIntoView = ref('')
const pendingFocusPanel = ref('')

const showFollowupPanel = computed(() => {
  if (!clientDetail.value) return false
  const status = clientDetail.value.status
  return ['FOLLOW_UP', 'CASE', 'PAYMENT', 'WON'].includes(status)
})

const showPlanPanel = computed(() => {
  if (!clientDetail.value) return false
  const status = clientDetail.value.status
  return ['FOLLOW_UP', 'CASE', 'PAYMENT', 'WON'].includes(status)
})

const showContractPanel = computed(() => {
  if (!clientDetail.value) return false
  const status = clientDetail.value.status
  return ['CASE', 'PAYMENT', 'WON'].includes(status)
})

const showPaymentPanel = computed(() => {
  if (!clientDetail.value) return false
  const status = clientDetail.value.status
  return ['PAYMENT', 'WON'].includes(status)
})

const showLegalFeePanel = computed(() => {
  if (!clientDetail.value) return false
  return clientDetail.value.status === 'WON'
})

const showHandoverPanel = computed(() => {
  return true
})

const canConfirmContract = computed(() => {
  return clientDetail.value?.status === 'FOLLOW_UP'
})

const canAddPayment = computed(() => {
  return clientDetail.value?.status === 'CASE'
})

const canAddLegalFee = computed(() => {
  return clientDetail.value?.status === 'PAYMENT'
})

const aiActionText = computed(() => 'AI对话')

const actionColors = {
  followup: '#4F46E5',
  planEffective: '#8B5CF6',
  planCase: '#F97316',
  planPayment: '#10B981',
  planWon: '#0EA5E9',
  contract: '#F59E0B',
  payment: '#10B981',
  legal: '#EF4444',
  ai: '#6366F1'
}

const planActionClass = computed(() => {
  const stage = clientDetail.value?.sales_stage || ''
  if (stage === 'WON') return 'action-plan-won'
  if (['BLANK', 'MEETING', 'FOLLOW_UP'].includes(stage)) return 'action-plan-effective'
  if (stage === 'CASE') return 'action-plan-case'
  if (stage === 'PAYMENT') return 'action-plan-payment'
  return 'action-plan-default'
})

const planActionColor = computed(() => {
  const stage = clientDetail.value?.sales_stage || ''
  if (stage === 'WON') return actionColors.planWon
  if (['BLANK', 'MEETING', 'FOLLOW_UP'].includes(stage)) return actionColors.planEffective
  if (stage === 'CASE') return actionColors.planCase
  if (stage === 'PAYMENT') return actionColors.planPayment
  return actionColors.planEffective
})

const canAddFollowup = computed(() => {
  const roleLevel = userStore.roleLevel
  if (roleLevel === 'HQ') return false
  
  // BRANCH和TEAM都可以跟进客户（但需要检查权限）
  if (roleLevel === 'BRANCH' || roleLevel === 'TEAM') {
    if (!clientDetail.value) return false
    // 检查是否是本分所/本团队的客户，或者是自己的客户
    const clientBranchId = (clientDetail.value as any).branch_id
    const clientTeamId = (clientDetail.value as any).team_id
    const handlerIds = (clientDetail.value as any).handler_ids || []
    const clientOwnerId = handlerIds.map((id: any) => String(id))
    const currentUserId = String(userStore.id || '')
    
    if (roleLevel === 'BRANCH') {
      // BRANCH：可以跟进本分所的客户，或者是自己负责的客户
      const userBranchId = userStore.branchId
      if (clientBranchId && userBranchId && String(clientBranchId) === String(userBranchId)) {
        return true
      }
      if (clientOwnerId && currentUserId && clientOwnerId.includes(currentUserId)) {
        return true
      }
      return false
    }
    if (roleLevel === 'TEAM') {
      // TEAM：可以跟进本团队的客户，或者是自己负责的客户
      const userTeamId = userStore.teamId
      if (clientTeamId && userTeamId && String(clientTeamId) === String(userTeamId)) {
        return true
      }
      if (clientOwnerId && currentUserId && clientOwnerId.includes(currentUserId)) {
        return true
      }
      return false
    }
  }
  
  if (roleLevel === 'SALES') {
    if (!clientDetail.value) return false
    return ((clientDetail.value as any).handler_ids || []).map((id: any) => String(id)).includes(String(userStore.id || ''))
  }
  return false
})

const canAddPlan = computed(() => canAddFollowup.value)

const planActionText = computed(() => {
  const stage = clientDetail.value?.sales_stage || ''
  if (stage === 'WON') return '收款进度'
  if (['BLANK', 'MEETING', 'FOLLOW_UP'].includes(stage)) return '有效交案'
  if (stage === 'CASE') return '办案计划'
  if (stage === 'PAYMENT') return '回款跟进'
  return '添加计划'
})

const canClaim = computed(() => {
  if (clientDetail.value?.status !== 'PUBLIC_POOL') return false
  const roleLevel = userStore.roleLevel
  return roleLevel === 'TEAM' || roleLevel === 'SALES' || roleLevel === 'BRANCH'
})

const canAssign = computed(() => {
  if (!userStore.isManager) return false
  if (!clientDetail.value) return false
  
  const status = clientDetail.value.status
  const salesStage = clientDetail.value.sales_stage
  
  // 对于商机（sales_stage = BLANK）和跟进（status = FOLLOW_UP）状态的客户，不显示分配按钮
  if (status === 'FOLLOW_UP' || salesStage === 'BLANK') {
    return false
  }
  
  // 只有公海状态的客户才显示分配按钮
  return status === 'PUBLIC_POOL'
})

const canTransfer = computed(() => {
  if (!clientDetail.value) return false
  if (clientDetail.value.status === 'PUBLIC_POOL') return false
  if (userStore.isManager) return true
  return ((clientDetail.value as any).handler_ids || []).map((id: any) => String(id)).includes(String(userStore.id || ''))
})

const showBottomActions = computed(() => {
  return canClaim.value || canAssign.value || canTransfer.value
})

async function loadClientDetail() {
  if (!clientId.value) return

  loading.value = true
  try {
    const detail = await clientStore.fetchDetail(clientId.value)
    clientDetail.value = detail
    applyFocusPanel()
  } catch (error) {
    console.error('加载客户详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function applyFocusPanel() {
  if (!pendingFocusPanel.value) return
  const focusMap: Record<string, string> = {
    followup: 'panel-followup',
    plan: 'panel-plan',
    contract: 'panel-contract',
    payment: 'panel-payment',
    legal: 'panel-legal'
  }
  const target = focusMap[pendingFocusPanel.value]
  if (!target) return
  panelScrollIntoView.value = ''
  setTimeout(() => {
    panelScrollIntoView.value = target
    pendingFocusPanel.value = ''
  }, 60)
}

function handleAddFollowup() {
  uni.navigateTo({
    url: `/pages/other/customer/followup/create?clientId=${clientId.value}`
  })
}

function handleAddPlan() {
  const salesStage = clientDetail.value?.sales_stage || ''
  uni.navigateTo({
    url: `/pages/other/customer/plan/edit?clientId=${clientId.value}&salesStage=${salesStage}`
  })
}

function handleAiChat() {
  // 跳转到Tab3（AI助理页面）
  uni.switchTab({
    url: '/pages/tab/ai'
  })
}

function handleAiTagsUpdated() {
  loadClientDetail()
}

function handleConfirmContract() {
  uni.navigateTo({
    url: `/pages/other/customer/contract/confirm?clientId=${clientId.value}&clientName=${clientDetail.value?.client_name || ''}`
  })
}

function handleAddPayment() {
  uni.navigateTo({
    url: `/pages/other/customer/payment/create?clientId=${clientId.value}&clientName=${clientDetail.value?.client_name || ''}`
  })
}

function handleAddLegalFee() {
  uni.navigateTo({
    url: `/pages/other/customer/legal-fee/create?clientId=${clientId.value}&clientName=${clientDetail.value?.client_name || ''}`
  })
}

function handleClaim() {
  uni.showModal({
    title: '申领确认',
    content: '确认申领该线索？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await clientStore.claimClient(clientId.value)
          uni.showToast({
            title: '申领成功',
            icon: 'success'
          })
          loadClientDetail()
        } catch (error) {
          console.error('申领失败:', error)
        }
      }
    }
  })
}

// 点击底部分配按钮：打开经办人选择弹窗
function handleAssign() {
  if (!clientDetail.value) return
  selectedAssignUserIds.value = []
  showAssignPopup.value = true
}

// 关闭经办人选择弹窗
function handleAssignClose() {
  showAssignPopup.value = false
  selectedAssignUserIds.value = []
}

// 详情页分配确认回调：与列表页保持同一套分配逻辑
async function handleAssignConfirm(users: any) {
  if (!clientDetail.value) return

  try {
    // 显示加载提示
    uni.showLoading({ title: '分配中...' })

    await assignClient({
      client_id: clientDetail.value.id,
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
    selectedAssignUserIds.value = []

    // 重新加载客户详情，刷新经办人等信息
    await loadClientDetail()
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({
      title: error?.message || '分配失败',
      icon: 'none'
    })
  }
}

function handleTransfer() {
  if (!clientDetail.value) return
  const statusLabel = CLIENT_STATUS_MAP[clientDetail.value.status]?.label || clientDetail.value.status
  const names = clientDetail.value.handler_names
  const namesArr = Array.isArray(names) && names.length > 0 ? names : (typeof names === 'string' && names.trim() ? names.split(/[、,，;；]/).map((s: string) => s.trim()).filter(Boolean) : [])
  const fromHandlers = Array.isArray((clientDetail.value as any).handlers) && (clientDetail.value as any).handlers.length > 0
    ? (clientDetail.value as any).handlers.map((h: any) => (h && (h.name || h.username)) || '').filter(Boolean)
    : []
  const currentOwnerName = (namesArr.length > 0 ? namesArr.join('、') : (fromHandlers.length > 0 ? fromHandlers.join('、') : (clientDetail.value.owner_user_name || '')))
  uni.navigateTo({
    url: `/pages/other/customer/handover/apply?clientId=${clientId.value}&clientName=${encodeURIComponent(clientDetail.value.client_name || '')}&clientStatus=${encodeURIComponent(statusLabel)}&currentOwner=${encodeURIComponent(currentOwnerName)}`
  })
}

function getCaseStatusLabel(status?: ClientStatus | string) {
  if (!status) return '-'
  return CLIENT_STATUS_MAP[status as ClientStatus]?.label || status
}

function handleCaseClick(caseItem: CaseSummary) {
  if (!caseItem?.id) return
  uni.navigateTo({
    url: `/pages/other/case/detail/index?id=${caseItem.id}`
  })
}

onLoad((options: any) => {
  if (options.id) {
    clientId.value = Number(options.id)
    if (options.focusPanel) {
      pendingFocusPanel.value = String(options.focusPanel).toLowerCase()
    }
    loadClientDetail()
  }
})

onShow(() => {
  if (clientId.value) {
    loadClientDetail()
    followupPanelRef.value?.refresh?.()
    planPanelRef.value?.refresh?.()
  }
})
</script>

<style scoped lang="scss">
.customer-detail-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #F5F7FA;
  padding-bottom: calc(180rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.action-bar {
  width: 100%;
  white-space: nowrap;
  background: #fff;
  padding: 24rpx 0;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

.action-row {
  display: flex;
  align-items: center;
  min-width: 100%;
  justify-content: space-around;
  gap: 0;
  padding: 0 12rpx;
  box-sizing: border-box;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  flex: 0 0 auto;
  padding: 14rpx 20rpx;
  border-radius: 14rpx;
  background: #F5F7FA;
}

.action-text {
  font-size: 24rpx;
}

.action-followup {
  background: #EEF2FF;
}

.action-plan-effective {
  background: #F3E8FF;
}

.action-plan-case {
  background: #FFF7ED;
}

.action-plan-payment,
.action-payment {
  background: #ECFDF3;
}

.action-plan-won {
  background: #E0F2FE;
}

.action-contract {
  background: #FEF3C7;
}

.action-legal {
  background: #FEE2E2;
}

.action-ai {
  background: #EEF2FF;
}

.panels-container {
  flex: 1;
  padding: 0 20rpx 120rpx;
}

.case-summary-panel,
.case-list-panel {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
}

.panel-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16rpx;
}

.case-summary-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx 20rpx;
  font-size: 24rpx;
  color: #606266;
}

.case-summary-item {
  color: #606266;
}

.case-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-top: 1rpx solid #F0F2F5;
}

.case-item:first-child {
  border-top: none;
}

.case-main {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.case-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #303133;
}

.case-number {
  font-size: 24rpx;
  color: #909399;
}

.case-status {
  font-size: 24rpx;
  color: #606266;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #EBEEF5;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 1200;
}

.action-button {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: 500;
  background: #F5F7FA;
  color: #606266;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
  }
}
</style>
