<template>
  <view class="custom-dropdown">
    <!-- 菜单栏 -->
    <view class="dropdown-menu">
      <view v-for="(item, index) in items" :key="index" class="menu-item" :class="{ active: activeIndex === index }"
        @click="toggleDropdown(index, $event)">
        <text class="menu-title" :class="{ 'sort-selected': isSortMenu && index === activeIndex }">
          {{ getMenuTitle(item) }}
        </text>
        <view class="menu-icon" :class="{ 'icon-up': activeIndex === index, 'icon-down': activeIndex !== index }">
          <u-icon :name="activeIndex === index ? 'arrow-up' : 'arrow-down'" size="12"
            :color="activeIndex === index ? '#52c41a' : '#666'" />
        </view>
      </view>
    </view>

    <!-- 底部弹窗 -->
    <u-popup
      v-model:show="showPopup"
      mode="bottom"
      :safe-area-inset-bottom="true"
      :close-on-click-overlay="true"
      @close="closeDropdown"
    >
      <view class="popup-content">
        <!-- 弹窗标题 -->
        <view class="popup-header">
          <text class="popup-title">{{ getCurrentMenuTitle() }}</text>
          <u-icon name="close" size="20" color="#999" @click="closeDropdown" />
        </view>

        <!-- 选项列表 -->
        <view class="popup-options">
          <view
            v-for="(option, optionIndex) in currentOptions"
            :key="optionIndex"
            class="popup-option"
            :class="{
              selected: isSortMenu ? isCurrentSortOption(option) : currentValue === option.value
            }"
            @click="handleOptionClick(option)"
          >
            <view class="option-content">
              <text class="option-text">{{ option.label }}</text>
              <!-- 排序菜单特殊处理：显示排序方向图标 -->
              <view v-if="isSortMenu" class="sort-indicator">
                <!-- 调试信息 -->
                <text class="debug-text" style="font-size: 20rpx; color: #999;">
                  可再次点击反转排序方式
                </text>
                <u-icon
                  :name="getSortIcon(option)"
                  size="16"
                  :color="getSortIconColor(option)"
                />
              </view>
              <!-- 普通菜单：显示选中图标 -->
              <u-icon v-else-if="currentValue === option.value" name="checkmark" size="16" color="#2979ff" />
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'sortChange'])

// 响应式数据
const activeIndex = ref(-1) // 当前激活的菜单项索引
const showPopup = ref(false) // 控制底部弹窗显示
const actualSortConfig = ref(null) // 实际的排序配置

// 计算当前选项
const currentOptions = computed(() => {
  if (activeIndex.value === -1) return []
  return props.items[activeIndex.value]?.options || []
})

// 计算当前值
const currentValue = computed(() => {
  if (activeIndex.value === -1) return ''
  const item = props.items[activeIndex.value]
  return props.modelValue[item.title] || item.value || ''
})

// 判断是否为排序菜单
const isSortMenu = computed(() => {
  if (activeIndex.value === -1) return false
  const item = props.items[activeIndex.value]
  return item.isSortMenu
})

// 获取当前排序配置
const currentSortConfig = computed(() => {
  if (!isSortMenu.value) return null
  const sortValue = props.modelValue['排序']
  if (!sortValue) return null

  // 查找对应的排序配置
  const currentOptions = props.items[activeIndex.value]?.options || []
  return currentOptions.find(option => option.value === sortValue) || null
})

// 判断是否为当前排序选项
const isCurrentSortOption = (option) => {
  if (!isSortMenu.value || !currentSortConfig.value) return false
  return option.orderByColumn === currentSortConfig.value.orderByColumn
}



// 获取排序图标
const getSortIcon = (option) => {
  if (isCurrentSortOption(option)) {
    // 当前选中的选项，需要获取实际的排序方向
    // 从modelValue中获取实际的排序配置
    const actualSortConfig = getActualSortConfig()
    return actualSortConfig?.isAsc === 'asc' ? 'arrow-upward' : 'arrow-downward'
  } else {
    // 其他选项，显示默认排序方向
    return option.isAsc === 'asc' ? 'arrow-upward' : 'arrow-downward'
  }
}

// 获取实际的排序配置（从API返回的数据中获取）
const getActualSortConfig = () => {
  // 优先使用实际存储的排序配置
  if (actualSortConfig.value) {
    return actualSortConfig.value
  }
  // 回退到选项配置
  return currentSortConfig.value
}

// 获取排序图标颜色
const getSortIconColor = (option) => {
  if (isCurrentSortOption(option)) {
    return '#2979ff' // 当前选中的选项 - 蓝色
  } else {
    return '#ccc' // 其他选项 - 浅灰色
  }
}


// 切换下拉菜单
const toggleDropdown = (index, event) => {
  if (activeIndex.value === index && showPopup.value) {
    // 如果点击的是当前激活的菜单且弹窗已打开，则关闭
    closeDropdown()
  } else {
    // 否则打开新的菜单
    openDropdown(index)
  }
}

// 打开下拉菜单
const openDropdown = (index) => {
  activeIndex.value = index
  showPopup.value = true
}

// 获取当前菜单标题
const getCurrentMenuTitle = () => {
  if (activeIndex.value === -1) return ''
  return props.items[activeIndex.value]?.title || ''
}

// 当前排序值（计算属性）
const currentSortValue = computed(() => {
  return props.modelValue['排序'] || ''
})


// 关闭下拉菜单
const closeDropdown = () => {
  activeIndex.value = -1
  showPopup.value = false
}

// 获取菜单标题
const getMenuTitle = (item) => {
  const selectedValue = props.modelValue[item.title]
  if (selectedValue) {
    const selectedOption = item.options.find(option => option.value === selectedValue)
    return selectedOption ? selectedOption.label : item.title
  }
  return item.title
}

// 处理选项点击
const handleOptionClick = (option) => {
  if (activeIndex.value === -1) return

  if (isSortMenu.value) {
    // 排序菜单特殊处理
    handleSortOptionClick(option)
  } else {
    // 普通菜单处理
    selectOption(option.value)
  }
}

// 处理排序选项点击
const handleSortOptionClick = (option) => {
  const item = props.items[activeIndex.value]
  const newModelValue = { ...props.modelValue }

  if (isCurrentSortOption(option)) {
    // 如果点击的是当前排序选项，切换排序方向
    const currentConfig = getActualSortConfig()
    const newConfig = {
      ...option,
      isAsc: currentConfig?.isAsc === 'asc' ? 'desc' : 'asc'
    }
    newModelValue[item.title] = newConfig.value

    // 更新实际排序配置
    actualSortConfig.value = newConfig

    // 发送排序配置变化事件
    emit('sortChange', {
      orderByColumn: newConfig.orderByColumn,
      isAsc: newConfig.isAsc,
      value: newConfig.value
    })
  } else {
    // 如果点击的是其他排序选项，切换到该选项的默认排序方向
    newModelValue[item.title] = option.value

    // 更新实际排序配置
    actualSortConfig.value = option

    // 发送排序配置变化事件
    emit('sortChange', {
      orderByColumn: option.orderByColumn,
      isAsc: option.isAsc,
      value: option.value
    })
  }

  emit('update:modelValue', newModelValue)
  emit('change', activeIndex.value, option.value)

  // 关闭弹窗
  closeDropdown()
}
// 选择选项（普通菜单）
const selectOption = (value) => {
  if (activeIndex.value === -1) return

  const item = props.items[activeIndex.value]
  const newModelValue = { ...props.modelValue }
  newModelValue[item.title] = value

  emit('update:modelValue', newModelValue)
  emit('change', activeIndex.value, value)

  // 关闭弹窗
  closeDropdown()
}



// 初始化排序配置
const initSortConfig = () => {
  if (isSortMenu.value && currentSortConfig.value) {
    actualSortConfig.value = currentSortConfig.value
  }
}

// 监听modelValue变化，更新排序配置
watch(() => props.modelValue, () => {
  initSortConfig()
}, { deep: true })

// 组件挂载和卸载
onMounted(() => {
  // 初始化排序配置
  initSortConfig()
})

onUnmounted(() => {
  // 清理工作
})
</script>

<style lang="scss" scoped>
.custom-dropdown {
  position: relative;
  width: 100%;
  z-index: 1000;
}

.dropdown-menu {
  display: flex;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  min-height: 80rpx;
}

.menu-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 20rpx 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:active {
    background-color: #f5f5f5;
  }

  &.active {
    .menu-title {
      color: #52c41a;
    }
  }
}

.menu-title {
  font-size: 28rpx;
  color: #333;
  transition: color 0.3s ease;

  &.sort-selected {
    color: #2979ff;
    font-weight: 500;
  }
}

.sort-indicator {
  margin-left: 8rpx;
  display: flex;
  align-items: center;
}

.menu-icon {
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24rpx;
  height: 24rpx;
}

// 底部弹窗样式
.popup-content {
  background-color: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.popup-options {
  max-height: 60vh;
  overflow-y: auto;
}

.popup-option {
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #f5f5f5;
  }

  &.selected {
    .option-text {
      color: #2979ff;
      font-weight: 500;
    }

    background-color: #f0f8ff;
  }
}

.option-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort-indicator {
  display: flex;
  align-items: center;
}


.option-text {
  font-size: 30rpx;
  color: #333;
  transition: color 0.2s ease;
}

// 底部弹窗动画由u-popup组件处理</style>
