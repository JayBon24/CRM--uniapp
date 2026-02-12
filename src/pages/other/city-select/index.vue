<template>
  <view class="city-select-container">

    <!-- 城市搜索 -->
    <view class="search-section">
      <u-search
        v-model="keyword"
        placeholder="输入城市名称或代码搜索"
        :clearabled="true"
        @search="onSearch"
        @custom="onSearch"
      />
    </view>

    <!-- 定位当前城市（进入页面自动定位，定位成功展示，点击可选择） -->
    <view class="location-section">
      <view class="location-item" @click="getCurrentLocation">
        <u-icon name="map" size="20" color="#2979ff"></u-icon>
        <text class="location-text">
          {{ locatedCity ? `已定位：${locatedCity.name}` : (locating ? '正在定位...' : '定位当前城市') }}
        </text>
        <u-icon v-if="locatedCity" name="arrow-right" size="16" color="#999"></u-icon>
      </view>
    </view>

    <!-- 热门城市 -->
    <view class="hot-cities">
      <view class="section-title">热门城市</view>
      <view class="hot-cities-grid">
        <view v-for="city in hotCities" :key="city.code"
              class="hot-city-item"
              :class="{ active: city.code === currentCityCode }"
              @click="selectCity(city)">
          {{ city.name }}
        </view>
      </view>
    </view>

    <!-- 全部城市 -->
    <view class="all-cities">
      <view class="section-title">全部城市</view>
      <view class="city-list">
        <view v-if="(!cityList || cityList.length === 0)" class="empty-tip">
          请输入关键字搜索
        </view>
        <view v-for="city in cityList" :key="city.code"
              class="city-item"
              :class="{ active: city.code === currentCityCode }"
              @click="selectCity(city)">
          <text class="city-name">{{ city.name }}</text>
          <u-icon v-if="city.code === currentCityCode" name="checkmark" color="#2979ff" size="16"></u-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
// 中文注释：接口返回与UI结构不同，定义本地UI使用的城市类型
type UICity = { id: string; code: string; name: string }
import eventBus from '@/utils/eventBus'
import { searchCityList } from '@/api/area'
import { http } from '@/utils/request'
import { getEnvConfig } from '@/config/env'

// 响应式数据
const currentCityCode = ref('')
const cityList = ref<UICity[]>([])
const keyword = ref('')
// 定位状态与定位到的城市
const locating = ref(false)
const locatedCity = ref<{ id: string; code: string; name: string } | null>(null)

// 热门城市
const hotCities = ref<City[]>([
  { id: '000000', code: '000000', name: '全国' },
  { id: '110000', code: '110000', name: '北京' },
  { id: '310000', code: '310000', name: '上海' },
  { id: '440100', code: '440100', name: '广州' },
  { id: '440300', code: '440300', name: '深圳' },
  { id: '320100', code: '320100', name: '南京' },
  { id: '330100', code: '330100', name: '杭州' },
  { id: '120000', code: '120000', name: '天津' },
  { id: '500000', code: '500000', name: '重庆' },
  { id: '370100', code: '370100', name: '济南' },
  { id: '370200', code: '370200', name: '青岛' },
  { id: '210100', code: '210100', name: '沈阳' },
  { id: '210200', code: '210200', name: '大连' },
  { id: '220100', code: '220100', name: '长春' },
  { id: '230100', code: '230100', name: '哈尔滨' },
  { id: '410100', code: '410100', name: '郑州' },
  { id: '420100', code: '420100', name: '武汉' },
  { id: '430100', code: '430100', name: '长沙' },
  { id: '450100', code: '450100', name: '南宁' },
  { id: '460100', code: '460100', name: '海口' },
  { id: '510100', code: '510100', name: '成都' },
  { id: '520100', code: '520100', name: '贵阳' },
  { id: '530100', code: '530100', name: '昆明' },
  { id: '610100', code: '610100', name: '西安' }
])



// 逆地理解析并缓存定位城市
const locateCity = async () => {
  locating.value = true
  try {
    const location = await new Promise<UniApp.GetLocationSuccess>((resolve, reject) => {
      uni.getLocation({ type: 'wgs84', success: resolve, fail: reject })
    })
    const latitude = location.latitude
    const longitude = location.longitude

    // 使用QQ地图逆地理解析
    const { qqmapKey } = getEnvConfig() as any
    const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${qqmapKey}`
    const geoResp: any = await http.get(url)
    const cityName: string | undefined = geoResp?.result?.address_component?.city

    if (cityName) {
      // 中文注释：定位到城市名后，通过接口尝试匹配真实城市列表
      try {
        const res = await searchCityList({ keyword: cityName })
        const rows = (res as any)?.rows || []
        if (rows.length > 0) {
          const r = rows[0]
          locatedCity.value = {
            id: String(r.id ?? r.areaId ?? ''),
            code: String(r.areaId ?? r.code ?? r.id ?? ''),
            name: String(r.name ?? r.fullname ?? '')
          }
        } else {
          locatedCity.value = { id: '', code: '', name: cityName }
        }
      } catch {
        locatedCity.value = { id: '', code: '', name: cityName }
      }
    } else {
      uni.showToast({ title: '未获取到城市信息', icon: 'none' })
    }
  } catch (e) {
    console.error('定位失败:', e)
    uni.showToast({ title: '定位失败，请手动选择', icon: 'none' })
  } finally {
    locating.value = false
  }
}

// 点击定位区域：若已定位则直接选择，否则先定位再选择
const getCurrentLocation = async () => {
  if (!locatedCity.value) {
    await locateCity()
  }
  if (locatedCity.value) {
    // 直接使用定位解析得到的城市（已按后端字段映射），或再次通过接口兜底
    if (locatedCity.value.code) {
      selectCity(locatedCity.value)
      return
    }
    try {
      const res = await searchCityList({ keyword: locatedCity.value.name })
      if ((res as any)?.rows?.length > 0) {
        const r = (res as any).rows[0]
        selectCity({ id: String(r.id ?? r.areaId ?? ''), code: String(r.areaId ?? r.code ?? r.id ?? ''), name: String(r.name ?? r.fullname ?? '') })
        return
      }
    } catch {}
    uni.showToast({ title: '未匹配到可选城市，请手动选择', icon: 'none' })
  }
}

const selectCity = async (city: UICity) => {
  // 将选中的城市信息存储到本地（使用currentCity键名，与store保持一致）
  uni.setStorageSync('currentCity', city)

  // 使用事件总线传递城市信息
  eventBus.emit('citySelected', city)
  console.log('城市选择完成，通过事件总线传递:', city.name)

  // 通过上一页暴露的方法更新首页城市（避免返回后仍显示"全国"）
  try {
    const pages = getCurrentPages()
    console.log('当前页面栈长度:', pages.length)
    console.log('页面栈:', pages.map(p => p.route))

    const prevPage: any = pages[pages.length - 2]
    console.log('上一页:', prevPage?.route)
    console.log('上一页是否有$vm:', !!prevPage?.$vm)
    console.log('上一页是否有updateCityFromSelect方法:', typeof prevPage?.$vm?.updateCityFromSelect)

    if (prevPage && prevPage.$vm && typeof prevPage.$vm.updateCityFromSelect === 'function') {
      // 中文注释：直接调用首页暴露的方法，更新城市并刷新列表
      console.log('开始调用updateCityFromSelect，传入城市:', city)
      await prevPage.$vm.updateCityFromSelect(city)
      console.log('城市更新完成，准备返回')
    } else {
      console.warn('无法找到上一页或updateCityFromSelect方法')
    }
  } catch (err) {
    console.warn('调用上一页更新城市方法失败:', err)
  }

  // 延迟返回，确保城市更新完成
  setTimeout(() => {
    uni.navigateBack({
      success: () => {
        console.log('城市选择完成，返回上一页')
      },
      fail: (err) => {
        console.error('返回上一页失败:', err)
        // 如果返回失败，尝试跳转到首页
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  }, 100)
}

// 搜索城市（调用 /sysArea/cityList）
const onSearch = async () => {
  // 至少输入1个字才允许搜索
  // if (!keyword.value || String(keyword.value).trim().length < 1) {
  //   uni.showToast({ title: '请输入至少1个字进行搜索', icon: 'none' })
  //   return
  // }
  try {
    // 中文注释：请求城市列表，服务端根据 keyword 过滤
    const res = await searchCityList({ keyword: keyword.value })
    // 统一响应处理：TableDataInfo 格式，rows 为数据
    const rows = (res as any)?.rows || []
    // 将后端字段映射为UI所需结构：areaId->code, name/fullname->name
    cityList.value = rows.map((r: any) => ({
      id: String(r.id),
      code: String(r.areaId),
      name: String(r.fullname)
    }))
  } catch (e) {
    // 页面无需捕获异常，request.ts 已统一处理，这里仅做降级
    console.error('城市搜索失败:', e)
  }
}

// 生命周期
onLoad(() => {
  console.log('城市选择页面加载完成')
  // 获取当前选中的城市（使用currentCity键名，与store保持一致）
  const selectedCity = uni.getStorageSync('currentCity')
  if (selectedCity) {
    currentCityCode.value = selectedCity.code
  }
  onSearch()
  // 进入页面自动定位（小程序端有效）
  locateCity()
})
</script>

<style lang="scss" scoped>
.city-select-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-section {
  background-color: #fff;
  padding: 16rpx 20rpx;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.header-right {
  width: 60rpx;
}

.location-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 32rpx;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 0;
}

.location-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.hot-cities {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 32rpx;
}

.section-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 24rpx;
}

.hot-cities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.hot-city-item {
  padding: 20rpx;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
  border: 2rpx solid transparent;

  &.active {
    background-color: #e3f2fd;
    border-color: #2979ff;
    color: #2979ff;
  }
}

.all-cities {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 32rpx;
}

.city-list {
  display: flex;
  flex-direction: column;
}

.empty-tip {
  padding: 40rpx 0;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}

.city-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f8f9fa;

  &.active {
    color: #2979ff;
  }
}

.city-name {
  font-size: 30rpx;
  color: #333;
}
</style>
