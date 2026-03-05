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
