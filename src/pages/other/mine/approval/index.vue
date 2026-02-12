<!-- @ts-nocheck -->
<template>
  <view class="page">
    <view class="tabs">
      <!-- HQ角色：显示待审批和已处理两个标签 -->
      <template v-if="userStore.roleLevel === 'HQ'">
        <view class="tab" :class="{ active: tab === 'pending' }" @click="switchTab('pending')">待审批</view>
        <view class="tab" :class="{ active: tab === 'handled' }" @click="switchTab('handled')">已处理</view>
      </template>
      <!-- 非HQ角色：只显示我的申请标签，包含待审批、已通过、已驳回 -->
      <template v-else>
        <view class="tab" :class="{ active: tab === 'my' }" @click="switchTab('my')">我的申请</view>
      </template>
    </view>

    <scroll-view class="list" scroll-y>
      <view v-for="item in rows" :key="item.id" class="item" @click="goDetail(item)">
        <view class="item-main">
          <view class="main-lines">
            <!-- 非HQ用户：不显示申请人（因为都是自己） -->
            <text v-if="userStore.roleLevel === 'HQ'" class="line">申请人：{{ item.applicant_user_name }}</text>
            <text class="line">客户：{{ item.client_name || '-' }}</text>
          </view>
          <view class="item-side">
            <text class="type">{{ typeLabel(item.type) }}</text>
            <text class="status" :class="item.status">{{ statusLabel(item.status) }}</text>
          </view>
        </view>
        <view class="bottom">
          <text class="time">{{ item.created_at }}</text>
        </view>
      </view>

      <view v-if="!rows.length" class="empty">暂无数据</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { getApprovalList } from '@/api/mine'

const userStore = useUserStore()
// HQ角色：pending/handled；非HQ角色：my（我的申请）
const tab = ref<'pending' | 'handled' | 'my'>(userStore.roleLevel === 'HQ' ? 'pending' : 'my')
const rows = ref<any[]>([])

function typeLabel(t: string) {
  const map: any = {
    LEAD_CLAIM: '线索申领',
    LEAD_CREATE: '新建线索审核',
    CLIENT_TRANSFER: '客户转交',
    HANDOVER: '转交'
  }
  return map[t] || t
}
function statusLabel(s: string) {
  const key = String(s || '').toLowerCase()
  const map: any = { pending: '待审批', approved: '已通过', rejected: '已驳回' }
  return map[key] || s
}

async function load() {
  if (userStore.roleLevel === 'HQ') {
    // HQ角色：使用pending/handled
    const res = await getApprovalList({ status: tab.value })
    rows.value = res.rows || []
  } else {
    // 非HQ用户：显示所有自己提交的申请（包括待审批和已处理）
    // 需要分别请求pending和handled，然后合并
    const [pendingRes, handledRes] = await Promise.all([
      getApprovalList({ status: 'pending' }),
      getApprovalList({ status: 'handled' })
    ])
    const allRows = [
      ...(pendingRes.rows || []),
      ...(handledRes.rows || [])
    ]
    // 按创建时间倒序排列
    allRows.sort((a, b) => {
      const timeA = a.created_at || ''
      const timeB = b.created_at || ''
      return timeB.localeCompare(timeA)
    })
    rows.value = allRows
  }
}

function switchTab(v: 'pending' | 'handled' | 'my') {
  tab.value = v
  load()
}

function goDetail(item: any) {
  uni.navigateTo({ url: `/pages/other/mine/approval/detail?id=${item.id}` })
}

onShow(load)
</script>

<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.tabs {
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #eee;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 22rpx 0;
  font-size: 28rpx;
  color: #666;
}
.tab.active {
  color: #667eea;
  font-weight: 600;
  border-bottom: 4rpx solid #667eea;
}
.list {
  flex: 1;
  padding: 16rpx 24rpx;
  box-sizing: border-box;
}
.item {
  background: #fff;
  border-radius: 16rpx;
  padding: 18rpx 18rpx;
  margin-bottom: 16rpx;
  box-sizing: border-box;
}
.item-main {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}
.main-lines {
  flex: 1;
}
.item-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
  min-width: 140rpx;
}
.type {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
}
.status {
  font-size: 24rpx;
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  color: #666;
  white-space: nowrap;
}
.status.pending {
  background: #ecf5ff;
  color: #409eff;
}
.status.approved {
  background: #f0f9eb;
  color: #67c23a;
}
.status.rejected {
  background: #fef0f0;
  color: #f56c6c;
}
.line {
  display: block;
  color: #666;
  font-size: 26rpx;
  margin-top: 6rpx;
}
.bottom {
  margin-top: 10rpx;
  color: #999;
  font-size: 24rpx;
}
.empty {
  padding: 40rpx 24rpx;
  color: #999;
  text-align: center;
}
</style>


