'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Photo } from '@prisma/client';
import styles from '@/components/document-card/document-card.module.css';
import ImageVisualizer from '../image-visualizer/image-visualizer.component';

const DocumentCard = ({ photo }: { photo: Photo }) => {

    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

    return (
        <>
            <ImageVisualizer
                isOpen={isImagePreviewOpen}
                alt='Document image preview'
                onClose={() => setIsImagePreviewOpen(false)}
                url={photo.url}
            />
            <div className={styles.documentCard} onClick={() => setIsImagePreviewOpen(true)}>
                <div className={styles.documentImage}>
                    <Image
                        src={photo.url}
                        alt="Document image"
                        fill
                        className={styles.image}
                    />
                </div>
                {
                    photo.caption ?
                        <p className={styles.documentCaption}>{photo.caption}</p>
                        : null
                }
            </div>
        </>
    );
}

export default DocumentCard;