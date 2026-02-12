import { ref, toRefs } from 'vue'
import { useDictStore } from '@/stores/dict'
import { getDicts } from '@/api/dict'

// 字典数据接口
interface DictData {
  label: string
  value: string
  elTagType?: string
  elTagClass?: string
  // 兼容后端原始字段
  listClass?: string
  cssClass?: string
}

/**
 * 获取字典数据的Hook
 * @param {...string} args 字典类型参数
 * @returns {Object} 响应式字典数据对象
 */
export function useDict(...args: string[]) {
  const res = ref<Record<string, DictData[]>>({})
  const dictStore = useDictStore()

  args.forEach((dictType) => {
    res.value[dictType] = []

    // 先从缓存中获取
    const dicts = dictStore.getDict(dictType)
    if (dicts && dicts.length > 0) {
      res.value[dictType] = dicts as DictData[]
    } else {
      // 缓存中没有，则从API获取
      console.log(`开始获取字典数据: ${dictType}`)
      getDicts(dictType)
        .then((resp) => {
          if (resp.code === 200 && resp.rows && Array.isArray(resp.rows)) {
            // 中文注释：保留后端原始字段(listClass/cssClass)，同时提供uView友好字段(elTagType/elTagClass)
            const formattedData = resp.rows.map((item: any) => ({
              label: item.dictLabel,
              value: item.dictValue,
              elTagType: item.listClass,
              elTagClass: item.cssClass,
              listClass: item.listClass,
              cssClass: item.cssClass
            }))
            res.value[dictType] = formattedData
            // 存入缓存
            dictStore.setDict(dictType, formattedData)
          } else {
            console.error(`字典数据响应异常 [${dictType}]:`, resp)
            console.error(`数据类型检查:`, {
              code: resp.code,
              hasRows: !!resp.rows,
              isArray: Array.isArray(resp.rows),
              dataType: typeof resp.rows
            })
          }
        })
        .catch((error) => {
          console.error(`获取字典数据失败 [${dictType}]:`, error)
          res.value[dictType] = []
        })
    }
  })

  return toRefs(res.value)
}

/**
 * 获取单个字典数据
 * @param {string} dictType 字典类型
 * @returns {Ref<DictData[]>} 响应式字典数据
 */
export function useSingleDict(dictType: string) {
  const res = ref<DictData[]>([])
  const dictStore = useDictStore()

  // 先从缓存中获取
  const dicts = dictStore.getDict(dictType)
  if (dicts) {
    res.value = dicts as DictData[]
  } else {
    // 缓存中没有，则从API获取
    getDicts(dictType)
      .then((resp) => {
        if (resp.code === 200 && resp.rows && Array.isArray(resp.rows)) {
          // 中文注释：保留原始字段(listClass/cssClass)，并同时提供elTagType/elTagClass
          const formattedData = resp.rows.map((item: any) => ({
            label: item.dictLabel,
            value: item.dictValue,
            elTagType: item.listClass,
            elTagClass: item.cssClass,
            listClass: item.listClass,
            cssClass: item.cssClass
          }))
          res.value = formattedData
          // 存入缓存
          dictStore.setDict(dictType, formattedData)
        } else {
          console.error(`字典数据响应异常 [${dictType}]:`, resp)
        }
      })
      .catch((error) => {
        console.error(`获取字典数据失败 [${dictType}]:`, error)
        res.value = []
      })
  }

  return res
}

/**
 * 根据字典值获取字典标签
 * @param {string} dictType 字典类型
 * @param {string} value 字典值
 * @returns {string} 字典标签
 */
export function getDictLabel(dictType: string, value: string): string {
  if (!dictType || !value) {
    console.error('使用$getDictLabel时 dictType不能为空', dictType)
    return value
  }
  const dictStore = useDictStore()
  const dicts = dictStore.getDict(dictType)
  console.log('-----------------------dicts', dicts)

  if (dicts) {
    const dict = (dicts as DictData[]).find((item) => item.value === value)
    return dict ? dict.label : value
  }

  return value
}

/**
 * 根据字典标签获取字典值
 * @param {string} dictType 字典类型
 * @param {string} label 字典标签
 * @returns {string} 字典值
 */
export function getDictValue(dictType: string, label: string): string {
  const dictStore = useDictStore()
  const dicts = dictStore.getDict(dictType)

  if (dicts) {
    const dict = (dicts as DictData[]).find((item) => item.label === label)
    return dict ? (dict.value as string) : label
  }

  return label
}

/**
 * 清空字典缓存
 */
export function clearDictCache() {
  const dictStore = useDictStore()
  dictStore.cleanDict()
}

/**
 * 刷新指定字典缓存
 * @param {string} dictType 字典类型
 */
export function refreshDict(dictType: string) {
  const dictStore = useDictStore()
  dictStore.removeDict(dictType)
}
