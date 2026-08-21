import type { Core } from '@strapi/strapi';
import { setPublicPermissions } from './utils/permissions';
import { seedContent } from './utils/seed';
import { configureAdminExperience } from './utils/adminLayout';
import { migrateArtworkYears } from './utils/migrateArtworkYears';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await migrateArtworkYears(strapi);
    await setPublicPermissions(strapi);
    await seedContent(strapi);
    await configureAdminExperience(strapi);
  },
};
