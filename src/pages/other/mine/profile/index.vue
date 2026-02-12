<template>
  <view class="page">
    <view class="card">
      <view class="row">
        <text class="label">姓名</text>
        <text class="value">{{ profile.name || '-' }}</text>
      </view>
      <view class="row">
        <text class="label">角色</text>
        <text class="value">{{ roleLabel(profile.roleLevel) }}</text>
      </view>
      <view class="row">
        <text class="label">邮箱</text>
        <text class="value">{{ profile.email || '-' }}</text>
      </view>
      <view class="row">
        <text class="label">手机号</text>
        <text class="value">{{ profile.phonenumber || '-' }}</text>
      </view>
      <view class="row">
        <text class="label">所属部门</text>
        <text class="value">{{ profile.deptName || profile.teamName || '-' }}</text>
      </view>
      <view class="row">
        <text class="label">分所</text>
        <text class="value">{{ profile.branchName || '-' }}</text>
      </view>
      <view class="row">
        <text class="label">团队</text>
        <text class="value">{{ profile.teamName || '-' }}</text>
      </view>
    </view>

    <view class="edit-btn-wrapper">
      <u-button type="primary" @click="showEditPopup = true">编辑资料</u-button>
    </view>

    <!-- 编辑弹窗 -->
    <u-popup :show="showEditPopup" mode="center" @close="showEditPopup = false" round="16" :closeable="true">
      <view class="edit-popup">
        <view class="popup-title">编辑个人资料</view>
        <u-form ref="formRef" :model="editForm" :rules="rules" label-position="top" label-width="auto">
          <u-form-item label="姓名" prop="name">
            <u-input v-model="editForm.name" placeholder="请输入姓名" />
          </u-form-item>
          <u-form-item label="邮箱" prop="email">
            <u-input v-model="editForm.email" placeholder="请输入邮箱" type="text" />
          </u-form-item>
          <u-form-item label="手机号" prop="phonenumber">
            <u-input v-model="editForm.phonenumber" placeholder="请输入手机号" type="number" />
          </u-form-item>
          <u-form-item label="所属部门">
            <view class="dept-select" @click="openDeptPicker">
              <text class="dept-select-text">{{ editForm.dept_name || '请选择所属部门' }}</text>
              <u-icon name="arrow-right" size="16" color="#909399"></u-icon>
            </view>
          </u-form-item>
        </u-form>
        <view class="popup-buttons">
          <u-button type="default" @click="showEditPopup = false">取消</u-button>
          <u-button type="primary" @click="handleSave" :loading="saving">保存</u-button>
        </view>
      </view>
    </u-popup>

    <u-popup :show="showDeptPopup" mode="bottom" @close="showDeptPopup = false" round="16">
      <view class="dept-popup">
        <view class="dept-popup-title">选择部门</view>
        <view class="dept-breadcrumb" v-if="deptPathText">
          当前路径：{{ deptPathText }}
        </view>
        <scroll-view scroll-y class="dept-list">
          <view
            class="dept-item"
            v-for="item in deptOptions"
            :key="String(item.id)"
            @click="handleDeptSelect(item)"
          >
            <text class="dept-item-name">{{ item.name }}</text>
            <u-icon :name="item.has_children ? 'arrow-right' : 'checkmark'" size="14" color="#909399"></u-icon>
          </view>
        </scroll-view>
        <view class="dept-actions">
          <u-button type="default" @click="goDeptParent" :disabled="!deptStack.length">返回上级</u-button>
          <u-button type="primary" @click="showDeptPopup = false">完成</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMineProfile, updateMineProfile } from '@/api/mine'
import { getDeptTree } from '@/api/user'
import type { MineProfile } from '@/types/interfaces/mine'
import type { UserRoleLevel } from '@/types/interfaces/user'

const profile = ref<MineProfile>({
  user_id: '',
  name: '',
  roleLevel: 'SALES',
  orgScope: 'SELF'
})

const showEditPopup = ref(false)
const showDeptPopup = ref(false)
const saving = ref(false)
const formRef = ref()
const deptOptions = ref<Array<{ id: number | string; name: string; has_children?: boolean }>>([])
const deptStack = ref<Array<{ id: number | string; name: string }>>([])
const deptPathText = ref('')

const editForm = ref({
  name: '',
  email: '',
  phonenumber: '',
  dept_id: '' as number | string | null,
  dept_name: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phonenumber: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 监听弹窗显示，同步表单数据
watch(showEditPopup, (show) => {
  if (show) {
    editForm.value = {
      name: profile.value.name || '',
      email: profile.value.email || '',
      phonenumber: profile.value.phonenumber || '',
      dept_id: profile.value.deptId || '',
      dept_name: profile.value.deptName || profile.value.teamName || ''
    }
  }
})

function roleLabel(v: UserRoleLevel) {
  const map: Record<UserRoleLevel, string> = {
    SALES: '销售',
    TEAM: '团队管理',
    BRANCH: '分所管理',
    HQ: '总所管理'
  }
  return map[v] || v
}

async function load() {
  try {
    const res = await getMineProfile()
    profile.value = res
  } catch (e) {
    // ignore
  }
}

async function loadDeptOptions(parentId?: number | string) {
  const res: any = await getDeptTree(parentId)
  deptOptions.value = (res?.data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    has_children: item.has_children
  }))
}

async function openDeptPicker() {
  showDeptPopup.value = true
  deptStack.value = []
  deptPathText.value = ''
  await loadDeptOptions()
}

async function handleDeptSelect(item: { id: number | string; name: string; has_children?: boolean }) {
  editForm.value.dept_id = item.id
  editForm.value.dept_name = item.name
  if (item.has_children) {
    deptStack.value.push({ id: item.id, name: item.name })
    deptPathText.value = deptStack.value.map(it => it.name).join(' / ')
    await loadDeptOptions(item.id)
    return
  }
  showDeptPopup.value = false
}

async function goDeptParent() {
  if (!deptStack.value.length) return
  deptStack.value.pop()
  deptPathText.value = deptStack.value.map(it => it.name).join(' / ')
  const parent = deptStack.value.length ? deptStack.value[deptStack.value.length - 1].id : undefined
  await loadDeptOptions(parent)
}

async function handleSave() {
  try {
    // 表单验证
    await formRef.value?.validate()
    
    saving.value = true
    await updateMineProfile({
      name: editForm.value.name,
      email: editForm.value.email,
      phonenumber: editForm.value.phonenumber,
      dept_id: editForm.value.dept_id || null
    })
    
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
    
    showEditPopup.value = false
    // 重新加载数据
    await load()
  } catch (error: any) {
    if (error?.message) {
      uni.showToast({
        title: error.message,
        icon: 'none'
      })
    }
  } finally {
    saving.value = false
  }
}

onShow(load)
</script>

<style scoped>
.page {
  padding: 24rpx;
  box-sizing: border-box;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 8rpx 20rpx;
  box-sizing: border-box;
  margin-bottom: 24rpx;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  box-sizing: border-box;
}
.row:last-child {
  border-bottom: none;
}
.label {
  color: #666;
  font-size: 28rpx;
}
.value {
  color: #111;
  font-size: 28rpx;
  max-width: 70%;
  text-align: right;
}
.edit-btn-wrapper {
  padding: 0 20rpx;
}
.edit-popup {
  width: 600rpx;
  padding: 40rpx;
  background: #fff;
}
.popup-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 40rpx;
  text-align: center;
}
.popup-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}
.popup-buttons :deep(.u-button) {
  flex: 1;
}
.dept-select {
  width: 100%;
  min-height: 68rpx;
  border: 1rpx solid #dcdfe6;
  border-radius: 8rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
.dept-select-text {
  color: #303133;
  font-size: 28rpx;
}
.dept-popup {
  padding: 30rpx;
  background: #fff;
}
.dept-popup-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}
.dept-breadcrumb {
  margin-bottom: 16rpx;
  color: #909399;
  font-size: 24rpx;
}
.dept-list {
  max-height: 520rpx;
}
.dept-item {
  min-height: 84rpx;
  border-bottom: 1rpx solid #f2f3f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dept-item-name {
  font-size: 28rpx;
  color: #303133;
}
.dept-actions {
  margin-top: 24rpx;
  display: flex;
  gap: 16rpx;
}
.dept-actions :deep(.u-button) {
  flex: 1;
}
</style>
