<!-- @ts-nocheck -->
<template>
  <view class="user-selector">
    <view class="selected-users">
      <view v-for="user in selectedUsers" :key="user.id" class="user-tag">
        <text class="user-name">{{ user.name }}</text>
        <view class="remove-btn" @click="removeUser(user.id)">
          <SvgIcon name="close" :size="24" color="#909399" />
        </view>
      </view>
      <view class="add-btn" @click="showSelector = true">
        <SvgIcon name="add" :size="28" color="#667eea" />
        <text class="add-text">添加内部人员</text>
      </view>
    </view>

    <!-- 选择器弹窗 -->
    <u-popup v-model:show="showSelector" mode="bottom" :round="20" @close="handleClose">
      <view class="selector-container">
        <!-- 头部 -->
        <view class="header">
          <text class="title">选择内部人员</text>
          <view class="close-btn" @click="handleClose">
            <text class="close-icon">✕</text>
          </view>
        </view>

        <!-- 面包屑导航 -->
        <view class="breadcrumb" v-if="breadcrumbList.length > 0">
          <view
            v-for="(item, index) in breadcrumbList"
            :key="index"
            class="breadcrumb-item"
            :class="{ 'breadcrumb-current': index === breadcrumbList.length - 1 }"
            @click="handleBreadcrumbClick(item, index)"
          >
            <text class="breadcrumb-text">{{ item.name }}</text>
            <text v-if="index !== breadcrumbList.length - 1" class="breadcrumb-separator">></text>
          </view>
        </view>

        <!-- 搜索框 -->
        <view class="search-box">
          <view class="search-input-wrapper">
            <text class="search-icon">🔍</text>
            <input
              v-model="searchKeyword"
              class="search-input"
              placeholder="搜索姓名或手机号"
              placeholder-style="color: #C0C4CC"
              @input="handleSearch"
            />
            <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
              <text class="clear-icon">✕</text>
            </view>
          </view>
        </view>

        <!-- 列表内容 -->
        <scroll-view class="list-container" scroll-y>
          <!-- 加载状态 -->
          <view v-if="loading" class="loading-state">
            <text class="loading-text">加载中...</text>
          </view>

          <!-- 空状态 -->
          <view v-else-if="currentList.length === 0" class="empty-state">
            <text class="empty-text">{{ searchKeyword ? '未找到相关结果' : '暂无数据' }}</text>
          </view>

          <!-- 列表项 -->
          <view v-else class="list-items">
            <!-- 部门项（可展开） -->
            <view
              v-for="item in deptItems"
              :key="`dept-${item.id}`"
              class="list-item org-item"
              @click="handleDeptClick(item)"
            >
              <view class="item-content">
                <view class="item-icon">
                  <SvgIcon name="building" :size="40" color="#667eea" />
                </view>
                <view class="item-info">
                  <text class="item-name">{{ item.name }}</text>
                  <text class="item-desc">{{ getDeptDesc(item) }}</text>
                </view>
              </view>
              <text class="arrow-icon">›</text>
            </view>

            <!-- 用户项（可选择） -->
            <view
              v-for="user in userItems"
              :key="`user-${user.id}`"
              class="list-item user-item"
              :class="{ selected: isSelected(user.id) }"
              @click="handleUserClick(user)"
            >
              <view class="item-content">
                <view class="item-avatar">
                  <text class="avatar-text">{{ getUserInitial(user.name) }}</text>
                </view>
                <view class="item-info">
                  <text class="item-name">{{ user.name }}</text>
                  <text class="item-desc">{{ getUserDesc(user) }}</text>
                </view>
              </view>
              <view class="checkbox" :class="{ checked: isSelected(user.id) }">
                <text v-if="isSelected(user.id)" class="check-icon">✓</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <!-- 底部按钮 -->
        <view class="footer">
          <view class="btn cancel-btn" @click="handleClose">
            <text class="btn-text">取消</text>
          </view>
          <view class="btn confirm-btn" @click="handleConfirm">
            <text class="btn-text">确定</text>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getDeptTree, getUsersByDept, searchDeptUsers } from '@/api/user'
import SvgIcon from '@/components/SvgIcon/index.vue'

interface DeptNode {
  id: number | string
  name: string
  parent: number | string | null
  userCount?: number
  hasChildren?: boolean
}

interface UserNode {
  id: number | string
  name: string
  username?: string
  mobile?: string
  roleLevel?: string
  deptId?: number | string
  deptName?: string
}

interface BreadcrumbItem {
  id: number | string
  name: string
  type: 'root' | 'dept'
  level: number
}

interface Props {
  modelValue: Array<{ id: number | string; name: string; [key: string]: any }>
  multiple?: boolean
  excludeRoles?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  excludeRoles: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: Array<{ id: number | string; name: string; [key: string]: any }>]
}>()

const userStore = useUserStore()
const showSelector = ref(false)
const loading = ref(false)
const searchKeyword = ref('')
const searchTimer = ref<any>(null)

// 当前层级数据
const currentLevel = ref<'dept' | 'user'>('dept')
const currentDeptId = ref<number | string | undefined>()

// 数据列表
const deptList = ref<DeptNode[]>([])
const userList = ref<UserNode[]>([])
const searchResult = ref<UserNode[]>([])

// 面包屑导航
const breadcrumbList = ref<BreadcrumbItem[]>([])

// 临时选中的用户（在弹窗中选择，确认后才更新到 modelValue）
const tempSelectedUserIds = ref<Set<number | string>>(new Set())

// 已选中的用户列表
const selectedUsers = computed(() => props.modelValue || [])

// 监听弹窗显示状态
watch(() => showSelector.value, (newVal) => {
  if (newVal) {
    // 弹窗打开时，初始化选择器并同步已选中的用户
    initSelector()
    // 同步已选中的用户ID到临时选中列表
    tempSelectedUserIds.value = new Set(selectedUsers.value.map(u => u.id))
  } else {
    // 弹窗关闭时，清空搜索和结果
    searchKeyword.value = ''
    searchResult.value = []
  }
})

// 初始化
onMounted(() => {
  if (showSelector.value) {
    initSelector()
  }
})

// 初始化选择器
async function initSelector() {
  // 清空之前的数据
  deptList.value = []
  userList.value = []
  searchResult.value = []
  searchKeyword.value = ''
  currentDeptId.value = undefined
  
  // 显示根部门（parent=null）
  currentLevel.value = 'dept'
  await loadDeptTree()
  breadcrumbList.value = [{ id: 'root', name: '部门', type: 'root', level: 0 }]
}

// 加载部门树
async function loadDeptTree(parentId?: number | string) {
  loading.value = true
  try {
    const res = await getDeptTree(parentId)
    if (res.code === 200 || res.code === 2000) {
      deptList.value = (res.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        parent: item.parent,
        userCount: item.user_count,
        hasChildren: item.has_children !== false
      }))
    }
  } catch (error) {
    console.error('加载部门列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 加载部门用户列表
async function loadDeptUsers(deptId: number | string) {
  loading.value = true
  try {
    const res = await getUsersByDept(deptId, false)
    if (res.code === 200 || res.code === 2000) {
      let users = (res.data || []).map((item: any) => ({
        id: item.id,
        name: item.name || item.username,
        username: item.username,
        mobile: item.mobile,
        roleLevel: item.role_level,
        deptId: item.dept_id,
        deptName: item.dept_name
      }))
      
      // 过滤排除的角色
      if (props.excludeRoles && props.excludeRoles.length > 0) {
        users = users.filter((user: UserNode) => {
          if (!user.roleLevel) return true
          return !props.excludeRoles.includes(user.roleLevel)
        })
      }
      
      userList.value = users
    }
  } catch (error) {
    console.error('加载用户列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 计算当前显示的列表
const currentList = computed(() => {
  if (searchKeyword.value) {
    return searchResult.value
  }
  
  if (currentLevel.value === 'dept') {
    return deptList.value
  } else {
    return userList.value
  }
})

// 部门项
const deptItems = computed(() => {
  return currentList.value.filter(item => 'parent' in item || 'hasChildren' in item) as DeptNode[]
})

// 用户项
const userItems = computed(() => {
  return currentList.value.filter(item => 'username' in item || 'roleLevel' in item) as UserNode[]
})

// 处理部门项点击
async function handleDeptClick(item: DeptNode) {
  // 如果有子部门，加载子部门
  if (item.hasChildren) {
    currentLevel.value = 'dept'
    currentDeptId.value = item.id
    await loadDeptTree(item.id)
    
    const deptIndex = breadcrumbList.value.findIndex(b => b.type === 'dept' && b.id === item.id)
    if (deptIndex === -1) {
      breadcrumbList.value.push({
        id: item.id,
        name: item.name,
        type: 'dept',
        level: breadcrumbList.value.length
      })
    } else {
      breadcrumbList.value = breadcrumbList.value.slice(0, deptIndex + 1)
    }
  } else {
    // 如果没有子部门，加载该部门的用户
    currentLevel.value = 'user'
    currentDeptId.value = item.id
    await loadDeptUsers(item.id)
    
    const deptIndex = breadcrumbList.value.findIndex(b => b.type === 'dept' && b.id === item.id)
    if (deptIndex === -1) {
      breadcrumbList.value.push({
        id: item.id,
        name: item.name,
        type: 'dept',
        level: breadcrumbList.value.length
      })
    } else {
      breadcrumbList.value = breadcrumbList.value.slice(0, deptIndex + 1)
    }
  }
}

// 处理用户点击（多选）
function handleUserClick(user: UserNode) {
  if (tempSelectedUserIds.value.has(user.id)) {
    tempSelectedUserIds.value.delete(user.id)
  } else {
    if (props.multiple) {
      tempSelectedUserIds.value.add(user.id)
    } else {
      tempSelectedUserIds.value.clear()
      tempSelectedUserIds.value.add(user.id)
    }
  }
}

// 判断用户是否被选中
function isSelected(userId: number | string) {
  return tempSelectedUserIds.value.has(userId)
}

// 处理面包屑点击
async function handleBreadcrumbClick(item: BreadcrumbItem, index: number) {
  if (index === breadcrumbList.value.length - 1) return
  
  breadcrumbList.value = breadcrumbList.value.slice(0, index + 1)
  
  // 清空搜索
  searchKeyword.value = ''
  searchResult.value = []
  
  if (item.type === 'root') {
    currentLevel.value = 'dept'
    currentDeptId.value = undefined
    await loadDeptTree()
  } else if (item.type === 'dept') {
    // 点击面包屑返回部门时，总是显示该部门的子部门列表（即使为空）
    // 这样用户可以清楚地看到该部门下没有子部门，而不是直接跳转到用户列表
    currentLevel.value = 'dept'
    currentDeptId.value = item.id
    await loadDeptTree(item.id)
  }
}

// 处理搜索
function handleSearch() {
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(async () => {
    if (!searchKeyword.value.trim()) {
      searchResult.value = []
      return
    }
    
    loading.value = true
    try {
      const params: any = { keyword: searchKeyword.value.trim() }
      if (currentDeptId.value) params.deptId = currentDeptId.value
      
      const res = await searchDeptUsers(params)
      if (res.code === 200 || res.code === 2000) {
        let users = (res.data || []).map((item: any) => ({
          id: item.id,
          name: item.name || item.username,
          username: item.username,
          mobile: item.mobile,
          roleLevel: item.role_level,
          deptId: item.dept_id,
          deptName: item.dept_name
        }))
        
        // 过滤排除的角色
        if (props.excludeRoles && props.excludeRoles.length > 0) {
          users = users.filter((user: UserNode) => {
            if (!user.roleLevel) return true
            return !props.excludeRoles.includes(user.roleLevel)
          })
        }
        
        searchResult.value = users
      }
    } catch (error) {
      console.error('搜索用户失败:', error)
    } finally {
      loading.value = false
    }
  }, 300)
}

// 清除搜索
function clearSearch() {
  searchKeyword.value = ''
  searchResult.value = []
}

// 获取部门描述
function getDeptDesc(item: DeptNode): string {
  return item.userCount ? `${item.userCount}人` : '部门'
}

// 获取用户描述
function getUserDesc(user: UserNode): string {
  const parts: string[] = []
  if (user.deptName) parts.push(user.deptName)
  if (user.mobile) parts.push(user.mobile)
  return parts.join(' · ') || user.roleLevel || ''
}

// 获取用户姓名首字母
function getUserInitial(name: string): string {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

// 确认选择
function handleConfirm() {
  // 收集所有选中的用户
  const selectedUserIds = Array.from(tempSelectedUserIds.value)
  
  // 从当前列表和搜索结果中查找用户信息
  const allUsers = [...userList.value, ...searchResult.value]
  const selectedUsersList = selectedUserIds.map(id => {
    let user = allUsers.find(u => u.id === id)
    if (!user) {
      // 如果找不到，尝试从已选中的用户中获取
      const existingUser = selectedUsers.value.find(u => u.id === id)
      if (existingUser) return existingUser
      // 如果还是找不到，创建一个基本对象
      return { id, name: `用户${id}` }
    }
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        mobile: user.mobile,
        roleLevel: user.roleLevel,
        deptId: user.deptId,
        deptName: user.deptName
      }
  })
  
  emit('update:modelValue', selectedUsersList)
  handleClose()
}

// 关闭选择器
function handleClose() {
  showSelector.value = false
  // 重置临时选中状态
  tempSelectedUserIds.value = new Set(selectedUsers.value.map(u => u.id))
}

// 移除用户
function removeUser(userId: number | string) {
  const newValue = selectedUsers.value.filter(u => u.id !== userId)
  emit('update:modelValue', newValue)
}
</script>

<style scoped lang="scss">
.user-selector {
  width: 100%;
  box-sizing: border-box;
}

.selected-users {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  width: 100%;
  box-sizing: border-box;
}

.user-tag {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 20rpx;
  background: #F0F2F5;
  border-radius: 8rpx;
  box-sizing: border-box;
  max-width: 100%;
}

.user-name {
  font-size: 26rpx;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background: #F5F7FA;
  border: 1rpx dashed #DCDFE6;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.add-text {
  font-size: 26rpx;
  color: #667eea;
  white-space: nowrap;
}

.selector-container {
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
}

.close-icon {
  font-size: 32rpx;
  color: #909399;
}

.search-icon {
  font-size: 32rpx;
  color: #C0C4CC;
}

.clear-icon {
  font-size: 24rpx;
  color: #C0C4CC;
}

.arrow-icon {
  font-size: 40rpx;
  color: #C0C4CC;
  font-weight: 300;
}

.check-icon {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
}

.breadcrumb {
  display: flex;
  align-items: center;
  padding: 20rpx 32rpx;
  background: #F5F7FA;
  border-bottom: 1rpx solid #EBEEF5;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.breadcrumb-text {
  font-size: 24rpx;
  color: #667eea;
  
  &:active {
    opacity: 0.7;
  }
}

.breadcrumb-item.breadcrumb-current {
  .breadcrumb-text {
    color: #303133;
    cursor: default;
  }
  
  &:active {
    opacity: 1;
  }
}

.breadcrumb-separator {
  font-size: 24rpx;
  color: #C0C4CC;
  margin: 0 8rpx;
}

.search-box {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 16rpx;
  height: 72rpx;
  padding: 0 24rpx;
  background: #F5F7FA;
  border-radius: 36rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #303133;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
}

.list-container {
  flex: 1;
  overflow: hidden;
}

.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
}

.loading-text,
.empty-text {
  font-size: 28rpx;
  color: #909399;
}

.list-items {
  padding: 0;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #EBEEF5;
  background: #fff;
  transition: background 0.2s;
  
  &:active {
    background: #F5F7FA;
  }
  
  &.selected {
    background: #E8F3FF;
  }
}

// 组织项和用户项样式继承自 .list-item

.item-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  background: #F0F2F5;
  border-radius: 12rpx;
}

.item-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

.avatar-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.item-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #303133;
}

.item-desc {
  font-size: 24rpx;
  color: #909399;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #DCDFE6;
  border-radius: 8rpx;
  
  &.checked {
    background: #667eea;
    border-color: #667eea;
  }
}

.footer {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #EBEEF5;
  background: #fff;
}

.btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
}

.cancel-btn {
  background: #F5F7FA;
  
  .btn-text {
    color: #606266;
  }
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .btn-text {
    color: #fff;
  }
}

.btn-text {
  font-size: 28rpx;
  font-weight: 500;
}
</style>

