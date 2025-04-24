import React from 'react';
import styles from '@/components/loading/loading.module.css';

const Loading = () => {
    return (
        <div className={styles.loading}>
            <svg width="60" height="30" viewBox="0 0 100 50"><line x1="10" y1="25" x2="10" y2="25" stroke="#F5BA00" strokeWidth="4" strokeLinecap="round"><animate attributeName="y1" values="25;10;25" dur="1s" begin="0s" repeatCount="indefinite"></animate><animate attributeName="y2" values="25;40;25" dur="1s" begin="0s" repeatCount="indefinite"></animate></line><line x1="30" y1="25" x2="30" y2="25" stroke="#F5BA00" strokeWidth="4" strokeLinecap="round"><animate attributeName="y1" values="25;10;25" dur="1s" begin="0.2s" repeatCount="indefinite"></animate><animate attributeName="y2" values="25;40;25" dur="1s" begin="0.2s" repeatCount="indefinite"></animate></line><line x1="50" y1="25" x2="50" y2="25" stroke="#F5BA00" strokeWidth="4" strokeLinecap="round"><animate attributeName="y1" values="25;10;25" dur="1s" begin="0.4s" repeatCount="indefinite"></animate><animate attributeName="y2" values="25;40;25" dur="1s" begin="0.4s" repeatCount="indefinite"></animate></line><line x1="70" y1="25" x2="70" y2="25" stroke="#F5BA00" strokeWidth="4" strokeLinecap="round"><animate attributeName="y1" values="25;10;25" dur="1s" begin="0.6000000000000001s" repeatCount="indefinite"></animate><animate attributeName="y2" values="25;40;25" dur="1s" begin="0.6000000000000001s" repeatCount="indefinite"></animate></line><line x1="90" y1="25" x2="90" y2="25" stroke="#F5BA00" strokeWidth="4" strokeLinecap="round"><animate attributeName="y1" values="25;10;25" dur="1s" begin="0.8s" repeatCount="indefinite"></animate><animate attributeName="y2" values="25;40;25" dur="1s" begin="0.8s" repeatCount="indefinite"></animate></line></svg>
        </div>
)};

export default Loading;