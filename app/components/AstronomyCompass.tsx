// app/components/AstronomyCompass.tsx
import React from 'react';
import SunCalc from 'suncalc';

interface Props {
  date: Date;
  lat: number;
  lon: number;
}

export default function AstronomyCompass({ date, lat, lon }: Props) {
  // 1. 데이터 계산
  const sunPos = SunCalc.getPosition(date, lat, lon);
  const moonPos = SunCalc.getMoonPosition(date, lat, lon);
  const moonPhase = SunCalc.getMoonIllumination(date).phase;

  // 라디안을 나침반 360도로 변환 (북=0, 동=90, 남=180, 서=270)
  const toCompassDeg = (rad: number) => (rad * (180 / Math.PI) + 180) % 360;

  const sunAzimuth = toCompassDeg(sunPos.azimuth);
  const moonAzimuth = toCompassDeg(moonPos.azimuth);

  const sunAltitude = sunPos.altitude * (180 / Math.PI);
  const moonAltitude = moonPos.altitude * (180 / Math.PI);

  // 2. SVG 원형 좌표 계산기 (반지름 r, 각도 degree)
  const getCoordinates = (degree: number, radius: number) => {
    const rad = (degree - 90) * (Math.PI / 180); // -90은 12시 방향(북)을 0도로 맞추기 위함
    return {
      x: 100 + radius * Math.cos(rad),
      y: 100 + radius * Math.sin(rad),
    };
  };

  const sunCoords = getCoordinates(sunAzimuth, 70);
  const moonCoords = getCoordinates(moonAzimuth, 50);

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-800/80 p-5 shadow-lg">
      {/* 백그라운드 빛샘 효과 */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-gradient-to-br from-indigo-500/5 to-orange-500/5" />

      <div className="mb-2 flex w-full items-center gap-2 border-b border-slate-700 pb-2">
        <span className="text-xl">🧭</span>
        <h3 className="text-lg font-bold text-slate-200">라이브 궤적 나침반</h3>
      </div>

      <div className="relative mt-2 h-48 w-48">
        {/* SVG 나침반 그리기 */}
        <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-md">
          {/* 바깥쪽 테두리 (지평선) */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#334155"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* 안쪽 궤도 선 */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1"
            opacity="0.2"
          />
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1"
            opacity="0.2"
          />

          {/* 십자선 (동서남북) */}
          <line
            x1="100"
            y1="10"
            x2="100"
            y2="190"
            stroke="#334155"
            strokeWidth="1"
            opacity="0.5"
          />
          <line
            x1="10"
            y1="100"
            x2="190"
            y2="100"
            stroke="#334155"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* 방위 텍스트 */}
          <text
            x="100"
            y="22"
            fill="#94a3b8"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            N
          </text>
          <text
            x="100"
            y="186"
            fill="#94a3b8"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            S
          </text>
          <text
            x="186"
            y="104"
            fill="#94a3b8"
            fontSize="10"
            fontWeight="bold"
            textAnchor="end"
          >
            E
          </text>
          <text
            x="14"
            y="104"
            fill="#94a3b8"
            fontSize="10"
            fontWeight="bold"
            textAnchor="start"
          >
            W
          </text>

          {/* ☀️ 태양 위치 마커 */}
          <circle
            cx={sunCoords.x}
            cy={sunCoords.y}
            r="14"
            fill="#1e293b"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <text
            x={sunCoords.x}
            y={sunCoords.y + 4}
            fontSize="12"
            textAnchor="middle"
          >
            {sunAltitude > 0 ? '☀️' : '🌑'}
          </text>

          {/* 🌙 달 위치 마커 */}
          <circle
            cx={moonCoords.x}
            cy={moonCoords.y}
            r="12"
            fill="#1e293b"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <text
            x={moonCoords.x}
            y={moonCoords.y + 4}
            fontSize="10"
            textAnchor="middle"
          >
            {moonAltitude > 0 ? '🌕' : '🌑'}
          </text>
        </svg>

        {/* 중앙 장식 */}
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-slate-900 bg-slate-600" />
      </div>

      <div className="mt-4 flex w-full justify-between px-2">
        <div className="text-center">
          <span className="block text-[10px] font-bold text-yellow-500">
            태양 방위각
          </span>
          <span className="font-mono text-xs text-slate-300">
            {Math.round(sunAzimuth)}°
          </span>
        </div>
        <div className="text-center">
          <span className="block text-[10px] font-bold text-blue-400">
            달 방위각
          </span>
          <span className="font-mono text-xs text-slate-300">
            {Math.round(moonAzimuth)}°
          </span>
        </div>
      </div>
    </div>
  );
}
