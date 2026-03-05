// app/components/HourlyForecast.tsx
interface ForecastItem {
  dt: number;
  main: { temp: number };
  weather: { description: string; icon: string }[];
  clouds: { all: number };
  pop: number; // 강수 확률 (0 ~ 1)
}

interface Props {
  forecastList: ForecastItem[];
}

export default function HourlyForecast({ forecastList }: Props) {
  if (!forecastList || forecastList.length === 0) return null;

  // 향후 24시간 예보만 추출 (3시간 간격이므로 8개)
  const next24Hours = forecastList.slice(0, 8);

  return (
    <div className="mb-4 p-5 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      <h2 className="text-xl font-semibold mb-4 text-teal-300">
        시간대별 예보 (24시간)
      </h2>

      {/* 가로 스크롤 영역 (tailwind-scrollbar 활용) */}
      <div className="flex overflow-x-auto space-x-3 pb-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {next24Hours.map((item) => {
          // 시간 포맷팅 (예: 오전 09:00)
          const time = new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          const temp = Math.round(item.main.temp);
          const pop = Math.round(item.pop * 100); // 0.5 -> 50%
          const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

          return (
            <div
              key={item.dt}
              className="flex flex-col items-center min-w-[85px] bg-gray-900/50 p-3 rounded-xl border border-gray-700/50 flex-shrink-0"
            >
              <span className="text-sm text-gray-300">{time}</span>
              <img
                src={iconUrl}
                alt={item.weather[0].description}
                className="w-12 h-12 my-1 drop-shadow-md"
                title={item.weather[0].description}
              />
              <span className="text-lg font-bold">{temp}°C</span>

              <div className="flex flex-col items-center mt-2 space-y-1 text-xs w-full">
                <span className="text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded w-full text-center">
                  ☔ {pop}%
                </span>
                <span className="text-gray-300 bg-gray-700/50 px-2 py-0.5 rounded w-full text-center">
                  ☁️ {item.clouds.all}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
