import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Flex, Typography, Link, Button, Badge } from '@strapi/design-system';
import { Plus, Pencil } from '@strapi/icons';
import { Widget, useFetchClient } from '@strapi/strapi/admin';

const ARTWORK_MODEL = 'api::artwork.artwork';
const LIST_URL = `/content-manager/collection-types/${ARTWORK_MODEL}`;
const CREATE_URL = `${LIST_URL}/create`;

interface ArtworkRow {
  documentId: string;
  title?: string;
  date?: string;
  status?: string;
  images?: Array<{ url?: string; formats?: { thumbnail?: { url?: string } } }>;
}

function formatDate(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('nl-BE', {
    year: 'numeric',
    month: 'short',
  });
}

function thumbUrl(images?: ArtworkRow['images']) {
  const image = images?.[0];
  if (!image) return null;
  return image.formats?.thumbnail?.url || image.url || null;
}

const ArtworksOverviewWidget = () => {
  const { get } = useFetchClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [artworks, setArtworks] = useState<ArtworkRow[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await get(`/content-manager/collection-types/${ARTWORK_MODEL}`, {
          params: {
            page: 1,
            pageSize: 8,
            sort: 'date:DESC',
            populate: 'images',
          },
        });

        const rows = (data?.results ?? data?.data ?? []) as ArtworkRow[];
        setArtworks(rows);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [get]);

  if (loading) {
    return <Widget.Loading>Kunstwerken laden…</Widget.Loading>;
  }

  if (error) {
    return <Widget.Error>Kunstwerken konden niet geladen worden.</Widget.Error>;
  }

  if (!artworks.length) {
    return (
      <Box>
        <Widget.NoData>Nog geen kunstwerken toegevoegd.</Widget.NoData>
        <Box paddingTop={4}>
          <Button tag={NavLink} to={CREATE_URL} startIcon={<Plus />} variant="secondary" size="S">
            Eerste kunstwerk toevoegen
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Flex direction="column" gap={3}>
        {artworks.map((artwork) => {
          const editUrl = `${LIST_URL}/${artwork.documentId}`;
          const src = thumbUrl(artwork.images);
          const isPublished = artwork.status === 'published';

          return (
            <Flex
              key={artwork.documentId}
              justifyContent="space-between"
              alignItems="center"
              gap={2}
            >
              <Flex alignItems="center" gap={3} style={{ minWidth: 0, flex: 1 }}>
                {src ? (
                  <img
                    src={src}
                    alt=""
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: 'cover',
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Box
                    background="neutral200"
                    style={{ width: 48, height: 48, borderRadius: 4, flexShrink: 0 }}
                  />
                )}
                <Box style={{ minWidth: 0 }}>
                  <Link tag={NavLink} to={editUrl}>
                    <Typography fontWeight="semiBold" ellipsis>
                      {artwork.title || 'Zonder titel'}
                    </Typography>
                  </Link>
                  <Typography variant="pi" textColor="neutral600">
                    {formatDate(artwork.date)}
                  </Typography>
                </Box>
              </Flex>
              <Flex alignItems="center" gap={2} style={{ flexShrink: 0 }}>
                <Badge variant={isPublished ? 'success' : 'secondary'}>
                  {isPublished ? 'Gepubliceerd' : 'Concept'}
                </Badge>
                <Button
                  tag={NavLink}
                  to={editUrl}
                  variant="tertiary"
                  size="S"
                  aria-label={`Bewerk ${artwork.title || 'kunstwerk'}`}
                >
                  <Pencil />
                </Button>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" paddingTop={4} gap={2}>
        <Button tag={NavLink} to={CREATE_URL} startIcon={<Plus />} size="S">
          Nieuw kunstwerk
        </Button>
        <Link tag={NavLink} to={LIST_URL}>
          Alle kunstwerken
        </Link>
      </Flex>
    </Box>
  );
};

export default ArtworksOverviewWidget;
