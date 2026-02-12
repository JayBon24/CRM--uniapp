<template>
    <view class="simple-editor toolbar-fixed-bottom">
      <!-- 工具栏 -->
      <view class="toolbar" v-if="showToolbar">
        <!-- 基础格式 -->
        <view class="toolbar-group">
          <view :class="['toolbar-btn', { active: formats.bold }]" @tap="format('bold')" title="加粗">
            <SvgIcon name="bold" :size="16" />
          </view>
          <view :class="['toolbar-btn', { active: formats.italic }]" @tap="format('italic')" title="斜体">
            <SvgIcon name="italic" :size="16" />
          </view>
          <view :class="['toolbar-btn', { active: formats.underline }]" @tap="format('underline')" title="下划线">
            <SvgIcon name="underline" :size="16" />
          </view>
          <view class="toolbar-btn" @tap="removeFormat" title="清除格式">
            <SvgIcon name="trash" :size="16" />
          </view>
        </view>

        <!-- 标题 -->
        <view class="toolbar-group">
          <view :class="['toolbar-btn', { active: formats.header === 1 }]" @tap="format('header', 1)" title="标题1">
            H1
          </view>
          <view :class="['toolbar-btn', { active: formats.header === 2 }]" @tap="format('header', 2)" title="标题2">
            H2
          </view>
          <view :class="['toolbar-btn', { active: formats.header === 3 }]" @tap="format('header', 3)" title="标题3">
            H3
          </view>
          <view :class="['toolbar-btn', { active: formats.header === 4 }]" @tap="format('header', 4)" title="标题4">
            H4
          </view>
          <view :class="['toolbar-btn', { active: formats.header === 5 }]" @tap="format('header', 5)" title="标题5">
            H5
          </view>
          <view :class="['toolbar-btn', { active: formats.header === 6 }]" @tap="format('header', 6)" title="标题6">
            H6
          </view>
        </view>

        <!-- 列表 -->
        <view class="toolbar-group">
          <view :class="['toolbar-btn', { active: formats.list === 'ordered' }]" @tap="format('list', 'ordered')"
            title="有序列表">
            <SvgIcon name="list-ol" :size="16" />
          </view>
          <view :class="['toolbar-btn', { active: formats.list === 'bullet' }]" @tap="format('list', 'bullet')"
            title="无序列表">
            <SvgIcon name="list-ul" :size="16" />
          </view>
        </view>

        <!-- 对齐方式 -->
        <view class="toolbar-group">
          <view :class="['toolbar-btn', { active: formats.align === 'left' }]" @tap="format('align', 'left')" title="左对齐">
            <SvgIcon name="align-left" :size="16" />
          </view>
          <view :class="['toolbar-btn', { active: formats.align === 'center' }]" @tap="format('align', 'center')"
            title="居中对齐">
            <SvgIcon name="align-center" :size="16" />
          </view>
          <view :class="['toolbar-btn', { active: formats.align === 'right' }]" @tap="format('align', 'right')"
            title="右对齐">
            <SvgIcon name="align-right" :size="16" />
          </view>
        </view>
      </view>

    <!-- 编辑器 -->
    <view class="editor-container">
      <editor id="editor" class="editor" :placeholder="placeholder" :read-only="readOnly" show-img-size show-img-toolbar
        show-img-resize @ready="onEditorReady" @input="onInput" @statuschange="onStatusChange" @focus="onFocus"
        @blur="onBlur"></editor>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue'
import SvgIcon from './SvgIcon.vue'

// 定义组件属性
const props = defineProps({
  // 编辑器内容
  modelValue: {
    type: String,
    default: ''
  },
  // 占位符
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  // 是否只读
  readOnly: {
    type: Boolean,
    default: false
  },
  // 编辑器高度
  height: {
    type: String,
    default: '300px'
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'change'])

// 获取当前组件实例
const instance = getCurrentInstance()

// 编辑器实例
const editorCtx = ref(null)
// 当前格式状态
const formats = ref({})
// 编辑器内容
const content = ref(props.modelValue)

// 焦点状态（用于移动端将工具栏固定到底部）
const isFocused = ref(false)
// 焦点管理标志，防止重复聚焦
const isFocusing = ref(false)
// 工具栏显示状态，独立于编辑器焦点
const showToolbar = ref(false)
// 隐藏工具栏的定时器
const hideTimer = ref(null)


// 编辑器准备就绪
const onEditorReady = () => {
  console.log('SimpleEditor onEditorReady 编辑器准备就绪')

  // 使用 getCurrentInstance 获取组件实例，确保选择器在正确的上下文中执行
  const query = uni.createSelectorQuery().in(instance.proxy)
  query
    .select('#editor')
    .context((res) => {
      console.log('SimpleEditor onEditorReady 获取编辑器上下文结果:', res)
      if (res && res.context) {
        editorCtx.value = res.context
        console.log('SimpleEditor onEditorReady 编辑器上下文设置成功:', !!editorCtx.value)

        // 如果有初始内容，设置到编辑器
        if (props.modelValue) {
          console.log('SimpleEditor onEditorReady 设置初始内容:', props.modelValue)
          try {
            editorCtx.value.setContents({
              html: props.modelValue
            })
          } catch (error) {
            console.error('SimpleEditor onEditorReady 设置初始内容失败:', error)
          }
        }
      } else {
        console.error('SimpleEditor onEditorReady 获取编辑器上下文失败:', res)
        // 延迟重试一次
        setTimeout(() => {
          const retryQuery = uni.createSelectorQuery().in(instance.proxy)
          retryQuery
            .select('#editor')
            .context((retryRes) => {
              console.log('SimpleEditor onEditorReady 重试获取结果2:', retryRes)
              if (retryRes && retryRes.context) {
                editorCtx.value = retryRes.context
                console.log('SimpleEditor onEditorReady 重试成功，编辑器上下文设置完成')
              }
            })
            .exec()
        }, 500)
      }
    })
    .exec()
}

// 输入事件
const onInput = (e) => {
  content.value = e.detail.html
  emit('update:modelValue', e.detail.html)
  emit('change', e.detail.html)
}

// 状态变化事件
const onStatusChange = (e) => {
  console.log('SimpleEditor onStatusChange 格式状态变化:', e.detail)
  formats.value = e.detail
}

// 获得/失去焦点（移动端将工具栏固定到底部）
const onFocus = () => {
  console.log('SimpleEditor onFocus 编辑器获得焦点')
  isFocused.value = true
  showToolbar.value = true
  isFocusing.value = false
  // 清除之前的隐藏定时器
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }

  console.log('SimpleEditor onFocus 状态更新:', {
    isFocused: isFocused.value,
    showToolbar: showToolbar.value,
    editorCtx: !!editorCtx.value
  })
}
const onBlur = () => {
  console.log('SimpleEditor onBlur 编辑器失去焦点')
  isFocused.value = false
  // 延迟隐藏工具栏，给用户更多时间操作
  hideTimer.value = setTimeout(() => {
    if (!isFocusing.value) {
      showToolbar.value = false
      console.log('SimpleEditor onBlur 延迟隐藏工具栏')
    } else {
      console.log('SimpleEditor onBlur 跳过隐藏工具栏，正在操作中')
    }
  }, 500) // 500ms后隐藏工具栏
  console.log('SimpleEditor onBlur 状态更新:', { isFocused: isFocused.value, showToolbar: showToolbar.value })
}


// 应用格式
const format = (name, value) => {
  console.log('SimpleEditor format 被调用:', { name, value, editorCtx: !!editorCtx.value })

  // 设置正在操作标志，防止工具栏隐藏
  isFocusing.value = true
  // 确保工具栏保持显示
  showToolbar.value = true
  // 清除之前的隐藏定时器
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }

  // 检查编辑器上下文是否存在
  if (!editorCtx.value) {
    console.log('SimpleEditor format 失败: editorCtx 不存在，无法应用格式')
    isFocusing.value = false
    return
  }

  console.log('SimpleEditor format 开始应用格式:', { name, value, currentFormats: formats.value })

  // 立即应用格式，使用预先保存的上下文
  try {
    if (value !== undefined) {
      editorCtx.value.format(name, value)
      console.log('SimpleEditor format 成功应用格式:', { name, value })
    } else {
      const newValue = !formats.value[name]
      editorCtx.value.format(name, newValue)
      console.log('SimpleEditor format 成功切换格式:', { name, newValue })
    }
  } catch (error) {
    console.error('SimpleEditor format 应用格式失败:', error)
  }

  // 延迟重置操作标志
  setTimeout(() => {
    isFocusing.value = false
    console.log('SimpleEditor format 操作完成，重置 isFocusing')
  }, 100)
}

// 清除格式
const removeFormat = () => {
  console.log('SimpleEditor removeFormat 被调用:', { editorCtx: !!editorCtx.value })

  // 设置正在操作标志，防止工具栏隐藏
  isFocusing.value = true
  // 确保工具栏保持显示
  showToolbar.value = true
  // 清除之前的隐藏定时器
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }

  // 检查编辑器上下文是否存在
  if (!editorCtx.value) {
    console.log('SimpleEditor removeFormat 失败: editorCtx 不存在，无法清除格式')
    isFocusing.value = false
    return
  }

  // 清除所有当前格式
  const currentFormats = formats.value
  console.log('SimpleEditor removeFormat 当前格式状态:', currentFormats)

  try {
    // 清除加粗、斜体、下划线
    if (currentFormats.bold) {
      editorCtx.value.format('bold', false)
      console.log('SimpleEditor removeFormat 清除加粗')
    }
    if (currentFormats.italic) {
      editorCtx.value.format('italic', false)
      console.log('SimpleEditor removeFormat 清除斜体')
    }
    if (currentFormats.underline) {
      editorCtx.value.format('underline', false)
      console.log('SimpleEditor removeFormat 清除下划线')
    }

    // 清除对齐方式
    if (currentFormats.align) {
      editorCtx.value.format('align', false)
      console.log('SimpleEditor removeFormat 清除对齐方式')
    }

    // 清除列表格式
    if (currentFormats.list) {
      editorCtx.value.format('list', false)
      console.log('SimpleEditor removeFormat 清除列表格式')
    }

    // 清除标题格式
    if (currentFormats.header) {
      editorCtx.value.format('header', false)
      console.log('SimpleEditor removeFormat 清除标题格式')
    }

    // 清除颜色和背景色
    if (currentFormats.color) {
      editorCtx.value.format('color', false)
      console.log('SimpleEditor removeFormat 清除颜色')
    }
    if (currentFormats.backgroundColor) {
      editorCtx.value.format('backgroundColor', false)
      console.log('SimpleEditor removeFormat 清除背景色')
    }

    console.log('SimpleEditor removeFormat 清除格式完成')
  } catch (error) {
    console.error('SimpleEditor removeFormat 清除格式失败:', error)
  }

  // 延迟重置操作标志
  setTimeout(() => {
    isFocusing.value = false
    console.log('SimpleEditor removeFormat 操作完成，重置 isFocusing')
  }, 100)
}

// 手动隐藏工具栏
const hideToolbar = () => {
  showToolbar.value = false
  isFocusing.value = false
  // 清除隐藏定时器
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }
}

// 设置内容
const setContent = (html) => {
  if (!editorCtx.value) return
  editorCtx.value.setContents({
    html: html
  })
}

// 获取内容
const getContent = () => {
  if (!editorCtx.value) return ''
  return new Promise((resolve) => {
    editorCtx.value.getContents({
      success: (res) => {
        resolve(res.html)
      },
      fail: () => {
        resolve('')
      }
    })
  })
}

// 清空内容
const clear = () => {
  if (!editorCtx.value) return
  editorCtx.value.clear()
}



// 监听外部内容变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== content.value && editorCtx.value) {
    setContent(newVal)
  }
})

// 组件挂载时检查编辑器上下文
onMounted(() => {
  console.log('SimpleEditor onMounted 组件挂载')
  // 编辑器上下文应该在 onEditorReady 中获取，这里不需要额外处理
})

// 暴露方法给父组件
defineExpose({
  setContent,
  getContent,
  clear,
  format
})
</script>

<style scoped>
.simple-editor {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  padding: 6px 40px 6px 10px; /* 右侧留出关闭按钮空间 */
  background-color: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
  gap: 2px;
  overflow-x: auto;
  position: relative;
}



.toolbar-group {
  display: flex;
  align-items: center;
  gap: 1px;
  padding: 0 4px;
  border-right: 1px solid #e4e7ed;
  flex-shrink: 0;
  justify-content: center;
}

.toolbar-group:last-child {
  border-right: none;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
}

.toolbar-btn:hover {
  background-color: #e4e7ed;
}

.toolbar-btn.active {
  background-color: #409eff;
  color: white;
}

.editor-container {
  background-color: white;
}

.editor {
  min-height: v-bind(height);
  padding: 12px;
  line-height: 1.6;
}

/* 移动端聚焦时，将工具栏固定在底部，并为编辑区预留内边距避免遮挡 */
.toolbar-fixed-bottom .toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: env(safe-area-inset-bottom);
  z-index: 99;
}


/* 编辑器内容样式 */
:deep(.ql-container) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

:deep(.ql-editor) {
  min-height: 200px;
  outline: none;
}

:deep(.ql-editor p) {
  margin: 0 0 8px 0;
}

:deep(.ql-editor h1) {
  font-size: 24px;
  font-weight: bold;
  margin: 16px 0 8px 0;
}

:deep(.ql-editor h2) {
  font-size: 20px;
  font-weight: bold;
  margin: 12px 0 6px 0;
}

:deep(.ql-editor h3) {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0 5px 0;
}

:deep(.ql-editor h4) {
  font-size: 16px;
  font-weight: bold;
  margin: 8px 0 4px 0;
}

:deep(.ql-editor h5) {
  font-size: 14px;
  font-weight: bold;
  margin: 6px 0 3px 0;
}

:deep(.ql-editor h6) {
  font-size: 12px;
  font-weight: bold;
  margin: 4px 0 2px 0;
}

:deep(.ql-editor ul),
:deep(.ql-editor ol) {
  margin: 8px 0;
  padding-left: 12rpx;
}

:deep(.ql-editor ul li),

:deep(.ql-editor li) {
  margin: 4px 0;
}
:deep(.ql-editor li::before) {
  width: 30rpx;

}
</style>
