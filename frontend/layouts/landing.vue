<template>
  <div class="site site--landing">
    <header class="site-header">
      <div class="container">
        <NuxtLink to="/" class="site-title">Jos Ceunen</NuxtLink>
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
