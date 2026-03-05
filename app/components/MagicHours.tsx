// app/components/MagicHours.tsx
import { Sparkles } from 'lucide-react';

interface MagicHourData {
  morningBlue: string;
  morningGolden: string;
  eveningGolden: string;
  eveningBlue: string;
}

interface Props {
  magicHours: MagicHourData | null;
}

export default function MagicHours({ magicHours }: Props) {
  if (!magicHours) return null;

  return (
    // h-full을 추가하여 부모 그리드 높이에 맞춤
    <div className="p-6 bg-gray-800 rounded-3xl shadow-lg border border-gray-700 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
        <Sparkles size={20} className="text-purple-400" /> 매직 아워
      </h2>

      <div className="flex flex-col justify-between flex-grow space-y-3">
        {/* 아침 시간대 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-blue-900/20 p-3 rounded-xl border border-blue-500/10">
            <span className="text-xs text-blue-300 font-medium">새벽 블루</span>
            <span className="text-sm font-bold text-blue-100">
              {magicHours.morningBlue}
            </span>
          </div>
          <div className="flex justify-between items-center bg-yellow-900/20 p-3 rounded-xl border border-yellow-500/10">
            <span className="text-xs text-yellow-400 font-medium">
              아침 골든
            </span>
            <span className="text-sm font-bold text-yellow-100">
              {magicHours.morningGolden}
            </span>
          </div>
        </div>

        {/* 저녁 시간대 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-yellow-900/20 p-3 rounded-xl border border-yellow-500/10">
            <span className="text-xs text-yellow-400 font-medium">
              저녁 골든
            </span>
            <span className="text-sm font-bold text-yellow-100">
              {magicHours.eveningGolden}
            </span>
          </div>
          <div className="flex justify-between items-center bg-blue-900/20 p-3 rounded-xl border border-blue-500/10">
            <span className="text-xs text-blue-300 font-medium">저녁 블루</span>
            <span className="text-sm font-bold text-blue-100">
              {magicHours.eveningBlue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
