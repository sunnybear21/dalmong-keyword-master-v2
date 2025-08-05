
import React, { useState, useCallback, useEffect } from 'react';
import type { SeoAnalysisResult, BlogPostResult, AnalysisMode, AppMode } from './types.ts';
import { getSeoAnalysis, generateBlogPost } from './services/geminiService.ts';
import { Header } from './components/Header.tsx';
import { KeywordInput } from './components/KeywordInput.tsx';
import { ResultsDashboard } from './components/ResultsDashboard.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';
import { ContentResult } from './components/ContentResult.tsx';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResult | null>(null);
  const [blogPostResult, setBlogPostResult] = useState<BlogPostResult | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [displayTitle, setDisplayTitle] = useState<string>('');
  const [displayKeyword, setDisplayKeyword] = useState<string>('');
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<AnalysisMode>('simulation');
  const [isNaverApiConfigured, setIsNaverApiConfigured] = useState<boolean>(false);

  useEffect(() => {
    const fetchStatus = async () => {
        try {
            const response = await fetch('/api/status');
            if (response.ok) {
                const data = await response.json();
                setIsNaverApiConfigured(data.naverApiConfigured);
            }
        } catch (error) {
            console.error("Failed to fetch API status:", error);
            // Keep it false if status check fails
            setIsNaverApiConfigured(false);
        }
    };
    fetchStatus();
  }, []);

  const handleAnalyzeKeyword = useCallback(async (input: string, mode: AnalysisMode) => {
    if (!input.trim()) {
      setError('분석할 키워드나 데이터를 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setBlogPostResult(null); // 다른 결과 초기화
    setActiveAnalysisMode(mode);

    try {
      const result = await getSeoAnalysis(input, mode);
      setAnalysisResult(result);
      if (mode === 'simulation' || mode === 'api') {
        setDisplayTitle(input);
      } else {
        setDisplayTitle(result.mainTheme || '직접 입력 데이터');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : '분석 중 알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGeneratePost = useCallback(async (keyword: string, style: string, length: string) => {
    if (!keyword.trim()) {
      setError('글을 생성할 키워드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); // 다른 결과 초기화
    setBlogPostResult(null);
    setDisplayKeyword(keyword);

    try {
        const result = await generateBlogPost(keyword, style, length);
        setBlogPostResult(result);
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : '콘텐츠 생성 중 알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  }, []);


  const handleModeChange = () => {
    setAnalysisResult(null);
    setBlogPostResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-dark-bg text-dark-text">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
            AI 기반 SEO 분석 & 콘텐츠 생성
          </h2>
          <p className="text-center text-dark-text-secondary mb-8">
            키워드를 분석하거나, 키워드로 SEO 최적화 글을 바로 생성해보세요.
          </p>
          
          <KeywordInput 
            onAnalyze={handleAnalyzeKeyword} 
            onGenerate={handleGeneratePost}
            isLoading={isLoading}
            onModeChange={handleModeChange}
            isNaverApiConfigured={isNaverApiConfigured}
          />

          {error && (
            <div className="mt-6 text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {isLoading && <LoadingSpinner />}
          
          {analysisResult && !isLoading && (
            <div className="mt-12 animate-fade-in">
              <ResultsDashboard result={analysisResult} displayTitle={displayTitle} mode={activeAnalysisMode} />
            </div>
          )}

          {blogPostResult && !isLoading && (
             <div className="mt-12 animate-fade-in">
                <ContentResult result={blogPostResult} keyword={displayKeyword} />
             </div>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-dark-text-secondary text-sm">
        <p>Powered by Gemini API. For demo purposes only.</p>
        <p className="mt-1">도구가 마음에 드셨다면, <a href="https://toss.me/dalmong" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">개발자에게 커피 한잔</a>을 선물해주세요! ☕️</p>
      </footer>
    </div>
  );
};

export default App;
