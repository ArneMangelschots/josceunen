export interface StrapiMediaFormat {
  url: string
  width: number
  height: number
}

export interface StrapiMedia {
  id: number
  url: string
  alternativeText?: string | null
  width?: number
  height?: number
  formats?: {
    thumbnail?: StrapiMediaFormat
    small?: StrapiMediaFormat
    medium?: StrapiMediaFormat
    large?: StrapiMediaFormat
  }
}

export interface StrapiResponse<T> {
  data: T
  meta?: Record<string, unknown>
}

export interface StrapiListResponse<T> {
  data: T[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiEntity<T> {
  id: number
  documentId: string
  attributes?: T
}

export type StrapiBlockText = {
  type: 'text'
  text?: string
  bold?: boolean
  italic?: boolean
}

export type StrapiBlockNode =
  | {
      type: 'paragraph'
      children?: StrapiBlockText[]
    }
  | {
      type: 'heading'
      level?: number
      children?: StrapiBlockText[]
    }
  | {
      type: 'list'
      format?: 'ordered' | 'unordered'
      children?: Array<{
        type: 'list-item'
        children?: StrapiBlockText[]
      }>
    }
  | {
      type: 'quote'
      children?: StrapiBlockText[]
    }
  | {
      type: 'image'
      image?: StrapiMedia
      children?: StrapiBlockText[]
    }

export interface Technique {
  id: number
  documentId: string
  name: string
  slug: string
}

export interface Theme {
  id: number
  documentId: string
  name: string
  slug: string
}

export interface Artwork {
  id: number
  documentId: string
  title: string
  slug: string
  date?: string | null
  info?: StrapiBlockNode[] | null
  images?: StrapiMedia[]
  techniques?: Technique[]
  themes?: Theme[]
}

export interface About {
  id: number
  documentId: string
  title: string
  body?: StrapiBlockNode[] | null
  portrait?: StrapiMedia | null
}

/** Strapi v5 flattened document shape */
export function isFlatArtwork(item: Record<string, unknown>): item is Artwork {
  return typeof item.title === 'string' && typeof item.slug === 'string'
}
