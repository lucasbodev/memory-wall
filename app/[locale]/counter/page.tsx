import React from 'react';
import CounterViewer from '@/components/counter/counter-viewer.component';
import CounterUpdater from '@/components/counter/counter-updater.component';
import styles from '@/app/[locale]/counter/counter.module.css';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Nav' });

  return {
    title: t('countLink')
  };
}

const Counter = async () => {

  const t = await getTranslations('Counter');

  return (
    <section className="bg-base-200 min-h-screen p-8 w-full place-items-center">
      <div className="w-fit">
        <h1 className={styles.title}>{t('title')}</h1>
        <div className="w-full stats stats-vertical shadow">
          <CounterViewer />
          <div className="stat">
            <div className="stat-actions">
              <CounterUpdater />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter;
