"use client";

import React, { useEffect } from 'react';
import styles from '@/components/image-visualizer/image-visualizer.module.css';
import Image from 'next/image';
import Icon, { IconSizes } from '../icon/icon.component';
import { RemoveScroll } from 'react-remove-scroll';

interface ImageVisualizerProps {
    url: string | null;
    isOpen: boolean;
    alt: string;
    onClose: () => void;
}

const ImageVisualizer = ({ url, isOpen, onClose, alt }: ImageVisualizerProps) => {
    if (!isOpen) return null;

    return (
        <RemoveScroll>
            <div className={`${styles.imageVisualizerModal} ${isOpen && styles.open}`}>
                <button className={styles.closeBtn} onClick={() => onClose()}>
                    <Icon src='/icons/close-yellow.svg' size={IconSizes.MEDIUM} />
                </button>
                {
                    url &&
                    <Image width={1080} height={900} src={url} alt={alt} style={{
                        width: '100%',
                        maxWidth: '500px',
                        maxHeight: '80svh',
                        objectFit: 'cover'
                    }} />
                }
            </div>
        </RemoveScroll>
    );
};

export default ImageVisualizer;