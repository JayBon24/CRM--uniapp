<template>
  <view class="client-card" @click="handleClick">
    <!-- 顶部：客户名 + 等级 + 客户类别（建工/建材不单独占行） -->
    <view class="card-header">
      <view class="name-grade">
        <text class="client-name">{{ displayName }}</text>
        <view v-if="client.grade" class="grade-tag" :style="gradeStyle">
          <text class="grade-text">{{ client.grade }}</text>
          <text v-if="client.grade_source" class="grade-source">
            {{ client.grade_source === 'manual' ? '人工' : 'AI' }}
          </text>
        </view>
        <view v-if="resolvedCategory" class="category-tag-inline" :style="categoryStyle">
          {{ categoryLabel }}
        </view>
      </view>
      <SalesStageTag :stage="client.sales_stage" size="small" />
    </view>

    <!-- 联系信息 -->
    <view v-if="client.contact_name || client.mobile" class="contact-info">
      <text v-if="client.contact_name" class="contact-name">{{ client.contact_name }}</text>
      <text v-if="client.mobile" class="mobile">{{ client.mobile }}</text>
    </view>

    <view v-if="!showCaseStats && (client.case_name || client.case_number)" class="case-info">
      <text v-if="client.case_name" class="case-name">案件：{{ client.case_name }}</text>
      <text v-if="client.case_number" class="case-number">案件编号：{{ client.case_number }}</text>
    </view>

    <!-- 时间信息 -->
    <view class="time-info">
      <view v-if="client.last_followup_at" class="info-item">
        <text class="label">最近跟进：</text>
        <text class="value">{{ formatTime(client.last_followup_at) }}</text>
      </view>
      <view v-if="client.last_deal_time" class="info-item">
        <text class="label">最后成交：</text>
        <text class="value">{{ formatTime(client.last_deal_time) }}</text>
      </view>
      <view v-if="client.next_plan_at" class="info-item">
        <text class="label">下次计划：</text>
        <text class="value">{{ formatTime(client.next_plan_at) }}</text>
      </view>
      <view v-if="recycleReminder" class="info-item reminder-item">
        <text class="label">流入公海提醒：</text>
        <text class="value reminder-text">{{ recycleReminder }}</text>
      </view>
    </view>

    <!-- 标签：催收类别、保全、回收风险 -->
    <view v-if="hasTags" class="tags">
      <view
        v-for="category in client.collection_category"
        :key="category"
        class="tag"
        :style="{ color: getCategoryColor(category), backgroundColor: `${getCategoryColor(category)}15` }"
      >
        {{ getCategoryLabel(category) }}
      </view>
      <view
        v-if="client.preservation_status === 'preserved'"
        class="tag"
        style="color: #409EFF; background-color: #409EFF15;"
      >
        保全
      </view>
      <view
        v-if="client.recycle_risk_level && client.recycle_risk_level !== 'none'"
        class="tag risk-tag"
        :style="{ color: getRiskColor(client.recycle_risk_level), backgroundColor: `${getRiskColor(client.recycle_risk_level)}15` }"
      >
        {{ getRiskLabel(client.recycle_risk_level) }}
      </view>
    </view>

    <view v-if="showCaseStats" class="case-stats">
      <text class="case-stat-item">案件总数 {{ client.total_cases || 0 }}</text>
      <text class="case-stat-item">交案 {{ client.case_count || 0 }}</text>
      <text class="case-stat-item">回款 {{ client.payment_count || 0 }}</text>
      <text class="case-stat-item">赢单 {{ client.won_count || 0 }}</text>
    </view>

    <!-- 底部：经办人（左） + 跟进情况（右对齐，与经办人拉开间距） -->
    <view class="card-footer">
      <view v-if="showOwner" class="owner-block">
        <text class="owner-label">经办人：</text>
        <text class="owner-names">{{ ownerDisplay }}</text>
      </view>
      <view class="stats-block">
        <text class="stat-item">跟进{{ client.followup_count || 0 }}</text>
        <text
          class="stat-item"
          :class="{ highlight: (client.valid_followup_count || 0) > 0 }"
        >
          有效{{ client.valid_followup_count || 0 }}
        </text>
      </view>
    </view>

    <!-- 操作按钮（按角色显示） -->
    <view v-if="showActions" class="card-actions">
      <!-- 公海客户按钮逻辑 -->
      <template v-if="client.status === 'PUBLIC_POOL'">
        <!-- 销售角色（SALES）：只显示申领按钮 -->
        <view
          v-if="roleLevel === 'SALES'"
          class="action-btn claim-btn"
          @click.stop="handleClaim"
        >
          <text>申领</text>
        </view>
        <!-- 团队管理角色（TEAM）：同时显示申领和分配两个按钮（双重职能） -->
        <template v-if="roleLevel === 'TEAM'">
          <view
            class="action-btn claim-btn"
            @click.stop="handleClaim"
          >
            <text>申领</text>
          </view>
          <view
            class="action-btn assign-btn"
            @click.stop="handleAssign"
          >
            <text>分配</text>
          </view>
        </template>
        <!-- BRANCH角色：同时显示申领和分配两个按钮（双重职能） -->
        <template v-if="roleLevel === 'BRANCH' && isManager">
          <view
            class="action-btn claim-btn"
            @click.stop="handleClaim"
          >
            <text>申领</text>
          </view>
          <view
            class="action-btn assign-btn"
            @click.stop="handleAssign"
          >
            <text>分配</text>
          </view>
        </template>
        <!-- HQ角色：只显示分配按钮，不能申领 -->
        <view
          v-if="roleLevel === 'HQ' && isManager"
          class="action-btn assign-btn"
          @click.stop="handleAssign"
        >
          <text>分配</text>
        </view>
      </template>
      <!-- 管理角色：仅在有待审核申请时显示审核按钮 -->
      <view
        v-if="isManager && client.status !== 'PUBLIC_POOL' && hasPendingApproval"
        class="action-btn audit-btn"
        @click.stop="handleAudit"
      >
        <text>审核</text>
      </view>
    </view>

    <view v-if="showSalesActionBar" class="sales-actions">
      <view class="sales-action sales-followup" @click.stop="handleFollowup">
        <SvgIcon name="foot" :size="28" color="#409EFF" />
        <text class="sales-action-text">{{ salesLabels.followup }}</text>
      </view>
      <view v-if="planActionText" class="sales-action sales-plan" @click.stop="handlePlan">
        <SvgIcon name="file-document" :size="28" color="#409EFF" />
        <text class="sales-action-text">{{ planActionText }}</text>
      </view>
      <view v-if="canConfirmContract" class="sales-action sales-contract" @click.stop="handleContract">
        <SvgIcon name="target" :size="28" color="#409EFF" />
        <text class="sales-action-text">{{ salesLabels.contract }}</text>
      </view>
      <view v-if="canAddPayment" class="sales-action sales-payment" @click.stop="handlePayment">
        <SvgIcon name="shopping" :size="28" color="#409EFF" />
        <text class="sales-action-text">{{ salesLabels.payment }}</text>
      </view>
      <view v-if="canAddLegalFee" class="sales-action sales-legal" @click.stop="handleLegal">
        <SvgIcon name="file-document" :size="28" color="#409EFF" />
        <text class="sales-action-text">{{ salesLabels.legal }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ClientListItem } from '@/types/interfaces/client'
import { COLLECTION_CATEGORY_MAP, RECYCLE_RISK_LEVEL_MAP } from '@/utils/client-enums'
import { getCategoryLabel as getClientCategoryLabel, getCategoryStyle, getGradeStyle } from '@/utils/client-enums'
import SalesStageTag from '@/components/SalesStageTag/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import dayjs from 'dayjs'

interface Props {
  client: ClientListItem
  showOwner?: boolean // 是否显示经办人（管理视角）
  showActions?: boolean // 是否显示操作按钮
  isManager?: boolean // 是否为管理角色
  roleLevel?: string // 用户角色级别：'HQ' | 'BRANCH' | 'TEAM' | 'SALES'
  showCaseStats?: boolean
  showSalesActions?: boolean
  salesStage?: string
  currentUserId?: string | number
  currentUserTeamId?: string | number // 当前用户的团队ID（用于TEAM角色权限检查）
  currentUserBranchId?: string | number // 当前用户的分所ID（用于BRANCH角色权限检查）
  hasPendingApproval?: boolean // 是否有待审核申请
}

const props = withDefaults(defineProps<Props>(), {
  showOwner: false,
  showActions: false,
  isManager: false,
  roleLevel: 'SALES',
  showCaseStats: false,
  showSalesActions: false,
  salesStage: '',
  currentUserId: '',
  currentUserTeamId: '',
  hasPendingApproval: false
})

const emit = defineEmits<{
  click: [client: ClientListItem]
  claim: [client: ClientListItem]
  assign: [client: ClientListItem]
  audit: [client: ClientListItem]
  followup: [client: ClientListItem]
  plan: [client: ClientListItem]
  contract: [client: ClientListItem]
  payment: [client: ClientListItem]
  legal: [client: ClientListItem]
}>()

  const ownerDisplay = computed(() => {
    // 多经办人：兼容 handler_names / handlerNames（后端可能返回 snake_case 或 camelCase）
    const rawNames = props.client.handler_names ?? (props.client as any).handlerNames
    const namesArr = Array.isArray(rawNames) && rawNames.length > 0
      ? rawNames.map((s: any) => String(s ?? '').trim()).filter(Boolean)
      : typeof rawNames === 'string' && String(rawNames).trim()
        ? String(rawNames).split(/[、,，;；]/).map((s: string) => s.trim()).filter(Boolean)
        : []
    if (namesArr.length > 0) return namesArr.join('、')
    const handlers = (props.client as any).handlers
    if (Array.isArray(handlers) && handlers.length > 0) {
      const fromHandlers = handlers.map((h: any) => (h && (h.name || h.username)) || '').filter(Boolean)
      if (fromHandlers.length > 0) return fromHandlers.join('、')
    }
    if (props.client.owner_user_name) return props.client.owner_user_name
    if (props.client.owner_user_id) return `ID:${props.client.owner_user_id}`
    return '未分配'
  })

const gradeStyle = computed(() => {
  if (!props.client.grade) return {}
  return getGradeStyle(props.client.grade)
})

const resolvedCategory = computed(() => {
  return props.client.category || (props.client as any).client_category || ''
})

const categoryStyle = computed(() => {
  if (!resolvedCategory.value) return {}
  return getCategoryStyle(resolvedCategory.value as any)
})

const categoryLabel = computed(() => {
  return getClientCategoryLabel(resolvedCategory.value)
})

const displayName = computed(() => {
  return props.client.client_name || props.client.customer_name || ''
})

const hasTags = computed(() => {
  return (
    (props.client.collection_category && props.client.collection_category.length > 0) ||
    props.client.preservation_status === 'preserved' ||
    (props.client.recycle_risk_level && props.client.recycle_risk_level !== 'none')
  )
})

const parseDeadline = (deadline: string) => {
  const normalized = (deadline || '').replace(/\//g, '-').trim()
  const formats = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm']
  let parsed = dayjs(normalized, formats, true)
  if (!parsed.isValid()) {
    parsed = dayjs(deadline)
  }
  return parsed.isValid() ? parsed : null
}

const recycleReminder = computed(() => {
  const deadline = props.client.recycle_deadline
  if (!deadline) return ''
  const end = parseDeadline(deadline)
  if (!end) return ''
  const days = end.startOf('day').diff(dayjs().startOf('day'), 'day')
  if (days < 0) return `已超期${Math.abs(days)}天`
  return `剩余${days}天`
})

const salesLabels = {
  followup: '跟进情况',
  contract: '确认合同',
  payment: '录入回款',
  legal: '录入律师费'
}

const resolvedSalesStage = computed(() => {
  return props.salesStage || props.client.sales_stage || ''
})

const planActionText = computed(() => {
  const stage = resolvedSalesStage.value
  if (stage === 'WON') return '收款进度'
  if (['BLANK', 'MEETING', 'FOLLOW_UP'].includes(stage)) return '有效交案'
  if (stage === 'CASE') return '办案计划'
  if (stage === 'PAYMENT') return '回款跟进'
  return ''
})

const canConfirmContract = computed(() => {
  return props.client.status === 'FOLLOW_UP'
})

const canAddPayment = computed(() => {
  return props.client.status === 'CASE'
})

const canAddLegalFee = computed(() => {
  return props.client.status === 'PAYMENT'
})

const showSalesActionBar = computed(() => {
  // SALES、TEAM 和 BRANCH 角色都可以显示销售操作按钮
  if (!props.showSalesActions || (props.roleLevel !== 'SALES' && props.roleLevel !== 'TEAM' && props.roleLevel !== 'BRANCH')) return false
  if (props.client.status === 'PUBLIC_POOL') return false
  const currentUserId = String(props.currentUserId || '').trim()
    const ownerId = String(props.client.owner_user_id || '').trim()
    const handlerIds = (props.client.handler_ids || []).map((id) => String(id).trim())
  
  // SALES 角色：只能操作自己的客户
    if (props.roleLevel === 'SALES' && currentUserId) {
      if (handlerIds.length > 0 && !handlerIds.includes(currentUserId)) return false
      if (handlerIds.length === 0 && ownerId && currentUserId !== ownerId) return false
    }
  
  // TEAM 角色：只能操作本团队内的客户
  if (props.roleLevel === 'TEAM') {
    const currentUserTeamId = String(props.currentUserTeamId || '').trim()
    const clientTeamId = String(props.client.team_id || '').trim()
    // 如果客户有团队ID，必须匹配当前用户的团队ID
    if (clientTeamId && currentUserTeamId && clientTeamId !== currentUserTeamId) return false
    // 如果客户没有团队ID，可能是公海客户或未分配团队的客户，TEAM角色不能操作
    // 但这里已经排除了PUBLIC_POOL状态，所以如果客户没有team_id，可能是数据问题，暂时允许操作
  }
  
  // BRANCH 角色：只能操作本分所内的客户，或者是自己负责的客户
  if (props.roleLevel === 'BRANCH') {
    const currentUserBranchId = String(props.currentUserBranchId || '').trim()
    const clientBranchId = String(props.client.branch_id || '').trim()
    
    // 如果是自己负责的客户，可以操作
      if (currentUserId && (handlerIds.includes(currentUserId) || (ownerId && currentUserId === ownerId))) return true
    
    // 如果是本分所的客户，可以操作
    if (clientBranchId && currentUserBranchId && clientBranchId === currentUserBranchId) return true
    
    return false
  }
  
  return true
})

function getCategoryColor(category: string) {
  return COLLECTION_CATEGORY_MAP[category]?.color || '#909399'
}

function getCategoryLabel(category: string) {
  return COLLECTION_CATEGORY_MAP[category]?.label || category
}

function getRiskColor(level: string) {
  return RECYCLE_RISK_LEVEL_MAP[level]?.color || '#909399'
}

function getRiskLabel(level: string) {
  return RECYCLE_RISK_LEVEL_MAP[level]?.label || level
}

function formatTime(time: string) {
  if (!time) return ''
  // 简单格式化：只显示月-日 时:分
  const date = new Date(time)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}

function handleClick() {
  emit('click', props.client)
}

function handleClaim() {
  emit('claim', props.client)
}

function handleAssign() {
  emit('assign', props.client)
}

function handleAudit() {
  emit('audit', props.client)
}

function handleFollowup() {
  emit('followup', props.client)
}

function handlePlan() {
  emit('plan', props.client)
}

function handleContract() {
  emit('contract', props.client)
}

function handlePayment() {
  emit('payment', props.client)
}

function handleLegal() {
  emit('legal', props.client)
}
</script>

<style scoped lang="scss">
.client-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.name-grade {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
}

.category-tag-inline {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.client-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.grade-tag {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  font-size: 22rpx;
}


.grade-text {
  font-weight: 600;
}

.grade-source {
  opacity: 0.8;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 16rpx;
  font-size: 26rpx;
  color: #606266;
}

.case-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 16rpx;
  font-size: 24rpx;
  color: #606266;
}

.case-number {
  color: #909399;
}

.mobile {
  color: #909399;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 24rpx;
}

.reminder-text {
  color: #F56C6C;
  font-weight: 500;
}

.label {
  color: #909399;
}

.value {
  color: #606266;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.case-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx 20rpx;
  margin-bottom: 16rpx;
  font-size: 24rpx;
  color: #606266;
}

.case-stat-item {
  color: #606266;
}

.tag {
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  font-size: 22rpx;
}

.risk-tag {
  font-weight: 500;
}

.card-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #EBEEF5;
  font-size: 24rpx;
}

.owner-block {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.owner-label {
  flex-shrink: 0;
  color: #909399;
}

.owner-names {
  flex: 1;
  color: #303133;
  word-break: break-all;
  line-height: 1.4;
}

.stats-block {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-left: 24rpx;
}

.stat-item {
  color: #909399;
}

.stat-item.highlight {
  color: #67C23A;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #EBEEF5;
}

.sales-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-top: 20rpx;
  justify-content: space-between;
}

/* 参考图一：圆角描边按钮风格，但保留原来的尺寸占位 */
.sales-action {
  flex: 0 0 auto;
  min-width: 180rpx;
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  background-color: #ffffff;
  border: 2rpx solid #409EFF;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.sales-action-text {
  font-size: 24rpx;
  color: #409EFF;
}

.action-btn {
  flex: 1;
  height: 64rpx;
  line-height: 64rpx;
  text-align: center;
  border-radius: 8rpx;
  font-size: 26rpx;
  font-weight: 500;
}

.claim-btn {
  background: #409EFF;
  color: #fff;
}

.assign-btn {
  background: #67C23A;
  color: #fff;
}

.audit-btn {
  background: #E6A23C;
  color: #fff;
}
</style>
