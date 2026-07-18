<script setup lang="ts">
import type { Technique, Theme } from '~/types/strapi'

defineProps<{
  techniques: Technique[]
  themes: Theme[]
  years: number[]
  selectedTechnique: string
  selectedTheme: string
  selectedYear: string
}>()

const emit = defineEmits<{
  'update:selectedTechnique': [value: string]
  'update:selectedTheme': [value: string]
  'update:selectedYear': [value: string]
  reset: []
}>()

function selectTechnique(slug: string) {
  emit('update:selectedTechnique', slug)
}

function selectTheme(slug: string) {
  emit('update:selectedTheme', slug)
}

function onYearChange(event: Event) {
  emit('update:selectedYear', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="filters">
    <div class="filter-group">
      <span class="filter-group__label">Techniek</span>
      <div class="filter-group__chips">
        <button
          type="button"
          class="chip"
          :class="{ 'chip--active': !selectedTechnique }"
          @click="selectTechnique('')"
        >
          Alles
        </button>
        <button
          v-for="technique in techniques"
          :key="technique.documentId"
          type="button"
          class="chip"
          :class="{ 'chip--active': selectedTechnique === technique.slug }"
          @click="selectTechnique(technique.slug)"
        >
          {{ technique.name }}
        </button>
      </div>
    </div>

    <div class="filter-group">
      <span class="filter-group__label">Thema</span>
      <div class="filter-group__chips">
        <button
          type="button"
          class="chip"
          :class="{ 'chip--active': !selectedTheme }"
          @click="selectTheme('')"
        >
          Alles
        </button>
        <button
          v-for="theme in themes"
          :key="theme.documentId"
          type="button"
          class="chip"
          :class="{ 'chip--active': selectedTheme === theme.slug }"
          @click="selectTheme(theme.slug)"
        >
          {{ theme.name }}
        </button>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-group__label" for="year-filter">Jaar</label>
      <select
        id="year-filter"
        class="filter-select"
        :value="selectedYear"
        @change="onYearChange"
      >
        <option value="">Alle jaren</option>
        <option v-for="year in years" :key="year" :value="String(year)">
          {{ year }}
        </option>
      </select>
    </div>

    <div v-if="selectedTechnique || selectedTheme || selectedYear" class="filter-group">
      <span class="filter-group__label">&nbsp;</span>
      <button type="button" class="chip" @click="emit('reset')">Alles tonen</button>
    </div>
  </div>
</template>
