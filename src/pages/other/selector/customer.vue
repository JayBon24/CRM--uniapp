<template>
  <CustomerSelector @select="onSelect" @cancel="onCancel" />
</template>

<script setup lang="ts">
import CustomerSelector from '@/components/selector/CustomerSelector.vue'

function onSelect(customer: { id: number; name: string }) {
  // 通过事件通道传递选中的客户
  uni.$emit('customer-selected', customer)
}

function onCancel() {
  // 取消选择
}
</script>
