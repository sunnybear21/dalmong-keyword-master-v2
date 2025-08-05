
import type { SeoAnalysisResult, BlogPostResult, AnalysisMode } from '../types.ts';

export const getSeoAnalysis = async (input: string, mode: AnalysisMode): Promise<SeoAnalysisResult> => {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input, mode }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: '서버로부터 읽을 수 없는 에러 응답을 받았습니다.' }));
            throw new Error(errorData.error || `서버가 ${response.status} 상태로 응답했습니다.`);
        }

        const result = await response.json();
        return result as SeoAnalysisResult;

    } catch (error) {
        console.error("백엔드로부터 분석 결과를 가져오는 중 에러 발생:", error);
        if (error instanceof Error) {
           throw new Error(`SEO 분석 실패: ${error.message}`);
        }
        throw new Error("서버와 통신 중 알 수 없는 에러가 발생했습니다.");
    }
};

export const generateBlogPost = async (keyword: string, style: string, length: string): Promise<BlogPostResult> => {
    try {
        const response = await fetch('/api/generate-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword, style, length }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: '서버로부터 읽을 수 없는 에러 응답을 받았습니다.' }));
            throw new Error(errorData.error || `서버가 ${response.status} 상태로 응답했습니다.`);
        }

        const result = await response.json();
        return result as BlogPostResult;

    } catch (error) {
        console.error("백엔드로부터 블로그 글을 가져오는 중 에러 발생:", error);
        if (error instanceof Error) {
           throw new Error(`블로그 글 생성 실패: ${error.message}`);
        }
        throw new Error("서버와 통신 중 알 수 없는 에러가 발생했습니다.");
    }
};
