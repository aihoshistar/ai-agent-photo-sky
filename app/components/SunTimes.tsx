// app/components/SunTimes.tsx
import React from 'react';

interface Props {
  sunTimes: {
    sunrise: string | null;
    sunset: string | null;
    sunriseAzimuth: number | null;
    sunsetAzimuth: number | null;
  };
}

export default function SunTimes({ sunTimes }: Props) {
  // 방위각(Degree)을 방위(Direction) 텍스트로 변환하는 함수
  const getDirection = (degree?: number | null) => {
    if (degree === undefined || degree === null) return '';
    const dirs = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
    return dirs[Math.round(degree / 45) % 8];
  };

  return (
    <div className="flex h-full flex-col justify-center rounded-3xl border border-slate-700/50 bg-slate-800/80 p-5 shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">🌅</span>
        <h3 className="text-lg font-bold text-slate-200">일출 & 일몰 방위각</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-700/50 bg-slate-900/50 p-3">
          <div>
            <span className="mb-1 block text-xs font-bold text-slate-400">
              일출 (Sunrise)
            </span>
            <span className="text-lg font-extrabold text-orange-400">
              {sunTimes.sunrise || '-'}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-slate-500">방위각</span>
            <span className="text-sm font-bold text-slate-300">
              {sunTimes.sunriseAzimuth
                ? `${Math.round(sunTimes.sunriseAzimuth)}° ${getDirection(sunTimes.sunriseAzimuth)}`
                : '-'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-700/50 bg-slate-900/50 p-3">
          <div>
            <span className="mb-1 block text-xs font-bold text-slate-400">
              일몰 (Sunset)
            </span>
            <span className="text-lg font-extrabold text-red-400">
              {sunTimes.sunset || '-'}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-slate-500">방위각</span>
            <span className="text-sm font-bold text-slate-300">
              {sunTimes.sunsetAzimuth
                ? `${Math.round(sunTimes.sunsetAzimuth)}° ${getDirection(sunTimes.sunsetAzimuth)}`
                : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
