<template>
  <view class="area-selector">
    <!-- 省市区显示区域 -->
    <view class="selected-area" @click="showSelector">
      <!-- <text class="area-label">{{ label }}</text> -->
      <view class="area-value">
        <text v-if="selectedText" class="selected-text">{{ selectedText }}</text>
        <text v-else class="placeholder">{{ placeholder }}</text>
      </view>
      <u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
    </view>

    <!-- 省市区选择弹窗 -->
    <u-popup v-model:show="showPopup" mode="bottom" height="80%" :safe-area-inset-bottom="true">
      <view class="area-popup">
        <!-- 弹窗头部 -->
        <view class="popup-header">
          <text class="popup-title">选择地区</text>
          <view class="button-wrapper-160" style="margin:6px">
            <u-button type="primary" size="small" @click="confirmSelection" :disabled="!canConfirm">
              确定
            </u-button>
          </view>
        </view>

        <!-- 选择步骤指示器 -->
        <view class="step-indicator">
          <view v-for="(step, index) in steps" :key="index" class="step-item"
            :class="{
              active: currentStep >= index,
              completed: getStepCompletedStatus(index)
            }"
            @click="goToStep(index)">
            <text class="step-text">{{ step.label }}</text>
            <text v-if="getStepCompletedStatus(index)" class="step-value">{{ step.value }}</text>
          </view>
        </view>

        <!-- 选择内容区域 -->
        <scroll-view class="area-content" scroll-y>
          <view class="area-list">
            <view v-for="item in currentAreaList" :key="item.id" class="area-item" :class="{ selected: isSelected(item) }"
              @click="selectArea(item)">
              <text class="area-name">{{ item.fullname }}</text>
              <u-icon v-if="isSelected(item)" name="checkmark" size="16" color="#667eea"></u-icon>
            </view>
          </view>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getProvinceList, getCityList, getDistrictList } from '@/api/area'

// 组件属性
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      provinceCode: '',
      cityCode: '',
      districtCode: ''
    })
  },
  label: {
    type: String,
    default: '所在地区'
  },
  placeholder: {
    type: String,
    default: '请选择省市区'
  },
  required: {
    type: Boolean,
    default: false
  }
})

// 组件事件
const emit = defineEmits(['update:modelValue', 'change'])

// 响应式数据
const showPopup = ref(false)
const currentStep = ref(0) // 0: 省份, 1: 城市, 2: 区县
const selectedAreas = ref({
  province: null,
  provinceCode: '',
  city: null,
  cityCode: '',
  district: null,
  districtCode: ''
})

const provinceList = ref([])
const cityList = ref([])
const districtList = ref([])

// 计算属性
const currentAreaList = computed(() => {
  switch (currentStep.value) {
    case 0:
      return provinceList.value
    case 1:
      return cityList.value
    case 2:
      return districtList.value
    default:
      return []
  }
})

const steps = computed(() => [
  { label: '省份', value: selectedAreas.value.province?.fullname || '' },
  { label: '城市', value: selectedAreas.value.city?.fullname || '' },
  { label: '区县', value: selectedAreas.value.district?.fullname || '' }
])

const selectedText = computed(() => {
  const areas = []
  if (selectedAreas.value.province) areas.push(selectedAreas.value.province.fullname)
  if (selectedAreas.value.city) areas.push(selectedAreas.value.city.fullname)
  if (selectedAreas.value.district) areas.push(selectedAreas.value.district.fullname)

  // 返回选中的地区名称，用空格分隔
  return areas.join(' ')
})

const canConfirm = computed(() => {
  return selectedAreas.value.province && selectedAreas.value.city && selectedAreas.value.district
})

// 方法
const showSelector = () => {
  showPopup.value = true
  loadProvinceList()
}



const loadProvinceList = async () => {
  try {
    const response = await getProvinceList()
    if (response.code === 200 || response.code === 2000 || response.code === 0) {
      provinceList.value = response.rows || response.data || []
    }
  } catch (error) {
    console.error('加载省份列表失败:', error)
    uni.showToast({
      title: '加载省份失败',
      icon: 'none'
    })
  }
}

const loadCityList = async (provinceAreaId) => {
  try {
    const response = await getCityList(provinceAreaId)
    if (response.code === 200 || response.code === 2000 || response.code === 0) {
      cityList.value = response.rows || response.data || []
    }
  } catch (error) {
    console.error('加载城市列表失败:', error)
    uni.showToast({
      title: '加载城市失败',
      icon: 'none'
    })
  }
}

const loadDistrictList = async (cityAreaId) => {
  try {
    const response = await getDistrictList(cityAreaId)
    if (response.code === 200 || response.code === 2000 || response.code === 0) {
      districtList.value = response.rows || response.data || []
    }
  } catch (error) {
    console.error('加载区县失败:', error)
    uni.showToast({
      title: '加载区县失败',
      icon: 'none'
    })
  }
}

const selectArea = (area) => {
  console.log('选择地区:', area, '当前步骤:', currentStep.value)

  switch (currentStep.value) {
    case 0: // 选择省份
      selectedAreas.value.province = area
      selectedAreas.value.city = null
      selectedAreas.value.district = null
      currentStep.value = 1
      console.log('已选择省份，加载城市列表')
      loadCityList(area.areaId)
      break
    case 1: // 选择城市
      selectedAreas.value.city = area
      selectedAreas.value.district = null
      currentStep.value = 2
      console.log('已选择城市，加载区县列表')
      loadDistrictList(area.areaId)
      break
    case 2: // 选择区县
      selectedAreas.value.district = area
      console.log('已选择区县，所有步骤完成')
      // 区县选择后，步骤指示器应该显示为完成状态
      // 不需要改变 currentStep，保持在第2步
      break
  }

  console.log('当前选中状态:', selectedAreas.value)
}

const isSelected = (area) => {
  switch (currentStep.value) {
    case 0:
      return selectedAreas.value.province?.areaId === area.areaId
    case 1:
      return selectedAreas.value.city?.areaId === area.areaId
    case 2:
      return selectedAreas.value.district?.areaId === area.areaId
    default:
      return false
  }
}

const goToStep = (step) => {
  if (step <= currentStep.value) {
    currentStep.value = step
  }
}

// 获取步骤完成状态
const getStepCompletedStatus = (stepIndex) => {
  switch (stepIndex) {
    case 0:
      return !!selectedAreas.value.province
    case 1:
      return !!selectedAreas.value.city
    case 2:
      return !!selectedAreas.value.district
    default:
      return false
  }
}

const confirmSelection = () => {
  console.log('AreaSelector confirmSelection 被调用，当前状态:', selectedAreas.value)

  if (!canConfirm.value) {
    console.log('AreaSelector 无法确认，缺少完整选择')
    uni.showToast({
      title: '请选择完整的省市区',
      icon: 'none'
    })
    return
  }

  // 构建返回数据
  const result = {
    provinceCode: selectedAreas.value.province.areaId,
    cityCode: selectedAreas.value.city.areaId,
    districtCode: selectedAreas.value.district.areaId,
    provinceName: selectedAreas.value.province.fullname,
    cityName: selectedAreas.value.city.fullname,
    districtName: selectedAreas.value.district.fullname
  }

  console.log('AreaSelector 准备触发事件，数据:', result)

  // 触发更新事件 - 只在确认后才更新父级数据
  console.log('AreaSelector 触发 update:modelValue 事件')
  emit('update:modelValue', result)

  console.log('AreaSelector 触发 change 事件')
  emit('change', result)

  // 关闭弹窗
  showPopup.value = false

  console.log('AreaSelector 省市区选择完成，弹窗已关闭')
}

// 重置选择
const reset = () => {
  selectedAreas.value = {
    province: null,
    provinceCode: '',
    city: null,
    cityCode: '',
    district: null,
    districtCode: ''
  }
  currentStep.value = 0
}

// 初始化选中的地区
const initSelectedAreas = async (areaData) => {
  // 如果没有传入数据，清空选择
  if (!areaData || (!areaData.provinceCode && !areaData.cityCode && !areaData.districtCode && 
      !areaData.provinceName && !areaData.cityName && !areaData.districtName)) {
    selectedAreas.value = {
      province: null,
      provinceCode: '',
      city: null,
      cityCode: '',
      district: null,
      districtCode: ''
    }
    currentStep.value = 0
    return
  }

  try {
    console.log('初始化选中的地区:', areaData)

    // 重置选择状态
    selectedAreas.value = {
      province: null,
      provinceCode: '',
      city: null,
      cityCode: '',
      district: null,
      districtCode: ''
    }
    currentStep.value = 0

    // 优先使用编码，如果没有编码则使用名称查找
    const provinceCode = areaData.provinceCode
    const provinceName = areaData.provinceName
    const cityCode = areaData.cityCode
    const cityName = areaData.cityName
    const districtCode = areaData.districtCode
    const districtName = areaData.districtName

    // 如果有省份编码或名称，加载省份数据并选中
    if (provinceCode || provinceName) {
      await loadProvinceList()
      let province = null
      if (provinceCode) {
        province = provinceList.value.find(p => p.areaId === provinceCode)
      } else if (provinceName) {
        // 通过名称查找省份（支持完整匹配或包含匹配）
        // 处理"北京市"这种情况，可能地区数据中是"北京"
        const normalizedProvinceName = provinceName.replace(/市$/, '') // 去掉末尾的"市"
        province = provinceList.value.find(p => 
          p.fullname === provinceName || 
          p.fullname === normalizedProvinceName ||
          p.fullname.includes(provinceName) || 
          provinceName.includes(p.fullname) ||
          p.name === provinceName ||
          p.name === normalizedProvinceName ||
          provinceName.includes(p.name)
        )
      }
      
      if (province) {
        selectedAreas.value.province = province
        selectedAreas.value.provinceCode = province.areaId
        currentStep.value = 1
        console.log('已初始化省份:', province.fullname)

        // 如果有城市编码或名称，加载城市数据并选中
        if (cityCode || cityName) {
          await loadCityList(province.areaId)
          let city = null
          if (cityCode) {
            city = cityList.value.find(c => c.areaId === cityCode)
          } else if (cityName) {
            // 通过名称查找城市
            // 特殊处理"市辖区"：如果是直辖市，可能没有"市辖区"这个城市，直接使用第一个城市
            if (cityName === '市辖区' && cityList.value.length > 0) {
              // 对于直辖市，使用第一个城市（通常是市辖区对应的城市）
              city = cityList.value[0]
            } else {
              city = cityList.value.find(c => 
                c.fullname === cityName || 
                c.fullname.includes(cityName) || 
                cityName.includes(c.fullname) ||
                c.name === cityName ||
                cityName.includes(c.name)
              )
            }
          }
          
          if (city) {
            selectedAreas.value.city = city
            selectedAreas.value.cityCode = city.areaId
            currentStep.value = 2
            console.log('已初始化城市:', city.fullname)

            // 如果有区县编码或名称，加载区县数据并选中
            if (districtCode || districtName) {
              await loadDistrictList(city.areaId)
              let district = null
              if (districtCode) {
                district = districtList.value.find(co => co.areaId === districtCode)
              } else if (districtName) {
                // 通过名称查找区县
                district = districtList.value.find(co => 
                  co.fullname === districtName || 
                  co.fullname.includes(districtName) || 
                  districtName.includes(co.fullname) ||
                  co.name === districtName ||
                  districtName.includes(co.name)
                )
              }
              
              if (district) {
                selectedAreas.value.district = district
                selectedAreas.value.districtCode = district.areaId
                currentStep.value = 2
                console.log('已初始化区县:', district.fullname)
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('初始化选中的地区失败:', error)
  }
}

// 监听器 - 响应 modelValue 变化，实现数据回显
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // 每次 modelValue 变化都重新初始化选中的地区
    initSelectedAreas(newVal)
  }
}, { immediate: true, deep: true })

// 暴露方法给父组件
defineExpose({
  reset
})
</script>

<style scoped>
.area-selector {
  width: 100%;
}

.selected-area {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background-color: #ffffff;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.selected-area:hover {
  border-color: #667eea;
}

.area-label {
  font-size: 28rpx;
  color: #333333;
  margin-right: 20rpx;
  min-width: 120rpx;
}

.area-value {
  flex: 1;
  margin-right: 20rpx;
}

.selected-text {
  font-size: 28rpx;
  color: #333333;
}

.placeholder {
  font-size: 28rpx;
  color: #999999;
}

.area-popup {
  background-color: #ffffff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.step-indicator {
  display: flex;
  padding: 20rpx 30rpx;
  background-color: #f8f9fa;
  border-bottom: 2rpx solid #f0f0f0;
}

.step-item {
  flex: 1;
  text-align: center;
  padding: 15rpx 10rpx;
  position: relative;
  cursor: pointer;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -50%;
  top: 50%;
  width: 100%;
  height: 2rpx;
  background-color: #e0e0e0;
  transform: translateY(-50%);
}

.step-item.completed:not(:last-child)::after {
  background-color: #667eea;
}

.step-item.completed .step-text {
  color: #667eea;
  font-weight: 500;
}

.step-item.completed .step-value {
  color: #667eea;
  font-weight: 500;
}

.step-item.active {
  color: #667eea;
}

.step-item.completed {
  color: #667eea;
}

.step-text {
  font-size: 24rpx;
  color: #666666;
  display: block;
  margin-bottom: 8rpx;
}

.step-value {
  font-size: 22rpx;
  color: #667eea;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.area-content {
  height: 600rpx;
}

.area-list {
  padding: 0 30rpx;
}

.area-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.area-item:hover {
  background-color: #f8f9fa;
}

.area-item.selected {
  background-color: #f0f4ff;
}

.area-name {
  font-size: 28rpx;
  color: #333333;
}

.area-item.selected .area-name {
  color: #667eea;
  font-weight: 500;
}
</style>
