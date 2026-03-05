// app/components/CloudVisibility.tsx
interface Props {
  cloudCover: number;
  visibility: number;
}

export default function CloudVisibility({ cloudCover, visibility }: Props) {
  // 가시거리를 미터(m)에서 킬로미터(km)로 변환
  const visibilityKm = (visibility / 1000).toFixed(1);

  return (
    <div className="mb-4 p-5 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">촬영 환경</h2>
      <div className="flex justify-between items-center">
        {/* 구름양 정보 */}
        <div className="flex flex-col items-center w-1/2 border-r border-gray-600">
          <span className="text-gray-400 text-sm mb-1">구름양</span>
          <span className="text-2xl font-bold">
            {cloudCover}
            <span className="text-lg font-normal text-gray-300">%</span>
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {cloudCover > 80
              ? '흐림 (부드러운 빛)'
              : cloudCover > 30
              ? '적당함 (드라마틱한 하늘)'
              : '맑음 (강한 대비)'}
          </span>
        </div>

        {/* 가시거리 정보 */}
        <div className="flex flex-col items-center w-1/2">
          <span className="text-gray-400 text-sm mb-1">가시거리</span>
          <span className="text-2xl font-bold">
            {visibilityKm}
            <span className="text-lg font-normal text-gray-300">km</span>
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {visibility >= 10000
              ? '탁 트임 (풍경 사진 최적)'
              : visibility >= 4000
              ? '보통'
              : '흐림/안개 (몽환적 연출)'}
          </span>
        </div>
      </div>
    </div>
  );
}
