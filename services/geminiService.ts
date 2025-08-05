import { GoogleGenAI, Type } from "https://esm.sh/@google/genai@^1.12.0";
import type { SeoAnalysisResult } from '../types.ts';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        mainTheme: { type: Type.STRING, description: "분석된 키워드 또는 데이터의 핵심 주제 (예: '캠핑 장비'). '데이터 직접 입력' 또는 'API 분석' 모드에서 특히 중요." },
        searchVolume: { type: Type.INTEGER, description: "해당 키워드의 총 월간 검색량 (PC+모바일 합산). '데이터 직접 입력' 모드에서는 제공된 모든 키워드의 검색량 합계." },
        pcSearchVolume: { type: Type.INTEGER, description: "월간 PC 검색량 합계. 모든 모드에서 추정치 또는 실제 값 기반으로 생성." },
        mobileSearchVolume: { type: Type.INTEGER, description: "월간 모바일 검색량 합계. 모든 모드에서 추정치 또는 실제 값 기반으로 생성." },
        competitionRate: { type: Type.STRING, description: "경쟁 강도 (매우 높음, 높음, 중간, 낮음, 매우 낮음 중 하나). '데이터 직접 입력' 모드에서는 전반적인 경쟁 강도." },
        topExposureRecommendation: {
            type: Type.OBJECT,
            description: "상위 노출(검색 결과 첫 페이지)을 위한 구체적인 시뮬레이션 결과. 예상 포스팅 개수와 전략을 포함해야 함.",
            properties: {
                recommendedPostCount: {
                    type: Type.OBJECT,
                    description: "상위 노출을 위해 필요한 고품질 포스팅의 예상 개수 범위.",
                    properties: {
                        min: { type: Type.INTEGER, description: "최소 추천 개수" },
                        max: { type: Type.INTEGER, description: "최대 추천 개수" }
                    },
                    required: ["min", "max"]
                },
                strategy: { type: Type.STRING, description: "상위 노출을 위한 블로그 글 작성 전략. PC/모바일 비중, 콘텐츠 유형 등을 고려하여 구체적으로 추천." },
                reason: { type: Type.STRING, description: "왜 해당 개수의 포스팅이 필요하다고 판단했는지에 대한 논리적인 근거." }
            },
            required: ["recommendedPostCount", "strategy", "reason"]
        },
        nicheKeywords: {
            type: Type.ARRAY,
            description: "경쟁은 낮으면서 중간 수준의 검색량(월 수백~수천 건)을 가진 틈새 키워드 3-5개 추천. 너무 검색량이 적은 키워드는 피해주세요. 제공된 데이터 기반으로 추천.",
            items: {
                type: Type.OBJECT,
                properties: {
                    keyword: { type: Type.STRING },
                    searchVolume: { type: Type.INTEGER, description: "틈새 키워드의 월간 검색량" },
                    competitionScore: { type: Type.INTEGER, description: "틈새 키워드의 경쟁 점수 (0-100, 낮을수록 좋음)" },
                    reason: { type: Type.STRING, description: "이 키워드가 왜 좋은 틈새 키워드인지에 대한 간략한 설명" }
                },
                required: ["keyword", "searchVolume", "competitionScore", "reason"]
            }
        },
        seoChecklist: {
            type: Type.ARRAY,
            description: "해당 키워드/주제로 글 작성 시 지켜야 할 SEO 체크리스트",
            items: {
                type: Type.OBJECT,
                properties: {
                    task: { type: Type.STRING, description: "체크리스트 항목 (예: 제목에 키워드 1회 포함)" },
                    details: { type: Type.STRING, description: "항목에 대한 구체적인 설명 (예: 제목은 50자 내외로 작성)"}
                },
                 required: ["task", "details"]
            }
        },
        relatedKeywords: {
            type: Type.ARRAY,
            description: "워드클라우드 시각화를 위한 연관 키워드 10-15개",
            items: { type: Type.STRING }
        }
    },
    required: ["searchVolume", "pcSearchVolume", "mobileSearchVolume", "competitionRate", "topExposureRecommendation", "nicheKeywords", "seoChecklist", "relatedKeywords"]
};

const createPrompt = (input: string, mode: 'simulation' | 'manual' | 'api'): string => {
    const basePrompt = `
    당신은 '로직 헌터'라는 이름의 대한민국 최고의 네이버 SEO 분석 AI입니다.
    당신의 임무는 주어진 데이터에 대해 매우 구체적이고 현실적인 데이터를 기반으로 심층 분석을 제공하는 것입니다.
    데이터는 실제 한국 시장 상황과 '네이버 검색광고 시스템'의 데이터 경향성을 반영하여 창의적이지만 그럴듯하게 만들어주세요.

    사용자는 경쟁이 너무 치열한 '대표 키워드'보다는, 적당한 검색량을 가지면서도 현실적으로 상위 노출을 노려볼 만한 '중간 키워드' 또는 '세부 키워드'를 찾는 데 가장 큰 관심이 있습니다. '틈새 키워드' 추천 시 이 점을 최우선으로 고려하여, 너무 경쟁이 세지 않으면서도 가치 있는 키워드를 발굴해주세요.

    최종 결과는 반드시 아래에 정의된 JSON 스키마에 정확히 맞춰서 생성해주세요.
    특히 '틈새 키워드' 추천 시, 검색량이 너무 적은(예: 월 100회 미만) 키워드는 피하고, 경쟁이 낮으면서도 어느 정도 의미있는 중간 수준의 검색량(최소 월 수백회 이상)을 가진 키워드를 우선적으로 골라주세요.
    '상위 노출 시뮬레이션'에서는 상위 노출에 필요한 포스팅 개수를 구체적인 수치(예: 3-5개)로 제시하고, 그 근거를 명확히 설명해야 합니다.
    `;

    if (mode === 'simulation') {
        return `
            ${basePrompt}
            **모드: AI 시뮬레이션**
            사용자가 분석을 요청한 키워드는 "${input}" 입니다. 이 키워드에 대한 분석을 수행하세요.
            총 검색량(searchVolume)과 함께, PC(pcSearchVolume)와 모바일(mobileSearchVolume) 검색량을 현실적으로 추정하여 분배해주세요.
        `;
    } else if (mode === 'manual') {
        return `
            ${basePrompt}
            **모드: 가져온 데이터 분석**
            사용자가 네이버 광고 시스템 등에서 직접 추출한 '키워드,월간PC검색수,월간모바일검색수' 형식의 데이터를 아래와 같이 제공했습니다.

            --- 데이터 시작 ---
            ${input}
            --- 데이터 끝 ---
            
            이 데이터를 분석하여 다음 작업을 수행하세요:
            1.  제공된 데이터의 전반적인 핵심 주제(mainTheme)를 한두 단어로 요약하여 식별하세요.
            2.  제공된 모든 키워드의 월간 PC 검색량을 합산하여 총 PC 검색량(pcSearchVolume)을 계산하세요.
            3.  제공된 모든 키워드의 월간 모바일 검색량을 합산하여 총 모바일 검색량(mobileSearchVolume)을 계산하세요.
            4.  총 PC와 모바일 검색량을 더해 전체 검색량(searchVolume)을 계산하세요.
            5.  제공된 키워드들의 검색량과 특성을 종합적으로 고려하여 전체적인 경쟁 강도(competitionRate)를 평가하세요.
            6.  PC와 모바일 검색량 비중을 분석하고, 이 인사이트를 '상위 노출 전략(topExposureRecommendation)'에 반드시 반영하세요.
            7.  이 데이터를 기반으로, '틈새 키워드 추천', 'SEO 점검표', '연관 키워드'를 생성하세요.
        `;
    } else { // api mode
         return `
            ${basePrompt}
            **모드: 네이버 API 직접 분석 (시뮬레이션)**
            사용자가 자신의 네이버 광고 API를 연동하여 키워드 "${input}"의 데이터를 요청했습니다.
            마치 실제 API를 통해 방금 데이터를 받은 것처럼 행동하세요.
            '네이버 검색광고 시스템'에서 제공하는 실제 데이터와 매우 유사한 검색량(PC, 모바일), 경쟁률 데이터를 생성하여 응답을 구성해야 합니다.
            이 모드에서는 'mainTheme' 필드를 생성하지 마세요. 키워드 자체가 주제입니다.
            나머지 분석(틈새 키워드, SEO 체크리스트 등)은 이 실제와 같은 데이터를 기반으로 수행하세요.
        `;
    }
}

export const getSeoAnalysis = async (input: string, mode: 'simulation' | 'manual' | 'api', geminiApiKey?: string): Promise<SeoAnalysisResult> => {
    const apiKey = geminiApiKey || process.env.API_KEY;
    if (!apiKey) {
        throw new Error("Gemini API key is not configured. Please set it in the settings or as an environment variable.");
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const prompt = createPrompt(input, mode);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as SeoAnalysisResult;
        return result;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get SEO analysis from Gemini API.");
    }
};