<template>
  <view class="container">
    <u-loading-page :loading="loading" loading-text="正在加载详情..."></u-loading-page>

    <view v-if="!loading && visit" class="detail-card">
      <!-- 头部信息 -->
      <view class="header-section">
        <view class="title-row">
          <text class="title">拜访详情</text>
          <view v-if="isValidVisit" class="valid-badge">有效拜访</view>
        </view>
        <view class="time-row">
          <SvgIcon name="time" :size="24" color="#909399" />
          <text class="time">{{ formatFullTime(visit.visit_time) }}</text>
          <text class="duration">（洽谈 {{ visit.duration || 0 }} 分钟）</text>
        </view>
      </view>

      <!-- 地点信息 -->
      <view class="section">
        <view class="section-title">
          <SvgIcon name="location" :size="32" color="#667eea" />
          <text>拜访地点</text>
        </view>
        <view class="location-box">
          <view class="location-status" :class="`status-${visit.location_status}`">
            {{ locationStatusLabel(visit.location_status) }}
          </view>
          <text class="address">{{ visit.address || '未记录详细地址' }}</text>
          <view v-if="visit.lng && visit.lat" class="coords">
            经纬度：{{ visit.lng.toFixed(6) }}, {{ visit.lat.toFixed(6) }}
          </view>
        </view>
      </view>

      <!-- 人员信息 -->
      <view class="section">
        <view class="section-title">
          <SvgIcon name="account" :size="32" color="#667eea" />
          <text>参与人员</text>
        </view>
        <view class="person-groups">
          <view class="group">
            <text class="group-label">内部人员：</text>
            <view class="tags">
              <view v-for="user in visit.system_users_info" :key="user.id" class="tag user-tag">
                {{ user.name }}
              </view>
              <text v-if="!visit.system_users_info?.length" class="none">无</text>
            </view>
          </view>
          <view class="group">
            <text class="group-label">客户人员：</text>
            <view class="tags">
              <view v-for="(contact, index) in visit.client_contacts_info" :key="index" class="tag contact-tag">
                {{ contact.name }}{{ contact.position ? `(${contact.position})` : '' }}
              </view>
              <text v-if="!visit.client_contacts_info?.length" class="none">无</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 核心价值信息 -->
      <view class="section">
        <view class="section-title">
          <SvgIcon name="order" :size="32" color="#667eea" />
          <text>洽谈内容 / 核心价值</text>
        </view>
        <view class="content-box">
          <text class="content-text">{{ visit.value_info }}</text>
        </view>
      </view>

      <!-- 附件 -->
      <view v-if="visit.attachments && visit.attachments.length > 0" class="section">
        <view class="section-title">
          <SvgIcon name="attach" :size="32" color="#667eea" />
          <text>现场附件 ({{ visit.attachments.length }})</text>
        </view>
        <view class="attachment-list">
          <view 
            v-for="(file, index) in visit.attachments" 
            :key="index" 
            class="attachment-item"
            @click="handlePreview(file)"
          >
            <image v-if="isImage(file.name)" :src="resolveAttachmentUrl(file.url)" mode="aspectFill" class="preview-img" />
            <view v-else class="file-icon">
              <SvgIcon name="file" :size="48" color="#909399" />
            </view>
            <text class="file-name">{{ file.name }}</text>
          </view>
        </view>
      </view>

      <!-- 元信息 -->
      <view class="footer-info">
        <text>记录人：{{ visit.creator_name || '未知' }}</text>
        <text>录入时间：{{ formatFullTime(visit.create_time) }}</text>
      </view>
    </view>

    <view v-if="!loading && !visit" class="empty-box">
      <u-empty mode="data" text="拜访记录不存在"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { resolveAttachmentUrl } from '@/utils/attachment'
import type { ClientVisit } from '@/types/interfaces/client-visit'
import dayjs from 'dayjs'

const id = ref<string | number>('')
const visit = ref<ClientVisit | null>(null)
const loading = ref(true)

const isValidVisit = computed(() => {
  if (!visit.value) return false
  return visit.value.location_status === 'success' || (visit.value.lng && visit.value.lat)
})

function locationStatusLabel(status: string) {
  const map = {
    success: '定位成功',
    fail: '定位失败',
    denied: '拒绝授权',
    offline: '无网络'
  }
  return map[status as keyof typeof map] || status
}

function formatFullTime(time: string) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

function isImage(filename: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
}

function handlePreview(file: any) {
  if (isImage(file.name)) {
    uni.previewImage({
      urls: [resolveAttachmentUrl(file.url)]
    })
  } else {
    uni.showToast({ title: '文件预览开发中', icon: 'none' })
  }
}

async function fetchDetail() {
  loading.value = true
  try {
    // 这里使用模拟数据，后续对接 API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟数据
    visit.value = {
      id: id.value,
      client_id: 1,
      visit_time: '2024-12-25 10:30:00',
      duration: 45,
      location_status: 'success',
      lng: 113.948222,
      lat: 22.542888,
      address: '广东省深圳市南山区高新科技园',
      system_users: [1],
      system_users_info: [{ id: 1, name: '销售经理-王大锤' }],
      client_contacts: [101],
      client_contacts_info: [{ id: 101, name: '李总', position: '采购主管' }],
      value_info: '客户对我们的解决方案非常感兴趣，特别是 AI 提取功能。目前的主要障碍是预算审批流程，预计下月中旬会有反馈。现场展示了 Demo，反馈良好。',
      attachments: [
        { name: '现场合照.jpg', url: 'https://via.placeholder.com/200' },
        { name: '客户名片.jpg', url: 'https://via.placeholder.com/200' }
      ],
      creator_name: '销售经理-王大锤',
      create_time: '2024-12-25 11:15:00'
    }
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onLoad((options) => {
  if (options?.id) {
    id.value = options.id
    fetchDetail()
  } else {
    uni.showToast({ title: '参数错误', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1500)
  }
})
</script>

<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared'
  }
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 30rpx;
}

.detail-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.header-section {
  border-bottom: 2rpx solid #f0f2f5;
  padding-bottom: 30rpx;
  margin-bottom: 30rpx;

  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #303133;
    }

    .valid-badge {
      background-color: #e1f3d8;
      color: #67c23a;
      font-size: 22rpx;
      padding: 4rpx 16rpx;
      border-radius: 20rpx;
    }
  }

  .time-row {
    display: flex;
    align-items: center;
    color: #606266;
    font-size: 28rpx;

    .time {
      margin-left: 10rpx;
    }
    
    .duration {
      color: #909399;
      margin-left: 10rpx;
    }
  }
}

.section {
  margin-bottom: 40rpx;

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #303133;

    text {
      margin-left: 12rpx;
    }
  }
}

.location-box {
  background: #f5f7fa;
  border-radius: 12rpx;
  padding: 24rpx;

  .location-status {
    display: inline-block;
    font-size: 24rpx;
    padding: 2rpx 12rpx;
    border-radius: 4rpx;
    margin-bottom: 12rpx;

    &.status-success { background: #e6f4ff; color: #409eff; }
    &.status-fail { background: #fef0f0; color: #f56c6c; }
  }

  .address {
    display: block;
    font-size: 28rpx;
    color: #303133;
    line-height: 1.4;
    margin-bottom: 12rpx;
  }

  .coords {
    font-size: 24rpx;
    color: #909399;
  }
}

.person-groups {
  .group {
    display: flex;
    margin-bottom: 16rpx;

    .group-label {
      width: 140rpx;
      font-size: 28rpx;
      color: #909399;
      flex-shrink: 0;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12rpx;

      .tag {
        font-size: 24rpx;
        padding: 4rpx 20rpx;
        border-radius: 6rpx;
      }

      .user-tag { background: #e6f1fc; color: #1989fa; }
      .contact-tag { background: #fdf6ec; color: #e6a23c; }
      .none { font-size: 26rpx; color: #c0c4cc; }
    }
  }
}

.content-box {
  background: #fdfdfd;
  border: 1rpx solid #f0f0f0;
  border-radius: 8rpx;
  padding: 20rpx;

  .content-text {
    font-size: 28rpx;
    color: #606266;
    line-height: 1.6;
    white-space: pre-wrap;
  }
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .attachment-item {
    width: 160rpx;
    
    .preview-img {
      width: 160rpx;
      height: 160rpx;
      border-radius: 8rpx;
    }

    .file-icon {
      width: 160rpx;
      height: 160rpx;
      background: #f5f7fa;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .file-name {
      display: block;
      font-size: 22rpx;
      color: #909399;
      margin-top: 8rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
  }
}

.footer-info {
  margin-top: 60rpx;
  padding-top: 30rpx;
  border-top: 1rpx dashed #EBEEF5;
  display: flex;
  flex-direction: column;
  gap: 10rpx;

  text {
    font-size: 24rpx;
    color: #c0c4cc;
  }
}

.empty-box {
  padding-top: 200rpx;
}
</style>


