import type { Core } from '@strapi/strapi';

const FLAG_KEY = 'josceunen.artwork_year_migrated';
const MIN_YEAR = 1970;
const MAX_YEAR = 2035;

/**
 * Copy year from legacy `date` onto `year` once, then hide/ignore date in admin.
 */
export async function migrateArtworkYears(strapi: Core.Strapi) {
  const existing = await strapi.db.query('strapi::core-store').findOne({
    where: { key: FLAG_KEY },
  });
  if (existing && JSON.parse(String(existing.value)) === true) {
    return;
  }

  const rows = await strapi.db.query('api::artwork.artwork').findMany({
    select: ['id', 'date', 'year'],
    limit: 1000,
  });

  let updated = 0;
  for (const row of rows) {
    if (row.year || !row.date) continue;
    const year = new Date(row.date as string).getFullYear();
    if (year < MIN_YEAR || year > MAX_YEAR) continue;

    await strapi.db.query('api::artwork.artwork').update({
      where: { id: row.id },
      data: { year },
    });
    updated += 1;
  }

  const value = JSON.stringify(true);
  if (existing) {
    await strapi.db.query('strapi::core-store').update({
      where: { id: existing.id },
      data: { value },
    });
  } else {
    await strapi.db.query('strapi::core-store').create({
      data: {
        key: FLAG_KEY,
        value,
        type: 'boolean',
        environment: null,
        tag: null,
      },
    });
  }

  if (updated > 0) {
    strapi.log.info(`Migrated year on ${updated} artwork row(s) from date`);
  }
}
