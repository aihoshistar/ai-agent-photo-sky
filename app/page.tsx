"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { startOfToday } from 'date-fns';
import { getSunTimes } from 'sunrise-sunset-js';
import WeatherInfo from './components/WeatherInfo';
import FogPrediction from './components/FogPrediction';
import SunTimes from './components/SunTimes';
// 👇 새로 만든 컴포넌트 임포트
import CloudVisibility from './components/CloudVisibility'; 

export default function Home() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [fogPrediction, setFogPrediction] = useState(0);
  const [location, setLocation] = useState<{ lat: number | null; lon: number | null }>({ lat: null, lon: null });
  const [sunTimes, setSunTimes] = useState<{ sunrise: Date | null; sunset: Date | null }>({ sunrise: null, sunset: null });
  
  const router = useRouter();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchWeatherData(latitude, longitude);
          calculateSunTimes(latitude, longitude);
        },
        () => {
          router.push('/location');
        }
      );
    } else {
      router.push('/location');
    }
  }, [router]);

  useEffect(() => {
    if (weatherData) {
      calculateFogPrediction();
    }
  }, [weatherData]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      // 프록시 삭제 후 설정한 API 라우트 경로로 호출
      const response = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
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
      
      {weatherData ? (
        <div className="w-full max-w-md space-y-4">
          <WeatherInfo weatherData={weatherData} />
          
          {/* 👇 여기에 구름양/가시거리 컴포넌트 추가 */}
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
      ) : (
        <div className="flex flex-col items-center mt-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">현재 위치의 기상 정보를 분석 중입니다...</p>
        </div>
      )}
    </main>
  );
}