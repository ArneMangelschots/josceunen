<script setup lang="ts">
import type { About } from '~/types/strapi'

const { fetchSingle, getMediaUrl } = useStrapi()

const { data: about, error } = await useAsyncData('about', () =>
  fetchSingle<About>('/api/about', {
    'populate[portrait]': 'true',
  })
)

if (error.value || !about.value) {
  throw createError({ statusCode: 404, statusMessage: 'Over-pagina niet gevonden' })
}

useSeoMeta({
  title: () => `${about.value?.title ?? 'Over'} — Jos Ceunen`,
  description: 'Over de kunstenaar Jos Ceunen.',
})
</script>

<template>
  <article v-if="about" class="about-page">
    <figure v-if="about.portrait" class="about-page__portrait">
      <img
        :src="getMediaUrl(about.portrait)"
        :alt="about.portrait.alternativeText || about.title"
      />
    </figure>
    <div>
      <header class="page-intro">
        <h1>{{ about.title }}</h1>
      </header>
      <StrapiBlocks :blocks="about.body" />
    </div>
  </article>
</template>
