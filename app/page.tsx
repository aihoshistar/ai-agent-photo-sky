"use client"; // 필수: 클라이언트 사이드 기능을 사용하기 위함

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 수정: next/router가 아닌 next/navigation 사용
import axios from 'axios';
import { startOfToday } from 'date-fns';
import { getSunTimes } from 'sunrise-sunset-js';
import WeatherInfo from './components/WeatherInfo';
import FogPrediction from './components/FogPrediction';
import SunTimes from './components/SunTimes';

export default function Home() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [fogPrediction, setFogPrediction] = useState(0);
  const [location, setLocation] = useState<{ lat: number | null; lon: number | null }>({ lat: null, lon: null });
  const [sunTimes, setSunTimes] = useState<{ sunrise: Date | null; sunset: Date | null }>({ sunrise: null, sunset: null });
  
  const router = useRouter();

  // 1. 위치 정보 가져오기
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

  // 2. 날씨 데이터가 업데이트될 때마다 안개 예측 계산
  useEffect(() => {
    if (weatherData) {
      calculateFogPrediction();
    }
  }, [weatherData]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const calculateFogPrediction = () => {
    if (!weatherData) return;
    // 습도, 온도차, 풍속을 이용한 간단한 안개 지수 계산
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">PhotoSky</h1>
      <p className="text-xl mb-12 text-center">정밀한 날씨 정보로 사진 촬영을 더욱 향상시키세요.</p>
      
      {weatherData ? (
        <div className="w-full max-w-2xl space-y-6">
          <WeatherInfo weatherData={weatherData} />
          <FogPrediction fogPrediction={fogPrediction.toFixed(2)} />
          <SunTimes 
            sunTimes={{ 
              sunrise: sunTimes.sunrise?.toLocaleTimeString(), 
              sunset: sunTimes.sunset?.toLocaleTimeString() 
            }} 
          />
        </div>
      ) : (
        <p className="animate-pulse">위치 정보를 가져오는 중...</p>
      )}
    </main>
  );
}