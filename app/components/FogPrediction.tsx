// app/components/FogPrediction.tsx
import { Waves } from 'lucide-react';

interface Props {
  fogPrediction: string;
}

export default function FogPrediction({ fogPrediction }: Props) {
  const value = parseFloat(fogPrediction);
  
  // 수치에 따른 위험도/기대치 텍스트 및 색상 결정
  const getFogStatus = (val: number) => {
    if (val > 70) return { label: '매우 높음', desc: '몽환적인 안개 촬영 최적', color: 'text-purple-400' };
    if (val > 40) return { label: '보통', desc: '낮은 구름이나 옅은 안개 가능성', color: 'text-blue-400' };
    return { label: '낮음', desc: '매우 맑고 선명한 시계', color: 'text-emerald-400' };
  };

  const status = getFogStatus(value);

  return (
    <div className="p-6 bg-gray-800 rounded-3xl shadow-lg border border-gray-700 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-1 text-indigo-300 flex items-center gap-2">
          <Waves size={20} /> 안개 예측 지수
        </h2>
        <p className="text-xs text-gray-400 mb-4">습도, 온도차, 풍속 기반 분석</p>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className={`text-3xl font-black ${status.color}`}>
            {value.toFixed(1)}
          </span>
          <span className={`text-sm font-bold mt-1 ${status.color}`}>
            {status.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 text-right max-w-[120px] leading-tight">
          {status.desc}
        </p>
      </div>

      {/* 단순 프로그레스 바 형태의 시각화 */}
      <div className="w-full h-2 bg-gray-900 rounded-full mt-4 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            value > 70 ? 'bg-purple-500' : value > 40 ? 'bg-blue-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(value, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}