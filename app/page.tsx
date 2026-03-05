// app/page.tsx
"use client";

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

export default function Home() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [fogPrediction, setFogPrediction] = useState(0);
  const [sunTimes, setSunTimes] = useState<{ sunrise: Date | null; sunset: Date | null }>({ sunrise: null, sunset: null });
  const [magicHours, setMagicHours] = useState<any>(null); 
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherData({ lat: position.coords.latitude, lon: position.coords.longitude }),
        () => {
          setLoading(false);
          setErrorMsg('위치 권한이 거부되었습니다. 원하는 지역을 검색해 주세요.');
        }
      );
    } else {
      setLoading(false);
      setErrorMsg('위치 정보를 지원하지 않는 환경입니다. 검색을 이용해 주세요.');
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

  const fetchWeatherData = async (params: { lat?: number; lon?: number; city?: string }) => {
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
      setErrorMsg('날씨 정보를 가져오지 못했습니다. 지역명을 다시 확인해 주세요.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateFogPrediction = () => {
    if (!weatherData) return;
    const humidity = weatherData.main.humidity || 0;
    const temperatureDifference = (weatherData.main.temp_max - weatherData.main.temp_min) || 0;
    const windSpeed = weatherData.wind.speed || 0;

    const prediction = (humidity * (temperatureDifference + 1) * (windSpeed + 1)) / 100;
    setFogPrediction(prediction);
  };

  const calculateSunTimes = (lat: number, lon: number) => {
    const today = startOfToday();
    const times = getSunTimes(lat, lon, today);
    setSunTimes({ sunrise: times.sunrise, sunset: times.sunset });

    const scTimes = SunCalc.getTimes(new Date(), lat, lon);
    const formatTime = (date?: Date) => {
      if (!date || isNaN(date.getTime())) return '-';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    setMagicHours({
      morningBlue: `${formatTime(scTimes.dawn)} ~ ${formatTime(scTimes.sunrise)}`,
      morningGolden: `${formatTime(scTimes.sunrise)} ~ ${formatTime(scTimes.goldenHourEnd)}`,
      eveningGolden: `${formatTime(scTimes.goldenHour)} ~ ${formatTime(scTimes.sunset)}`,
      eveningBlue: `${formatTime(scTimes.sunset)} ~ ${formatTime(scTimes.dusk)}`,
    });
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      
      {/* 헤더 타이틀 */}
      <div className="mt-8 mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-400">
          PhotoSky
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-medium">사진작가를 위한 정밀 기상 및 채광 정보</p>
      </div>
      
      {/* 전체 컨테이너 넓이 확대 (max-w-md -> max-w-4xl) */}
      <div className="w-full max-w-4xl">
        <SearchBar onSearch={(city) => fetchWeatherData({ city })} />

        {errorMsg && (
          <div className="p-4 mb-6 text-sm text-red-300 bg-red-950/40 border border-red-900/50 rounded-xl text-center backdrop-blur-sm">
            {errorMsg}
          </div>
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-32 space-y-6">
            <div className="w-14 h-14 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse font-medium">하늘의 상태를 분석하고 있습니다...</p>
          </div>
        ) : weatherData ? (
          
          /* 👇 벤토 그리드 레이아웃 시작 */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in pb-12">
            
            {/* 1. 메인 날씨 카드 (모바일, PC 모두 2칸 차지하여 가장 크게 표시) */}
            <div className="md:col-span-2">
              <WeatherInfo weatherData={weatherData} />
            </div>

            {/* 2. 시간대별 예보 (모바일, PC 모두 2칸 차지) */}
            <div className="md:col-span-2">
              {forecastData && <HourlyForecast forecastList={forecastData.list} />}
            </div>

            {/* 3. 그리드 좌측/우측 분할 컴포넌트들 */}
            <CloudVisibility 
              cloudCover={weatherData.clouds?.all ?? 0} 
              visibility={weatherData.visibility ?? 0} 
            />
            
            <WindHumidity 
              windSpeed={weatherData.wind?.speed ?? 0} 
              humidity={weatherData.main?.humidity ?? 0} 
            />

            {/* 4. 일출/일몰 및 매직아워 */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <SunTimes 
                sunTimes={{ 
                  sunrise: sunTimes.sunrise?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                  sunset: sunTimes.sunset?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                }} 
              />
              <MagicHours magicHours={magicHours} />
            </div>

            {/* 👇 5. 이번 주 실전 촬영 가이드 (새로 추가!) */}
            <div className="md:col-span-2">
              <PhotographyMission sunset={sunTimes.sunset} />
            </div>

            {/* 6. 안개 지수 (전체 너비) */}
            <div className="md:col-span-2">
              <FogPrediction fogPrediction={fogPrediction.toFixed(2)} />
            </div>
            
          </div>
          /* 👆 벤토 그리드 레이아웃 끝 */
          
        ) : null}
      </div>
    </main>
  );
}