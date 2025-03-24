import React from 'react';

const DaisyToast = ({ message, type }: { message: string, type: string }) => {

    return (
        <div className="toast toast-bottom toast-start">
            <div className={`alert alert-${type}`}>
                <span>{message}</span>
            </div>
        </div>
    );
};

export default DaisyToast;