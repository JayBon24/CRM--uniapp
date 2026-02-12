# CustomSlider 自定义滑块组件

## 功能特性

- ✅ 支持拖拽和点击操作
- ✅ 支持自定义最小值、最大值、步长
- ✅ 支持禁用状态
- ✅ 支持自定义颜色和尺寸
- ✅ 支持显示当前值
- ✅ 完全兼容小程序环境
- ✅ 支持 v-model 双向绑定

## 使用方法

```vue
<template>
  <CustomSlider
    v-model="score"
    :min="0"
    :max="100"
    :step="1"
    :show-value="true"
    active-color="#1976d2"
    inactive-color="#e0e0e0"
    @change="onScoreChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import CustomSlider from '@/components/CustomSlider/index.vue'

const score = ref(50)

const onScoreChange = (value) => {
  console.log('分数变化:', value)
}
</script>
```

## 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | Number | - | 当前值（必需） |
| min | Number | 0 | 最小值 |
| max | Number | 100 | 最大值 |
| step | Number | 1 | 步长 |
| disabled | Boolean | false | 是否禁用 |
| showValue | Boolean | false | 是否显示当前值 |
| height | Number | 4 | 滑块轨道高度（px） |
| thumbSize | Number | 20 | 滑块按钮大小（px） |
| activeColor | String | '#1976d2' | 激活状态颜色 |
| inactiveColor | String | '#e0e0e0' | 非激活状态颜色 |
| thumbColor | String | '#ffffff' | 滑块按钮颜色 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | value: number | 值变化时触发（用于v-model） |
| change | value: number | 值变化时触发 |
| input | value: number | 值变化时触发（实时） |

## 样式自定义

组件使用CSS变量，可以通过以下方式自定义样式：

```css
.custom-slider {
  --active-color: #ff6b6b;
  --inactive-color: #f0f0f0;
  --thumb-color: #ffffff;
}
```

## 注意事项

1. 组件完全兼容uni-app和小程序环境
2. 支持触摸和鼠标操作
3. 自动处理边界值和步长调整
4. 在拖拽过程中会禁用过渡动画以提供更好的用户体验
