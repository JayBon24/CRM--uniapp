import { defineStore } from 'pinia'
import { ref } from 'vue'

// 城市信息接口
export interface CityInfo {
  /** 城市名称 */
  name: string
  /** 城市代码 */
  code: string
  /** 城市ID */
  id?: string
  /** 经度 */
  longitude?: number
  /** 纬度 */
  latitude?: number
  /** 省份代码 */
  provinceCode?: string
  /** 省份名称 */
  provinceName?: string
}

// 定位信息接口
export interface LocationInfo {
  /** 经度 */
  longitude: number
  /** 纬度 */
  latitude: number
  /** 定位精度 */
  accuracy?: number
  /** 海拔 */
  altitude?: number
  /** 海拔精度 */
  altitudeAccuracy?: number
  /** 水平精度 */
  horizontalAccuracy?: number
  /** 垂直精度 */
  verticalAccuracy?: number
  /** 速度 */
  speed?: number
}

/**
 * 城市状态管理
 */
export const useCityStore = defineStore('city', () => {
  // 当前城市信息（中文注释：默认使用“全国”，不限制城市）
  const currentCity = ref<CityInfo>({
    name: '全国',
    code: '',
    id: ''
  })

  // 定位信息
  const location = ref<LocationInfo | null>(null)

  // 是否正在定位
  const locating = ref(false)

  // 定位是否成功
  const locationSuccess = ref(false)

  // 设置城市信息
  const setCityInfo = (cityInfo: CityInfo) => {
    currentCity.value = { ...cityInfo }

    // 保存到本地存储
    uni.setStorageSync('currentCity', currentCity.value)

    console.log('城市信息已更新:', currentCity.value)
  }

  // 设置定位信息
  const setLocation = (locationInfo: LocationInfo) => {
    location.value = { ...locationInfo }
    locationSuccess.value = true

    // 保存到本地存储
    uni.setStorageSync('currentLocation', location.value)

    console.log('定位信息已更新:', location.value)
  }

  // 获取当前位置
  const getCurrentLocation = async (): Promise<LocationInfo | null> => {
    return new Promise((resolve, reject) => {
      if (locating.value) {
        reject(new Error('正在定位中...'))
        return
      }

      locating.value = true

      uni.getLocation({
        type: 'wgs84',
        success: (res) => {
          const locationInfo: LocationInfo = {
            longitude: res.longitude,
            latitude: res.latitude,
            accuracy: res.accuracy,
            altitude: res.altitude,
            horizontalAccuracy: res.horizontalAccuracy,
            verticalAccuracy: res.verticalAccuracy,
            speed: res.speed
          }

          setLocation(locationInfo)
          locating.value = false
          resolve(locationInfo)
        },
        fail: (error) => {
          console.error('定位失败:', error)
          locating.value = false
          locationSuccess.value = false
          reject(error)
        }
      })
    })
  }

  // 通过坐标获取城市信息（模拟实现，实际项目中需要调用地图API）
  const getCityByLocation = async (longitude: number, latitude: number): Promise<CityInfo | null> => {
    try {
      // 这里应该调用第三方地图服务API来获取城市信息
      // 目前使用模拟数据，根据坐标判断城市

      // 深圳大致范围：经度 113.7-114.6，纬度 22.4-22.8
      if (longitude >= 113.7 && longitude <= 114.6 && latitude >= 22.4 && latitude <= 22.8) {
        return {
          name: '深圳',
          code: '440300',
          id: '440300',
          longitude,
          latitude,
          provinceCode: '440000',
          provinceName: '广东省'
        }
      }

      // 广州大致范围：经度 113.0-113.7，纬度 22.9-23.6
      if (longitude >= 113.0 && longitude <= 113.7 && latitude >= 22.9 && latitude <= 23.6) {
        return {
          name: '广州',
          code: '440100',
          id: '440100',
          longitude,
          latitude,
          provinceCode: '440000',
          provinceName: '广东省'
        }
      }

      // 北京大致范围：经度 115.7-117.4，纬度 39.4-41.6
      if (longitude >= 115.7 && longitude <= 117.4 && latitude >= 39.4 && latitude <= 41.6) {
        return {
          name: '北京',
          code: '110000',
          id: '110000',
          longitude,
          latitude,
          provinceCode: '110000',
          provinceName: '北京市'
        }
      }

      // 上海大致范围：经度 120.8-122.2，纬度 30.7-31.9
      if (longitude >= 120.8 && longitude <= 122.2 && latitude >= 30.7 && latitude <= 31.9) {
        return {
          name: '上海',
          code: '310000',
          id: '310000',
          longitude,
          latitude,
          provinceCode: '310000',
          provinceName: '上海市'
        }
      }

      // 默认返回“全国”（中文注释：无法识别具体城市时，不限制）
      return {
        name: '全国',
        code: '',
        id: ''
      }
    } catch (error) {
      console.error('获取城市信息失败:', error)
      return null
    }
  }

  // 定位并更新城市信息
  const locateAndUpdateCity = async (): Promise<CityInfo | null> => {
    try {
      // 先获取定位
      const locationInfo = await getCurrentLocation()
      if (!locationInfo) {
        throw new Error('定位失败')
      }

      // 根据定位获取城市信息
      const cityInfo = await getCityByLocation(locationInfo.longitude, locationInfo.latitude)
      if (!cityInfo) {
        throw new Error('获取城市信息失败')
      }

      // 更新城市信息
      setCityInfo(cityInfo)

      return cityInfo
    } catch (error) {
      console.error('定位并更新城市失败:', error)

      // 定位失败时，使用默认城市（中文注释：全国）
      const defaultCity: CityInfo = {
        name: '全国',
        code: '',
        id: ''
      }

      setCityInfo(defaultCity)
      return defaultCity
    }
  }

  // 初始化城市信息（从本地存储读取）
  const initCityInfo = () => {
    try {
      const savedCity = uni.getStorageSync('currentCity')
      const savedLocation = uni.getStorageSync('currentLocation')

      if (savedCity && savedCity.name && savedCity.code !== undefined) {
        currentCity.value = savedCity
        console.log('从本地存储加载城市信息:', savedCity)
      }

      if (savedLocation && savedLocation.longitude && savedLocation.latitude) {
        location.value = savedLocation
        locationSuccess.value = true
        console.log('从本地存储加载定位信息:', savedLocation)
      }
    } catch (error) {
      console.error('初始化城市信息失败:', error)
    }
  }

  // 清除城市信息
  const clearCityInfo = () => {
    currentCity.value = {
      name: '全国',
      code: '',
      id: ''
    }
    location.value = null
    locationSuccess.value = false
    locating.value = false

    // 清除本地存储
    uni.removeStorageSync('currentCity')
    uni.removeStorageSync('currentLocation')
  }

  return {
    // 状态
    currentCity,
    location,
    locating,
    locationSuccess,

    // 方法
    setCityInfo,
    setLocation,
    getCurrentLocation,
    getCityByLocation,
    locateAndUpdateCity,
    initCityInfo,
    clearCityInfo
  }
}, {
  // 持久化配置
  persist: {
    key: 'city-store',
    storage: {
      getItem: (key: string) => {
        try {
          return uni.getStorageSync(key)
        } catch (error) {
          console.error('获取存储数据失败:', error)
          return null
        }
      },
      setItem: (key: string, value: any) => {
        try {
          uni.setStorageSync(key, value)
        } catch (error) {
          console.error('设置存储数据失败:', error)
        }
      },
      removeItem: (key: string) => {
        try {
          uni.removeStorageSync(key)
        } catch (error) {
          console.error('删除存储数据失败:', error)
        }
      }
    },
    paths: ['currentCity', 'location', 'locationSuccess']
  }
})
