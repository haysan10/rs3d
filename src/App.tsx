// src/App.tsx
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { Header } from './components/ui/Header';
import { SidePanel } from './components/ui/SidePanel';
import { Hospital3DViewer } from './components/3d/Hospital3DViewer';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './index.css';

export default function App() {
  const { setDebugMode } = useAppStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === '1') {
      setDebugMode(true);
      console.log('[Hospital Network 3D] Debug mode active.');
      console.log('[Hospital Network 3D] Click anywhere on the 3D building to log exact world coordinates.');
    }
  }, [setDebugMode]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0A101D]">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <ErrorBoundary>
          <Hospital3DViewer />
        </ErrorBoundary>
        <SidePanel />
      </main>
    </div>
  );
}
