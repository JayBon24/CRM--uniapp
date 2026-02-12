import { http } from '@/utils/request'

export type DocumentExtractPayload = {
  url: string
  file_name?: string
  force_ocr?: boolean
  ocr_all_pages?: boolean
  ocr_page_limit?: number
}

export type DocumentExtractResult = {
  text: string
  method?: string
  page_count?: number
  ocr_pages?: number
  warnings?: string[]
}

function unwrapData<T>(res: any): T {
  return (res && typeof res === 'object' && 'data' in res) ? (res.data as T) : (res as T)
}

export async function extractDocumentText(payload: DocumentExtractPayload): Promise<DocumentExtractResult> {
  const res = await http.post<any>('/ai/document/extract/', payload)
  return unwrapData<DocumentExtractResult>(res)
}
