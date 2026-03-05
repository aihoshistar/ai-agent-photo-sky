# 📸 PhotoSky: Photographer's Smart Weather Agent

> **Live Demo: [https://ai-agent-photo-sky.vercel.app](https://ai-agent-photo-sky.vercel.app/)**

**PhotoSky**는 사진작가의 시선에서 날씨를 해석합니다. 단순히 '맑음'을 알리는 것이 아니라, 그 맑은 날씨에 어떤 **빛의 방향**을 선택하고 **Nikon Zf**를 어떻게 세팅해야 하는지 실시간으로 가이드합니다.

---

## ✨ 핵심 기능 (Core Features)

### 1. 🎯 실시간 실전 촬영 가이드

* **날씨 맞춤형 미션**: 현재 기상 상태(맑음, 흐림, 비/안개)를 분석하여 이번 주 숙제 가이드에 최적화된 촬영 미션을 제안합니다.
* **Zf + 24-70mm f/4 S 최적화**: 렌즈의 최단 촬영 거리(30cm) 활용법과 침동식 구조 주의사항, 아웃포커싱 공식을 상시 제공합니다.

### 2. 🌤️ 정밀 기상 및 채광 분석

* **매직 아워 타임라인**: 골든 아워와 블루 아워를 분 단위로 계산하여 황금 같은 촬영 타이밍을 놓치지 않게 합니다.
* **안개 예측 지수 (Fog Index)**: 습도, 온도차, 풍속을 결합하여 몽환적인 안개 사진을 찍을 수 있는 확률을 분석합니다.
* **달의 위상 (Moon Phase)**: 월광 지수를 통해 야간 촬영 시 암부(Black Hole) 표현의 깊이를 예측합니다.

### 3. ⚙️ 지능형 노출 가이드 (Exposure Helper)

* **실시간 세팅 추천**: 현재 조도와 날씨를 바탕으로 Zf의 추천 ISO, 셔터 스피드, 픽처 컨트롤(선명하게, 딥톤 모노크롬 등)을 제안합니다.

---

## 🤖 AI 에이전트 협업 시스템 (Development Context)

이 프로젝트는 파이썬 기반의 **AI 에이전트 팀**에 의해 초기에 설계 및 구현되었습니다. 각 에이전트는 고유한 페르소나를 가지고 프로젝트를 발전시켰습니다.

* **PM (Gemma3-12B)**: 요구사항 분석 및 기능 정의.
* **Dev (Qwen2.5-Coder-14B)**: Next.js(App Router) 기반의 아키텍처 설계 및 TypeScript 코드 작성.
* **Designer (Qwen2.5-Coder-14B)**: Tailwind CSS를 활용한 모던 벤토 그리드(Bento Grid) UI 구현.
* **QA (GLM-4.7-Flash)**: 엣지 케이스 테스트 및 최종 코드 승인.

### 주요 자동화 명령어

* `!auto [요구사항]`: PM-Dev-Designer-QA로 이어지는 자율 개발 루프 가동.
* `!pushall`: 로컬 워크스페이스의 코드를 GitHub 레포지토리로 자동 동기화.
* `!deploy`: Vercel API를 통해 즉시 프로덕션 환경 배포.

---

## 🛠️ 기술 스택 (Tech Stack)

### Frontend & App

* **Framework**: Next.js 16 (App Router)
* **Styling**: Tailwind CSS (Bento Grid Layout)
* **Icons**: Lucide-React
* **PWA**: `@ducanh2912/next-pwa` (오프라인 접근 가능)

### AI & Backend

* **AI Models**: Ollama (Gemma3, Qwen2.5-Coder)
* **Automation**: Python (discord.py, PyGithub, Subprocess)
* **Database**: SQLite3 (대화 기록 및 문맥 유지)
* **API**: OpenWeatherMap API, SunCalc

---

## 🚀 시작하기

### 1. 환경 변수 설정 (.env)

```env
WEATHER_API_KEY=your_openweathermap_key
GITHUB_TOKEN=your_github_token
GITHUB_REPO=your_id/repo_name
VERCEL_TOKEN=your_vercel_token
DISCORD_BOT_TOKEN=your_bot_token

```

### 2. 로컬 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

```

### 3. AI 에이전트 가동 (Python)

```bash
python bot.py

```

---

## 📖 학습 참조 (Reference)

이 프로젝트는 **[실전 촬영 숙제 가이드 - 서울 도심 & Zf 편]**의 내용을 충실히 반영하고 있습니다.

* **빛의 5가지 방향**: 순광, 사광, 측광, 역사광, 역광 활용법 포함.
* **측광 모드**: 스팟 측광과 멀티 패턴 측광의 차이점을 기상 상황에 연결.
* **ISO 자동 제어**: 야간 촬영 시 Zf의 고감도 노이즈 억제력을 활용한 안전장치 세팅 가이드 포함.

---

**PhotoSky**와 함께 빛을 이해하고, 당신의 **Zf**로 인생샷을 남겨보세요! ✨

---
