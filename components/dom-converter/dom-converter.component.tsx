import React from 'react';
import ImageVisualizer from '@/components/image-visualizer/image-visualizer.component';
import { toSvg } from 'html-to-image';

interface DomConverterProps {
    dom?: HTMLDivElement;
}

const DomConverter = async ({ dom }: DomConverterProps) => {

    const convert = async () => {
        let url = null;
        if (dom) {
            try {
                url = await toSvg(dom);
            } finally {
                dom.remove();
            }
        }
        return url;
    };

    return (
        <>
            {
                dom &&
                <ImageVisualizer url={await convert()} isOpen={true} alt={'QR code preview'} />
            }
        </>
    )
}

export default DomConverter;