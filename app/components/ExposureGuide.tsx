// app/components/ExposureGuide.tsx
import { Zap, Info } from 'lucide-react';

interface Props {
  weatherData: any;
}

export default function ExposureGuide({ weatherData }: Props) {
  const condition = weatherData.weather?.[0]?.main || 'Clear';
  const isNight = new Date().getHours() >= 18 || new Date().getHours() <= 6;

  // 가이드 기반 추천 세팅값 [cite: 88, 89]
  const getRecommendation = () => {
    if (isNight) {
      return {
        shutter: '1/125초 이상',
        iso: '자동 (최대 12800)',
        tip: '네온사인 촬영 시 스팟 측광으로 화이트홀을 방지하세요.',
      };
    }
    if (condition === 'Clouds') {
      return {
        shutter: '1/250초',
        iso: '100-400',
        tip: '부드러운 사광을 활용해 인물 아웃포커싱을 시도해보세요.',
      };
    }
    return {
      shutter: '1/1000초 이상',
      iso: '100 (최저)',
      tip: '쨍한 순광입니다. 픽처 컨트롤을 [선명하게]로 설정하세요.',
    };
  };

  const rec = getRecommendation();

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 rounded-3xl shadow-lg border border-indigo-500/20 h-full">
      <h2 className="text-xl font-semibold mb-4 text-yellow-400 flex items-center gap-2">
        <Zap size={20} fill="currentColor" /> 실전 노출 가이드
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-black/30 rounded-2xl border border-white/5">
          <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">
            Target SS
          </span>
          <span className="text-sm font-bold text-white">{rec.shutter}</span>
        </div>
        <div className="p-3 bg-black/30 rounded-2xl border border-white/5">
          <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
            Rec. ISO
          </span>
          <span className="text-sm font-bold text-white">{rec.iso}</span>
        </div>
      </div>

      <div className="flex gap-2 p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[12px] text-blue-100 leading-tight break-keep">
          {rec.tip} [cite: 29, 62, 90]
        </p>
      </div>
    </div>
  );
}
