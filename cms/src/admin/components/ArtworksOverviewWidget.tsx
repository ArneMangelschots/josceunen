import { useEffect, useState, type CSSProperties } from 'react';
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
  year?: number | string;
  status?: string;
  images?: Array<{ url?: string; formats?: { thumbnail?: { url?: string } } }>;
}

function thumbUrl(images?: ArtworkRow['images']) {
  const image = images?.[0];
  if (!image) return null;
  return image.formats?.thumbnail?.url || image.url || null;
}

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '48px minmax(0, 1fr) auto auto',
  width: '100%',
  alignItems: 'center',
  columnGap: '1rem',
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem',
};

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
            sort: 'year:DESC',
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
      <Box width="100%">
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
    <Box width="100%">
      <Flex direction="column" gap={1} width="100%">
        {artworks.map((artwork) => {
          const editUrl = `${LIST_URL}/${artwork.documentId}`;
          const src = thumbUrl(artwork.images);
          const isPublished = artwork.status === 'published';

          return (
            <div key={artwork.documentId} style={rowStyle}>
              {src ? (
                <img
                  src={src}
                  alt=""
                  style={{
                    width: 48,
                    height: 48,
                    objectFit: 'cover',
                    borderRadius: 4,
                    display: 'block',
                  }}
                />
              ) : (
                <Box
                  background="neutral200"
                  style={{ width: 48, height: 48, borderRadius: 4 }}
                />
              )}

              <Box style={{ minWidth: 0 }}>
                <Box>
                  <Link tag={NavLink} to={editUrl}>
                    <Typography fontWeight="semiBold" ellipsis tag="span">
                      {artwork.title || 'Zonder titel'}
                    </Typography>
                  </Link>
                </Box>
                <Box paddingTop={1}>
                  <Typography variant="pi" textColor="neutral600" tag="span">
                    {artwork.year || '—'}
                  </Typography>
                </Box>
              </Box>

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
            </div>
          );
        })}
      </Flex>

      <Flex justifyContent="space-between" alignItems="center" paddingTop={4} gap={2} width="100%">
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
