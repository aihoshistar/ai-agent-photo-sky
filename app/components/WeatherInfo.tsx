// app/components/WeatherInfo.tsx
interface WeatherData {
  weather: { main: string }[];
  main: { temp: number };
}

interface Props {
  weatherData: WeatherData;
}

export default function WeatherInfo({ weatherData }: Props) {
  // 방어적 코드: 데이터가 없을 경우를 대비한 처리
  const weatherMain = weatherData?.weather?.[0]?.main || '알 수 없음';
  const temperature = weatherData?.main?.temp ?? '-';

  return (
    <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-blue-300">Current Weather</h2>
      <p className="text-lg">
        {weatherMain} - {temperature}°C
      </p>
    </div>
  );
}