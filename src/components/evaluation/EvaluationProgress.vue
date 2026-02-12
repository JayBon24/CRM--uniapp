<template>
  <view class="evaluation-progress">
    <view class="progress-header">
      <text class="progress-title">评选进度</text>
      <u-tag :text="getOverallStatusText()" :type="getOverallStatusType()" />
    </view>

    <!-- 评选模式显示 -->
    <view class="evaluation-mode">
      <u-tag
        :text="evaluationMode === 'single' ? '一次评选' : '二次评选'"
        :type="evaluationMode === 'single' ? 'primary' : 'success'"
        size="large"
      />
    </view>

    <!-- 初选阶段进度 -->
    <view class="stage-progress">
      <view class="stage-header">
        <view class="stage-info">
          <text class="stage-name">初选阶段</text>
          <text class="stage-description">{{ primaryStageConfig?.stageDescription }}</text>
        </view>
        <u-tag :text="getStageStatusText('primary')" :type="getStageStatusType('primary')" />
      </view>

      <view class="stage-details">
        <view class="detail-item">
          <text class="label">时间范围:</text>
          <text class="value">{{ formatTimeRange(primaryStageConfig?.startTime, primaryStageConfig?.endTime) }}</text>
        </view>
        <view class="detail-item">
          <text class="label">通过分数线:</text>
          <text class="value">{{ primaryStageConfig?.passThreshold }}分</text>
        </view>
        <view class="detail-item">
          <text class="label">最大通过数:</text>
          <text class="value">{{ primaryStageConfig?.maxPassCount }}件</text>
        </view>
      </view>

      <!-- 初选进度条 -->
      <view class="progress-bar-section">
        <view class="progress-info">
          <text class="progress-text">初选进度</text>
          <text class="progress-percentage">{{ getPrimaryProgressPercentage() }}%</text>
        </view>
        <u-line-progress
          :percentage="getPrimaryProgressPercentage()"
          :show-text="false"
          height="12"
          :active-color="getProgressColor('primary')"
        />
        <view class="progress-stats">
          <text>已评分: {{ primaryProgress?.scored || 0 }}/{{ primaryProgress?.total || 0 }}</text>
          <text>已通过: {{ primaryProgress?.passed || 0 }}</text>
        </view>
      </view>

      <!-- 初选评委组信息 -->
      <view class="judge-group-info">
        <view class="group-header">
          <text class="group-title">初选评委组</text>
          <u-tag :text="`${primaryStageConfig?.judgeGroupConfig?.judges?.length || 0}人`" type="info" />
        </view>
        <view class="judges-list">
          <view
            v-for="judge in primaryStageConfig?.judgeGroupConfig?.judges"
            :key="judge.id"
            class="judge-item"
          >
            <u-avatar :src="judge.userAvatar" size="60" />
            <view class="judge-info">
              <text class="judge-name">{{ judge.userName }}</text>
              <text class="judge-role">{{ getJudgeRoleText(judge.role) }}</text>
              <text class="judge-expertise">{{ judge.expertise.join('、') }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 复选阶段进度（仅二次评选时显示） -->
    <view v-if="evaluationMode === 'double'" class="stage-progress">
      <view class="stage-header">
        <view class="stage-info">
          <text class="stage-name">复选阶段</text>
          <text class="stage-description">{{ secondaryStageConfig?.stageDescription }}</text>
        </view>
        <u-tag :text="getStageStatusText('secondary')" :type="getStageStatusType('secondary')" />
      </view>

      <view class="stage-details">
        <view class="detail-item">
          <text class="label">时间范围:</text>
          <text class="value">{{ formatTimeRange(secondaryStageConfig?.startTime, secondaryStageConfig?.endTime) }}</text>
        </view>
        <view class="detail-item">
          <text class="label">通过分数线:</text>
          <text class="value">{{ secondaryStageConfig?.passThreshold }}分</text>
        </view>
        <view class="detail-item">
          <text class="label">最大通过数:</text>
          <text class="value">{{ secondaryStageConfig?.maxPassCount }}件</text>
        </view>
      </view>

      <!-- 复选进度条 -->
      <view class="progress-bar-section">
        <view class="progress-info">
          <text class="progress-text">复选进度</text>
          <text class="progress-percentage">{{ getSecondaryProgressPercentage() }}%</text>
        </view>
        <u-line-progress
          :percentage="getSecondaryProgressPercentage()"
          :show-text="false"
          height="12"
          :active-color="getProgressColor('secondary')"
        />
        <view class="progress-stats">
          <text>已评分: {{ secondaryProgress?.scored || 0 }}/{{ secondaryProgress?.total || 0 }}</text>
          <text>已通过: {{ secondaryProgress?.passed || 0 }}</text>
        </view>
      </view>

      <!-- 复选评委组信息 -->
      <view class="judge-group-info">
        <view class="group-header">
          <text class="group-title">复选评委组</text>
          <u-tag :text="`${secondaryStageConfig?.judgeGroupConfig?.judges?.length || 0}人`" type="info" />
        </view>
        <view class="judges-list">
          <view
            v-for="judge in secondaryStageConfig?.judgeGroupConfig?.judges"
            :key="judge.id"
            class="judge-item"
          >
            <u-avatar :src="judge.userAvatar" size="60" />
            <view class="judge-info">
              <text class="judge-name">{{ judge.userName }}</text>
              <text class="judge-role">{{ getJudgeRoleText(judge.role) }}</text>
              <text class="judge-expertise">{{ judge.expertise.join('、') }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 当前阶段操作按钮 -->
    <view v-if="!isViewMode" class="stage-actions">
      <u-button
        v-if="canStartStage()"
        type="primary"
        @click="handleStartStage"
        :loading="actionLoading"
      >
        启动{{ getCurrentStageText() }}
      </u-button>
      <u-button
        v-if="canEndStage()"
        type="warning"
        @click="handleEndStage"
        :loading="actionLoading"
      >
        结束{{ getCurrentStageText() }}
      </u-button>
      <u-button
        v-if="canCalculateResult()"
        type="success"
        @click="handleCalculateResult"
        :loading="actionLoading"
      >
        计算{{ getCurrentStageText() }}结果
      </u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed } from 'vue'
import type {
  ExhibitionEvaluationConfig,
  PrimaryStageConfig,
  SecondaryStageConfig,
  EvaluationStatus,
  EvaluationStage
} from '@/types/interfaces/evaluation'
import { EvaluationStatusText, EvaluationStageText, JudgeRoleText } from '@/types/interfaces/evaluation'

// 组件属性
interface Props {
  evaluationConfig: ExhibitionEvaluationConfig
  primaryProgress?: {
    total: number
    scored: number
    passed: number
    status: EvaluationStatus
  }
  secondaryProgress?: {
    total: number
    scored: number
    passed: number
    status: EvaluationStatus
  }
  isViewMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isViewMode: false
})

// 组件事件
const emit = defineEmits<{
  startStage: [stage: EvaluationStage]
  endStage: [stage: EvaluationStage]
  calculateResult: [stage: EvaluationStage]
}>()

// 响应式数据
const actionLoading = ref(false)

// 计算属性
const evaluationMode = computed(() => props.evaluationConfig.evaluationMode)
const primaryStageConfig = computed(() => props.evaluationConfig.primaryStageConfig)
const secondaryStageConfig = computed(() => props.evaluationConfig.secondaryStageConfig)
const currentStage = computed(() => props.evaluationConfig.currentStage)

// 方法
const getOverallStatusText = () => {
  return EvaluationStatusText[props.evaluationConfig.status] || '未知状态'
}

const getOverallStatusType = () => {
  const statusMap: Record<EvaluationStatus, string> = {
    pending: 'warning',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'error'
  }
  return statusMap[props.evaluationConfig.status] || 'info'
}

const getStageStatusText = (stage: string) => {
  if (stage === 'primary') {
    return EvaluationStatusText[props.primaryProgress?.status || 'pending'] || '待开始'
  } else if (stage === 'secondary') {
    return EvaluationStatusText[props.secondaryProgress?.status || 'pending'] || '待开始'
  }
  return '未知状态'
}

const getStageStatusType = (stage: string) => {
  if (stage === 'primary') {
    const status = props.primaryProgress?.status || 'pending'
    const statusMap: Record<EvaluationStatus, string> = {
      pending: 'warning',
      in_progress: 'primary',
      completed: 'success',
      cancelled: 'error'
    }
    return statusMap[status] || 'info'
  } else if (stage === 'secondary') {
    const status = props.secondaryProgress?.status || 'pending'
    const statusMap: Record<EvaluationStatus, string> = {
      pending: 'warning',
      in_progress: 'primary',
      completed: 'success',
      cancelled: 'error'
    }
    return statusMap[status] || 'info'
  }
  return 'info'
}

const formatTimeRange = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return '未设置'
  const start = new Date(startTime).toLocaleDateString()
  const end = new Date(endTime).toLocaleDateString()
  return `${start} - ${end}`
}

const getPrimaryProgressPercentage = () => {
  if (!props.primaryProgress?.total) return 0
  return Math.round((props.primaryProgress.scored / props.primaryProgress.total) * 100)
}

const getSecondaryProgressPercentage = () => {
  if (!props.secondaryProgress?.total) return 0
  return Math.round((props.secondaryProgress.scored / props.secondaryProgress.total) * 100)
}

const getProgressColor = (stage: string) => {
  if (stage === 'primary') {
    const status = props.primaryProgress?.status || 'pending'
    const colorMap: Record<EvaluationStatus, string> = {
      pending: '#ffa500',
      in_progress: '#1890ff',
      completed: '#52c41a',
      cancelled: '#ff4d4f'
    }
    return colorMap[status] || '#999'
  } else if (stage === 'secondary') {
    const status = props.secondaryProgress?.status || 'pending'
    const colorMap: Record<EvaluationStatus, string> = {
      pending: '#ffa500',
      in_progress: '#1890ff',
      completed: '#52c41a',
      cancelled: '#ff4d4f'
    }
    return colorMap[status] || '#999'
  }
  return '#999'
}

const getJudgeRoleText = (role: string) => {
  return JudgeRoleText[role as keyof typeof JudgeRoleText] || role
}

const getCurrentStageText = () => {
  return EvaluationStageText[currentStage.value] || '当前阶段'
}

const canStartStage = () => {
  if (currentStage.value === 'primary') {
    return props.primaryProgress?.status === 'pending'
  } else if (currentStage.value === 'secondary') {
    return props.secondaryProgress?.status === 'pending'
  }
  return false
}

const canEndStage = () => {
  if (currentStage.value === 'primary') {
    return props.primaryProgress?.status === 'in_progress'
  } else if (currentStage.value === 'secondary') {
    return props.secondaryProgress?.status === 'in_progress'
  }
  return false
}

const canCalculateResult = () => {
  if (currentStage.value === 'primary') {
    return props.primaryProgress?.status === 'completed'
  } else if (currentStage.value === 'secondary') {
    return props.secondaryProgress?.status === 'completed'
  }
  return false
}

const handleStartStage = async () => {
  actionLoading.value = true
  try {
    emit('startStage', currentStage.value)
  } finally {
    actionLoading.value = false
  }
}

const handleEndStage = async () => {
  actionLoading.value = true
  try {
    emit('endStage', currentStage.value)
  } finally {
    actionLoading.value = false
  }
}

const handleCalculateResult = async () => {
  actionLoading.value = true
  try {
    emit('calculateResult', currentStage.value)
  } finally {
    actionLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.evaluation-progress {
  padding: 20rpx;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #e9ecef;
}

.progress-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.evaluation-mode {
  margin-bottom: 30rpx;
  text-align: center;
}

.stage-progress {
  margin-bottom: 40rpx;
  padding: 30rpx;
  background-color: #f8f9fa;
  border-radius: 16rpx;
}

.stage-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.stage-info {
  flex: 1;
}

.stage-name {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.stage-description {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.stage-details {
  margin-bottom: 30rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
  font-size: 26rpx;
}

.detail-item .label {
  color: #666;
}

.detail-item .value {
  color: #333;
  font-weight: 500;
}

.progress-bar-section {
  margin-bottom: 30rpx;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.progress-text {
  font-size: 26rpx;
  color: #333;
}

.progress-percentage {
  font-size: 24rpx;
  color: #1890ff;
  font-weight: bold;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 15rpx;
  font-size: 24rpx;
  color: #666;
}

.judge-group-info {
  margin-top: 30rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  border: 2rpx solid #e9ecef;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.group-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.judges-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.judge-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 15rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
}

.judge-info {
  flex: 1;
}

.judge-name {
  display: block;
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.judge-role {
  display: block;
  font-size: 22rpx;
  color: #1890ff;
  margin-bottom: 5rpx;
}

.judge-expertise {
  font-size: 22rpx;
  color: #666;
}

.stage-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
  padding-top: 30rpx;
  border-top: 2rpx solid #e9ecef;
}
</style>
