

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'https://esm.sh/recharts@2.12.7?external=react,react-dom';
import type { SeoAnalysisResult } from '../types.ts';
import { exportAsJson, exportAsCsv } from '../utils/export.ts';
import { CheckCircleIcon, DocumentTextIcon, ChartBarIcon, LightBulbIcon, SparklesIcon, DownloadIcon, PieChartIcon } from './icons.tsx';


interface ResultsDashboardProps {
    result: SeoAnalysisResult;
    displayTitle: string;
    mode: 'simulation' | 'manual' | 'api';
}

const AnalysisCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-dark-card p-6 rounded-lg shadow-lg flex items-center h-full">
        <div className="mr-4 text-brand-accent">{icon}</div>
        <div>
            <p className="text-sm text-dark-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-dark-text">{value}</p>
        </div>
    </div>
);

const competitionColorMapping = {
    '매우 높음': 'text-red-400',
    '높음': 'text-orange-400',
    '중간': 'text-yellow-400',
    '낮음': 'text-green-400',
    '매우 낮음': 'text-teal-400',
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, displayTitle, mode }) => {
    
    const handleExportJson = () => {
        exportAsJson(result, `${displayTitle}_analysis`);
    };

    const handleExportCsv = () => {
        exportAsCsv(result, `${displayTitle}_analysis`);
    };
    
    const nicheChartData = result.nicheKeywords.map(k => ({
        name: k.keyword.length > 10 ? `${k.keyword.substring(0, 10)}...` : k.keyword,
        "월 검색량": k.searchVolume,
        "경쟁 점수": k.competitionScore,
    }));
    
    const pcMobileData = [
        { name: 'PC', value: result.pcSearchVolume || 0 },
        { name: '모바일', value: result.mobileSearchVolume || 0 },
    ];
    const PC_MOBILE_COLORS = ['#3b82f6', '#2dd4bf'];

    const hasPcMobileData = (result.pcSearchVolume ?? 0) > 0 || (result.mobileSearchVolume ?? 0) > 0;
    const { recommendedPostCount, strategy, reason } = result.topExposureRecommendation;
    
    const analysisTitle = {
        simulation: 'AI 시뮬레이션',
        manual: '입력 데이터 분석',
        api: '네이버 API 분석'
    }[mode];

    const searchVolumeTitle = mode === 'manual' ? '총 월간 검색량 (입력 데이터)' : `월간 검색량 (${mode === 'api' ? 'API 기반' : 'AI 추정'})`;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold">
                        <span className="text-brand-accent">"{displayTitle}"</span> 분석 결과
                    </h2>
                    <p className="text-sm text-dark-text-secondary mt-1 bg-slate-800 px-2 py-1 rounded-md inline-block">{analysisTitle}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <button onClick={handleExportJson} className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                        <DownloadIcon className="w-4 h-4" />
                        JSON
                    </button>
                    <button onClick={handleExportCsv} className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                        <DownloadIcon className="w-4 h-4" />
                        CSV
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnalysisCard title={searchVolumeTitle} value={result.searchVolume.toLocaleString()} icon={<ChartBarIcon className="w-8 h-8" />} />
                <div className="bg-dark-card p-6 rounded-lg shadow-lg flex items-center h-full">
                    <div className="mr-4 text-brand-accent"><SparklesIcon className="w-8 h-8" /></div>
                    <div>
                        <p className="text-sm text-dark-text-secondary">경쟁 강도</p>
                        <p className={`text-2xl font-bold ${competitionColorMapping[result.competitionRate]}`}>{result.competitionRate}</p>
                    </div>
                </div>
                <div className="bg-dark-card p-6 rounded-lg shadow-lg md:col-span-2 lg:col-span-1">
                    <h3 className="text-lg font-bold mb-2 flex items-center text-dark-text"><PieChartIcon className="w-5 h-5 mr-2 text-brand-accent" />PC/모바일 비율</h3>
                    {hasPcMobileData ? (
                        <ResponsiveContainer width="100%" height={150}>
                             <PieChart>
                                 <Pie data={pcMobileData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                                     {pcMobileData.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={PC_MOBILE_COLORS[index % PC_MOBILE_COLORS.length]} />
                                     ))}
                                 </Pie>
                                 <Tooltip formatter={(value: number) => value.toLocaleString()} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                 <Legend iconSize={10} />
                             </PieChart>
                         </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[150px] text-dark-text-secondary">
                           <p>PC/모바일 검색량 데이터가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Top Exposure Recommendation */}
             <div className="bg-dark-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-3 flex items-center"><DocumentTextIcon className="w-6 h-6 mr-2 text-brand-accent" />상위 노출 시뮬레이션</h3>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 bg-slate-900/50 p-4 rounded-lg border border-dark-border">
                    <div className="text-center flex-shrink-0">
                        <p className="text-sm text-dark-text-secondary">추천 포스팅 수</p>
                        <p className="text-3xl md:text-4xl font-bold text-brand-accent">
                            {recommendedPostCount.min === recommendedPostCount.max ? `${recommendedPostCount.min}개` : `${recommendedPostCount.min}~${recommendedPostCount.max}개`}
                        </p>
                    </div>
                    <div>
                         <p className="font-semibold text-dark-text">분석 근거</p>
                         <p className="text-sm text-dark-text-secondary leading-relaxed whitespace-pre-line mb-3">{reason}</p>
                         <p className="font-semibold text-dark-text">상세 전략</p>
                         <p className="text-sm text-dark-text-secondary leading-relaxed whitespace-pre-line">{strategy}</p>
                    </div>
                </div>
            </div>


            {/* Niche Keywords */}
            <div className="bg-dark-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-2 flex items-center"><LightBulbIcon className="w-6 h-6 mr-2 text-brand-accent" />🎯 추천! 중간 경쟁률 '꿀' 키워드</h3>
                <p className="text-sm text-dark-text-secondary mb-4">경쟁이 너무 치열한 키워드 대신, 적은 노력으로도 상위 노출을 노릴 수 있는 실속 있는 키워드입니다.</p>
                <div className="space-y-4">
                    {result.nicheKeywords.map((k, index) => (
                        <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-dark-border">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-brand-accent">{k.keyword}</h4>
                                    <p className="text-sm text-dark-text-secondary mt-1">{k.reason}</p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <p className="text-sm text-dark-text-secondary">검색량: <span className="font-semibold text-dark-text">{k.searchVolume.toLocaleString()}</span></p>
                                    <p className="text-sm text-dark-text-secondary">경쟁: <span className="font-semibold text-dark-text">{k.competitionScore}/100</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
             {/* Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-dark-card p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">틈새 키워드 비교</h3>
                    {nicheChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={nicheChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} formatter={(value: number) => value.toLocaleString()} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="월 검색량" fill="#8884d8" />
                                <Bar yAxisId="right" dataKey="경쟁 점수" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="flex items-center justify-center h-[300px] text-dark-text-secondary">
                            <p>추천할 틈새 키워드가 없습니다.</p>
                        </div>
                    )}
                </div>
                <div className="bg-dark-card p-6 rounded-lg shadow-lg">
                     <h3 className="text-xl font-bold mb-4">연관 키워드 (워드클라우드)</h3>
                     <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 p-4 min-h-[300px]">
                        {result.relatedKeywords.map((word, index) => {
                            const size = 32 - index * 1.5; // Decrease font size for later words
                            const opacity = 100 - index * 4; // Decrease opacity
                             return (
                                <span 
                                    key={index} 
                                    className="font-bold"
                                    style={{ fontSize: `${Math.max(size, 12)}px`, opacity: `${Math.max(opacity, 20)}%`}}
                                >
                                    {word}
                                </span>
                            );
                        })}
                     </div>
                </div>
            </div>

            {/* SEO Checklist */}
            <div className="bg-dark-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center"><CheckCircleIcon className="w-6 h-6 mr-2 text-brand-accent" />SEO 점검표</h3>
                <ul className="space-y-3">
                    {result.seoChecklist.map((item, index) => (
                        <li key={index} className="flex items-start">
                            <input type="checkbox" id={`task-${index}`} className="mt-1.5 h-4 w-4 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary cursor-pointer" />
                            <label htmlFor={`task-${index}`} className="ml-3 text-dark-text cursor-pointer">
                                {item.task}
                                <p className="text-sm text-dark-text-secondary">{item.details}</p>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}