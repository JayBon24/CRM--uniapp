<template>
  <view class="organizer-selector">
    <!-- 选择显示区域，参考 DateSelector 的样式：文字 + 箭头 -->
    <view class="selected-area" @click="openPopup">
      <view class="area-value">
        <view v-if="displayOrganizer" class="selected-organizer">
          <u-image
            :src="$getImageUrl(displayOrganizer.unitLogo)"
            mode="aspectFill"
            class="organizer-logo"
            width="36rpx"
            height="36rpx"
            radius="6rpx"
          />
          <text class="organizer-name">{{ displayOrganizer.unitName }}</text>
        </view>
        <text v-else class="placeholder">{{ placeholder }}</text>
      </view>
      <u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
    </view>

    <!-- 选择弹窗 -->
    <u-popup v-model:show="showPopup" mode="bottom" :round="20" :safe-area-inset-bottom="true">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">选择主办方</text>
          <u-icon name="close" size="20" @click="closePopup" />
        </view>

        <!-- 搜索框 -->
        <view class="search-container">
          <u-search
            v-model="searchKeyword"
            placeholder="搜索主办方名称"
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
          <view v-else-if="filteredOrganizerList.length > 0">
            <view
              v-for="organizer in filteredOrganizerList"
              :key="organizer.id"
              class="organizer-item"
              @click="onSelectItem(organizer)"
            >
              <u-image
                :src="$getImageUrl(organizer.unitLogo)"
                mode="aspectFill"
                class="organizer-logo"
                width="60rpx"
                height="60rpx"
                radius="8rpx"
              />
              <view class="organizer-info">
                <text class="organizer-name">{{ organizer.unitName }}</text>
              </view>
              <u-icon
                v-if="selectedOrganizer?.id === organizer.id"
                name="checkmark"
                color="#1890ff"
                size="20"
              />
            </view>
          </view>

          <!-- 空状态 -->
          <view v-else class="empty-container">
            <u-empty
              :text="searchKeyword ? '未找到相关主办方' : '暂无主办方数据'"
              mode="list"
            ></u-empty>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { getOrganizerList } from '@/api/organizer'

// 定义props
const props = defineProps({
  // v-model 绑定：主办方ID
  modelValue: {
    type: [String, Number],
    default: null
  },
  // 占位文本
  placeholder: {
    type: String,
    default: '请选择主办方'
  }
})

// 定义emits
const emit = defineEmits(['update:modelValue', 'change'])

// 响应式数据
const showPopup = ref(false)
const organizerList = ref([])
const selectedOrganizer = ref(null)
const loading = ref(false)
const searchKeyword = ref('')
const searchTimer = ref(null)

// 显示的主办方信息（用于回显）
const displayOrganizer = computed(() => {
  if (!props.modelValue) return null

  // 从已加载的列表中查找对应的主办方
  const organizer = organizerList.value.find(item => item.id == props.modelValue)
  return organizer || null
})

// 过滤后的创办方列表
const filteredOrganizerList = computed(() => {
  if (!searchKeyword.value.trim()) {
    return organizerList.value
  }

  const keyword = searchKeyword.value.toLowerCase().trim()
  return organizerList.value.filter(organizer =>
    organizer.unitName?.toLowerCase().includes(keyword) ||
    organizer.contactPerson?.toLowerCase().includes(keyword)
  )
})

// 打开弹窗
const openPopup = () => {
  showPopup.value = true
  loadOrganizerList()
}

// 加载创办方列表
const loadOrganizerList = async () => {
  try {
    loading.value = true
    const response = await getOrganizerList()

    if (response.code === 200 && response.rows) {
      organizerList.value = response.rows

      // 如果有当前选中的主办方ID，设置为选中状态
      if (props.modelValue) {
        const currentOrganizer = organizerList.value.find(item => item.id == props.modelValue)
        if (currentOrganizer) {
          selectedOrganizer.value = currentOrganizer
        }
      }
    } else {
      organizerList.value = []
      uni.showToast({
        title: response.msg || '获取创办方列表失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('加载创办方列表失败:', error)
    organizerList.value = []
    uni.showToast({
      title: '网络异常，请稍后重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 选择主办方
const onSelectItem = (organizer) => {
  selectedOrganizer.value = organizer
  // 更新父级绑定并触发change
  emit('update:modelValue', organizer.id)
  emit('change', organizer)
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
  // 关闭时清空搜索
  searchKeyword.value = ''
}
</script>

<style scoped>
.organizer-selector {
  width: 100%;
}

.selected-area {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background-color: #ffffff;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.selected-area:hover {
  border-color: #667eea;
}

.area-value {
  flex: 1;
  display: flex;
  align-items: center;
}

.selected-organizer {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.organizer-logo {
  flex-shrink: 0;
}

.organizer-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.placeholder {
  font-size: 28rpx;
  color: #999;
}

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

.organizer-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.organizer-item:active {
  background: #e9ecef;
  transform: scale(0.98);
}

.organizer-logo {
  margin-right: 20rpx;
  flex-shrink: 0;
}

.organizer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.organizer-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.organizer-contact {
  font-size: 24rpx;
  color: #666;
}

</style>
