<script setup lang="ts">
import type { Artwork, Homepage } from '~/types/strapi'

definePageMeta({
  layout: 'landing',
})

const { fetchSingle, fetchCollection, getMediaSrcSet } = useStrapi()

function pickRandom<T>(items: T[], count: number): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

const { data: featured } = await useAsyncData('homepage-featured', async () => {
  const homepage = await fetchSingle<Homepage>('/api/homepage', {
    'populate[featuredArtworks][populate][images]': 'true',
  })

  const selected = (homepage?.featuredArtworks ?? []).slice(0, 4)
  if (selected.length > 0) return selected

  const artworks = await fetchCollection<Artwork>('/api/artworks', {
    'populate[images]': 'true',
    sort: 'year:desc',
    'pagination[pageSize]': 50,
  })

  return pickRandom(
    artworks.filter((artwork) => artwork.images?.length),
    4
  )
})

const floatPositions = [
  { top: '12%', left: '8%', delay: '0s', size: 'clamp(7.5rem, 18vw, 13.5rem)' },
  { top: '14%', right: '8%', delay: '0.45s', size: 'clamp(7rem, 17vw, 12.5rem)' },
  { bottom: '16%', left: '10%', delay: '0.9s', size: 'clamp(7rem, 16vw, 12rem)' },
  { bottom: '14%', right: '9%', delay: '1.35s', size: 'clamp(7.5rem, 18vw, 13rem)' },
]

useSeoMeta({
  title: 'Jos Ceunen',
  description: 'Portfolio van kunstenaar Jos Ceunen.',
})
</script>

<template>
  <div class="landing">
    <div class="landing__stage">
      <NuxtLink
        v-for="(artwork, index) in featured"
        :key="artwork.documentId"
        :to="`/artwork/${artwork.slug}`"
        class="landing__float"
        :style="{
          top: floatPositions[index]?.top,
          left: floatPositions[index]?.left,
          right: floatPositions[index]?.right,
          bottom: floatPositions[index]?.bottom,
          width: floatPositions[index]?.size,
          animationDelay: floatPositions[index]?.delay,
        }"
      >
        <img
          v-if="artwork.images?.[0]"
          :src="getMediaSrcSet(artwork.images[0], false).src"
          :srcset="getMediaSrcSet(artwork.images[0], false).srcset"
          sizes="(max-width: 750px) 40vw, 220px"
          :alt="artwork.title"
          :width="artwork.images[0].width"
          :height="artwork.images[0].height"
          loading="eager"
        />
        <span class="landing__float-title">{{ artwork.title }}</span>
      </NuxtLink>

      <div class="landing__center">
        <p class="landing__brand">Jos Ceunen</p>
        <p class="landing__intro">
          Jos Ceunen is een hobby-kunstenaar met een absolute passie voor kunst, schoonheid en het leven.
        </p>
        <NuxtLink to="/kunstwerken" class="landing__cta">Ontdek alle kunst</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.landing {
  position: relative;
  min-height: calc(100vh - 4.5rem);
  min-height: calc(100dvh - 4.5rem);
  overflow: hidden;
  background: $color-bg;
  color: $color-text;
}

.landing__stage {
  position: relative;
  z-index: 1;
  min-height: inherit;
  display: grid;
  place-items: center;
  padding: 4rem 1.25rem;
}

.landing__center {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-md;
  text-align: center;
  max-width: 28rem;
}

.landing__brand {
  margin: 0;
  font-family: $font-display;
  font-size: clamp(1.35rem, 3.2vw, 1.85rem);
  font-weight: 400;
  letter-spacing: 0.22em;
  line-height: 1.3;
  text-transform: uppercase;
  color: $color-muted;
}

.landing__intro {
  margin: 0;
  font-family: $font-body;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  font-weight: 300;
  line-height: 1.55;
  color: $color-muted;
  max-width: 24.5rem;
}

.landing__cta {
  margin-top: $space-xs;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.35rem;
  border: 1px solid $color-border;
  background: $color-chip-bg;
  color: $color-text;
  font-family: $font-body;
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: $radius;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: $color-accent;
    background: $color-text;
    color: #fff;
  }
}

.landing__float {
  position: absolute;
  z-index: 1;
  display: block;
  line-height: 0;
  overflow: hidden;
  border-radius: $radius;
  background: $color-border;
  text-decoration: none;
  color: inherit;
  animation: landing-float 7s ease-in-out infinite alternate;

  img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.45s ease;
  }

  &-title {
    position: absolute;
    inset: auto 0 0;
    padding: 1.75rem 0.65rem 0.65rem;
    background: linear-gradient(to top, rgba(26, 26, 26, 0.55), transparent);
    font-family: $font-display;
    font-size: clamp(0.75rem, 1.4vw, 0.95rem);
    font-weight: 400;
    letter-spacing: 0.02em;
    line-height: 1.25;
    color: #fff;
    opacity: 0;
    transform: translateY(0.35rem);
    transition: opacity 0.35s ease, transform 0.35s ease;
    pointer-events: none;
  }

  &:hover,
  &:focus-visible {
    z-index: 4;

    img {
      transform: scale(1.03);
    }

    .landing__float-title {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: #{$bp-md - 1px}) {
    width: clamp(4.75rem, 30vw, 8rem) !important;
  }
}

@keyframes landing-float {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-10px);
  }
}
</style>
