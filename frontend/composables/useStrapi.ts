import type { StrapiListResponse, StrapiMedia } from '~/types/strapi'

type QueryValue = string | number | boolean | undefined | null
type QueryRecord = Record<string, QueryValue>

function buildQuery(params: QueryRecord = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value))
    }
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

function pickPreferredMedia(media: StrapiMedia, preferLarge = true) {
  if (preferLarge && media.formats?.large) return media.formats.large
  if (media.formats?.medium) return media.formats.medium
  return media
}

export function useStrapi() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.strapiUrl.replace(/\/$/, '')

  async function fetchApi<T>(path: string, params: QueryRecord = {}): Promise<T> {
    const url = `${baseUrl}${path}${buildQuery(params)}`
    return await $fetch<T>(url)
  }

  async function fetchCollection<T>(
    endpoint: string,
    params: QueryRecord = {}
  ): Promise<T[]> {
    const response = await fetchApi<StrapiListResponse<T>>(endpoint, params)
    return response.data ?? []
  }

  async function fetchSingle<T>(
    endpoint: string,
    params: QueryRecord = {}
  ): Promise<T | null> {
    const response = await fetchApi<StrapiListResponse<T> | { data: T | null }>(
      endpoint,
      params
    )
    const data = response.data
    if (Array.isArray(data)) return data[0] ?? null
    return data ?? null
  }

  function getMediaUrl(media?: { url?: string } | null) {
    if (!media?.url) return ''
    return media.url.startsWith('http') ? media.url : `${baseUrl}${media.url}`
  }

  function getMediaSrcSet(media?: StrapiMedia | null, preferLarge = true) {
    if (!media) return { src: '', srcset: '' }
    const preferred = pickPreferredMedia(media, preferLarge)
    const src = getMediaUrl(preferred)
    const formats = media.formats
    const parts: string[] = []
    if (formats?.small?.url) parts.push(`${getMediaUrl(formats.small)} 500w`)
    if (formats?.medium?.url) parts.push(`${getMediaUrl(formats.medium)} 750w`)
    if (formats?.large?.url) parts.push(`${getMediaUrl(formats.large)} 1000w`)
    parts.push(`${getMediaUrl(media)} 1400w`)
    return { src, srcset: parts.join(', ') }
  }

  return {
    baseUrl,
    fetchApi,
    fetchCollection,
    fetchSingle,
    getMediaUrl,
    getMediaSrcSet,
  }
}
