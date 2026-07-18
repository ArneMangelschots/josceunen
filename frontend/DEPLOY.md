# Cloudflare Pages (frontend)

## Build settings

In Cloudflare Dashboard → Workers & Pages → Create → Pages:

| Setting | Value |
|---------|--------|
| Root directory | `frontend` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `20` (set env `NODE_VERSION=20`) |

## Environment variables

| Variable | Value |
|----------|--------|
| `NUXT_PUBLIC_STRAPI_URL` | `https://api.josceunen.be` |
| `NODE_VERSION` | `22` |

Nuxt is configured with Nitro preset `cloudflare-pages` in `nuxt.config.ts`.

## Custom domain

Attach `josceunen.be` and `www` to the Pages project (replace the old splash). Keep apex/`www` proxied by Cloudflare as usual.

## Git note

This monorepo must be pushed to GitHub/GitLab (or uploaded via Wrangler) for Pages to build it. From the project root:

```bash
git init
git add .
git commit -m "Initial commit for Cloudflare Pages + Strapi deploy"
# create a GitHub repo, then:
# git remote add origin git@github.com:YOU/josceunen.git
# git push -u origin main
```

Then connect that repo in Cloudflare Pages.
