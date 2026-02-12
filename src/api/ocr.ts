import { useUserStore } from '@/stores/user'
import { getEnvConfig } from '@/config/env'
import type { BusinessCardData, GeneralOCRData } from '@/types/interfaces/ocr'

function buildApiUrl(path: string) {
  const envConfig = getEnvConfig()
  let baseUrl = envConfig.apiBaseUrl || ''
  baseUrl = baseUrl.replace(/\/api\/?$/, '')
  return `${baseUrl}${path}`
}

async function uploadImage(path: string, url: string): Promise<any> {
  const userStore = useUserStore()
  const token = userStore.token

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url,
      filePath: path,
      name: 'image',
      header: {
        Authorization: token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        try {
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          if (data?.code && data.code !== 2000) {
            reject(new Error(data.msg || '识别失败'))
            return
          }
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
            reject(new Error(`请求失败(${res.statusCode})`))
            return
          }
          resolve(data)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

export async function recognizeBusinessCard(imagePath: string): Promise<BusinessCardData> {
  const url = buildApiUrl('/api/ai/ocr/business-card/')
  const res = await uploadImage(imagePath, url)
  return res.data || res
}

export async function recognizeGeneral(imagePath: string): Promise<GeneralOCRData> {
  const url = buildApiUrl('/api/ai/ocr/general/')
  const res = await uploadImage(imagePath, url)
  return res.data || res
}
