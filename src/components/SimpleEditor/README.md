# SimpleEditor 富文本编辑器组件

一个基于 uni-app editor 组件的简单富文本编辑器，提供基本的文本格式化功能。

## 功能特性

- 基础文本格式化：加粗、斜体、下划线
- 文本对齐：左对齐、居中对齐、右对齐
- 列表：有序列表、无序列表
- 标题：H1、H2 标题
- 清除格式
- 支持图片上传和编辑
- 响应式设计
- 支持 v-model 双向绑定

## 使用方法

### 基础用法

```vue
<template>
  <SimpleEditor
    v-model="content"
    placeholder="请输入内容..."
    :height="'400px'"
  />
</template>

<script setup>
import { ref } from 'vue'
import SimpleEditor from '@/components/SimpleEditor/index.vue'

const content = ref('')
</script>
```

### 只读模式

```vue
<SimpleEditor
  v-model="content"
  :read-only="true"
  :height="'300px'"
/>
```

### 自定义高度

```vue
<SimpleEditor
  v-model="content"
  :height="'500px'"
/>
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String | '' | 编辑器内容，支持 v-model |
| placeholder | String | '请输入内容...' | 占位符文本 |
| readOnly | Boolean | false | 是否只读 |
| height | String | '300px' | 编辑器高度 |

## 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 内容变化时触发 | (value: string) |
| change | 内容变化时触发 | (value: string) |

## 方法

通过 ref 可以调用以下方法：

| 方法名 | 说明 | 参数 |
|--------|------|------|
| setContent | 设置编辑器内容 | (html: string) |
| getContent | 获取编辑器内容 | () => Promise<string> |
| clear | 清空编辑器内容 | () |
| format | 应用格式 | (name: string, value?: any) |

### 方法使用示例

```vue
<template>
  <SimpleEditor ref="editorRef" v-model="content" />
  <button @click="setContent">设置内容</button>
  <button @click="getContent">获取内容</button>
  <button @click="clearContent">清空内容</button>
</template>

<script setup>
import { ref } from 'vue'
import SimpleEditor from '@/components/SimpleEditor/index.vue'

const editorRef = ref(null)
const content = ref('')

const setContent = () => {
  editorRef.value?.setContent('<h1>这是标题</h1><p>这是内容</p>')
}

const getContent = async () => {
  const html = await editorRef.value?.getContent()
  console.log('编辑器内容:', html)
}

const clearContent = () => {
  editorRef.value?.clear()
}
</script>
```

## 平台支持

- ✅ H5
- ✅ 微信小程序（基础库 2.7.0+）
- ✅ App（vue 页面）
- ✅ 百度小程序（需引入动态库）
- ❌ 支付宝小程序
- ❌ 抖音小程序
- ❌ QQ小程序
- ❌ 快手小程序

## 注意事项

1. 在微信小程序中使用时，需要确保基础库版本在 2.7.0 以上
2. 编辑器内容以 HTML 格式存储，使用时需要注意 XSS 安全
3. 图片上传功能需要配置相应的上传接口
4. 组件会自动处理编辑器的初始化和销毁

## 样式定制

组件使用 scoped 样式，可以通过 CSS 变量或深度选择器进行样式定制：

```css
/* 自定义编辑器样式 */
:deep(.simple-editor) {
  border-color: #your-color;
}

:deep(.toolbar) {
  background-color: #your-bg-color;
}
```
