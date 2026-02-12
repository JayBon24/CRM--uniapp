/**
 * 附件处理工具
 */
import { getEnvConfig } from '@/config/env'
import { getToken } from '@/utils/auth'

export type AttachmentSource = string | {
  url?: string
  preview_url?: string
  name?: string
  attachment_id?: number | string
  file_id?: number | string
}

function buildPreviewPathById(fileId?: number | string) {
  if (fileId === undefined || fileId === null || fileId === '') return ''
  return `/admin-api/system/file/${fileId}/preview/`
}

export function getAttachmentUrl(file?: AttachmentSource) {
  if (!file) return ''
  if (typeof file === 'string') return resolveAttachmentUrl(file)
  const raw = file.preview_url || file.url || buildPreviewPathById(file.attachment_id || file.file_id)
  return resolveAttachmentUrl(raw || '')
}

export function resolveAttachmentUrl(url?: string) {
  if (!url) return ''
  if (
    url.startsWith('wxfile://')
    || url.startsWith('file://')
    || url.startsWith('blob:')
    || url.startsWith('data:')
  ) return url

  const appendAccessToken = (target: string) => {
    const token = getToken()
    if (!token) return target
    if (!/\/media\//.test(target) && !/\/admin-api\/system\/file\//.test(target)) return target
    if (/[\?&]access_token=/.test(target)) return target
    const sep = target.includes('?') ? '&' : '?'
    return `${target}${sep}access_token=${encodeURIComponent(token)}`
  }

  if (/^https?:\/\//i.test(url)) return appendAccessToken(url)
  try {
    // @ts-ignore
    const resolver = getApp?.()?.$vm?.$getImageUrl
    if (typeof resolver === 'function') {
      return appendAccessToken(resolver(url))
    }
  } catch {
    // ignore
  }
  const env = getEnvConfig()
  let base = (env?.apiBaseUrl || '').replace(/\/api\/?$/, '').replace(/\/$/, '')
  if (!base) return appendAccessToken(url)
  if (url.startsWith('/')) {
    return appendAccessToken(`${base}${url}`)
  }
  return appendAccessToken(`${base}/${url}`)
}

export async function openAttachmentDocument(url?: string) {
  const resolvedUrl = resolveAttachmentUrl(url)
  if (!resolvedUrl) {
    uni.showToast({
      title: '附件地址无效',
      icon: 'none'
    })
    return
  }

  uni.showLoading({ title: '打开附件...' })
  try {
    const downloadRes: any = await new Promise((resolve, reject) => {
      uni.downloadFile({
        url: resolvedUrl,
        success: resolve,
        fail: reject
      })
    })

    if (downloadRes?.statusCode !== 200) {
      throw new Error('附件下载失败')
    }

    await new Promise((resolve, reject) => {
      uni.openDocument({
        filePath: downloadRes.tempFilePath,
        success: resolve,
        fail: reject
      })
    })
  } catch (error: any) {
    uni.showToast({
      title: error?.message || '无法打开附件',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}
