<script setup lang="ts">
definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'Jos Ceunen',
  description: 'Website in opbouw.',
})
</script>

<template>
  <div class="construction">
    <div class="construction__bg" aria-hidden="true" />
    <main class="construction__main">
      <p class="construction__brand">Jos Ceunen</p>
      <h1 class="construction__title">Website in opbouw</h1>
      <p class="construction__text">Binnenkort vindt u hier het portfolio.</p>
    </main>
  </div>
</template>

<style scoped lang="scss">
.construction {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 2rem;
  overflow: hidden;
  background: #1c1916;
  color: #f3eee6;
}

.construction__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 10%, rgba(196, 146, 90, 0.22), transparent 55%),
    radial-gradient(ellipse 70% 50% at 90% 80%, rgba(90, 110, 120, 0.18), transparent 50%),
    linear-gradient(165deg, #2a2520 0%, #1c1916 45%, #141210 100%);
}

.construction__main {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 28rem;
}

.construction__brand {
  margin: 0 0 1.75rem;
  font-family: 'Bellota Text', serif;
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.construction__title {
  margin: 0 0 0.75rem;
  font-family: 'Lato', sans-serif;
  font-size: clamp(1.05rem, 2.5vw, 1.25rem);
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c9bfb2;
}

.construction__text {
  margin: 0;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.6;
  color: #a89f93;
}
</style>
