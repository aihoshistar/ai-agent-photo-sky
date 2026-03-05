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
    <div className="p-6 bg-gray-800 rounded-3xl shadow-lg border border-gray-700 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
        <MapPin size={20} /> 위치 확인
      </h2>

      <div className="relative w-full flex-grow min-h-[200px] rounded-2xl overflow-hidden border border-gray-700">
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

      <div className="mt-4 flex justify-between items-center text-[11px] text-gray-500">
        <span>
          좌표: {lat.toFixed(4)}, {lon.toFixed(4)}
        </span>
        <span className="font-bold text-gray-400">{locationName}</span>
      </div>
    </div>
  );
}
