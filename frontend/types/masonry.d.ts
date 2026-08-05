declare module '~/dependencies/masonry.js' {
  import type Masonry from 'masonry-layout'
  const MasonryCtor: typeof Masonry
  export default MasonryCtor
}

declare module 'imagesloaded' {
  interface ImagesLoaded {
    on(event: 'progress' | 'always' | 'done' | 'fail', callback: () => void): ImagesLoaded
  }

  function imagesLoaded(
    elem: Element | NodeList | Element[] | string,
    callback?: (instance: ImagesLoaded) => void
  ): ImagesLoaded

  export default imagesLoaded
}
