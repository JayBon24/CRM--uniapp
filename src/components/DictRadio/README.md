# DictRadio 字典单选组件

基于字典数据的单选组件，支持水平/垂直布局，标签显示等功能。

## 功能特点

- 🎯 **字典驱动**：通过字典名称自动获取选项数据
- 📱 **响应式布局**：支持水平和垂直布局
- 🏷️ **标签支持**：支持显示选项标签
- 🎨 **自定义样式**：支持自定义样式类
- ♿ **无障碍支持**：支持禁用状态
- 📦 **轻量级**：基于 uView Plus 组件库

## 基本用法

```vue
<template>
  <view>
    <!-- 基本用法 -->
    <DictRadio
      v-model="selectedValue"
      dict-name="user_sex"
    />

    <!-- 垂直布局 -->
    <DictRadio
      v-model="selectedType"
      dict-name="user_type"
      direction="vertical"
    />

    <!-- 带事件监听 -->
    <DictRadio
      v-model="selectedStatus"
      dict-name="exhibition_status"
      @change="onStatusChange"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import DictRadio from '@/components/DictRadio/index.vue'

const selectedValue = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const onStatusChange = (value) => {
  console.log('选择变化:', value)
}
</script>
```

## Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| dictName | String | - | 字典名称（必填） |
| modelValue | String/Number | '' | 绑定的值 |
| direction | String | 'horizontal' | 布局方向：horizontal/vertical |
| disabled | Boolean | false | 是否禁用 |
| customClass | String | '' | 自定义样式类 |

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | value | v-model 更新事件 |
| change | value | 选择变化事件 |

## 字典数据格式

字典数据需要符合以下格式：

```typescript
interface DictData {
  label: string           // 显示文本
  value: string | number  // 选项值
  elTagType?: string     // 标签类型（primary/success/warning/error/info）
  elTagClass?: string    // 标签样式类
}
```

## 使用示例

### 1. 性别选择

```vue
<DictRadio
  v-model="formData.sex"
  dict-name="user_sex"
/>
```

### 2. 状态选择（垂直布局）

```vue
<DictRadio
  v-model="formData.status"
  dict-name="exhibition_status"
  direction="vertical"
  @change="onStatusChange"
/>
```

### 3. 禁用状态

```vue
<DictRadio
  v-model="formData.type"
  dict-name="user_type"
  :disabled="true"
/>
```

## 样式自定义

组件支持通过 `customClass` 属性传入自定义样式：

```vue
<DictRadio
  v-model="value"
  dict-name="test_dict"
  custom-class="my-custom-radio"
/>
```

```scss
.my-custom-radio {
  .radio-item {
    background-color: #f0f0f0;
    border-radius: 20rpx;
  }
}
```

## 注意事项

1. 确保字典数据已通过 `useDictStore` 设置
2. 字典名称必须与 store 中的 key 一致
3. 组件会自动监听字典数据变化
4. 支持字符串和数字类型的值
