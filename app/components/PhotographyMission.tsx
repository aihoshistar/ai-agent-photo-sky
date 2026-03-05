// app/components/PhotographyMission.tsx
import { Camera, Sun, Cloud, CloudRain, Target, Settings, Lightbulb } from 'lucide-react';

interface Props {
  weatherData: any;
}

export default function PhotographyMission({ weatherData }: Props) {
  if (!weatherData) return null;

  // 날씨 상태 가져오기 (기본값: 맑음)
  const condition = weatherData.weather?.[0]?.main || 'Clear';

  // 날씨에 따른 테마 및 미션 데이터 정의
  let themeConfig = {
    bgClass: 'bg-gradient-to-br from-blue-900/40 to-sky-900/20 border-sky-700/50',
    icon: <Sun className="text-yellow-400" size={24} />,
    titleColor: 'text-sky-300',
    title: '맑음: 선명한 색감과 질감 묘사',
    direction: "파란 하늘과 건물을 넓게 찍는 '순광'으로 쨍한 색감을 담거나, 담벼락에 빛이 90도로 떨어질 때 '측광'으로 질감을 거칠게 묘사해 보세요.",
    metering: "실내에서 밝은 창밖 풍경에 스팟 측광을 맞춰보세요. 창밖은 완벽하게 나오고 실내 피사체는 감성적인 '실루엣'으로 변합니다.",
    setting: "픽처 컨트롤을 [선명하게(Vivid)]나 [풍경(Landscape)]으로 설정하여 순광 특유의 쨍한 색감을 극대화해 보세요."
  };

  if (['Clouds'].includes(condition)) {
    themeConfig = {
      bgClass: 'bg-gradient-to-br from-slate-800/60 to-gray-800/40 border-slate-600/50',
      icon: <Cloud className="text-slate-300" size={24} />,
      titleColor: 'text-slate-300',
      title: '흐림: 부드러운 빛과 아웃포커싱',
      direction: "구름이 거대한 조명 덮개 역할을 해 빛이 부드럽습니다. 창가에 비스듬히 들어오는 '사광'을 활용해 인물이나 커피잔을 예쁘게 담아보세요.",
      metering: "명암 차이가 적은 날입니다. 멀티 패턴 측광을 기본으로 하되, 피사체를 돋보이게 하려면 B&W 레버를 튕겨 [딥톤 모노크롬]으로 촬영해 보세요.",
      setting: "조리개가 f/4라도 괜찮습니다. 줌을 70mm로 끝까지 당기고 피사체에 30cm까지 바짝 다가가면 훌륭한 배경 흐림(아웃포커싱)이 생깁니다."
    };
  } else if (['Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist', 'Fog', 'Haze'].includes(condition)) {
    themeConfig = {
      bgClass: 'bg-gradient-to-br from-indigo-950/60 to-purple-900/30 border-purple-700/50',
      icon: <CloudRain className="text-purple-400" size={24} />,
      titleColor: 'text-purple-300',
      title: '흐림/비: 극적인 대비와 림 라이트',
      direction: "바닥에 고인 물의 반사광이나 가로등 빛이 피사체 뒤 45도에서 닿도록 '역사광'을 만들어, 피사체 테두리가 빛나는 림 라이트(Rim Light)를 노려보세요.",
      metering: "어두운 골목의 화려한 네온사인을 찾아 '스팟 측광'으로 찍어보세요. 네온사인 고유의 색감만 진하게 담기고 배경은 블랙홀처럼 묻힙니다.",
      setting: "어두운 환경에서 f/4 렌즈의 흔들림을 막기 위해 [ISO 감도 자동 제어]를 켜고, 최소 셔터 속도를 1/60초, 최대 감도를 12800으로 세팅하세요."
    };
  }

  return (
    <div className={`mb-4 p-6 rounded-3xl shadow-xl border ${themeConfig.bgClass}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gray-900/50 rounded-xl shadow-inner border border-gray-700/50">
          {themeConfig.icon}
        </div>
        <div>
          <h2 className="text-sm text-gray-400 font-medium tracking-wide mb-1">오늘의 Zf 실전 가이드</h2>
          <h3 className={`text-lg font-bold ${themeConfig.titleColor}`}>{themeConfig.title}</h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* 미션 1: 빛 방향 */}
        <div className="p-4 rounded-2xl bg-gray-900/40 border border-gray-700/30 hover:bg-gray-800/60 transition-colors">
          <div className="flex items-center space-x-2 font-bold mb-2 text-gray-200">
            <Lightbulb size={16} className="text-amber-400" />
            <span>빛의 방향 활용</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            {themeConfig.direction}
          </p>
        </div>

        {/* 미션 2: 측광 훈련 */}
        <div className="p-4 rounded-2xl bg-gray-900/40 border border-gray-700/30 hover:bg-gray-800/60 transition-colors">
          <div className="flex items-center space-x-2 font-bold mb-2 text-gray-200">
            <Target size={16} className="text-red-400" />
            <span>측광 미션</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            {themeConfig.metering}
          </p>
        </div>

        {/* 미션 3: 렌즈 & 바디 세팅 */}
        <div className="p-4 rounded-2xl bg-gray-900/40 border border-gray-700/30 hover:bg-gray-800/60 transition-colors">
          <div className="flex items-center space-x-2 font-bold mb-2 text-gray-200">
            <Settings size={16} className="text-teal-400" />
            <span>Zf + 24-70 f/4 S 꿀팁</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            {themeConfig.setting}
          </p>
        </div>
      </div>
    </div>
  );
}