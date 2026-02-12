<template>
  <view class="page">
    <view class="card" @click="goProfile">
      <view class="left">
        <image v-if="profile.avatar" class="avatar" :src="profile.avatar" mode="aspectFill" />
        <view v-else class="avatar placeholder">{{ profile.name?.slice(0, 1) || 'U' }}</view>
      </view>
      <view class="mid">
        <view class="name">{{ profile.name || '用户' }}</view>
        <view class="sub">{{ roleLabel(profile.roleLevel) }} · {{ profile.branchName || '-' }}{{ profile.teamName ? ` / ${profile.teamName}` : '' }}</view>
      </view>
      <view class="right">›</view>
    </view>

    <view class="section">
      <view class="item" @click="goProfile"><text>个人资料</text><text class="arrow">›</text></view>
      <view class="item" @click="goSettings"><text>设置</text><text class="arrow">›</text></view>
      <view v-if="userStore.isAdmin" class="item" @click="goMessages">
        <text>消息提醒</text>
        <view class="arrow">
          <text v-if="unreadCount > 0" class="badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</text>
          ›
        </view>
      </view>
      <view class="item" @click="goApproval">
        <text>审批中心</text>
        <view class="arrow">
          <text v-if="pendingApprovalCount > 0" class="badge">{{ pendingApprovalCount > 99 ? '99+' : pendingApprovalCount }}</text>
          ›
        </view>
      </view>
      <view class="item" @click="goFeedback"><text>反馈与支持</text><text class="arrow">›</text></view>
      <view class="item" @click="goAbout"><text>关于</text><text class="arrow">›</text></view>
    </view>

    <view v-if="userStore.isManager" class="section">
      <view class="section-title">管理入口</view>
      <view class="item" @click="goLeadsMgmt"><text>公海分配</text><text class="arrow">›</text></view>
      <view class="item" @click="goTeamSchedule"><text>团队日程</text><text class="arrow">›</text></view>
      <view class="item" @click="goReports"><text>管理报表</text><text class="arrow">›</text></view>
      <view v-if="userStore.isAdmin" class="item" @click="goRulesMgmt"><text>规则配置</text><text class="arrow">›</text></view>
    </view>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { getMineProfile, getPendingApprovalCount } from '@/api/mine'
import { getUnreadReminderCount } from '@/api/client'

const userStore = useUserStore()
const profile = ref({ name: '', avatar: '', roleLevel: 'SALES', branchName: '', teamName: '' })
const unreadCount = ref(0)
const pendingApprovalCount = ref(0)

function roleLabel(v) {
  const map = { SALES: '销售', TEAM: '团队管理', BRANCH: '分所管理', HQ: '总所管理' }
  return map[v] || v || '-'
}

onShow(() => {
  // 移除手动设置 tabBar 选中状态，由 custom-tab-bar 统一管理
  // const tabBar = getCurrentInstance()?.proxy?.getTabBar?.()
  // tabBar?.setSelected?.(4)

  // 切换角色后进入"我的"也要刷新展示
  getMineProfile().then((res) => (profile.value = res)).catch(() => {})
  if (userStore.isAdmin) {
    refreshUnread()
  } else {
    unreadCount.value = 0
  }
  refreshPendingApprovals()
})

const goProfile = () => uni.navigateTo({ url: '/pages/other/mine/profile/index' })
const goSettings = () => uni.navigateTo({ url: '/pages/other/settings/index' })
const goFeedback = () => uni.navigateTo({ url: '/pages/other/mine/feedback/index' })
const goAbout = () => uni.navigateTo({ url: '/pages/other/about/index' })
const goMessages = () => {
  if (!userStore.isAdmin) {
    uni.showToast({ title: '无权限访问', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/other/mine/messages/index' })
}
const goApproval = () => uni.navigateTo({ url: '/pages/other/mine/approval/index' })
const goLeadsMgmt = () => uni.navigateTo({ url: '/pages/other/mine/management/leads' })
const goTeamSchedule = () => uni.navigateTo({ url: '/pages/other/mine/management/team-schedule' })
const goReports = () => uni.switchTab({ url: '/pages/tab/reports-wrapper' })
const goRulesMgmt = () => {
  if (!userStore.isAdmin) {
    uni.showToast({ title: '无权限访问', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/other/mine/management/rules' })
}

function refreshUnread() {
  getUnreadReminderCount()
    .then((res) => {
      const directValue = Number(res?.unread)
      const dataValue = Number(res?.data?.unread)
      const altValue = Number(res?.unread_count)
      const finalValue = [directValue, dataValue, altValue].find(value => Number.isFinite(value) && value >= 0)
      unreadCount.value = finalValue ?? 0
    })
    .catch(() => {
      unreadCount.value = 0
    })
}

function refreshPendingApprovals() {
  getPendingApprovalCount()
    .then((count) => {
      pendingApprovalCount.value = count
    })
    .catch(() => {
      pendingApprovalCount.value = 0
    })
}

</script>

<style scoped>
.page {
  padding: 24rpx;
  box-sizing: border-box;
}
.card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 18rpx;
  box-sizing: border-box;
}
.left {
  width: 84rpx;
  height: 84rpx;
  margin-right: 16rpx;
}
.avatar {
  width: 84rpx;
  height: 84rpx;
  border-radius: 42rpx;
}
.avatar.placeholder {
  width: 84rpx;
  height: 84rpx;
  border-radius: 42rpx;
  background: #667eea;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 32rpx;
}
.mid {
  flex: 1;
  min-width: 0;
}
.name {
  font-size: 34rpx;
  font-weight: 700;
}
.sub {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.right {
  color: #bbb;
  font-size: 40rpx;
  margin-left: 8rpx;
}
.section {
  margin-top: 18rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-sizing: border-box;
}
.section-title {
  padding: 18rpx 18rpx 8rpx;
  font-size: 24rpx;
  color: #999;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 18rpx;
  border-top: 1rpx solid #f0f0f0;
  box-sizing: border-box;
  font-size: 30rpx;
}
.item:first-child {
  border-top: none;
}
.arrow {
  color: #bbb;
  font-size: 34rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.badge {
  min-width: 36rpx;
  padding: 2rpx 8rpx;
  border-radius: 18rpx;
  background: #f43f5e;
  color: #fff;
  font-size: 22rpx;
  text-align: center;
}
.placeholder {
  color: #aaa;
}
</style>
