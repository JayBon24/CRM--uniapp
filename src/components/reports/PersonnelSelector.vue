<template>
  <view class="personnel-selector">
    <view v-if="show" class="mask" @click="handleClose"></view>

    <view v-if="show" class="popup" :class="{ show }">
      <view class="popup-header">
        <view class="popup-title">{{ title }}</view>
        <view class="close-btn" @click="handleClose">X</view>
      </view>

      <scroll-view 
        class="popup-body" 
        scroll-y
        :scroll-top="0"
        :enable-back-to-top="false"
      >
        <view
          class="personnel-item"
          :class="{ active: selectedId === null }"
          @click="handleSelect(null)"
        >
          <view class="personnel-name">{{ allLabel }}</view>
          <view v-if="selectedId === null" class="check-icon">V</view>
        </view>

        <view
          v-for="person in personnelList"
          :key="person.id"
          class="personnel-item"
          :class="{ active: selectedId === person.id }"
          @click="handleSelect(person.id)"
        >
          <view class="personnel-info">
            <view class="personnel-name">{{ person.name }}</view>
            <view v-if="person.role" class="personnel-role">{{ getRoleLabel(person.role) }}</view>
          </view>
          <view v-if="selectedId === person.id" class="check-icon">V</view>
        </view>

        <view v-if="loading" class="loading-state">
          <text>{{ loadingText }}</text>
        </view>

        <view v-if="!loading && personnelList.length === 0" class="empty-state">
          <text>{{ emptyText }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Personnel {
  id: number
  name: string
  role?: string
}

interface Props {
  show: boolean
  selectedId?: number | null
  personnelList: Personnel[]
  loading?: boolean
  title?: string
  allLabel?: string
  emptyText?: string
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'select', id: number | null): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  selectedId: null,
  personnelList: () => [],
  loading: false,
  title: '\u9009\u62e9\u4eba\u5458',
  allLabel: '\u5168\u90e8\u6570\u636e',
  emptyText: '\u6682\u65e0\u4eba\u5458\u6570\u636e'
})

const emit = defineEmits<Emits>()

const loadingText = '\u52a0\u8f7d\u4e2d...'

const getRoleLabel = (role: string): string => {
  const roleMap: Record<string, string> = {
    HQ: '\u603b\u6240\u7ba1\u7406',
    BRANCH: '\u5206\u6240\u7ba1\u7406',
    TEAM: '\u56e2\u961f\u7ba1\u7406',
    SALES: '\u9500\u552e'
  }
  return roleMap[role] || role
}

const handleSelect = (id: number | null) => {
  emit('select', id)
  handleClose()
}

const handleClose = () => {
  emit('update:show', false)
  emit('close')
}
</script>

<style scoped lang="scss">
.personnel-selector {
  position: relative;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  animation: fadeIn 0.3s;
}

.popup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  height: 90vh;
  max-height: 90vh;
  z-index: 3001;
  transform: translateY(100%);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;

  &.show {
    transform: translateY(0);
  }
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #ebedf0;
  flex-shrink: 0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2329;
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #8f959e;

  &:active {
    opacity: 0.6;
  }
}

.popup-body {
  flex: 1;
  height: 0;
  padding: 16rpx 0;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom) + 120rpx);
  box-sizing: border-box;
}

.personnel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  transition: background 0.2s;

  &:active {
    background: #f7f8fa;
  }

  &.active {
    background: #e8f3ff;

    .personnel-name {
      color: #3370ff;
      font-weight: 600;
    }
  }
}

.personnel-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.personnel-name {
  font-size: 28rpx;
  color: #1f2329;
}

.personnel-role {
  font-size: 24rpx;
  color: #8f959e;
  padding: 4rpx 12rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
}

.check-icon {
  font-size: 28rpx;
  color: #3370ff;
  font-weight: bold;
}

.loading-state,
.empty-state {
  padding: 80rpx 32rpx;
  text-align: center;
  font-size: 28rpx;
  color: #8f959e;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
