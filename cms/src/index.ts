import type { Core } from '@strapi/strapi';
import { setPublicPermissions } from './utils/permissions';
import { seedContent } from './utils/seed';
import { configureAdminExperience } from './utils/adminLayout';
import { migrateArtworkYears } from './utils/migrateArtworkYears';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await migrateArtworkYears(strapi);
    } catch (error) {
      strapi.log.error('Artwork year migration failed (non-fatal)');
      strapi.log.error(error);
    }
    await setPublicPermissions(strapi);
    await seedContent(strapi);
    await configureAdminExperience(strapi);
  },
};
