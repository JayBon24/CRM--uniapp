<template>
  <view class="page-container">
    <!-- 页面级下拉刷新不需要 scroll-view 组件 -->
    <!-- 直接使用普通的 view 容器即可 -->
    
    <!-- 页面头部 -->
    <view class="page-header">
      <text class="page-title">页面级下拉刷新示例</text>
      <text class="page-subtitle">使用 onPullDownRefresh 实现</text>
    </view>

    <!-- 数据列表 -->
    <view class="content-list">
      <view v-for="item in dataList" :key="item.id" class="list-item">
        <view class="item-header">
          <text class="item-title">{{ item.title }}</text>
          <text class="item-time">{{ formatTime(item.createTime) }}</text>
        </view>
        <text class="item-desc">{{ item.description }}</text>
        <view class="item-stats">
          <text class="stat-item">点赞: {{ item.likeCount || 0 }}</text>
          <text class="stat-item">浏览: {{ item.viewCount || 0 }}</text>
          <text class="stat-item">评论: {{ item.commentCount || 0 }}</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <u-loading-icon mode="spinner" size="32" />
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 空状态 -->
    <view v-if="!loading && dataList.length === 0" class="empty-container">
      <u-empty text="暂无数据" mode="list"></u-empty>
    </view>

    <!-- 分页加载更多按钮 -->
    <view v-if="hasMore && dataList.length > 0" class="load-more-section">
      <u-button 
        @click="loadMore" 
        :loading="loadingMore" 
        type="primary" 
        plain
        size="normal"
        class="load-more-btn"
      >
        {{ loadingMore ? '加载中...' : '加载更多' }}
      </u-button>
    </view>

    <!-- 没有更多数据提示 -->
    <view v-if="!hasMore && dataList.length > 0" class="no-more-section">
      <text class="no-more-text">没有更多数据了</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'

// 接口类型定义
interface DataItem {
  id: string
  title: string
  description: string
  createTime: string
  likeCount: number
  viewCount: number
  commentCount: number
}

// 数据相关
const dataList = ref<DataItem[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 状态相关
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)

// 页面配置：启用下拉刷新
// 在 pages.json 中需要配置：
// {
//   "path": "pages/example/pull-refresh",
//   "style": {
//     "enablePullDownRefresh": true,
//     "backgroundTextStyle": "dark"
//   }
// }

// 页面加载
onLoad(() => {
  console.log('页面加载，开始获取数据')
  loadData()
})

// 页面级下拉刷新 - 核心实现
onPullDownRefresh(() => {
  console.log('用户触发下拉刷新')
  
  // 执行刷新操作
  handleRefresh().finally(() => {
    // 无论成功失败，都要停止下拉刷新动画
    try {
      uni.stopPullDownRefresh()
      console.log('下拉刷新动画已停止')
    } catch (error) {
      console.error('停止下拉刷新失败:', error)
    }
  })
})

// 加载数据的主要方法
const loadData = async (isLoadMore = false) => {
  if (loading.value || (isLoadMore && loadingMore.value)) {
    console.log('正在加载中，跳过重复请求')
    return
  }
  
  try {
    if (isLoadMore) {
      loadingMore.value = true
    } else {
      loading.value = true
    }

    console.log(`开始加载数据 - 页码: ${pageNum.value}, 每页: ${pageSize.value}`)

    // 构建请求参数
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }

    // 这里替换为您的实际API调用
    // const response = await yourApiMethod(params)
    
    // 模拟API响应和网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockResponse = {
      code: 200,
      data: {
        rows: Array.from({ length: Math.min(pageSize.value, Math.max(0, 50 - (pageNum.value - 1) * pageSize.value)) }, (_, index) => ({
          id: `item_${(pageNum.value - 1) * pageSize.value + index + 1}`,
          title: `数据项标题 ${(pageNum.value - 1) * pageSize.value + index + 1}`,
          description: `这是第 ${(pageNum.value - 1) * pageSize.value + index + 1} 项的详细描述信息。`,
          createTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          likeCount: Math.floor(Math.random() * 100),
          viewCount: Math.floor(Math.random() * 1000),
          commentCount: Math.floor(Math.random() * 50)
        })),
        total: 50
      },
      msg: '获取成功'
    }

    if (mockResponse.code === 200 && mockResponse.data && Array.isArray(mockResponse.data.rows)) {
      const newData = mockResponse.data.rows
      
      if (isLoadMore) {
        // 加载更多：追加数据
        dataList.value = [...dataList.value, ...newData]
        console.log(`加载更多成功，新增 ${newData.length} 条数据`)
      } else {
        // 刷新或首次加载：替换数据
        dataList.value = newData
        console.log(`数据刷新成功，共 ${newData.length} 条数据`)
      }

      totalCount.value = mockResponse.data.total || 0
      hasMore.value = newData.length === pageSize.value && dataList.value.length < totalCount.value
      
      console.log(`数据加载完成 - 当前数据量: ${dataList.value.length}, 总数: ${totalCount.value}, 还有更多: ${hasMore.value}`)
    } else {
      console.error('获取数据失败:', mockResponse.msg)
      uni.showToast({
        title: mockResponse.msg || '获取数据失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('加载数据异常:', error)
    uni.showToast({
      title: '网络异常，请稍后重试',
      icon: 'none'
    })
    
    // 加载失败时回退页码
    if (isLoadMore) {
      pageNum.value--
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 手动刷新方法（用于页面级下拉刷新）
const handleRefresh = async () => {
  console.log('执行下拉刷新')
  pageNum.value = 1
  hasMore.value = true
  await loadData()
  
  // 显示刷新成功提示
  uni.showToast({
    title: '刷新成功',
    icon: 'none' ,
    duration: 1500
  })
}

// 加载更多
const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) {
    return
  }
  
  pageNum.value++
  await loadData(true)
}

// 时间格式化
const formatTime = (timeString: string) => {
  if (!timeString) return ''
  
  try {
    const date = new Date(timeString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '昨天'
    if (diffDays === 2) return '前天'
    if (diffDays <= 7) return `${diffDays}天前`

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  } catch (error) {
    return ''
  }
}

// 页面挂载后的逻辑
onMounted(() => {
  console.log('页面组件挂载完成')
})
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: env(safe-area-inset-bottom);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
  color: white;
}

.page-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.page-subtitle {
  font-size: 26rpx;
  opacity: 0.8;
}

.content-list {
  padding: 20rpx;
}

.list-item {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.item-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 20rpx;
}

.item-time {
  font-size: 24rpx;
  color: #999;
  flex-shrink: 0;
}

.item-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.item-stats {
  display: flex;
  gap: 30rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #999;
  padding: 8rpx 16rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx;
  gap: 20rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.empty-container {
  padding: 100rpx 40rpx;
}

.load-more-section {
  padding: 40rpx;
  text-align: center;
}

.load-more-btn {
  width: 300rpx;
}

.no-more-section {
  text-align: center;
  padding: 40rpx;
}

.no-more-text {
  font-size: 26rpx;
  color: #999;
}
</style>