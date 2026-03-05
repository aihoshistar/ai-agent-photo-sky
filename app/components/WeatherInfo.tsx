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
}

export default function WeatherInfo({ weatherData }: Props) {
  const weather = weatherData?.weather?.[0];
  const temp = Math.round(weatherData?.main?.temp ?? 0);
  const tempMax = Math.round(weatherData?.main?.temp_max ?? 0);
  const tempMin = Math.round(weatherData?.main?.temp_min ?? 0);
  const iconUrl = weather
    ? `https://openweathermap.org/img/wn/${weather.icon}@4x.png`
    : '';

  return (
    <div className="relative overflow-hidden p-6 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl shadow-xl border border-blue-500/30 text-white flex justify-between items-center">
      {/* 배경 장식 (옵션) */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10">
        <div className="flex items-center space-x-2 text-blue-100 mb-1">
          <MapPin size={18} />
          <h2 className="text-xl font-medium tracking-wide">
            {weatherData.name}, {weatherData.sys.country}
          </h2>
        </div>

        <div className="flex items-baseline space-x-3 mt-2">
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
            className="w-32 h-32 drop-shadow-2xl animate-pulse-slow"
          />
        )}
      </div>
    </div>
  );
}
