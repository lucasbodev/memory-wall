import React from 'react';
import NavLink from '../nav/nav-link.component';
import { getTranslations } from 'next-intl/server';
import styles from '@/components/footer/footer.module.css';

const Footer = async () => {

    const t = await getTranslations('Footer');

    return (
        <footer className={styles.footer}>
            <p>{t('footerTitle')}</p>
            <p className={styles.footerSubtext}>
                {t('footerSubText')}
            </p>
            <p>{t('contactDev')}</p>
        </footer>
    );
};

export default Footer;
