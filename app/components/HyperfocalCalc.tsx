// app/components/HyperfocalCalc.tsx
import React, { useState } from 'react';

export default function HyperfocalCalc() {
  const [sensor, setSensor] = useState<number>(0.03); // 풀프레임 기본값
  const [focalLength, setFocalLength] = useState<number>(24); // 24mm
  const [aperture, setAperture] = useState<number>(8); // f/8

  // 과초점 거리 계산 공식: H = (f^2) / (N * c)
  const hyperfocalMM = (focalLength * focalLength) / (aperture * sensor);
  const hyperfocalM = hyperfocalMM / 1000;
  const nearLimitM = hyperfocalM / 2;

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl">
      <div>
        <div className="mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
          <span className="text-xl">🏔️</span>
          <h3 className="text-lg font-bold text-slate-200">
            과초점 (Pan-focus) 계산기
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-400">
                센서 크기
              </label>
              <select
                value={sensor}
                onChange={(e) => setSensor(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value={0.03}>풀프레임 (FF)</option>
                <option value={0.02}>크롭 (APS-C)</option>
                <option value={0.015}>마이크로포서드</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-400">
                초점 거리 (mm)
              </label>
              <input
                type="number"
                value={focalLength}
                onChange={(e) => setFocalLength(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400">
                조리개 (f/{aperture})
              </label>
            </div>
            <input
              type="range"
              min="1.4"
              max="22"
              step="0.5"
              value={aperture}
              onChange={(e) => setAperture(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-xs font-bold text-slate-400">
            맞춰야 할 초점 거리
          </span>
          <span className="text-2xl font-black text-teal-400">
            {hyperfocalM.toFixed(2)}m
          </span>
        </div>
        <p className="break-keep border-t border-slate-700/50 pt-2 text-xs leading-relaxed text-slate-300">
          카메라 초점을{' '}
          <strong className="text-teal-400">{hyperfocalM.toFixed(2)}m</strong>{' '}
          앞의 피사체에 맞추세요. 그러면{' '}
          <strong className="text-blue-300">{nearLimitM.toFixed(2)}m</strong>
          부터
          <strong className="text-blue-300"> 무한대(∞)</strong>까지 모든 풍경이
          선명하게(쨍하게) 찍힙니다!
        </p>
      </div>
    </div>
  );
}
