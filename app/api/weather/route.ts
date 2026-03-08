// app/api/weather/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { latLonToGrid, isKorea } from '../../utils/kmaCoords';
import { fetchKmaWeather, fetchKmaForecast } from '../../utils/kmaApi';

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
    let kcityName = ''; // ✨ 정확한 한글 지명을 담을 변수

    // 1. Geocoding (검색창에 지역명을 검색했을 때)
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

      // ✨ Geocoding 데이터에서 'ko(한국어)' 이름만 쏙 빼옵니다. 없으면 기본 이름 사용
      kcityName = geoData[0].local_names?.ko || geoData[0].name;
    }
    // 2. Reverse Geocoding (GPS 권한으로 내 현재 위치를 잡았을 때)
    else if (lat && lon) {
      try {
        const reverseGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
        const reverseGeoRes = await axios.get(reverseGeoUrl);
        if (reverseGeoRes.data && reverseGeoRes.data.length > 0) {
          // ✨ 좌표를 기반으로 'ko(한국어)' 동/구/시 이름을 빼옵니다.
          kcityName =
            reverseGeoRes.data[0].local_names?.ko || reverseGeoRes.data[0].name;
        }
      } catch (e) {
        console.error('Reverse Geocoding Error:', e);
      }
    }

    // 3. 현재 날씨 & 예보 데이터 호출
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl),
    ]);

    let currentWeatherData = weatherRes.data;
    let forecastDataList = forecastRes.data.list;
    let dataSource = 'OpenWeatherMap';

    // ✨ 4. 이상한 외국어 이름을 위에서 찾은 '완벽한 한글 이름'으로 덮어씌웁니다!
    if (kcityName) {
      currentWeatherData.name = kcityName;
    }

    // ==========================================
    // 🇰🇷 5. 기상청(KMA) API 하이브리드 연동 구간
    // ==========================================
    const numericLat = parseFloat(lat as string);
    const numericLon = parseFloat(lon as string);

    if (isKorea(numericLat, numericLon)) {
      try {
        const { nx, ny } = latLonToGrid(numericLat, numericLon);

        const [kmaCurrent, kmaForecastMap] = await Promise.all([
          fetchKmaWeather(nx, ny),
          fetchKmaForecast(nx, ny),
        ]);

        if (kmaCurrent) {
          currentWeatherData = {
            ...currentWeatherData,
            main: {
              ...currentWeatherData.main,
              temp: kmaCurrent.main.temp ?? currentWeatherData.main.temp,
              humidity:
                kmaCurrent.main.humidity ?? currentWeatherData.main.humidity,
            },
            wind: {
              ...currentWeatherData.wind,
              speed: kmaCurrent.wind.speed ?? currentWeatherData.wind.speed,
            },
            weather: [
              {
                ...currentWeatherData.weather[0],
                main:
                  kmaCurrent.weather[0]?.main &&
                  kmaCurrent.weather[0].main !== 'Clear'
                    ? kmaCurrent.weather[0].main
                    : currentWeatherData.weather[0].main,
              },
            ],
          };
          dataSource = 'KMA';
        }

        if (kmaForecastMap) {
          forecastDataList = forecastDataList.map((item: any) => {
            const kst = new Date(item.dt * 1000 + 3600000 * 9);
            const dateStr = `${kst.getUTCFullYear()}${(kst.getUTCMonth() + 1).toString().padStart(2, '0')}${kst.getUTCDate().toString().padStart(2, '0')}`;
            const timeStr = `${kst.getUTCHours().toString().padStart(2, '0')}00`;
            const key = `${dateStr}${timeStr}`;

            const kmaData = kmaForecastMap.get(key);

            if (kmaData) {
              const pty = parseInt(kmaData.PTY || '0');
              const sky = parseInt(kmaData.SKY || '1');
              let kmaMainWeather = item.weather[0].main;

              if (pty === 1 || pty === 4) kmaMainWeather = 'Rain';
              else if (pty === 2 || pty === 3) kmaMainWeather = 'Snow';
              else if (pty === 0) {
                if (sky === 1) kmaMainWeather = 'Clear';
                else if (sky === 3 || sky === 4) kmaMainWeather = 'Clouds';
              }

              return {
                ...item,
                main: {
                  ...item.main,
                  temp: kmaData.TMP ? parseFloat(kmaData.TMP) : item.main.temp,
                  humidity: kmaData.REH
                    ? parseFloat(kmaData.REH)
                    : item.main.humidity,
                },
                wind: {
                  ...item.wind,
                  speed: kmaData.WSD
                    ? parseFloat(kmaData.WSD)
                    : item.wind.speed,
                },
                weather: [{ ...item.weather[0], main: kmaMainWeather }],
              };
            }
            return item;
          });
        }
      } catch (kmaError) {
        console.error(
          '⚠️ [PhotoSky] 기상청 API 호출 실패. OWM 기본 데이터를 사용합니다.',
          kmaError,
        );
      }
    }

    return NextResponse.json({
      current: currentWeatherData,
      forecast: { ...forecastRes.data, list: forecastDataList },
      dataSource: dataSource,
    });
  } catch (error: any) {
    console.error('API 호출 에러:', error.response?.data || error.message);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
