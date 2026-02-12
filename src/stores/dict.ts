import { defineStore } from 'pinia'
import { ref } from 'vue'

// 字典数据接口（统一格式：前端缓存与组件使用的格式）
// 中文注释：为兼容后端返回的原始字段，这里保留所有后端字段为可选属性
export interface DictData {
  // 前端统一使用的字段
  label: string
  value: string | number
  elTagType?: string
  elTagClass?: string
    // 兼容后端原始字段
  listClass?: string
  cssClass?: string
}

// 字典项接口
interface DictItem {
  key: string
  value: DictData[]
}

export const useDictStore = defineStore('dict', () => {
  // 字典缓存数组
  const dict = ref<DictItem[]>([])

  // 获取字典
  const getDict = (key: string): DictData[] | null => {
    if (!key) return null
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i].key === key) {
          return dict.value[i].value
        }
      }
    } catch (e) {
      return null
    }
    return null
  }

  // 设置字典
  const setDict = (key: string, value: DictData[]) => {
    if (key && value) {
      // 先检查是否已存在，存在则更新
      const existingIndex = dict.value.findIndex(item => item.key === key)
      if (existingIndex >= 0) {
        dict.value[existingIndex].value = value
      } else {
        dict.value.push({
          key: key,
          value: value
        })
      }
    }
  }

  // 删除字典
  const removeDict = (key: string): boolean => {
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i].key === key) {
          dict.value.splice(i, 1)
          return true
        }
      }
    } catch (e) {
      return false
    }
    return false
  }

  // 清空字典缓存
  const cleanDict = () => {
    dict.value = []
  }

  return {
    dict,
    getDict,
    setDict,
    removeDict,
    cleanDict
  }
})
