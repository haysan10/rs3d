// src/components/ui/RoomNavigator.tsx
import { useState, useMemo } from 'react';
import { rooms, categoryColors, deviceIcons } from '../../data/rooms';
import type { RoomCategory } from '../../data/rooms';
import { useAppStore } from '../../store/useAppStore';

export function RoomNavigator() {
  const {
    roomNavigatorOpen, setRoomNavigatorOpen,
    activeRoomId, setActiveRoomId,
    setActiveFloor, setIsolateRoom
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<'all' | 1 | 2>('all');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        (r.vlan && `vlan ${r.vlan.id}`.includes(search.toLowerCase()));
      const matchFloor = selectedFloor === 'all' || r.floor === selectedFloor;
      const matchCat = selectedCat === 'all' || r.category === selectedCat;
      return matchSearch && matchFloor && matchCat;
    });
  }, [search, selectedFloor, selectedCat]);

  if (!roomNavigatorOpen) return null;

  function selectRoom(roomId: string, floor: 1 | 2) {
    setActiveFloor(floor);
    setActiveRoomId(roomId);
    setIsolateRoom(true);
    setRoomNavigatorOpen(false);
  }

  return (
    <div className="absolute top-16 left-4 z-40 w-84 max-h-[calc(100vh-100px)] flex flex-col bg-slate-900/95 backdrop-blur-xl border border-sky-500/30 rounded-2xl shadow-2xl text-white overflow-hidden animate-in fade-in slide-in-from-left duration-200">
      {/* Header */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧭</span>
          <div>
            <h3 className="text-sm font-bold text-white">Navigasi Ruangan RS</h3>
            <p className="text-[10px] text-sky-400">Pilih ruangan untuk fokus instalasi 3D</p>
          </div>
        </div>
        <button
          onClick={() => setRoomNavigatorOpen(false)}
          className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-white/10 space-y-2">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ruangan (cth: ICU, Server, Poli)..."
            className="w-full bg-slate-800/80 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Floor selector tabs */}
        <div className="flex gap-1 bg-slate-950/60 p-1 rounded-lg">
          {(['all', 1, 2] as const).map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFloor(f)}
              className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                selectedFloor === f
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Semua' : `Lantai ${f}`}
            </button>
          ))}
        </div>

        {/* Category chips */}
        <div className="flex gap-1 overflow-x-auto pb-0.5 text-[10px]">
          {['all', 'medis', 'administrasi', 'service', 'penunjang'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-2 py-0.5 rounded-full border transition-all cursor-pointer whitespace-nowrap capitalize ${
                selectedCat === cat
                  ? 'bg-white/20 text-white border-sky-400 font-bold'
                  : 'bg-slate-800 text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[50vh]">
        {filteredRooms.map((room) => {
          const isSelected = activeRoomId === room.id;
          const color = categoryColors[room.category as RoomCategory];

          return (
            <div
              key={room.id}
              onClick={() => selectRoom(room.id, room.floor)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-400 shadow-md shadow-sky-500/10'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-sky-300' : 'text-slate-100'}`}>
                      {room.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                      <span>Lantai {room.floor}</span>
                      {room.vlan && (
                        <>
                          <span>•</span>
                          <span className="text-sky-400 font-medium">VLAN {room.vlan.id}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] bg-slate-700/80 px-1.5 py-0.5 rounded-md font-mono text-slate-300">
                    {room.devices.length} dev
                  </span>
                </div>
              </div>

              {/* Devices mini icons */}
              {room.devices.length > 0 && (
                <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-400">
                    {room.devices.slice(0, 4).map((d) => (
                      <span key={d.id} title={d.label}>{deviceIcons[d.type]}</span>
                    ))}
                    {room.devices.length > 4 && (
                      <span className="text-[9px] text-slate-500">+{room.devices.length - 4}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-sky-400 group-hover:translate-x-0.5 transition-transform font-semibold">
                    Fokus 3D →
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {filteredRooms.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-500">
            Tidak ada ruangan yang cocok dengan filter
          </div>
        )}
      </div>
    </div>
  );
}
