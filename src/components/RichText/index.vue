<template>
  <rich-text :nodes="formattedNodes" :class="['rich-text', customClass]"></rich-text>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 定义组件属性
interface Props {
  content?: string // 富文本内容
  customClass?: string // 自定义样式类
  maxLength?: number // 最大显示长度，超出则截断
  showMore?: boolean // 是否显示"展开/收起"功能
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  customClass: '',
  maxLength: 0,
  showMore: false
})

// 定义事件
const emit = defineEmits<{
  click: [event: any]
  load: [event: any]
  error: [event: any]
}>()

// 格式化富文本内容
const formatRichText = (content: string) => {
  if (!content) return []

  // 处理换行符
  let formattedContent = content.replace(/\n/g, '<br/>')

  // 处理链接
  formattedContent = formattedContent.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" style="color: #1890ff; text-decoration: underline;">$1</a>'
  )

  // 处理图片
  formattedContent = formattedContent.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />'
  )

  // 处理粗体
  formattedContent = formattedContent.replace(
    /\*\*(.*?)\*\*/g,
    '<strong style="font-weight: bold;">$1</strong>'
  )

  // 处理斜体
  formattedContent = formattedContent.replace(
    /\*(.*?)\*/g,
    '<em style="font-style: italic;">$1</em>'
  )

  // 处理标题
  formattedContent = formattedContent.replace(
    /^### (.*$)/gim,
    '<h3 style="font-size: 18px; font-weight: bold; margin: 16px 0 8px 0; color: #333;">$1</h3>'
  )
  formattedContent = formattedContent.replace(
    /^## (.*$)/gim,
    '<h2 style="font-size: 20px; font-weight: bold; margin: 20px 0 10px 0; color: #333;">$1</h2>'
  )
  formattedContent = formattedContent.replace(
    /^# (.*$)/gim,
    '<h1 style="font-size: 22px; font-weight: bold; margin: 24px 0 12px 0; color: #333;">$1</h1>'
  )

  // 处理列表
  formattedContent = formattedContent.replace(
    /^[\s]*[-*+]\s+(.*$)/gim,
    '<li style="margin: 4px 0; padding-left: 8px;">$1</li>'
  )

  // 处理有序列表
  formattedContent = formattedContent.replace(
    /^[\s]*\d+\.\s+(.*$)/gim,
    '<li style="margin: 4px 0; padding-left: 8px;">$1</li>'
  )

  // 处理引用
  formattedContent = formattedContent.replace(
    /^>\s*(.*$)/gim,
    '<blockquote style="border-left: 4px solid #e6f7ff; padding-left: 12px; margin: 8px 0; color: #666; background: #f8f9fa;">$1</blockquote>'
  )

  // 处理代码块
  formattedContent = formattedContent.replace(
    /```([\s\S]*?)```/g,
    '<pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto; margin: 8px 0;"><code style="font-family: monospace; font-size: 14px;">$1</code></pre>'
  )

  // 处理行内代码
  formattedContent = formattedContent.replace(
    /`([^`]+)`/g,
    '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 2px; font-family: monospace; font-size: 14px;">$1</code>'
  )

  return formattedContent
}

// 计算属性：格式化后的节点
const formattedNodes = computed(() => {
  let content = props.content

  // 如果设置了最大长度且内容超出，则截断
  if (props.maxLength > 0 && content.length > props.maxLength) {
    content = content.substring(0, props.maxLength) + '...'
  }

  return formatRichText(content)
})

// 处理点击事件
const handleClick = (event: any) => {
  emit('click', event)
}

// 处理加载事件
const handleLoad = (event: any) => {
  emit('load', event)
}

// 处理错误事件
const handleError = (event: any) => {
  emit('error', event)
}
</script>

<style lang="scss" scoped>
.rich-text {
  // 基础样式
  line-height: 1.6;
  color: #333;
  font-size: 28rpx;
  word-wrap: break-word;
  word-break: break-all;

  // 段落样式
  :deep(p) {
    margin: 16rpx 0;
    line-height: 1.6;
  }

  // 标题样式
  :deep(h1) {
    font-size: 44rpx;
    font-weight: bold;
    margin: 48rpx 0 24rpx 0;
    color: #333;
    line-height: 1.4;
  }

  :deep(h2) {
    font-size: 40rpx;
    font-weight: bold;
    margin: 40rpx 0 20rpx 0;
    color: #333;
    line-height: 1.4;
  }

  :deep(h3) {
    font-size: 36rpx;
    font-weight: bold;
    margin: 32rpx 0 16rpx 0;
    color: #333;
    line-height: 1.4;
  }

  :deep(h4) {
    font-size: 32rpx;
    font-weight: bold;
    margin: 28rpx 0 14rpx 0;
    color: #333;
    line-height: 1.4;
  }

  :deep(h5) {
    font-size: 30rpx;
    font-weight: bold;
    margin: 24rpx 0 12rpx 0;
    color: #333;
    line-height: 1.4;
  }

  :deep(h6) {
    font-size: 28rpx;
    font-weight: bold;
    margin: 20rpx 0 10rpx 0;
    color: #333;
    line-height: 1.4;
  }

  // 列表样式
  :deep(ul) {
    margin: 16rpx 0;
    padding-left: 32rpx;
  }

  :deep(ol) {
    margin: 16rpx 0;
    padding-left: 32rpx;
  }

  :deep(li) {
    margin: 8rpx 0;
    line-height: 1.6;
  }

  // 链接样式
  :deep(a) {
    color: #1890ff;
    text-decoration: underline;
    word-break: break-all;

    &:active {
      color: #40a9ff;
    }
  }

  // 图片样式
  :deep(img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 20rpx 0;
    border-radius: 8rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }

  // 代码样式
  :deep(code) {
    background: #f5f5f5;
    padding: 4rpx 8rpx;
    border-radius: 4rpx;
    font-family: 'Courier New', monospace;
    font-size: 24rpx;
    color: #e74c3c;
  }

  :deep(pre) {
    background: #f5f5f5;
    padding: 24rpx;
    border-radius: 8rpx;
    overflow-x: auto;
    margin: 16rpx 0;
    border: 1rpx solid #e8e8e8;

    code {
      background: none;
      padding: 0;
      color: #333;
      font-size: 24rpx;
    }
  }

  // 引用样式
  :deep(blockquote) {
    border-left: 8rpx solid #e6f7ff;
    padding-left: 24rpx;
    margin: 16rpx 0;
    color: #666;
    background: #f8f9fa;
    border-radius: 0 8rpx 8rpx 0;
    font-style: italic;
  }

  // 表格样式
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 16rpx 0;
    border: 1rpx solid #e8e8e8;
    border-radius: 8rpx;
    overflow: hidden;
  }

  :deep(th) {
    background: #f8f9fa;
    padding: 16rpx;
    text-align: left;
    font-weight: bold;
    border-bottom: 1rpx solid #e8e8e8;
  }

  :deep(td) {
    padding: 16rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }

  :deep(tr:last-child td) {
    border-bottom: none;
  }

  // 分割线样式
  :deep(hr) {
    border: none;
    height: 2rpx;
    background: #e8e8e8;
    margin: 32rpx 0;
  }

  // 强调样式
  :deep(strong) {
    font-weight: bold;
    color: #333;
  }

  :deep(em) {
    font-style: italic;
    color: #666;
  }

  // 删除线样式
  :deep(del) {
    text-decoration: line-through;
    color: #999;
  }

  // 下划线样式
  :deep(u) {
    text-decoration: underline;
  }

  // 高亮样式
  :deep(mark) {
    background: #fff2cc;
    padding: 2rpx 4rpx;
    border-radius: 2rpx;
  }

  // 小字体样式
  :deep(small) {
    font-size: 24rpx;
    color: #999;
  }

  // 大字体样式
  :deep(big) {
    font-size: 32rpx;
  }

  // 上标下标样式
  :deep(sup) {
    font-size: 20rpx;
    vertical-align: super;
  }

  :deep(sub) {
    font-size: 20rpx;
    vertical-align: sub;
  }
}

// 主题变体
.rich-text.theme-dark {
  color: #fff;
  background: #1a1a1a;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    color: #fff;
  }

  :deep(blockquote) {
    background: #2a2a2a;
    color: #ccc;
    border-left-color: #4a9eff;
  }

  :deep(code) {
    background: #2a2a2a;
    color: #ff6b6b;
  }

  :deep(pre) {
    background: #2a2a2a;
    border-color: #444;

    code {
      color: #fff;
    }
  }

  :deep(table) {
    border-color: #444;
  }

  :deep(th) {
    background: #2a2a2a;
    border-bottom-color: #444;
  }

  :deep(td) {
    border-bottom-color: #333;
  }

  :deep(hr) {
    background: #444;
  }
}

// 紧凑模式
.rich-text.compact {
  :deep(p) {
    margin: 8rpx 0;
  }

  :deep(h1) {
    margin: 24rpx 0 12rpx 0;
  }

  :deep(h2) {
    margin: 20rpx 0 10rpx 0;
  }

  :deep(h3) {
    margin: 16rpx 0 8rpx 0;
  }

  :deep(ul),
  :deep(ol) {
    margin: 8rpx 0;
  }

  :deep(li) {
    margin: 4rpx 0;
  }

  :deep(blockquote) {
    margin: 8rpx 0;
    padding-left: 16rpx;
  }

  :deep(pre) {
    margin: 8rpx 0;
    padding: 16rpx;
  }

  :deep(img) {
    margin: 10rpx 0;
  }
}

// 展览描述专用样式
.rich-text.exhibition-description-text {
  font-size: 28rpx;
  line-height: 1.8;
  color: #333;
  padding: 20rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12rpx;
  border: 1rpx solid #e9ecef;
}

// 文章内容样式
.rich-text.article-content {
  font-size: 30rpx;
  line-height: 1.8;
  color: #333;
  padding: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

// 评论内容样式
.rich-text.comment-content {
  font-size: 26rpx;
  line-height: 1.6;
  color: #666;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border-left: 4rpx solid #e9ecef;
}

// 卡片内容样式
.rich-text.card-content {
  font-size: 28rpx;
  line-height: 1.7;
  color: #333;
  padding: 20rpx;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 12rpx;
  border: 1rpx solid #e9ecef;
  box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.05);
}

// 简洁样式
.rich-text.simple-content {
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
}

.exhibition-description-text :deep(h1) {
  font-size: 40rpx;
  color: #1890ff;
  margin: 24rpx 0 16rpx 0;
  font-weight: bold;
  border-bottom: 2rpx solid #e6f7ff;
  padding-bottom: 8rpx;
}

.exhibition-description-text :deep(h2) {
  font-size: 36rpx;
  color: #52c41a;
  margin: 20rpx 0 12rpx 0;
  font-weight: bold;
}

.exhibition-description-text :deep(h3) {
  font-size: 32rpx;
  color: #722ed1;
  margin: 16rpx 0 8rpx 0;
  font-weight: bold;
}

.exhibition-description-text :deep(p) {
  margin: 12rpx 0;
  text-align: justify;
}

.exhibition-description-text :deep(ul),
.exhibition-description-text :deep(ol) {
  margin: 12rpx 0;
  padding-left: 40rpx;
}

.exhibition-description-text :deep(li) {
  margin: 8rpx 0;
  line-height: 1.6;
}

.exhibition-description-text :deep(blockquote) {
  margin: 16rpx 0;
  padding: 16rpx 20rpx;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
  border-left: 6rpx solid #1890ff;
  border-radius: 8rpx;
  font-style: italic;
  color: #666;
}

.exhibition-description-text :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12rpx;
  margin: 16rpx 0;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  display: block;
}

.exhibition-description-text :deep(a) {
  color: #1890ff;
  text-decoration: underline;
  word-break: break-all;
}

.exhibition-description-text :deep(code) {
  background: #f5f5f5;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  font-family: 'Courier New', monospace;
  font-size: 24rpx;
  color: #e74c3c;
}

.exhibition-description-text :deep(pre) {
  background: #f5f5f5;
  padding: 20rpx;
  border-radius: 8rpx;
  overflow-x: auto;
  margin: 16rpx 0;
  border: 1rpx solid #e8e8e8;
}

.exhibition-description-text :deep(strong) {
  font-weight: bold;
  color: #333;
}

.exhibition-description-text :deep(em) {
  font-style: italic;
  color: #666;
}

// 响应式设计
@media screen and (max-width: 750rpx) {
  .rich-text {
    font-size: 26rpx;

    :deep(h1) {
      font-size: 40rpx;
    }

    :deep(h2) {
      font-size: 36rpx;
    }

    :deep(h3) {
      font-size: 32rpx;
    }
  }
}
</style>
