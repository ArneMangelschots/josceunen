<template>
  <div class="site">
    <header class="site-header">
      <div class="container">
        <NuxtLink to="/" class="site-title">Jos Ceunen</NuxtLink>
        <nav class="site-nav" aria-label="Hoofdnavigatie">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">Over</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="site-main">
      <div class="container">
        <slot />
      </div>
    </main>
    <footer class="site-footer">
      <div class="container">
        <p>&copy; {{ year }} Jos Ceunen</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
