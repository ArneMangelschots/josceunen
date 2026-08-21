import type { Core } from '@strapi/strapi';

/**
 * Fill missing required slugs on techniques/themes so publish does not fail.
 */
export async function ensureTagSlugs(strapi: Core.Strapi) {
  for (const uid of ['api::technique.technique', 'api::theme.theme'] as const) {
    const rows = await strapi.db.query(uid).findMany({
      select: ['id', 'name', 'slug'],
      limit: 1000,
    });

    let updated = 0;
    for (const row of rows) {
      if (row.slug || !row.name) continue;
      const slug = String(row.name)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!slug) continue;

      await strapi.db.query(uid).update({
        where: { id: row.id },
        data: { slug },
      });
      updated += 1;
    }

    if (updated > 0) {
      strapi.log.info(`Filled missing slug on ${updated} ${uid} row(s)`);
    }
  }
}
