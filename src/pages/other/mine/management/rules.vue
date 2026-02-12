<template>
  <view class="container">
    <scroll-view class="content" scroll-y>
      <!-- 权限提示 -->
      <view v-if="!isHQ" class="permission-tip">
        <u-icon name="info-circle" color="#E6A23C" size="20"></u-icon>
        <text class="tip-text">只有总所管理（HQ）可以配置规则</text>
      </view>
      
      <!-- 配置表单 -->
      <view v-else class="form-container">
        <!-- 公海回收规则配置 -->
        <view class="section">
          <view class="section-title">
            <text class="title-text">公海回收规则</text>
            <text class="title-desc">客户多少天内没有成交(赢单)自动回收</text>
          </view>
          
          <view class="form-item">
            <view class="form-label">
              <text class="label-text">无赢单天数</text>
            </view>
            <view class="form-input-wrapper">
              <input
                v-model.number="formData.recycle_timeout.no_won_days"
                type="number"
                class="form-input"
                placeholder="请输入天数"
                :disabled="loading"
              />
              <text class="input-unit">天</text>
            </view>
          </view>
        </view>
        
        <!-- 跟进频率标准配置 -->
        <view class="section">
          <view class="section-title">
            <text class="title-text">跟进频率标准</text>
            <text class="title-desc">各阶段客户的最小跟进频率</text>
          </view>
          
          <view class="form-item">
            <view class="form-label">
              <text class="label-text">面谈阶段</text>
            </view>
            <view class="form-input-wrapper">
              <input
                v-model.number="formData.followup_frequency.meeting_days"
                type="number"
                class="form-input"
                placeholder="请输入天数"
                :disabled="loading"
              />
              <text class="input-unit">天内有跟进</text>
            </view>
          </view>
          
          <view class="form-item">
            <view class="form-label">
              <text class="label-text">交案阶段</text>
            </view>
            <view class="form-input-wrapper">
              <input
                v-model.number="formData.followup_frequency.case_days"
                type="number"
                class="form-input"
                placeholder="请输入天数"
                :disabled="loading"
              />
              <text class="input-unit">天内有跟进</text>
            </view>
          </view>
          
          <view class="form-item">
            <view class="form-label">
              <text class="label-text">回款阶段</text>
            </view>
            <view class="form-input-wrapper">
              <input
                v-model.number="formData.followup_frequency.payment_days"
                type="number"
                class="form-input"
                placeholder="请输入天数"
                :disabled="loading"
              />
              <text class="input-unit">天内有跟进</text>
            </view>
          </view>
        </view>
        
        <!-- 回收预警开关 -->
        <view class="section">
          <view class="section-title">
            <text class="title-text">回收预警</text>
            <text class="title-desc">开启后，临近回收时会系统强提醒</text>
          </view>
          
          <view class="switch-item">
            <text class="switch-label">启用回收预警</text>
            <u-switch
              v-model="formData.recycle_warning_enabled"
              :disabled="loading"
              activeColor="#667eea"
            ></u-switch>
          </view>
        </view>
        
        <!-- 跟进提醒配置 -->
        <view class="section">
          <view class="section-title">
            <text class="title-text">跟进提醒</text>
            <text class="title-desc">当经办人多少天内没有进行对应的跟进会发送提醒到总所账号</text>
          </view>
          
          <view class="switch-item">
            <text class="switch-label">启用跟进提醒</text>
            <u-switch
              v-model="formData.followup_reminder.enabled"
              :disabled="loading"
              activeColor="#667eea"
            ></u-switch>
          </view>
          
          <view v-if="formData.followup_reminder.enabled" class="form-item">
            <view class="form-label">
              <text class="label-text">提醒天数</text>
            </view>
            <view class="form-input-wrapper">
              <input
                v-model.number="formData.followup_reminder.days"
                type="number"
                class="form-input"
                placeholder="请输入天数"
                :disabled="loading"
              />
              <text class="input-unit">天</text>
            </view>
          </view>
        </view>
        
        <!-- 销售阶段转化阈值（可选） -->
        <view class="section">
          <view class="section-title">
            <text class="title-text">阶段转化阈值</text>
            <text class="title-desc">定义达到什么条件才允许手动切换到下一阶段</text>
          </view>
          
          <view class="switch-item">
            <text class="switch-label">面谈阶段需要有效拜访</text>
            <u-switch
              v-model="formData.stage_transition_threshold.meeting_requires_visit"
              :disabled="loading"
              activeColor="#667eea"
            ></u-switch>
          </view>
          
          <view class="switch-item">
            <text class="switch-label">交案阶段需要合同</text>
            <u-switch
              v-model="formData.stage_transition_threshold.case_requires_contract"
              :disabled="loading"
              activeColor="#667eea"
            ></u-switch>
          </view>
        </view>
        
        <!-- 保存按钮 -->
        <view class="save-button-wrapper">
          <u-button
            type="primary"
            text="保存配置"
            :loading="loading"
            @click="handleSave"
          ></u-button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getCrmConfig, saveCrmConfig } from '../../api/config'
import type { CrmConfig } from '@/types/interfaces/config'

const userStore = useUserStore()
const loading = ref(false)

// 是否为HQ角色
const isHQ = computed(() => userStore.roleLevel === 'HQ')

// 表单数据
const formData = ref<CrmConfig>({
  recycle_timeout: {
    grade_a_days: 90,
    grade_b_days: 60,
    grade_c_days: 30,
    grade_d_days: 15,
    no_won_days: 90 // 默认90天无赢单自动回收
  },
  followup_frequency: {
    meeting_days: 3,
    case_days: 7,
    payment_days: 14
  },
  recycle_warning_enabled: true,
  followup_reminder: {
    enabled: true,
    days: 15 // 默认15天（半个月）
  },
  stage_transition_threshold: {
    meeting_requires_visit: false,
    case_requires_contract: true,
    payment_requires_amount: 0
  }
})

// 加载配置
async function loadConfig() {
  if (!isHQ.value) return
  
  loading.value = true
  try {
    const config = await getCrmConfig()
    formData.value = config
  } catch (error: any) {
    console.error('加载配置失败:', error)
    uni.showToast({
      title: error?.msg || '加载配置失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function ensureHQAccess() {
  if (isHQ.value) return true
  uni.showToast({
    title: '仅总所管理可访问',
    icon: 'none'
  })
  setTimeout(() => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack({ delta: 1 })
    } else {
      uni.switchTab({ url: '/pages/tab/mine' })
    }
  }, 200)
  return false
}

// 保存配置
async function handleSave() {
  if (!isHQ.value) {
    uni.showToast({
      title: '只有总所管理（HQ）可以配置规则',
      icon: 'none'
    })
    return
  }
  
  // 表单校验
  const { recycle_timeout, followup_frequency, followup_reminder } = formData.value
  
  if (!recycle_timeout.no_won_days || recycle_timeout.no_won_days < 1) {
    uni.showToast({
      title: '无赢单天数必须大于0',
      icon: 'none'
    })
    return
  }
  
  if (followup_reminder.enabled && (!followup_reminder.days || followup_reminder.days < 1)) {
    uni.showToast({
      title: '跟进提醒天数必须大于0',
      icon: 'none'
    })
    return
  }
  
  if (!followup_frequency.meeting_days || followup_frequency.meeting_days < 1 ||
      !followup_frequency.case_days || followup_frequency.case_days < 1 ||
      !followup_frequency.payment_days || followup_frequency.payment_days < 1) {
    uni.showToast({
      title: '跟进频率天数必须大于0',
      icon: 'none'
    })
    return
  }
  
  loading.value = true
  try {
    await saveCrmConfig({ config: formData.value })
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
  } catch (error: any) {
    console.error('保存配置失败:', error)
    uni.showToast({
      title: error?.msg || '保存失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!ensureHQAccess()) return
  loadConfig()
})
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.content {
  height: calc(100vh - 44px);
  padding: 24rpx;
}

.permission-tip {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx;
  background: #FFF7E6;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  
  .tip-text {
    font-size: 28rpx;
    color: #E6A23C;
  }
}

.form-container {
  padding-bottom: 40rpx;
}

.section {
  background: #fff;
  border-radius: 12rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.section-title {
  margin-bottom: 32rpx;
  
  .title-text {
    display: block;
    font-size: 32rpx;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8rpx;
  }
  
  .title-desc {
    display: block;
    font-size: 24rpx;
    color: #909399;
  }
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #EBEEF5;
  
  &:last-child {
    border-bottom: none;
  }
}

.form-label {
  flex: 1;
  
  .label-text {
    font-size: 28rpx;
    color: #606266;
  }
}

.form-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.form-input {
  width: 160rpx;
  height: 64rpx;
  padding: 0 20rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #303133;
  text-align: right;
  box-sizing: border-box;
}

.input-unit {
  font-size: 24rpx;
  color: #909399;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #EBEEF5;
  
  &:last-child {
    border-bottom: none;
  }
  
  .switch-label {
    font-size: 28rpx;
    color: #606266;
  }
}

.save-button-wrapper {
  padding: 40rpx 0;
  
  :deep(.u-button) {
    height: 88rpx;
    font-size: 32rpx;
    font-weight: 500;
  }
}
</style>
