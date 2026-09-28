// src/components/ui/Header.tsx
import { useAppStore } from '../../store/useAppStore';
import { stats } from '../../data/rooms';

export function Header() {
  const {
    activeFloor, setActiveFloor,
    setSidePanelOpen, setSidePanelTab, sidePanelOpen,
    roomNavigatorOpen, setRoomNavigatorOpen,
  } = useAppStore();

  function openPanel(tab: 'vlan' | 'topology' | 'legend') {
    setSidePanelTab(tab);
    setSidePanelOpen(true);
  }

  return (
    <header className="bg-gradient-to-r from-[#135A96] via-[#1A6FB4] to-[#0284C7] text-white shadow-xl z-50 relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-xl font-bold border border-white/30 shadow-inner">
              🏥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold leading-tight tracking-tight">RS UJI COBA</h1>
                <span className="text-[10px] bg-sky-400/20 text-sky-200 border border-sky-300/30 px-2 py-0.5 rounded-full font-semibold">
                  3D Digital Twin
                </span>
              </div>
              <p className="text-xs text-blue-100/80 leading-none mt-0.5">Sistem Informasi Visualisasi Infrastruktur Jaringan</p>
            </div>
          </div>

          {/* Stats pills */}
          <div className="hidden lg:flex items-center gap-6 text-sm bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-xl border border-white/10">
            <StatPill icon="🏥" label="Total Ruangan" value={stats.totalRooms} />
            <div className="w-px h-5 bg-white/20" />
            <StatPill icon="🖥️" label="Perangkat Jaringan" value={stats.totalDevices} />
            <div className="w-px h-5 bg-white/20" />
            <StatPill icon="🔀" label="VLAN Segmentasi" value={stats.totalVlans} />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRoomNavigatorOpen(!roomNavigatorOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all border cursor-pointer shadow-sm ${
                roomNavigatorOpen
                  ? 'bg-sky-400 text-slate-900 font-bold border-white shadow-sky-400/30'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
              }`}
            >
              <span>🧭</span> <span className="hidden sm:inline">Navigasi</span> Ruangan
            </button>
            <button
              onClick={() => openPanel('vlan')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 cursor-pointer shadow-sm"
            >
              <span>📊</span> <span className="hidden sm:inline">Tabel</span> VLAN/IP
            </button>
            <button
              onClick={() => openPanel('topology')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 cursor-pointer shadow-sm"
            >
              <span>🔗</span> <span className="hidden sm:inline">Diagram</span> Topologi
            </button>
            <button
              onClick={() => openPanel('legend')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 cursor-pointer shadow-sm"
            >
              <span>📖</span> Legenda
            </button>
            <button
              onClick={() => setSidePanelOpen(!sidePanelOpen)}
              className="sm:hidden p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              ℹ️
            </button>
          </div>
        </div>

        {/* 3D Floor Selector Tabs */}
        <div className="mt-2.5 flex items-center gap-1 overflow-x-auto pb-0.5">
          <FloorTab
            icon="🏢"
            badge="FULL"
            label="Gedung Utuh"
            subtitle="2 Lantai 3D"
            active={activeFloor === 'all'}
            onClick={() => setActiveFloor('all')}
          />
          <FloorTab
            icon="1️⃣"
            badge="L1"
            label="Lantai 1"
            subtitle="Ruang Server & Medis 3D"
            active={activeFloor === 1}
            onClick={() => setActiveFloor(1)}
          />
          <FloorTab
            icon="2️⃣"
            badge="L2"
            label="Lantai 2"
            subtitle="Rawat Inap, ICU & OK 3D"
            active={activeFloor === 2}
            onClick={() => setActiveFloor(2)}
          />
        </div>
      </div>
    </header>
  );
}

function StatPill({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <div>
        <div className="font-bold text-white leading-none">{value}</div>
        <div className="text-blue-200 text-[10px] leading-tight">{label}</div>
      </div>
    </div>
  );
}

function FloorTab({
  icon,
  badge,
  label,
  subtitle,
  active,
  onClick,
}: {
  icon: string;
  badge: string;
  label: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2.5 px-4 py-2 rounded-t-xl text-xs font-semibold transition-all cursor-pointer select-none whitespace-nowrap
        ${active
          ? 'bg-[#0A101D] text-sky-400 border-t-2 border-sky-400 shadow-lg'
          : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border-t-2 border-transparent'
        }
      `}
    >
      <span className="text-sm">{icon}</span>
      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <span className={`leading-tight font-bold ${active ? 'text-white' : 'text-white/90'}`}>{label}</span>
          <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${active ? 'bg-sky-500/20 text-sky-300' : 'bg-white/15 text-white/70'}`}>
            {badge}
          </span>
        </div>
        <div className={`text-[10px] leading-none ${active ? 'text-sky-300' : 'text-white/60'}`}>{subtitle}</div>
      </div>
    </button>
  );
}
