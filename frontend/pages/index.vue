<script setup lang="ts">
import type { Homepage } from '~/types/strapi'

definePageMeta({
  layout: 'landing',
})

const { fetchSingle, getMediaSrcSet } = useStrapi()

const { data: homepage } = await useAsyncData('homepage', () =>
  fetchSingle<Homepage>('/api/homepage', {
    'populate[featuredArtworks][populate][images]': 'true',
  })
)

const featured = computed(() => (homepage.value?.featuredArtworks ?? []).slice(0, 5))

const floatPositions = [
  { top: '10%', left: '6%', delay: '0s', size: 'clamp(7rem, 18vw, 14rem)' },
  { top: '12%', right: '7%', delay: '0.4s', size: 'clamp(6.5rem, 16vw, 12.5rem)' },
  { top: '44%', left: '4%', delay: '0.8s', size: 'clamp(6rem, 15vw, 11.5rem)' },
  { top: '40%', right: '5%', delay: '1.1s', size: 'clamp(7.5rem, 17vw, 13rem)' },
  { bottom: '12%', left: '20%', delay: '1.5s', size: 'clamp(5.5rem, 14vw, 10.5rem)' },
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
      </NuxtLink>

      <div class="landing__center">
        <p class="landing__brand">Jos Ceunen</p>
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
  gap: $space-lg;
  text-align: center;
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

.landing__cta {
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
  animation: landing-float 7s ease-in-out infinite alternate;
  transition: opacity 0.3s ease;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  &:hover {
    z-index: 4;
    opacity: 0.92;
  }

  @media (max-width: #{$bp-md - 1px}) {
    width: clamp(4.5rem, 28vw, 7.5rem) !important;

    &:nth-child(5) {
      display: none;
    }
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
