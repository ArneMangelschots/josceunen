<script setup lang="ts">
import type { StrapiBlockNode, StrapiBlockText } from '~/types/strapi'

const props = defineProps<{
  blocks?: StrapiBlockNode[] | null
}>()

const { getMediaUrl } = useStrapi()

function renderTexts(children?: StrapiBlockText[]) {
  return children ?? []
}
</script>

<template>
  <div v-if="blocks?.length" class="blocks">
    <template v-for="(block, index) in blocks" :key="index">
      <component
        :is="block.type === 'heading' ? `h${block.level || 2}` : block.type === 'quote' ? 'blockquote' : block.type === 'list' ? (block.format === 'ordered' ? 'ol' : 'ul') : 'p'"
        v-if="block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote'"
      >
        <template v-for="(child, childIndex) in renderTexts(block.children)" :key="childIndex">
          <strong v-if="child.bold">{{ child.text }}</strong>
          <em v-else-if="child.italic">{{ child.text }}</em>
          <template v-else>{{ child.text }}</template>
        </template>
      </component>

      <ol v-else-if="block.type === 'list' && block.format === 'ordered'">
        <li v-for="(item, itemIndex) in block.children" :key="itemIndex">
          <template v-for="(child, childIndex) in renderTexts(item.children)" :key="childIndex">
            {{ child.text }}
          </template>
        </li>
      </ol>

      <ul v-else-if="block.type === 'list'">
        <li v-for="(item, itemIndex) in block.children" :key="itemIndex">
          <template v-for="(child, childIndex) in renderTexts(item.children)" :key="childIndex">
            {{ child.text }}
          </template>
        </li>
      </ul>

      <figure v-else-if="block.type === 'image' && block.image">
        <img
          class="blocks__image"
          :src="getMediaUrl(block.image)"
          :alt="block.image.alternativeText || ''"
        />
      </figure>
    </template>
  </div>
</template>
