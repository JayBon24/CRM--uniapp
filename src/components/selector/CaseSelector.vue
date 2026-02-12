<template>
  <view class="selector-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <text class="search-icon">🔍</text>
        <input
          v-model="searchKeyword"
          class="search-input"
          placeholder="搜索案件编号、案件名称、当事人"
          placeholder-class="search-placeholder"
          @input="onSearchInput"
        />
        <text v-if="searchKeyword" class="clear-icon" @tap="onClearSearch">✕</text>
      </view>
      <view class="cancel-btn" @tap="onCancel">取消</view>
    </view>

    <!-- 案件列表 -->
    <scroll-view
      class="list-container"
      scroll-y
      @scrolltolower="onLoadMore"
    >
      <view v-if="loading && cases.length === 0" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="cases.length === 0" class="empty-state">
        <text class="empty-icon">📁</text>
        <text class="empty-text">{{ searchKeyword ? '未找到相关案件' : '暂无案件数据' }}</text>
      </view>

      <view v-else class="case-list">
        <view
          v-for="caseItem in cases"
          :key="caseItem.id"
          class="case-item"
          :class="{ selected: selectedId === caseItem.id }"
          @tap="onSelectCase(caseItem)"
        >
          <view class="case-info">
            <view class="case-header">
              <view class="case-name">{{ caseItem.case_name }}</view>
              <view class="case-status" :class="`status-${caseItem.case_status}`">
                {{ getCaseStatusText(caseItem.case_status) }}
              </view>
            </view>
            <view class="case-number">{{ caseItem.case_number }}</view>
            <view class="case-meta">
              <text v-if="caseItem.plaintiff_name" class="meta-item">
                原告: {{ caseItem.plaintiff_name }}
              </text>
              <text v-if="caseItem.defendant_name" class="meta-item">
                被告: {{ caseItem.defendant_name }}
              </text>
            </view>
          </view>
          <view v-if="selectedId === caseItem.id" class="check-icon">✓</view>
        </view>
      </view>

      <view v-if="hasMore && !loading" class="load-more" @tap="onLoadMore">
        <text class="load-more-text">加载更多</text>
      </view>

      <view v-if="loading && cases.length > 0" class="loading-more">
        <text class="loading-text">加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted } from 'vue'
import { getCaseList } from '@/api/case'
import type { Case, CaseStatus } from '@/types/interfaces/case'

const emit = defineEmits<{
  select: [caseItem: { id: number; name: string }]
  cancel: []
}>()

const searchKeyword = ref('')
const cases = ref<Case[]>([])
const selectedId = ref<number>()
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

let searchTimer: any = null

onMounted(() => {
  loadCases()
})

async function loadCases(isLoadMore = false) {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const res = await getCaseList({
      page: page.value,
      limit: 20,
      search: searchKeyword.value || undefined
    })
    
    // 防御性编程：确保响应格式正确
    // 支持多种数据格式：
    // 1. {results: [], count: 0} - 标准分页格式
    // 2. {data: {results: [], count: 0}} - 嵌套数据格式
    // 3. [...] - 直接数组格式（后端实际返回格式）
    const resData = res as any
    const caseList = resData?.results || resData?.data?.results || (Array.isArray(res) ? res : [])
    const totalCount = resData?.count || resData?.data?.count || caseList.length
    
    if (isLoadMore) {
      cases.value = [...cases.value, ...caseList]
    } else {
      cases.value = caseList
    }
    
    hasMore.value = cases.value.length < totalCount
  } catch (error) {
    console.error('加载案件列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
    // 发生错误时重置列表，避免显示错误数据
    if (!isLoadMore) {
      cases.value = []
    }
  } finally {
    loading.value = false
  }
}

function onSearchInput() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    hasMore.value = true
    loadCases()
  }, 500)
}

function onClearSearch() {
  searchKeyword.value = ''
  page.value = 1
  hasMore.value = true
  loadCases()
}

function onLoadMore() {
  if (!hasMore.value || loading.value) return
  page.value++
  loadCases(true)
}

function onSelectCase(caseItem: Case) {
  selectedId.value = caseItem.id
  emit('select', {
    id: caseItem.id,
    name: caseItem.case_name
  })
  
  // 延迟一下让用户看到选中效果
  setTimeout(() => {
    uni.navigateBack()
  }, 200)
}

function onCancel() {
  emit('cancel')
  uni.navigateBack()
}

function getCaseStatusText(status: CaseStatus): string {
  const statusMap: Record<CaseStatus, string> = {
    draft: '草稿',
    in_progress: '进行中',
    closed: '已结案',
    archived: '已归档'
  }
  return statusMap[status] || status
}
</script>

<style scoped lang="scss">
.selector-page {
  min-height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 32rpx;
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  height: 72rpx;
  padding: 0 24rpx;
  background: #f7f8fa;
  border-radius: 36rpx;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #1f2329;
}

.search-placeholder {
  color: #c9cdd4;
}

.clear-icon {
  font-size: 32rpx;
  color: #c9cdd4;
  padding: 8rpx;
}

.cancel-btn {
  font-size: 28rpx;
  color: #3370ff;
}

.list-container {
  flex: 1;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
  opacity: 0.3;
}

.empty-text,
.loading-text {
  font-size: 28rpx;
  color: #8f959e;
}

.case-list {
  padding: 16rpx 0;
}

.case-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
  transition: background 0.2s;

  &:active {
    background: #f7f8fa;
  }

  &.selected {
    background: #e8f3ff;
  }
}

.case-info {
  flex: 1;
}

.case-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.case-name {
  flex: 1;
  font-size: 30rpx;
  color: #1f2329;
  font-weight: 500;
}

.case-status {
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
  font-size: 22rpx;
  
  &.status-draft {
    background: #f7f8fa;
    color: #8f959e;
  }
  
  &.status-in_progress {
    background: #e8f3ff;
    color: #3370ff;
  }
  
  &.status-closed {
    background: #e8ffea;
    color: #00b42a;
  }
  
  &.status-archived {
    background: #f7f8fa;
    color: #8f959e;
  }
}

.case-number {
  font-size: 24rpx;
  color: #8f959e;
  margin-bottom: 12rpx;
}

.case-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #8f959e;
}

.check-icon {
  font-size: 40rpx;
  color: #3370ff;
  font-weight: bold;
  margin-left: 16rpx;
}

.load-more,
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.load-more-text {
  font-size: 28rpx;
  color: #3370ff;
}
</style>
