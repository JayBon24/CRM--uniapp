<template>
  <view class="dimension-filter">
    <view class="filter-label">{{ text.dataRange }}</view>
    <view class="filter-options">
      <view
        v-for="(option, index) in availableOptions"
        :key="`${option.value}-${option.dimension || 'NONE'}`"
        class="filter-option"
        :class="{ active: isSelected(option.value, option.dimension) }"
        @click="handleSelect(option.value, option.dimension)"
      >
        {{ option.label }}
      </view>
    </view>

    <view v-if="showPersonnelDropdown" class="personnel-dropdown">
      <view class="dropdown-container" @click="handleDropdownClick">
        <view class="dropdown-label">
          {{ selectedPersonnelId ? getSelectedPersonnelName() : text.selectPersonnel }}
        </view>
        <view class="dropdown-arrow">v</view>
      </view>
    </view>

    <view v-if="showBranchDropdown" class="personnel-dropdown">
      <view class="dropdown-container" @click="handleBranchDropdownClick">
        <view class="dropdown-label">
          {{ selectedBranchId ? getSelectedBranchName() : text.selectBranch }}
        </view>
        <view class="dropdown-arrow">v</view>
      </view>
    </view>

    <PersonnelSelector
      v-model:show="showPersonnelSelector"
      :selected-id="selectedPersonnelId"
      :personnel-list="personnelList"
      :loading="loadingPersonnel"
      :title="text.selectPersonnel"
      :all-label="text.allData"
      :empty-text="text.emptyPersonnel"
      @select="handlePersonnelSelect"
    />

    <PersonnelSelector
      v-model:show="showBranchSelector"
      :selected-id="selectedBranchId"
      :personnel-list="branchList"
      :loading="loadingBranch"
      :title="text.selectBranch"
      :all-label="text.allBranch"
      :empty-text="text.emptyBranch"
      @select="handleBranchSelect"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { getUserList, getBranchList, getUsersByTeam, searchUsers } from '@/api/user'
import { getMineProfile } from '@/api/mine'
import PersonnelSelector from './PersonnelSelector.vue'
import type { DimensionFilter as DimensionFilterType, DataScope, DimensionType } from '@/types/interfaces/reports'

interface FilterOption {
  label: string
  value: DataScope
  dimension?: DimensionType
  showPersonnelSelector?: boolean
  showBranchSelector?: boolean
}

interface Personnel {
  id: number
  name: string
  role?: string
}

interface Branch {
  id: number
  name: string
  code?: string
}

interface Props {
  modelValue: DimensionFilterType
  hideCategory?: boolean  // 是否隐藏"按分类"选项（用于主页面）
}

interface Emits {
  (e: 'update:modelValue', value: DimensionFilterType): void
  (e: 'change', value: DimensionFilterType): void
}

const text = {
  dataRange: '\u6570\u636e\u8303\u56f4',
  selectPersonnel: '\u9009\u62e9\u4eba\u5458',
  selectBranch: '\u9009\u62e9\u5206\u6240',
  allData: '\u5168\u90e8\u6570\u636e',
  allBranch: '\u5168\u90e8\u5206\u6240',
  emptyPersonnel: '\u6682\u65e0\u4eba\u5458\u6570\u636e',
  emptyBranch: '\u6682\u65e0\u5206\u6240\u6570\u636e',
  personalData: '\u4e2a\u4eba\u6570\u636e',
  teamData: '\u56e2\u961f\u6570\u636e',
  byPersonnel: '\u6309\u4eba\u5458',
  byCategory: '\u6309\u5206\u7c7b',
  branchData: '\u5206\u6240\u6570\u636e',
  byPersonnelSplit: '\u6309\u4eba\u5458\u62c6\u5206',
  allDataOption: '\u5168\u90e8\u6570\u636e',
  byBranchSplit: '\u6309\u5206\u6240\u62c6\u5206'
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userStore = useUserStore()

const showPersonnelSelector = ref(false)
const selectedPersonnelId = ref<number | null>(null)
const personnelList = ref<Personnel[]>([])
const loadingPersonnel = ref(false)
const personnelListLoaded = ref(false)

const showBranchSelector = ref(false)
const selectedBranchId = ref<number | null>(null)
const branchList = ref<Branch[]>([])
const loadingBranch = ref(false)
const branchListLoaded = ref(false)
const resolvedBranchId = ref<number | string | null>(null)

const availableOptions = computed<FilterOption[]>(() => {
  const roleLevel = userStore.roleLevel
  let options: FilterOption[] = []

  switch (roleLevel) {
    case 'SALES':
      options = [
        { label: text.personalData, value: 'SELF', dimension: 'NONE' },
        { label: text.byCategory, value: 'SELF', dimension: 'CATEGORY' }
      ]
      break

    case 'TEAM':
      options = [
        { label: text.teamData, value: 'TEAM', dimension: 'NONE' },
        { label: text.byPersonnel, value: 'TEAM', dimension: 'PERSONNEL' },
        { label: text.byCategory, value: 'TEAM', dimension: 'CATEGORY' }
      ]
      break

    case 'BRANCH':
      options = [
        { label: text.branchData, value: 'BRANCH', dimension: 'BRANCH' },
        { label: text.byPersonnelSplit, value: 'BRANCH', dimension: 'PERSONNEL' },
        { label: text.byCategory, value: 'BRANCH', dimension: 'CATEGORY' }
      ]
      break

    case 'HQ':
      options = [
        { label: text.allDataOption, value: 'HQ', dimension: 'NONE', showPersonnelSelector: true },
        { label: text.byBranchSplit, value: 'HQ', dimension: 'BRANCH', showBranchSelector: true },
        { label: text.byCategory, value: 'HQ', dimension: 'CATEGORY' }
      ]
      break

    default:
      options = [{ label: text.personalData, value: 'SELF', dimension: 'NONE' }]
  }

  // 如果 hideCategory 为 true，过滤掉 CATEGORY 选项
  if (props.hideCategory) {
    options = options.filter(opt => opt.dimension !== 'CATEGORY')
  }

  return options
})

const showPersonnelDropdown = computed(() => {
  if (props.modelValue.dimension === 'PERSONNEL') return true
  return userStore.roleLevel === 'HQ' &&
    props.modelValue.scope === 'HQ' &&
    props.modelValue.dimension === 'NONE'
})

const showBranchDropdown = computed(() => {
  return userStore.roleLevel === 'HQ' &&
    props.modelValue.scope === 'HQ' &&
    props.modelValue.dimension === 'BRANCH'
})

const getSelectedPersonnelName = (): string => {
  if (!selectedPersonnelId.value) return text.allData
  const person = personnelList.value.find(p => p.id === selectedPersonnelId.value)
  return person ? person.name : text.allData
}

const getSelectedBranchName = (): string => {
  if (!selectedBranchId.value) return text.allBranch
  const branch = branchList.value.find(b => b.id === selectedBranchId.value)
  return branch ? branch.name : text.allBranch
}

const isSelected = (value: DataScope, dimension?: DimensionType): boolean => {
  const scopeMatch = props.modelValue.scope === value
  const dimensionMatch = props.modelValue.dimension === (dimension || 'NONE')
  return scopeMatch && dimensionMatch
}

const handleSelect = async (value: DataScope, dimension?: DimensionType) => {
  const option = availableOptions.value.find(opt => opt.value === value && opt.dimension === dimension)

  selectedPersonnelId.value = null
  selectedBranchId.value = null
  showPersonnelSelector.value = false
  showBranchSelector.value = false

  if (option?.showPersonnelSelector) {
    if (!personnelListLoaded.value) {
      await loadPersonnelList()
      personnelListLoaded.value = true
    }
  }

  if (option?.showBranchSelector) {
    if (!branchListLoaded.value) {
      await loadBranchList()
      branchListLoaded.value = true
    }
  }

  const newFilter: DimensionFilterType = {
    scope: value,
    dimension: dimension || 'NONE'
  }

  if (value == 'TEAM' && userStore.teamId) {
    // @ts-ignore
    newFilter.teamId = userStore.teamId
  } else if (value == 'BRANCH') {
    const branchId = userStore.branchId || (await resolveBranchId())
    if (branchId) {
      newFilter.branchId = branchId
    }
  } else if (value == 'SELF') {
    // @ts-ignore
    newFilter.userId = userStore.id
  }

  emit('update:modelValue', newFilter)
  emit('change', newFilter)
}

const loadPersonnelList = async () => {
  loadingPersonnel.value = true

  try {
    let response: any
    const scope = props.modelValue.scope
    if (scope === 'TEAM') {
      if (!userStore.teamId) {
        throw new Error('Missing team')
      }
      response = await getUsersByTeam(userStore.teamId)
    } else if (scope === 'BRANCH') {
      const branchId = await resolveBranchId()
      if (!branchId) {
        throw new Error('MISSING_BRANCH')
      }
      response = await searchUsers({ branchId })
    } else {
      response = await getUserList({
        page: 1,
        limit: 100
      })
    }

    let users = []
    if (response.data && Array.isArray(response.data)) {
      users = response.data
    } else if (Array.isArray(response)) {
      users = response
    }

    if (users.length == 0) {
      throw new Error('Empty list')
    }

    personnelList.value = users.map((user: any) => ({
      id: user.id,
      name: user.name || user.username || `User${user.id}`,
      role: Array.isArray(user.role) && user.role.length > 0 ? user.role[0] : user.role
    }))
  } catch (error) {
    const errMsg = (error as Error)?.message || ''
    uni.showToast({
      title: errMsg === 'MISSING_BRANCH' ? '分所信息缺失，请重新登录后重试' : text.emptyPersonnel,
      icon: 'none',
      duration: 2000
    })
    personnelList.value = []
  } finally {
    loadingPersonnel.value = false
  }
}

const resolveBranchId = async (): Promise<number | string | null> => {
  if (userStore.branchId) return userStore.branchId as number | string
  if (resolvedBranchId.value) return resolvedBranchId.value
  try {
    const profile: any = await getMineProfile()
    const branchId = profile?.branchId ?? profile?.branch_id ?? profile?.deptId ?? profile?.dept_id
    if (branchId) {
      resolvedBranchId.value = branchId
      userStore.branchId = branchId as any
      return branchId
    }
  } catch (error) {
    console.warn('获取分所ID失败:', error)
  }
  return null
}

const loadBranchList = async () => {
  loadingBranch.value = true

  try {
    const response: any = await getBranchList()

    let branches = []
    if (response.data && Array.isArray(response.data)) {
      branches = response.data
    } else if (Array.isArray(response)) {
      branches = response
    }

    if (branches.length == 0) {
      throw new Error('Empty list')
    }

    branchList.value = branches.map((branch: any) => ({
      id: branch.id,
      name: branch.name,
      code: branch.code
    }))
  } catch (error) {
    uni.showToast({
      title: text.emptyBranch,
      icon: 'none',
      duration: 2000
    })
    branchList.value = []
  } finally {
    loadingBranch.value = false
  }
}

const handleDropdownClick = async () => {
  if (!personnelListLoaded.value) {
    await loadPersonnelList()
    personnelListLoaded.value = true
  }
  showBranchSelector.value = false
  showPersonnelSelector.value = true
}

const handleBranchDropdownClick = async () => {
  if (!branchListLoaded.value) {
    await loadBranchList()
    branchListLoaded.value = true
  }
  showPersonnelSelector.value = false
  showBranchSelector.value = true
}

const handlePersonnelSelect = (id: number | null) => {
  selectedPersonnelId.value = id
  showPersonnelSelector.value = false
  showBranchSelector.value = false

  const newFilter: DimensionFilterType = {
    scope: props.modelValue.scope,
    dimension: props.modelValue.dimension === 'PERSONNEL' ? 'PERSONNEL' : 'NONE',
    userId: id || undefined
  }

  if (newFilter.scope === 'TEAM' && userStore.teamId) {
    // @ts-ignore
    newFilter.teamId = userStore.teamId
  }
  if (newFilter.scope === 'BRANCH' && userStore.branchId) {
    newFilter.branchId = userStore.branchId
  }

  emit('update:modelValue', newFilter)
  emit('change', newFilter)
}

const handleBranchSelect = (id: number | null) => {
  selectedBranchId.value = id
  showPersonnelSelector.value = false
  showBranchSelector.value = false

  const newFilter: DimensionFilterType = {
    scope: 'HQ',
    dimension: 'BRANCH'
  }

  if (id !== null) {
    newFilter.branchId = id
  }

  emit('update:modelValue', newFilter)
  emit('change', newFilter)
}
</script>

<style scoped lang="scss">
.dimension-filter {
  padding: 20rpx 32rpx 24rpx;
  background: #fff;
}

.filter-label {
  font-size: 24rpx;
  font-weight: 400;
  color: #8f959e;
  margin-bottom: 16rpx;
}

.filter-options {
  display: flex;
  gap: 12rpx;
}

.filter-option {
  flex: 1;
  padding: 20rpx 24rpx;
  background: #f7f8fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #646a73;
  text-align: center;
  transition: all 0.2s;
  font-weight: 500;

  &.active {
    background: #3370ff;
    color: #fff;
    font-weight: 600;
  }

  &:active {
    transform: scale(0.96);
  }
}

.personnel-dropdown {
  margin-top: 24rpx;
}

.dropdown-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background: #fff;
  border: 2rpx solid #e5e6eb;
  border-radius: 12rpx;
  transition: all 0.2s;

  &:active {
    background: #f7f8fa;
  }
}

.dropdown-label {
  font-size: 28rpx;
  color: #1f2329;
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 20rpx;
  color: #8f959e;
  transition: transform 0.2s;
}
</style>
