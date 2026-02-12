import { pinyin } from 'pinyin-pro'

/**
 * 汉字转拼音首字母
 * @param text 输入的中文文本
 * @returns 拼音首字母字符串
 */
export function getPinyinInitials(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  try {
    // 使用 pinyin-pro 获取拼音首字母
    const result = pinyin(text, {
      toneType: 'none',        // 不显示声调
      pattern: 'first',      // 只返回首字母
      nonZh: 'consecutive'    // 非中文字符保持原样
    })

    // 中文注释：去掉结果中的所有空格，返回连续的首字母并转为大写
    return result.replace(/\s+/g, '').toUpperCase()
  } catch (error) {
    console.error('拼音转换失败:', error)
    return ''
  }
}

/**
 * 汉字转完整拼音
 * @param text 输入的中文文本
 * @returns 完整拼音字符串
 */
export function getFullPinyin(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  try {
    const result = pinyin(text, {
      toneType: 'none',        // 不显示声调
      type: 'string',          // 返回完整拼音
      nonZh: 'consecutive'     // 非中文字符保持原样
    })

    return result
  } catch (error) {
    console.error('拼音转换失败:', error)
    return ''
  }
}

/**
 * 汉字转带声调拼音
 * @param text 输入的中文文本
 * @returns 带声调拼音字符串
 */
export function getPinyinWithTone(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  try {
    const result = pinyin(text, {
      toneType: 'symbol',      // 显示声调符号
      type: 'string',          // 返回完整拼音
      nonZh: 'consecutive'     // 非中文字符保持原样
    })

    return result
  } catch (error) {
    console.error('拼音转换失败:', error)
    return ''
  }
}
