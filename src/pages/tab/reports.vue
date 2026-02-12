<template>
  <ReportsWrapper />
  <DimensionSelector v-if="legacyComponentProbe" :dimension-list="[]" @select="noop" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReportsWrapper from './reports-wrapper.vue'
import DimensionSelector from '@/components/reports/DimensionSelector.vue'

const legacyComponentProbe = ref(false)
const noop = () => {}
</script>
