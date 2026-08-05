<template>
  <div class="site site--landing">
    <header class="site-header">
      <div class="container">
        <NuxtLink to="/" class="site-title" aria-label="Jos Ceunen">
          <span class="site-title__label site-title__label--compact" aria-hidden="true">JC</span>
          <span class="site-title__label site-title__label--expanded">Jos Ceunen</span>
        </NuxtLink>
        <nav class="site-nav" aria-label="Hoofdnavigatie">
          <NuxtLink to="/kunstwerken">Kunstwerken</NuxtLink>
          <NuxtLink to="/about">Over</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="site-main site-main--landing">
      <slot />
    </main>
  </div>
</template>
