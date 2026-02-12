/**
 * 表单验证工具函数
 */

/**
 * 验证手机号
 * @param phone 手机号
 * @returns boolean
 */
export function isPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param email 邮箱
 * @returns boolean
 */
export function isEmail(email: string): boolean {
  return /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)
}

/**
 * 验证身份证号
 * @param idCard 身份证号
 * @returns boolean
 */
export function isIdCard(idCard: string): boolean {
  return /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i.test(idCard)
}

/**
 * 验证URL
 * @param url URL
 * @returns boolean
 */
export function isUrl(url: string): boolean {
  const pattern = new RegExp(
    '^' // 开始
    + '(?:(?:https?|ftp)://)?' // 协议
    + '(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\\.)+[A-Z]{2,6}\\.?|' // 域名
    + 'localhost|' // localhost
    + '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})' // IP 地址
    + '(?::\\d+)?' // 端口
    + '(?:/?|[/?]\\S+)$', // 路径
    'i',
  )
  return pattern.test(url)
}

/**
 * 验证密码强度
 * 必须包含大小写字母和数字，长度8-20位
 * @param password 密码
 * @returns boolean
 */
export function isStrongPassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/.test(password)
}

/**
 * 验证中文姓名
 * @param name 姓名
 * @returns boolean
 */
export function isChineseName(name: string): boolean {
  return /^[\u4E00-\u9FA5]{2,}$/.test(name)
}

/**
 * 验证银行卡号
 * @param cardNo 银行卡号
 * @returns boolean
 */
export function isBankCard(cardNo: string): boolean {
  return /^\d{16,19}$/.test(cardNo)
}

/**
 * 验证金额
 * 支持两位小数的正数
 * @param amount 金额
 * @returns boolean
 */
export function isAmount(amount: string): boolean {
  return /^[1-9]\d*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(amount)
}

/**
 * 验证统一社会信用代码
 * @param code 统一社会信用代码
 * @returns boolean
 */
export function isCreditCode(code: string): boolean {
  return /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(code)
}

/**
 * 验证车牌号
 * @param plateNo 车牌号
 * @returns boolean
 */
export function isPlateNo(plateNo: string): boolean {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(plateNo)
}
