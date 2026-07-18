import type { Core } from '@strapi/strapi';

const config = (): Core.Config.Plugin => ({
  'strapi-cloud': {
    enabled: false,
  },
});

export default config;
