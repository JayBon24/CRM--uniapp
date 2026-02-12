<template>
  <image
    :src="iconPath"
    :mode="mode"
    :style="iconStyle"
    class="svg-icon"
    @click="$emit('click')"
  ></image>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props定义
interface Props {
  name: string // 图标名称
  size?: string | number // 图标大小
  color?: string // 图标颜色（通过CSS滤镜实现）
  mode?: string // 图片显示模式
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  color: '',
  mode: 'aspectFit'
})

// 图标路径映射
const iconMap: Record<string, string> = {
  building: '/static/icons/building.svg',
  'account-group': '/static/icons/account-group.svg',
  shopping: '/static/icons/shopping.svg',
  'file-document': '/static/icons/file-document.svg',
  ai: '/static/icons/ai.png',
  plus: '/static/icons/plus.svg',
  'arrow-left': '/static/icons/arrow-left.svg',
  more: '/static/icons/more.svg',
  target: '/static/icons/target.svg',
  grid: '/static/icons/grid.svg',
  image: '/static/icons/image.svg',
  lock: '/static/icons/lock.svg',
  publish: '/static/icons/publish.svg',
  foot: '/static/icons/foot.svg',
  user: '/static/icons/user.svg'
}

// 计算图标路径
const iconPath = computed(() => {
  return iconMap[props.name] || iconMap.building
})

const isSvg = computed(() => {
  return iconPath.value.toLowerCase().endsWith('.svg')
})

// 计算图标样式
const iconStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}rpx` : props.size
  return {
    width: size,
    height: size,
    // SVG图标颜色控制（使用滤镜实现）
    filter: isSvg.value && props.color ? getColorFilter(props.color) : 'none',
    transition: 'filter 0.3s ease'
  }
})

// 获取颜色滤镜
const getColorFilter = (color: string) => {
  // 将颜色转换为CSS滤镜（简化处理）
  const c = (color || '').trim().toLowerCase()
  if (c === '#fff' || c === '#ffffff' || c === 'white') {
    return 'invert(100%)'
  }
  if (c === '#667eea') {
    return 'invert(40%) sepia(87%) saturate(746%) hue-rotate(219deg) brightness(94%) contrast(85%)'
  }
  if (c === '#2f7bff' || c === '#3b82f6') {
    return 'invert(38%) sepia(95%) saturate(1717%) hue-rotate(201deg) brightness(102%) contrast(101%)'
  }
  return 'none'
}

// 事件定义
defineEmits<{
  click: []
}>()
</script>

<style lang="scss" scoped>
.svg-icon {
  flex-shrink: 0;
}
</style>
