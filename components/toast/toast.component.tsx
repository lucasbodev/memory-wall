import React from 'react';
import styles from '@/components/toast/toast.module.css';
import Icon, { IconSizes } from '@/components/icon/icon.component';

const Toast = ({ message, type }: { message: string, type: string }) => {

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            {
                type === 'error' ?
                <Icon src='/icons/error.svg' size={IconSizes.MEDIUM} /> :
                <Icon src='/icons/success.svg' size={IconSizes.MEDIUM} />
            }
            <span>{message}</span>
        </div>
    );
};

export default Toast;