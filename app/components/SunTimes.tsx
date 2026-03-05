// app/components/SunTimes.tsx
import { Sunrise, Sunset } from 'lucide-react';

interface SunTimes {
  sunrise?: string;
  sunset?: string;
}

interface Props {
  sunTimes: SunTimes;
}

export default function SunTimes({ sunTimes }: Props) {
  return (
    // <div className="mb-4 p-5 bg-gray-800 rounded-xl shadow-lg border border-gray-700"></div>
    <div className="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex flex-col h-full justify-between">
      <h2 className="text-xl font-semibold mb-6 text-orange-300 flex items-center gap-2">
        <Sunrise size={20} className="text-orange-400" /> 일출 및 일몰
      </h2>

      <div className="grid grid-cols-2 gap-4 flex-grow items-center">
        {/* 일출 섹션 */}
        <div className="flex flex-col items-center p-4 bg-gray-900/40 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-colors">
          <Sunrise className="text-orange-400 mb-3" size={28} />
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
            Sunrise
          </span>
          <span className="text-xl font-black text-white">
            {sunTimes.sunrise || '--:--'}
          </span>
        </div>

        {/* 일몰 섹션 */}
        <div className="flex flex-col items-center p-4 bg-gray-900/40 rounded-2xl border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
          <Sunset className="text-indigo-400 mb-3" size={28} />
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
            Sunset
          </span>
          <span className="text-xl font-black text-white">
            {sunTimes.sunset || '--:--'}
          </span>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-gray-500 text-center italic">
        *촬영지의 현지 시간 기준입니다.
      </p>
    </div>
  );
}
