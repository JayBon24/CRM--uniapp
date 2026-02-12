<template>
  <u-popup v-model:show="showPopup" mode="bottom" :round="20" :safe-area-inset-bottom="true">
    <view class="popup-content">
      <view class="popup-header">
        <text class="popup-title">选择展览项目</text>
        <u-icon name="close" size="20" @click="closePopup" />
      </view>

      <!-- 搜索框 -->
      <view class="search-container">
        <u-search
          v-model="searchKeyword"
          placeholder="搜索展览名称"
          :show-action="false"
          @input="onSearchInput"
          @clear="onClearSearch"
          class="search-input"
        />
      </view>
      <view class="popup-body">
        <!-- 加载状态 -->
        <view v-if="loading" class="loading-container">
          <u-loading-icon mode="spinner" size="28"></u-loading-icon>
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 数据列表 -->
        <view v-else-if="filteredExhibitionList.length > 0">
          <view v-for="exhibition in filteredExhibitionList" :key="exhibition.id" class="exhibition-item"
            @click="onSelectItem(exhibition)">
            <view class="exhibition-info">
              <text class="exhibition-name">{{ exhibition.title }}</text>
            </view>
            <u-icon v-if="selectedExhibition?.id === exhibition.id" name="checkmark" color="#1890ff" size="20" />
          </view>
        </view>

        <!-- 空状态 -->
        <view v-else class="empty-container">
          <u-empty
            :text="searchKeyword ? '未找到相关展览' : '暂无展览项目数据'"
            mode="list"
          ></u-empty>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { getExhibitionList } from '@/api/exhibition'

// 定义props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  currentExhibition: {
    type: Object,
    default: null
  },
  organizerId: {
    type: String,
    default: ''
  }
})

// 定义emits
const emit = defineEmits(['update:show', 'confirm', 'close'])

// 响应式数据
const showPopup = ref(false)
const exhibitionList = ref([])
const selectedExhibition = ref(null)
const loading = ref(false)
const searchKeyword = ref('')
const searchTimer = ref(null)

// 过滤后的展览列表
const filteredExhibitionList = computed(() => {
  if (!searchKeyword.value.trim()) {
    return exhibitionList.value
  }

  const keyword = searchKeyword.value.toLowerCase().trim()
  return exhibitionList.value.filter(exhibition =>
    exhibition.title?.toLowerCase().includes(keyword) ||
    exhibition.description?.toLowerCase().includes(keyword)
  )
})

// 监听show属性变化
watch(() => props.show, (newVal) => {
  showPopup.value = newVal
  if (newVal) {
    loadExhibitionList()
  }
})

// 监听showPopup变化
watch(showPopup, (newVal) => {
  emit('update:show', newVal)
})

// 加载展览列表
const loadExhibitionList = async () => {
  try {
    loading.value = true

    // 构建请求参数
    const params = {
      pageNum: 1,
      pageSize: 100, // 获取更多数据
      orderByColumn: 'createTime',
      isAsc: 'desc'
    }

    // 如果有创办方ID，添加到参数中
    if (props.organizerId) {
      params.organizerId = props.organizerId
    }

    const response = await getExhibitionList(params)

    if (response.code === 200 && response.rows) {
      exhibitionList.value = response.rows

      // 如果有当前选中的展览，设置为选中状态
      if (props.currentExhibition) {
        selectedExhibition.value = props.currentExhibition
      }
    } else {
      exhibitionList.value = []
      uni.showToast({
        title: response.msg || '获取展览列表失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('加载展览列表失败:', error)
    exhibitionList.value = []
    uni.showToast({
      title: '网络异常，请稍后重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 选择展览
const onSelectItem = (exhibition) => {
  selectedExhibition.value = exhibition
  // 直接确认选择并关闭弹窗
  emit('confirm', exhibition)
  closePopup()
}


// 搜索输入处理
const onSearchInput = () => {
  // 清除之前的定时器
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }

  // 实时搜索，不需要防抖
  // 因为computed会自动处理
}

// 清除搜索
const onClearSearch = () => {
  searchKeyword.value = ''
}

// 关闭弹窗
const closePopup = () => {
  showPopup.value = false
  emit('close')
  // 关闭时清空搜索
  searchKeyword.value = ''
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return '—'
  try {
    const d = new Date(timeStr)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
  } catch (e) {
    return '—'
  }
}
</script>

<style scoped>
.popup-content {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.search-container {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.search-input {
  background: #f8f9fa;
  border-radius: 12rpx;
}

.popup-body {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
  gap: 20rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.empty-container {
  padding: 60rpx 0;
}

.exhibition-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.exhibition-item:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.exhibition-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.exhibition-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.exhibition-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.exhibition-time {
  font-size: 22rpx;
  color: #999;
}

</style>
