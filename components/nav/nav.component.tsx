import React from 'react';
import NavLink from './nav-link.component';
import ResponsiveNavLayout from './responsive-nav-layout.component';
import { getTranslations } from 'next-intl/server';

const Nav = async () => {

    const t = await getTranslations('Nav');

    return (
        <ResponsiveNavLayout>
            <li><NavLink href="/" name={t('homeLink')} /></li>
            <li><NavLink href="/counter" name={t('countLink')} /></li>
            <li><NavLink href="/products" name={t('productsLink')} /></li>
        </ResponsiveNavLayout>
    );
};

export default Nav;
