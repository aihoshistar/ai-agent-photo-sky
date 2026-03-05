// app/components/MoonPhase.tsx
import SunCalc from 'suncalc';
import { Moon } from 'lucide-react';

interface Props {
  date: Date;
}

export default function MoonPhase({ date }: Props) {
  const moonIllum = SunCalc.getMoonIllumination(date);

  // 밝기 퍼센트 및 위상 이름 결정
  const illumination = Math.round(moonIllum.fraction * 100);

  const getPhaseName = (phase: number) => {
    if (phase <= 0.03 || phase >= 0.97) return '신월 (New Moon)';
    if (phase < 0.25) return '초승달 (Waxing Crescent)';
    if (phase < 0.3) return '상현달 (First Quarter)';
    if (phase < 0.45) return '상현달 (Waxing Gibbous)';
    if (phase <= 0.55) return '보름달 (Full Moon)';
    if (phase < 0.75) return '하현달 (Waning Gibbous)';
    if (phase < 0.8) return '하현달 (Last Quarter)';
    return '그믐달 (Waning Crescent)';
  };

  const phaseName = getPhaseName(moonIllum.phase);

  return (
    <div className="p-6 bg-gray-800 rounded-3xl shadow-lg border border-gray-700 flex flex-col h-full justify-between">
      <h2 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center gap-2">
        <Moon size={20} className="text-indigo-400" /> 달의 위상
      </h2>

      <div className="flex flex-col items-center justify-center flex-grow py-4">
        <div className="relative mb-4">
          {/* 달 아이콘 시각화 (밝기에 따른 투명도 조절) */}
          <Moon
            size={64}
            className="text-yellow-100 drop-shadow-[0_0_15px_rgba(253,251,232,0.5)]"
            style={{ opacity: 0.3 + moonIllum.fraction * 0.7 }}
          />
        </div>
        <span className="text-xl font-black text-white">{illumination}%</span>
        <span className="text-sm font-medium text-indigo-200 mt-1">
          {phaseName}
        </span>
      </div>

      <p className="text-[11px] text-gray-500 text-center leading-tight">
        {moonIllum.fraction < 0.2
          ? '하늘이 매우 어두워 야경 대비 촬영에 최적입니다.'
          : '달빛이 밝아 암부 표현 시 노출 주의가 필요합니다.'}
      </p>
    </div>
  );
}
