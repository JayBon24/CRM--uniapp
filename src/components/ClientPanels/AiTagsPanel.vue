<!-- @ts-nocheck -->
<template>
  <view class="panel ai-tags-panel">
    <view class="panel-header">
      <view class="title-section">
        <text class="panel-title">AI标记</text>
        <view class="ai-badge">
          <SvgIcon name="ai" :size="24" color="#667eea" />
          <text class="ai-text">智能识别</text>
        </view>
      </view>
      <view class="edit-btn" @click="openManualEdit">
        <u-icon name="edit-pen" size="18" color="#909399" />
        <text class="edit-text">手动编辑</text>
      </view>
    </view>

    <view class="panel-content">
      <view class="tags-grid">
        <!-- 客户等级 -->
        <view class="tag-item">
          <text class="tag-label">客户等级</text>
          <view class="tag-value-section">
            <view class="grade-badge" :class="`grade-${client.grade}`">
              {{ gradeLabel }}
            </view>
            <text v-if="client.grade_source === 'ai'" class="source-tag ai">AI</text>
            <text v-else-if="client.grade_source === 'manual'" class="source-tag manual">人工</text>
          </view>
        </view>

        <!-- 催收类别 -->
        <view v-if="client.collection_category" class="tag-item">
          <text class="tag-label">催收类别</text>
          <view class="tag-value-section">
            <view class="category-badge">{{ collectionLabel }}</view>
            <text v-if="client.collection_source === 'ai'" class="source-tag ai">AI</text>
            <text v-else-if="client.collection_source === 'manual'" class="source-tag manual">人工</text>
          </view>
        </view>

        <!-- 保全状态 -->
        <view v-if="client.preservation_status" class="tag-item">
          <text class="tag-label">保全状态</text>
          <view class="tag-value-section">
            <view class="preservation-badge">{{ preservationLabel }}</view>
            <text v-if="client.preservation_source === 'ai'" class="source-tag ai">AI</text>
            <text v-else-if="client.preservation_source === 'manual'" class="source-tag manual">人工</text>
          </view>
        </view>

        <!-- 法院 -->
        <view v-if="client.court" class="tag-item full">
          <text class="tag-label">法院</text>
          <view class="tag-value-section">
            <text class="court-text">{{ client.court }}</text>
            <text v-if="client.court_source === 'ai'" class="source-tag ai">AI</text>
            <text v-else-if="client.court_source === 'manual'" class="source-tag manual">人工</text>
          </view>
        </view>

        <!-- 律师 -->
        <view v-if="client.lawyer" class="tag-item full">
          <text class="tag-label">律师</text>
          <view class="tag-value-section">
            <text class="lawyer-text">{{ client.lawyer }}</text>
            <text v-if="client.lawyer_source === 'ai'" class="source-tag ai">AI</text>
            <text v-else-if="client.lawyer_source === 'manual'" class="source-tag manual">人工</text>
          </view>
        </view>
      </view>

      <view class="ai-tip">
        <u-icon name="info-circle" size="16" color="#909399" />
        <text class="tip-text">人工标记权重高于AI识别</text>
      </view>
    </view>

    <u-popup v-model:show="showEditPopup" mode="bottom" :round="20">
      <view class="edit-popup">
        <view class="popup-header">
          <text class="popup-title">手动编辑 AI 标记</text>
          <view class="refresh-ai" @click="handleAiRefresh">
            <SvgIcon name="refresh" :size="24" color="#909399" />
            <text class="refresh-text">刷新 AI 标记</text>
          </view>
        </view>

        <view class="popup-section">
          <text class="section-title">客户等级</text>
          <view class="option-row">
            <view
              v-for="grade in gradeOptions"
              :key="grade"
              class="option-chip"
              :class="{ active: editGrade === grade }"
              @click="editGrade = grade"
            >
              {{ grade }}级
            </view>
          </view>
        </view>

        <view class="popup-section">
          <text class="section-title">催收类别</text>
          <view class="option-row">
            <view
              v-for="item in collectionOptions"
              :key="item.value"
              class="option-chip"
              :class="{ active: editCollection.includes(item.value) }"
              @click="toggleCollection(item.value)"
            >
              {{ item.label }}
            </view>
          </view>
        </view>

        <view class="popup-actions">
          <button class="btn cancel" @click="showEditPopup = false">取消</button>
          <button class="btn primary" @click="handleSave">保存</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, ref } from 'vue'
import type { ClientDetail, ClientGrade, CollectionCategory } from '@/types/interfaces/client'
import { CLIENT_GRADE_MAP } from '@/utils/client-enums'
import { updateClient } from '@/api/client'

interface Props {
  client: ClientDetail
}

const props = defineProps<Props>()
const emit = defineEmits<{
  updated: []
}>()

const showEditPopup = ref(false)
const editGrade = ref<ClientGrade | ''>('')
const editCollection = ref<CollectionCategory[]>([])

const gradeOptions: ClientGrade[] = ['A', 'B', 'C', 'D']
const collectionOptions = [
  { value: 'arbitration' as CollectionCategory, label: '仲裁' },
  { value: 'mediation' as CollectionCategory, label: '调解' },
  { value: 'litigation' as CollectionCategory, label: '诉讼' }
]

const gradeLabel = computed(() => {
  return CLIENT_GRADE_MAP[props.client.grade]?.label || props.client.grade
})

const collectionLabel = computed(() => {
  const map = {
    arbitration: '仲裁',
    mediation: '调解',
    litigation: '诉讼'
  }
  return map[props.client.collection_category || ''] || props.client.collection_category
})

const preservationLabel = computed(() => {
  const map = {
    applied: '已申请',
    approved: '已批准',
    rejected: '已驳回',
    none: '未申请'
  }
  return map[props.client.preservation_status || ''] || props.client.preservation_status
})

function handleRefresh() {
  uni.showToast({
    title: '刷新AI标记',
    icon: 'none'
  })
  // TODO: 调用 AI 重新识别接口
}

function openManualEdit() {
  editGrade.value = (props.client.grade || '') as ClientGrade | ''
  editCollection.value = Array.isArray(props.client.collection_category)
    ? [...props.client.collection_category]
    : (props.client.collection_category ? [props.client.collection_category] : [])
  showEditPopup.value = true
}

function toggleCollection(value: CollectionCategory) {
  const idx = editCollection.value.indexOf(value)
  if (idx > -1) {
    editCollection.value.splice(idx, 1)
  } else {
    editCollection.value.push(value)
  }
}

function handleAiRefresh() {
  handleRefresh()
}

async function handleSave() {
  if (!props.client.id) return
  try {
    uni.showLoading({ title: '保存中...' })
    await updateClient({
      id: props.client.id,
      grade: editGrade.value || undefined,
      collection_category: editCollection.value,
      grade_source: 'manual',
      collection_source: 'manual'
    })
    uni.hideLoading()
    uni.showToast({ title: '保存成功', icon: 'success' })
    showEditPopup.value = false
    emit('updated')
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({ title: error?.message || '保存失败', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.panel {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  background: #F5F7FA;
}

.edit-text {
  font-size: 22rpx;
  color: #606266;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
}

.ai-badge {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 4rpx 12rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 6rpx;
}

.ai-text {
  font-size: 20rpx;
  color: #667eea;
  font-weight: 500;
}

.panel-content {
  padding: 30rpx;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx 24rpx;
  margin-bottom: 30rpx;
}

.tag-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;

  &.full {
    grid-column: 1 / -1;
  }
}

.tag-label {
  font-size: 24rpx;
  color: #909399;
}

.tag-value-section {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.grade-badge,
.category-badge,
.preservation-badge {
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  font-size: 26rpx;
  font-weight: 500;
}

.grade-badge {
  &.grade-A {
    background: #FFF7E6;
    color: #FF9800;
  }
  &.grade-B {
    background: #E6F4FF;
    color: #1890FF;
  }
  &.grade-C {
    background: #F0F9E8;
    color: #52C41A;
  }
  &.grade-D {
    background: #F5F5F5;
    color: #8C8C8C;
  }
}

.category-badge {
  background: #FFF1F0;
  color: #F5222D;
}

.preservation-badge {
  background: #FFFBE6;
  color: #FAAD14;
}

.court-text,
.lawyer-text {
  font-size: 28rpx;
  color: #303133;
}

.source-tag {
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
  font-size: 20rpx;
  font-weight: 500;

  &.ai {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
    color: #667eea;
  }

  &.manual {
    background: #F0F9E8;
    color: #52C41A;
  }
}

.ai-tip {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #909399;
}

.edit-popup {
  padding: 30rpx;
  background: #fff;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.popup-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #303133;
}

.refresh-ai {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 22rpx;
  color: #909399;
}

.refresh-text {
  font-size: 22rpx;
  color: #909399;
}

.popup-section {
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 26rpx;
  color: #606266;
  margin-bottom: 12rpx;
}

.option-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.option-chip {
  padding: 10rpx 18rpx;
  border-radius: 8rpx;
  background: #F5F7FA;
  color: #606266;
  font-size: 24rpx;
}

.option-chip.active {
  background: #ECF5FF;
  color: #409EFF;
}

.popup-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}

.btn {
  flex: 1;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 26rpx;
  border-radius: 8rpx;
}

.btn.cancel {
  background: #F5F7FA;
  color: #606266;
}

.btn.primary {
  background: #667eea;
  color: #fff;
}
</style>
