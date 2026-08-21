import type { Core } from '@strapi/strapi';

const ARTWORK_UID = 'api::artwork.artwork';
const EDITOR_CODE = 'strapi-editor';

type PermissionProperties = {
  fields?: string[];
  [key: string]: unknown;
};

/**
 * When `year` replaced/added on artworks, Editor RBAC field lists still had `date`.
 * Ensure `year` is allowed for create/read/update (and publish if present).
 */
export async function ensureEditorArtworkYearPermission(strapi: Core.Strapi) {
  const editor = await strapi.db.query('admin::role').findOne({
    where: { code: EDITOR_CODE },
  });

  if (!editor) {
    strapi.log.warn('Editor admin role not found; skipping year field permission');
    return;
  }

  const permissions = await strapi.db.query('admin::permission').findMany({
    where: {
      subject: ARTWORK_UID,
      role: editor.id,
    },
  });

  // Fallback: Strapi 5 may store the role link differently
  let rows = permissions;
  if (!rows.length) {
    rows = await strapi.db.connection('admin_permissions as p')
      .join('admin_permissions_role_lnk as l', 'l.permission_id', 'p.id')
      .where('l.role_id', editor.id)
      .andWhere('p.subject', ARTWORK_UID)
      .select('p.id', 'p.action', 'p.properties');
  }

  let updated = 0;
  for (const permission of rows) {
    const action = String(permission.action ?? '');
    if (!action.includes('explorer.')) continue;

    let properties: PermissionProperties = {};
    const raw = permission.properties;
    if (typeof raw === 'string') {
      try {
        properties = JSON.parse(raw);
      } catch {
        properties = {};
      }
    } else if (raw && typeof raw === 'object') {
      properties = { ...(raw as PermissionProperties) };
    }

    // Empty fields array can mean "all fields" in some Strapi versions;
    // only patch when an explicit field list is present.
    if (!Array.isArray(properties.fields) || properties.fields.length === 0) {
      continue;
    }

    if (properties.fields.includes('year')) continue;

    const fields = properties.fields.filter((field) => field !== 'date');
    if (!fields.includes('year')) fields.push('year');

    await strapi.db.query('admin::permission').update({
      where: { id: permission.id },
      data: {
        properties: {
          ...properties,
          fields,
        },
      },
    });
    updated += 1;
  }

  if (updated > 0) {
    strapi.log.info(`Granted Editor access to artwork year on ${updated} permission(s)`);
  }
}
