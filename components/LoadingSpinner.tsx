import React from 'react';
import { LoadingIcon } from './icons.tsx';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16">
            <LoadingIcon className="w-12 h-12 animate-spin text-brand-secondary" />
            <p className="mt-4 text-lg font-semibold text-dark-text-secondary">AI가 키워드를 분석하고 있습니다...</p>
            <p className="text-sm text-dark-text-secondary">잠시만 기다려 주세요.</p>
        </div>
    );
};