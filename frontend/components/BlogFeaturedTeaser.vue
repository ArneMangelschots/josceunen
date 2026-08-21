<script setup lang="ts">
import type { BlogPost } from '~/types/strapi'

const props = defineProps<{
  post: BlogPost
}>()

const { getMediaSrcSet } = useStrapi()

const image = computed(() =>
  props.post.image ? getMediaSrcSet(props.post.image, true) : { src: '', srcset: '' }
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
  <NuxtLink :to="`/blog/${post.slug}`" class="blog-featured">
    <div v-if="image.src" class="blog-featured__media">
      <img
        :src="image.src"
        :srcset="image.srcset"
        sizes="(max-width: 750px) 100vw, 55vw"
        :alt="post.image?.alternativeText || post.title"
        :width="post.image?.width"
        :height="post.image?.height"
      />
    </div>
    <div class="blog-featured__content">
      <p v-if="post.date" class="blog-featured__date">{{ formatDate(post.date) }}</p>
      <h2 class="blog-featured__title">{{ post.title }}</h2>
      <p v-if="themeLine" class="blog-featured__themes">{{ themeLine }}</p>
      <p v-if="post.intro" class="blog-featured__intro">{{ post.intro }}</p>
      <span class="blog-featured__link">Lees verder</span>
    </div>
  </NuxtLink>
</template>
