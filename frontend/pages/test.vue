<script setup lang="ts">
import type { Artwork, Technique, Theme } from '~/types/strapi'
import { buildArtworkQuery } from '~/utils/artworkQuery'

const route = useRoute()
const router = useRouter()
const { fetchCollection } = useStrapi()

const selectedTechnique = computed({
  get: () => (route.query.techniek as string) || '',
  set: (value: string) => updateQuery({ techniek: value || undefined }),
})

const selectedTheme = computed({
  get: () => (route.query.thema as string) || '',
  set: (value: string) => updateQuery({ thema: value || undefined }),
})

const selectedYear = computed({
  get: () => (route.query.jaar as string) || '',
  set: (value: string) => updateQuery({ jaar: value || undefined }),
})

function updateQuery(patch: Record<string, string | undefined>) {
  const query = { ...route.query }
  for (const [key, value] of Object.entries(patch)) {
    if (value) query[key] = value
    else delete query[key]
  }
  router.replace({ query })
}

function resetFilters() {
  router.replace({ query: {} })
}

const { data: techniques } = await useAsyncData('techniques', () =>
  fetchCollection<Technique>('/api/techniques', { sort: 'name:asc' })
)

const { data: themes } = await useAsyncData('themes', () =>
  fetchCollection<Theme>('/api/themes', { sort: 'name:asc' })
)

const { data: yearSource } = await useAsyncData('artwork-years', () =>
  fetchCollection<Artwork>('/api/artworks', {
    'fields[0]': 'date',
    sort: 'date:desc',
    'pagination[pageSize]': 100,
  })
)

const years = computed(() => {
  const set = new Set<number>()
  for (const artwork of yearSource.value ?? []) {
    if (artwork.date) set.add(new Date(artwork.date).getFullYear())
  }
  return [...set].sort((a, b) => b - a)
})

const { data: artworks, pending, refresh } = await useAsyncData(
  'artworks',
  () =>
    fetchCollection<Artwork>(
      '/api/artworks',
      buildArtworkQuery({
        techniek: selectedTechnique.value,
        thema: selectedTheme.value,
        jaar: selectedYear.value,
      })
    ),
  { watch: [selectedTechnique, selectedTheme, selectedYear] }
)

const gridColsClass = computed(() => {
  const count = artworks.value?.length ?? 0
  if (count <= 1) return 'artwork-grid--cols-1'
  if (count === 2) return 'artwork-grid--cols-2'
  return ''
})

useSeoMeta({
  title: 'Jos Ceunen — Kunstwerken (preview)',
  description: 'Overzicht van kunstwerken door Jos Ceunen.',
})
</script>

<template>
  <div>
    <header class="page-intro">
      <h1>De kunst van Jos Ceunen</h1>
      <p>Een selectie van recente werken. Filter op techniek, thema of jaar.</p>
    </header>

    <ArtworkFilters
      :techniques="techniques ?? []"
      :themes="themes ?? []"
      :years="years"
      v-model:selected-technique="selectedTechnique"
      v-model:selected-theme="selectedTheme"
      v-model:selected-year="selectedYear"
      @reset="resetFilters"
    />

    <div v-if="pending" class="empty-state">Kunstwerken laden…</div>

    <div v-else-if="!artworks?.length" class="empty-state">
      Geen kunstwerken gevonden met deze filters.
    </div>

    <div v-else class="artwork-grid" :class="gridColsClass">
      <ArtworkCard v-for="artwork in artworks" :key="artwork.documentId" :artwork="artwork" />
    </div>
  </div>
</template>
