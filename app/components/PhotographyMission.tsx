// app/components/PhotographyMission.tsx
import React from 'react';

interface Props {
  weatherData: any;
}

export default function PhotographyMission({ weatherData }: Props) {
  if (!weatherData) return null;

  const condition = weatherData.weather[0]?.main;
  const windSpeed = weatherData.wind?.speed || 0;
  const clouds = weatherData.clouds?.all || 0;
  const visibility = weatherData.visibility || 10000;

  const targetDate = weatherData.dt
    ? new Date(weatherData.dt * 1000)
    : new Date();
  const hour = targetDate.getHours();
  const month = targetDate.getMonth() + 1;
  const isNight = hour < 5 || hour > 19;
  const isGoldenHour = (hour >= 6 && hour <= 8) || (hour >= 17 && hour <= 19);

  // 📸 복합 조건에 따른 완벽한 촬영 공략집 로직
  const getMissionDetails = () => {
    if (visibility < 4000) {
      return {
        title: '안개 속 레이어 헌팅',
        desc: '시정이 떨어져 몽환적인 분위기가 연출됩니다. 피사체와 배경의 거리감을 이용해 실루엣을 강조하세요.',
        icon: '🌫️',
        light: '측면광 / 반역광 (빛내림 극대화)',
        metering:
          '스팟 측광 (안개의 하얀 반사율 때문에 노출 +1 스텝 보정 필수)',
        focal: {
          wide: '몽환적인 숲이나 도심 전체의 거대한 스케일 묘사',
          standard: '가까운 주제와 흐릿한 부제의 거리감을 통한 공간감 형성',
          telephoto: '레이어를 강하게 압축하여 안개의 밀도와 겹침 극대화',
        },
      };
    }

    if (condition === 'Rain' || condition === 'Snow') {
      return {
        title: condition === 'Rain' ? '빗속의 감성 스냅' : '설경 속 미니멀리즘',
        desc:
          condition === 'Rain'
            ? '웅덩이의 반영이나 빗방울이 맺힌 유리창 너머의 불빛을 노려보세요.'
            : '셔터스피드를 1/500초 이상으로 세팅하여 눈송이를 공중에 멈추게 하세요.',
        icon: condition === 'Rain' ? '☔' : '❄️',
        light: '역광 (Backlight - 빗방울/눈송이의 보케 발광 효과)',
        metering: '중앙부 중점 측광 (어두운 배경을 찾아 피사체를 부각)',
        focal: {
          wide: '비바람의 방향성과 하늘/땅의 다이나믹한 현장감 포착',
          standard: '우산 쓴 사람, 젖은 골목 등 감성적인 일상 스냅',
          telephoto:
            '배경을 완전히 날리고 빗방울과 눈송이 자체를 거대한 보케로 렌더링',
        },
      };
    }

    if (windSpeed > 8) {
      return {
        title: '바람의 궤적 담기',
        desc: '장노출을 이용해 구름이나 갈대의 역동적인 움직임을 담아보세요. (삼각대 단단히 고정)',
        icon: '💨',
        light: '측면광 (피사체가 흔들릴 때 형태의 변화가 가장 잘 보임)',
        metering: '다분할(평가) 측광 (전체적인 톤 밸런스 유지)',
        focal: {
          wide: '빠르게 흐르는 구름의 장노출 궤적 촬영 (ND 필터 권장)',
          standard: '바람에 맞서는 사람, 흔들리는 간판 등 스토리텔링',
          telephoto:
            '바람에 흩날리는 나뭇가지나 머리카락의 특정 부분만 강렬하게 크롭',
        },
      };
    }

    if (isNight && clouds < 20) {
      return {
        title: '별 헤는 밤, 천체 및 야경 촬영',
        desc: '구름이 거의 없어 별 궤적이나 장노출 야경을 촬영하기 완벽한 하늘입니다.',
        icon: '🌌',
        light: '달빛의 위치 확인 (달이 피사체 측/후면에 있을 때 별이 잘 보임)',
        metering: '수동 모드(M) 필수 (야간에는 카메라 측광이 무의미함)',
        focal: {
          wide: '광활한 은하수와 별 궤적 촬영 (f/1.4~2.8 최대 개방 필수)',
          standard: '별자리와 지상 피사체(텐트, 나무, 건물)의 자연스러운 조화',
          telephoto: '건물 사이로 떠오르는 거대한 달 표면이나 심우주 압축 촬영',
        },
      };
    }

    if (isGoldenHour && clouds < 50) {
      return {
        title: '황금빛 림 라이트 (Rim Light)',
        desc: '태양이 낮게 깔려 빛이 부드럽고 따뜻합니다. 외곽선을 황금빛으로 물들여보세요.',
        icon: '🌅',
        light: '완벽한 역광 (해를 피사체 바로 뒤에 숨기기)',
        metering:
          '스팟 측광 (명부에 맞추면 실루엣, 암부에 맞추면 피사체 디테일 확보)',
        focal: {
          wide: '강렬한 태양의 빛갈라짐(조리개 f/8 이상)과 길어진 그림자 포착',
          standard: '빛과 그림자가 교차하는 길거리의 감성적인 명암 대비',
          telephoto:
            '거대한 태양과 인물/건물의 실루엣을 압축하여 영화처럼 연출',
        },
      };
    }

    if (clouds > 80) {
      return {
        title: '자연이 만든 거대한 소프트박스',
        desc: '짙은 구름이 직사광선을 막아 그림자가 지지 않는 날입니다. 질감이나 색채 표현에 최적입니다.',
        icon: '☁️',
        light: '확산광 (방향성 없는 부드러운 빛)',
        metering:
          '다분할 측광 후 노출 +0.7 보정 (하얀 하늘 때문에 카메라가 어둡게 찍으려 함)',
        focal: {
          wide: '디테일 없는 하얀 하늘은 프레임에서 최대한 배제하고 땅/패턴 위주로 구성',
          standard:
            '부드러운 빛을 활용한 그림자 없는 차분하고 감성적인 인물/정물',
          telephoto:
            '채도가 낮아진 차분하고 약간은 우울한 무드의 미니멀리즘 풍경',
        },
      };
    }

    if (month >= 3 && month <= 5) {
      return {
        title: '봄의 생동감 포착',
        desc: '채도를 살짝 높이고 화사한 봄의 색감을 강조해 보세요.',
        icon: '🌸',
        light: '사광 (꽃잎의 입체감) / 반역광 (꽃잎 잎맥 투과광)',
        metering: '스팟 측광 (가장 밝고 예쁜 꽃잎 중앙에 측광)',
        focal: {
          wide: '꽃밭이나 벚꽃길 전체의 화사한 스케일과 생동감',
          standard: '주제가 되는 꽃 한 송이와 뒷 배경의 적절하고 편안한 조화',
          telephoto:
            '꽃술 디테일 접사 및 뒷 배경을 완벽하게 날려버리는 아웃포커싱',
        },
      };
    }

    if (month >= 9 && month <= 11) {
      return {
        title: '가을빛 컬러 그레이딩',
        desc: '화이트밸런스(K값)를 높여 단풍의 붉고 노란 색채를 극대화해 보세요.',
        icon: '🍁',
        light: '역광 / 반역광 (단풍잎의 투명함과 붉은빛 투과율 극대화)',
        metering: '스팟 측광 (빛을 머금은 단풍잎 1장에 정확히 노출)',
        focal: {
          wide: '알록달록한 산의 능선과 파란 하늘의 강렬한 보색 대비',
          standard: '낙엽 쌓인 길의 소실점과 그 위를 걷는 사람의 스냅',
          telephoto:
            '빛을 머금은 단풍잎 한 장만 검은 배경에 고립시키기 (질감 강조)',
        },
      };
    }

    return {
      title: '드넓은 풍경의 날',
      desc: '시야가 탁 트인 맑은 날씨입니다. 풍경의 입체감을 살려보세요.',
      icon: '☀️',
      light: '사광 (피사체 대각선에서 들어오는 빛으로 입체감/질감 최고조)',
      metering: '다분할(평가) 측광 (가장 안정적이고 균형 잡힌 노출)',
      focal: {
        wide: '탁 트인 파란 하늘과 풍경의 시원한 배치 (CPL 편광 필터 권장)',
        standard: '시각적 왜곡이 없는 가장 자연스럽고 편안한 시선의 스냅',
        telephoto: '멀리 있는 건물의 패턴이나 원경의 특정 부분만 반듯하게 크롭',
      },
    };
  };

  const mission = getMissionDetails();

  return (
    <div className="w-full rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/40 to-slate-900/60 p-6 shadow-xl">
      {/* 1. 타이틀 영역 */}
      <div className="mb-5 flex items-center gap-3 border-b border-indigo-500/20 pb-4">
        <span className="text-3xl" aria-hidden="true">
          {mission.icon}
        </span>
        <div>
          <h3 className="text-xl font-extrabold tracking-tight text-indigo-300">
            {mission.title}
          </h3>
          <p className="mt-1 text-sm text-slate-400">{mission.desc}</p>
        </div>
      </div>

      {/* 2. 빛과 측광 세팅 영역 */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm text-yellow-400">☀️</span>
            <span className="text-xs font-bold text-slate-300">
              최적의 빛 방향
            </span>
          </div>
          <p className="text-sm font-medium text-yellow-200/90">
            {mission.light}
          </p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm text-blue-400">🎯</span>
            <span className="text-xs font-bold text-slate-300">
              추천 측광 모드
            </span>
          </div>
          <p className="text-sm font-medium text-blue-200/90">
            {mission.metering}
          </p>
        </div>
      </div>

      {/* 3. 렌즈 화각별 미션 영역 */}
      <div className="rounded-2xl border border-teal-900/30 bg-slate-900/80 p-4">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg">📷</span>
          <span className="text-sm font-bold text-teal-400">
            렌즈 화각별 실전 팁
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:gap-4">
            <span className="w-16 shrink-0 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-center text-[10px] font-bold text-slate-300">
              광각
              <br />
              <span className="text-[9px] font-normal opacity-70">~35mm</span>
            </span>
            <p className="pt-1 text-sm leading-snug text-slate-300">
              {mission.focal.wide}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:flex-row sm:gap-4">
            <span className="w-16 shrink-0 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-center text-[10px] font-bold text-slate-300">
              표준
              <br />
              <span className="text-[9px] font-normal opacity-70">50mm</span>
            </span>
            <p className="pt-1 text-sm leading-snug text-slate-300">
              {mission.focal.standard}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:flex-row sm:gap-4">
            <span className="w-16 shrink-0 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-center text-[10px] font-bold text-slate-300">
              망원
              <br />
              <span className="text-[9px] font-normal opacity-70">70mm~</span>
            </span>
            <p className="pt-1 text-sm leading-snug text-slate-300">
              {mission.focal.telephoto}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
