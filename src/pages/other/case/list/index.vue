<template>
  <view class="case-list-page">
    <CaseFilterBar
      v-model="filterData"
      @filter="handleFilter"
      @search="handleSearch"
    />

    <scroll-view
      class="list-container"
      scroll-y
      @scrolltolower="handleLoadMore"
    >
      <view v-if="loading && caseList.length === 0" class="loading-box">
        <u-loading-icon mode="spinner" size="28" />
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="!loading && caseList.length === 0" class="empty-box">
        <text class="empty-text">暂无案件</text>
      </view>

      <view v-else class="case-list">
        <CaseCard
          v-for="item in caseList"
          :key="item.id"
          :caseItem="item"
          @click="handleCaseClick"
        />
      </view>

      <view v-if="loading && caseList.length > 0" class="loading-more">
        <u-loading-icon mode="spinner" size="24" />
        <text class="loading-text">加载更多...</text>
      </view>

      <view v-if="finished && caseList.length > 0" class="finished-text">没有更多了</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CaseFilterBar from '@/components/CaseFilterBar/index.vue'
import CaseCard from '@/components/CaseCard/index.vue'
import { getCaseList } from '@/api/case'

interface FilterData {
  case_status?: string
  case_type?: string
  search?: string
}

const caseList = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const pageSize = 20

const filterData = ref<FilterData>({
  case_status: '',
  case_type: '',
  search: ''
})

onShow(() => {
  resetList()
  loadCases()
})

function resetList() {
  page.value = 1
  caseList.value = []
  finished.value = false
}

async function loadCases() {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const res = await getCaseList({
      page: page.value,
      limit: pageSize,
      case_status: filterData.value.case_status || undefined,
      case_type: filterData.value.case_type || undefined,
      search: filterData.value.search || undefined
    })

    const results = res.results || []
    console.log(`[案源清单] 加载第${page.value}页，返回${results.length}条数据，总数：${res.count || '未知'}`)
    console.log(`[案源清单] 筛选条件：`, {
      case_status: filterData.value.case_status || '无',
      case_type: filterData.value.case_type || '无',
      search: filterData.value.search || '无'
    })
    if (results.length > 0) {
      console.log(`[案源清单] 返回的案件状态示例：`, results.slice(0, 3).map((r: any) => ({
        id: r.id,
        case_name: r.case_name,
        case_status: r.case_status,
        customer_id: r.customer_id,
        customer_name: r.customer_name
      })))
    }
    
    // Filter out items without valid IDs
    const validResults = results.filter((item: any) => item?.id)
    if (validResults.length < results.length) {
      console.warn(`过滤了 ${results.length - validResults.length} 个无效的案件数据`)
    }
    if (page.value === 1) {
      caseList.value = validResults
    } else {
      caseList.value = caseList.value.concat(validResults)
    }

    console.log(`[案源清单] 当前已加载${caseList.value.length}条数据，总数：${res.count || '未知'}`)

    // 判断是否还有更多数据
    if (res.count !== undefined && res.count !== null) {
      // 如果有总数，比较已加载的数据量
      finished.value = caseList.value.length >= res.count
      console.log(`[案源清单] 判断是否完成：已加载${caseList.value.length} >= 总数${res.count} = ${finished.value}`)
    } else {
      // 如果没有总数，根据返回的数据量判断（如果返回的数据量小于pageSize，说明已经是最后一页）
      finished.value = results.length < pageSize
      console.log(`[案源清单] 无总数，根据返回数据量判断：${results.length} < ${pageSize} = ${finished.value}`)
    }
    page.value += 1
  } catch (error) {
    console.error('加载案件列表失败:', error)
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function handleFilter() {
  resetList()
  loadCases()
}

function handleSearch() {
  resetList()
  loadCases()
}

function handleLoadMore() {
  loadCases()
}

function handleCaseClick(item: any) {
  if (!item?.id) {
    console.warn('案件ID无效，无法跳转:', item)
    return
  }
  uni.navigateTo({
    url: `/pages/other/case/detail/index?id=${item.id}`
  })
}
</script>

<style scoped lang="scss">
.case-list-page {
  min-height: 100vh;
  background: #F5F7FA;
  padding: 20rpx;
  box-sizing: border-box;
}

.list-container {
  margin-top: 20rpx;
  height: calc(100vh - 220rpx);
  padding-bottom: 40rpx; /* 确保底部有足够的padding，避免点击空白区域 */
}

.case-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.loading-box,
.empty-box,
.loading-more {
  padding: 40rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.loading-text,
.empty-text,
.finished-text {
  color: #909399;
  font-size: 26rpx;
}

.finished-text {
  text-align: center;
  padding: 24rpx 0 40rpx;
}
</style>
