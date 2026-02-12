<!-- @ts-nocheck -->
<template>
  <view class="page">
    <view class="header-actions">
      <text class="record-link" @click="goRecord">反馈记录</text>
    </view>
    <view class="card">
      <view class="row">
        <text class="label">类型</text>
        <view class="value">
          <u-radio-group v-model="form.type" placement="row">
            <u-radio name="bug" label="Bug" />
            <u-radio name="suggestion" label="建议" />
            <u-radio name="ai_tag_feedback" label="AI标记反馈" />
          </u-radio-group>
        </view>
      </view>

      <view class="row column">
        <text class="label">内容（必填）</text>
        <textarea v-model="form.content" class="textarea" placeholder="请描述你的问题或建议…" />
      </view>

      <view class="row column">
        <text class="label">图片（可选）</text>
        <ImageUploader v-model="form.images" :max="6" />
      </view>

      <view class="row">
        <text class="label">联系方式（可选）</text>
        <input v-model="form.contact" class="input" placeholder="手机号/微信" />
      </view>

      <view v-if="contextHint" class="hint">{{ contextHint }}</view>
    </view>

    <view class="footer">
      <u-button type="primary" text="提交" :loading="submitting" @click="handleSubmit" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ImageUploader from '@/components/ImageUploader/index.vue'
import { submitFeedback } from '@/api/mine'

const submitting = ref(false)

const form = ref({
  type: 'bug',
  content: '',
  images: [] as string[],
  contact: '',
  context: undefined as any
})

const contextHint = computed(() => {
  const ctx = form.value.context
  if (!ctx || (!ctx.client_id && !ctx.field)) return ''
  if (ctx.client_id && ctx.field) return `已关联客户：${ctx.client_id}（字段：${ctx.field}）`
  if (ctx.client_id) return `已关联客户：${ctx.client_id}`
  return ''
})

onLoad((q: any) => {
  const client_id = q?.client_id ? String(q.client_id) : ''
  const field = q?.field ? String(q.field) : ''
  if (client_id || field) {
    form.value.context = { client_id: client_id || undefined, field: field || undefined }
  }
})

async function handleSubmit() {
  if (submitting.value) return
  const content = String(form.value.content || '').trim()
  if (!content) {
    uni.showToast({ title: '请输入反馈内容', icon: 'none' })
    return
  }
  submitting.value = true
  try {
    await submitFeedback({
      type: form.value.type as any,
      content,
      images: form.value.images || [],
      contact: form.value.contact || '',
      context: form.value.context
    })
    uni.showToast({ title: '提交成功', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 500)
  } catch (e: any) {
    uni.showToast({ title: e?.message || '提交失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

function goRecord() {
  uni.navigateTo({ url: '/pages/other/mine/feedback/list' })
}
</script>

<style scoped>
.page {
  padding: 24rpx;
  padding-bottom: 140rpx;
  box-sizing: border-box;
}
.header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16rpx;
}
.record-link {
  font-size: 28rpx;
  color: #667eea;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 8rpx 20rpx;
  box-sizing: border-box;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  box-sizing: border-box;
}
.row.column {
  flex-direction: column;
  align-items: flex-start;
}
.row:last-child {
  border-bottom: none;
}
.label {
  color: #666;
  font-size: 28rpx;
  margin-right: 16rpx;
}
.value {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
.textarea {
  margin-top: 12rpx;
  width: 100%;
  min-height: 220rpx;
  padding: 16rpx 20rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
.input {
  flex: 1;
  text-align: right;
  padding: 12rpx 0;
  font-size: 28rpx;
  box-sizing: border-box;
}
.hint {
  padding: 18rpx 0;
  color: #999;
  font-size: 24rpx;
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 24rpx 24rpx;
  background: #fff;
  box-sizing: border-box;
}
</style>


