// app/components/MoonPhase.tsx
import React from 'react';
import SunCalc from 'suncalc';

interface Props {
  date: Date;
  lat: number;
  lon: number;
}

export default function MoonPhase({ date, lat, lon }: Props) {
  const moonIllumination = SunCalc.getMoonIllumination(date);
  const moonPosition = SunCalc.getMoonPosition(date, lat, lon);

  const phaseValue = moonIllumination.phase;
  const fraction = Math.round(moonIllumination.fraction * 100);

  // SunCalc의 방위각을 나침반 360도 체계로 변환 (0=남, PI/2=서 -> 0=북, 90=동)
  const azimuthDeg = ((moonPosition.azimuth * 180) / Math.PI + 180) % 360;
  const altitudeDeg = (moonPosition.altitude * 180) / Math.PI;

  const getDirection = (degree: number) => {
    const dirs = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
    return dirs[Math.round(degree / 45) % 8];
  };

  const getPhaseNameAndIcon = (phase: number) => {
    if (phase < 0.03 || phase > 0.97)
      return { name: '삭 (New Moon) - 별 찍기 좋은 날!', icon: '🌑' };
    if (phase < 0.25) return { name: '초승달 (Waxing Crescent)', icon: '🌒' };
    if (phase < 0.28) return { name: '상현달 (First Quarter)', icon: '🌓' };
    if (phase < 0.5)
      return { name: '차오르는 달 (Waxing Gibbous)', icon: '🌔' };
    if (phase < 0.53) return { name: '보름달 (Full Moon)', icon: '🌕' };
    if (phase < 0.75) return { name: '기우는 달 (Waning Gibbous)', icon: '🌖' };
    if (phase < 0.78) return { name: '하현달 (Last Quarter)', icon: '🌗' };
    return { name: '그믐달 (Waning Crescent)', icon: '🌘' };
  };

  const { name, icon } = getPhaseNameAndIcon(phaseValue);

  return (
    <div className="flex h-full flex-col justify-center rounded-3xl border border-slate-700/50 bg-slate-800/80 p-5 shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h3 className="text-lg font-bold text-slate-200">달 위상 & 궤도</h3>
      </div>
      <div className="mb-4 text-center">
        <p className="text-sm font-extrabold text-indigo-300">{name}</p>
        <p className="mt-1 text-xs text-slate-400">
          조명도 (밝기): {fraction}%
        </p>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-2 text-center">
          <span className="block text-[10px] text-slate-500">달의 방위</span>
          <span className="text-xs font-bold text-slate-300">
            {Math.round(azimuthDeg)}° {getDirection(azimuthDeg)}
          </span>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-2 text-center">
          <span className="block text-[10px] text-slate-500">달의 고도</span>
          <span
            className={`text-xs font-bold ${altitudeDeg > 0 ? 'text-teal-400' : 'text-slate-500'}`}
          >
            {altitudeDeg > 0
              ? `${Math.round(altitudeDeg)}° (떠있음)`
              : '지평선 아래'}
          </span>
        </div>
      </div>
    </div>
  );
}
