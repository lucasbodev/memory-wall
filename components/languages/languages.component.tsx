'use client';

import React, { useState } from 'react';
import styles from '@/components/languages/languages.module.css';
import { Link, routing, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from "next/image";

enum Labels {
    fr = "Français (FR)",
    en = "English (EN)",
    nl = "Nederlands (NL)",
    de = "Deutsch (DE)"
}

const Languages = () => {

    const currentLocale = useLocale();

    const pathname = usePathname();

    const params = useParams();

    const [open, setOpen] = useState(false);

    return (
        <>
            <button className={styles.languageBtn} onClick={() => open ? setOpen(false) : setOpen(true)}>
                <Image
                    src={`/icons/${currentLocale}-flag.svg`}
                    alt="Language icon"
                    width={24}
                    height={24}
                    className={styles.flag}
                />
                <Image
                    src="/icons/arrow-down.svg"
                    alt="Dropdown icon"
                    width={16}
                    height={16}
                    className={styles.flag}
                />
            </button>
            <ul className={`${styles.languageDropdown} ${open && styles.open}`}>
                {routing.locales.map((locale, index) => (
                    <>
                        <Link key={locale} className={styles.languageItem} locale={locale} href={{
                            pathname: pathname as any,
                            params: params as any,
                        }} onClick={() => setOpen(false)}>
                            <Image
                                src={`/icons/${locale}-flag.svg`}
                                alt="Language icon"
                                width={24}
                                height={24}
                                className={styles.flag}
                            />
                            {Labels[locale]}
                        </Link>
                        {
                            index < routing.locales.length - 1 &&
                            <div key={index} className={styles.divider}></div>
                        }
                    </>
                ))}

            </ul>
            <div className={`${styles.overlay} ${open && styles.open}`} onClick={() => setOpen(false)}></div>
        </>
    );
};

export default Languages;
