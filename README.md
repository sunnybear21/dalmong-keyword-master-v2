# 🌸 달멍봇 키워드 마스터 V2 – “로직 헌터”

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Made with ❤️ by Sunnybear](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red)](mailto:rsy0314@gmail.com)
[![Tech Stack](https://img.shields.io/badge/Stack-Fullstack-blue)](#기술-스택)

이 프로젝트는 AI를 활용하여 SEO 키워드를 분석하고, 틈새 시장을 제안하며, SEO에 최적화된 블로그 콘텐츠까지 자동으로 생성해주는 AI 기반 SEO & 콘텐츠 마케팅 도구입니다.

이 프로젝트는 안전한 API 키 처리를 위해 프론트엔드와 백엔드가 분리된 풀스택(Full-stack) 애플리케이션으로 구성되어 있습니다.

## 주요 기능

1. **AI 키워드 분석 (로직 헌터)**
   - **AI 시뮬레이션:** 키워드를 입력하면 AI가 현실적인 검색량, 경쟁 강도 등을 시뮬레이션하여 보여줍니다. 빠른 아이디어 탐색에 유용합니다.
   - **데이터 직접 분석:** 네이버 광고 등에서 추출한 데이터를 붙여넣으면, 해당 데이터를 기반으로 심층 분석 리포트를 제공합니다.
   - **네이버 API 분석:** (설정 필요) 네이버 광고 API와 연동하여 키워드에 대한 가장 정확한 실시간 데이터를 기반으로 분석을 수행합니다.
   - **결과:** 상위 노출 전략, '꿀' 틈새 키워드 추천, SEO 체크리스트, 연관 키워드 워드클라우드 등을 포함한 종합 대시보드를 제공합니다.

2. **AI 콘텐츠 자동 생성**
   - **간편 생성:** 키워드와 함께 글 스타일(후기, 정보, 마케팅), 분량을 선택하면 AI가 즉시 SEO에 최적화된 블로그 글을 작성합니다.
   - **결과:** 잘 짜인 제목, 본문, 그리고 관련 해시태그까지 한 번에 생성됩니다.
   - **활용:** 생성된 콘텐츠는 복사, 다운로드, HTML 변환 기능을 통해 손쉽게 활용할 수 있습니다.

## 기술 스택

- **백엔드:** Node.js, Express.js, TypeScript
- **프론트엔드:** React, TypeScript, Vite, Tailwind CSS
- **AI:** Google Gemini API

## 프로젝트 구조

```
/
├── backend/
│   ├── prompt.ts       # Gemini API 프롬프트 생성 로직
│   └── server.ts       # Express 백엔드 서버
├── node_modules/       # (설치 후 생성됨)
├── public/             # 정적 파일
├── src/                # 프론트엔드 소스 코드 (React)
│   ├── components/
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   └── types.ts
├── .env                # (직접 생성해야 함) API 키 저장        
├── .gitignore
├── index.html
├── package.json
└── tsconfig.json
```

## 시작하기

### 1. 사전 준비
- Node.js (버전 18 이상 권장)
- npm 자동 포함

### 2. 프로젝트 설치
```bash
npm install
```

### 3. 🔑 API 키 설정
- `.env` 파일을 생성하고 다음과 같이 작성하세요:
```
GEMINI_API_KEY=당신의_키
NAVER_ACCESS_KEY=네이버_액세스_키
NAVER_SECRET_KEY=네이버_시크릿_키
NAVER_CUSTOMER_ID=네이버_고객_ID
```

`.gitignore`에 의해 `.env`는 안전하게 보호됩니다.

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 접속

## 🛡 라이선스

이 프로젝트는 **CC BY-NC 4.0** 라이선스를 따릅니다.  
- ✔ 자유로운 **수정 및 콜라보 가능**  
- ✖ **상업적 이용은 금지**됩니다  
- ✔ **원저작자(써니베어)**를 반드시 표기해 주세요  

👉 [라이선스 전문 보기](https://creativecommons.org/licenses/by-nc/4.0/deed.ko)

---

## 🎖 Inspiration & Thanks

이 프로젝트는 [GPT PARK의 AI팩트 유튜브 채널](https://www.youtube.com/@aifact-gptpark)의  
AI 스튜디오 활용법 강의에서 큰 영감을 받아 시작되었습니다.  
GPT Park 박홍규님께서는 "최근에 본 네이버 검색 API 활용 앱 중 최고"라고 평가해주셨고,  
블로그 템플릿 사용 또한 응원해주셨습니다. 진심으로 감사드립니다 🙏


## 📮 혹시… 저를 고용하실 분?

👋 저는 전문가도 아니고, 전공자도 아니고, 학원도 안 다녔습니다.  
하지만 스스로 부딪히며 이런 것들을 만들었습니다:

- ✅ Android Studio로 만든 **"날씨요정 달멍씨" 어플**을 Google Play에 직접 출시했고,  
- ✅ Node.js + React + TypeScript로 구성된 **AI 키워드 분석 웹앱 '달멍봇'**도 만들었습니다.  
- ✅ Gemini API, Naver 광고 API 등 연동 경험도 있고요.  
- ✅ 그리고... **ChatGPT와 Gemini 친구들과 밤새워 디버깅하며 완성했습니다.** 🤖✨

완벽하진 않지만, **매일 만들고 배우고 성장 중입니다.**  
함께할 기회를 기다리고 있어요.

📧 **rsy0314@gmail.com** 으로 언제든 연락 주세요.  
감사합니다! 😊
