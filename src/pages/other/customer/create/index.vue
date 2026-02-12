<!-- @ts-nocheck -->
<template>
  <view class="customer-create-page">
    <view class="page-header">
      <text class="page-title">{{ isEditMode ? '编辑客户' : '新增客户' }}</text>
    </view>
    
    <view class="form-container">
      <BusinessCardOCR
        ocrType="business-card"
        :fieldMapping="ocrFieldMapping"
        @recognized="handleOcrRecognized"
      />
      <view class="form-section">
        <view class="section-title">基础信息</view>
        
        <view class="form-item required">
          <text class="label">客户名称</text>
          <input
            v-model="formData.client_name"
            class="input"
            placeholder="请输入公司名称或个人姓名"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <view class="form-item">
          <text class="label">简称</text>
          <input
            v-model="formData.short_name"
            class="input"
            placeholder="选填"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <view class="form-item required">
          <text class="label">联系人</text>
          <input
            v-model="formData.contact_name"
            class="input"
            placeholder="请输入联系人姓名"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <view class="form-item required">
          <text class="label">手机号</text>
          <input
            v-model="formData.phone"
            type="number"
            class="input"
            placeholder="请输入手机号"
            maxlength="11"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <view class="form-item required">
          <text class="label">地址</text>
          <AreaSelector v-model="areaModel" @change="handleAreaChange" />
        </view>

        <view class="form-item required">
          <text class="label">详细地址</text>
          <input
            v-model="formData.detail_address"
            class="input"
            placeholder="填写省市区下的详细地址，如xx路xx大厦x楼xx等"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <view class="form-item required">
          <text class="label">客户类别</text>
          <view class="select-wrapper" @click="handleSelectCategory">
            <text v-if="formData.category" class="select-text">{{ categoryText }}</text>
            <text v-else class="select-placeholder">请选择客户类别</text>
            <SvgIcon name="arrow-right" :size="28" color="#C0C4CC" />
          </view>
        </view>

        <view class="form-item">
          <text class="label">客户等级</text>
          <view class="select-wrapper" @click="handleSelectGrade">
            <text v-if="formData.grade" class="select-text">{{ formData.grade }} 级</text>
            <text v-else class="select-placeholder">请选择等级 (可选)</text>
            <SvgIcon name="arrow-right" :size="28" color="#C0C4CC" />
          </view>
        </view>

        <view class="form-item">
          <text class="label">最后成交时间</text>
          <view class="datetime-picker" @click="showLastDealTimePicker = true">
            <text v-if="formData.last_deal_time" class="datetime-text">{{ formattedLastDealTime }}</text>
            <text v-else class="placeholder">可选</text>
            <SvgIcon name="calendar" :size="28" color="#C0C4CC" />
          </view>
        </view>

        <view class="form-item">
          <text class="label">需求摘要</text>
          <textarea
            v-model="formData.requirement_summary"
            class="textarea"
            placeholder="请简要描述客户需求"
            placeholder-style="color: #C0C4CC"
            :maxlength="500"
          />
          <text class="char-count">{{ formData.requirement_summary?.length || 0 }}/500</text>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">来源信息</view>

        <view class="form-item">
          <text class="label">来源渠道</text>
          <view class="select-wrapper" @click="handleSelectChannel">
            <text v-if="formData.source_channel" class="select-text">{{ formData.source_channel }}</text>
            <text v-else class="select-placeholder">请选择来源渠道</text>
            <SvgIcon name="arrow-right" :size="28" color="#C0C4CC" />
          </view>
        </view>

        <view class="form-item">
          <text class="label">引荐人</text>
          <input
            v-model="formData.referrer_name"
            class="input"
            placeholder="选填"
            placeholder-style="color: #C0C4CC"
          />
        </view>

        <view v-if="isManager" class="form-item">
          <text class="label">经办人</text>
          <view class="select-wrapper" @click="handleSelectOwner">
            <text v-if="ownerText" class="select-text">{{ ownerText }}</text>
            <text v-else class="select-placeholder">请选择经办人</text>
            <SvgIcon name="arrow-right" :size="28" color="#C0C4CC" />
          </view>
        </view>

    <!-- 经办人选择器 -->
    <OwnerSelector
      v-model="showOwnerSelector"
      :selectedUserIds="formData.handler_ids"
      :multiple="true"
      @confirm="handleOwnerConfirm"
      @close="showOwnerSelector = false"
    />
      </view>

      <view v-if="!isManager" class="tip-box">
        <u-icon name="info-circle" size="18" color="#E6A23C" />
        <text class="tip-text">您新增的线索将提交审核，审核通过后进入公海池</text>
      </view>
    </view>

    <view class="submit-bar">
      <view class="submit-btn" @click="handleSubmit">
        {{ isEditMode ? '保存' : (isManager ? '立即创建' : '提交审核') }}
      </view>
    </view>

    <u-datetime-picker
      v-model:show="showLastDealTimePicker"
      v-model="lastDealTimeValue"
      mode="datetime"
      :maxDate="Date.now()"
      @confirm="onLastDealTimeConfirm"
      @cancel="showLastDealTimePicker = false"
      @close="showLastDealTimePicker = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import type { ClientCreateParams, ClientUpdateParams, ClientGrade, ClientCategory } from '@/types/interfaces/client'
import { createClient, updateClient, getClientDetail } from '@/api/client'
import AreaSelector from '@/components/AreaSelector/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import BusinessCardOCR from '@/components/BusinessCardOCR/index.vue'
import { parseAddress } from '../../utils/addressParser'
import OwnerSelector from '@/components/OwnerSelector/index.vue'
import dayjs from 'dayjs'

const userStore = useUserStore()

const clientId = ref<number | string>('')
const isEditMode = ref(false)
const showOwnerSelector = ref(false)

// AI 扩展字段
const aiExtension = ref({
  trace_id: '',
  ai_source: 'manual'
})

const formData = ref({
  client_name: '',
  short_name: '',
  contact_name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail_address: '',
  requirement_summary: '',
  source_channel: '',
  referrer_name: '',
  owner_user_id: undefined as number | string | undefined,
  handler_ids: [] as Array<number | string>,
  grade: undefined as ClientGrade | undefined,
  category: undefined as ClientCategory | undefined,
  last_deal_time: ''
})

const ocrFieldMapping = {
  client_name: 'company',
  contact_name: 'name',
  phone: ['mobile', 'phone']
}

const categoryOptions = [
  { value: 'construction', label: '建工' },
  { value: 'material', label: '建材' }
]

const categoryText = computed(() => {
  if (!formData.value.category) return ''
  return categoryOptions.find(item => item.value === formData.value.category)?.label || ''
})

// AreaSelector 组件回传结构
const areaModel = ref<any>({
  provinceCode: '',
  cityCode: '',
  districtCode: '',
  provinceName: '',
  cityName: '',
  districtName: ''
})

const showLastDealTimePicker = ref(false)
const lastDealTimeValue = ref(Date.now())

const formattedLastDealTime = computed(() => {
  if (!formData.value.last_deal_time) return ''
  return dayjs(formData.value.last_deal_time).format('YYYY-MM-DD HH:mm')
})

// 是否管理角色（管理可直接创建线索进公海，销售需审批）
const isManager = computed(() => userStore.isManager)

onLoad(async (options: any) => {
  if (options?.trace_id) aiExtension.value.trace_id = options.trace_id
  if (options?.ai_source) aiExtension.value.ai_source = options.ai_source

  if (options?.id) {
    clientId.value = options.id
    isEditMode.value = true
    await loadClientDetail()
    return
  }

  // 新增模式：默认经办人为当前用户
  formData.value.handler_ids = [userStore.id]
  formData.value.owner_user_id = userStore.id
})

// 加载客户详情（编辑模式）
async function loadClientDetail() {
  try {
    uni.showLoading({ title: '加载中...' })
    const detail = await getClientDetail(clientId.value)
    
    // 处理地址字段：优先使用分离的字段，如果没有则从完整地址解析
    let province = detail.province || ''
    let city = detail.city || ''
    let district = detail.district || ''
    let detail_address = (detail as any).detail_address || ''
    
    // 如果分离的字段为空，尝试从完整地址（region或address）解析
    const fullAddress = (detail as any).region || (detail as any).address
    if (fullAddress && (!province && !city && !district)) {
      // 尝试解析地址：格式可能是 "省 市 区 详细地址" 或 "省市 区 详细地址"
      const addressParts = fullAddress.split(' ')
      
      if (addressParts.length >= 3) {
        // 三部分或更多：可能是 "省市 区 详细地址" 或 "省 市 区 详细地址"
        const first = addressParts[0]
        const second = addressParts[1]
        const third = addressParts[2]
        
        if (first.includes('市') && first.endsWith('市辖区')) {
          // "北京市市辖区 东城区 故宫博物院"
          province = first.slice(0, -3) // "北京市"
          city = '市辖区'
          district = second // "东城区"
          detail_address = addressParts.slice(2).join(' ') // "故宫博物院"
        } else if (first.includes('市') && first.endsWith('市')) {
          // "北京市 市辖区 东城区 详细地址"
          province = first
          city = second
          district = third
          detail_address = addressParts.slice(3).join(' ')
        } else {
          // "省 市 区 详细地址"
          province = first
          city = second
          district = third
          detail_address = addressParts.slice(3).join(' ')
        }
      } else if (addressParts.length === 2) {
        // 两部分：可能是 "省市 区"
        const first = addressParts[0]
        const second = addressParts[1]
        if (first.includes('市') && first.endsWith('市辖区')) {
          province = first.slice(0, -3)
          city = '市辖区'
          district = second
        } else if (first.endsWith('市')) {
          province = first
          district = second
        }
      }
    }
    
    // 填充表单数据
    Object.assign(formData.value, {
      client_name: detail.client_name || detail.company_name || '',
      short_name: detail.short_name || '',
      contact_name: detail.contact_name || '',
      // 兼容字段：后端/类型使用 mobile，这里表单仍用 phone
      phone: (detail as any).phone || detail.mobile || '',
      province: province,
      city: city,
      district: district,
      // 详细地址字段
      detail_address: detail_address,
      // 兼容字段：需求摘要可能是 demand_summary
      requirement_summary: (detail as any).requirement_summary || detail.demand_summary || '',
      source_channel: detail.source_channel || '',
      // 兼容字段：引荐人可能是 referrer
      referrer_name: (detail as any).referrer_name || detail.referrer || '',
      owner_user_id: detail.owner_user_id || undefined,
      handler_ids: (detail as any).handler_ids || (detail.owner_user_id ? [detail.owner_user_id] : []),
      grade: detail.grade || undefined,
      category: detail.category || undefined,
      last_deal_time: detail.last_deal_time || ''
    })
    
    // 填充地区选择器
    areaModel.value = {
      provinceCode: '',
      cityCode: '',
      districtCode: '',
      provinceName: province,
      cityName: city,
      districtName: district
    }

    if (formData.value.last_deal_time) {
      const parsed = dayjs(formData.value.last_deal_time)
      if (parsed.isValid()) {
        lastDealTimeValue.value = parsed.valueOf()
      }
    }
    
    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
    console.error('加载客户详情失败:', error)
  }
}

const selectedOwners = ref<Array<{ id: number | string; name: string }>>([])

const ownerText = computed(() => {
  if (!formData.value.handler_ids?.length) return ""
  if (selectedOwners.value.length) {
    return selectedOwners.value.map(item => item.name).join('\u3001')
  }
  return formData.value.handler_ids.map(id => `\u7528\u6237${id}`).join('\u3001')
})

function handleAreaChange(val: any) {
  // 中文注释：AreaSelector 返回 { provinceCode/cityCode/districtCode + provinceName/cityName/districtName }
  areaModel.value = val
  formData.value.province = val.provinceName || ''
  formData.value.city = val.cityName || ''
  formData.value.district = val.districtName || ''
}

function handleOcrRecognized(payload: any) {
  const mapped = payload?.mapped || {}
  if (mapped.client_name) formData.value.client_name = mapped.client_name
  if (mapped.contact_name) formData.value.contact_name = mapped.contact_name
  if (mapped.phone) formData.value.phone = mapped.phone

  const addressText = payload?.raw?.address
  if (addressText) {
    const parsed = parseAddress(addressText)
    areaModel.value = {
      provinceCode: '',
      cityCode: '',
      districtCode: '',
      provinceName: parsed.province || '',
      cityName: parsed.city || '',
      districtName: parsed.district || ''
    }
    handleAreaChange(areaModel.value)
  }
}

function handleSelectChannel() {
  const channels = ['电话来访', '网络咨询', '朋友推荐', '老客户介绍', '展会活动', '其他']
  
  uni.showActionSheet({
    itemList: channels,
    success: (res) => {
      formData.value.source_channel = channels[res.tapIndex]
    }
  })
}

function handleSelectCategory() {
  uni.showActionSheet({
    itemList: categoryOptions.map(item => item.label),
    success: (res) => {
      formData.value.category = categoryOptions[res.tapIndex].value as ClientCategory
    }
  })
}

function handleSelectGrade() {
  const grades = ['A', 'B', 'C', 'D']
  uni.showActionSheet({
    itemList: grades.map(g => `${g} 级`),
    success: (res) => {
      formData.value.grade = grades[res.tapIndex] as ClientGrade
    }
  })
}

function onLastDealTimeConfirm(value: any) {
  const formattedTime = dayjs(value.value || value).format('YYYY-MM-DD HH:mm:ss')
  formData.value.last_deal_time = formattedTime
  showLastDealTimePicker.value = false
}

function handleSelectOwner() {
  showOwnerSelector.value = true
}

function handleOwnerConfirm(users: any) {
  const list = Array.isArray(users) ? users : (users ? [users] : [])
  formData.value.handler_ids = list.map((item: any) => item.id)
  formData.value.owner_user_id = list[0]?.id
  selectedOwners.value = list.map((item: any) => ({ id: item.id, name: item.name }))
  showOwnerSelector.value = false
}

function validateForm(): boolean {
  if (!formData.value.client_name?.trim()) {
    uni.showToast({
      title: '请输入客户名称',
      icon: 'none'
    })
    return false
  }

  if (!formData.value.category) {
    uni.showToast({
      title: '请选择客户类别',
      icon: 'none'
    })
    return false
  }

  if (!formData.value.contact_name?.trim()) {
    uni.showToast({
      title: '请输入联系人',
      icon: 'none'
    })
    return false
  }

  if (!formData.value.phone?.trim()) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
    return false
  }

  // 手机号格式校验
  if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return false
  }

  if (!formData.value.province) {
    uni.showToast({
      title: '请选择地址',
      icon: 'none'
    })
    return false
  }

  if (!formData.value.detail_address?.trim()) {
    uni.showToast({
      title: '请填写详细地址',
      icon: 'none'
    })
    return false
  }

  return true
}

async function handleSubmit() {
  if (!validateForm()) return

  uni.showLoading({
    title: isEditMode.value ? '保存中...' : '提交中...'
  })

  try {
    // 拼接地址：省市区 + 详细地址
    const addressParts = []
    if (formData.value.province) addressParts.push(formData.value.province)
    if (formData.value.city) addressParts.push(formData.value.city)
    if (formData.value.district) addressParts.push(formData.value.district)
    if (formData.value.detail_address) addressParts.push(formData.value.detail_address)
    const fullAddress = addressParts.join(' ')

    const submitData = {
      ...formData.value,
      ...aiExtension.value,
      // 兼容后端字段
      mobile: formData.value.phone,
      demand_summary: formData.value.requirement_summary,
      referrer: formData.value.referrer_name,
      // 将拼接后的完整地址作为 region 字段提交
      region: fullAddress
    }

    if (formData.value.handler_ids && formData.value.handler_ids.length) {
      submitData.owner_user_id = formData.value.handler_ids[0]
    }

    if (isEditMode.value) {
      // 编辑模式：更新客户
      await updateClient({
        id: clientId.value,
        ...submitData
      } as ClientUpdateParams)
      
      uni.hideLoading()
      uni.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500
      })
    } else {
      // 新增模式：创建客户
      await createClient(submitData as ClientCreateParams)
      
      uni.hideLoading()
      uni.showToast({
        title: isManager.value ? '创建成功' : '提交成功',
        icon: 'success',
        duration: 1500
      })
    }

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({
      title: error?.message || (isEditMode.value ? '保存失败' : '提交失败'),
      icon: 'none'
    })
    console.error(isEditMode.value ? '更新客户失败:' : '创建客户失败:', error)
  }
}

// 注意：避免重复 onLoad 导致编辑模式下回填数据被覆盖
</script>

<style scoped lang="scss">
.customer-create-page {
  min-height: 100vh;
  background: #F5F7FA;
  padding-bottom: calc(220rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(220rpx + env(safe-area-inset-bottom));
}

.page-header {
  padding: 32rpx;
  background: #fff;
  border-bottom: 1rpx solid #EBEEF5;
  margin-bottom: 20rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #303133;
}

.form-container {
  padding: 20rpx;
  padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}

.form-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #EBEEF5;
}

.form-item {
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &.required .label::before {
    content: '*';
    color: #F56C6C;
    margin-right: 6rpx;
  }
}

.label {
  display: block;
  font-size: 28rpx;
  color: #606266;
  margin-bottom: 16rpx;
}

.input,
.textarea {
  width: 100%;
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #303133;
  border: 1rpx solid transparent;
  box-sizing: border-box;

  &:focus {
    border-color: #667eea;
    background: #fff;
  }
}

.input {
  height: 72rpx;
  line-height: 72rpx;
}

.textarea {
  min-height: 200rpx;
  line-height: 1.6;
}

.char-count {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #909399;
  text-align: right;
}

.select-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  border: 1rpx solid transparent;

  &:active {
    border-color: #667eea;
    background: #fff;
  }
}

.datetime-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  border: 1rpx solid transparent;

  &:active {
    border-color: #667eea;
    background: #fff;
  }
}

.datetime-text {
  font-size: 28rpx;
  color: #303133;
}

.placeholder {
  font-size: 28rpx;
  color: #C0C4CC;
}

.select-text {
  font-size: 28rpx;
  color: #303133;
}

.select-placeholder {
  font-size: 28rpx;
  color: #C0C4CC;
}

.tip-box {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 24rpx;
  background: #FFF7E6;
  border-radius: 8rpx;
  border-left: 4rpx solid #E6A23C;
}

.tip-text {
  flex: 1;
  font-size: 26rpx;
  color: #E6A23C;
  line-height: 1.6;
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #EBEEF5;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 1200;
}

.submit-btn {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;

  &:active {
    opacity: 0.8;
  }
}
</style>
