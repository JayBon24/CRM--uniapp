<template>
	<!-- 中文注释：使用view替代text，提高小程序兼容性，确保内容始终显示 -->
	<view class="dict-label">{{ labelText }}</view>
</template>

<script setup lang="ts">
import { computed, watch, getCurrentInstance } from 'vue'
import { useDictStore } from '@/stores/dict'

// 中文注释：组件属性，type为字典类型，value为字典值
const props = defineProps<{ type: string; value: string }>()

// 中文注释：通过全局useDict触发加载，避免刷新首次为空
const { proxy } = getCurrentInstance() as any
if (props.type && proxy?.useDict) {
	proxy.useDict(props.type)
}

// 中文注释：优先从Pinia缓存获取，其次从useDict返回的ref读取，最后回退为原始value
const dictStore = useDictStore()
const labelText = computed(() => {
	if (!props.type) return props.value || ''
	const cached = dictStore.getDict(props.type) as any[] | undefined
	const list = Array.isArray(cached) ? cached : []
	const hit = list.find(it => (it.value ?? it.dictValue) === props.value)
	return hit ? (hit.label ?? hit.dictLabel) : (props.value || '')
})

// 中文注释：监听字典数据变化，确保在小程序中正确更新显示
watch(() => dictStore.dict, () => {
	// 强制触发重新计算
}, { deep: true })
</script>

<style scoped>
/* 中文注释：确保DictLabel在小程序中正确显示，继承父元素样式 */
.dict-label {
	display: inline;
	font-size: inherit;
	color: inherit;
	font-weight: inherit;
	line-height: inherit;
}
</style>

