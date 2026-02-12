<template>
  <view class="container">
    <!-- 搜索和筛选栏 -->
    <view class="filter-bar">
      <view class="search-box">
        <u-icon name="search" size="18" color="#909399"></u-icon>
        <input
          v-model="searchKeyword"
          class="search-input"
          placeholder="搜索客户名/手机号"
          placeholder-style="color: #C0C4CC"
          @input="handleSearch"
        />
        <u-icon
          v-if="searchKeyword"
          name="close-circle"
          size="18"
          color="#C0C4CC"
          @click="clearSearch"
        ></u-icon>
      </view>
      
      <view class="filter-buttons">
        <view class="filter-btn" @click="showFilterPopup = true">
          <u-icon name="list" size="18" color="#667eea"></u-icon>
          <text class="filter-text">筛选</text>
          <u-badge v-if="hasActiveFilters" :value="activeFilterCount" :max="99" type="error"></u-badge>
        </view>
      </view>
    </view>
    
    <!-- 筛选弹窗 -->
    <u-popup :show="showFilterPopup" mode="bottom" @close="showFilterPopup = false" round="16">
      <view class="filter-popup">
        <view class="popup-header">
          <text class="popup-title">筛选条件</text>
          <u-icon name="close" @click="showFilterPopup = false"></u-icon>
        </view>
        
        <scroll-view class="filter-content" scroll-y>
          <!-- 客户等级筛选 -->
          <view class="filter-section">
            <text class="section-title">客户等级</text>
            <view class="grade-options">
              <view
                v-for="grade in ['A', 'B', 'C', 'D']"
                :key="grade"
                class="grade-option"
                :class="{ active: filters.grade === grade }"
                @click="toggleGrade(grade)"
              >
                <text>{{ grade }}</text>
              </view>
            </view>
          </view>
          
          <!-- 来源渠道筛选 -->
          <view class="filter-section">
            <text class="section-title">来源渠道</text>
            <view class="source-options">
              <view
                v-for="source in sourceChannels"
                :key="source"
                class="source-option"
                :class="{ active: filters.source_channel === source }"
                @click="toggleSource(source)"
              >
                <text>{{ source }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="popup-footer">
          <u-button text="重置" @click="resetFilters"></u-button>
          <u-button type="primary" text="确定" @click="applyFilters"></u-button>
        </view>
      </view>
    </u-popup>
    
    <view class="list-container">
      <view v-if="loading && list.length === 0" class="loading-box">
        <u-loading-icon mode="spinner" size="32"></u-loading-icon>
      </view>
      
      <u-empty v-else-if="list.length === 0" mode="data" text="暂无待分配线索"></u-empty>
      
      <view v-else class="list">
        <view v-for="item in list" :key="item.id" class="lead-card" @click="toggleSelect(item)">
          <view class="card-left">
            <view class="checkbox" :class="{ checked: isSelected(item) }">
              <u-icon v-if="isSelected(item)" name="checkbox-mark" color="#fff" size="14"></u-icon>
            </view>
          </view>
          <view class="card-content">
            <view class="name-row">
              <text class="name">{{ item.client_name }}</text>
              <view class="tag-group">
                <u-tag :text="getStatusLabel(item)" size="mini" type="info" plain></u-tag>
                <u-tag :text="item.grade || '未标记'" size="mini" :type="getGradeType(item.grade)" plain></u-tag>
              </view>
            </view>
            <view class="info-row">
              <text class="label">联系人：</text>
              <text class="value">{{ item.contact_name || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="label">手机号：</text>
              <text class="value">{{ item.mobile || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="label">来源：</text>
              <text class="value">{{ item.source_channel || '未知' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view v-if="selectedIds.length > 0" class="bottom-bar">
      <view class="count-info">
        已选择 <text class="count">{{ selectedIds.length }}</text> 条线索
      </view>
      <u-button type="primary" text="指派经办人" @click="handleAssign"></u-button>
    </view>

    <!-- 人员选择弹窗 -->
    <OwnerSelector
      v-model="showUserSelector"
      title="选择指派对象"
      @confirm="handleOwnerConfirm"
      @close="showUserSelector = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getClientList, assignClient } from '@/api/client'
import type { ClientListItem } from '@/types/interfaces/client'
import OwnerSelector from '@/components/OwnerSelector/index.vue'

const list = ref<ClientListItem[]>([])
const allList = ref<ClientListItem[]>([]) // 完整列表，用于筛选
const loading = ref(false)
const selectedIds = ref<number[]>([])
const showUserSelector = ref(false)
const showFilterPopup = ref(false)

// 搜索关键词
const searchKeyword = ref('')

// 筛选条件
const filters = ref<{
  grade?: string
  source_channel?: string
}>({})

// 来源渠道选项
const sourceChannels = ['官网', '电话', '展会', '转介绍', '其他']

// 是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return !!(filters.value.grade || filters.value.source_channel)
})

// 激活的筛选条件数量
const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.grade) count++
  if (filters.value.source_channel) count++
  return count
})


async function fetchLeads() {
  loading.value = true
  try {
    const pageSize = 100
    let page = 1
    let total = 0
    const merged: ClientListItem[] = []

    while (true) {
      const res = await getClientList({ status: 'PUBLIC_POOL', page, pageSize })
      const rows = res.rows || []
      if (page === 1) {
        total = res.total || rows.length
      }
      merged.push(...rows)

      if (!rows.length || merged.length >= total) {
        break
      }
      page += 1
      if (page > 50) {
        break
      }
    }

    allList.value = merged
    applyFilters() // 应用筛选
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  applyFilters()
}

// 清空搜索
function clearSearch() {
  searchKeyword.value = ''
  applyFilters()
}

// 切换客户等级
function toggleGrade(grade: string) {
  if (filters.value.grade === grade) {
    filters.value.grade = undefined
  } else {
    filters.value.grade = grade
  }
}

// 切换来源渠道
function toggleSource(source: string) {
  if (filters.value.source_channel === source) {
    filters.value.source_channel = undefined
  } else {
    filters.value.source_channel = source
  }
}

// 重置筛选
function resetFilters() {
  filters.value = {}
  searchKeyword.value = ''
  applyFilters()
}

// 应用筛选
function applyFilters() {
  let filtered = [...allList.value]
  
  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.client_name?.toLowerCase().includes(keyword) ||
      item.mobile?.includes(keyword) ||
      item.contact_name?.toLowerCase().includes(keyword)
    )
  }
  
  // 客户等级过滤
  if (filters.value.grade) {
    filtered = filtered.filter(item => item.grade === filters.value.grade)
  }
  
  // 来源渠道过滤
  if (filters.value.source_channel) {
    filtered = filtered.filter(item => item.source_channel === filters.value.source_channel)
  }
  
  list.value = filtered
  showFilterPopup.value = false
}

function isSelected(item: ClientListItem) {
  return selectedIds.value.includes(item.id as number)
}

function toggleSelect(item: ClientListItem) {
  const index = selectedIds.value.indexOf(item.id as number)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(item.id as number)
  }
}

function getGradeType(grade: string) {
  const map: any = { A: 'error', B: 'warning', C: 'primary', D: 'info' }
  return map[grade] || 'info'
}

function getStatusLabel(item: ClientListItem) {
  if (item.status === 'PUBLIC_POOL') return '公海'
  return '公海'
}

function handleAssign() {
  showUserSelector.value = true
}

async function handleOwnerConfirm(user: any) {
  try {
    // 后端校验：检查分配目标用户的角色，如果是HQ/BRANCH则拒绝
    if (user.roleLevel === 'HQ' || user.roleLevel === 'BRANCH') {
      uni.showToast({ 
        title: '不能分配给管理角色（HQ/BRANCH），只能分配给销售人员（TEAM/SALES）', 
        icon: 'none',
        duration: 3000
      })
      return
    }
    
    uni.showLoading({ title: '正在指派...' })
    
    // 批量指派（Mock 环境循环调用）
    for (const id of selectedIds.value) {
      await assignClient({ 
        client_id: id, 
        owner_user_id: user.id,  // 修改：使用 owner_user_id 而不是 user_id
        target_user_role_level: user.roleLevel // 传递目标用户角色，用于后端校验
      } as any)
    }
    
    uni.hideLoading()
    uni.showToast({ title: '指派成功', icon: 'success' })
    showUserSelector.value = false
    selectedIds.value = []
    fetchLeads() // 刷新列表
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '指派失败', icon: 'none' })
  }
}

onMounted(() => {
  fetchLeads()
})
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.list-container {
  padding: 20rpx;
  padding-bottom: 140rpx;
}

.loading-box {
  padding: 100rpx 0;
  display: flex;
  justify-content: center;
}

.lead-card {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  &:active {
    background: #fafafa;
  }
}

.card-left {
  margin-right: 24rpx;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #dcdfe6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &.checked {
    background-color: #3c9cff;
    border-color: #3c9cff;
  }
}

.card-content {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;

  .name {
    font-size: 32rpx;
    font-weight: bold;
    color: #303133;
  }
}

.tag-group {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.info-row {
  display: flex;
  margin-bottom: 8rpx;
  font-size: 26rpx;

  .label {
    color: #909399;
    width: 120rpx;
  }
  .value {
    color: #606266;
    flex: 1;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
  z-index: 99;

  .count-info {
    font-size: 28rpx;
    color: #606266;
    .count {
      color: #3c9cff;
      font-weight: bold;
      margin: 0 8rpx;
    }
  }

  :deep(.u-button) {
    width: 240rpx;
    margin: 0;
  }
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: #fff;
  border-bottom: 1rpx solid #EBEEF5;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 0 24rpx;
  height: 64rpx;
  background: #F5F7FA;
  border-radius: 32rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #303133;
}

.filter-buttons {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background: #F5F7FA;
  border-radius: 32rpx;
  position: relative;
}

.filter-text {
  font-size: 26rpx;
  color: #667eea;
}

.filter-popup {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.filter-content {
  flex: 1;
  padding: 32rpx;
}

.filter-section {
  margin-bottom: 48rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #606266;
  margin-bottom: 24rpx;
}

.grade-options,
.source-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.grade-option,
.source-option {
  padding: 16rpx 32rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #606266;
  
  &.active {
    background: #667eea;
    color: #fff;
  }
}

.popup-footer {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #EBEEF5;
  
  :deep(.u-button) {
    flex: 1;
  }
}

</style>
