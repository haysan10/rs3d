// src/components/ui/ErrorBoundary.tsx
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[3D ErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-[#0A101D] text-white p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-bold mb-2">Terjadi Gangguan pada WebGL / Visualisasi 3D</h2>
          <p className="text-sm text-slate-400 max-w-md mb-4">
            Akselerasi grafis peramban Anda mengalami kendala atau sedang memuat ulang konteks 3D.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#1A6FB4] hover:bg-[#135A96] text-white text-xs font-semibold rounded-lg shadow-lg transition-colors cursor-pointer"
          >
            Muat Ulang Visualisasi 3D
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
