import React from 'react';
import NavLink from '../nav/nav-link.component';
import { getTranslations } from 'next-intl/server';
import styles from '@/components/footer/footer.module.css';
import Icon, { IconSizes } from '../icon/icon.component';

const Footer = async () => {

    const t = await getTranslations('Footer');

    return (
        <footer className={styles.footer}>
            
            <p>{t('footerTitle')}</p>

            <p className={styles.footerSubtext}>
                {t('footerSubText')}
            </p>

            <div className={styles.credits}>
                <p>{t('credits')} <span className={styles.name}>La Taverne Au Carré</span></p>
                <Icon src='/images/logo.svg' size={IconSizes.MEDIUM} />
            </div>

            <p>{t('contactDev')}</p>
            
        </footer>
    );
};

export default Footer;
