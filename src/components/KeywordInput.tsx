
import React, { useState } from 'react';
import { SearchIcon, LoadingIcon, ClipboardIcon, PencilSquareIcon, TargetIcon, ShieldCheckIcon } from './icons.tsx';
import type { AnalysisMode, AppMode } from '../types.ts';

interface KeywordInputProps {
    onAnalyze: (input: string, mode: AnalysisMode) => void;
    onGenerate: (keyword: string, style: string, length: string) => void;
    isLoading: boolean;
    onModeChange: (newMode: AppMode) => void;
    isNaverApiConfigured: boolean;
}

const ModeButton: React.FC<{ isActive: boolean, children: React.ReactNode, onClick: () => void, disabled?: boolean }> = ({ isActive, children, onClick, disabled }) => {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={onClick}
            disabled={disabled}
            className={`px-3 sm:px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 flex items-center gap-2 ${
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

export const KeywordInput: React.FC<KeywordInputProps> = ({ onAnalyze, onGenerate, isLoading, onModeChange, isNaverApiConfigured }) => {
    const [appMode, setAppMode] = useState<AppMode>('analysis');
    const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('simulation');
    
    const [inputValue, setInputValue] = useState('');
    const [generationOptions, setGenerationOptions] = useState({
        style: 'review',
        length: '1000'
    });
    
    const handleAppModeChange = (newMode: AppMode) => {
        if (newMode !== appMode) {
            setInputValue('');
            setAppMode(newMode);
            onModeChange(newMode);
        }
    }

    const handleAnalysisModeChange = (newMode: AnalysisMode) => {
        if (newMode !== analysisMode) {
            setInputValue('');
            setAnalysisMode(newMode);
        }
    };

    const handleGenerationOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGenerationOptions(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (appMode === 'analysis') {
            onAnalyze(inputValue, analysisMode);
        } else {
            onGenerate(inputValue, generationOptions.style, generationOptions.length);
        }
    };

    const renderAnalysisInput = () => (
        <>
            <div role="tablist" className="flex items-center gap-2 mb-4">
                <ModeButton isActive={analysisMode === 'simulation'} onClick={() => handleAnalysisModeChange('simulation')}>
                    <SearchIcon className="w-4 h-4" /> AI 시뮬레이션
                </ModeButton>
                <ModeButton isActive={analysisMode === 'manual'} onClick={() => handleAnalysisModeChange('manual')}>
                     <ClipboardIcon className="w-4 h-4" /> 데이터 직접 분석
                </ModeButton>
                <ModeButton isActive={analysisMode === 'api'} onClick={() => handleAnalysisModeChange('api')} disabled={!isNaverApiConfigured}>
                    <ShieldCheckIcon className="w-4 h-4" /> 네이버 API 분석
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isNaverApiConfigured ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isNaverApiConfigured ? '준비완료' : '설정필요'}
                    </span>
                </ModeButton>
            </div>
            <p className="text-xs text-dark-text-secondary mb-4 -mt-2 ml-1">
                {analysisMode === 'simulation' && 'AI가 네이버 광고 데이터를 기반으로 현실적인 수치를 예측하여 생성합니다.'}
                {analysisMode === 'manual' && '네이버 광고 시스템에서 복사한 데이터를 붙여넣어 정확한 분석을 받아보세요.'}
                {analysisMode === 'api' && (isNaverApiConfigured ? '네이버 광고 API에 직접 연결하여 가장 정확한 실시간 데이터를 분석합니다.' : '백엔드 서버에 네이버 광고 API 키가 설정되지 않았습니다.')}
            </p>
            {analysisMode === 'manual' ? (
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
                    placeholder={analysisMode === 'simulation' ? "예: 캠핑용품, 제주도 맛집..." : "분석할 키워드 입력..."}
                    className="w-full h-full pl-4 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition duration-200 text-dark-text placeholder-dark-text-secondary"
                    disabled={isLoading || (analysisMode === 'api' && !isNaverApiConfigured)}
                />
            )}
        </>
    );

    const renderGenerationInput = () => (
        <>
            <p className="text-xs text-dark-text-secondary mb-4 ml-1">
                키워드와 옵션을 선택하면 AI가 SEO에 최적화된 블로그 글을 생성합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <select name="style" value={generationOptions.style} onChange={handleGenerationOptionChange} className="w-full sm:w-1/2 px-3 py-2 bg-dark-card border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-secondary transition duration-200">
                    <option value="review">✍️ 후기 스타일</option>
                    <option value="info">ℹ️ 정보 스타일</option>
                    <option value="marketing">📢 마케팅 스타일</option>
                </select>
                <select name="length" value={generationOptions.length} onChange={handleGenerationOptionChange} className="w-full sm:w-1/2 px-3 py-2 bg-dark-card border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-secondary transition duration-200">
                    <option value="500">📄 500자 내외</option>
                    <option value="1000">📜 1000자 내외</option>
                    <option value="1500">📚 1500자 이상</option>
                </select>
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="글을 생성할 핵심 키워드를 입력하세요..."
                className="w-full pl-4 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition duration-200 text-dark-text placeholder-dark-text-secondary"
                disabled={isLoading}
            />
        </>
    );

    return (
        <div className="bg-slate-900/50 border border-dark-border rounded-lg p-4">
            <div role="tablist" className="flex items-center gap-2 mb-4 border-b border-dark-border">
                <ModeButton isActive={appMode === 'analysis'} onClick={() => handleAppModeChange('analysis')}>
                    <TargetIcon className="w-4 h-4" /> 키워드 분석
                </ModeButton>
                <ModeButton isActive={appMode === 'generation'} onClick={() => handleAppModeChange('generation')}>
                     <PencilSquareIcon className="w-4 h-4" /> 콘텐츠 생성
                     <span className="text-xs px-1.5 py-0.5 bg-brand-accent/20 text-brand-accent rounded-full">NEW</span>
                </ModeButton>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-3">
                <div className="relative w-full">
                    {appMode === 'analysis' ? renderAnalysisInput() : renderGenerationInput()}
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim() || (appMode === 'analysis' && analysisMode === 'api' && !isNaverApiConfigured)}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-brand-secondary text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-secondary transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            {appMode === 'analysis' ? '분석 중...' : '생성 중...'}
                        </>
                    ) : (
                        appMode === 'analysis' ? '분석하기' : '글 생성하기'
                    )}
                </button>
            </form>
        </div>
    );
}
