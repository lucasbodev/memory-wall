'use client';

import React from 'react';
import { useStore } from '@/store/store';
import { useTranslations } from 'next-intl';

const CountViewer = () => {

  const count = useStore(state => state.count);
  const t = useTranslations('CounterViewer');

  return (
    <div className="stat">
      <div className="stat-figure text-secondary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-8 w-8 stroke-current">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      </div>
      <div className="stat-title">{t('statTitle')}</div>
      <div className="stat-value text-secondary">{t('counterViewer', { count })}</div>
      <div className="stat-desc">{t('statDescription')}</div>
    </div>
  );
};

export default CountViewer;
