import React, { useState } from 'react';
import { SearchIcon, LoadingIcon, ClipboardIcon, ShieldCheckIcon } from './icons.tsx';
import type { ApiCredentials } from '../types.ts';

interface KeywordInputProps {
    onAnalyze: (input: string, mode: 'simulation' | 'manual' | 'api') => void;
    isLoading: boolean;
    apiCredentials?: ApiCredentials;
}

type Mode = 'simulation' | 'manual' | 'api';

const ModeButton: React.FC<{ currentMode: Mode, targetMode: Mode, children: React.ReactNode, onClick: () => void, disabled?: boolean }> = ({ currentMode, targetMode, children, onClick, disabled }) => {
    const isActive = currentMode === targetMode;
    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 flex items-center gap-2 ${
                isActive 
                    ? 'bg-brand-secondary text-white' 
                    : 'text-dark-text-secondary hover:bg-dark-card'
            } ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
            {children}
        </button>
    )
}

export const KeywordInput: React.FC<KeywordInputProps> = ({ onAnalyze, isLoading, apiCredentials }) => {
    const [mode, setMode] = useState<Mode>('simulation');
    const [inputValue, setInputValue] = useState('');
    
    const isApiModeReady = !!(apiCredentials?.naverAccessKey && apiCredentials?.naverSecretKey && apiCredentials?.naverCustomerId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAnalyze(inputValue, mode);
    };
    
    const handleModeChange = (newMode: Mode) => {
        if (newMode !== mode) {
            setInputValue(''); // 모드 변경 시 입력값 초기화
            setMode(newMode);
        }
    };

    return (
        <div className="bg-slate-900/50 border border-dark-border rounded-lg p-4">
            <div role="tablist" className="flex items-center gap-2 mb-4">
                <ModeButton currentMode={mode} targetMode='simulation' onClick={() => handleModeChange('simulation')}>
                    <SearchIcon className="w-4 h-4" /> AI 시뮬레이션
                    <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">빠른 탐색</span>
                </ModeButton>
                <ModeButton currentMode={mode} targetMode='manual' onClick={() => handleModeChange('manual')}>
                     <ClipboardIcon className="w-4 h-4" /> 데이터 직접 분석
                </ModeButton>
                 <ModeButton currentMode={mode} targetMode='api' onClick={() => handleModeChange('api')} disabled={!isApiModeReady}>
                    <ShieldCheckIcon className="w-4 h-4" /> 네이버 API 분석
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isApiModeReady ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isApiModeReady ? '준비완료' : '설정필요'}
                    </span>
                </ModeButton>
            </div>
             <p className="text-xs text-dark-text-secondary mb-4 -mt-2 ml-1">
                {mode === 'simulation' && 'AI가 네이버 광고 데이터를 기반으로 현실적인 수치를 예측하여 생성합니다. 빠른 아이디어 탐색에 유용합니다.'}
                {mode === 'manual' && '네이버 광고 시스템에서 복사한 데이터를 붙여넣어 정확한 분석을 받아보세요.'}
                {mode === 'api' && (isApiModeReady ? '네이버 광고 API에 직접 연결하여 가장 정확한 실시간 데이터를 분석합니다.' : '헤더의 설정(⚙️) 아이콘을 눌러 네이버 광고 API 키를 먼저 입력해주세요.')}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="relative w-full">
                    {mode === 'manual' ? (
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="네이버 광고 데이터(키워드,월간PC검색수,월간모바일검색수)를 붙여넣으세요.&#10;예:&#10;캠핑용품,15000,40000&#10;제주도맛집,10000,200000"
                            className="w-full h-36 pl-4 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition duration-200 text-dark-text placeholder-dark-text-secondary resize-y"
                            disabled={isLoading}
                        />
                    ) : (
                         <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={mode === 'simulation' ? "예: 캠핑용품, 제주도 맛집..." : "분석할 키워드 입력..."}
                            className="w-full h-full pl-4 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition duration-200 text-dark-text placeholder-dark-text-secondary"
                            disabled={isLoading || (mode === 'api' && !isApiModeReady)}
                        />
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim() || (mode === 'api' && !isApiModeReady)}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-brand-secondary text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-secondary transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            분석 중...
                        </>
                    ) : (
                        '분석하기'
                    )}
                </button>
            </form>
        </div>
    );
}