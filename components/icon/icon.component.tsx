import React from 'react';
import Image from 'next/image';

export enum IconSizes {
    SMALLEST = 0.5,
    SMALLER = 1,
    MEDIUM = 1.5,
    LARGER = 5,
    LARGEST = 10,
}

const Icon = ({ src, size }: { src?: string, size: IconSizes }) => {

    return (
        src &&
        <Image
            src={src}
            alt="Icon"
            width={size * 16}
            height={size * 16}
            style={{
                width: `${size}rem`,
                objectFit: 'contain',
            }}
        />
    );
};

export default Icon;