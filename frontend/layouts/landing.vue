<template>
  <div class="site site--landing">
    <header class="site-header">
      <div class="container">
        <NuxtLink to="/" class="site-title" aria-label="Jos Ceunen">
          <span class="site-title__text" aria-hidden="true">
            <span class="site-title__char">J</span><span class="site-title__expand site-title__expand--front">os&nbsp;</span><span class="site-title__char">C</span><span class="site-title__expand site-title__expand--back">eunen</span>
          </span>
        </NuxtLink>
        <nav class="site-nav" aria-label="Hoofdnavigatie">
          <NuxtLink to="/kunstwerken">Kunstwerken</NuxtLink>
          <NuxtLink to="/blog">Blog</NuxtLink>
          <NuxtLink to="/about">Over</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="site-main site-main--landing">
      <slot />
    </main>
  </div>
</template>
