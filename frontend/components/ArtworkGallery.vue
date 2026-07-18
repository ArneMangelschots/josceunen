<script setup lang="ts">
import FsLightbox from 'fslightbox-vue'
import type { StrapiMedia } from '~/types/strapi'

const props = defineProps<{
  images: StrapiMedia[]
  title: string
}>()

const { getMediaUrl } = useStrapi()

const activeIndex = ref(0)
const lightboxOpen = ref(false)

const sources = computed(() =>
  props.images.map((img) => getMediaUrl(img)).filter(Boolean)
)

const activeImage = computed(() => props.images[activeIndex.value])

function openLightbox(index: number) {
  activeIndex.value = index
  lightboxOpen.value = !lightboxOpen.value
}

function setActive(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div v-if="images.length" class="artwork-gallery">
    <img
      v-if="activeImage"
      class="artwork-gallery__main"
      :src="getMediaUrl(activeImage)"
      :alt="activeImage.alternativeText || title"
      role="button"
      tabindex="0"
      :aria-label="`Vergroot ${title}`"
      @click="openLightbox(activeIndex)"
      @keydown.enter="openLightbox(activeIndex)"
      @keydown.space.prevent="openLightbox(activeIndex)"
    />

    <div v-if="images.length > 1" class="artwork-gallery__thumbs">
      <img
        v-for="(image, index) in images"
        :key="image.id"
        :src="getMediaUrl(image)"
        :alt="image.alternativeText || `Afbeelding ${index + 1}`"
        :class="{ 'is-active': index === activeIndex }"
        role="button"
        tabindex="0"
        @click="setActive(index)"
        @keydown.enter="setActive(index)"
        @keydown.space.prevent="setActive(index)"
      />
    </div>

    <ClientOnly>
      <FsLightbox
        :toggler="lightboxOpen"
        :sources="sources"
        :slide="activeIndex + 1"
        type="image"
      />
    </ClientOnly>
  </div>
</template>
