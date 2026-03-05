// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { startOfToday } from 'date-fns';
import { getSunTimes } from 'sunrise-sunset-js';
import SunCalc from 'suncalc';

import WeatherInfo from './components/WeatherInfo';
import FogPrediction from './components/FogPrediction';
import SunTimes from './components/SunTimes';
import CloudVisibility from './components/CloudVisibility';
import SearchBar from './components/SearchBar';
import MagicHours from './components/MagicHours';
import HourlyForecast from './components/HourlyForecast';
import WindHumidity from './components/WindHumidity';
import PhotographyMission from './components/PhotographyMission';
import FeatureGuide from './components/FeatureGuide';
import ExposureGuide from './components/ExposureGuide';
import MoonPhase from './components/MoonPhase';
import LensGuide from './components/LensGuide';
import LocationMap from './components/LocationMap';

export default function Home() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [fogPrediction, setFogPrediction] = useState(0);
  const [sunTimes, setSunTimes] = useState<{
    sunrise: Date | null;
    sunset: Date | null;
  }>({ sunrise: null, sunset: null });
  const [magicHours, setMagicHours] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          fetchWeatherData({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }),
        () => {
          setLoading(false);
          setErrorMsg(
            '위치 권한이 거부되었습니다. 원하는 지역을 검색해 주세요.',
          );
        },
      );
    } else {
      setLoading(false);
      setErrorMsg(
        '위치 정보를 지원하지 않는 환경입니다. 검색을 이용해 주세요.',
      );
    }
  }, []);

  useEffect(() => {
    if (weatherData) {
      calculateFogPrediction();
      if (weatherData.coord) {
        calculateSunTimes(weatherData.coord.lat, weatherData.coord.lon);
      }
    }
  }, [weatherData]);

  const fetchWeatherData = async (params: {
    lat?: number;
    lon?: number;
    city?: string;
  }) => {
    setLoading(true);
    setErrorMsg('');
    try {
      let url = '/api/weather?';
      if (params.city) {
        url += `city=${encodeURIComponent(params.city)}`;
      } else if (params.lat && params.lon) {
        url += `lat=${params.lat}&lon=${params.lon}`;
      }

      const response = await axios.get(url);

      // 👇 데이터 구조 변경에 맞게 상태 저장
      setWeatherData(response.data.current);
      setForecastData(response.data.forecast);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setErrorMsg(
        '날씨 정보를 가져오지 못했습니다. 지역명을 다시 확인해 주세요.',
      );
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateFogPrediction = () => {
    if (!weatherData) return;
    const humidity = weatherData.main.humidity || 0;
    const temperatureDifference =
      weatherData.main.temp_max - weatherData.main.temp_min || 0;
    const windSpeed = weatherData.wind.speed || 0;

    const prediction =
      (humidity * (temperatureDifference + 1) * (windSpeed + 1)) / 100;
    setFogPrediction(prediction);
  };

  const calculateSunTimes = (lat: number, lon: number) => {
    const today = startOfToday();
    const times = getSunTimes(lat, lon, today);
    setSunTimes({ sunrise: times.sunrise, sunset: times.sunset });

    const scTimes = SunCalc.getTimes(new Date(), lat, lon);
    const formatTime = (date?: Date) => {
      if (!date || isNaN(date.getTime())) return '-';
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    setMagicHours({
      morningBlue: `${formatTime(scTimes.dawn)} ~ ${formatTime(
        scTimes.sunrise,
      )}`,
      morningGolden: `${formatTime(scTimes.sunrise)} ~ ${formatTime(
        scTimes.goldenHourEnd,
      )}`,
      eveningGolden: `${formatTime(scTimes.goldenHour)} ~ ${formatTime(
        scTimes.sunset,
      )}`,
      eveningBlue: `${formatTime(scTimes.sunset)} ~ ${formatTime(
        scTimes.dusk,
      )}`,
    });
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      {/* 헤더 타이틀 */}
      <header className="mt-8 mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-400">
          PhotoSky
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-medium mb-8">
          사진작가를 위한 정밀 기상 및 채광 정보
        </p>
        <section aria-label="주요 기능 소개" className="w-full max-w-4xl">
          <FeatureGuide />
        </section>
      </header>

      {/* 전체 컨테이너 넓이 확대 (max-w-md -> max-w-4xl) */}
      <div className="w-full max-w-4xl">
        {/* 검색 영역: 사용자의 인터랙션이 시작되는 독립적 섹션 */}
        <section aria-label="지역 검색" className="mb-8">
          <SearchBar onSearch={(city) => fetchWeatherData({ city })} />
        </section>

        {errorMsg && (
          <div
            role="alert"
            className="p-4 mb-6 text-sm text-red-300 bg-red-950/40 border border-red-900/50 rounded-xl text-center backdrop-blur-sm"
          >
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div
            className="flex flex-col items-center justify-center mt-32 space-y-6"
            aria-live="polite"
          >
            <div className="w-14 h-14 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse font-medium">
              하늘의 상태를 분석하고 있습니다...
            </p>
          </div>
        ) : weatherData ? (
          /* 👇 벤토 그리드 레이아웃 시작: 구조화된 아티클 및 섹션 적용 */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in pb-12">
            {/* 1. 메인 실시간 기상 상태 (가장 중요한 정보) */}
            <article
              className="md:col-span-2"
              aria-labelledby="current-weather-heading"
            >
              <WeatherInfo weatherData={weatherData} />
            </article>

            {/* 2. 시간대별 상세 예보 (출사 계획 수립용) */}
            <section className="md:col-span-2" aria-label="시간대별 날씨 예보">
              {forecastData && (
                <HourlyForecast forecastList={forecastData.list} />
              )}
            </section>

            {/* 3. 환경 수치 정보 (구름, 가시거리 / 바람, 습도) */}
            <section
              className="grid grid-cols-1 md:grid-cols-2 md:col-span-2 gap-4"
              aria-label="상세 기상 지표"
            >
              <CloudVisibility
                cloudCover={weatherData.clouds?.all ?? 0}
                visibility={weatherData.visibility ?? 0}
              />
              <WindHumidity
                windSpeed={weatherData.wind?.speed ?? 0}
                humidity={weatherData.main?.humidity ?? 0}
              />
            </section>

            {/* 4. 채광 정보 및 촬영지 검증 (매직아워, 지도 등) */}
            <section
              className="md:col-span-2"
              aria-label="일출·일몰 및 위치 정보"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                <SunTimes
                  sunTimes={{
                    sunrise: sunTimes.sunrise?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    sunset: sunTimes.sunset?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  }}
                />
                <MagicHours magicHours={magicHours} />
                <MoonPhase date={new Date()} />
                <LocationMap
                  lat={weatherData.coord.lat}
                  lon={weatherData.coord.lon}
                  locationName={weatherData.name}
                />
              </div>
            </section>

            {/* 5. Nikon Zf 실전 촬영 숙제 가이드 (핵심 서비스 섹션) */}
            <section
              className="md:col-span-2 space-y-4"
              aria-labelledby="photography-guide-heading"
            >
              <header className="sr-only">
                <h2 id="photography-guide-heading">
                  Nikon Zf 실전 촬영 가이드
                </h2>
              </header>

              {/* A. 메인 미션: 빛의 방향 및 측광 팁 [cite: 19, 34, 48] */}
              <article className="w-full">
                <PhotographyMission weatherData={weatherData} />
              </article>

              {/* B. 노출 및 렌즈 테크니컬 가이드 [cite: 72, 83] */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <ExposureGuide weatherData={weatherData} />
                <LensGuide />
              </div>
            </section>

            {/* 6. 특수 기상 지수 (안개 예측) */}
            <article
              className="md:col-span-2"
              aria-label="안개 발생 가능성 분석"
            >
              <FogPrediction fogPrediction={fogPrediction.toFixed(2)} />
            </article>
          </div>
        ) : null}
      </div>
    </main>
  );
}
