// src/components/ui/RoomInfoPanel.tsx
import { useAppStore } from '../../store/useAppStore';
import { getRoomById, categoryColors, deviceIcons } from '../../data/rooms';

export function RoomInfoPanel() {
  const {
    activeRoomId, setActiveRoomId,
    isolateRoom, setIsolateRoom,
    setWalkthroughMode
  } = useAppStore();

  const room = activeRoomId ? getRoomById(activeRoomId) : null;
  if (!room) return null;

  const catColor = categoryColors[room.category];

  return (
    <div
      className="absolute top-16 right-4 w-88 max-h-[calc(100vh-100px)] overflow-y-auto bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-500/40 text-white z-40 animate-in fade-in slide-in-from-right duration-200"
      style={{ maxWidth: 'calc(100vw - 32px)' }}
    >
      {/* Header Banner */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-slate-950/80 to-slate-900/80 relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block text-slate-900"
                style={{ backgroundColor: catColor }}
              >
                {room.category}
              </span>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full font-mono font-bold">
                Lantai {room.floor}
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-1.5 leading-snug">{room.name}</h2>
          </div>
          <button
            onClick={() => { setActiveRoomId(null); setIsolateRoom(false); }}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setIsolateRoom(!isolateRoom)}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isolateRoom
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 border border-sky-300'
                : 'bg-white/10 text-slate-300 hover:bg-white/15 border border-white/10'
            }`}
          >
            <span>{isolateRoom ? '🔓' : '🎯'}</span>
            <span>{isolateRoom ? 'Tampilkan Semua' : 'Isolasi Ruangan Saja'}</span>
          </button>
          <button
            onClick={() => setWalkthroughMode('manual')}
            className="py-1.5 px-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
            title="Masuk POV Pertama"
          >
            <span>🚶</span>
            <span>POV</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Room Description */}
        <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
          {room.description}
        </p>

        {/* Network & VLAN Card */}
        {room.vlan ? (
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/60 to-sky-950/60 border border-sky-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] font-medium">Segmentasi Jaringan</span>
              <span className="px-2 py-0.5 rounded-md bg-sky-500 text-white font-bold font-mono text-[10px]">
                VLAN {room.vlan.id}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-200">
              <span className="font-semibold">{room.vlan.name}</span>
              <span className="font-mono text-sky-400 text-[11px] bg-black/40 px-2 py-0.5 rounded">
                {room.vlan.subnet}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-white/10">
              <span>⚡ Uplink:</span>
              <span className="text-slate-200 font-mono">
                {room.floor === 1 ? 'Core Switch L1 (Rack 1)' : 'Distribution Switch L2 (NS)'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 text-slate-400 flex items-center gap-2">
            <span>ℹ️</span>
            <span>Ruangan fasilitas umum tanpa segmentasi VLAN khusus.</span>
          </div>
        )}

        {/* Physical Dimensions */}
        {room.dimensions && (
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Spesifikasi Fisik Ruangan
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <SpecBox label="Lebar" value={`${room.dimensions.width}m`} />
              <SpecBox label="Panjang" value={`${room.dimensions.length}m`} />
              <SpecBox label="Tinggi" value={`${room.dimensions.height}m`} />
              <SpecBox label="Dinding" value={`${room.dimensions.wallThicknessCm}cm`} />
            </div>
          </div>
        )}

        {/* Installed Network Devices */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Perangkat Terpasang ({room.devices.length})
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Semua Aktif
            </span>
          </div>

          {room.devices.length > 0 ? (
            <div className="space-y-1.5">
              {room.devices.map((dev) => (
                <div
                  key={dev.id}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-sky-500/50 transition-colors"
                >
                  <span className="text-base w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0 border border-white/10">
                    {deviceIcons[dev.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-200 truncate flex items-center gap-1.5">
                      <span>{dev.label}</span>
                      {dev.qty && dev.qty > 1 && (
                        <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-mono">
                          ×{dev.qty}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="capitalize">{dev.type}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono">1 Gbps Full-Duplex</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500 bg-slate-950/40 rounded-xl border border-white/5">
              Tidak ada perangkat aktif di ruangan ini
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-1.5">
      <div className="text-[9px] text-slate-400">{label}</div>
      <div className="text-[11px] font-bold text-white font-mono">{value}</div>
    </div>
  );
}
