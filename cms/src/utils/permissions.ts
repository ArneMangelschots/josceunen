import type { Core } from '@strapi/strapi';

const PUBLIC_ACTIONS: Record<string, string[]> = {
  'api::technique.technique': ['find', 'findOne'],
  'api::theme.theme': ['find', 'findOne'],
  'api::artwork.artwork': ['find', 'findOne'],
  'api::about.about': ['find'],
};

export async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('Public role not found; skipping permission setup');
    return;
  }

  for (const [uid, actions] of Object.entries(PUBLIC_ACTIONS)) {
    for (const action of actions) {
      const actionName = `${uid}.${action}`;
      const existing = await strapi.db
        .query('plugin::users-permissions.permission')
        .findOne({
          where: { action: actionName, role: publicRole.id },
        });

      if (!existing) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action: actionName, role: publicRole.id, enabled: true },
        });
      } else if (!existing.enabled) {
        await strapi.db.query('plugin::users-permissions.permission').update({
          where: { id: existing.id },
          data: { enabled: true },
        });
      }
    }
  }

  strapi.log.info('Public API permissions configured');
}
