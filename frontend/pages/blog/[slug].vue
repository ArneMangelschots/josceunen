<script setup lang="ts">
import type { Artwork, BlogPost } from '~/types/strapi'

const route = useRoute()
const slug = route.params.slug as string
const { fetchSingle, fetchCollection, getMediaSrcSet } = useStrapi()

const { data: post, error } = await useAsyncData(`blog-${slug}`, () =>
  fetchSingle<BlogPost>('/api/blog-posts', {
    'filters[slug][$eq]': slug,
    'populate[image]': 'true',
    'populate[themes]': 'true',
  })
)

if (error.value || !post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Blogbericht niet gevonden' })
}

const themeSlugs = computed(() => post.value?.themes?.map((theme) => theme.slug).filter(Boolean) ?? [])

const { data: relatedArtworks } = await useAsyncData(
  `blog-related-${slug}`,
  () => {
    if (!themeSlugs.value.length) return Promise.resolve([] as Artwork[])

    const params: Record<string, string | number> = {
      sort: 'date:desc',
      'populate[images]': 'true',
      'populate[techniques]': 'true',
      'populate[themes]': 'true',
      'pagination[pageSize]': 3,
    }

    themeSlugs.value.forEach((themeSlug, index) => {
      params[`filters[themes][slug][$in][${index}]`] = themeSlug
    })

    return fetchCollection<Artwork>('/api/artworks', params)
  }
)

const cover = computed(() =>
  post.value?.image ? getMediaSrcSet(post.value.image, true) : { src: '', srcset: '' }
)

function formatDate(value?: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('nl-BE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

useSeoMeta({
  title: () => `${post.value?.title} — Jos Ceunen`,
  description: () => post.value?.intro || post.value?.title || 'Blogbericht',
})
</script>

<template>
  <article v-if="post" class="blog-detail">
    <NuxtLink to="/blog" class="blog-detail__back">&larr; Terug naar blog</NuxtLink>

    <header class="blog-detail__header">
      <div v-if="cover.src" class="blog-detail__cover">
        <img
          :src="cover.src"
          :srcset="cover.srcset"
          sizes="100vw"
          :alt="post.image?.alternativeText || post.title"
          :width="post.image?.width"
          :height="post.image?.height"
        />
      </div>
      <div class="blog-detail__meta">
        <p v-if="post.date" class="blog-detail__date">{{ formatDate(post.date) }}</p>
        <h1>{{ post.title }}</h1>
        <div v-if="post.themes?.length" class="blog-detail__themes">
          <span v-for="theme in post.themes" :key="theme.documentId" class="blog-detail__tag">
            {{ theme.name }}
          </span>
        </div>
      </div>
    </header>

    <div class="blog-detail__body">
      <StrapiBlocks :blocks="post.body" />
    </div>

    <section v-if="relatedArtworks?.length" class="blog-related">
      <h2 class="blog-related__title">Gerelateerde kunstwerken</h2>
      <div class="blog-related__grid">
        <ArtworkCard
          v-for="artwork in relatedArtworks"
          :key="artwork.documentId"
          :artwork="artwork"
        />
      </div>
    </section>

    <div class="blog-detail__cta-wrap">
      <NuxtLink to="/kunstwerken" class="blog-detail__cta">Ontdek alle kunst</NuxtLink>
    </div>
  </article>
</template>
