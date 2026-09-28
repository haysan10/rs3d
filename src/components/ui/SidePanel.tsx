// src/components/ui/SidePanel.tsx
// High-End Dark Glassmorphic Drawer for VLAN Table, Topology Diagram, and System Legend

import { useAppStore } from '../../store/useAppStore';
import { vlans, categoryColors, deviceIcons } from '../../data/rooms';
import type { DeviceType } from '../../data/rooms';

export function SidePanel() {
  const { sidePanelOpen, setSidePanelOpen, sidePanelTab, setSidePanelTab } = useAppStore();

  if (!sidePanelOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setSidePanelOpen(false)}
    >
      <div
        className="relative w-full max-w-lg h-full bg-slate-900/95 backdrop-blur-2xl border-l border-sky-500/30 text-white shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel header */}
        <div className="sticky top-0 bg-slate-950/90 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📊</span>
            <div>
              <h2 className="font-bold text-base text-white">Informasi Arsitektur Jaringan</h2>
              <p className="text-[11px] text-sky-400">RS Uji Coba — Dokumentasi & Segmentasi</p>
            </div>
          </div>
          <button
            onClick={() => setSidePanelOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-slate-950/60 p-1.5 gap-1">
          {(['vlan', 'topology', 'legend'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSidePanelTab(tab)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                sidePanelTab === tab
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'vlan' ? '📊 Tabel VLAN & IP' : tab === 'topology' ? '🔗 Topologi Jaringan' : '📖 Legenda Simbol'}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {sidePanelTab === 'vlan' && <VlanTable />}
          {sidePanelTab === 'topology' && <TopologyDiagram />}
          {sidePanelTab === 'legend' && <LegendPanel />}
        </div>
      </div>
    </div>
  );
}

// ─── VLAN Table ──────────────────────────────────────────────────────────────
function VlanTable() {
  const vlanColors: Record<number, string> = {
    10: '#10B981', // Emerald
    20: '#38BDF8', // Sky
    30: '#EF4444', // Red
    40: '#A855F7', // Purple
    50: '#06B6D4', // Cyan
    60: '#F59E0B', // Amber
    70: '#EC4899', // Pink
  };

  const vlanAreas: Record<number, string> = {
    10: 'Front Office, Manajemen, IPSRS, Ruang Jenazah',
    20: 'Poli, Rawat Inap, Nurse Station, Ruang Dokter',
    30: 'ICU (Intensive Care), Ruang Operasi (OK)',
    40: 'Radiologi, Laboratorium, Farmasi',
    50: 'Server Room, Data Center, NOC Jaringan',
    60: 'Seluruh area staf medis & perawat (SSID Staf)',
    70: 'Area publik, pengunjung, ruang tunggu (SSID Tamu)',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-white">Tabel VLAN & Subnetting IP</h3>
          <p className="text-[11px] text-slate-400">Total 7 segmen VLAN terisolasi untuk keamanan RS</p>
        </div>
        <span className="text-[10px] bg-sky-500/20 text-sky-300 font-mono px-2 py-0.5 rounded-full border border-sky-400/30">
          802.1Q Trunk
        </span>
      </div>

      <div className="space-y-2">
        {vlans.map((v) => {
          const color = vlanColors[v.id] ?? '#38BDF8';
          return (
            <div
              key={v.id}
              className="border border-slate-700/60 rounded-xl overflow-hidden bg-slate-800/40 hover:border-slate-600 transition-colors"
            >
              <div
                className="flex items-center gap-3 p-3"
                style={{ backgroundColor: `${color}15`, borderLeft: `3px solid ${color}` }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs" style={{ color }}>
                      VLAN {v.id} — {v.name}
                    </span>
                    <span className="font-mono text-xs text-white bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">
                      {v.subnet}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-3 py-2 text-[11px] text-slate-400 bg-slate-900/50 flex items-center justify-between">
                <span>Cakupan: <strong className="text-slate-300">{vlanAreas[v.id]}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Topology Diagram ─────────────────────────────────────────────────────────
function TopologyDiagram() {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-bold text-sm text-white">Diagram Hirarki Topologi Jaringan</h3>
        <p className="text-[11px] text-slate-400">Hierarchical Star Topology dengan Fiber Optic Riser Rangkaian Gedung</p>
      </div>

      {/* SVG topology diagram formatted for Dark Cockpit */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-950/80 p-3 shadow-inner">
        <svg viewBox="0 0 480 520" className="w-full min-w-[320px]" fontFamily="system-ui, sans-serif">
          {/* Legend */}
          <g transform="translate(10, 10)">
            <line x1="0" y1="6" x2="24" y2="6" stroke="#38BDF8" strokeWidth="2.5" />
            <text x="28" y="10" fontSize="10" fill="#94A3B8">UTP Cat6 (1 Gbps)</text>
            <line x1="140" y1="6" x2="164" y2="6" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4,2" />
            <text x="168" y="10" fontSize="10" fill="#94A3B8">Fiber Optik (10 Gbps)</text>
          </g>

          {/* Internet */}
          <TopologyNode x={190} y={40} icon="🌐" label="Internet / ISP" color="#38BDF8" />

          {/* Router/Firewall */}
          <line x1="240" y1="80" x2="240" y2="110" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="5,3" />
          <TopologyNode x={185} y={110} icon="🔥" label="Router/Firewall" color="#EF4444" wide />

          {/* Core Switch */}
          <line x1="240" y1="150" x2="240" y2="180" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="5,3" />
          <TopologyNode x={180} y={180} icon="⚡" label="Core Switch L3" color="#F59E0B" wide />

          {/* UPS & Server */}
          <line x1="320" y1="215" x2="370" y2="245" stroke="#38BDF8" strokeWidth="2" />
          <TopologyNode x={345} y={245} icon="🔋" label="UPS Battery" color="#10B981" />
          <line x1="160" y1="215" x2="110" y2="245" stroke="#38BDF8" strokeWidth="2" />
          <TopologyNode x={60} y={245} icon="🗄️" label="SIMRS Server" color="#A855F7" wide />

          {/* Lantai 1 Switch */}
          <line x1="240" y1="220" x2="240" y2="275" stroke="#38BDF8" strokeWidth="2" />
          <TopologyNode x={180} y={275} icon="🔀" label="Switch Lantai 1" color="#38BDF8" wide />

          {/* Floor 1 devices */}
          <g>
            <line x1="200" y1="313" x2="120" y2="345" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="240" y1="313" x2="240" y2="345" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="280" y1="313" x2="360" y2="345" stroke="#38BDF8" strokeWidth="1.5" />
            <SmallNode x={80}  y={345} label="Front Office" />
            <SmallNode x={200} y={345} label="Radiologi / Lab" />
            <SmallNode x={320} y={345} label="Farmasi / Poli" />
          </g>

          {/* Fiber to Floor 2 */}
          <line x1="240" y1="220" x2="390" y2="300" stroke="#EF4444" strokeWidth="3" strokeDasharray="6,3" />
          <text x="320" y="265" fontSize="9" fill="#EF4444" fontWeight="bold" transform="rotate(-27,320,265)">Fiber Backbone</text>

          {/* Floor 2 Distribution Switch */}
          <TopologyNode x={345} y={300} icon="🔄" label="Dist. Switch L2" color="#F97316" wide />

          {/* Floor 2 Access Switch */}
          <line x1="405" y1="340" x2="405" y2="368" stroke="#38BDF8" strokeWidth="2" />
          <TopologyNode x={345} y={368} icon="🔀" label="Access Switch L2" color="#38BDF8" wide />

          {/* Floor 2 devices */}
          <g>
            <line x1="380" y1="406" x2="330" y2="435" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="405" y1="406" x2="405" y2="435" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="430" y1="406" x2="470" y2="435" stroke="#38BDF8" strokeWidth="1.5" />
            <SmallNode x={290} y={435} label="Rawat Inap" />
            <SmallNode x={365} y={435} label="ICU / OK" />
            <SmallNode x={430} y={435} label="Nurse Station" />
          </g>

          {/* Floor labels */}
          <rect x="10" y="230" width="60" height="18" fill="#F59E0B20" stroke="#F59E0B" strokeWidth="1" rx="4" />
          <text x="40" y="243" fontSize="9" fill="#FBBF24" textAnchor="middle" fontWeight="bold">Lantai 1</text>
          
          <rect x="340" y="278" width="60" height="18" fill="#38BDF820" stroke="#38BDF8" strokeWidth="1" rx="4" />
          <text x="370" y="291" fontSize="9" fill="#38BDF8" textAnchor="middle" fontWeight="bold">Lantai 2</text>
        </svg>
      </div>

      {/* Description text */}
      <div className="space-y-1.5 text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-white/5">
        <p>🌐 <strong>Internet (ISP)</strong> masuk langsung ke Router/Firewall di Ruang Server.</p>
        <p>⚡ <strong>Core Switch L3</strong> mengontrol routing antar-VLAN dan QoS lalu-lintas data RS.</p>
        <p>🔴 <strong>Fiber Optik Backbone</strong> menghubungkan Ruang Server ke Lantai 2 melalui shaft tangga khusus.</p>
        <p>📡 <strong>Access Point</strong> mendukung SSID ganda terisolasi (WiFi Medis & Tamu).</p>
      </div>
    </div>
  );
}

function TopologyNode({
  x, y, icon, label, color, wide,
}: {
  x: number; y: number; icon: string; label: string; color: string; wide?: boolean;
}) {
  const w = wide ? 120 : 96;
  return (
    <g>
      <rect x={x} y={y} width={w} height={38} rx="8" fill="#1E293B" stroke={color} strokeWidth="1.5" />
      <text x={x + w / 2} y={y + 14} fontSize="12" textAnchor="middle">{icon}</text>
      <text x={x + w / 2} y={y + 29} fontSize="9" textAnchor="middle" fill="#F1F5F9" fontWeight="600">{label}</text>
    </g>
  );
}

function SmallNode({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={82} height={26} rx="6" fill="#0F172A" stroke="#475569" strokeWidth="1" />
      <text x={x + 41} y={y + 17} fontSize="8.5" textAnchor="middle" fill="#CBD5E1">{label}</text>
    </g>
  );
}

// ─── Legend Panel ─────────────────────────────────────────────────────────────
function LegendPanel() {
  const deviceList: { type: DeviceType; label: string; desc: string }[] = [
    { type: 'server',              label: 'Server SIMRS / Database',  desc: 'Penyimpanan rekam medis & database RS' },
    { type: 'core-switch',         label: 'Core Switch Layer 3',      desc: 'Pusat routing dan distribusi lalu lintas' },
    { type: 'distribution-switch', label: 'Distribution Switch L2',   desc: 'Distribusi jaringan untuk Lantai 2' },
    { type: 'switch',              label: 'Access Switch L2',         desc: 'Koneksi perangkat end-user ke jaringan' },
    { type: 'router-firewall',     label: 'Router & Firewall',        desc: 'Gateway internet dan keamanan perimeter' },
    { type: 'ap',                  label: 'Access Point WiFi 6',      desc: 'Pemancar sinyal nirkabel staf & tamu' },
    { type: 'desktop',             label: 'Workstation / PC',         desc: 'Komputer operasional staf medis & administrasi' },
    { type: 'laptop',              label: 'Laptop Medis',             desc: 'Perangkat portabel dokter & perawat' },
    { type: 'printer',             label: 'Printer Jaringan',         desc: 'Pencetak resep, label obat, dan laporan' },
    { type: 'ups',                 label: 'UPS Backup Power',         desc: 'Penyedia daya darurat jika listrik padam' },
    { type: 'patch-panel',         label: 'Patch Panel Cat6',         desc: 'Panel terminasi kabel jaringan terpusat' },
  ];

  return (
    <div className="space-y-4">
      {/* Devices */}
      <div>
        <h3 className="font-bold text-sm text-white mb-2">Simbol Perangkat Jaringan 3D</h3>
        <div className="space-y-1.5">
          {deviceList.map((d) => (
            <div
              key={d.type}
              className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/80 transition-colors"
            >
              <span className="text-lg w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0 border border-white/10">
                {deviceIcons[d.type]}
              </span>
              <div>
                <div className="text-xs font-semibold text-slate-200">{d.label}</div>
                <div className="text-[10px] text-slate-400">{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room categories */}
      <div>
        <h3 className="font-bold text-sm text-white mb-2">Kategori Ruangan</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.entries(categoryColors) as [string, string][]).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-300 capitalize">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cable types */}
      <div>
        <h3 className="font-bold text-sm text-white mb-2">Jalur Pengkabelan 3D</h3>
        <div className="space-y-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 bg-sky-400 rounded-full" />
            <span className="text-slate-300">UTP Cat6 (Jalur intra-lantai dengan pulse animasi biru)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 border-t-2 border-dashed border-rose-500" />
            <span className="text-slate-300">Fiber Optik Backbone (Jalur vertikal shaft tangga antar lantai)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
