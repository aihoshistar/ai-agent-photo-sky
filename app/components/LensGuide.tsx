// app/components/LensGuide.tsx
import React from 'react';

interface Props {
  weatherData: any;
}

export default function LensGuide({ weatherData }: Props) {
  if (!weatherData) return null;

  const condition = weatherData.weather[0]?.main;
  const windSpeed = weatherData.wind?.speed || 0;
  const clouds = weatherData.clouds?.all || 0;

  const targetDate = weatherData.dt
    ? new Date(weatherData.dt * 1000)
    : new Date();
  const hour = targetDate.getHours();
  const isNight = hour < 5 || hour > 19;

  // 📸 상황별 추천 화각(mm)과 하드웨어 세팅 로직
  const getHardwareTips = () => {
    if (condition === 'Rain' || condition === 'Snow') {
      return {
        focalLength: '24-70mm (표준 줌 렌즈)',
        tag: '방진방적(Weather Sealing) 필수',
        filter: '렌즈 후드(Hood) 장착 필수',
        desc: '악천후입니다. 야외에서 렌즈 교체를 피하기 위해 전천후 줌 렌즈를 하나만 마운트하세요. 렌즈 앞알에 빗방울이 맺히지 않도록 후드는 선택이 아닌 필수입니다.',
      };
    }
    if (windSpeed > 8) {
      return {
        focalLength: '14-35mm (광각 렌즈)',
        tag: '손떨림 보정 (VR/IS) 활성화',
        filter: 'ND 필터 (장노출 궤적용)',
        desc: '바람이 강해 카메라가 심하게 흔들릴 수 있습니다. 망원 렌즈는 미세한 떨림도 크게 증폭되므로 가급적 광각 계열을 사용하고, 렌즈/바디의 손떨림 보정 기능을 켜세요.',
      };
    }
    if (isNight) {
      return {
        focalLength: '14-24mm 또는 35mm (단렌즈)',
        tag: '가장 밝은 렌즈 (f/1.4 - f/2.8)',
        filter: '빛공해 감소 필터 (Night Filter)',
        desc: '빛이 절대적으로 부족합니다. 밤하늘이나 야경을 넓고 선명하게 담기 위해 초광각을, 노이즈 억제를 위해 조리개가 밝은 단렌즈를 마운트하세요.',
      };
    }
    if (clouds > 80) {
      return {
        focalLength: '50mm / 90mm (표준/매크로 렌즈)',
        tag: '해상력/콘트라스트가 강한 렌즈',
        filter: '필터 제거 (순수 렌즈 화질 집중)',
        desc: '흐린 날은 사진이 밋밋해지기 쉽습니다. 넓은 풍경보다는 50mm나 매크로 렌즈를 활용해 특정 피사체의 질감(잎맥, 이슬 등)을 디테일하게 크롭하는 것이 유리합니다.',
      };
    }
    // 맑은 날 (기본값)
    return {
      focalLength: '16-35mm 또는 24-120mm',
      tag: '풍경용 광각/망원 줌렌즈',
      filter: 'CPL (편광) / UV 필터',
      desc: '빛이 충분하므로 어떤 화각이든 제 성능을 발휘합니다. 광각으로 하늘을 시원하게 담거나, 망원으로 풍경을 압축해 보세요. CPL 필터가 파란 하늘을 극대화해 줍니다.',
    };
  };

  const hardware = getHardwareTips();

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-700/50 bg-slate-800/80 p-5 shadow-lg">
      <div>
        <div className="mb-5 flex items-center gap-2 border-b border-slate-700 pb-3">
          <span className="text-xl">⚙️</span>
          <h3 className="text-lg font-bold text-slate-200">렌즈 & 장비 세팅</h3>
        </div>

        <div className="space-y-4">
          {/* ✨ 새로 추가된 추천 렌즈 화각(mm) 영역 */}
          <div>
            <span className="mb-1.5 inline-block rounded border border-blue-500/30 bg-blue-500/20 px-2 py-1 text-[10px] font-bold text-blue-300">
              추천 렌즈 화각
            </span>
            <p className="text-[15px] font-extrabold text-white">
              {hardware.focalLength}
            </p>
          </div>

          <div>
            <span className="mb-1.5 inline-block rounded border border-indigo-500/30 bg-indigo-500/20 px-2 py-1 text-[10px] font-bold text-indigo-300">
              필수 하드웨어 세팅
            </span>
            <p className="text-sm font-semibold text-slate-200">
              {hardware.tag}
            </p>
          </div>

          <div>
            <span className="mb-1.5 inline-block rounded border border-orange-500/30 bg-orange-500/20 px-2 py-1 text-[10px] font-bold text-orange-300">
              광학 필터 추천
            </span>
            <p className="text-sm font-semibold text-slate-200">
              {hardware.filter}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-700/50 pt-4">
        <p className="text-justify text-[11px] leading-relaxed text-slate-400">
          💡 {hardware.desc}
        </p>
      </div>
    </div>
  );
}
