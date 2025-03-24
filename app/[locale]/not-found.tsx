import React from 'react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

const NotFound = async () => {

    const t = await getTranslations('NotFound');

    return (
        <section className='min-h-screen'>
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl font-extrabold lg:text-9xl text-primary">404</h1>
                    <p className="mb-4 text-3xl font-bold md:text-4xl">{t('title')}</p>
                    <p className="mb-4 text-lg font-light">{t('description')}</p>
                    <Link className='btn btn-primary' href={'/'}>{t('goBack')}</Link>
                </div>
            </div>
        </section>
    );
};

export default NotFound;