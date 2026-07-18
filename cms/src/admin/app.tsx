import type { StrapiApp } from '@strapi/strapi/admin';
import { Plus, Images } from '@strapi/icons';

export default {
  config: {
    locales: ['nl'],
    tutorials: false,
    notifications: { releases: false },
    translations: {
      nl: {
        'content-manager.containers.ListPage.search.placeholder': 'Zoeken…',
        'content-manager.containers.Edit.pluginHeader.title.new': 'Nieuw kunstwerk',
        'content-manager.containers.Edit.pluginHeader.title': 'Kunstwerk bewerken',
        'content-manager.success.record.publish': 'Kunstwerk gepubliceerd',
        'content-manager.success.record.save': 'Kunstwerk opgeslagen',
        'app.components.LeftMenu.navbrand.title': 'Jos Ceunen',
        'app.components.LeftMenu.navbrand.workplace': 'Beheer',
        'josceunen.widget.artworks.title': 'Kunstwerken',
        'josceunen.widget.artworks.create': 'Nieuw kunstwerk',
      },
    },
  },
  register(app: StrapiApp) {
    if ('widgets' in app) {
      app.widgets.register({
        id: 'josceunen-artworks-overview',
        icon: Images,
        title: {
          id: 'josceunen.widget.artworks.title',
          defaultMessage: 'Kunstwerken',
        },
        component: async () => {
          const module = await import('./components/ArtworksOverviewWidget');
          return module.default;
        },
        link: {
          label: {
            id: 'josceunen.widget.artworks.create',
            defaultMessage: 'Nieuw kunstwerk',
          },
          href: '/content-manager/collection-types/api::artwork.artwork/create',
        },
        permissions: [
          {
            action: 'plugin::content-manager.explorer.read',
            subject: 'api::artwork.artwork',
          },
        ],
      });
    }

    app.addMenuLink({
      to: '/content-manager/collection-types/api::artwork.artwork/create',
      icon: Plus,
      intlLabel: {
        id: 'josceunen.menu.new-artwork',
        defaultMessage: 'Nieuw kunstwerk',
      },
      position: 0,
      permissions: [
        {
          action: 'plugin::content-manager.explorer.create',
          subject: 'api::artwork.artwork',
        },
      ],
    });

    app.addMenuLink({
      to: '/content-manager/collection-types/api::artwork.artwork',
      icon: Images,
      intlLabel: {
        id: 'josceunen.menu.artworks',
        defaultMessage: 'Kunstwerken',
      },
      position: 1,
      permissions: [
        {
          action: 'plugin::content-manager.explorer.read',
          subject: 'api::artwork.artwork',
        },
      ],
    });
  },
  bootstrap() {},
};
