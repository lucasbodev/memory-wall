'use client';

import React, { startTransition } from 'react';
// import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import Toast from '@/components/toast/toast.component';
import styles from '@/components/error/error.module.css';
import Button, { ButtonTypes } from '@/components/button/button.component';

const Error = ({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) => {

    // const t = useTranslations('Error');
    const router = useRouter();

    return (
        <div className={styles.error}>
            <Toast message={error.message} type='error' />
            <Button type={ButtonTypes.OUTLINE} text='Réessayer' onClick={() => {
                router.refresh();
                startTransition(reset);
            }}/>
        </div>
    );
};

export default Error;