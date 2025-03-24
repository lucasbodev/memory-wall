'use client';

import React, { type ReactElement } from 'react';
import '@/app/globals.css';
import useIsomorphicLayoutEffect from '@/styles/animations/use-isomorphic-layout-effect';
import { revealHomeTitle } from '@/styles/animations/animations';

const HomeAnimations = (
    { children }:
        Readonly<{ children: React.ReactNode }>):
    ReactElement => {
        
    useIsomorphicLayoutEffect(() => {
        revealHomeTitle();
    }, []);

    return (
        <>
            {children}
        </>
    );
};

export default HomeAnimations;

