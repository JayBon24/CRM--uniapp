<template>
  <view>
    <template v-for="item in options" :key="item.value">
      <template v-if="values.includes(item.value)">
        <!-- 默认样式显示 -->
        <text
          v-if="(item.elTagType == 'default' || item.elTagType == '') &&
                (item.elTagClass == '' || item.elTagClass == null)"
          :class="item.elTagClass"
          class="dict-text"
        >
          {{ item.label + " " }}
        </text>
        <!-- uView Tag显示 -->
        <u-tag
          v-else
          :type="item.elTagType"
          :class="item.elTagClass"
          class="dict-tag"
        >
          {{ item.label + " " }}
        </u-tag>
      </template>
    </template>
    <!-- 显示未匹配的值 -->
    <template v-if="unmatch && showValue">
      <text class="unmatch-text">{{ handleArray(unmatchArray) }}</text>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 记录未匹配的项
const unmatchArray = ref<string[]>([])

interface DictData {
  label: string
  value: string
  elTagType?: string
  elTagClass?: string
}

const props = defineProps<{
  // 字典选项数据
  options: DictData[]
  // 当前的值
  value: string | number | Array<string | number>
  // 当未找到匹配的数据时，显示value
  showValue?: boolean
  // 分隔符
  separator?: string
}>()

// 处理值为数组格式
const values = computed(() => {
  if (props.value === null || typeof props.value === 'undefined' || props.value === '') {
    return []
  }
  return Array.isArray(props.value)
    ? props.value.map(item => '' + item)
    : String(props.value).split(props.separator || ',')
})

// 检查是否有未匹配的值
const unmatch = computed(() => {
  unmatchArray.value = []
  if (props.value === null || typeof props.value === 'undefined' ||
      props.value === '' || !Array.isArray(props.options) ||
      props.options.length === 0) {
    return false
  }

  let hasUnmatch = false
  values.value.forEach(item => {
    if (!props.options.some(v => v.value === item)) {
      unmatchArray.value.push(item)
      hasUnmatch = true
    }
  })
  return hasUnmatch
})

// 处理数组显示
function handleArray(array: string[]): string {
  if (array.length === 0) return ""
  return array.reduce((pre, cur) => pre + " " + cur)
}
</script>

<style scoped>
.dict-text {
  font-size: 24rpx;
  color: #666;
  margin-right: 16rpx;
}

.dict-tag {
  margin-right: 16rpx;
}

.unmatch-text {
  font-size: 24rpx;
  color: #999;
  font-style: italic;
}
</style>
