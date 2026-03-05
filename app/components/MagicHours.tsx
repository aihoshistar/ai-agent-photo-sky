// app/components/MagicHours.tsx
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
    <div className="mb-4 p-5 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-purple-300">매직 아워 (Magic Hours)</h2>
      
      <div className="space-y-3">
        {/* 새벽 / 아침 */}
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center bg-blue-900/30 p-3 rounded-lg border border-blue-800/50">
            <span className="text-blue-300 font-medium">새벽 블루 아워</span>
            <span className="text-blue-100">{magicHours.morningBlue}</span>
          </div>
          <div className="flex justify-between items-center bg-yellow-900/30 p-3 rounded-lg border border-yellow-800/50">
            <span className="text-yellow-400 font-medium">아침 골든 아워</span>
            <span className="text-yellow-100">{magicHours.morningGolden}</span>
          </div>
        </div>
        
        <div className="w-full border-t border-gray-700 my-2"></div>

        {/* 저녁 */}
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center bg-yellow-900/30 p-3 rounded-lg border border-yellow-800/50">
            <span className="text-yellow-400 font-medium">저녁 골든 아워</span>
            <span className="text-yellow-100">{magicHours.eveningGolden}</span>
          </div>
          <div className="flex justify-between items-center bg-blue-900/30 p-3 rounded-lg border border-blue-800/50">
            <span className="text-blue-300 font-medium">저녁 블루 아워</span>
            <span className="text-blue-100">{magicHours.eveningBlue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}