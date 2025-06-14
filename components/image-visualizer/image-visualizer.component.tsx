"use client";

import React, { useEffect } from 'react';
import styles from '@/components/image-visualizer/image-visualizer.module.css';
import Image from 'next/image';
import Icon, { IconSizes } from '../icon/icon.component';

interface ImageVisualizerProps {
    url: string | null;
    isOpen: boolean;
    alt: string;
    onClose: () => void;
}

const ImageVisualizer = ({ url, isOpen, onClose, alt }: ImageVisualizerProps) => {

    // useEffect(() => {
    //     console.log('Visualizer :', isOpen)
    // }, [isOpen]);

    return (
        <div className={`${styles.imageVisualizerModal} ${isOpen && styles.open}`}>
            <button className={styles.closeBtn} onClick={() => onClose()}>
                <Icon src='/icons/close-yellow.svg' size={IconSizes.MEDIUM}/>
            </button>
            {
                url &&
                <Image width={1080} height={900} src={url} alt={alt} style={{ width: '100%', maxWidth: '500px' }} />
            }
        </div>
    );
};

export default ImageVisualizer;