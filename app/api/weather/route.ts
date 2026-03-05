// app/api/weather/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
// 👇 새로 작성한 utils 함수들을 불러옵니다 (경로는 프로젝트 설정에 맞춰 조정하세요)
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
    let forecastDataList = forecastRes.data.list; // 👈 OWM 예보 리스트를 수정 가능하도록 변수에 할당
    let dataSource = 'OpenWeatherMap'; // 기본 데이터 출처 설정

    // ==========================================
    // 🇰🇷 3. 기상청(KMA) API 하이브리드 연동 구간
    // ==========================================
    const numericLat = parseFloat(lat as string);
    const numericLon = parseFloat(lon as string);

    // 검색된 좌표가 한국 영토 내에 있다면 기상청 데이터를 우선 적용합니다.
    if (isKorea(numericLat, numericLon)) {
      try {
        const { nx, ny } = latLonToGrid(numericLat, numericLon);

        // 🚀 실황(현재)과 예보(미래 3일) 데이터를 동시에 호출합니다.
        const [kmaCurrent, kmaForecastMap] = await Promise.all([
          fetchKmaWeather(nx, ny),
          fetchKmaForecast(nx, ny),
        ]);

        // [A] 현재 실황 데이터 병합
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

          dataSource = 'KMA'; // 기상청 병합 성공 시 출처 변경
        }

        // [B] 미래 예보 데이터(forecastDataList) 병합
        if (kmaForecastMap) {
          forecastDataList = forecastDataList.map((item: any) => {
            // OWM의 dt(UTC 시간)를 한국 시간(KST) 문자열로 변환 (예: 202310251500)
            const kst = new Date(item.dt * 1000 + 3600000 * 9);
            const dateStr = `${kst.getUTCFullYear()}${(kst.getUTCMonth() + 1)
              .toString()
              .padStart(2, '0')}${kst
              .getUTCDate()
              .toString()
              .padStart(2, '0')}`;
            const timeStr = `${kst
              .getUTCHours()
              .toString()
              .padStart(2, '0')}00`;
            const key = `${dateStr}${timeStr}`;

            const kmaData = kmaForecastMap.get(key);

            // 일치하는 시간의 기상청 단기예보 데이터가 있다면 덮어씌움
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

          console.log(
            `✅ [PhotoSky] 한국 격자(${nx}, ${ny}) 기상청 실황 및 미래 단기예보 병합 완료!`,
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
      forecast: { ...forecastRes.data, list: forecastDataList }, // 👈 업데이트된 예보 리스트 전달
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
