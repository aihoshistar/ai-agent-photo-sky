// app/components/PackingList.tsx
import React, { useState, useEffect } from 'react';

interface Props {
  weatherData: any;
}

export default function PackingList({ weatherData }: Props) {
  const [items, setItems] = useState<
    { id: string; text: string; checked: boolean; type: string }[]
  >([]);

  useEffect(() => {
    if (!weatherData) return;

    const condition = weatherData.weather[0]?.main;
    const windSpeed = weatherData.wind?.speed || 0;
    const targetDate = weatherData.dt
      ? new Date(weatherData.dt * 1000)
      : new Date();
    const isNight = targetDate.getHours() < 5 || targetDate.getHours() > 19;

    // 기본 필수 장비
    const newItems = [
      {
        id: 'cam',
        text: '카메라 바디 & 주력 렌즈',
        checked: false,
        type: '필수',
      },
      {
        id: 'bat',
        text: '추가 배터리 (완충 확인)',
        checked: false,
        type: '필수',
      },
      {
        id: 'sd',
        text: 'SD 메모리 카드 (포맷 확인)',
        checked: false,
        type: '필수',
      },
      {
        id: 'clean',
        text: '렌즈 클리너 / 극세사 천',
        checked: false,
        type: '필수',
      },
    ];

    // 조건별 특수 장비 동적 추가
    if (condition === 'Rain' || condition === 'Snow') {
      newItems.push({
        id: 'rain1',
        text: '렌즈 후드 (앞알 보호용)',
        checked: false,
        type: '우천',
      });
      newItems.push({
        id: 'rain2',
        text: '카메라 레인커버 / 우산',
        checked: false,
        type: '우천',
      });
      newItems.push({
        id: 'rain3',
        text: '제습제 (가방 투입용)',
        checked: false,
        type: '우천',
      });
    }

    if (windSpeed > 8) {
      newItems.push({
        id: 'wind1',
        text: '무게감 있는 튼튼한 삼각대',
        checked: false,
        type: '강풍',
      });
      newItems.push({
        id: 'wind2',
        text: '스톤백 (삼각대 고정용)',
        checked: false,
        type: '강풍',
      });
    }

    if (isNight) {
      newItems.push({
        id: 'night1',
        text: '헤드랜턴 (적색광 권장)',
        checked: false,
        type: '야간',
      });
      newItems.push({
        id: 'night2',
        text: '유/무선 릴리즈 (리모컨)',
        checked: false,
        type: '야간',
      });
      newItems.push({
        id: 'night3',
        text: '렌즈 핫팩 (야간 결로 방지)',
        checked: false,
        type: '야간',
      });
    }

    if (condition === 'Clear' && !isNight) {
      newItems.push({
        id: 'clear1',
        text: 'CPL (편광) 필터',
        checked: false,
        type: '주간',
      });
      newItems.push({
        id: 'clear2',
        text: 'ND 필터 (필요시)',
        checked: false,
        type: '주간',
      });
    }

    setItems(newItems);
  }, [weatherData]);

  const toggleCheck = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  if (!weatherData) return null;

  return (
    <div className="w-full rounded-3xl border border-slate-700/50 bg-slate-800/80 p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎒</span>
          <h3 className="text-lg font-bold text-slate-200">
            동적 출사 체크리스트
          </h3>
        </div>
        <span className="rounded-full border border-teal-500/20 bg-teal-400/10 px-2 py-1 text-xs font-bold text-teal-400">
          완료: {items.filter((i) => i.checked).length} / {items.length}
        </span>
      </div>

      <div className="custom-scrollbar max-h-[200px] space-y-2 overflow-y-auto pr-2">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
              item.checked
                ? 'border-teal-500/30 bg-teal-500/10'
                : 'border-slate-700/50 bg-slate-900/50 hover:bg-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleCheck(item.id)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-900"
            />
            <span
              className={`text-sm font-medium transition-colors ${item.checked ? 'text-slate-400 line-through' : 'text-slate-200'}`}
            >
              {item.text}
            </span>
            <span className="ml-auto rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              {item.type}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
