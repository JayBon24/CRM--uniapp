<template>
  <view v-if="hasPermission" class="permission-wrapper">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import auth from '@/utils/auth'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

// 定义组件属性
interface Props {
  permission?: string | string[]
  requireAll?: boolean
  managerOnly?: boolean
  salesOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  permission: '',
  requireAll: false,
  managerOnly: false,
  salesOnly: false
})

const userStore = useUserStore()

// 计算是否有权限
const hasPermission = computed(() => {
  // Tab1：按角色快速控制（比 permission 更轻量）
  if (props.managerOnly && !userStore.isManager) return false
  if (props.salesOnly && !userStore.isSales) return false

  if (!props.permission) {
    return true // 没有设置权限要求，默认显示
  }

  try {
    if (Array.isArray(props.permission)) {
      // 多个权限
      if (props.requireAll) {
        // 需要同时具备所有权限
        return auth.hasPermiAnd(props.permission)
      } else {
        // 具备任一权限即可
        return auth.hasPermiOr(props.permission)
      }
    } else {
      // 单个权限
      return auth.hasPermi(props.permission)
    }
  } catch (error) {
    console.error('权限验证错误:', error)
    return false
  }
})
</script>

<style lang="scss" scoped>
.permission-wrapper {
  display: inline-block;
}
</style>
