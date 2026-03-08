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
import PackingList from './components/PackingList';
import AlignmentCalc from './components/AlignmentCalc';
import WeatherBackground from './components/WeatherBackground';
import AstronomyCompass from './components/AstronomyCompass';
import HyperfocalCalc from './components/HyperfocalCalc';
import SunsetQuality from './components/SunsetQuality';

export default function Home() {
  const [dataSource, setDataSource] = useState<string>('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [fogPrediction, setFogPrediction] = useState(0);
  const [timeOffsetIndex, setTimeOffsetIndex] = useState<number>(0);
  const [sunTimes, setSunTimes] = useState<{
    sunrise: string | null;
    sunset: string | null;
    sunriseAzimuth: number | null;
    sunsetAzimuth: number | null;
  }>({
    sunrise: null,
    sunset: null,
    sunriseAzimuth: null,
    sunsetAzimuth: null,
  });
  const [magicHours, setMagicHours] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // ✨ 출사지 즐겨찾기 상태 추가
  const [favorites, setFavorites] = useState<
    { name: string; lat: number; lon: number }[]
  >([]);

  const router = useRouter();

  // 최초 로드 시 즐겨찾기 목록과 내 위치 가져오기
  useEffect(() => {
    const savedFavs = localStorage.getItem('photoSkyFavorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }

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

  // ✨ 즐겨찾기 추가/삭제 함수
  const toggleFavorite = () => {
    if (!weatherData) return;
    const spot = {
      name: weatherData.name,
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon,
    };
    const exists = favorites.find((f) => f.name === spot.name);

    let newFavs;
    if (exists) {
      newFavs = favorites.filter((f) => f.name !== spot.name); // 삭제
    } else {
      newFavs = [...favorites, spot]; // 추가
    }

    setFavorites(newFavs);
    localStorage.setItem('photoSkyFavorites', JSON.stringify(newFavs));
  };

  const fetchWeatherData = async (params: {
    lat?: number;
    lon?: number;
    city?: string;
  }) => {
    setLoading(true);
    setErrorMsg('');
    try {
      let url = '/api/weather?';
      if (params.city) url += `city=${encodeURIComponent(params.city)}`;
      else if (params.lat && params.lon)
        url += `lat=${params.lat}&lon=${params.lon}`;

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

  const calculateFogPrediction = (currentWeather: any) => {
    if (!currentWeather || !currentWeather.main || !currentWeather.wind) {
      setFogPrediction(0);
      return;
    }
    const humidity = currentWeather.main.humidity || 0;
    const tempMax = currentWeather.main.temp_max || currentWeather.main.temp;
    const tempMin = currentWeather.main.temp_min || currentWeather.main.temp;
    const temperatureDifference = tempMax - tempMin;
    const windSpeed = currentWeather.wind.speed || 0;
    const prediction =
      (humidity * (Math.abs(temperatureDifference) + 1) * (windSpeed + 1)) /
      100;
    setFogPrediction(isNaN(prediction) ? 0 : prediction);
  };

  const calculateSunTimes = (lat: number, lon: number, targetDate: Date) => {
    const scTimes = SunCalc.getTimes(targetDate, lat, lon);
    const formatTime = (date?: Date) => {
      if (!date || isNaN(date.getTime())) return null;
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const toCompass = (rad: number) => ((rad * 180) / Math.PI + 180) % 360;
    const sunrisePos = scTimes.sunrise
      ? SunCalc.getPosition(scTimes.sunrise, lat, lon)
      : null;
    const sunsetPos = scTimes.sunset
      ? SunCalc.getPosition(scTimes.sunset, lat, lon)
      : null;

    setSunTimes({
      sunrise: formatTime(scTimes.sunrise) || '-',
      sunset: formatTime(scTimes.sunset) || '-',
      sunriseAzimuth: sunrisePos ? toCompass(sunrisePos.azimuth) : null,
      sunsetAzimuth: sunsetPos ? toCompass(sunsetPos.azimuth) : null,
    });

    setMagicHours({
      morningBlue: `${formatTime(scTimes.dawn)} ~ ${formatTime(scTimes.sunrise)}`,
      morningGolden: `${formatTime(scTimes.sunrise)} ~ ${formatTime(scTimes.goldenHourEnd)}`,
      eveningGolden: `${formatTime(scTimes.goldenHour)} ~ ${formatTime(scTimes.sunset)}`,
      eveningBlue: `${formatTime(scTimes.sunset)} ~ ${formatTime(scTimes.dusk)}`,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0f172a] p-4 font-sans text-slate-200 selection:bg-blue-500/30 md:p-8">
      {activeWeather && activeWeather.weather && (
        <WeatherBackground condition={activeWeather.weather[0].main} />
      )}
      {/* 헤더 타이틀 */}
      <header className="mb-6 mt-8 text-center">
        {/* ✨ Atmos 그라데이션 적용: 보라색(황혼)에서 청록색(새벽빛)으로 이어지는 오로라 컬러 */}
        <h1 className="mb-3 bg-gradient-to-r from-violet-400 via-cyan-400 to-teal-300 bg-clip-text text-5xl font-black tracking-tighter text-transparent drop-shadow-lg md:text-6xl">
          Atmos
        </h1>
        <p className="mb-8 text-sm font-medium tracking-wide text-slate-400 md:text-base">
          사진작가를 위한 정밀 기상 및 채광 컴퓨테이셔널 도구
        </p>
        <section aria-label="주요 기능 소개" className="w-full max-w-4xl">
          <FeatureGuide />
        </section>
      </header>
      <div className="w-full max-w-4xl">
        {/* 🔍 검색 및 ✨즐겨찾기 영역 */}
        <section aria-label="지역 검색 및 즐겨찾기" className="mb-8">
          <SearchBar onSearch={(city) => fetchWeatherData({ city })} />

          {/* 즐겨찾기 칩 목록 */}
          {favorites.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 px-2">
              <span className="mr-1 py-1.5 text-xs font-bold text-slate-500">
                ⭐ 내 포인트:
              </span>
              {favorites.map((fav, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    fetchWeatherData({ lat: fav.lat, lon: fav.lon })
                  }
                  className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300 shadow-sm transition-colors hover:bg-slate-700 hover:text-white"
                >
                  {fav.name}
                </button>
              ))}
            </div>
          )}
        </section>

        {errorMsg && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-900/50 bg-red-950/40 p-4 text-center text-sm text-red-300 backdrop-blur-sm"
          >
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div
            className="mt-32 flex flex-col items-center justify-center space-y-6"
            aria-live="polite"
          >
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
            <p className="animate-pulse font-medium text-slate-400">
              하늘의 상태를 분석하고 있습니다...
            </p>
          </div>
        ) : activeWeather ? (
          <div className="w-full">
            {/* ✨ 현재 위치 즐겨찾기 등록 버튼 & 시뮬레이터 탭 */}
            <div className="mb-8 flex w-full flex-col items-center justify-between gap-4 px-2 md:flex-row">
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all ${
                  favorites.some((f) => f.name === weatherData.name)
                    ? 'border-yellow-500/50 bg-yellow-500/20 text-yellow-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <span>
                  {favorites.some((f) => f.name === weatherData.name)
                    ? '⭐ 저장된 포인트'
                    : '☆ 이 장소 저장'}
                </span>
              </button>

              <div className="hide-scrollbar flex max-w-full snap-x items-center gap-2 overflow-x-auto pb-2">
                {[
                  { label: '현재 시간', offset: 0 },
                  { label: '+3시간', offset: 1 },
                  { label: '+6시간', offset: 2 },
                  { label: '+12시간', offset: 4 },
                  { label: '내일 이맘때', offset: 8 },
                  { label: '모레 이맘때', offset: 16 },
                ].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setTimeOffsetIndex(option.offset)}
                    className={`flex-shrink-0 snap-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${
                      timeOffsetIndex === option.offset
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {/* 👇 벤토 그리드 레이아웃 시작 */}
            <div className="fade-in grid grid-cols-1 gap-4 pb-12 md:grid-cols-2">
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

              {forecastData && (
                <section
                  className="md:col-span-2"
                  aria-label="시간대별 날씨 예보"
                >
                  {forecastData && weatherData && (
                    <HourlyForecast
                      forecastList={[weatherData, ...forecastData.list].slice(
                        timeOffsetIndex,
                      )}
                    />
                  )}
                </section>
              )}

              <section
                className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2"
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

              {/* ✨ 새로 추가된 노을 예측기 & 안개 지수 (자연 환경 분석 섹션) */}
              <section className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
                <SunsetQuality weatherData={activeWeather} />
                <FogPrediction fogPrediction={fogPrediction.toFixed(2)} />
              </section>

              <section
                className="md:col-span-2"
                aria-label="일출·일몰 및 위치 정보"
              >
                <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* 방금 만든 나침반 (중앙에서 시각적 핵심 역할) */}
                  <AstronomyCompass
                    date={
                      activeWeather?.dt
                        ? new Date(activeWeather.dt * 1000)
                        : new Date()
                    }
                    lat={weatherData.coord.lat}
                    lon={weatherData.coord.lon}
                  />

                  <div className="flex flex-col gap-4">
                    <SunTimes sunTimes={sunTimes} />
                    <MagicHours magicHours={magicHours} />
                  </div>

                  <div className="flex flex-col gap-4">
                    <MoonPhase
                      date={
                        activeWeather?.dt
                          ? new Date(activeWeather.dt * 1000)
                          : new Date()
                      }
                      lat={weatherData.coord.lat}
                      lon={weatherData.coord.lon}
                    />
                    <LocationMap
                      lat={weatherData.coord.lat}
                      lon={weatherData.coord.lon}
                      locationName={weatherData.name}
                    />
                  </div>
                </div>
              </section>

              <section
                className="space-y-4 md:col-span-2"
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

                {/* ✨ 정렬 계산기와 과초점 계산기 나란히 배치 */}
                <div className="grid w-full grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
                  <AlignmentCalc
                    date={
                      activeWeather?.dt
                        ? new Date(activeWeather.dt * 1000)
                        : new Date()
                    }
                    lat={weatherData.coord.lat}
                    lon={weatherData.coord.lon}
                    weatherData={activeWeather}
                  />
                  <HyperfocalCalc />
                </div>

                <article className="w-full">
                  <PackingList weatherData={activeWeather} />
                </article>

                <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
                  <ExposureGuide weatherData={activeWeather} />
                  <LensGuide weatherData={activeWeather} />
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </main>
  );
}
