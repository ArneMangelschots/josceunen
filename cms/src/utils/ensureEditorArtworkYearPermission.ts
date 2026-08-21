import type { Core } from '@strapi/strapi';

const EDITOR_CODE = 'strapi-editor';

type PermissionProperties = {
  fields?: string[];
  [key: string]: unknown;
};

async function ensureEditorFields(
  strapi: Core.Strapi,
  subject: string,
  fieldsToAdd: string[],
  fieldsToRemove: string[] = []
) {
  const editor = await strapi.db.query('admin::role').findOne({
    where: { code: EDITOR_CODE },
  });
  if (!editor) return 0;

  let rows = await strapi.db.query('admin::permission').findMany({
    where: {
      subject,
      role: editor.id,
    },
  });

  if (!rows.length) {
    rows = await strapi.db.connection('admin_permissions as p')
      .join('admin_permissions_role_lnk as l', 'l.permission_id', 'p.id')
      .where('l.role_id', editor.id)
      .andWhere('p.subject', subject)
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

    if (!Array.isArray(properties.fields) || properties.fields.length === 0) {
      continue;
    }

    let fields = properties.fields.filter((field) => !fieldsToRemove.includes(field));
    let changed = fields.length !== properties.fields.length;
    for (const field of fieldsToAdd) {
      if (!fields.includes(field)) {
        fields.push(field);
        changed = true;
      }
    }
    if (!changed) continue;

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

  return updated;
}

/**
 * When `year` replaced/added on artworks, Editor RBAC field lists still had `date`.
 * Ensure `year` is allowed for create/read/update (and publish if present).
 */
export async function ensureEditorArtworkYearPermission(strapi: Core.Strapi) {
  const updated = await ensureEditorFields(
    strapi,
    'api::artwork.artwork',
    ['year'],
    ['date']
  );
  if (updated > 0) {
    strapi.log.info(`Granted Editor access to artwork year on ${updated} permission(s)`);
  }

  const techniqueUpdated = await ensureEditorFields(
    strapi,
    'api::technique.technique',
    ['slug']
  );
  if (techniqueUpdated > 0) {
    strapi.log.info(
      `Granted Editor access to technique slug on ${techniqueUpdated} permission(s)`
    );
  }

  const themeUpdated = await ensureEditorFields(strapi, 'api::theme.theme', ['slug']);
  if (themeUpdated > 0) {
    strapi.log.info(`Granted Editor access to theme slug on ${themeUpdated} permission(s)`);
  }
}
