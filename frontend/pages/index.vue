<script setup lang="ts">
import type { Homepage } from '~/types/strapi'

definePageMeta({
  layout: false,
})

const { fetchSingle, getMediaSrcSet } = useStrapi()

const { data: homepage } = await useAsyncData('homepage', () =>
  fetchSingle<Homepage>('/api/homepage', {
    'populate[featuredArtworks][populate][images]': 'true',
  })
)

const featured = computed(() => (homepage.value?.featuredArtworks ?? []).slice(0, 5))

const floatPositions = [
  { top: '8%', left: '6%', rotate: '-8deg', delay: '0s', size: 'clamp(7rem, 18vw, 14rem)' },
  { top: '10%', right: '7%', rotate: '7deg', delay: '0.4s', size: 'clamp(6.5rem, 16vw, 12.5rem)' },
  { top: '42%', left: '3%', rotate: '5deg', delay: '0.8s', size: 'clamp(6rem, 15vw, 11.5rem)' },
  { top: '38%', right: '4%', rotate: '-6deg', delay: '1.1s', size: 'clamp(7.5rem, 17vw, 13rem)' },
  { bottom: '14%', left: '18%', rotate: '3deg', delay: '1.5s', size: 'clamp(5.5rem, 14vw, 10.5rem)' },
]

useSeoMeta({
  title: 'Jos Ceunen',
  description: 'Portfolio van kunstenaar Jos Ceunen.',
})
</script>

<template>
  <div class="landing">
    <div class="landing__atmosphere" aria-hidden="true" />

    <header class="landing__nav">
      <NuxtLink to="/kunstwerken" class="landing__nav-link">Kunstwerken</NuxtLink>
      <NuxtLink to="/about" class="landing__nav-link">Over</NuxtLink>
    </header>

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
          '--rotate': floatPositions[index]?.rotate,
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
.landing {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  background: #fff;
  color: #1a1a1a;
}

.landing__atmosphere {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 45% at 50% 48%, rgba(232, 220, 200, 0.35), transparent 70%),
    radial-gradient(ellipse 40% 35% at 15% 20%, rgba(210, 225, 230, 0.2), transparent 60%),
    radial-gradient(ellipse 35% 30% at 85% 75%, rgba(235, 215, 195, 0.18), transparent 55%);
  pointer-events: none;
}

.landing__nav {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem 1.75rem;
}

.landing__nav-link {
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: #5c5c5c;
  transition: color 0.2s ease;

  &:hover {
    color: #1a1a1a;
  }
}

.landing__stage {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 5rem 1.25rem 4rem;
}

.landing__center {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  text-align: center;
}

.landing__brand {
  margin: 0;
  font-family: 'Bellota Text', serif;
  font-size: clamp(2.75rem, 9vw, 5.5rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1;
  color: #1a1a1a;
}

.landing__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.6rem;
  border: 1px solid #1a1a1a;
  background: #1a1a1a;
  color: #fff;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;

  &:hover {
    background: transparent;
    color: #1a1a1a;
    transform: translateY(-2px);
  }
}

.landing__float {
  --rotate: 0deg;
  position: absolute;
  z-index: 1;
  display: block;
  line-height: 0;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(28, 25, 22, 0.14);
  transform: rotate(var(--rotate));
  animation: landing-float 7s ease-in-out infinite alternate;
  transition: box-shadow 0.35s ease;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  &:hover {
    z-index: 4;
    box-shadow: 0 22px 48px rgba(28, 25, 22, 0.22);
  }

  @media (max-width: 749px) {
    width: clamp(4.5rem, 28vw, 7.5rem) !important;

    &:nth-child(5) {
      display: none;
    }
  }
}

@keyframes landing-float {
  from {
    transform: rotate(var(--rotate)) translateY(0);
  }

  to {
    transform: rotate(var(--rotate)) translateY(-12px);
  }
}
</style>
