// app/components/PhotographyMission.tsx
import { Camera, Moon, Sun, Target, Settings, Lightbulb } from 'lucide-react';

interface Props {
  sunset: Date | null;
}

export default function PhotographyMission({ sunset }: Props) {
  // 현재 시간이 일몰 시간 이후인지(야간인지) 판단
  let isNight = sunset ? new Date() > sunset : new Date().getHours() >= 18;
  isNight = true;

  return (
    <div className={`mb-4 p-6 rounded-3xl shadow-xl border ${
      isNight 
        ? 'bg-gradient-to-br from-gray-900 to-indigo-950 border-indigo-800/50' 
        : 'bg-gradient-to-br from-amber-50 to-orange-100 text-gray-900 border-orange-200'
    }`}>
      <div className="flex items-center space-x-2 mb-5">
        <Camera className={isNight ? 'text-indigo-400' : 'text-orange-500'} size={24} />
        <h2 className={`text-2xl font-bold ${isNight ? 'text-indigo-200' : 'text-orange-800'}`}>
          실전 촬영 가이드 (Zf + 24-70mm)
        </h2>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        {isNight ? <Moon className="text-yellow-300" size={20} /> : <Sun className="text-orange-500" size={20} />}
        <span className="font-semibold text-lg">
          {isNight ? '🌙 야간 모드 활성화' : '☀️ 주간 모드 활성화'}
        </span>
      </div>

      <div className="space-y-4">
        {/* 미션 1: 빛의 방향 */}
        <div className={`p-4 rounded-2xl ${isNight ? 'bg-gray-800/50' : 'bg-white/60'}`}>
          <div className="flex items-center space-x-2 font-bold mb-2">
            <Lightbulb size={18} className={isNight ? 'text-yellow-400' : 'text-amber-500'} />
            <span>추천 빛 방향: {isNight ? '역사광 (Back-Diagonal)' : '측광 (Side Lighting)'}</span>
          </div>
          <p className="text-sm leading-relaxed">
            {isNight 
              ? "가로등이나 헤드라이트 불빛이 피사체 어깨와 머리카락 끝에 닿도록 각도를 잡아보세요[cite: 42]. 인물의 테두리가 빛나는 '림 라이트(Rim Light)' 효과를 얻을 수 있습니다[cite: 43]." 
              : "빛이 90도 옆에서 쏟아질 때 질감을 클로즈업해서 찍어보세요[cite: 39]. B&W 레버를 튕겨 흑백으로 촬영하면 질감 표현이 극대화됩니다[cite: 40]."}
          </p>
        </div>

        {/* 미션 2: 측광 */}
        <div className={`p-4 rounded-2xl ${isNight ? 'bg-gray-800/50' : 'bg-white/60'}`}>
          <div className="flex items-center space-x-2 font-bold mb-2">
            <Target size={18} className={isNight ? 'text-red-400' : 'text-blue-500'} />
            <span>스팟 측광 훈련: {isNight ? '밤거리의 네온사인' : '빛이 들어오는 창가'}</span>
          </div>
          <p className="text-sm leading-relaxed">
            {isNight 
              ? "어두운 골목의 화려한 네온사인을 찾아 스팟 측광으로 맞춰보세요[cite: 56, 60]. 네온사인의 고유한 색감은 진하게 담기고, 배경은 블랙홀처럼 묻혀 극적인 사진이 됩니다[cite: 61, 62]." 
              : "스팟 측광으로 창밖 풍경에 초점을 맞춰보세요[cite: 69]. 창밖 풍경은 완벽하게 나오고, 실내의 피사체는 새까만 '실루엣'으로 변해 감성적인 결과물이 나옵니다[cite: 70]."}
          </p>
        </div>

        {/* 미션 3: 카메라 세팅 팁 */}
        <div className={`p-4 rounded-2xl border ${isNight ? 'bg-indigo-900/30 border-indigo-700' : 'bg-orange-200/40 border-orange-300'}`}>
          <div className="flex items-center space-x-2 font-bold mb-2">
            <Settings size={18} className={isNight ? 'text-indigo-300' : 'text-orange-600'} />
            <span>{isNight ? 'Zf 야간 안전장치 세팅' : '24-70mm f/4 S 렌즈 팁'}</span>
          </div>
          <ul className="text-sm space-y-1 list-disc pl-4">
            {isNight ? (
              <>
                <li>사진 촬영 메뉴에서 <strong>ISO 감도 자동 제어</strong>를 ON으로 켜세요[cite: 87].</li>
                <li><strong>최대 감도</strong>를 12800 또는 25600으로 설정하세요[cite: 88].</li>
                <li><strong>최소 셔터 속도</strong>를 1/60초 또는 1/125초로 설정하여 흔들림을 방지하세요[cite: 89].</li>
              </>
            ) : (
              <>
                <li>침동식 렌즈입니다. 촬영 전 줌 링을 돌려 <strong>렌즈 경통을 밖으로 돌출</strong>시키세요[cite: 77, 78].</li>
                <li>f/4 아웃포커싱 극대화: 줌을 70mm로 당기고, <strong>피사체에 최단 거리(30cm)까지 바짝 다가가세요</strong>[cite: 76].</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}