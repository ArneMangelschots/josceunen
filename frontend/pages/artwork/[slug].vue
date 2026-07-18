<script setup lang="ts">
import type { Artwork } from '~/types/strapi'

const route = useRoute()
const slug = route.params.slug as string
const { fetchSingle } = useStrapi()

const { data: artwork, error } = await useAsyncData(`artwork-${slug}`, () =>
  fetchSingle<Artwork>('/api/artworks', {
    'filters[slug][$eq]': slug,
    'populate[images]': 'true',
    'populate[techniques]': 'true',
    'populate[themes]': 'true',
  })
)

if (error.value || !artwork.value) {
  throw createError({ statusCode: 404, statusMessage: 'Kunstwerk niet gevonden' })
}

function formatDate(value?: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('nl-BE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

useSeoMeta({
  title: () => `${artwork.value?.title} — Jos Ceunen`,
  description: () => artwork.value?.title ?? 'Kunstwerk',
})
</script>

<template>
  <article v-if="artwork" class="artwork-detail">
    <div>
      <NuxtLink to="/" class="artwork-detail__back">&larr; Terug naar overzicht</NuxtLink>
      <ArtworkGallery
        v-if="artwork.images?.length"
        :images="artwork.images"
        :title="artwork.title"
      />
    </div>
    <div>
      <h1>{{ artwork.title }}</h1>
      <p v-if="artwork.date" class="artwork-detail__date">{{ formatDate(artwork.date) }}</p>
      <div
        v-if="artwork.techniques?.length || artwork.themes?.length"
        class="artwork-detail__meta"
      >
        <span
          v-for="technique in artwork.techniques"
          :key="technique.documentId"
          class="artwork-detail__tag"
        >
          {{ technique.name }}
        </span>
        <span v-for="theme in artwork.themes" :key="theme.documentId" class="artwork-detail__tag">
          {{ theme.name }}
        </span>
      </div>
      <StrapiBlocks :blocks="artwork.info" />
    </div>
  </article>
</template>
