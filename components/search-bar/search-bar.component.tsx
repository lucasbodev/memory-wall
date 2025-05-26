'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/components/search-bar/search-bar.module.css';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/routing';


const SearchBar = () => {

    const t = useTranslations('SearchBar');
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}` as any);
    }

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder={t('search')}
                className={styles.searchInput}
                defaultValue={searchParams.get('query')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Image
                src="/icons/search.svg"
                alt="Search Icon"
                width={24}
                height={24}
                className={styles.searchIcon}
            />
        </div>
    );
}

export default SearchBar;