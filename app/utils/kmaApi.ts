// utils/kmaApi.ts 수정된 부분
import axios from 'axios';
import { format } from 'date-fns';

export async function fetchKmaWeather(nx: number, ny: number) {
  // ⚠️ 주의: 이 방식에서는 공공데이터포털의 "Encoding(인코딩)" 키를 .env에 넣는 것을 권장합니다.
  const API_KEY = process.env.KMA_API_KEY;
  const BASE_URL =
    'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';

  const now = new Date();
  if (now.getMinutes() < 40) {
    now.setHours(now.getHours() - 1);
  }

  const baseDate = format(now, 'yyyyMMdd');
  const baseTime = format(now, 'HH00');

  try {
    // 👇 Axios의 params 객체를 쓰지 않고 URL을 직접 조립합니다. (자동 인코딩 방지)
    const requestUrl = `${BASE_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

    const response = await axios.get(requestUrl);

    // KMA API는 에러가 나도 HTTP 200을 주고 xml/json 본문에 에러 코드를 넣는 경우가 있습니다.
    if (response.data.response?.header?.resultCode !== '00') {
      console.error(
        'KMA API 응답 에러:',
        response.data.response?.header?.resultMsg,
      );
      return null;
    }

    const items = response.data.response.body.items.item;
    const weatherData: any = { main: {}, wind: {}, weather: [{}] };

    // ... (이하 데이터 매핑 로직은 기존과 동일) ...
    items.forEach((item: any) => {
      switch (item.category) {
        case 'T1H':
          weatherData.main.temp = parseFloat(item.obsrValue);
          break;
        case 'REH':
          weatherData.main.humidity = parseFloat(item.obsrValue);
          break;
        case 'WSD':
          weatherData.wind.speed = parseFloat(item.obsrValue);
          break;
        case 'PTY':
          const pty = parseInt(item.obsrValue);
          if (pty === 1 || pty === 4) weatherData.weather[0].main = 'Rain';
          else if (pty === 2 || pty === 3) weatherData.weather[0].main = 'Snow';
          break;
      }
    });

    return weatherData;
  } catch (error) {
    // 401 에러 등이 발생하면 여기서 잡힙니다.
    console.error('KMA API HTTP Error:', error);
    return null;
  }
}

// 🕒 KST(한국 시간) 기준 기상청 단기예보 BaseTime 계산기
function getKmaForecastBaseTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + 3600000 * 9);

  // 기상청 단기예보는 02, 05, 08, 11, 14, 17, 20, 23시에 생성됨 (15분 여유 버퍼)
  kst.setMinutes(kst.getMinutes() - 15);
  let h = kst.getHours();

  let baseTimeH = Math.floor((h + 1) / 3) * 3 - 1;
  if (baseTimeH < 0) {
    baseTimeH = 23;
    kst.setDate(kst.getDate() - 1);
  }

  const yyyy = kst.getFullYear().toString();
  const MM = (kst.getMonth() + 1).toString().padStart(2, '0');
  const dd = kst.getDate().toString().padStart(2, '0');
  const HH = baseTimeH.toString().padStart(2, '0');

  return { baseDate: `${yyyy}${MM}${dd}`, baseTime: `${HH}00` };
}

// 📡 기상청 단기예보(미래 3일치) 호출 및 파싱 함수
export async function fetchKmaForecast(nx: number, ny: number) {
  const API_KEY = process.env.KMA_API_KEY;
  const BASE_URL =
    'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
  const { baseDate, baseTime } = getKmaForecastBaseTime();

  try {
    // numOfRows=300 정도면 향후 24시간 이상의 데이터를 충분히 가져옵니다.
    const requestUrl = `${BASE_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=300&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

    const response = await axios.get(requestUrl);
    if (response.data.response?.header?.resultCode !== '00') return null;

    const items = response.data.response.body.items.item;
    const forecastMap = new Map();

    // 시간별로(fcstDate + fcstTime) 데이터를 예쁘게 그룹핑합니다.
    items.forEach((item: any) => {
      const key = `${item.fcstDate}${item.fcstTime}`; // 예: '202310251500'
      if (!forecastMap.has(key)) forecastMap.set(key, {});
      forecastMap.get(key)[item.category] = item.fcstValue;
    });

    return forecastMap;
  } catch (error) {
    console.error('KMA Forecast Error:', error);
    return null;
  }
}
