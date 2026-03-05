// app/components/SearchBar.tsx
import { useState } from 'react';

interface Props {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim()); // 부모 컴포넌트(page.tsx)로 검색어 전달
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="relative">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="출사 지역 검색 (예: 부산, Seoul, 두바이, 캐나다)"
          className="w-full px-5 py-3 bg-gray-800 text-white rounded-full border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-medium transition-colors"
        >
          검색
        </button>
      </div>
    </form>
  );
}
