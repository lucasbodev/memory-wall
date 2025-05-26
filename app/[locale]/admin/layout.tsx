'use client';

import React from 'react';
import styles from '@/app/[locale]/admin/admin.module.css';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <main>
      <div className={styles.adminPanel}>
        {children}
      </div>
    </main>
  );
}
export default AdminLayout;