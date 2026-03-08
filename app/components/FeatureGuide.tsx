// app/components/FeatureGuide.tsx
import React from 'react';

export default function FeatureGuide() {
  const features = [
    {
      icon: '📐',
      title: '천체 정렬 및 궤적 추적',
      description:
        '단순한 매직아워를 넘어, 해와 달의 방위각을 계산해 피사체와의 완벽한 정렬 거리를 역산합니다.',
      color: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
    },
    {
      icon: '🎯',
      title: '상황별 촬영 전술 설계',
      description:
        '빛의 방향과 기상 조건을 분석하여, 현장에 가장 적합한 측광 모드와 노출 삼각지대를 제안합니다.',
      color: 'from-indigo-500/20 to-indigo-500/5',
      borderColor: 'border-indigo-500/20',
      iconBg: 'bg-indigo-500/20',
    },
    {
      icon: '📷',
      title: '광학 기어 및 초점 최적화',
      description:
        '팬포커스를 위한 과초점 거리 계산부터, 날씨에 따른 필수 렌즈와 동적 패킹 리스트를 제공합니다.',
      color: 'from-teal-500/20 to-teal-500/5',
      borderColor: 'border-teal-500/20',
      iconBg: 'bg-teal-500/20',
    },
    {
      icon: '🌅',
      title: '대기 상태 및 노을 예측',
      description:
        '구름양과 가시거리, 습도를 융합 분석해 안개 발생률과 오늘 저녁 노을의 버닝(Burning) 지수를 예측합니다.',
      color: 'from-orange-500/20 to-orange-500/5',
      borderColor: 'border-orange-500/20',
      iconBg: 'bg-orange-500/20',
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`flex flex-col items-start gap-4 rounded-2xl bg-gradient-to-br p-5 sm:flex-row sm:items-center ${feature.color} border ${feature.borderColor} backdrop-blur-sm transition-all hover:bg-slate-800/80`}
        >
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${feature.iconBg} text-2xl shadow-inner`}
          >
            {feature.icon}
          </div>
          <div>
            <h3 className="mb-1.5 text-sm font-bold tracking-tight text-slate-200 md:text-base">
              {feature.title}
            </h3>
            <p className="break-keep text-[11px] leading-relaxed text-slate-400 md:text-xs">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
