<!-- @ts-nocheck -->
<template>
  <view class="panel followup-timeline-panel">
    <view class="panel-header">
      <text class="panel-title">跟进情况</text>
      <text class="count-badge">{{ total }}</text>
    </view>

    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="spinner" size="28" />
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="list.length === 0" class="empty-state">
      <text class="empty-text">暂无跟进记录</text>
    </view>

    <view v-else class="panel-content">
      <view class="timeline">
        <view
          v-for="(item, index) in list"
          :key="item.id"
          class="timeline-item"
          :class="{ 'is-last': index === list.length - 1 }"
          @click="handleItemClick(item)"
        >
          <view class="timeline-dot" :class="`type-${item.type}`" />
          <view class="timeline-content">
            <view class="content-header">
              <view class="header-left">
                <view class="type-badge" :class="`type-${item.type}`">
                  {{ followupTypeLabel(item.type, item.method_other) }}
                </view>
                <view v-if="isValidFollowup(item)" class="valid-badge">有效</view>
              </view>
              <text class="time">{{ formatTime(item.time) }}</text>
            </view>

            <view class="content-body">
              <text class="summary">{{ item.summary }}</text>
              <text v-if="item.conclusion" class="conclusion">关键结论：{{ item.conclusion }}</text>
            </view>

            <view v-if="item.attachments && item.attachments.length > 0" class="attachments">
              <view
                v-for="(attachment, index) in item.attachments.slice(0, 3)"
                :key="attachmentKey(attachment, index)"
                class="attachment-thumb"
              >
                <image :src="attachmentUrl(attachment)" mode="aspectFill" />
              </view>
              <text v-if="item.attachments.length > 3" class="more-count">
                +{{ item.attachments.length - 3 }}
              </text>
            </view>

            <view class="content-footer">
              <text class="creator">{{ item.creator_name }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, watch } from 'vue'
import type { ClientFollowup } from '@/types/interfaces/client-followup'
import { getFollowupList } from '@/api/client'
import dayjs from 'dayjs'

interface Props {
  clientId: number | string
  salesStage?: string
}

const props = defineProps<Props>()

const list = ref<ClientFollowup[]>([])
const total = ref(0)
const loading = ref(false)

function isValidFollowup(followup: ClientFollowup) {
  if (props.salesStage === 'BLANK') return false
  const hasAddress = !!followup.address && String(followup.address).trim().length > 0
  return followup.location_status === 'success' || (followup.lng && followup.lat) || hasAddress
}

function followupTypeLabel(type: string, methodOther?: string) {
  const map = {
    phone: '电话',
    wechat: '微信',
    meeting: '面谈',
    visit: '面谈',
    email: '邮件',
    other: '其他'
  }
  if (type === 'other' && methodOther) {
    return `其他（${methodOther}）`
  }
  return map[type] || type
}

function formatTime(time: string) {
  return time ? dayjs(time).format('MM-DD HH:mm') : '--'
}

function attachmentUrl(file: any) {
  return typeof file === 'string' ? file : file?.url
}

function attachmentKey(file: any, index: number) {
  if (typeof file === 'string') return file
  return file?.url || file?.name || index
}

function handleItemClick(item: ClientFollowup) {
  uni.navigateTo({
    url: `/pages/other/customer/followup/detail?id=${item.id}&clientId=${props.clientId}`
  })
}

async function loadList() {
  if (loading.value) return

  loading.value = true
  try {
    const res = await getFollowupList(props.clientId as string)
    list.value = res.rows || []
    total.value = res.total || list.value.length
  } catch (error) {
    console.error('加载跟进记录失败:', error)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.clientId,
  () => {
    loadList()
  },
  { immediate: true }
)

defineExpose({
  refresh: loadList
})
</script>

<style scoped lang="scss">
.panel {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.count-badge {
  padding: 4rpx 12rpx;
  background: #F0F2F5;
  border-radius: 10rpx;
  font-size: 24rpx;
  color: #606266;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 30rpx;
  gap: 16rpx;
}

.loading-text,
.empty-text {
  font-size: 26rpx;
  color: #909399;
}

.panel-content {
  padding: 30rpx;
}

.timeline {
  position: relative;
}

.timeline-item {
  position: relative;
  padding-left: 60rpx;
  padding-bottom: 40rpx;

  &:not(.is-last)::before {
    content: '';
    position: absolute;
    left: 16rpx;
    top: 40rpx;
    bottom: 0;
    width: 2rpx;
    background: #EBEEF5;
  }
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 8rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: #fff;
  border: 4rpx solid;

  &.type-phone {
    border-color: #409EFF;
  }

  &.type-wechat {
    border-color: #67C23A;
  }

  &.type-meeting,
  &.type-visit {
    border-color: #E6A23C;
  }

  &.type-other,
  &.type-email {
    border-color: #909399;
  }
}

.timeline-content {
  background: #F5F7FA;
  border-radius: 8rpx;
  padding: 20rpx;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.type-badge {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 500;

  &.type-phone {
    background: #E6F4FF;
    color: #409EFF;
  }

  &.type-wechat {
    background: #F0F9E8;
    color: #67C23A;
  }

  &.type-meeting,
  &.type-visit {
    background: #FFF7E6;
    color: #E6A23C;
  }

  &.type-other,
  &.type-email {
    background: #F5F5F5;
    color: #909399;
  }
}

.valid-badge {
  padding: 2rpx 10rpx;
  background: #F0F9E8;
  border-radius: 6rpx;
  font-size: 20rpx;
  color: #67C23A;
  font-weight: 500;
}

.time {
  font-size: 24rpx;
  color: #909399;
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.summary {
  font-size: 28rpx;
  color: #303133;
  line-height: 1.6;
}

.conclusion {
  font-size: 26rpx;
  color: #606266;
  padding: 12rpx;
  background: #fff;
  border-radius: 6rpx;
  border-left: 4rpx solid #E6A23C;
}

.attachments {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.attachment-thumb {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  overflow: hidden;

  image {
    width: 100%;
    height: 100%;
  }
}

.more-count {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  height: 120rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #909399;
}

.content-footer {
  font-size: 24rpx;
  color: #909399;
}
</style>
