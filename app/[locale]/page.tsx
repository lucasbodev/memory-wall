import React from 'react';
import styles from '@/app/[locale]/home.module.css';
import HomeAnimations from '@/app/[locale]/home.animations';
import { getTranslations } from 'next-intl/server';

const Home = async () => {

  const t = await getTranslations('Home');

  return (
    <main>
      <HomeAnimations>
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-screen-md flex flex-col gap-8 pb-16">
              <div className={styles.line} id='topLine' />
              <h1 className="text-6xl font-bold opacity-0 translate-y-3" id='homeTitle'>{t('title')}</h1>
              <div className={styles.reverse__line} id='bottomLine' />
            </div>
          </div>
        </div>
      </HomeAnimations>
    </main>
  );
};

export default Home;
