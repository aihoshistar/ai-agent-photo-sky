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
    <div className="flex h-full flex-col rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-purple-300">
        <Sparkles size={20} className="text-purple-400" /> 매직 아워
      </h2>

      <div className="flex flex-grow flex-col justify-between space-y-3">
        {/* 아침 시간대 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-blue-500/10 bg-blue-900/20 p-3">
            <span className="text-xs font-medium text-blue-300">새벽 블루</span>
            <span className="text-sm font-bold text-blue-100">
              {magicHours.morningBlue}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-yellow-500/10 bg-yellow-900/20 p-3">
            <span className="text-xs font-medium text-yellow-400">
              아침 골든
            </span>
            <span className="text-sm font-bold text-yellow-100">
              {magicHours.morningGolden}
            </span>
          </div>
        </div>

        {/* 저녁 시간대 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-yellow-500/10 bg-yellow-900/20 p-3">
            <span className="text-xs font-medium text-yellow-400">
              저녁 골든
            </span>
            <span className="text-sm font-bold text-yellow-100">
              {magicHours.eveningGolden}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-blue-500/10 bg-blue-900/20 p-3">
            <span className="text-xs font-medium text-blue-300">저녁 블루</span>
            <span className="text-sm font-bold text-blue-100">
              {magicHours.eveningBlue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
