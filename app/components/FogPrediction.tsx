// app/components/FogPrediction.tsx
import { Waves } from 'lucide-react';

interface Props {
  fogPrediction: string;
}

export default function FogPrediction({ fogPrediction }: Props) {
  const value = parseFloat(fogPrediction);

  // 수치에 따른 위험도/기대치 텍스트 및 색상 결정
  const getFogStatus = (val: number) => {
    if (val > 70)
      return {
        label: '매우 높음',
        desc: '몽환적인 안개 촬영 최적',
        color: 'text-purple-400',
      };
    if (val > 40)
      return {
        label: '보통',
        desc: '낮은 구름이나 옅은 안개 가능성',
        color: 'text-blue-400',
      };
    return {
      label: '낮음',
      desc: '매우 맑고 선명한 시계',
      color: 'text-emerald-400',
    };
  };

  const status = getFogStatus(value);

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
      <div>
        <h2 className="mb-1 flex items-center gap-2 text-xl font-semibold text-indigo-300">
          <Waves size={20} /> 안개 예측 지수
        </h2>
        <p className="mb-4 text-xs text-gray-400">
          습도, 온도차, 풍속 기반 분석
        </p>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className={`text-3xl font-black ${status.color}`}>
            {value.toFixed(1)}
          </span>
          <span className={`mt-1 text-sm font-bold ${status.color}`}>
            {status.label}
          </span>
        </div>
        <p className="max-w-[120px] text-right text-xs leading-tight text-gray-500">
          {status.desc}
        </p>
      </div>

      {/* 단순 프로그레스 바 형태의 시각화 */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-900">
        <div
          className={`h-full transition-all duration-1000 ${
            value > 70
              ? 'bg-purple-500'
              : value > 40
                ? 'bg-blue-500'
                : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(value, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
