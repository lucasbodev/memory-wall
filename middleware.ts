import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // For prefixed pathnames, use the following matcher
  // matcher: ['/', '/(fr|nl|de|en)/:path*']

  // For pathnames without a prefix, use the following matcher
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};