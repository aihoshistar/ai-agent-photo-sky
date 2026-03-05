// app/components/FeatureGuide.tsx
import { SunMedium, Focus, Camera, Wind } from 'lucide-react';

export default function FeatureGuide() {
  const features = [
    {
      icon: <SunMedium className="text-orange-400" size={20} />,
      title: '매직아워 분석',
      desc: '골든/블루아워 시간을 분 단위로 제공합니다.',
    },
    {
      icon: <Focus className="text-blue-400" size={20} />,
      title: '측광 미션',
      desc: '날씨에 맞는 스팟/멀티 측광 팁을 제안합니다.',
    },
    {
      icon: <Camera className="text-teal-400" size={20} />,
      title: 'Zf 최적화',
      desc: '렌즈 특성과 카메라 세팅 가이드를 포함합니다.',
    },
    {
      icon: <Wind className="text-indigo-400" size={20} />,
      title: '정밀 기상',
      desc: '안개 지수와 가시거리로 촬영 환경을 예측합니다.',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 w-full">
      {features.map((f, i) => (
        <div
          key={i}
          className="flex flex-col items-center p-3 bg-slate-800/30 border border-slate-700/50 rounded-2xl backdrop-blur-sm"
        >
          <div className="mb-2 p-2 bg-slate-900/50 rounded-full">{f.icon}</div>
          <h4 className="text-xs font-bold text-slate-200 mb-1">{f.title}</h4>
          <p className="text-[10px] text-slate-400 text-center leading-tight break-keep">
            {f.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
