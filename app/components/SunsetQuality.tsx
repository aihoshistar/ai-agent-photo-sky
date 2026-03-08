// app/components/SunsetQuality.tsx
import React from 'react';

interface Props {
  weatherData: any;
}

export default function SunsetQuality({ weatherData }: Props) {
  if (!weatherData) return null;

  const clouds = weatherData.clouds?.all || 0;
  const humidity = weatherData.main?.humidity || 0;
  const visibility = weatherData.visibility || 10000;

  // 노을 타오를 확률 계산 알고리즘
  let score = 50;

  // 구름 (적당한 구름 30~70%가 빛을 반사해 가장 예쁨)
  if (clouds >= 30 && clouds <= 70) score += 30;
  else if (clouds > 70 && clouds <= 90) score -= 10;
  else if (clouds > 90)
    score -= 40; // 먹구름
  else if (clouds < 30) score += 10; // 구름 없는 맑은 하늘 (예쁘지만 밋밋함)

  // 습도 (낮을수록 빛의 산란이 깨끗함)
  if (humidity < 60) score += 10;
  else if (humidity > 80) score -= 15;

  // 가시거리 (먼지가 없어야 붉은빛이 멀리 퍼짐)
  if (visibility >= 10000) score += 10;
  else if (visibility < 5000) score -= 20;

  score = Math.max(0, Math.min(100, score));

  // 결과 판별
  let status = {
    text: '평범한 맑은 하늘',
    color: 'text-yellow-400',
    desc: '깔끔하지만 다이내믹한 구름은 부족합니다.',
    emoji: '🌤️',
  };
  if (score >= 80)
    status = {
      text: '🔥역대급 불타는 노을🔥',
      color: 'text-red-500',
      desc: '무조건 카메라 들고 당장 뛰어나가세요! 완벽한 노을이 예상됩니다.',
      emoji: '🌅',
    };
  else if (score >= 60 && score < 80)
    status = {
      text: '멋진 황혼 예상',
      color: 'text-orange-400',
      desc: '구름에 반사된 아름다운 빛을 담을 수 있는 좋은 날입니다.',
      emoji: '🌇',
    };
  else if (score < 40)
    status = {
      text: '잿빛 하늘 위험',
      color: 'text-slate-400',
      desc: '구름이 너무 두껍거나 탁해서 해가 가려질 확률이 매우 높습니다.',
      emoji: '☁️',
    };

  return (
    <div className="flex h-full flex-col justify-center rounded-3xl border border-slate-700/50 bg-slate-800/80 p-5 shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">{status.emoji}</span>
        <h3 className="text-lg font-bold text-slate-200">
          노을/여명 버닝 지수
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
        <span
          className={`text-2xl font-black ${status.color} mb-1 drop-shadow-md`}
        >
          {score}%
        </span>
        <span className={`text-sm font-bold ${status.color} mb-3`}>
          {status.text}
        </span>

        {/* 프로그레스 바 */}
        <div className="mb-3 h-2.5 w-full rounded-full bg-slate-700">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-1000"
            style={{ width: `${score}%` }}
          ></div>
        </div>

        <p className="break-keep text-center text-[11px] leading-relaxed text-slate-300">
          {status.desc} <br />
          <span className="text-slate-500">
            (구름양 {clouds}%, 가시거리 {visibility / 1000}km 반영)
          </span>
        </p>
      </div>
    </div>
  );
}
