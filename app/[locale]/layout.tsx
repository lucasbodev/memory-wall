import React from 'react';
import '@/app/globals.css';
import Nav from '@/components/nav/nav.component';
import { Providers } from '@/app/providers';
import '@/styles/animations/gsap-config';
import Footer from '@/components/footer/footer.component';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from 'react-hot-toast';
import localFont from 'next/font/local';
import NavBar from '@/components/nav-bar/nav-bar.component';
import { headers } from 'next/headers';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: 'Memory wall',
    description: 'Mur en mémoire des soldats de la deuxième guerre mondiale.',
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const bigShouldersStencil = localFont({ 
  src: '../fonts/BigShouldersStencil-VariableFont_opsz,wght.ttf', 
  display: 'swap', 
  variable: '--font-big-shoulders-stencil' 
});

const bodoniItalic = localFont({ 
  src: '../fonts/BodoniModa-Italic-VariableFont_opsz,wght.ttf', 
  display: 'swap', 
  variable: '--font-bodoni-italic' 
});

const bodoni = localFont({ 
  src: '../fonts/BodoniModa-VariableFont_opsz,wght.ttf', 
  display: 'swap', 
  variable: '--font-bodoni' 
});

const roboto = localFont({
  src: '../fonts/Roboto-VariableFont_wdth,wght.ttf',
  display: 'swap',
  variable: '--font-roboto'
});

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
    <html lang={locale}>
      <body className={`${bigShouldersStencil.variable} ${bodoniItalic.variable} ${bodoni.variable} ${roboto.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <NavBar/>
            {children}
            <Footer />
            <SpeedInsights />
            <Analytics />
            <Toaster
              position="bottom-center"
              reverseOrder={false}
            />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
