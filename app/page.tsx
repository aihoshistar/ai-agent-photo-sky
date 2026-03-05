// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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
import Footer from './components/Footer';

export default function Home() {
  const [dataSource, setDataSource] = useState<string>('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [fogPrediction, setFogPrediction] = useState(0);
  const [timeOffsetIndex, setTimeOffsetIndex] = useState<number>(0);
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

      setWeatherData(response.data.current);
      setForecastData(response.data.forecast);
      setDataSource(response.data.dataSource);
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

  const getActiveWeatherData = () => {
    if (!weatherData) return null;
    if (timeOffsetIndex === 0 || !forecastData || !forecastData.list)
      return weatherData;

    const targetForecast = forecastData.list[timeOffsetIndex - 1];
    return {
      ...targetForecast,
      name: weatherData.name,
      coord: weatherData.coord,
      sys: weatherData.sys,
    };
  };

  const activeWeather = getActiveWeatherData();

  // ✅ (유지) 새로운 통합 useEffect: 탭이 바뀔 때마다 해/달/안개 지수를 모두 재계산합니다.
  useEffect(() => {
    if (activeWeather && activeWeather.coord) {
      const targetDate = activeWeather.dt
        ? new Date(activeWeather.dt * 1000)
        : new Date();

      calculateSunTimes(
        activeWeather.coord.lat,
        activeWeather.coord.lon,
        targetDate,
      );
      calculateFogPrediction(activeWeather);
    }
  }, [weatherData, forecastData, timeOffsetIndex]);

  // 안개 지수 계산 함수
  const calculateFogPrediction = (currentWeather: any) => {
    if (!currentWeather || !currentWeather.main || !currentWeather.wind) {
      setFogPrediction(0);
      return;
    }

    const humidity = currentWeather.main.humidity || 0;
    // temp_max, temp_min이 없을 경우를 대비 (단기예보 병합 시 없을 수 있음)
    const tempMax = currentWeather.main.temp_max || currentWeather.main.temp;
    const tempMin = currentWeather.main.temp_min || currentWeather.main.temp;

    const temperatureDifference = tempMax - tempMin;
    const windSpeed = currentWeather.wind.speed || 0;

    const prediction =
      (humidity * (Math.abs(temperatureDifference) + 1) * (windSpeed + 1)) /
      100;

    // NaN 방지 및 안전한 저장
    setFogPrediction(isNaN(prediction) ? 0 : prediction);
  };
  // 일출/일몰 및 매직아워 계산 함수
  const calculateSunTimes = (lat: number, lon: number, targetDate: Date) => {
    const times = getSunTimes(lat, lon, targetDate);
    setSunTimes({ sunrise: times.sunrise, sunset: times.sunset });

    const scTimes = SunCalc.getTimes(targetDate, lat, lon);
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
        ) : activeWeather ? ( // 👈 weatherData 대신 activeWeather 확인
          <div className="w-full">
            {/* ✨ 출사 시간대 시뮬레이터 탭 추가 */}
            <div className="flex items-center justify-start md:justify-center gap-2 mb-8 overflow-x-auto pb-4 snap-x hide-scrollbar w-full px-2">
              {[
                { label: '현재 시간', offset: 0 },
                { label: '+3시간', offset: 1 }, // list[0]
                { label: '+6시간', offset: 2 }, // list[1]
                { label: '+12시간', offset: 4 }, // list[3]
                { label: '내일 이맘때', offset: 8 }, // list[7] (24시간 뒤)
                { label: '모레 이맘때', offset: 16 }, // list[15] (48시간 뒤)
              ].map((option, index) => (
                <button
                  key={index}
                  onClick={() => setTimeOffsetIndex(option.offset)}
                  className={`snap-center flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    timeOffsetIndex === option.offset
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 md:scale-105'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* 👇 벤토 그리드 레이아웃 시작 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in pb-12">
              {/* 1. 메인 실시간 기상 상태 (activeWeather 전달) */}
              <article
                className="md:col-span-2"
                aria-labelledby="current-weather-heading"
              >
                <WeatherInfo
                  weatherData={activeWeather}
                  dataSource={
                    timeOffsetIndex === 0
                      ? dataSource
                      : dataSource === 'KMA'
                      ? 'KMA_FORECAST'
                      : 'OWM_FORECAST'
                  }
                />
              </article>

              {/* 2. 시간대별 상세 예보 */}
              {forecastData && (
                <section
                  className="md:col-span-2"
                  aria-label="시간대별 날씨 예보"
                >
                  {forecastData && weatherData && (
                    <HourlyForecast
                      // 👇 핵심: 배열의 맨 앞에 '현재 날씨(weatherData)'를 추가한 뒤 slice합니다!
                      forecastList={[weatherData, ...forecastData.list].slice(
                        timeOffsetIndex,
                      )}
                    />
                  )}
                </section>
              )}

              {/* 3. 환경 수치 정보 (activeWeather 사용) */}
              <section
                className="grid grid-cols-1 md:grid-cols-2 md:col-span-2 gap-4"
                aria-label="상세 기상 지표"
              >
                <CloudVisibility
                  cloudCover={activeWeather.clouds?.all ?? 0}
                  visibility={activeWeather.visibility ?? 0}
                />
                <WindHumidity
                  windSpeed={activeWeather.wind?.speed ?? 0}
                  humidity={activeWeather.main?.humidity ?? 0}
                />
              </section>

              {/* 4. 채광 정보 및 촬영지 검증 (좌표는 변하지 않으므로 기존 weatherData 유지) */}
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

                  {/* ✨ 달의 위상에도 activeWeather의 날짜를 전달합니다! */}
                  <MoonPhase
                    date={
                      activeWeather?.dt
                        ? new Date(activeWeather.dt * 1000)
                        : new Date()
                    }
                  />

                  <LocationMap
                    lat={weatherData.coord.lat}
                    lon={weatherData.coord.lon}
                    locationName={weatherData.name}
                  />
                </div>{' '}
              </section>

              {/* 5. Nikon Zf 실전 촬영 숙제 가이드 (activeWeather 전달) */}
              <section
                className="md:col-span-2 space-y-4"
                aria-labelledby="photography-guide-heading"
              >
                <header className="sr-only">
                  <h2 id="photography-guide-heading">
                    Nikon Zf 실전 촬영 가이드
                  </h2>
                </header>

                <article className="w-full">
                  <PhotographyMission weatherData={activeWeather} />
                </article>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  <ExposureGuide weatherData={activeWeather} />
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
          </div>
        ) : null}
      </div>
      <Footer />
    </main>
  );
}
