import React from 'react';
import Loading from '@/components/loading/loading.component';
import styles from '@/app/[locale]/soldier/[id]/soldier.module.css';

const SoldierLoading = () => {
    return (
        <div className={styles.loadingContainer}>
            <Loading />
        </div>
    )
};

export default SoldierLoading;