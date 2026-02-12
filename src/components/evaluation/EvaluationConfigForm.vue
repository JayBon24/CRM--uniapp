<template>
  <view class="evaluation-config-form">
    <u-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      label-position="left"
    >
      <!-- 评选模式选择 -->
      <u-form-item label="评选模式" prop="evaluationMode">
        <u-radio-group v-model="formData.evaluationMode" @change="onModeChange">
          <u-radio
            v-for="option in evaluationModeOptions"
            :key="option.value"
            :label="option.label"
            :name="option.value"
          />
        </u-radio-group>
      </u-form-item>

      <!-- 初选阶段配置 -->
      <view class="stage-section">
        <view class="stage-header">
          <text class="stage-title">初选阶段配置</text>
          <u-tag :text="getStageStatusText('primary')" :type="getStageStatusType('primary')" />
        </view>

        <u-form-item label="阶段名称" prop="primaryStageConfig.stageName">
          <u-input
            v-model="formData.primaryStageConfig.stageName"
            placeholder="请输入初选阶段名称"
            :disabled="isViewMode"
          />
        </u-form-item>

        <u-form-item label="阶段描述" prop="primaryStageConfig.stageDescription">
          <u-textarea
            v-model="formData.primaryStageConfig.stageDescription"
            placeholder="请输入初选阶段描述"
            :disabled="isViewMode"
          />
        </u-form-item>

        <u-form-item label="开始时间" prop="primaryStageConfig.startTime">
          <u-datetime-picker
            v-model="formData.primaryStageConfig.startTime"
            mode="datetime"
            :disabled="isViewMode"
          />
        </u-form-item>

        <u-form-item label="结束时间" prop="primaryStageConfig.endTime">
          <u-datetime-picker
            v-model="formData.primaryStageConfig.endTime"
            mode="datetime"
            :disabled="isViewMode"
          />
        </u-form-item>



        <!-- 初选评委组配置 -->
        <view class="judge-group-section">
          <view class="section-title">初选评委组</view>
          <u-form-item label="评委组名称" prop="primaryStageConfig.judgeGroupConfig.groupName">
            <u-input
              v-model="formData.primaryStageConfig.judgeGroupConfig.groupName"
              placeholder="请输入评委组名称"
              :disabled="isViewMode"
            />
          </u-form-item>

          <u-form-item label="评委组描述" prop="primaryStageConfig.judgeGroupConfig.groupDescription">
            <u-textarea
              v-model="formData.primaryStageConfig.judgeGroupConfig.groupDescription"
              placeholder="请输入评委组描述"
              :disabled="isViewMode"
            />
          </u-form-item>

          <u-form-item label="最少评委数" prop="primaryStageConfig.judgeGroupConfig.minJudgeCount">
            <u-number-box
              v-model="formData.primaryStageConfig.judgeGroupConfig.minJudgeCount"
              :min="1"
              :max="20"
              :disabled="isViewMode"
            />
          </u-form-item>

          <u-form-item label="最多评委数" prop="primaryStageConfig.judgeGroupConfig.maxJudgeCount">
            <u-number-box
              v-model="formData.primaryStageConfig.judgeGroupConfig.maxJudgeCount"
              :min="formData.primaryStageConfig.judgeGroupConfig.minJudgeCount"
              :max="50"
              :disabled="isViewMode"
            />
          </u-form-item>
        </view>

        <!-- 初选评分标准 -->
        <view class="scoring-criteria-section">
          <view class="section-title">初选评分标准</view>
          <view class="criteria-list">
            <view
              v-for="criteria in primaryScoringCriteria"
              :key="criteria.id"
              class="criteria-item"
            >
              <view class="criteria-header">
                <text class="criteria-name">{{ criteria.name }}</text>
                <u-tag :text="criteria.type" :type="getCriteriaTypeType(criteria.type)" size="mini" />
              </view>
              <text class="criteria-description">{{ criteria.description }}</text>
              <view class="criteria-weights">
                <text>权重: {{ criteria.weight }}%</text>
                <text>分数范围: {{ criteria.minScore }}-{{ criteria.maxScore }}分</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 复选阶段配置（仅二次评选时显示） -->
      <view v-if="formData.evaluationMode === 'double'" class="stage-section">
        <view class="stage-header">
          <text class="stage-title">复选阶段配置</text>
          <u-tag :text="getStageStatusText('secondary')" :type="getStageStatusType('secondary')" />
        </view>

        <u-form-item label="阶段名称" prop="secondaryStageConfig.stageName">
          <u-input
            v-model="formData.secondaryStageConfig.stageName"
            placeholder="请输入复选阶段名称"
            :disabled="isViewMode"
          />
        </u-form-item>

        <u-form-item label="阶段描述" prop="secondaryStageConfig.stageDescription">
          <u-textarea
            v-model="formData.secondaryStageConfig.stageDescription"
            placeholder="请输入复选阶段描述"
            :disabled="isViewMode"
          />
        </u-form-item>

        <u-form-item label="开始时间" prop="secondaryStageConfig.startTime">
          <u-datetime-picker
            v-model="formData.secondaryStageConfig.startTime"
            mode="datetime"
            :disabled="isViewMode"
          />
        </u-form-item>

        <u-form-item label="结束时间" prop="secondaryStageConfig.endTime">
          <u-datetime-picker
            v-model="formData.secondaryStageConfig.endTime"
            mode="datetime"
            :disabled="isViewMode"
          />
        </u-form-item>



        <!-- 复选评委组配置 -->
        <view class="judge-group-section">
          <view class="section-title">复选评委组</view>
          <u-form-item label="评委组名称" prop="secondaryStageConfig.judgeGroupConfig.groupName">
            <u-input
              v-model="formData.secondaryStageConfig.judgeGroupConfig.groupName"
              placeholder="请输入评委组名称"
              :disabled="isViewMode"
            />
          </u-form-item>

          <u-form-item label="评委组描述" prop="secondaryStageConfig.judgeGroupConfig.groupDescription">
            <u-textarea
              v-model="formData.secondaryStageConfig.judgeGroupConfig.groupDescription"
              placeholder="请输入评委组描述"
              :disabled="isViewMode"
            />
          </u-form-item>

          <u-form-item label="最少评委数" prop="secondaryStageConfig.judgeGroupConfig.minJudgeCount">
            <u-number-box
              v-model="formData.secondaryStageConfig.judgeGroupConfig.minJudgeCount"
              :min="1"
              :max="20"
              :disabled="isViewMode"
            />
          </u-form-item>

          <u-form-item label="最多评委数" prop="secondaryStageConfig.judgeGroupConfig.maxJudgeCount">
            <u-number-box
              v-model="formData.secondaryStageConfig.judgeGroupConfig.maxJudgeCount"
              :min="formData.secondaryStageConfig.judgeGroupConfig.minJudgeCount"
              :max="50"
              :disabled="isViewMode"
            />
          </u-form-item>
        </view>

        <!-- 复选评分标准 -->
        <view class="scoring-criteria-section">
          <view class="section-title">复选评分标准</view>
          <view class="criteria-list">
            <view
              v-for="criteria in secondaryScoringCriteria"
              :key="criteria.id"
              class="criteria-item"
            >
              <view class="criteria-header">
                <text class="criteria-name">{{ criteria.name }}</text>
                <u-tag :text="criteria.type" :type="getCriteriaTypeType(criteria.type)" size="mini" />
              </view>
              <text class="criteria-description">{{ criteria.description }}</text>
              <view class="criteria-weights">
                <text>权重: {{ criteria.weight }}%</text>
                <text>分数范围: {{ criteria.minScore }}-{{ criteria.maxScore }}分</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view v-if="!isViewMode" class="form-actions">
        <u-button type="primary" @click="handleSubmit">保存配置</u-button>
        <u-button @click="handleReset">重置</u-button>
      </view>
    </u-form>
  </view>
</template>

<script setup lang="ts">

import type {
  CreateEvaluationConfigParams,
  ScoringCriteria,
  ScoringCriteriaType
} from '@/types/interfaces/evaluation'
import { EvaluationModeOptions, ScoringCriteriaTypeOptions } from '@/types/interfaces/evaluation'

// 组件属性
interface Props {
  exhibitionId: number
  initialData?: CreateEvaluationConfigParams
  isViewMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isViewMode: false
})

// 组件事件
const emit = defineEmits<{
  submit: [data: CreateEvaluationConfigParams]
  reset: []
}>()

// 表单引用
const formRef = ref()

// 表单数据
const formData = ref<CreateEvaluationConfigParams>({
  exhibitionId: props.exhibitionId,
  evaluationMode: 'single',
  primaryStageConfig: {
    stageName: '初选阶段',
    stageDescription: '对所有投稿作品进行初步筛选',
    startTime: '',
    endTime: '',
    judgeGroupConfig: {
      groupName: '初选评委组',
      groupDescription: '负责展览作品的初选评审',
      judgeRoles: ['first_judge'],
      minJudgeCount: 3,
      maxJudgeCount: 5,
      judges: []
    },
    scoringCriteria: [],
    passThreshold: 70,
    maxPassCount: 100
  },
  secondaryStageConfig: {
    stageName: '复选阶段',
    stageDescription: '对初选通过的作品进行深度评审',
    startTime: '',
    endTime: '',
    judgeGroupConfig: {
      groupName: '复选评委组',
      groupDescription: '负责展览作品的复选评审',
      judgeRoles: ['final_judge', 'chief_judge'],
      minJudgeCount: 2,
      maxJudgeCount: 3,
      judges: []
    },
    scoringCriteria: [],
    passThreshold: 80,
    maxPassCount: 30
  }
})

// 表单验证规则
const formRules = {
  'evaluationMode': [
    { required: true, message: '请选择评选模式', trigger: 'change' }
  ],
  'primaryStageConfig.stageName': [
    { required: true, message: '请输入初选阶段名称', trigger: 'blur' }
  ],
  'primaryStageConfig.startTime': [
    { required: true, message: '请选择初选开始时间', trigger: 'change' }
  ],
  'primaryStageConfig.endTime': [
    { required: true, message: '请选择初选结束时间', trigger: 'change' }
  ],
  'primaryStageConfig.passThreshold': [
    { required: true, message: '请设置初选通过分数线', trigger: 'change' }
  ],
  'primaryStageConfig.maxPassCount': [
    { required: true, message: '请设置初选最大通过数量', trigger: 'change' }
  ],
  'primaryStageConfig.judgeGroupConfig.groupName': [
    { required: true, message: '请输入初选评委组名称', trigger: 'blur' }
  ],
  'primaryStageConfig.judgeGroupConfig.minJudgeCount': [
    { required: true, message: '请设置初选最少评委数', trigger: 'change' }
  ],
  'primaryStageConfig.judgeGroupConfig.maxJudgeCount': [
    { required: true, message: '请设置初选最多评委数', trigger: 'change' }
  ]
}

// 计算属性
const evaluationModeOptions = computed(() => EvaluationModeOptions)

const primaryScoringCriteria = computed(() => {
  return getDefaultScoringCriteria().filter(c => c.stage.includes('primary'))
})

const secondaryScoringCriteria = computed(() => {
  return getDefaultScoringCriteria().filter(c => c.stage.includes('secondary'))
})

// 方法
const onModeChange = (value: string) => {
  // 当切换评选模式时，重置相关配置
  if (value === 'single') {
    formData.value.secondaryStageConfig = undefined
  } else {
    // 恢复复选阶段配置
    formData.value.secondaryStageConfig = {
      stageName: '复选阶段',
      stageDescription: '对初选通过的作品进行深度评审',
      startTime: '',
      endTime: '',
      judgeGroupConfig: {
        groupName: '复选评委组',
        groupDescription: '负责展览作品的复选评审',
        judgeRoles: ['final_judge', 'chief_judge'],
        minJudgeCount: 2,
        maxJudgeCount: 3,
        judges: []
      },
      scoringCriteria: [],
      passThreshold: 80,
      maxPassCount: 30
    }
  }
}

const getStageStatusText = (stage: string) => {
  // 这里可以根据实际状态返回文本
  return '待配置'
}

const getStageStatusType = (stage: string) => {
  // 这里可以根据实际状态返回类型
  return 'warning'
}

const getCriteriaTypeType = (type: ScoringCriteriaType) => {
  const typeMap: Record<ScoringCriteriaType, string> = {
    technical: 'primary',
    artistic: 'success',
    creative: 'warning',
    overall: 'info'
  }
  return typeMap[type] || 'info'
}

const getDefaultScoringCriteria = (): ScoringCriteria[] => {
  return [
    {
      id: 1,
      name: '技术功底',
      description: '书法基本功、笔法技巧、结构布局等',
      type: 'technical',
      weight: 30,
      maxScore: 100,
      minScore: 0,
      isRequired: true,
      stage: ['primary', 'secondary']
    },
    {
      id: 2,
      name: '艺术表现',
      description: '艺术感染力、风格特色、审美价值等',
      type: 'artistic',
      weight: 35,
      maxScore: 100,
      minScore: 0,
      isRequired: true,
      stage: ['primary', 'secondary']
    },
    {
      id: 3,
      name: '创新程度',
      description: '创新性、独特性、时代感等',
      type: 'creative',
      weight: 20,
      maxScore: 100,
      minScore: 0,
      isRequired: true,
      stage: ['secondary']
    },
    {
      id: 4,
      name: '整体效果',
      description: '整体协调性、完整性、观赏性等',
      type: 'overall',
      weight: 15,
      maxScore: 100,
      minScore: 0,
      isRequired: true,
      stage: ['primary', 'secondary']
    }
  ]
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      emit('submit', formData.value)
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleReset = () => {
  formRef.value.resetFields()
  emit('reset')
}

// 初始化数据
onMounted(() => {
  if (props.initialData) {
    formData.value = { ...props.initialData }
  }

  // 设置默认评分标准
  formData.value.primaryStageConfig.scoringCriteria = primaryScoringCriteria.value
  if (formData.value.secondaryStageConfig) {
    formData.value.secondaryStageConfig.scoringCriteria = secondaryScoringCriteria.value
  }
})
</script>

<style lang="scss" scoped>
.evaluation-config-form {
  padding: 20rpx;
}

.stage-section {
  margin-top: 40rpx;
  padding: 30rpx;
  background-color: #f8f9fa;
  border-radius: 16rpx;
}

.stage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #e9ecef;
}

.stage-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #666;
  margin: 30rpx 0 20rpx 0;
  padding-left: 20rpx;
  border-left: 6rpx solid #1890ff;
}

.judge-group-section {
  margin-top: 30rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  border: 2rpx solid #e9ecef;
}

.scoring-criteria-section {
  margin-top: 30rpx;
}

.criteria-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.criteria-item {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  border: 2rpx solid #e9ecef;
}

.criteria-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.criteria-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.criteria-description {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15rpx;
}

.criteria-weights {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #999;
}

.form-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
  padding-top: 30rpx;
  border-top: 2rpx solid #e9ecef;
}
</style>
