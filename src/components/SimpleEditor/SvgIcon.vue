<template>
  <view class="svg-icon" :style="{ width: size + 'px', height: size + 'px' }">
    <image
      :src="iconPath"
      :style="{ width: '100%', height: '100%' }"
      mode="aspectFit"
    />
  </view>
</template>

<script setup>
import { computed } from 'vue'

// 定义组件属性
const props = defineProps({
  // 图标名称（对应svg文件名）
  name: {
    type: String,
    required: true
  },
  // 图标大小
  size: {
    type: [String, Number],
    default: 20
  }
})

// 计算图标路径
const iconPath = computed(() => {
  return `/static/svg/${props.name}.svg`
})
</script>

<style scoped>
.svg-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
