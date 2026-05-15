'use client';

import { useEffect, useState } from 'react';
import { DottedSurface } from '@/components/ui/dotted-surface';

const DURATION = 30;

interface Props {
  onDone: () => void;
}

export function MeditationOverlay({ onDone }: Props) {
  const [seconds, setSeconds] = useState(DURATION);

  useEffect(() => {
    if (seconds <= 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, onDone]);

  const progress = ((DURATION - seconds) / DURATION) * 100;
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Dark semi-transparent background — website visible through */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Animated dots */}
      <DottedSurface className="absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6">
        {/* Circular countdown */}
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-white text-xl font-light tabular-nums">
            {seconds}
          </span>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-white text-2xl font-light tracking-widest uppercase">
            one minute of meditation
          </h2>
          <p className="text-white/50 text-sm font-light">
            Take a breath. Your message will be sent after {DURATION} seconds.
          </p>
        </div>

        {/* Breathing ring */}
        <div
          className="w-16 h-16 rounded-full border border-white/20"
          style={{
            animation: 'breathe 4s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.6); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
