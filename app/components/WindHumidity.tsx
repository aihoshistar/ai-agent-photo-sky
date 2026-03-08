// app/components/WindHumidity.tsx
interface Props {
  windSpeed: number;
  humidity: number;
}

export default function WindHumidity({ windSpeed, humidity }: Props) {
  // 풍속에 따른 사진 촬영 조언
  const getWindAdvice = (speed: number) => {
    if (speed >= 8) return '매우 강함 (드론 불가, 삼각대 흔들림)';
    if (speed >= 5) return '강함 (드론 주의, 장노출 주의)';
    if (speed >= 2) return '보통 (일반 촬영 양호)';
    return '잔잔함 (장노출/반영 사진 최적)';
  };

  // 습도에 따른 사진 촬영 조언
  const getHumidityAdvice = (hum: number) => {
    if (hum >= 85) return '매우 다습 (렌즈 결로/이슬 맺힘 주의)';
    if (hum >= 70) return '습함 (안개 발생 가능성 높음)';
    if (hum >= 40) return '쾌적 (선명한 사진)';
    return '건조 (빛번짐 적음)';
  };

  return (
    <div className="mb-4 rounded-xl border border-gray-700 bg-gray-800 p-5 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-indigo-300">
        바람 및 습도
      </h2>
      <div className="flex items-center justify-between">
        {/* 풍속 정보 */}
        <div className="flex w-1/2 flex-col items-center border-r border-gray-600 px-2">
          <span className="mb-1 text-sm text-gray-400">풍속</span>
          <span className="text-2xl font-bold">
            {windSpeed.toFixed(1)}
            <span className="ml-1 text-lg font-normal text-gray-300">m/s</span>
          </span>
          <span className="mt-1 break-keep text-center text-xs text-gray-500">
            {getWindAdvice(windSpeed)}
          </span>
        </div>

        {/* 습도 정보 */}
        <div className="flex w-1/2 flex-col items-center px-2">
          <span className="mb-1 text-sm text-gray-400">습도</span>
          <span className="text-2xl font-bold">
            {humidity}
            <span className="ml-1 text-lg font-normal text-gray-300">%</span>
          </span>
          <span className="mt-1 break-keep text-center text-xs text-gray-500">
            {getHumidityAdvice(humidity)}
          </span>
        </div>
      </div>
    </div>
  );
}
