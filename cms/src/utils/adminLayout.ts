import type { Core } from '@strapi/strapi';

const LAYOUT_VERSION = 2;
const VERSION_KEY = 'josceunen.admin_layout_version';

type CmConfig = {
  settings: Record<string, unknown>;
  metadatas: Record<string, { edit?: Record<string, unknown>; list?: Record<string, unknown> }>;
  layouts: {
    list: string[];
    edit: Array<Array<{ name: string; size: number }>>;
  };
};

function setFieldMeta(
  config: CmConfig,
  field: string,
  meta: {
    editLabel?: string;
    listLabel?: string;
    description?: string;
    visible?: boolean;
    editable?: boolean;
    listVisible?: boolean;
  }
) {
  if (!config.metadatas[field]) {
    config.metadatas[field] = { edit: {}, list: {} };
  }

  config.metadatas[field].edit = {
    ...config.metadatas[field].edit,
    label: meta.editLabel ?? config.metadatas[field].edit?.label,
    description: meta.description ?? '',
    visible: meta.visible ?? true,
    editable: meta.editable ?? true,
  };

  if (meta.listLabel !== undefined || meta.listVisible !== undefined) {
    config.metadatas[field].list = {
      ...config.metadatas[field].list,
      label: meta.listLabel ?? config.metadatas[field].list?.label,
      searchable: config.metadatas[field].list?.searchable ?? true,
      sortable: config.metadatas[field].list?.sortable ?? true,
    };
  }
}

async function loadCmConfig(strapi: Core.Strapi, uid: string): Promise<{ id?: number; config: CmConfig }> {
  const key = `plugin_content_manager_configuration_content_types::${uid}`;
  const row = await strapi.db.query('strapi::core-store').findOne({ where: { key } });

  if (row?.value) {
    return { id: row.id, config: JSON.parse(row.value as string) };
  }

  return {
    config: {
      settings: {},
      metadatas: {},
      layouts: { list: [], edit: [] },
    },
  };
}

async function saveCmConfig(
  strapi: Core.Strapi,
  uid: string,
  config: CmConfig,
  existingId?: number
) {
  const key = `plugin_content_manager_configuration_content_types::${uid}`;
  const value = JSON.stringify(config);

  if (existingId) {
    await strapi.db.query('strapi::core-store').update({
      where: { id: existingId },
      data: { value },
    });
    return;
  }

  await strapi.db.query('strapi::core-store').create({
    data: {
      key,
      value,
      type: 'object',
      environment: null,
      tag: null,
    },
  });
}

async function configureArtworkAdmin(strapi: Core.Strapi) {
  const { id, config } = await loadCmConfig(strapi, 'api::artwork.artwork');

  config.settings = {
    ...config.settings,
    bulkable: true,
    filterable: true,
    searchable: true,
    pageSize: 25,
    mainField: 'title',
    defaultSortBy: 'date',
    defaultSortOrder: 'DESC',
    relationOpenMode: 'modal',
  };

  config.layouts.edit = [
    [{ name: 'title', size: 8 }, { name: 'date', size: 4 }],
    [{ name: 'slug', size: 12 }],
    [{ name: 'images', size: 12 }],
    [{ name: 'techniques', size: 6 }, { name: 'themes', size: 6 }],
    [{ name: 'info', size: 12 }],
  ];

  config.layouts.list = ['title', 'date', 'images'];

  setFieldMeta(config, 'title', {
    editLabel: 'Titel',
    listLabel: 'Titel',
    description: 'Naam van het kunstwerk zoals die op de website verschijnt.',
  });
  setFieldMeta(config, 'date', {
    editLabel: 'Datum',
    listLabel: 'Datum',
    description: 'Jaar of datum van het werk. Gebruikt voor sortering en het jaarfilter.',
  });
  setFieldMeta(config, 'images', {
    editLabel: 'Afbeeldingen',
    listLabel: 'Afbeeldingen',
    description: 'Upload één of meerdere foto’s. De eerste afbeelding wordt de hoofdafbeelding.',
  });
  setFieldMeta(config, 'techniques', {
    editLabel: 'Technieken',
    description: 'Kies de gebruikte techniek(en), bijvoorbeeld olieverf of acryl.',
  });
  setFieldMeta(config, 'themes', {
    editLabel: 'Thema’s',
    description: 'Kies passende thema’s, bijvoorbeeld landschap of portret.',
  });
  setFieldMeta(config, 'info', {
    editLabel: 'Beschrijving',
    description: 'Optionele tekst op de detailpagina van het kunstwerk.',
  });
  setFieldMeta(config, 'slug', {
    editLabel: 'URL-naam',
    description: 'Wordt automatisch vanuit de titel aangemaakt. Nodig om te kunnen publiceren.',
    visible: true,
    editable: true,
  });

  await saveCmConfig(strapi, 'api::artwork.artwork', config, id);
}

async function configureTagAdmin(
  strapi: Core.Strapi,
  uid: 'api::technique.technique' | 'api::theme.theme',
  labels: { singular: string; plural: string; nameDesc: string }
) {
  const { id, config } = await loadCmConfig(strapi, uid);

  config.settings = {
    ...config.settings,
    mainField: 'name',
    defaultSortBy: 'name',
    defaultSortOrder: 'ASC',
    pageSize: 50,
  };

  config.layouts.edit = [[{ name: 'name', size: 12 }]];
  config.layouts.list = ['name'];

  setFieldMeta(config, 'name', {
    editLabel: 'Naam',
    listLabel: 'Naam',
    description: labels.nameDesc,
  });
  setFieldMeta(config, 'slug', {
    visible: false,
    editable: false,
  });
  setFieldMeta(config, 'artworks', {
    visible: false,
    editable: false,
  });

  await saveCmConfig(strapi, uid, config, id);
}

async function configureAboutAdmin(strapi: Core.Strapi) {
  const { id, config } = await loadCmConfig(strapi, 'api::about.about');

  config.layouts.edit = [
    [{ name: 'title', size: 12 }],
    [{ name: 'portrait', size: 6 }],
    [{ name: 'body', size: 12 }],
  ];

  setFieldMeta(config, 'title', {
    editLabel: 'Titel',
    description: 'Kop bovenaan de Over-pagina.',
  });
  setFieldMeta(config, 'portrait', {
    editLabel: 'Portretfoto',
    description: 'Optionele foto naast de tekst op de Over-pagina.',
  });
  setFieldMeta(config, 'body', {
    editLabel: 'Tekst',
    description: 'Biografie of introductietekst over de kunstenaar.',
  });

  await saveCmConfig(strapi, 'api::about.about', config, id);
}

export async function configureAdminExperience(strapi: Core.Strapi) {
  const versionRow = await strapi.db.query('strapi::core-store').findOne({
    where: { key: VERSION_KEY },
  });

  const currentVersion = versionRow ? Number(JSON.parse(versionRow.value as string)) : 0;
  if (currentVersion >= LAYOUT_VERSION) return;

  await configureArtworkAdmin(strapi);
  await configureTagAdmin(strapi, 'api::technique.technique', {
    singular: 'Techniek',
    plural: 'Technieken',
    nameDesc: 'Naam van de techniek, bijvoorbeeld “Olieverf”.',
  });
  await configureTagAdmin(strapi, 'api::theme.theme', {
    singular: 'Thema',
    plural: "Thema's",
    nameDesc: 'Naam van het thema, bijvoorbeeld “Landschap”.',
  });
  await configureAboutAdmin(strapi);

  const versionValue = String(LAYOUT_VERSION);
  if (versionRow) {
    await strapi.db.query('strapi::core-store').update({
      where: { id: versionRow.id },
      data: { value: versionValue },
    });
  } else {
    await strapi.db.query('strapi::core-store').create({
      data: {
        key: VERSION_KEY,
        value: versionValue,
        type: 'string',
        environment: null,
        tag: null,
      },
    });
  }

  strapi.log.info('Admin layout configured for artwork-focused workflow');
}
