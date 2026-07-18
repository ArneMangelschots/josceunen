import fs from 'fs';
import path from 'path';
import type { Core } from '@strapi/strapi';

const ASSETS_DIR = path.resolve(process.cwd(), '..', 'assets');

function blockParagraph(text: string) {
  return [
    {
      type: 'paragraph' as const,
      children: [{ type: 'text' as const, text }],
    },
  ];
}

async function uploadImage(
  strapi: Core.Strapi,
  filename: string,
  alt: string
): Promise<number | null> {
  const filePath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    strapi.log.warn(`Seed image not found: ${filePath}`);
    return null;
  }

  const stat = fs.statSync(filePath);
  const uploaded = await strapi.plugin('upload').service('upload').upload({
    files: {
      filepath: filePath,
      originalFilename: filename,
      mimetype: 'image/jpeg',
      size: stat.size,
    },
    data: {
      fileInfo: {
        name: filename,
        alternativeText: alt,
        caption: alt,
      },
    },
  });

  const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
  return file?.id ?? null;
}

async function attachSeedImages(strapi: Core.Strapi) {
  const filenames = ['jc-kw-1.jpg', 'jc-kw-2.jpg', 'jc-kw-3.jpg', 'jc-kw-4.jpg'];
  const imageIds = await Promise.all(
    filenames.map((name, i) => uploadImage(strapi, name, `Kunstwerk ${i + 1}`))
  );

  const artworks = await strapi.documents('api::artwork.artwork').findMany({
    sort: { date: 'desc' },
  });

  for (let i = 0; i < artworks.length; i++) {
    const imageId = imageIds[i];
    if (!imageId) continue;
    await strapi.documents('api::artwork.artwork').update({
      documentId: artworks[i].documentId,
      data: { images: [imageId] },
      status: 'published',
    });
  }

  const about = await strapi.documents('api::about.about').findFirst({});
  if (about && imageIds[0]) {
    await strapi.documents('api::about.about').update({
      documentId: about.documentId,
      data: { portrait: imageIds[0] },
      status: 'published',
    });
  }

  strapi.log.info('Image attachment completed');
}

export async function seedContent(strapi: Core.Strapi) {
  const artworkCount = await strapi.documents('api::artwork.artwork').count({});
  if (artworkCount > 0) {
    const withImages = await strapi.documents('api::artwork.artwork').findMany({
      populate: ['images'],
      limit: 1,
    });
    const hasMedia = withImages.some(
      (a) => Array.isArray(a.images) && a.images.length > 0
    );
    if (hasMedia) {
      strapi.log.info('Seed skipped: artworks already exist');
      return;
    }
    strapi.log.info('Re-seeding images for existing artworks…');
    await attachSeedImages(strapi);
    return;
  }

  strapi.log.info('Seeding Dutch portfolio content…');

  const techniqueOlie = await strapi.documents('api::technique.technique').create({
    data: { name: 'Olieverf', slug: 'olieverf' },
    status: 'published',
  });
  const techniqueAcryl = await strapi.documents('api::technique.technique').create({
    data: { name: 'Acryl', slug: 'acryl' },
    status: 'published',
  });
  const techniqueMixed = await strapi.documents('api::technique.technique').create({
    data: { name: 'Gemengde techniek', slug: 'gemengde-techniek' },
    status: 'published',
  });

  const themeLandschap = await strapi.documents('api::theme.theme').create({
    data: { name: 'Landschap', slug: 'landschap' },
    status: 'published',
  });
  const themePortret = await strapi.documents('api::theme.theme').create({
    data: { name: 'Portret', slug: 'portret' },
    status: 'published',
  });
  const themeStilleven = await strapi.documents('api::theme.theme').create({
    data: { name: 'Stilleven', slug: 'stilleven' },
    status: 'published',
  });

  const imageIds = await Promise.all([
    uploadImage(strapi, 'jc-kw-1.jpg', 'Kunstwerk 1'),
    uploadImage(strapi, 'jc-kw-2.jpg', 'Kunstwerk 2'),
    uploadImage(strapi, 'jc-kw-3.jpg', 'Kunstwerk 3'),
    uploadImage(strapi, 'jc-kw-4.jpg', 'Kunstwerk 4'),
  ]);

  const validImages = imageIds.filter((id): id is number => id !== null);

  const artworks = [
    {
      title: 'Licht over het veld',
      slug: 'licht-over-het-veld',
      date: '2024-03-15',
      info: blockParagraph(
        'Een landschap waarin licht en kleur de hoofdrol spelen. Geschilderd in olieverf met aandacht voor atmosfeer en textuur.'
      ),
      techniques: { connect: [techniqueOlie.documentId] },
      themes: { connect: [themeLandschap.documentId] },
      images: validImages[0] ? [validImages[0]] : [],
    },
    {
      title: 'Stille reflectie',
      slug: 'stille-reflectie',
      date: '2023-11-02',
      info: blockParagraph(
        'Een ingetogen stilleven met zachte schaduwen en een warm kleurenpalet.'
      ),
      techniques: { connect: [techniqueAcryl.documentId] },
      themes: { connect: [themeStilleven.documentId] },
      images: validImages[1] ? [validImages[1]] : [],
    },
    {
      title: 'Gezicht in verleden tijd',
      slug: 'gezicht-in-verleden-tijd',
      date: '2025-01-20',
      info: blockParagraph(
        'Portretstudie met nadruk op expressie en handgevoerde penseelstreken.'
      ),
      techniques: { connect: [techniqueMixed.documentId] },
      themes: { connect: [themePortret.documentId] },
      images: validImages[2] ? [validImages[2]] : [],
    },
    {
      title: 'Horizonlijnen',
      slug: 'horizonlijnen',
      date: '2024-08-09',
      info: blockParagraph(
        'Abstract landschap waarin horizon en lucht samensmelten in gelaagde verf.'
      ),
      techniques: { connect: [techniqueOlie.documentId, techniqueMixed.documentId] },
      themes: { connect: [themeLandschap.documentId] },
      images: validImages[3] ? [validImages[3]] : [],
    },
  ];

  for (const artwork of artworks) {
    await strapi.documents('api::artwork.artwork').create({
      data: artwork,
      status: 'published',
    });
  }

  const portraitId = validImages[0] ?? null;
  await strapi.documents('api::about.about').create({
    data: {
      title: 'Over Jos Ceunen',
      body: [
        {
          type: 'heading' as const,
          level: 2,
          children: [{ type: 'text' as const, text: 'De kunst van Jos Ceunen' }],
        },
        {
          type: 'paragraph' as const,
          children: [
            {
              type: 'text' as const,
              text: 'Jos Ceunen is een kunstenaar die werkt met olieverf, acryl en gemengde technieken. Zijn werk beweegt tussen landschap, portret en stilleven, steeds met aandacht voor licht, kleur en materie.',
            },
          ],
        },
        {
          type: 'paragraph' as const,
          children: [
            {
              type: 'text' as const,
              text: 'Deze website toont een selectie van recente werken. Elk werk vertelt een eigen verhaal en nodigt uit om langer te kijken.',
            },
          ],
        },
      ],
      portrait: portraitId,
    },
    status: 'published',
  });

  strapi.log.info('Seed completed');
}
