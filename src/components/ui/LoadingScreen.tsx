// src/components/ui/LoadingScreen.tsx
import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  progress: number; // 0–100
}

export function LoadingScreen({ progress }: Props) {
  const { setModelLoading } = useAppStore();
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-50 bg-[#0F1929] flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-[#1A6FB4] rounded-2xl flex items-center justify-center text-3xl font-bold text-white mb-4 mx-auto shadow-lg shadow-blue-500/30">
          RS
        </div>
        <h1 className="text-xl font-bold text-white">RS UJI COBA</h1>
        <p className="text-[#0EA5E9] text-sm mt-1">Memuat model 3D Lantai 2...</p>
      </div>

      {/* Progress bar */}
      <div className="w-64 space-y-2">
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1A6FB4] to-[#0EA5E9] rounded-full transition-all duration-300"
            style={{ width: `${Math.max(progress, 15)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Memuat geometri...</span>
          <span className="text-[#0EA5E9] font-medium">{Math.round(progress)}%</span>
        </div>
      </div>

      {showSkip && (
        <button
          onClick={() => setModelLoading(false)}
          className="mt-6 px-4 py-2 bg-[#1A6FB4] hover:bg-[#135A96] text-white text-xs font-semibold rounded-lg shadow-lg transition-colors cursor-pointer"
        >
          Masuk ke Model 3D →
        </button>
      )}

      {/* Hint */}
      <p className="mt-6 text-xs text-gray-500 text-center max-w-xs">
        Model arsitektur 3D RS sedang disiapkan.
      </p>
    </div>
  );
}
