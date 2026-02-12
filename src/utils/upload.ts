import { getEnvConfig } from '@/config/env'
import { getToken } from '@/utils/auth'

export type UploadResult = {
  url: string
  preview_url?: string
  file_id?: number | string
  storage_key?: string
  name?: string
  mime?: string
  raw?: any
}

const resolveUploadUrl = () => {
  const env = getEnvConfig()
  let base = (env && env.apiBaseUrl) || ''
  base = base.replace(/\/api\/?$/, '')
  return `${base.replace(/\/$/, '')}/admin-api/system/file/`
}

const safeParseJson = (payload: any) => {
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload)
    } catch {
      return null
    }
  }
  return payload
}

const isUrlLike = (value: any) => {
  if (!value || typeof value !== 'string') return false
  if (/^https?:\/\//i.test(value)) return true
  if (value.startsWith('/')) return true
  // 允许相对路径（如 media/xxx），避免把纯文件名当作 URL
  return value.includes('/')
}

const pickUrl = (data: any) => {
  if (!data) return ''
  const candidates = [
    data.url,
    data.file_url,
    data.fileUrl,
    data.path,
    data.full_url,
    data.fileName,
    data.file_name,
  ]
  for (const item of candidates) {
    if (isUrlLike(item)) return item
  }
  return ''
}

const normalizeReturnedUrl = (value: any) => {
  if (!value || typeof value !== 'string') return ''
  const url = value.trim()
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return url
  if (url.startsWith('media/')) return `/${url}`
  return url
}

const normalizeUploadResponse = (payload: any): UploadResult | null => {
  const parsed = safeParseJson(payload)
  if (!parsed) return null
  const data = parsed.data || parsed
  const previewUrl = normalizeReturnedUrl(
    data.preview_url || data.previewUrl || parsed.preview_url || parsed.previewUrl
  )
  const url = normalizeReturnedUrl(pickUrl(data) || pickUrl(parsed) || previewUrl)
  if (!url) return null
  return {
    url,
    preview_url: previewUrl || url,
    file_id: data.file_id || data.fileId || data.id || parsed.file_id || parsed.fileId || parsed.id,
    storage_key: data.storage_key || data.storageKey || parsed.storage_key || parsed.storageKey,
    name: data.name || data.file_name || data.fileName,
    mime: data.mime_type || data.mime || data.content_type,
    raw: parsed
  }
}

export async function uploadFileToServer(filePath: string, fileName?: string): Promise<UploadResult> {
  const env = getEnvConfig()
  if (env?.useMock) {
    return {
      url: filePath,
      name: fileName
    }
  }

  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const url = resolveUploadUrl()

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url,
      filePath,
      name: 'file',
      header: headers,
      formData: fileName ? { name: fileName } : undefined,
      success: (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`Upload failed: ${res.statusCode}`))
          return
        }
        const normalized = normalizeUploadResponse(res.data)
        if (!normalized?.url) {
          reject(new Error('Upload response missing url'))
          return
        }
        resolve(normalized)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
