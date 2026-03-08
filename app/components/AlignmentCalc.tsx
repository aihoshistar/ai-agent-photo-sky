// app/components/AlignmentCalc.tsx
import React, { useState } from 'react';
import SunCalc from 'suncalc';

interface Props {
  date: Date;
  lat: number;
  lon: number;
  weatherData: any; // ✨ 날씨 데이터 Props 추가
}

export default function AlignmentCalc({ date, lat, lon, weatherData }: Props) {
  const [target, setTarget] = useState<'moon' | 'sun'>('moon');
  const [height, setHeight] = useState<number>(50);

  // 1. 천체 위치 및 고도 계산
  const position =
    target === 'moon'
      ? SunCalc.getMoonPosition(date, lat, lon)
      : SunCalc.getPosition(date, lat, lon);

  const altitudeRad = position.altitude;
  const altitudeDeg = altitudeRad * (180 / Math.PI);
  const azimuthDeg = (position.azimuth * (180 / Math.PI) + 180) % 360;

  // 2. 거리 계산 로직
  const isVisible = altitudeDeg > 0;
  let distance = 0;
  if (isVisible) {
    distance = height / Math.tan(altitudeRad);
  }

  // 3. 포맷팅 및 방향
  const formatDistance = (d: number) => {
    if (d >= 1000) return `${(d / 1000).toFixed(2)}km`;
    return `${Math.round(d)}m`;
  };

  const getDirection = (degree: number) => {
    const dirs = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
    return dirs[Math.round(degree / 45) % 8];
  };

  const getRecommendedLens = (dist: number) => {
    if (!isVisible) return '-';
    if (dist < 50) return '14-24mm (초광각)';
    if (dist < 150) return '24-70mm (표준)';
    if (dist < 500) return '70-200mm (망원)';
    if (dist < 1500) return '100-400mm (초망원)';
    return '600mm 이상 (슈퍼 망원)';
  };

  const getSubjectDirection = (degree: number) => {
    return getDirection((degree + 180) % 360);
  };

  // ✨ 4. 날씨 & 타겟 기반 특수 촬영 가이드 로직
  const getAlignmentTips = () => {
    if (!weatherData) return '';
    const clouds = weatherData.clouds?.all || 0;
    const visibility = weatherData.visibility || 10000;

    if (clouds > 80) {
      return `⚠️ 짙은 구름(${clouds}%)으로 인해 ${target === 'sun' ? '태양' : '달'}이 가려질 확률이 매우 높습니다. 구름 사이로 잠깐 빛이 샐 때를 대비해 연사(Burst) 모드를 세팅하고 대기하세요.`;
    }
    if (visibility < 5000) {
      return `⚠️ 가시거리(${visibility / 1000}km)가 짧습니다. 수 킬로미터 밖의 피사체를 망원으로 당기면 대기 중의 먼지로 인해 대비(Contrast)가 훅 떨어집니다. RAW로 촬영 후 후보정(디헤이즈)을 염두에 두세요.`;
    }
    if (target === 'sun') {
      return `🔥 태양 촬영 시 강력한 ND 필터(ND100000 등)가 필수입니다! 필터 없이 망원 렌즈로 태양을 조준하면 카메라 센서가 타버리거나 실명할 위험이 있습니다.`;
    }
    return `✨ 시야가 맑고 깨끗합니다! 달의 크레이터 디테일을 살리기 위해 스팟 측광을 달에 맞추고, 삼각대와 유/무선 릴리즈를 사용해 미세한 블러(흔들림)를 방지하세요.`;
  };

  return (
    <div className="w-full rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl">
      {/* 상단 헤더 및 토글 */}
      <div className="mb-5 flex items-center justify-between border-b border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📐</span>
          <h3 className="text-lg font-bold text-slate-200">
            정렬 (Alignment) 계산기
          </h3>
        </div>
        <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-1">
          <button
            onClick={() => setTarget('sun')}
            className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${target === 'sun' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            ☀️ 태양
          </button>
          <button
            onClick={() => setTarget('moon')}
            className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${target === 'moon' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            🌕 달
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 높이 입력 슬라이더 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-bold text-slate-300">
              피사체(건물/산)의 높이
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value) || 0)}
                className="w-16 rounded border border-slate-700 bg-slate-900 p-1 text-right text-sm text-white focus:border-blue-500 focus:outline-none"
              />
              <span className="text-sm text-slate-400">m</span>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="600"
            step="5"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-blue-500"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-500">
            <span>단층 건물 (5m)</span>
            <span>남산타워 (236m)</span>
            <span>롯데타워 (555m)</span>
          </div>
        </div>

        {/* 계산 결과 표시 */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
          {isVisible ? (
            <>
              {/* ✨ 날씨 기반 특수 가이드 */}
              <div className="mb-1 rounded-xl border border-slate-600/50 bg-slate-800/50 p-3">
                <span className="mb-1 block text-xs font-bold text-blue-300">
                  🌤️ 기상/환경 맞춤 세팅
                </span>
                <p className="break-keep text-xs leading-relaxed text-slate-300">
                  {getAlignmentTips()}
                </p>
              </div>

              <div className="mt-2 flex items-end justify-between">
                <span className="text-xs font-bold text-slate-400">
                  필요한 촬영 거리
                </span>
                <span className="text-2xl font-black text-teal-400">
                  {formatDistance(distance)}
                </span>
              </div>

              <div className="mt-1 grid grid-cols-2 gap-2 border-t border-slate-700/50 pt-3">
                <div>
                  <span className="mb-0.5 block text-[10px] text-slate-500">
                    현재 천체 고도
                  </span>
                  <span className="text-sm font-bold text-slate-300">
                    {altitudeDeg.toFixed(1)}°
                  </span>
                </div>
                <div>
                  <span className="mb-0.5 block text-[10px] text-slate-500">
                    내 위치 기준 방향
                  </span>
                  <span className="text-sm font-bold text-slate-300">
                    {Math.round(azimuthDeg)}° ({getDirection(azimuthDeg)})
                  </span>
                </div>
              </div>

              {/* ✨ 신뢰도를 높여주는 수식 UI 영역 */}
              <div className="mt-2 flex flex-col items-center justify-center rounded-xl border border-slate-700/30 bg-black/30 p-3 font-mono text-xs">
                <span className="mb-2 font-sans text-[10px] tracking-widest text-slate-500">
                  계산 공식 (Trigonometric Formula)
                </span>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="font-bold text-slate-400">거리(D) = </span>
                  <div className="flex flex-col items-center">
                    <span className="border-b border-slate-500 px-2 pb-0.5">
                      {height}m (높이)
                    </span>
                    <span className="pt-0.5">
                      tan({altitudeDeg.toFixed(2)}°)
                    </span>
                  </div>
                  <span className="font-bold text-slate-400">≈</span>
                  <span className="rounded bg-teal-500/10 px-2 py-0.5 font-bold text-teal-400">
                    {formatDistance(distance)}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-center">
                <p className="text-[11px] leading-relaxed text-slate-400">
                  건물에서{' '}
                  <strong className="text-teal-400">
                    {getSubjectDirection(azimuthDeg)}쪽
                  </strong>
                  으로 이동하여{' '}
                  <strong className="text-blue-300">
                    {getRecommendedLens(distance)}
                  </strong>
                  를 사용하세요.
                </p>
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <span className="mb-2 block text-2xl">🌃</span>
              <p className="text-sm font-bold text-slate-400">
                선택한 시간대에 {target === 'sun' ? '태양' : '달'}이 지평선
                아래에 있어 촬영할 수 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
