'use client';

import React from 'react';
import Error from '@/components/error/error.component';

const SoldiersError = ({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) => {

    return (
        <Error error={error} reset={reset} />
    );
};

export default SoldiersError;