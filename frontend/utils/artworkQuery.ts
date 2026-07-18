export function buildArtworkQuery(filters: {
  techniek?: string
  thema?: string
  jaar?: string
}) {
  const params: Record<string, string> = {
    'populate[images]': 'true',
    'populate[techniques]': 'true',
    'populate[themes]': 'true',
    sort: 'date:desc',
  }

  if (filters.techniek) {
    params['filters[techniques][slug][$eq]'] = filters.techniek
  }

  if (filters.thema) {
    params['filters[themes][slug][$eq]'] = filters.thema
  }

  if (filters.jaar) {
    params['filters[date][$gte]'] = `${filters.jaar}-01-01`
    params['filters[date][$lte]'] = `${filters.jaar}-12-31`
  }

  return params
}
