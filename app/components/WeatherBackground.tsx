// app/components/WeatherBackground.tsx
import React, { useEffect, useState } from 'react';

interface Props {
  condition: string;
}

export default function WeatherBackground({ condition }: Props) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // 비나 눈일 때만 파티클 생성
    if (condition === 'Rain' || condition === 'Snow') {
      const count = condition === 'Rain' ? 40 : 30;
      const newParticles = Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * 1 + (condition === 'Rain' ? 0.5 : 2)}s`,
        animationDelay: `${Math.random() * 2}s`,
        opacity: Math.random() * 0.5 + 0.3,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [condition]);

  if (!condition) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      {/* 안개 효과 */}
      {(condition === 'Mist' ||
        condition === 'Haze' ||
        condition === 'Fog') && <div className="animate-fog" />}

      {/* 비/눈 파티클 */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={condition === 'Rain' ? 'animate-rain' : 'animate-snow'}
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
