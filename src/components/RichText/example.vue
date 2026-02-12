<template>
  <view class="rich-text-example">
    <view class="example-section">
      <text class="section-title">基础用法</text>
      <RichText :content="basicContent" />
    </view>

    <view class="example-section">
      <text class="section-title">展览描述样式</text>
      <RichText :content="basicContent" custom-class="exhibition-description-text" />
    </view>

    <view class="example-section">
      <text class="section-title">文章内容样式</text>
      <RichText :content="basicContent" custom-class="article-content" />
    </view>

    <view class="example-section">
      <text class="section-title">评论内容样式</text>
      <RichText :content="basicContent" custom-class="comment-content" />
    </view>

    <view class="example-section">
      <text class="section-title">卡片内容样式</text>
      <RichText :content="basicContent" custom-class="card-content" />
    </view>

    <view class="example-section">
      <text class="section-title">简洁样式</text>
      <RichText :content="basicContent" custom-class="simple-content" />
    </view>

    <view class="example-section">
      <text class="section-title">长度限制</text>
      <RichText :content="longContent" :max-length="100" />
    </view>

    <view class="example-section">
      <text class="section-title">暗色主题</text>
      <RichText :content="basicContent" custom-class="theme-dark" />
    </view>

    <view class="example-section">
      <text class="section-title">紧凑模式</text>
      <RichText :content="basicContent" custom-class="compact" />
    </view>
  </view>
</template>

<script setup lang="ts">
import RichText from './index.vue'

// 基础内容示例
const basicContent = `
# 展览标题
这是一个**重要**的展览描述。

## 展览特色
- 特色一：展示优秀作品
- 特色二：专业评审团队
- 特色三：丰厚奖励

### 联系方式
联系电话：13800138000
官网：https://example.com

> 这是一个重要的引用内容，用于强调某些信息。

\`代码示例\`：这里有一些代码。

\`\`\`
function hello() {
  console.log('Hello World!');
}
\`\`\`
`

// 长内容示例
const longContent = `
这是一段很长的内容，用于测试长度限制功能。当内容超过设定的最大长度时，会自动截断并添加省略号。

这段内容包含了多个段落，每个段落都有不同的内容，用于展示富文本组件的各种功能。

包括**粗体文字**、*斜体文字*、[链接](https://example.com)等各种格式。

还有列表：
1. 第一项
2. 第二项
3. 第三项

以及引用：
> 这是一个引用块，用于突出显示重要信息。

最后还有一些代码：
\`console.log('Hello World!')\`
`
</script>

<style lang="scss" scoped>
.rich-text-example {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.example-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

</style>
