<script setup lang="ts">
import type { BlogPost } from '~/types/strapi'

const props = defineProps<{
  post: BlogPost
}>()

const { getMediaSrcSet } = useStrapi()

const image = computed(() =>
  props.post.image ? getMediaSrcSet(props.post.image) : { src: '', srcset: '' }
)

const themeLine = computed(() =>
  props.post.themes?.map((theme) => theme.name).join(' · ') ?? ''
)

function formatDate(value?: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('nl-BE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <NuxtLink :to="`/blog/${post.slug}`" class="blog-card">
    <div v-if="image.src" class="blog-card__media">
      <img
        :src="image.src"
        :srcset="image.srcset"
        sizes="(max-width: 750px) 100vw, 33vw"
        :alt="post.image?.alternativeText || post.title"
        :width="post.image?.width"
        :height="post.image?.height"
        loading="lazy"
      />
    </div>
    <div class="blog-card__body">
      <h2 class="blog-card__title">{{ post.title }}</h2>
      <p v-if="post.date" class="blog-card__date">{{ formatDate(post.date) }}</p>
      <p v-if="themeLine" class="blog-card__themes">{{ themeLine }}</p>
    </div>
  </NuxtLink>
</template>
