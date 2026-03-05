// app/components/LensGuide.tsx
import { Maximize2, MoveDown, AlertCircle, Sparkles } from 'lucide-react';

export default function LensGuide() {
  return (
    <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-lg border border-slate-700 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-5 text-teal-400 flex items-center gap-2">
        <Maximize2 size={20} /> 24-70mm f/4 S 활용 팁
      </h2>

      <div className="space-y-4 flex-grow">
        {/* 아웃포커싱 공식 */}
        <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-teal-400" />
            <span className="text-sm font-bold text-teal-100">
              감탄이 나오는 아웃포커싱 공식
            </span>
          </div>
          <ul className="text-[12px] text-slate-300 space-y-1.5 list-disc pl-4">
            <li>
              줌을 <strong>70mm 끝까지</strong> 당기세요[cite: 74].
            </li>
            <li>
              피사체에 <strong>30cm까지 최대한 가깝게</strong> 다가가세요[cite:
              30, 74].
            </li>
            <li>피사체와 배경 사이의 거리는 멀수록 유리합니다[cite: 74].</li>
          </ul>
        </div>

        {/* 침동식 렌즈 주의사항 */}
        <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
          <div className="flex items-center gap-2 mb-2 text-orange-400 font-bold">
            <AlertCircle size={16} />
            <span className="text-sm">침동식 구조 주의</span>
          </div>
          <p className="text-[12px] text-slate-300 leading-relaxed">
            보관 시 길이가 짧아지는 구조입니다. 촬영 전 반드시{' '}
            <strong>줌 링을 돌려 경통을 밖으로 돌출</strong>시켜야 합니다[cite:
            17, 75, 76].
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4 py-2 border-t border-slate-700/50">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-500 font-bold">
            최단 거리
          </span>
          <span className="text-sm font-black text-teal-400">30cm</span>
        </div>
        <div className="w-[1px] h-6 bg-slate-700"></div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-500 font-bold">
            최대 조리개
          </span>
          <span className="text-sm font-black text-slate-200">f/4</span>
        </div>
      </div>
    </div>
  );
}
