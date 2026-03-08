// app/components/WeatherInfo.tsx
import { MapPin } from 'lucide-react';

interface WeatherData {
  name: string;
  sys: { country: string };
  weather: { main: string; description: string; icon: string }[];
  main: { temp: number; temp_max: number; temp_min: number };
}

interface Props {
  weatherData: WeatherData;
  dataSource?: string;
}

export default function WeatherInfo({ weatherData, dataSource }: Props) {
  const weather = weatherData?.weather?.[0];
  const temp = Math.round(weatherData?.main?.temp ?? 0);
  const tempMax = Math.round(weatherData?.main?.temp_max ?? 0);
  const tempMin = Math.round(weatherData?.main?.temp_min ?? 0);
  const iconUrl = weather
    ? `https://openweathermap.org/img/wn/${weather.icon}@4x.png`
    : '';

  const isKma = dataSource === 'KMA' || dataSource === 'KMA_FORECAST';
  const badgeText =
    dataSource === 'KMA'
      ? '기상청 실황 (KMA)'
      : dataSource === 'KMA_FORECAST'
        ? '기상청 예보 (KMA)'
        : 'OpenWeatherMap';

  return (
    <div className="relative flex items-center justify-between overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-600 to-indigo-800 p-6 text-white shadow-xl">
      {/* ✨ 데이터 출처 뱃지 (우측 상단) */}
      {dataSource && (
        <div
          className={`absolute right-4 top-4 z-10 flex items-center rounded-full border bg-slate-900/50 px-2.5 py-1 text-[10px] font-semibold tracking-wide backdrop-blur-md ${
            isKma
              ? 'border-blue-500/30 text-blue-400'
              : 'border-orange-500/30 text-orange-400'
          }`}
        >
          <span
            className={`mr-1.5 flex h-1.5 w-1.5 rounded-full ${
              isKma ? 'bg-blue-500' : 'bg-orange-500'
            }`}
          ></span>
          {badgeText}
        </div>
      )}
      {/* 배경 장식 (옵션) */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
      <div className="z-10">
        <div className="mb-1 flex items-center space-x-2 text-blue-100">
          <MapPin size={18} />
          <h2 className="text-xl font-medium tracking-wide">
            {weatherData.name}, {weatherData.sys.country}
          </h2>
        </div>

        <div className="mt-2 flex items-baseline space-x-3">
          <span className="text-6xl font-extrabold tracking-tighter">
            {temp}°
          </span>
          <span className="text-xl font-medium text-blue-200">
            {weather?.description}
          </span>
        </div>

        <div className="mt-4 flex space-x-4 text-sm font-medium text-blue-100/80">
          <span>최고: {tempMax}°</span>
          <span>최저: {tempMin}°</span>
        </div>
      </div>
      <div className="z-10 flex-shrink-0">
        {iconUrl && (
          <img
            src={iconUrl}
            alt={weather?.description}
            className="animate-pulse-slow h-32 w-32 drop-shadow-2xl"
          />
        )}
      </div>
    </div>
  );
}
