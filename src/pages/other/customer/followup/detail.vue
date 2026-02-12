<!-- @ts-nocheck -->
<template>
  <view class="followup-detail-page">
    <view v-if="!loading && followup" class="detail-card">
      <view class="card-header">
        <text class="title">跟进详情</text>
        <view class="type-badge" :class="`type-${followup.type}`">
          {{ followupTypeLabel(followup.type, followup.method_other) }}
        </view>
      </view>

      <view class="section">
        <view class="section-title">跟进地点</view>
        <view class="location-status" :class="`status-${followup.location_status}`">
          {{ locationStatusLabel(followup.location_status) }}
        </view>
        <text class="address">{{ followup.address || '未记录详细地址' }}</text>
        <view v-if="followup.lng && followup.lat" class="coords">
          经纬度：{{ followup.lng.toFixed(6) }}, {{ followup.lat.toFixed(6) }}
        </view>
      </view>

      <view class="section">
        <view class="section-title">跟进内容</view>
        <view class="content-block">
          <text class="content-text">{{ followup.summary }}</text>
        </view>
        <view v-if="followup.conclusion" class="content-block conclusion">
          <text class="content-label">关键结论</text>
          <text class="content-text">{{ followup.conclusion }}</text>
        </view>
      </view>

      <view class="section">
        <view class="section-title">参与人员</view>
        <view class="participant-group">
          <text class="label">内部参与人员</text>
          <view class="tags">
            <view v-for="user in (followup.internal_participants || [])" :key="participantKey(user)" class="tag">
              <text class="tag-text">{{ participantName(user) }}</text>
            </view>
            <text v-if="!followup.internal_participants?.length" class="none">无</text>
          </view>
        </view>
        <view class="participant-group">
          <text class="label">客户方参与人员</text>
          <view class="tags">
            <view v-for="user in (followup.customer_participants || [])" :key="participantKey(user)" class="tag">
              <text class="tag-text">{{ participantName(user) }}</text>
            </view>
            <text v-if="!followup.customer_participants?.length" class="none">无</text>
          </view>
        </view>
      </view>

      <view v-if="followup.attachments && followup.attachments.length > 0" class="section">
        <view class="section-title">附件 ({{ followup.attachments.length }})</view>
        <view class="attachment-grid">
          <view v-for="(file, index) in followup.attachments" :key="index" class="attachment-item">
            <image :src="attachmentThumb(file)" mode="aspectFill" class="attachment-image" @click="previewAttachment(index)" @error="onAttachmentImageError(file)" />
          </view>
        </view>
      </view>

      <view class="section">
        <view class="row">
          <text class="label">跟进时间</text>
          <text class="value">{{ formatFullTime(followup.time) }}</text>
        </view>
        <view class="row">
          <text class="label">洽谈时长</text>
          <text class="value">{{ followup.duration || 0 }} 分钟</text>
        </view>
      </view>

      <view class="section meta">
        <text>记录人：{{ followup.creator_name || '未知' }}</text>
        <text>录入时间：{{ formatFullTime(followup.create_time) }}</text>
      </view>
    </view>

    <view v-if="!loading && !followup" class="empty-box">
      <u-empty mode="data" text="跟进记录不存在"></u-empty>
    </view>

    <view v-if="loading" class="loading-box">
      <u-loading-icon mode="spinner" size="32" />
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAttachmentUrl } from '@/utils/attachment'
import dayjs from 'dayjs'
import { getFollowupList } from '@/api/client'
import type { ClientFollowup, FollowupParticipant } from '@/types/interfaces/client-followup'

const loading = ref(false)
const followup = ref<ClientFollowup | null>(null)
const attachmentThumbMap = ref<Record<string, string>>({})
const attachmentFallbackLoadingSet = new Set<string>()

function followupTypeLabel(type: string, methodOther?: string) {
  const map = {
    phone: '电话',
    wechat: '微信',
    meeting: '面谈',
    email: '邮件',
    other: '其他'
  }
  if (type === 'other' && methodOther) {
    return `其他（${methodOther}）`
  }
  return map[type] || type
}

function locationStatusLabel(status: string) {
  const map = {
    success: '定位成功',
    fail: '定位失败',
    denied: '拒绝授权',
    offline: '无网络'
  }
  return map[status] || status || '未记录'
}

function formatFullTime(time: string) {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '--'
}

function attachmentUrl(file: any) {
  return getAttachmentUrl(file)
}

function attachmentThumb(file: any) {
  const url = attachmentUrl(file)
  return attachmentThumbMap.value[url] || url
}

function onAttachmentImageError(file: any) {
  const resolved = attachmentUrl(file)
  if (!resolved) return
  if (resolved.startsWith('wxfile://') || resolved.startsWith('file://') || resolved.startsWith('blob:') || resolved.startsWith('data:')) return
  if (attachmentThumbMap.value[resolved] || attachmentFallbackLoadingSet.has(resolved)) return
  attachmentFallbackLoadingSet.add(resolved)
  uni.downloadFile({
    url: resolved,
    success: (res: any) => {
      if (res?.statusCode === 200 && res.tempFilePath) {
        attachmentThumbMap.value = {
          ...attachmentThumbMap.value,
          [resolved]: res.tempFilePath
        }
      }
    },
    complete: () => {
      attachmentFallbackLoadingSet.delete(resolved)
    }
  })
}

function previewAttachment(index: number) {
  if (!followup.value?.attachments?.length) return
  const urls = followup.value.attachments.map((item: any) => attachmentUrl(item)).filter(Boolean)
  const current = urls[index]
  if (!current) return
  uni.previewImage({
    urls,
    current
  })
}

function participantName(user: FollowupParticipant | any) {
  if (!user) return '-'
  if (typeof user === 'string' || typeof user === 'number') return String(user)
  return user.name || user.real_name || user.username || user.id || '-'
}

function participantKey(user: FollowupParticipant | any) {
  if (!user) return Math.random().toString(36)
  if (typeof user === 'string' || typeof user === 'number') return String(user)
  return user.id || user.name || Math.random().toString(36)
}

async function loadFollowup(id: string | number, clientId?: string | number) {
  loading.value = true
  try {
    if (!clientId) {
      followup.value = null
      return
    }
    const res = await getFollowupList(clientId)
    const list = res.rows || []
    followup.value = list.find((item: any) => String(item.id) === String(id)) || null
  } catch (error) {
    console.error('加载跟进详情失败:', error)
  } finally {
    loading.value = false
  }
}

onLoad((options: any) => {
  if (options?.id && options?.clientId) {
    loadFollowup(options.id, options.clientId)
  } else if (options?.id) {
    // 缺少 clientId 时尝试从上一页缓存传参（保底处理）
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2] as any
    const prevClientId = prevPage?.$page?.options?.id
    loadFollowup(options.id, prevClientId)
  }
})
</script>

<style scoped lang="scss">
.followup-detail-page {
  min-height: 100vh;
  background: #F5F7FA;
  padding: 20rpx;
  box-sizing: border-box;
}

.detail-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 600;
  color: #303133;
}

.type-badge {
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 500;
  background: #F5F5F5;
  color: #909399;

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

  &.type-email,
  &.type-other {
    background: #F5F5F5;
    color: #909399;
  }
}

.section {
  margin-bottom: 28rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16rpx;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.label {
  font-size: 26rpx;
  color: #909399;
}

.value {
  font-size: 26rpx;
  color: #303133;
}

.location-status {
  display: inline-block;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  margin-bottom: 12rpx;

  &.status-success {
    background: #E6F4FF;
    color: #409EFF;
  }

  &.status-fail {
    background: #FEF0F0;
    color: #F56C6C;
  }

  &.status-denied {
    background: #FFF7E6;
    color: #E6A23C;
  }

  &.status-offline {
    background: #F5F5F5;
    color: #909399;
  }
}

.address {
  font-size: 26rpx;
  color: #606266;
  margin-bottom: 8rpx;
}

.coords {
  font-size: 24rpx;
  color: #909399;
}

.content-block {
  background: #F5F7FA;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 12rpx;
}

.content-label {
  display: block;
  font-size: 24rpx;
  color: #909399;
  margin-bottom: 8rpx;
}

.content-text {
  font-size: 28rpx;
  color: #303133;
  line-height: 1.6;
}

.participant-group {
  margin-bottom: 16rpx;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 8rpx;
}

.tag {
  padding: 6rpx 16rpx;
  background: #F0F2F5;
  border-radius: 16rpx;
}

.tag-text {
  font-size: 24rpx;
  color: #606266;
}

.none {
  font-size: 24rpx;
  color: #C0C4CC;
}

.attachment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.attachment-item {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.attachment-image {
  width: 100%;
  height: 100%;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  font-size: 24rpx;
  color: #909399;
}

.empty-box,
.loading-box {
  margin-top: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  color: #909399;
}
</style>
