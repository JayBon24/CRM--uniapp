export interface BusinessCardData {
  name?: string
  company?: string
  position?: string
  phone?: string
  mobile?: string
  email?: string
  address?: string
  website?: string
  wechat?: string
  qq?: string
  rawText?: string
}

export interface GeneralOCRData {
  rawText: string
  extractedFields?: {
    contractNo?: string
    amount?: string
    date?: string
    partyA?: string
    partyB?: string
    caseNo?: string
    plaintiffName?: string
    defendantName?: string
  }
}
