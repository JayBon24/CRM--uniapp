<template>
  <view class="sales-stage-tag" :style="tagStyle">
    <text class="tag-text">{{ label }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SalesStage } from '@/types/interfaces/client'
import { SALES_STAGE_MAP } from '@/utils/client-enums'

interface Props {
  stage: SalesStage
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const config = computed(() => SALES_STAGE_MAP[props.stage])

const label = computed(() => config.value?.label || props.stage)

const tagStyle = computed(() => {
  const { color } = config.value
  const sizes = {
    small: { padding: '2rpx 8rpx', fontSize: '20rpx' },
    medium: { padding: '4rpx 12rpx', fontSize: '24rpx' },
    large: { padding: '6rpx 16rpx', fontSize: '28rpx' }
  }
  const sizeStyle = sizes[props.size]

  return {
    color,
    backgroundColor: `${color}15`,
    borderColor: `${color}40`,
    padding: sizeStyle.padding,
    fontSize: sizeStyle.fontSize
  }
})
</script>

<style scoped lang="scss">
.sales-stage-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4rpx;
  border: 1rpx solid;
  white-space: nowrap;
}

.tag-text {
  line-height: 1.2;
}
</style>

