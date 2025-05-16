import Loading from '@/components/loading/loading.component';
import React from 'react';
import styles from "@/app/[locale]/soldiers/soldiers.module.css"

const AdminLoading = () => {
    return (
        <div className={styles.adminPanel}>
            <Loading />
        </div>
    )
};

export default AdminLoading;