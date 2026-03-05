// app/api/weather/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let lat = searchParams.get('lat');
  let lon = searchParams.get('lon');
  const city = searchParams.get('city');

  const apiKey = process.env.WEATHER_API_KEY;

  if (!city && (!lat || !lon)) {
    return NextResponse.json({ error: '지역명이나 위도/경도가 필요합니다.' }, { status: 400 });
  }

  try {
    // 1. Geocoding (지역명 검색 시 좌표 변환)
    if (city) {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
      const geoResponse = await axios.get(geoUrl);
      const geoData = geoResponse.data;

      if (!geoData || geoData.length === 0) {
        return NextResponse.json({ error: '해당 지역을 찾을 수 없습니다.' }, { status: 404 });
      }

      lat = geoData[0].lat;
      lon = geoData[0].lon;
    }

    // 2. 현재 날씨 & 예보 데이터 동시 호출
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl)
    ]);

    // 3. 두 데이터를 하나로 묶어서 클라이언트에 응답
    return NextResponse.json({
      current: weatherRes.data,
      forecast: forecastRes.data,
    });

  } catch (error: any) {
    console.error('API 호출 에러:', error.response?.data || error.message);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}