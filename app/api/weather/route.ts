// app/api/weather/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
// 👇 새로 작성한 utils 함수들을 불러옵니다 (경로는 프로젝트 설정에 맞춰 조정하세요)
import { latLonToGrid, isKorea } from '../../utils/kmaCoords';
import { fetchKmaWeather } from '../../utils/kmaApi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let lat = searchParams.get('lat');
  let lon = searchParams.get('lon');
  const city = searchParams.get('city');

  const apiKey = process.env.WEATHER_API_KEY;

  if (!city && (!lat || !lon)) {
    return NextResponse.json(
      { error: '지역명이나 위도/경도가 필요합니다.' },
      { status: 400 },
    );
  }

  try {
    // 1. Geocoding (지역명 검색 시 좌표 변환 - OWM 사용)
    if (city) {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city,
      )}&limit=1&appid=${apiKey}`;
      const geoResponse = await axios.get(geoUrl);
      const geoData = geoResponse.data;

      if (!geoData || geoData.length === 0) {
        return NextResponse.json(
          { error: '해당 지역을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      lat = geoData[0].lat;
      lon = geoData[0].lon;
    }

    // 2. 현재 날씨 & 예보 데이터 동시 호출 (OWM 기본)
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl),
    ]);

    let currentWeatherData = weatherRes.data;
    let dataSource = 'OpenWeatherMap'; // 👈 기본 데이터 출처 설정

    // ==========================================
    // 🇰🇷 3. 기상청(KMA) API 하이브리드 연동 구간
    // ==========================================
    const numericLat = parseFloat(lat as string);
    const numericLon = parseFloat(lon as string);

    // 검색된 좌표가 한국 영토 내에 있다면 기상청 데이터를 우선 적용합니다.
    if (isKorea(numericLat, numericLon)) {
      try {
        const { nx, ny } = latLonToGrid(numericLat, numericLon);
        const kmaData = await fetchKmaWeather(nx, ny);

        if (kmaData) {
          // OWM 데이터 구조를 유지하면서 KMA의 정밀한 데이터만 덮어씌웁니다.
          currentWeatherData = {
            ...currentWeatherData,
            main: {
              ...currentWeatherData.main,
              temp: kmaData.main.temp ?? currentWeatherData.main.temp,
              humidity:
                kmaData.main.humidity ?? currentWeatherData.main.humidity,
            },
            wind: {
              ...currentWeatherData.wind,
              speed: kmaData.wind.speed ?? currentWeatherData.wind.speed,
            },
            weather: [
              {
                ...currentWeatherData.weather[0],
                // 강수 형태가 확인되었을 경우 날씨 상태 업데이트
                main:
                  kmaData.weather[0]?.main &&
                  kmaData.weather[0].main !== 'Clear'
                    ? kmaData.weather[0].main
                    : currentWeatherData.weather[0].main,
              },
            ],
          };

          dataSource = 'KMA'; // 👈 기상청 데이터 병합 성공 시 출처 변경
          console.log(
            `✅ [PhotoSky] 한국 격자(${nx}, ${ny}) 기상청 실황 데이터 병합 완료!`,
          );
        }
      } catch (kmaError) {
        console.error(
          '⚠️ [PhotoSky] 기상청 API 호출 실패. OWM 기본 데이터를 사용합니다.',
          kmaError,
        );
      }
    }

    // 4. 최종 데이터 클라이언트에 응답
    return NextResponse.json({
      current: currentWeatherData,
      forecast: forecastRes.data,
      dataSource: dataSource, // 👈 클라이언트로 출처 정보 전송
    });
  } catch (error: any) {
    console.error('API 호출 에러:', error.response?.data || error.message);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
