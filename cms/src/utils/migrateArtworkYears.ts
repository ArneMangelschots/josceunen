import type { Core } from '@strapi/strapi';

const FLAG_KEY = 'josceunen.artwork_year_migrated';
const MIN_YEAR = 1970;
const MAX_YEAR = 2035;

/**
 * Copy year from legacy `date` onto `year` once, then hide/ignore date in admin.
 * Also normalizes numeric years to plain 4-digit strings.
 */
export async function migrateArtworkYears(strapi: Core.Strapi) {
  const existing = await strapi.db.query('strapi::core-store').findOne({
    where: { key: FLAG_KEY },
  });
  const alreadyMigrated = existing && JSON.parse(String(existing.value)) === true;

  const rows = await strapi.db.query('api::artwork.artwork').findMany({
    select: ['id', 'date', 'year'],
    limit: 1000,
  });

  let updated = 0;
  for (const row of rows) {
    let year: string | null = null;

    if (row.year !== null && row.year !== undefined && row.year !== '') {
      year = String(row.year).replace(/[^\d]/g, '').slice(0, 4);
    } else if (row.date) {
      year = String(new Date(row.date as string).getFullYear());
    }

    if (!year || year.length !== 4) continue;
    const numeric = Number(year);
    if (numeric < MIN_YEAR || numeric > MAX_YEAR) continue;
    if (row.year === year) continue;

    await strapi.db.query('api::artwork.artwork').update({
      where: { id: row.id },
      data: { year },
    });
    updated += 1;
  }

  if (!alreadyMigrated) {
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
  }

  if (updated > 0) {
    strapi.log.info(`Normalized year on ${updated} artwork row(s)`);
  }
}
