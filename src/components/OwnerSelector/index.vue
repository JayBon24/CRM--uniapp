<!-- @ts-nocheck -->
<template>
  <view class="owner-selector-popup">
    <u-popup v-model:show="show" mode="bottom" :round="20" @close="handleClose">
      <view class="selector-container">
        <!-- 头部 -->
        <view class="header">
          <text class="title">{{ props.title }}</text>
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
          <view class="btn confirm-btn" :class="{ disabled: !hasSelection }" @click="handleConfirm">
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
  userCount?: number // 用户数量（用于显示）
  hasChildren?: boolean // 是否有子部门
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
  modelValue: boolean
  selectedUserId?: number | string
  selectedUserIds?: Array<number | string>
  multiple?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedUserId: undefined,
  selectedUserIds: () => [],
  multiple: false,
  title: '选择经办人'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [user: UserNode | UserNode[]]
  'close': []
}>()

const userStore = useUserStore()
const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 状态管理
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

// 选中的用户ID
const selectedUserIds = ref<Array<number | string>>(
  props.multiple ? (props.selectedUserIds || []) : (props.selectedUserId ? [props.selectedUserId] : [])
)

watch(() => props.selectedUserId, (val) => {
  if (!props.multiple) {
    selectedUserIds.value = val !== undefined ? [val] : []
  }
})
watch(() => props.selectedUserIds, (val) => {
  if (props.multiple) {
    selectedUserIds.value = Array.isArray(val) ? [...val] : []
  }
})

const hasSelection = computed(() => selectedUserIds.value.length > 0)
const isSelected = (id: number | string) => selectedUserIds.value.some(item => String(item) === String(id))

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

// 监听弹窗显示状态，每次打开时重新初始化
watch(() => show.value, (newVal) => {
  if (newVal) {
    // 弹窗打开时，重新初始化选择器
    initSelector()
  } else {
    // 弹窗关闭时，清空搜索和结果
    searchKeyword.value = ''
    searchResult.value = []
  }
}, { immediate: true })

// 初始化
onMounted(() => {
  // 如果弹窗已经打开，则初始化
  if (show.value) {
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
      userList.value = (res.data || []).map((item: any) => ({
        id: item.id,
        name: item.name || item.username,
        username: item.username,
        mobile: item.mobile,
        roleLevel: item.role_level,
        deptId: item.dept_id,
        deptName: item.dept_name
      }))
    }
  } catch (error) {
    console.error('加载用户列表失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 处理部门项点击
async function handleDeptClick(item: DeptNode) {
  // 检查是否有子部门
  if (item.hasChildren) {
    // 有子部门，进入子部门列表
    currentLevel.value = 'dept'
    currentDeptId.value = item.id
    await loadDeptTree(item.id)
    
    // 更新面包屑
    const deptIndex = breadcrumbList.value.findIndex(b => b.type === 'dept' && b.id === item.id)
    if (deptIndex === -1) {
      breadcrumbList.value.push({
        id: item.id,
        name: item.name,
        type: 'dept',
        level: breadcrumbList.value.length
      })
    } else {
      // 如果已存在，移除后面的层级
      breadcrumbList.value = breadcrumbList.value.slice(0, deptIndex + 1)
    }
  } else {
    // 没有子部门，直接加载该部门的用户
    currentLevel.value = 'user'
    currentDeptId.value = item.id
    await loadDeptUsers(item.id)
    
    // 更新面包屑
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

// 处理用户点击
function handleUserClick(user: UserNode) {
  const id = user.id
  if (props.multiple) {
    const idx = selectedUserIds.value.findIndex(item => String(item) === String(id))
    if (idx >= 0) {
      selectedUserIds.value.splice(idx, 1)
    } else {
      selectedUserIds.value.push(id)
    }
  } else {
    selectedUserIds.value = [id]
  }
}

// 处理面包屑点击
async function handleBreadcrumbClick(item: BreadcrumbItem, index: number) {
  if (index === breadcrumbList.value.length - 1) {
    // 点击当前层级，不处理
    return
  }
  
  // 移除后面的层级
  breadcrumbList.value = breadcrumbList.value.slice(0, index + 1)
  
  // 清空搜索
  searchKeyword.value = ''
  searchResult.value = []
  
  // 根据层级加载数据
  if (item.type === 'root') {
    // 返回根部门列表
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
        searchResult.value = (res.data || []).map((item: any) => ({
          id: item.id,
          name: item.name || item.username,
          username: item.username,
          mobile: item.mobile,
          roleLevel: item.role_level,
          deptId: item.dept_id,
          deptName: item.dept_name
        }))
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
  if (user.roleLevel) parts.push(user.roleLevel)
  return parts.join(' · ') || ''
}

// 获取用户姓名首字母
function getUserInitial(name: string): string {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

// 确认选择
function handleConfirm() {
  if (!hasSelection.value) {
    uni.showToast({ title: "\u8bf7\u9009\u62e9\u7ecf\u529e\u4eba", icon: "none" })
    return
  }

  const ids = selectedUserIds.value.map(item => String(item))
  const allUsers = [...userItems.value, ...searchResult.value, ...userList.value]
  const userMap = new Map(allUsers.map(u => [String(u.id), u]))
  const selectedUsers = ids.map(id => userMap.get(id) || { id, name: `\u7528\u6237${id}` })

  emit('confirm', props.multiple ? selectedUsers : selectedUsers[0])
  handleClose()
}

// ?????
function handleClose() {
  show.value = false
  emit('close')
  // ????
  searchKeyword.value = ""
  searchResult.value = []
  if (props.multiple) {
    selectedUserIds.value = Array.isArray(props.selectedUserIds) ? [...props.selectedUserIds] : []
  } else {
    selectedUserIds.value = props.selectedUserId !== undefined ? [props.selectedUserId] : []
  }
}
</script>

<style scoped lang="scss">
// Popup样式由u-popup组件控制

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
  
  &.disabled {
    opacity: 0.5;
  }
}

.btn-text {
  font-size: 28rpx;
  font-weight: 500;
}
</style>