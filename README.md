# 🌌 Atmos (애트모스) 
### 사진작가를 위한 정밀 기상 및 채광 컴퓨테이셔널 대시보드
> "완벽한 셔터 찬스는 기다리는 것이 아니라, 계산하는 것입니다."

Atmos는 단순한 날씨 앱을 넘어, 사진작가가 현장에서 직면하는 기상과 광학적 변수를 데이터로 시각화하여 최적의 촬영 전술을 설계할 수 있도록 돕는 전문 도구입니다.

---

## ✨ 핵심 기능 (Key Features)

### 🧭 1. 천체 궤적 및 정렬 시뮬레이션
* **라이브 궤적 나침반:** 현재 위치와 시간에 따른 태양과 달의 방위각/고도를 SVG 그래픽으로 실시간 시각화합니다.
* **정렬(Alignment) 계산기:** 피사체(건물/산)의 높이를 입력하면, 천체와 겹쳐 찍기 위해 필요한 정확한 촬영 거리와 방향을 삼각함수로 역산합니다.

### 🌅 2. 대기 지능형 분석
* **노을 버닝(Burning) 지수:** 구름의 양, 습도, 가시거리를 융합 분석하여 오늘 저녁 노을이 붉게 타오를 확률을 예측합니다.
* **정밀 안개 지수:** 기온 차와 습도, 풍속을 바탕으로 안개 발생 가능성을 수치화합니다.

### 📷 3. 광학 및 기어 가이드
* **과초점(Hyperfocal) 계산기:** 센서 크기와 화각에 따른 과초점 거리를 계산하여 풍경 사진의 팬포커싱을 지원합니다.
* **상황별 렌즈 팁:** 날씨와 시정에 최적화된 렌즈 화각(mm)과 필수 광학 필터(CPL/ND)를 제안합니다.
* **동적 체크리스트:** 기상 예보에 맞춰 레인커버, 삼각대 스톤백, 렌즈 핫팩 등 필요한 장비를 자동으로 리스트업합니다.

### 🏙️ 4. 로컬라이징 및 시뮬레이션
* **한국어 지명 패치:** OpenWeatherMap의 외국어 지명을 Geocoding API를 통해 정확한 한국어 행정구역명으로 제공합니다.
* **시간 여행(Simulator):** 탭 클릭 한 번으로 미래의 기상과 천체 위치를 즉시 시뮬레이션합니다.

---

## 🛠️ 기술 스택 (Tech Stack)

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Glassmorphism UI)
* **Data Fetching:** Axios
* **Celestial Math:** SunCalc
* **Weather Data:** OpenWeatherMap API + 기상청(KMA) 단기예보 API (Hybrid)
* **Formatting:** Prettier + Tailwind Merge

---

## 🚀 시작하기 (Getting Started)

### 1. 환경 변수 설정
루트 디렉토리에 `.env` 파일을 생성하고 아래 키를 입력하세요.
```env
WEATHER_API_KEY=your_openweathermap_api_key
KMA_API_KEY=your_kma_encoding_service_key

```

### 2. 패키지 설치 및 실행

```bash
npm install
npm run dev

```

---

## 📐 계산 공식 (Mathematical Formulas)

Atmos는 신뢰할 수 있는 계산 결과를 위해 아래와 같은 수식을 사용합니다.

* **촬영 거리 계산 (Alignment):** 
$$D = \frac{H}{\tan(\theta)}$$



*(D: 거리, H: 피사체 높이, θ: 천체 고도)*
* **과초점 거리 (Hyperfocal):**

$$H = \frac{f^2}{N \cdot c}$$



*(f: 초점 거리, N: 조리개 값, c: 착락원 지름)*

---

## 👤 만든 사람 (Developer)

**PARK KYOUNGSEO**

* 🌐 [Portfolio Website](http://kkyungvelyy.com/)
* ✍️ [Technical Blog](https://troublesome-dev.tistory.com/)
* 🐙 [GitHub Profile](https://github.com/aihoshistar)

---

## ⚖️ License

This project is for personal portfolio and educational purposes.
