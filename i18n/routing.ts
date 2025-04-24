import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['fr', 'en', 'nl', 'de'],

  // Used when no locale matches
  defaultLocale: 'fr',

  localePrefix: 'never',

  // The routing configuration
  pathnames: {
    '/': '/',
    '/soldier': {
      fr: '/soldat',
      en: '/soldier',
      de: '/soldat',
      nl: '/soldaat',
    },
    '/soldier/add': {
      fr: '/soldats/ajouter',
      en: '/soldiers/add',
      de: '/soldaten/hinzufügen',
      nl: '/soldaten/toevoegen',
    },
    '/soldier/[id]/edit': {
      fr: '/soldat/[id]/modifier',
      en: '/soldier/[id]/edit',
      de: '/soldat/[id]/bearbeiten',
      nl: '/soldat/[id]/bewerken',
    },
    '/soldiers': {
      fr: '/soldats',
      en: '/soldiers',
      de: '/soldaten',
      nl: '/soldaten',
    },
    '/counter': {
      fr: '/compteur',
      en: '/counter',
      de: '/zähler',
      nl: '/tellen',
    },
    '/products': {
      fr: '/produits',
      en: '/products',
      de: '/produkte',
      nl: '/producten',
    },
    '/test/[num]': '/test/[num]',
    '/products/add-product': {
      fr: '/produits/ajouter-produit',
      en: '/products/add-product',
      de: '/produkte/produkt-hinzufügen',
      nl: '/producten/voeg-product-toe',
    },
    '/products/add-product/success': {
      fr: '/produits/ajouter-produit/succes',
      en: '/products/add-product/success',
      de: '/produkte/produkt-hinzufügen/erfolg',
      nl: '/producten/voeg-product-toe/succes',
    },
    '/products/edit-product/[id]': {
      fr: '/produits/modifier-produit/[id]',
      en: '/products/edit-product/[id]',
      de: '/produkte/produkt-bearbeiten/[id]',
      nl: '/producten/bewerk-product/[id]',
    },
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);