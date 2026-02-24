// filepath: app/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import SunCalc from 'suncalc';

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [fogPrediction, setFogPrediction] = useState(0);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const router = useRouter();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchWeatherData(latitude, longitude);
          calculateFogPrediction(latitude, longitude);
        },
        () => {
          router.push('/location');
        }
      );
    } else {
      router.push('/location');
    }
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const calculateFogPrediction = (lat, lon) => {
    // Example fog prediction algorithm
    const humidity = weatherData?.main.humidity || 0;
    const temperatureDifference = weatherData?.main.temp_max - weatherData?.main.temp_min || 0;
    const windSpeed = weatherData?.wind.speed || 0;

    const fogPrediction = (humidity * temperatureDifference * windSpeed) / 100;
    setFogPrediction(fogPrediction);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">PhotoSky</h1>
      <p className="text-xl mb-12">정밀한 날씨 정보로 사진 촬영을 더욱 향상시키세요.</p>
      {weatherData && (
        <>
          <div className="mb-4">
            <h2>Current Weather</h2>
            <p>{weatherData.weather[0].main} - {weatherData.main.temp}°C</p>
          </div>
          <div className="mb-4">
            <h2>Fog Prediction Index</h2>
            <p>{fogPrediction.toFixed(2)}</p>
          </div>
          {/* Add more weather data here */}
        </>
      )}
    </main>
  );
}