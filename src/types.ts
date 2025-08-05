
export interface NicheKeyword {
  keyword: string;
  searchVolume: number;
  competitionScore: number;
  reason: string;
}

export interface SeoChecklistItem {
  task: string;
  details: string;
}

export interface TopExposure {
  recommendedPostCount: {
    min: number;
    max: number;
  };
  strategy: string;
  reason: string;
}

export interface SeoAnalysisResult {
  mainTheme?: string;
  searchVolume: number;
  pcSearchVolume?: number;
  mobileSearchVolume?: number;
  competitionRate: '매우 높음' | '높음' | '중간' | '낮음' | '매우 낮음';
  topExposureRecommendation: TopExposure;
  nicheKeywords: NicheKeyword[];
  seoChecklist: SeoChecklistItem[];
  relatedKeywords: string[];
}

export interface BlogPostResult {
  title: string;
  content: string;
  tags: string[];
}

export type AnalysisMode = 'simulation' | 'manual' | 'api';
export type AppMode = 'analysis' | 'generation';
