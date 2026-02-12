<template>
  <view class="selector-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <text class="search-icon">🔍</text>
        <input
          v-model="searchKeyword"
          class="search-input"
          placeholder="搜索客户名称、联系人、电话"
          placeholder-class="search-placeholder"
          @input="onSearchInput"
        />
        <text v-if="searchKeyword" class="clear-icon" @tap="onClearSearch">✕</text>
      </view>
      <view class="cancel-btn" @tap="onCancel">取消</view>
    </view>

    <!-- 客户列表 -->
    <scroll-view
      class="list-container"
      scroll-y
      @scrolltolower="onLoadMore"
    >
      <view v-if="loading && customers.length === 0" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="customers.length === 0" class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">{{ searchKeyword ? '未找到相关客户' : '暂无客户数据' }}</text>
      </view>

      <view v-else class="customer-list">
        <view
          v-for="customer in customers"
          :key="customer.id"
          class="customer-item"
          :class="{ selected: selectedId === customer.id }"
          @tap="onSelectCustomer(customer)"
        >
          <view class="customer-info">
            <view class="customer-name">{{ customer.client_name || customer.name }}</view>
            <view class="customer-meta">
              <text v-if="customer.contact_name || customer.contact_person" class="meta-item">
                联系人: {{ customer.contact_name || customer.contact_person }}
              </text>
              <text v-if="customer.mobile || customer.contact_phone" class="meta-item">
                {{ customer.mobile || customer.contact_phone }}
              </text>
            </view>
          </view>
          <view v-if="selectedId === customer.id" class="check-icon">✓</view>
        </view>
      </view>

      <view v-if="hasMore && !loading" class="load-more" @tap="onLoadMore">
        <text class="load-more-text">加载更多</text>
      </view>

      <view v-if="loading && customers.length > 0" class="loading-more">
        <text class="loading-text">加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCaseSourceList } from '@/api/client'
import type { ClientListItem } from '@/types/interfaces/client'

const emit = defineEmits<{
  select: [customer: { id: number; name: string }]
  cancel: []
}>()

const searchKeyword = ref('')
const customers = ref<ClientListItem[]>([])
const selectedId = ref<number>()
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

let searchTimer: any = null

onMounted(() => {
  loadCustomers()
})

async function loadCustomers(isLoadMore = false) {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const res = await getCaseSourceList({
      page: page.value,
      pageSize: 20,
      keyword: searchKeyword.value || undefined
    })
    
    if (isLoadMore) {
      customers.value = [...customers.value, ...res.rows]
    } else {
      customers.value = res.rows
    }
    
    hasMore.value = customers.value.length < res.total
  } catch (error) {
    console.error('加载客户列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function onSearchInput() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    hasMore.value = true
    loadCustomers()
  }, 500)
}

function onClearSearch() {
  searchKeyword.value = ''
  page.value = 1
  hasMore.value = true
  loadCustomers()
}

function onLoadMore() {
  if (!hasMore.value || loading.value) return
  page.value++
  loadCustomers(true)
}

function onSelectCustomer(customer: ClientListItem) {
  selectedId.value = customer.id
  emit('select', {
    id: customer.customer_id || customer.id,
    name: (customer as any).client_name || (customer as any).customer_name || (customer as any).name
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

.customer-list {
  padding: 16rpx 0;
}

.customer-item {
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

.customer-info {
  flex: 1;
}

.customer-name {
  font-size: 30rpx;
  color: #1f2329;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.customer-meta {
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
