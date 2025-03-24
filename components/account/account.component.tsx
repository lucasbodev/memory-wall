'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from '@/i18n/routing';

const Account = () => {

  const t = useTranslations('Account');

  const { user } = useUser();

  const pathname = usePathname();

  return (
    user
      ?
      <a href="/api/auth/logout" className="btn">{t('logout')}</a>
      :
      <a href={`/api/auth/login?returnTo=${pathname}`} className="btn">{t('login')}</a>
  );
};

export default Account;
