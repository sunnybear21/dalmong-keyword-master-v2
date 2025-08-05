
import React, { useState, useCallback } from 'react';
import type { BlogPostResult } from '../types.ts';
import { exportAsTxt } from '../utils/export.ts';
import { PencilSquareIcon, ClipboardDocumentCheckIcon, DownloadIcon, CodeBracketIcon } from './icons.tsx';

interface ContentResultProps {
    result: BlogPostResult;
    keyword: string;
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; }> = ({ onClick, children }) => (
    <button onClick={onClick} className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors">
        {children}
    </button>
);

export const ContentResult: React.FC<ContentResultProps> = ({ result, keyword }) => {
    const [copyNotification, setCopyNotification] = useState<string | null>(null);

    const notify = (message: string) => {
        setCopyNotification(message);
        setTimeout(() => setCopyNotification(null), 2000);
    };

    const handleCopy = useCallback((text: string, type: 'content' | 'html') => {
        let contentToCopy = text;
        if (type === 'html') {
            contentToCopy = text.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('\n');
        }
        navigator.clipboard.writeText(contentToCopy);
        notify(type === 'html' ? 'HTML로 복사되었습니다!' : '본문이 복사되었습니다!');
    }, []);

    const handleDownload = useCallback(() => {
        exportAsTxt(result.title, result.content, `${keyword}_post`);
    }, [result, keyword]);

    return (
        <div className="bg-dark-card p-6 rounded-lg shadow-lg space-y-6">
            <div>
                <h2 className="text-3xl font-bold">
                    <span className="text-brand-accent">"{keyword}"</span> 콘텐츠 생성 결과
                </h2>
                <p className="text-sm text-dark-text-secondary mt-1 bg-slate-800 px-2 py-1 rounded-md inline-block">달멍봇 콘텐츠 자동 생성기 v1.5</p>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-dark-text border-l-4 border-brand-accent pl-4">{result.title}</h3>
                
                <div className="bg-slate-900/50 p-4 rounded-lg border border-dark-border max-h-96 overflow-y-auto">
                    <p className="text-dark-text-secondary leading-relaxed whitespace-pre-wrap">{result.content}</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">추천 태그</h4>
                    <div className="flex flex-wrap gap-2">
                        {result.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-slate-700 text-sm text-dark-text-secondary rounded-full">
                                # {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-dark-border pt-4 relative">
                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                    <ActionButton onClick={() => handleCopy(result.content, 'content')}>
                        <ClipboardDocumentCheckIcon className="w-4 h-4" /> 본문 복사
                    </ActionButton>
                    <ActionButton onClick={() => handleCopy(result.content, 'html')}>
                        <CodeBracketIcon className="w-4 h-4" /> HTML로 복사
                    </ActionButton>
                    <ActionButton onClick={handleDownload}>
                        <DownloadIcon className="w-4 h-4" /> 파일로 다운로드
                    </ActionButton>
                </div>
                 {copyNotification && (
                    <div className="absolute bottom-12 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-md animate-fade-in">
                        {copyNotification}
                    </div>
                )}
            </div>
        </div>
    );
};
