import React from 'react';
import styles from '@/components/image-visualizer/image-visualizer.module.css';
import Image from 'next/image';

interface ImageVisualizerProps {
    url: string | null;
    isOpen: boolean;
    alt: string;
}

const ImageVisualizer = ({ url, isOpen, alt }: ImageVisualizerProps) => {

    return (
        <div className={`${styles.imageVisualizerModal} ${isOpen && styles.open}`}>
            {
                url &&
                <Image width={1080} height={900} src={url} alt={alt} style={{ width: '100%' }} />
            }
        </div>
    );
};

export default ImageVisualizer;