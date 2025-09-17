import React from 'react';
import styles from '@/app/[locale]/home.module.css';
import { getTranslations } from 'next-intl/server';
import Heading, { HeadingTypes } from '@/components/heading/heading.component';
import Button, { ButtonTypes } from '@/components/button/button.component';
import Image from 'next/image';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from '@/i18n/routing';

const Home = async () => {

   const session = await getSession();

   if (!session) {
       redirect({ href: '/admin' } as any);
   }

   const t = await getTranslations('Home');

  return (
    <main>
      <div className={styles.onboarding}>
        <Image
          src="/images/onboarding.png"
          alt="Logo"
          width={1080}
          height={900}
          className={styles.background}
          priority
        />
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={116}
          height={109}
          className={styles.logo}
          priority
        />
        <div className={styles.onboardingSection}>
          <Heading type={HeadingTypes.H1} text="MEMORY WALL" />
          <p className={`${styles.text} ${styles.subtitle}`}>{t('description')}</p>
        </div>
        <div className={styles.onboardingSection}>
          <p className={`${styles.text} ${styles.onboardingText}`}>
            {t('callToAction')}
          </p>
          <Button type={ButtonTypes.PRIMARY} text={t('onBoardingBtn')} href="/soldiers" />
        </div>
      </div>
    </main>
  );
};

export default Home;
