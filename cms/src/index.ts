import type { Core } from '@strapi/strapi';
import { setPublicPermissions } from './utils/permissions';
import { seedContent } from './utils/seed';
import { configureAdminExperience } from './utils/adminLayout';
import { migrateArtworkYears } from './utils/migrateArtworkYears';
import { ensureEditorArtworkYearPermission } from './utils/ensureEditorArtworkYearPermission';
import { ensureTagSlugs } from './utils/ensureTagSlugs';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await migrateArtworkYears(strapi);
    } catch (error) {
      strapi.log.error('Artwork year migration failed (non-fatal)');
      strapi.log.error(error);
    }
    try {
      await ensureTagSlugs(strapi);
    } catch (error) {
      strapi.log.error('Tag slug backfill failed (non-fatal)');
      strapi.log.error(error);
    }
    await setPublicPermissions(strapi);
    await seedContent(strapi);
    await configureAdminExperience(strapi);
    try {
      await ensureEditorArtworkYearPermission(strapi);
    } catch (error) {
      strapi.log.error('Editor year permission update failed (non-fatal)');
      strapi.log.error(error);
    }
  },
};
