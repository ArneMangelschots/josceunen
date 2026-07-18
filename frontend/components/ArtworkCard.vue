<script setup lang="ts">
import type { Artwork } from '~/types/strapi'

const props = defineProps<{
  artwork: Artwork
}>()

const { getMediaSrcSet } = useStrapi()

const cover = computed(() => props.artwork.images?.[0])
const image = computed(() => (cover.value ? getMediaSrcSet(cover.value) : { src: '', srcset: '' }))

const tagLine = computed(() => {
  const techniques = props.artwork.techniques?.map((t) => t.name) ?? []
  const themes = props.artwork.themes?.map((t) => t.name) ?? []
  return [...techniques, ...themes].join(' · ')
})

function formatDate(value?: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('nl-BE', {
    year: 'numeric',
    month: 'long',
  })
}
</script>

<template>
  <NuxtLink :to="`/artwork/${artwork.slug}`" class="artwork-card">
    <div v-if="image.src" class="artwork-card__image">
      <img
        :src="image.src"
        :srcset="image.srcset"
        sizes="(max-width: 750px) 100vw, 33vw"
        :alt="artwork.title"
        :width="cover?.width"
        :height="cover?.height"
        loading="lazy"
      />
    </div>
    <h2 class="artwork-card__title">{{ artwork.title }}</h2>
    <p v-if="artwork.date" class="artwork-card__meta">{{ formatDate(artwork.date) }}</p>
    <p v-if="tagLine" class="artwork-card__tags">{{ tagLine }}</p>
  </NuxtLink>
</template>
