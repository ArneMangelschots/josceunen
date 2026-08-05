<script setup lang="ts">
import type Masonry from 'masonry-layout'

const props = defineProps<{
  /** Change this when the item list changes so Masonry reloads. */
  layoutKey: string
}>()

const gridRef = ref<HTMLElement | null>(null)
let msnry: Masonry | null = null

async function initMasonry() {
  if (!import.meta.client || !gridRef.value) return

  const [{ default: MasonryCtor }, { default: imagesLoaded }] = await Promise.all([
    import('~/dependencies/masonry.js'),
    import('imagesloaded'),
  ])

  await nextTick()
  if (!gridRef.value) return

  if (msnry) {
    msnry.destroy()
    msnry = null
  }

  msnry = new MasonryCtor(gridRef.value, {
    itemSelector: '.artwork-card',
    columnWidth: '.artwork-grid__sizer',
    percentPosition: true,
    gutter: 24,
    transitionDuration: '0.2s',
  })

  imagesLoaded(gridRef.value).on('progress', () => {
    msnry?.layout()
  })
}

onMounted(() => {
  initMasonry()
})

watch(
  () => props.layoutKey,
  () => {
    initMasonry()
  }
)

onBeforeUnmount(() => {
  msnry?.destroy()
  msnry = null
})
</script>

<template>
  <div ref="gridRef" class="artwork-grid">
    <div class="artwork-grid__sizer" aria-hidden="true" />
    <slot />
  </div>
</template>
