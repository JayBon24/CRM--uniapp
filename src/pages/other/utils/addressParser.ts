export interface AddressParseResult {
  province?: string
  city?: string
  district?: string
  rest?: string
}

function pickSegment(source: string, pattern: RegExp): { value?: string; rest: string } {
  const match = source.match(pattern)
  if (!match) {
    return { rest: source }
  }
  const value = match[0]
  const index = source.indexOf(value)
  const rest = source.slice(index + value.length)
  return { value, rest }
}

export function parseAddress(text?: string): AddressParseResult {
  if (!text) return {}
  let remaining = text.trim()
  const result: AddressParseResult = {}

  const provinceSeg = pickSegment(remaining, /.+?(省|自治区|特别行政区)/)
  if (provinceSeg.value) {
    result.province = provinceSeg.value
    remaining = provinceSeg.rest.trim()
  }
  if (!result.province) {
    const municipality = ['北京市', '上海市', '天津市', '重庆市']
    const match = remaining.match(/^.+?市/)
    if (match && municipality.includes(match[0])) {
      result.province = match[0]
      result.city = match[0]
      remaining = remaining.slice(match[0].length).trim()
    }
  }

  const citySeg = result.city ? { rest: remaining } : pickSegment(remaining, /.+?市/)
  if (citySeg.value) {
    result.city = citySeg.value
    remaining = citySeg.rest.trim()
  }

  const districtSeg = pickSegment(remaining, /.+?(区|县|旗|市)/)
  if (districtSeg.value) {
    result.district = districtSeg.value
    remaining = districtSeg.rest.trim()
  }

  result.rest = remaining
  return result
}
