<template>
  <view class="filter-bar">
    <!-- 搜索框 -->
    <view class="search-box">
      <input
        v-model="searchKeyword"
        class="search-input"
        placeholder="搜索客户名/手机号"
        confirm-type="search"
        @confirm="handleSearch"
      />
      <view class="search-icon" @click="handleSearch">
        <text>🔍</text>
      </view>
    </view>

    <!-- 筛选按钮 -->
    <view class="filter-buttons">
      <view class="filter-btn" @click="showFilterPopup = true">
        <text>筛选</text>
        <text v-if="filterCount > 0" class="filter-count">{{ filterCount }}</text>
      </view>
      <view class="filter-btn" @click="showSortPopup = true">
        <text>排序</text>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <u-popup v-model:show="showFilterPopup" mode="bottom" :round="20">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">筛选</text>
          <text class="popup-reset" @click="handleReset">重置</text>
        </view>

        <view v-if="props.showCaseStatusFilter" class="filter-section">
          <text class="section-title">客户状态</text>
          <view class="filter-options">
            <view
              v-for="status in caseStatusOptions"
              :key="status.value"
              class="option-item"
              :class="{ active: filterData.status === status.value || filterData.sales_stage === status.value }"
              @click="toggleCaseStatus(status.value)"
            >
              {{ status.label }}
            </view>
          </view>
        </view>

        <view class="filter-section">
          <text class="section-title">客户等级</text>
          <view class="filter-options">
            <view
              v-for="grade in gradeOptions"
              :key="grade.value"
              class="option-item"
              :class="{ active: filterData.grade === grade.value }"
              @click="filterData.grade = filterData.grade === grade.value ? undefined : grade.value"
            >
              {{ grade.label }}
            </view>
          </view>
        </view>

        <view class="filter-section">
          <text class="section-title">催收类别</text>
          <view class="filter-options">
            <view
              v-for="category in collectionCategoryOptions"
              :key="category.value"
              class="option-item"
              :class="{ active: (filterData.collection_category || []).includes(category.value) }"
              @click="toggleCollectionCategory(category.value)"
            >
              {{ category.label }}
            </view>
          </view>
        </view>

        <view class="filter-section">
          <text class="section-title">回收风险</text>
          <view class="filter-options">
            <view
              v-for="risk in riskOptions"
              :key="risk.value"
              class="option-item"
              :class="{ active: filterData.recycle_risk_level === risk.value }"
              @click="filterData.recycle_risk_level = filterData.recycle_risk_level === risk.value ? undefined : risk.value"
            >
              {{ risk.label }}
            </view>
          </view>
        </view>

        <!-- 管理视角：经办人/团队/分所筛选（一期先做最小可用：ID输入） -->
        <view v-if="props.showManagerFilters" class="filter-section">
          <text class="section-title">管理筛选</text>
          <view class="manager-inputs">
            <view class="manager-item">
              <text class="manager-label">经办人ID</text>
              <input v-model="filterData.owner_user_id" class="manager-input" placeholder="例如：1" />
            </view>
            <view class="manager-item">
              <text class="manager-label">团队ID</text>
              <input v-model="filterData.team_id" class="manager-input" placeholder="例如：1001" />
            </view>
            <view class="manager-item">
              <text class="manager-label">分所ID</text>
              <input v-model="filterData.branch_id" class="manager-input" placeholder="例如：2001" />
            </view>
          </view>
        </view>

        <view class="popup-footer">
          <button class="cancel-btn" @click="showFilterPopup = false">取消</button>
          <button class="confirm-btn" type="primary" @click="handleConfirmFilter">确定</button>
        </view>
      </view>
    </u-popup>

    <!-- 排序弹窗 -->
    <u-popup v-model:show="showSortPopup" mode="bottom" :round="20">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">排序</text>
        </view>

        <view class="sort-options">
          <view
            v-for="sort in sortOptions"
            :key="sort.value"
            class="sort-item"
            :class="{ active: filterData.order_by === sort.value }"
            @click="handleSort(sort.value)"
          >
            <text>{{ sort.label }}</text>
            <text v-if="filterData.order_by === sort.value" class="check">✓</text>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed } from 'vue'
import type { ClientGrade, RecycleRiskLevel, ClientStatus, SalesStage, CollectionCategory } from '@/types/interfaces/client'
import { COLLECTION_CATEGORY_MAP } from '@/utils/client-enums'

interface FilterData {
  keyword?: string
  status?: ClientStatus
  sales_stage?: SalesStage
  sales_stage_list?: SalesStage[]
  grade?: ClientGrade
  collection_category?: CollectionCategory[]
  recycle_risk_level?: RecycleRiskLevel
  owner_user_id?: string | number
  team_id?: string | number
  branch_id?: string | number
  order_by?: 'last_followup' | 'create_time' | 'last_visit'
  order_direction?: 'asc' | 'desc'
}

interface Props {
  modelValue?: FilterData
  showManagerFilters?: boolean
  showCaseStatusFilter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showManagerFilters: false,
  showCaseStatusFilter: false
})
const emit = defineEmits<{
  'update:modelValue': [value: FilterData]
  search: [keyword: string]
  filter: [data: FilterData]
  reset: []
}>()

const searchKeyword = ref('')
const showFilterPopup = ref(false)
const showSortPopup = ref(false)

const caseStatusOptions = [
  { label: '公海', value: 'PUBLIC_POOL' },
  { label: '商机', value: 'BLANK' },
  { label: '跟进', value: 'MEETING' },
  { label: '交案', value: 'CASE' },
  { label: '回款', value: 'PAYMENT' },
  { label: '赢单', value: 'WON' }
]

const filterData = ref<FilterData>({
  order_by: 'create_time',
  order_direction: 'desc',
  ...(props.modelValue || {})
})

const gradeOptions = [
  { value: 'A' as ClientGrade, label: 'A级' },
  { value: 'B' as ClientGrade, label: 'B级' },
  { value: 'C' as ClientGrade, label: 'C级' },
  { value: 'D' as ClientGrade, label: 'D级' }
]

const collectionCategoryOptions = Object.entries(COLLECTION_CATEGORY_MAP).map(([value, config]) => ({
  value: value as CollectionCategory,
  label: config.label
}))

const riskOptions = [
  { value: 'low' as RecycleRiskLevel, label: '低风险' },
  { value: 'medium' as RecycleRiskLevel, label: '中风险' },
  { value: 'high' as RecycleRiskLevel, label: '高风险' }
]

const sortOptions = [
  { value: 'create_time' as const, label: '最近创建' },
  { value: 'last_followup' as const, label: '最近跟进' },
  { value: 'last_visit' as const, label: '最近拜访' }
]

const filterCount = computed(() => {
  let count = 0
  if (filterData.value.status || filterData.value.sales_stage) count++
  if (filterData.value.grade) count++
  if (filterData.value.collection_category && filterData.value.collection_category.length > 0) count++
  if (filterData.value.recycle_risk_level) count++
  if (filterData.value.owner_user_id) count++
  if (filterData.value.team_id) count++
  if (filterData.value.branch_id) count++
  return count
})

function toggleCollectionCategory(category: CollectionCategory) {
  if (!filterData.value.collection_category) {
    filterData.value.collection_category = []
  }
  const index = filterData.value.collection_category.indexOf(category)
  if (index > -1) {
    filterData.value.collection_category.splice(index, 1)
  } else {
    filterData.value.collection_category.push(category)
  }
}

function toggleCaseStatus(value: 'PUBLIC_POOL' | SalesStage) {
  if (filterData.value.status === value || filterData.value.sales_stage === value) {
    filterData.value.status = undefined
    filterData.value.sales_stage = undefined
    return
  }

  if (value === 'PUBLIC_POOL') {
    filterData.value.status = 'PUBLIC_POOL'
    filterData.value.sales_stage = undefined
  } else {
    filterData.value.sales_stage = value as SalesStage
    filterData.value.status = undefined
  }
}

function handleSearch() {
  emit('search', searchKeyword.value)
}

function handleConfirmFilter() {
  emit('filter', filterData.value)
  emit('update:modelValue', filterData.value)
  showFilterPopup.value = false
}

function handleSort(orderBy: 'last_followup' | 'create_time' | 'last_visit') {
  filterData.value.order_by = orderBy
  emit('filter', filterData.value)
  emit('update:modelValue', filterData.value)
  showSortPopup.value = false
}

function handleReset() {
  filterData.value = {
    order_by: 'create_time',
    order_direction: 'desc'
  }
  searchKeyword.value = ''
  emit('reset')
  showFilterPopup.value = false
}
</script>

<style scoped lang="scss">
.filter-bar {
  background: #fff;
  padding: 20rpx;
}

.search-box {
  display: flex;
  align-items: center;
  background: #F5F7FA;
  border-radius: 8rpx;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
}

.search-input {
  flex: 1;
  height: 64rpx;
  font-size: 28rpx;
}

.search-icon {
  padding: 10rpx;
  font-size: 32rpx;
}

.filter-buttons {
  display: flex;
  gap: 20rpx;
}

.manager-inputs {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  margin-top: 12rpx;
}

.manager-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.manager-label {
  font-size: 26rpx;
  color: #606266;
  width: 140rpx;
  flex: 0 0 auto;
}

.manager-input {
  flex: 1;
  height: 64rpx;
  padding: 0 16rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 26rpx;
  box-sizing: border-box;
}

.filter-btn {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #606266;
}

.filter-count {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  padding: 0 8rpx;
  background: #F56C6C;
  color: #fff;
  font-size: 20rpx;
  border-radius: 16rpx;
  text-align: center;
}

.popup-content {
  padding: 40rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.popup-reset {
  font-size: 28rpx;
  color: #409EFF;
}

.filter-section {
  margin-bottom: 40rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #303133;
  margin-bottom: 20rpx;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.option-item {
  padding: 16rpx 32rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #606266;
}

.option-item.active {
  background: #ECF5FF;
  color: #409EFF;
}

.popup-footer {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  border-radius: 8rpx;
}

.cancel-btn {
  background: #F5F7FA;
  color: #606266;
}

.sort-options {
  padding: 20rpx 0;
}

.sort-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #303133;
}

.sort-item.active {
  color: #409EFF;
}

.check {
  font-size: 32rpx;
  font-weight: 600;
}
</style>

