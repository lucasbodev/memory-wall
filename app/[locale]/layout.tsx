import React from 'react';
import '@/app/globals.css';
import Nav from '@/components/nav/nav.component';
import { Providers } from '@/app/providers';
import '@/styles/animations/gsap-config';
import Footer from '@/components/footer/footer.component';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from 'geist/font/sans';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from 'react-hot-toast';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description')
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const LocaleLayout = async (
  { children, params }: { children: React.ReactNode; params: Promise<{ locale: string }>; }
) => {

  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} data-theme="dark">
      <body className={GeistSans.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Nav />
            {children}
            <Footer />
            <SpeedInsights />
            <Analytics />
            <Toaster
              position="bottom-left"
              reverseOrder={false}
            />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
