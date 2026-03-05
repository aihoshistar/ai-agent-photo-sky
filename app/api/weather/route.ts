// app/api/weather/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let lat = searchParams.get('lat');
  let lon = searchParams.get('lon');
  const city = searchParams.get('city');

  const apiKey = process.env.WEATHER_API_KEY;

  // 파라미터가 둘 다 없는 경우
  if (!city && (!lat || !lon)) {
    return NextResponse.json({ error: '지역명이나 위도/경도가 필요합니다.' }, { status: 400 });
  }

  try {
    // 1단계: 검색어(city)가 있는 경우, Geocoding API로 위도/경도를 먼저 알아냅니다.
    if (city) {
      // OWM Geocoding API 호출
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
      const geoResponse = await axios.get(geoUrl);
      const geoData = geoResponse.data;

      // 검색 결과가 없는 경우 404 에러 반환
      if (!geoData || geoData.length === 0) {
        return NextResponse.json({ error: '해당 지역을 찾을 수 없습니다.' }, { status: 404 });
      }

      // 찾은 위도와 경도로 변수 덮어쓰기
      lat = geoData[0].lat;
      lon = geoData[0].lon;
    }

    // 2단계: 확보된 위도(lat), 경도(lon)로 날씨 정보를 요청합니다. (항상 좌표 기반으로 통일)
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;
    const weatherResponse = await axios.get(weatherUrl);

    // 날씨 데이터 클라이언트로 반환
    return NextResponse.json(weatherResponse.data);

  } catch (error: any) {
    console.error('API 호출 에러:', error.response?.data || error.message);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}