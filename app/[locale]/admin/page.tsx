'use client';

import React, { useEffect } from 'react';
import styles from '@/app/[locale]/admin/admin.module.css';
import btnStyles from '@/components/button/button.module.css';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Toast from '@/components/toast/toast.component';
import { useUser } from '@auth0/nextjs-auth0/client';
import Loading from '@/components/loading/loading.component';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const Admin = () => {

  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const { user, isLoading } = useUser();
  const t = useTranslations('Admin');

  useEffect(() => {
    if (error === 'access_denied') {
      toast.custom(<Toast message={t('accessDenied')} type="error" />);
    }
  }, [error]);

  return (
    <main>
      <div className={styles.adminPanel}>
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={116}
          height={109}
          className={styles.logo}
          priority
        />
        <p className={`${styles.text}`}>
          {t('adminPanel')}
        </p>
        {
          isLoading ?
            <Loading /> :
            (
              user ?
                <a href="/api/auth/logout" className={`${btnStyles.button} ${btnStyles.outline}`}>{t('logout')}</a>
                :
                <a href={`/api/auth/login?prompt=login&max_age=0&returnTo=/admin`} className={`${btnStyles.button} ${btnStyles.primary}`}>{t('login')}</a>
            )
        }
      </div>
    </main>
  );
}
export default Admin;