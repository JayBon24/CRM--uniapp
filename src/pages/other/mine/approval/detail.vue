<!-- @ts-nocheck -->
<template>
  <view class="page">
    <view v-if="task" class="card">
      <view class="title">{{ typeLabel(task.type) }}</view>
      <view class="row"><text class="k">状态</text><text class="v">{{ statusLabel(normalizedStatus) }}</text></view>
      <view class="row"><text class="k">申请人</text><text class="v">{{ task.applicant_user_name }}</text></view>
      <view class="row"><text class="k">客户</text><text class="v">{{ task.client_name || '-' }}</text></view>
      <view class="row"><text class="k">时间</text><text class="v">{{ task.created_at }}</text></view>

      <view class="payload">
        <view class="payload-title">申请内容</view>
        <view class="payload-box">
          <view v-if="task.type === 'LEAD_CLAIM'" class="payload-content">
            <view class="payload-row">
              <text class="payload-label">客户名称：</text>
              <text class="payload-value">{{ task.payload?.name || '-' }}</text>
            </view>
            <view class="payload-row">
              <text class="payload-label">申领原因：</text>
              <text class="payload-value">{{ task.payload?.reason || '-' }}</text>
            </view>
          </view>
          
          <view v-else-if="task.type === 'LEAD_CREATE'" class="payload-content">
            <view v-if="task.payload?.form" class="form-content">
              <view class="payload-row">
                <text class="payload-label">客户名称：</text>
                <text class="payload-value">{{ task.payload.form.client_name || '-' }}</text>
              </view>
              <view v-if="task.payload.form.contact_name" class="payload-row">
                <text class="payload-label">联系人：</text>
                <text class="payload-value">{{ task.payload.form.contact_name }}</text>
              </view>
              <view v-if="task.payload.form.mobile" class="payload-row">
                <text class="payload-label">手机号：</text>
                <text class="payload-value">{{ task.payload.form.mobile }}</text>
              </view>
              <view v-if="task.payload.form.region" class="payload-row">
                <text class="payload-label">地区：</text>
                <text class="payload-value">{{ task.payload.form.region }}</text>
              </view>
              <view v-if="task.payload.form.source_channel" class="payload-row">
                <text class="payload-label">来源渠道：</text>
                <text class="payload-value">{{ task.payload.form.source_channel }}</text>
              </view>
              <view v-if="task.payload.form.demand_summary" class="payload-row">
                <text class="payload-label">需求摘要：</text>
                <text class="payload-value">{{ task.payload.form.demand_summary }}</text>
              </view>
            </view>
            <view v-else class="payload-text">暂无表单数据</view>
          </view>
          
          <view v-else-if="task.type === 'CLIENT_TRANSFER' || task.type === 'HANDOVER'" class="payload-content">
            <view class="payload-row">
              <text class="payload-label">转出人：</text>
              <text class="payload-value">{{ task.payload?.from_user?.name || '-' }}</text>
            </view>
            <view class="payload-row">
              <text class="payload-label">转入人：</text>
              <text class="payload-value">{{ task.payload?.to_user?.name || '-' }}</text>
            </view>
            <view class="payload-row">
              <text class="payload-label">转交原因：</text>
              <text class="payload-value">{{ task.payload?.reason || '-' }}</text>
            </view>
          </view>
          
          <view v-else class="payload-text">{{ prettyPayload(task) }}</view>
        </view>
      </view>

      <view v-if="task.status === 'rejected' && task.reject_reason" class="reject">
        <text class="payload-title">驳回原因</text>
        <view class="payload-box">
          <text class="payload-text">{{ task.reject_reason }}</text>
        </view>
      </view>
    </view>

    <!-- 只有HQ角色可以审批 -->
    <view v-if="userStore.roleLevel === 'HQ' && task && isPending" class="bottom">
      <view class="btn ok" @click="handleApprove">通过</view>
      <view class="btn no" @click="openReject">驳回</view>
    </view>

    <view v-else-if="!task" class="empty">暂无数据</view>

    <view v-if="showReject" class="mask" @click="closeReject">
      <view class="popup" @click.stop>
        <view class="popup-title">驳回原因（必填）</view>
        <textarea v-model="rejectReason" class="textarea" placeholder="请输入驳回原因…" />
        <view class="popup-actions">
          <view class="pbtn" @click="closeReject">取消</view>
          <view class="pbtn primary" @click="confirmReject">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { getApprovalList, approveTask } from '@/api/mine'

const userStore = useUserStore()
const id = ref('')
const task = ref<any>(null)

const showReject = ref(false)
const rejectReason = ref('')

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
  const map: any = { pending: '待审批', approved: '已通过', rejected: '已驳回' }
  return map[s] || s
}

function prettyPayload(t: any) {
  try {
    const payload = t?.payload
    if (payload === null || payload === undefined) return ''
    if (typeof payload === 'string') return payload
    return JSON.stringify(payload, null, 2)
  } catch (e) {
    return String(t.payload || '')
  }
}

const normalizedStatus = computed(() => String(task.value?.status || '').toLowerCase())
const isPending = computed(() => normalizedStatus.value === 'pending')

async function load() {
  // 加载审批详情：HQ可以看到所有，非HQ只能看到自己的
  if (userStore.roleLevel === 'HQ') {
    // HQ：从所有审批中查找
    const p1 = await getApprovalList({ status: 'pending' })
    const p2 = await getApprovalList({ status: 'handled' })
    const all = [...(p1.rows || []), ...(p2.rows || [])]
    task.value = all.find((x: any) => x.id === id.value) || null
  } else {
    // 非HQ：从自己的申请中查找
    const p1 = await getApprovalList({ status: 'pending' })
    const p2 = await getApprovalList({ status: 'handled' })
    const all = [...(p1.rows || []), ...(p2.rows || [])]
    task.value = all.find((x: any) => x.id === id.value) || null
  }
}

async function handleApprove() {
  await approveTask({ id: id.value, approved: true })
  uni.showToast({ title: '已通过', icon: 'none' })
  await load()
}

function openReject() {
  rejectReason.value = ''
  showReject.value = true
}
function closeReject() {
  showReject.value = false
}
async function confirmReject() {
  const reason = String(rejectReason.value || '').trim()
  if (!reason) {
    uni.showToast({ title: '请输入驳回原因', icon: 'none' })
    return
  }
  await approveTask({ id: id.value, approved: false, reject_reason: reason })
  uni.showToast({ title: '已驳回', icon: 'none' })
  showReject.value = false
  await load()
}

onLoad((q: any) => {
  id.value = String(q?.id || '')
  load()
})
</script>

<style scoped>
.page {
  padding: 24rpx;
  padding-bottom: 140rpx;
  box-sizing: border-box;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-sizing: border-box;
}
.title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 12rpx;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  box-sizing: border-box;
}
.row:last-child {
  border-bottom: none;
}
.k {
  color: #666;
  font-size: 26rpx;
}
.v {
  color: #111;
  font-size: 26rpx;
  max-width: 70%;
  text-align: right;
}
.payload {
  margin-top: 18rpx;
}
.payload-title {
  color: #666;
  font-size: 26rpx;
}
.payload-box {
  margin-top: 10rpx;
  background: #f7f8fa;
  border-radius: 12rpx;
  padding: 14rpx;
  box-sizing: border-box;
}
.payload-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.payload-row {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.payload-label {
  font-size: 26rpx;
  color: #666;
  min-width: 140rpx;
  flex-shrink: 0;
}

.payload-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
  word-break: break-all;
}

.payload-text {
  font-size: 24rpx;
  color: #333;
  white-space: pre-wrap;
  word-break: break-all;
}
.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 16rpx;
  padding: 16rpx 24rpx 24rpx;
  background: #fff;
  box-sizing: border-box;
}
.btn {
  flex: 1;
  text-align: center;
  padding: 22rpx 0;
  border-radius: 12rpx;
  font-size: 30rpx;
  box-sizing: border-box;
}
.btn.ok {
  background: #667eea;
  color: #fff;
}
.btn.no {
  background: #fef0f0;
  color: #f56c6c;
  border: 1rpx solid #fbc4c4;
}
.empty {
  padding: 60rpx 24rpx;
  text-align: center;
  color: #999;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  box-sizing: border-box;
}
.popup {
  width: 100%;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-sizing: border-box;
}
.popup-title {
  font-size: 30rpx;
  font-weight: 600;
}
.textarea {
  margin-top: 12rpx;
  width: 100%;
  min-height: 180rpx;
  padding: 14rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
.popup-actions {
  margin-top: 14rpx;
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}
.pbtn {
  padding: 14rpx 24rpx;
  border-radius: 10rpx;
  background: #f3f4f6;
  color: #333;
  font-size: 28rpx;
}
.pbtn.primary {
  background: #667eea;
  color: #fff;
}
</style>

