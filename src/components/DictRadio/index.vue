<template>
  <view class="dict-radio">
    <!-- 中文注释：使用 uView Plus 的 up-radio-group/up-radio 实现字典单选 -->

    <up-radio-group v-model="innerValue" :disabled="disabled" :placement="direction === 'vertical' ? 'column' : 'row'"
      :class="['radio-group', { 'vertical': direction === 'vertical' }, customClass, { disabled }]"
      @change="onGroupChange">
      <up-radio v-for="item in dictData" :key="item.value" :name="item.value" :label="item.label" class="radio-item">
        <!-- 中文注释：可选的标签显示 -->
        <template v-if="item.elTagType" #label>
          <view style="display: inline-flex; align-items: center; gap: 12rpx;">
            <text class="radio-label">{{ item.label }}</text>
          </view>
        </template>
      </up-radio>
    </up-radio-group>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getDicts } from '@/api/dict'

// 定义组件属性
const props = defineProps({
  // 字典名称
  dictName: {
    type: String,
    required: true
  },
  // 绑定的值
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // 布局方向：horizontal 水平，vertical 垂直
  direction: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 自定义样式类
  customClass: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'change'])

// 中文注释：本组件使用本地状态存放字典数据，不依赖全局缓存
const localDictData = ref([])

// 获取字典数据（来自本地状态）
const dictData = computed(() => localDictData.value || [])

// 中文注释：内部绑定值，配合 up-radio-group 的 v-model 使用
const innerValue = ref(props.modelValue)

// 中文注释：父 -> 子 同步
watch(() => props.modelValue, (val) => {
  innerValue.value = val
})

// 中文注释：当缓存中无字典数据时，从接口拉取并写入缓存
const ensureDictLoaded = async (dictType) => {
  // 中文注释：始终从接口拉取，结果仅存入本组件本地状态
  try {
    const resp = await getDicts(dictType)
    if (resp && resp.code === 200 && Array.isArray(resp.rows)) {
      const formatted = resp.rows.map((item) => ({
        label: item.dictLabel,
        value: item.dictValue,
        elTagType: item.listClass,
        elTagClass: item.cssClass,
        listClass: item.listClass,
        cssClass: item.cssClass
      }))
      localDictData.value = formatted
    } else {
      localDictData.value = []
    }
  } catch (e) {
    localDictData.value = []
  }
}

// 中文注释：处理分组变更，向父组件同步并触发 change 事件
const onGroupChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

// 选择选项（兼容暴露方法，内部转调分组变更）
const selectItem = (value) => {
  if (props.disabled) return
  onGroupChange(value)
}

// 监听字典名称变化，重新获取数据
watch(
  () => props.dictName,
  async (newDictName) => {
    if (newDictName) {
      // 中文注释：切换字典时清空当前数据并重新拉取
      localDictData.value = []
      await ensureDictLoaded(newDictName)
    }
  },
  { immediate: true }
)

// 暴露组件方法（如果需要）
defineExpose({
  selectItem
})
</script>

<style scoped>
/* 中文注释：使用 uView Plus 原生样式，保留最小容器样式 */
.dict-radio { width: 100%; }
</style>
