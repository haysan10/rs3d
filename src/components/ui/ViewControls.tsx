// src/components/ui/ViewControls.tsx
// Modern Floating Glass Cockpit Dock with Camera Movement Presets, Drone 360°, and Environment Lighting

import { useAppStore } from '../../store/useAppStore';
import type { LightingMode, CameraPreset } from '../../store/useAppStore';
import { getRoomById } from '../../data/rooms';

export function ViewControls() {
  const {
    viewMode, toggleViewMode,
    activeRoomId, setActiveRoomId,
    isolateRoom, setIsolateRoom,
    deviceFilter, setDeviceFilter,
    animateTraffic, toggleAnimateTraffic,
    showCableTrays, toggleShowCableTrays,
    lightingMode, setLightingMode,
    autoOrbit, toggleAutoOrbit,
    cameraPreset, setCameraPreset,
    walkthroughMode, setWalkthroughMode,
    roomNavigatorOpen, setRoomNavigatorOpen,
  } = useAppStore();

  const inWalkthrough = walkthroughMode !== 'none';
  if (inWalkthrough) return null;

  const activeRoom = activeRoomId ? getRoomById(activeRoomId) : null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 max-w-[calc(100vw-24px)] pointer-events-auto select-none">
      
      {/* ─── 1. ACTIVE ROOM ISOLATION BANNER (If room is selected) ─── */}
      {activeRoom && (
        <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-xl border border-sky-400/50 px-3.5 py-1.5 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-xs text-slate-300">
              Ruangan:{' '}
              <strong className="text-white font-bold">{activeRoom.name}</strong>
            </span>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 font-mono px-1.5 py-0.5 rounded">
              Lantai {activeRoom.floor}
            </span>
          </div>

          <div className="w-px h-4 bg-white/20 mx-1" />

          {/* Toggle Room Only Isolation */}
          <button
            onClick={() => setIsolateRoom(!isolateRoom)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
              isolateRoom
                ? 'bg-sky-500 text-white shadow-sky-500/40 border border-sky-300 ring-2 ring-sky-400/30'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20'
            }`}
          >
            <span>{isolateRoom ? '🎯' : '👁️'}</span>
            <span>{isolateRoom ? 'Isolasi Ruangan Aktif' : 'Isolasi Ruangan & Jaringan'}</span>
          </button>

          <button
            onClick={() => { setActiveRoomId(null); setIsolateRoom(false); }}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors ml-1 cursor-pointer"
            title="Tutup fokus ruangan"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── 2. AUXILIARY CONTROL BAR: CAMERA MOVEMENT & ENVIRONMENT LIGHTING ─── */}
      <div className="flex items-center gap-1.5 sm:gap-3 bg-slate-950/85 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-xl shadow-xl text-white text-[11px] overflow-x-auto max-w-full">
        
        {/* Camera Movement Presets */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-semibold hidden md:inline">📷 Sudut Pandang:</span>
          {(
            [
              { id: 'front', label: 'Depan', icon: '🏢' },
              { id: 'server', label: 'MDF Server', icon: '🗄️' },
              { id: 'distribution', label: 'IDF NS', icon: '🔄' },
              { id: 'igd', label: 'IGD', icon: '🚨' },
              { id: 'isometric', label: 'Atas', icon: '📐' },
            ] as const
          ).map((preset) => (
            <button
              key={preset.id}
              onClick={() => setCameraPreset(preset.id as CameraPreset)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                cameraPreset === preset.id && !autoOrbit
                  ? 'bg-sky-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{preset.icon}</span>
              <span className="hidden sm:inline">{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Drone 360° Auto-Orbit */}
        <div className="w-px h-4 bg-white/15" />
        <button
          onClick={toggleAutoOrbit}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
            autoOrbit
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Putar kamera keliling gedung secara otomatis (Cinematic Showcase)"
        >
          <span className="text-xs">🛰️</span>
          <span>Drone 360°</span>
          <span className={`w-1.5 h-1.5 rounded-full ${autoOrbit ? 'bg-white animate-ping' : 'bg-slate-600'}`} />
        </button>

        {/* Cable Trays Toggle */}
        <div className="w-px h-4 bg-white/15 hidden sm:block" />
        <button
          onClick={toggleShowCableTrays}
          className={`hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
            showCableTrays
              ? 'bg-slate-800 text-sky-400 border border-sky-400/40'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Tampilkan atau sembunyikan rak kabel gantung koridor (Physical Cable Trays)"
        >
          <span>🪜</span>
          <span>Tray Kabel: {showCableTrays ? 'ON' : 'OFF'}</span>
        </button>

        {/* Environment Lighting Modes */}
        <div className="w-px h-4 bg-white/15" />
        <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-white/10">
          {(
            [
              { id: 'day', label: 'Siang', icon: '☀️' },
              { id: 'sunset', label: 'Senja', icon: '🌅' },
              { id: 'night', label: 'Malam', icon: '🌙' },
              { id: 'studio', label: 'Studio', icon: '🏛️' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setLightingMode(item.id as LightingMode)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap ${
                lightingMode === item.id
                  ? 'bg-sky-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={`Mode Pencahayaan ${item.label}`}
            >
              <span>{item.icon}</span>
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* ─── 3. MAIN FLOATING GLASS DOCK ─── */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 bg-slate-900/90 backdrop-blur-xl border border-white/15 px-3 py-2 rounded-2xl shadow-2xl text-white overflow-x-auto max-w-full">
        
        {/* 1. View Mode (Arsitektur vs Jaringan Saja) */}
        <button
          onClick={toggleViewMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm whitespace-nowrap ${
            viewMode === 'network-only'
              ? 'bg-sky-500 text-white shadow-sky-500/30 border border-sky-300'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600'
          }`}
          title="Beralih antara Arsitektur Lengkap dan Hologram Jaringan Saja"
        >
          <span className="text-sm">{viewMode === 'network-only' ? '⚡' : '🏗️'}</span>
          <span className="hidden sm:inline">
            {viewMode === 'network-only' ? 'Jaringan Saja (Hologram)' : 'Arsitektur 3D'}
          </span>
          <span className="sm:hidden">
            {viewMode === 'network-only' ? 'Jaringan' : 'Gedung'}
          </span>
        </button>

        {/* 2. Room Navigator Trigger */}
        <button
          onClick={() => setRoomNavigatorOpen(!roomNavigatorOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm whitespace-nowrap ${
            roomNavigatorOpen
              ? 'bg-indigo-600 text-white shadow-indigo-600/30 border border-indigo-400'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600'
          }`}
          title="Buka daftar pencarian ruangan RS"
        >
          <span className="text-sm">🧭</span>
          <span>Cari Ruangan</span>
        </button>

        <div className="w-px h-5 bg-white/15 hidden md:block" />

        {/* 3. Device Category Filter Pills */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-[11px]">
          {(
            [
              { id: 'all', label: 'Semua', icon: '🌐' },
              { id: 'infrastructure', label: 'Infrastruktur', icon: '🗄️' },
              { id: 'ap', label: 'Access Point', icon: '📡' },
              { id: 'terminals', label: 'Terminal PC', icon: '💻' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setDeviceFilter(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                deviceFilter === item.id
                  ? 'bg-sky-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/15" />

        {/* 4. Live Traffic Animation Toggle */}
        <button
          onClick={toggleAnimateTraffic}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm whitespace-nowrap ${
            animateTraffic
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
              : 'bg-slate-800/80 text-slate-400 border border-slate-700/80'
          }`}
          title="Aktifkan atau jeda animasi denyut data pada kabel UTP & Fiber Optik"
        >
          <span className={`w-2 h-2 rounded-full ${animateTraffic ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="hidden sm:inline">Animasi Trafik</span>
          <span className="text-[10px] font-mono uppercase">{animateTraffic ? 'ON' : 'OFF'}</span>
        </button>

        <div className="w-px h-5 bg-white/15" />

        {/* 5. Walkthrough Modes */}
        <button
          onClick={() => setWalkthroughMode('tour')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all cursor-pointer whitespace-nowrap"
          title="Mulai tur otomatis berpindah ke ruang-ruang penting"
        >
          <span>🎬</span>
          <span>Tur 3D</span>
        </button>

        <button
          onClick={() => setWalkthroughMode('manual')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-slate-500 transition-all cursor-pointer whitespace-nowrap"
          title="POV berjalan keliling gedung dengan kontrol WASD"
        >
          <span>🚶</span>
          <span>POV</span>
        </button>

      </div>
    </div>
  );
}

// ─── TOUR OVERLAY ─────────────────────────────────────────────────────────────
export function TourOverlay() {
  const {
    walkthroughMode, setWalkthroughMode,
    tourPlaying, setTourPlaying,
    activeRoomId
  } = useAppStore();

  if (walkthroughMode !== 'tour') return null;

  const currentRoom = activeRoomId ? getRoomById(activeRoomId) : null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/95 backdrop-blur-xl border border-sky-400/40 rounded-full px-5 py-2.5 text-white text-xs shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        <span className="text-slate-400 font-medium">Tur Otomatis RS:</span>
        <span className="font-bold text-sky-300">{currentRoom?.name ?? 'Memulai Tur...'}</span>
      </div>

      <div className="w-px h-4 bg-white/20" />

      <button
        onClick={() => setTourPlaying(!tourPlaying)}
        className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-white rounded-full font-bold transition-colors cursor-pointer"
      >
        {tourPlaying ? '⏸ Jeda' : '▶ Lanjut'}
      </button>

      <button
        onClick={() => setWalkthroughMode('none')}
        className="px-2.5 py-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors cursor-pointer font-medium"
      >
        ✕ Berhenti
      </button>
    </div>
  );
}

// ─── MANUAL WALKTHROUGH OVERLAY ───────────────────────────────────────────────
export function ManualModeOverlay() {
  const { walkthroughMode, setWalkthroughMode, activeFloor } = useAppStore();

  if (walkthroughMode !== 'manual') return null;

  return (
    <>
      {/* Precision Center Crosshair */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
        <div className="relative w-4 h-4">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-sky-400/80 shadow-sm" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-sky-400/80 shadow-sm" />
          <div className="w-4 h-4 rounded-full border border-sky-400/40" />
        </div>
      </div>

      {/* Floating HUD Controller */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xl border border-sky-400/40 rounded-full px-5 py-2.5 text-white text-xs shadow-2xl flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🚶</span>
          <span className="font-bold text-sky-300">Mode POV Berjalan</span>
          <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-mono">
            {activeFloor === 'all' ? 'Lantai 1' : `Lantai ${activeFloor}`}
          </span>
        </div>

        <div className="w-px h-4 bg-white/20" />

        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-sky-400 font-mono">WASD</kbd> Gerak</span>
          <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-sky-400 font-mono">Mouse</kbd> Arah</span>
        </div>

        <div className="w-px h-4 bg-white/20" />

        <button
          onClick={() => setWalkthroughMode('none')}
          className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-white rounded-full font-bold transition-colors cursor-pointer"
        >
          Keluar (ESC)
        </button>
      </div>
    </>
  );
}
