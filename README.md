# Jos Ceunen — Artwork Portfolio

Monorepo met **Strapi 5** (CMS) en **Nuxt 3** (frontend, Vite + Sass). Nederlandstalige site met kunstwerkoverzicht, filters op techniek/thema, detailpagina’s met lightbox, en een Over-pagina.

## Structuur

```
josceunen/
├── assets/          # Bronafbeeldingen (gebruikt door Strapi seed)
├── cms/             # Strapi CMS
├── frontend/        # Nuxt 3 frontend
└── index.html       # Redirect-hint naar de Nuxt dev-server
```

## Vereisten

- Node.js 20+
- npm

## Eerste keer opstarten

### 1. CMS (Strapi)

```bash
cd cms
cp .env.example .env   # indien aanwezig; anders gebruikt Strapi de gegenereerde .env
npm run develop        # gebruik develop (niet start) voor lokaal beheer /admin
```

Gebruik **`npm run develop`** voor lokale ontwikkeling. `npm run start` vereist eerst `npm run build` (admin staat in `dist/build/`); zonder die build geeft `/admin` “Not Found”.

Bij de eerste start:

- Content types worden geladen
- Publieke API-rechten worden gezet
- Voorbeeldcontent (technieken, thema’s, kunstwerken, Over) wordt geseed vanuit `../assets/`

Admin: [http://localhost:1337/admin](http://localhost:1337/admin)

### 2. Frontend (Nuxt)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

On macOS, `npm run dev` uses `TMPDIR=/tmp` to avoid a known Nuxt/vite-node socket path length bug. If you still see socket errors, stop all `nuxt` processes and run `rm -rf frontend/.nuxt` before restarting.

Site: [http://localhost:3000](http://localhost:3000)

## Omgevingsvariabelen

| Variabele | App | Standaard |
|-----------|-----|-----------|
| `NUXT_PUBLIC_STRAPI_URL` | frontend | `http://localhost:1337` |
| `HOST` / `PORT` | cms | `0.0.0.0` / `1337` |
| `PUBLIC_URL` | cms | `http://localhost:1337` |
| `CORS_ORIGIN` | cms | `http://localhost:3000,http://127.0.0.1:3000` |

## API-voorbeelden

- Kunstwerken: `GET /api/artworks?populate=images,techniques,themes&sort=date:desc`
- Filter techniek: `filters[techniques][slug][$eq]=olieverf`
- Filter thema: `filters[themes][slug][$eq]=landschap`
- Detail: `GET /api/artworks?filters[slug][$eq]=licht-over-het-veld&populate=images,techniques,themes`
- Over: `GET /api/about?populate=portrait`

## Productie

- **Frontend**: Cloudflare Pages — see [frontend/DEPLOY.md](frontend/DEPLOY.md)
- **CMS**: Hetzner CX23 + Caddy + PM2 — see [cms/deploy/README.md](cms/deploy/README.md)
- Site: `https://josceunen.be` · CMS: `https://api.josceunen.be/admin`

## Tech stack

- Vite (via Nuxt 3)
- Sass
- Vue / Nuxt 3
- Strapi 5
- fslightbox-vue
- Cloudflare Pages (frontend)
- Hetzner + Caddy (CMS)
