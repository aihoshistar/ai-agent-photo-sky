// app/components/LocationMap.tsx
import { MapPin } from 'lucide-react';

interface Props {
  lat: number;
  lon: number;
  locationName: string;
}

export default function LocationMap({ lat, lon, locationName }: Props) {
  // Google Maps Embed URL 생성 (API 키가 없어도 기본 기능은 동작하지만, 정식 사용 시 발급 권장)
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-emerald-400">
        <MapPin size={20} /> 위치 확인
      </h2>

      <div className="relative min-h-[200px] w-full flex-grow overflow-hidden rounded-2xl border border-gray-700">
        <iframe
          title="Location Map"
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: 'grayscale(0.5) invert(0.9) contrast(1.2)',
          }} // 다크 모드 테마에 맞춘 필터
          src={mapUrl}
          allowFullScreen
        ></iframe>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500">
        <span>
          좌표: {lat.toFixed(4)}, {lon.toFixed(4)}
        </span>
        <span className="font-bold text-gray-400">{locationName}</span>
      </div>
    </div>
  );
}
