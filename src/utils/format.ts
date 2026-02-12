/**
 * 格式化工具函数
 */

/**
 * 格式化金额
 * @param amount 金额
 * @param decimals 小数位数
 * @param decimalSeparator 小数点符号
 * @param thousandsSeparator 千分位符号
 * @returns 格式化后的金额
 */
export function formatAmount(amount: number | string, decimals = 2, decimalSeparator = '.', thousandsSeparator = ','): string {
  if (!amount && amount !== 0)
    return ''

  const numberAmount = typeof amount === 'string' ? Number.parseFloat(amount) : amount
  const str = numberAmount.toFixed(decimals)
  const parts = str.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]

  // 添加千分位
  const reg = /(\d)(?=(?:\d{3})+$)/g
  const formattedInteger = integerPart.replace(reg, `$1${thousandsSeparator}`)

  return decimals ? `${formattedInteger}${decimalSeparator}${decimalPart}` : formattedInteger
}



/**
 * 格式化文件大小
 * @param size 文件大小（字节）
 * @returns 格式化后的文件大小
 */
export function formatFileSize(size: number): string {
  if (!size)
    return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  let fileSize = size

  while (fileSize >= 1024 && index < units.length - 1) {
    fileSize /= 1024
    index++
  }

  return `${fileSize.toFixed(2)} ${units[index]}`
}

/**
 * 格式化手机号
 * @param phone 手机号
 * @returns 格式化后的手机号
 */
export function formatPhone(phone: string): string {
  if (!phone)
    return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化银行卡号
 * @param cardNo 银行卡号
 * @returns 格式化后的银行卡号
 */
export function formatBankCard(cardNo: string): string {
  if (!cardNo)
    return ''
  return cardNo.replace(/(\d{4})\d+(\d{4})$/, '$1 **** **** $2')
}

/**
 * 格式化身份证号
 * @param idCard 身份证号
 * @returns 格式化后的身份证号
 */
export function formatIdCard(idCard: string): string {
  if (!idCard)
    return ''
  return idCard.replace(/(\d{6})\d+(\d{4})$/, '$1********$2')
}

