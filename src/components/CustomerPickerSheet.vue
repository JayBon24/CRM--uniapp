<template>
  <u-popup
    :show="show"
    mode="bottom"
    :round="18"
    :safe-area-inset-bottom="true"
    @close="handleClose"
  >
    <view class="picker-sheet">
      <view class="picker-header">
        <view>
          <text class="picker-title">选择公司</text>
          <text v-if="actionLabel" class="picker-subtitle">即将执行：{{ actionLabel }}</text>
        </view>
      </view>

      <view class="picker-search">
        <u-input
          v-model="keyword"
          clearable
          :border="false"
          placeholder="搜索公司名称"
        />
      </view>

      <view v-if="recentClients.length" class="recent-block">
        <text class="recent-title">最近使用</text>
        <view class="recent-list">
          <view
            v-for="item in recentClients"
            :key="`recent-${resolveClientId(item)}`"
            class="client-pill"
            @click="handlePick(item)"
          >
            {{ item.client_name || item.customer_name || `客户${resolveClientId(item)}` }}
          </view>
        </view>
      </view>

      <scroll-view class="picker-list" scroll-y>
        <view
          v-for="item in filteredClients"
          :key="resolveClientId(item)"
          class="picker-item"
          @click="handlePick(item)"
        >
          <text class="picker-item__name">
            {{ item.client_name || item.customer_name || `客户${resolveClientId(item)}` }}
          </text>
          <text class="picker-item__meta">
            {{ item.contact_name || '未设置联系人' }}
          </text>
        </view>
        <view v-if="!filteredClients.length" class="empty">未找到可选公司</view>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ClientListItem } from '@/types/interfaces/client'

interface Props {
  show: boolean
  actionLabel?: string
  clients: ClientListItem[]
}

const props = withDefaults(defineProps<Props>(), {
  actionLabel: ''
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  confirm: [value: ClientListItem]
}>()

const keyword = ref('')
const RECENT_KEY = 'customer:quick-picker:recent'
const recentIds = ref<Array<string | number>>([])

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      keyword.value = ''
      loadRecentIds()
    }
  }
)

const resolveClientId = (item: ClientListItem) => item.customer_id || item.id

const filteredClients = computed(() => {
  const source = Array.isArray(props.clients) ? props.clients : []
  const key = keyword.value.trim().toLowerCase()
  if (!key) return source
  return source.filter((item) => {
    const name = String(item.client_name || item.customer_name || '').toLowerCase()
    return name.includes(key)
  })
})

const recentClients = computed(() => {
  if (!recentIds.value.length) return []
  const idSet = new Set(recentIds.value.map(String))
  return props.clients
    .filter(item => idSet.has(String(resolveClientId(item))))
    .sort((a, b) => {
      const indexA = recentIds.value.findIndex(id => String(id) === String(resolveClientId(a)))
      const indexB = recentIds.value.findIndex(id => String(id) === String(resolveClientId(b)))
      return indexA - indexB
    })
})

function loadRecentIds() {
  try {
    const raw = uni.getStorageSync(RECENT_KEY)
    recentIds.value = Array.isArray(raw) ? raw : []
  } catch (error) {
    recentIds.value = []
  }
}

function saveRecentId(id: string | number) {
  const next = [id, ...recentIds.value.filter(item => String(item) !== String(id))].slice(0, 5)
  recentIds.value = next
  uni.setStorageSync(RECENT_KEY, next)
}

function handleClose() {
  emit('update:show', false)
}

function handlePick(item: ClientListItem) {
  saveRecentId(resolveClientId(item))
  emit('update:show', false)
  emit('confirm', item)
}
</script>

<style scoped lang="scss">
.picker-sheet {
  padding: 24rpx;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #111827;
}

.picker-subtitle {
  margin-top: 8rpx;
  display: block;
  font-size: 24rpx;
  color: #6b7280;
}

.picker-search {
  margin-top: 20rpx;
  background: #f3f4f6;
  border-radius: 14rpx;
  padding: 0 20rpx;
}

.recent-block {
  margin-top: 20rpx;
}

.recent-title {
  font-size: 24rpx;
  color: #6b7280;
}

.recent-list {
  margin-top: 12rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.client-pill {
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  font-size: 24rpx;
}

.picker-list {
  margin-top: 20rpx;
  max-height: 58vh;
}

.picker-item {
  padding: 20rpx 8rpx;
  border-bottom: 1rpx solid #f1f5f9;
}

.picker-item__name {
  font-size: 30rpx;
  font-weight: 500;
  color: #111827;
}

.picker-item__meta {
  margin-top: 6rpx;
  display: block;
  font-size: 24rpx;
  color: #6b7280;
}

.empty {
  text-align: center;
  color: #9ca3af;
  padding: 32rpx 0 40rpx;
}
</style>
