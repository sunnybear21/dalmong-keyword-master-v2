import React from 'react';
import { TargetIcon } from './icons.tsx';

export const Header: React.FC = () => {
    return (
        <header className="bg-dark-card shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <TargetIcon className="w-8 h-8 text-brand-accent mr-3" />
                    <h1 className="text-xl md:text-2xl font-bold text-dark-text">
                       <span className="text-brand-accent">달멍봇</span> 키워드 마스터 V2 – “로직 헌터”
                    </h1>
                </div>
            </div>
        </header>
    );
}