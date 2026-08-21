<script setup lang="ts">
import type { BlogPost } from '~/types/strapi'

const { fetchCollection } = useStrapi()

const { data: posts } = await useAsyncData('blog-posts', () =>
  fetchCollection<BlogPost>('/api/blog-posts', {
    sort: 'date:desc',
    'populate[image]': 'true',
    'populate[themes]': 'true',
    'pagination[pageSize]': 50,
  })
)

const featured = computed(() => posts.value?.[0] ?? null)
const remaining = computed(() => posts.value?.slice(1) ?? [])

useSeoMeta({
  title: 'Blog — Jos Ceunen',
  description: 'Blogberichten van Jos Ceunen.',
})
</script>

<template>
  <div class="blog-overview">
    <header class="page-intro">
      <h1>Blog</h1>
    </header>

    <p v-if="!posts?.length" class="empty-state">Nog geen blogberichten gepubliceerd.</p>

    <template v-else>
      <BlogFeaturedTeaser v-if="featured" :post="featured" />

      <div v-if="remaining.length" class="blog-grid">
        <BlogCard v-for="post in remaining" :key="post.documentId" :post="post" />
      </div>
    </template>
  </div>
</template>
