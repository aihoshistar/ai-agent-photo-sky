// app/components/ExposureGuide.tsx
import React from 'react';

interface Props {
  weatherData: any;
}

export default function ExposureGuide({ weatherData }: Props) {
  if (!weatherData) return null;

  const condition = weatherData.weather[0]?.main;
  const windSpeed = weatherData.wind?.speed || 0;
  const clouds = weatherData.clouds?.all || 0;

  const targetDate = weatherData.dt
    ? new Date(weatherData.dt * 1000)
    : new Date();
  const hour = targetDate.getHours();
  const isNight = hour < 5 || hour > 19;
  const isGoldenHour = (hour >= 6 && hour <= 8) || (hour >= 17 && hour <= 19);

  const getExposureSettings = () => {
    if (isNight) {
      return {
        aperture: 'f/1.4 - f/2.8',
        apertureDesc:
          '빛 확보를 위한 최대 개방. 심도가 얕아지므로 초점에 주의하세요.',
        shutter: '1/60s (스냅) or 장노출',
        shutterDesc:
          '손떨림 한계치인 1/60s를 유지하거나, 삼각대 사용 시 10초 이상 장노출.',
        iso: 'ISO 1600 - 6400',
        isoDesc:
          '노이즈를 감수하더라도 흔들리지 않는 것이 먼저입니다. 고감도를 적극 활용하세요.',
      };
    }
    if (condition === 'Rain' || condition === 'Snow') {
      return {
        aperture: 'f/2.8 - f/4.0',
        apertureDesc:
          '흐린 날씨의 빛 부족을 보완하고, 빗방울/눈송이를 보케로 만들기 좋은 수치.',
        shutter: '1/500s 이상',
        shutterDesc:
          '내리는 비와 눈을 궤적이 아닌 공중에 정지된(Freeze) 형태로 담아냅니다.',
        iso: 'ISO 400 - 800',
        isoDesc:
          '빠른 셔터스피드 확보를 위해 ISO를 평소보다 1~2스텝 올려주세요.',
      };
    }
    if (windSpeed > 8) {
      return {
        aperture: 'f/4.0 - f/5.6',
        apertureDesc:
          '피사체가 흔들릴 수 있으므로 심도를 약간 깊게 하여 초점 나감을 방지합니다.',
        shutter: '1/1000s 이상',
        shutterDesc:
          '바람에 요동치는 나뭇가지나 피사체를 완벽하게 정지된 찰나로 잡아냅니다.',
        iso: 'Auto (Max 1600)',
        isoDesc:
          '셔터스피드가 매우 빠르므로 ISO는 카메라에 맡겨 노출을 유동적으로 맞춥니다.',
      };
    }
    if (isGoldenHour) {
      return {
        aperture: 'f/8.0 - f/11',
        apertureDesc:
          '조리개를 조여 태양의 빛갈라짐(Sunstar)을 날카롭게 연출해 보세요.',
        shutter: '1/200s - 1/400s',
        shutterDesc:
          '역광 상황에서 밝은 하늘의 하이라이트가 날아가지 않도록 셔터를 조금 빠르게 세팅합니다.',
        iso: 'ISO 100',
        isoDesc:
          '가장 깨끗한 화질(Base ISO)을 유지하여 암부를 보정할 때의 관용도를 높입니다.',
      };
    }
    if (clouds > 80) {
      return {
        aperture: 'f/2.8 - f/5.6',
        apertureDesc:
          '그림자가 없는 부드러운 빛이므로, 조리개를 열어 피사체에만 시선을 집중시킵니다.',
        shutter: '1/125s - 1/250s',
        shutterDesc:
          '일상적인 스냅 촬영에 무리 없는 안정적인 셔터스피드입니다.',
        iso: 'ISO 200 - 400',
        isoDesc:
          '구름에 가려 빛이 살짝 부족하므로 감도를 살짝 올려 노출을 확보합니다.',
      };
    }
    // 맑은 날 기본값
    return {
      aperture: 'f/8.0 - f/11',
      apertureDesc:
        '풍경의 전경부터 원경까지 쨍하게 초점이 맞는 팬포커스(Pan-focus) 세팅입니다.',
      shutter: '1/500s - 1/1000s',
      shutterDesc: '충분한 광량을 바탕으로 빠르고 경쾌하게 셔터를 끊어냅니다.',
      iso: 'ISO 100',
      isoDesc:
        '풍부한 태양빛 아래에서는 무조건 최저 감도로 최고의 화질을 뽑아냅니다.',
    };
  };

  const exp = getExposureSettings();

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-700/50 bg-slate-800/80 p-5 shadow-lg">
      <div className="mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
        <span className="text-xl">🎛️</span>
        <h3 className="text-lg font-bold text-slate-200">
          노출 삼각지대 가이드
        </h3>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              조리개 (Aperture)
            </span>
            <span className="text-sm font-extrabold text-blue-400">
              {exp.aperture}
            </span>
          </div>
          <p className="text-[11px] leading-tight text-slate-400">
            {exp.apertureDesc}
          </p>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              셔터스피드 (Shutter)
            </span>
            <span className="text-sm font-extrabold text-teal-400">
              {exp.shutter}
            </span>
          </div>
          <p className="text-[11px] leading-tight text-slate-400">
            {exp.shutterDesc}
          </p>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">감도 (ISO)</span>
            <span className="text-sm font-extrabold text-yellow-400">
              {exp.iso}
            </span>
          </div>
          <p className="text-[11px] leading-tight text-slate-400">
            {exp.isoDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
