# Deploy Strapi on Hetzner (api.josceunen.be)

Target: Ubuntu CX23 at `167.233.233.164`  
Public URL: `https://api.josceunen.be`

## 1. DNS

In Cloudflare DNS:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `api` | `167.233.233.164` | DNS only (grey cloud) |

## 2. On the server (as root)

```bash
apt update && apt upgrade -y
apt install -y curl git build-essential python3

# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 + Caddy
npm install -g pm2
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy
```

## 3. Copy the CMS from your Mac

From your Mac (not on the server), in the project root:

```bash
rsync -avz --exclude node_modules --exclude .tmp --exclude .cache \
  -e ssh \
  ./cms/ root@167.233.233.164:/var/www/josceunen-cms/
```

Also copy seed images if you want the demo content seed on first boot:

```bash
rsync -avz -e ssh ./assets/ root@167.233.233.164:/var/www/josceunen-assets/
```

## 4. Create production `.env` on the server

```bash
cd /var/www/josceunen-cms
mkdir -p data public/uploads

# Generate secrets
node -e "for (const k of ['APP_KEYS','API_TOKEN_SALT','ADMIN_JWT_SECRET','TRANSFER_TOKEN_SALT','JWT_SECRET']) { if (k==='APP_KEYS') console.log(k+'='+[1,2,3,4].map(()=>require('crypto').randomBytes(16).toString('base64')).join(',')); else console.log(k+'='+require('crypto').randomBytes(16).toString('base64')); }"
```

Create `/var/www/josceunen-cms/.env` with those secrets plus:

```env
HOST=127.0.0.1
PORT=1337
PUBLIC_URL=https://api.josceunen.be
CORS_ORIGIN=https://josceunen.be,https://www.josceunen.be
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=data/data.db
NODE_ENV=production
```

## 5. Install, build, start

```bash
cd /var/www/josceunen-cms
npm ci
npm run build
pm2 start npm --name strapi -- start
pm2 save
pm2 startup
```

## 6. Caddy reverse proxy

Copy the Caddyfile from this folder:

```bash
cp /var/www/josceunen-cms/deploy/Caddyfile /etc/caddy/Caddyfile
systemctl reload caddy
```

Or create `/etc/caddy/Caddyfile`:

```
api.josceunen.be {
	reverse_proxy 127.0.0.1:1337
}
```

Then:

```bash
systemctl reload caddy
```

Open https://api.josceunen.be/admin and create the first admin user.

## Useful commands

```bash
pm2 status
pm2 logs strapi
pm2 restart strapi
```
