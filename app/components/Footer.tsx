// app/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-12 border-t border-slate-800 text-center">
      <div className="text-xs text-slate-500 space-y-2">
        <p>© {new Date().getFullYear()} PhotoSky. All rights reserved.</p>
        <p>
          Weather data provided by{' '}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-400 transition-colors"
          >
            OpenWeatherMap
          </a>{' '}
          and{' '}
          <a
            href="https://www.data.go.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-400 transition-colors"
          >
            기상청(KMA)
          </a>
          .
        </p>
        <p className="text-[10px] text-slate-600">
          본 서비스는 사진작가의 원활한 출사를 돕기 위한 참고용 보조 지표이며,
          실제 기상 상황과 차이가 있을 수 있습니다.
        </p>
      </div>
    </footer>
  );
}
