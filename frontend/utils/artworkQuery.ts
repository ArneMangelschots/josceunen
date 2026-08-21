export function buildArtworkQuery(filters: {
  techniek?: string
  thema?: string
  jaar?: string
}) {
  const params: Record<string, string> = {
    'populate[images]': 'true',
    'populate[techniques]': 'true',
    'populate[themes]': 'true',
    sort: 'year:desc',
  }

  if (filters.techniek) {
    params['filters[techniques][slug][$eq]'] = filters.techniek
  }

  if (filters.thema) {
    params['filters[themes][slug][$eq]'] = filters.thema
  }

  if (filters.jaar) {
    params['filters[year][$eq]'] = filters.jaar
  }

  return params
}
