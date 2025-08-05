import React, { useState, useCallback } from 'react';
import type { SeoAnalysisResult, ApiCredentials } from './types.ts';
import { getSeoAnalysis } from './services/geminiService.ts';
import { Header } from './components/Header.tsx';
import { KeywordInput } from './components/KeywordInput.tsx';
import { ResultsDashboard } from './components/ResultsDashboard.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [displayTitle, setDisplayTitle] = useState<string>('');
  const [analysisMode, setAnalysisMode] = useState<'simulation' | 'manual' | 'api'>('simulation');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [apiCredentials, setApiCredentials] = useState<ApiCredentials>({});

  const handleAnalyze = useCallback(async (input: string, mode: 'simulation' | 'manual' | 'api') => {
    if (!input.trim()) {
      setError('분석할 키워드나 데이터를 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setAnalysisMode(mode);

    try {
      const result = await getSeoAnalysis(input, mode, apiCredentials.geminiApiKey);
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
  }, [apiCredentials.geminiApiKey]);
  
  const handleSaveSettings = (creds: ApiCredentials) => {
    setApiCredentials(creds);
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-dark-text mb-2">
            AI 기반 SEO 키워드 분석
          </h2>
          <p className="text-center text-dark-text-secondary mb-8">
            궁금한 키워드를 입력하거나, 데이터를 붙여넣고 '로직 헌터'의 분석을 받아보세요.
          </p>
          
          <KeywordInput onAnalyze={handleAnalyze} isLoading={isLoading} apiCredentials={apiCredentials} />

          {error && (
            <div className="mt-6 text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {isLoading && <LoadingSpinner />}
          
          {analysisResult && !isLoading && (
            <div className="mt-12 animate-fade-in">
              <ResultsDashboard result={analysisResult} displayTitle={displayTitle} mode={analysisMode} />
            </div>
          )}
        </div>
      </main>
       <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentCredentials={apiCredentials}
      />
      <footer className="text-center py-4 text-dark-text-secondary text-sm">
        <p>Powered by Gemini API. For demo purposes only.</p>
      </footer>
    </div>
  );
};

export default App;