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
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-700 bg-gray-800 p-5 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-teal-300">
        시간대별 예보 (24시간)
      </h2>

      {/* 가로 스크롤 영역 (tailwind-scrollbar 활용) */}
      <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600">
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
              className="flex min-w-[85px] flex-shrink-0 flex-col items-center rounded-xl border border-gray-700/50 bg-gray-900/50 p-3"
            >
              <span className="text-sm text-gray-300">{time}</span>
              <img
                src={iconUrl}
                alt={item.weather[0].description}
                className="my-1 h-12 w-12 drop-shadow-md"
                title={item.weather[0].description}
              />
              <span className="text-lg font-bold">{temp}°C</span>

              <div className="mt-2 flex w-full flex-col items-center space-y-1 text-xs">
                <span className="w-full rounded bg-blue-900/30 px-2 py-0.5 text-center text-blue-400">
                  ☔ {pop}%
                </span>
                <span className="w-full rounded bg-gray-700/50 px-2 py-0.5 text-center text-gray-300">
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
