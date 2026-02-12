<template>
  <CaseSelector @select="onSelect" @cancel="onCancel" />
</template>

<script setup lang="ts">
import CaseSelector from '@/components/selector/CaseSelector.vue'

function onSelect(caseItem: { id: number; name: string }) {
  // 通过事件通道传递选中的案件
  uni.$emit('case-selected', caseItem)
}

function onCancel() {
  // 取消选择
}
</script>
