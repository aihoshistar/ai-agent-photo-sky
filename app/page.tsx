// app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { startOfToday } from 'date-fns';
import { getSunTimes } from 'sunrise-sunset-js';
import WeatherInfo from './components/WeatherInfo';
import FogPrediction from './components/FogPrediction';
import SunTimes from './components/SunTimes';
import CloudVisibility from './components/CloudVisibility';
// 👇 SearchBar 추가
import SearchBar from './components/SearchBar'; 

export default function Home() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [fogPrediction, setFogPrediction] = useState(0);
  const [sunTimes, setSunTimes] = useState<{ sunrise: Date | null; sunset: Date | null }>({ sunrise: null, sunset: null });
  
  // 상태 관리 세분화 (로딩 및 에러 처리)
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const router = useRouter();

  // 1. 초기 로드 시: 내 위치 기반 날씨 가져오기
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
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

  // 2. 날씨 데이터가 업데이트될 때 파생 데이터(안개, 일출/일몰) 재계산
  useEffect(() => {
    if (weatherData) {
      calculateFogPrediction();
      // 검색된 지역의 위도/경도를 사용해 해당 지역의 일출/일몰을 정확히 계산!
      if (weatherData.coord) {
        calculateSunTimes(weatherData.coord.lat, weatherData.coord.lon);
      }
    }
  }, [weatherData]);

  // 3. API 호출 함수: (lat, lon) 또는 (city) 를 파라미터로 받음
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
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setErrorMsg('날씨 정보를 가져오지 못했습니다. 지역명을 다시 확인해 주세요.');
      setWeatherData(null);
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
    setSunTimes({
      sunrise: times.sunrise,
      sunset: times.sunset,
    });
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <div className="mt-12 mb-8 text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          PhotoSky
        </h1>
        <p className="text-gray-400">정밀한 날씨 정보로 사진 촬영을 더욱 향상시키세요.</p>
      </div>
      
      <div className="w-full max-w-md">
        
        {/* 검색바 적용 */}
        <SearchBar onSearch={(city) => fetchWeatherData({ city })} />

        {/* 에러 메시지 표시 */}
        {errorMsg && (
          <div className="p-4 mb-4 text-sm text-red-400 bg-red-900/20 rounded-lg text-center">
            {errorMsg}
          </div>
        )}
        
        {/* 로딩 및 데이터 렌더링 */}
        {loading ? (
          <div className="flex flex-col items-center mt-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse">기상 정보를 분석 중입니다...</p>
          </div>
        ) : weatherData ? (
          <div className="space-y-4 fade-in">
            {/* 검색된 지역 이름 표시 */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold tracking-wider">{weatherData.name}</h2>
              <p className="text-gray-400">{weatherData.sys?.country}</p>
            </div>

            <WeatherInfo weatherData={weatherData} />
            <CloudVisibility 
              cloudCover={weatherData.clouds?.all ?? 0} 
              visibility={weatherData.visibility ?? 0} 
            />
            <FogPrediction fogPrediction={fogPrediction.toFixed(2)} />
            <SunTimes 
              sunTimes={{ 
                sunrise: sunTimes.sunrise?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                sunset: sunTimes.sunset?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              }} 
            />
          </div>
        ) : null}

      </div>
    </main>
  );
}