# RichText 富文本组件

一个功能完整的富文本显示组件，支持 Markdown 语法和自定义样式。

## 功能特性

- ✅ 支持 Markdown 语法解析
- ✅ 响应式设计，适配移动端
- ✅ 多种主题模式（默认、暗色、紧凑）
- ✅ 自定义样式类支持
- ✅ 内容长度限制
- ✅ 完整的 CSS 样式管理
- ✅ 事件处理支持

## 基础用法

```vue
<template>
  <RichText :content="exhibition.description" />
</template>

<script setup>
import RichText from '@/components/RichText/index.vue'

const exhibition = {
  description: `
# 展览标题
这是一个**重要**的展览描述。

## 展览特色
- 特色一
- 特色二
- 特色三

### 联系方式
联系电话：13800138000
官网：https://example.com
  `
}
</script>
```

## 属性配置

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| content | string | '' | 富文本内容 |
| customClass | string | '' | 自定义样式类 |
| maxLength | number | 0 | 最大显示长度，0表示不限制 |
| showMore | boolean | false | 是否显示展开/收起功能（暂未实现） |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | event | 点击事件 |
| load | event | 加载完成事件 |
| error | event | 错误事件 |

## 样式主题

### 默认主题
```vue
<RichText :content="content" />
```

### 预设样式类

#### 展览描述样式
```vue
<RichText :content="content" custom-class="exhibition-description-text" />
```
- 适用于展览详情页的描述内容
- 带有渐变背景和圆角边框
- 标题有特殊的颜色和边框样式

#### 文章内容样式
```vue
<RichText :content="content" custom-class="article-content" />
```
- 适用于文章详情页
- 白色背景，带阴影效果
- 较大的字体和行高

#### 评论内容样式
```vue
<RichText :content="content" custom-class="comment-content" />
```
- 适用于评论列表
- 灰色背景，左侧有边框
- 较小的字体，适合短内容

#### 卡片内容样式
```vue
<RichText :content="content" custom-class="card-content" />
```
- 适用于卡片组件
- 渐变背景，带阴影
- 中等字体大小

#### 简洁样式
```vue
<RichText :content="content" custom-class="simple-content" />
```
- 无背景，无边框
- 适用于内嵌显示
- 最简洁的样式

### 主题模式

#### 暗色主题
```vue
<RichText :content="content" custom-class="theme-dark" />
```

#### 紧凑模式
```vue
<RichText :content="content" custom-class="compact" />
```

### 组合使用
```vue
<RichText
  :content="content"
  custom-class="exhibition-description-text theme-dark"
  :max-length="200"
/>
```

## 支持的 Markdown 语法

- **标题**：`# ## ### #### ##### ######`
- **粗体**：`**文本**` 或 `__文本__`
- **斜体**：`*文本*` 或 `_文本_`
- **链接**：`[文本](URL)` 或直接 `https://example.com`
- **图片**：`![alt](URL)`
- **列表**：`- 项目` 或 `* 项目` 或 `+ 项目`
- **有序列表**：`1. 项目`
- **引用**：`> 引用内容`
- **代码**：`` `代码` `` 或 ``` 代码块 ```
- **分割线**：`---` 或 `***`

## 样式自定义

组件提供了完整的 CSS 变量和深度选择器支持，可以轻松自定义样式：

```scss
// 自定义样式
.my-rich-text {
  :deep(h1) {
    color: #ff6b6b;
    font-size: 48rpx;
  }

  :deep(a) {
    color: #4ecdc4;
  }

  :deep(blockquote) {
    border-left-color: #ff6b6b;
    background: #fff5f5;
  }
}
```

## 使用示例

### 展览详情页
```vue
<template>
  <view class="exhibition-detail">
    <RichText
      :content="exhibition.description"
      custom-class="exhibition-content"
    />
  </view>
</template>

<style>
.exhibition-content {
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
}
</style>
```

### 文章内容
```vue
<template>
  <view class="article">
    <RichText
      :content="article.content"
      :max-length="500"
      custom-class="article-content compact"
    />
  </view>
</template>
```

### 评论内容
```vue
<template>
  <view class="comment">
    <RichText
      :content="comment.content"
      custom-class="comment-content"
      @click="onCommentClick"
    />
  </view>
</template>
```

## 注意事项

1. 组件会自动处理换行符和特殊字符
2. 图片会自动适配容器宽度
3. 链接会自动识别并添加样式
4. 代码块支持横向滚动
5. 表格支持响应式布局

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基础 Markdown 语法
- 提供多种主题模式
- 完整的样式管理
