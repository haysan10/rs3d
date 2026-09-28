// src/data/rooms.ts
// Single source of truth for all hospital network data
// Coordinates are calibrated 1:1 against the real 3D architectural model:
// Building span: X [-11.3, +11.3] (22.6m), Z [-7.9, +7.9] (15.8m)
// Lantai 1: Y [0.0, 2.7m]
// Lantai 2: Y [2.7, 5.6m]

export type DeviceType =
  | 'desktop'
  | 'laptop'
  | 'printer'
  | 'ap'
  | 'switch'
  | 'core-switch'
  | 'distribution-switch'
  | 'router-firewall'
  | 'server'
  | 'ups'
  | 'patch-panel';

export interface NetworkDevice {
  id: string;
  type: DeviceType;
  label: string;
  qty?: number;
  position: [number, number, number]; // absolute world coordinates [x, y, z] in meters
  vlan?: number;
}

export type RoomCategory = 'administrasi' | 'medis' | 'penunjang' | 'service' | 'umum';

export interface VlanInfo {
  id: number;
  name: string;
  subnet: string;
}

export interface Room {
  id: string;
  floor: 1 | 2;
  name: string;
  category: RoomCategory;
  dimensions?: {
    width: number;
    length: number;
    height: number;
    wallThicknessCm: number;
  };
  vlan?: VlanInfo;
  boundsMin: [number, number, number]; // world space [x, y, z]
  boundsMax: [number, number, number];
  devices: NetworkDevice[];
  description: string;
}

// ─── VLAN TABLE ─────────────────────────────────────────────────────────────
export const vlans: VlanInfo[] = [
  { id: 10, name: 'Administrasi',    subnet: '192.168.10.0/24' },
  { id: 20, name: 'Medis',           subnet: '192.168.20.0/24' },
  { id: 30, name: 'ICU & OK',        subnet: '192.168.30.0/24' },
  { id: 40, name: 'Radiologi & Lab', subnet: '192.168.40.0/24' },
  { id: 50, name: 'Server',          subnet: '192.168.50.0/24' },
  { id: 60, name: 'WiFi Staf',       subnet: '192.168.60.0/24' },
  { id: 70, name: 'WiFi Pengunjung', subnet: '192.168.70.0/24' },
];

// ─── CATEGORY COLORS ────────────────────────────────────────────────────────
export const categoryColors: Record<RoomCategory, string> = {
  administrasi: '#B7E4C7',
  medis:        '#F7C6D9',
  penunjang:    '#FBDCB0',
  service:      '#D3D0F0',
  umum:         '#F1ECE3',
};

export const categoryColorsHex: Record<RoomCategory, number> = {
  administrasi: 0xB7E4C7,
  medis:        0xF7C6D9,
  penunjang:    0xFBDCB0,
  service:      0xD3D0F0,
  umum:         0xF1ECE3,
};

// ─── DEVICE COLORS & ICONS ──────────────────────────────────────────────────
export const deviceColors: Record<DeviceType, number> = {
  'desktop':              0x2563EB, // blue
  'laptop':               0x38BDF8, // sky
  'printer':              0x64748B, // slate
  'ap':                   0x10B981, // emerald green
  'switch':               0xF59E0B, // amber
  'core-switch':          0xEF4444, // bright red
  'distribution-switch':  0xF97316, // orange
  'router-firewall':      0xDC2626, // crimson
  'server':               0x8B5CF6, // purple
  'ups':                  0x059669, // dark green
  'patch-panel':          0x94A3B8, // silver
};

export const deviceIcons: Record<DeviceType, string> = {
  'desktop':              '🖥️',
  'laptop':               '💻',
  'printer':              '🖨️',
  'ap':                   '📡',
  'switch':               '🔀',
  'core-switch':          '⚡',
  'distribution-switch':  '🔄',
  'router-firewall':      '🔥',
  'server':               '🗄️',
  'ups':                  '🔋',
  'patch-panel':          '🔌',
};

// ─── EXACT CALIBRATED ROOMS & DEVICES ───────────────────────────────────────
export const rooms: Room[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // LANTAI 1 (Ground Floor: Y = 0.0 to 2.7m) - FULL 3D
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'l1-server',
    floor: 1,
    name: 'Ruang Server / Data Center',
    category: 'service',
    vlan: vlans.find(v => v.id === 50)!,
    boundsMin: [-11.13, 0.05, -7.45],
    boundsMax: [-7.32, 2.65, -3.46],
    devices: [
      { id: 'l1-srv-rack1',    type: 'server',          label: 'Rack Server 1',          qty: 1, position: [-10.2, 0.8, -6.5], vlan: 50 },
      { id: 'l1-srv-rack2',    type: 'server',          label: 'Rack Server 2 (Backup)', qty: 1, position: [-9.5, 0.8, -6.5], vlan: 50 },
      { id: 'l1-srv-simrs',    type: 'server',          label: 'Server SIMRS / DB',      qty: 1, position: [-8.7, 0.8, -6.5], vlan: 50 },
      { id: 'l1-srv-coresw',   type: 'core-switch',     label: 'Core Switch (Layer 3)',  qty: 1, position: [-10.0, 1.2, -4.5], vlan: 50 },
      { id: 'l1-srv-router',   type: 'router-firewall', label: 'Router / Firewall',      qty: 1, position: [-9.2, 1.2, -4.5], vlan: 50 },
      { id: 'l1-srv-patch',    type: 'patch-panel',     label: 'Patch Panel Cat6',       qty: 1, position: [-8.4, 1.4, -4.5], vlan: 50 },
      { id: 'l1-srv-ups',      type: 'ups',             label: 'UPS Online 10kVA',       qty: 1, position: [-7.8, 0.6, -6.2], vlan: 50 },
    ],
    description: 'Pusat Data & Server Rumah Sakit. Menampung Server SIMRS, database rekam medis elektronik, Core Switch L3 utama, dan UPS cadangan daya.',
  },
  {
    id: 'l1-frontoffice',
    floor: 1,
    name: 'Front Office / Pendaftaran',
    category: 'administrasi',
    vlan: vlans.find(v => v.id === 10)!,
    boundsMin: [-7.32, 0.05, -7.45],
    boundsMax: [-3.54, 2.65, -3.46],
    devices: [
      { id: 'l1-fo-sw',  type: 'switch',  label: 'Access Switch FO',  qty: 1, position: [-6.8, 1.0, -4.0], vlan: 10 },
      { id: 'l1-fo-ap',  type: 'ap',      label: 'AP Pendaftaran',    qty: 1, position: [-5.4, 2.4, -5.4], vlan: 60 },
      { id: 'l1-fo-pc1', type: 'desktop', label: 'PC Registrasi 1',   qty: 1, position: [-6.0, 0.8, -6.0], vlan: 10 },
      { id: 'l1-fo-pc2', type: 'desktop', label: 'PC Registrasi 2',   qty: 1, position: [-4.8, 0.8, -6.0], vlan: 10 },
      { id: 'l1-fo-prn', type: 'printer', label: 'Printer SEP/Karcis',qty: 1, position: [-4.0, 0.8, -4.5], vlan: 10 },
    ],
    description: 'Front Office dan loket pendaftaran pasien. Terhubung ke VLAN 10 Administrasi dengan printer thermal SEP dan barcode pasien.',
  },
  {
    id: 'l1-igd',
    floor: 1,
    name: 'IGD (Gawat Darurat)',
    category: 'medis',
    vlan: vlans.find(v => v.id === 20)!,
    boundsMin: [-3.54, 0.05, -7.45],
    boundsMax: [-0.11, 2.65, -3.46],
    devices: [
      { id: 'l1-igd-sw',  type: 'switch',  label: 'Access Switch IGD', qty: 1, position: [-3.0, 1.0, -4.0], vlan: 20 },
      { id: 'l1-igd-ap',  type: 'ap',      label: 'Access Point IGD',  qty: 1, position: [-1.8, 2.4, -5.4], vlan: 60 },
      { id: 'l1-igd-pc',  type: 'desktop', label: 'PC Triase IGD',     qty: 2, position: [-2.2, 0.8, -6.2], vlan: 20 },
      { id: 'l1-igd-prn', type: 'printer', label: 'Printer Gelang Pasien', qty: 1, position: [-0.8, 0.8, -4.5], vlan: 20 },
    ],
    description: 'Instalasi Gawat Darurat (24 Jam). Terhubung ke VLAN 20 Medis untuk input status kegawatdaruratan dan resep cito ke farmasi.',
  },
  {
    id: 'l1-poli',
    floor: 1,
    name: 'Poliklinik Rawat Jalan',
    category: 'medis',
    vlan: vlans.find(v => v.id === 20)!,
    boundsMin: [-0.11, 0.05, -7.45],
    boundsMax: [6.32, 2.65, -3.46],
    devices: [
      { id: 'l1-poli-sw',  type: 'switch',  label: 'Access Switch Poli', qty: 1, position: [0.8, 1.0, -4.0], vlan: 20 },
      { id: 'l1-poli-ap',  type: 'ap',      label: 'Access Point Poli',  qty: 1, position: [3.1, 2.4, -5.4], vlan: 60 },
      { id: 'l1-poli-pc1', type: 'desktop', label: 'PC Dokter Poli 1',   qty: 1, position: [1.8, 0.8, -6.0], vlan: 20 },
      { id: 'l1-poli-pc2', type: 'desktop', label: 'PC Dokter Poli 2',   qty: 1, position: [4.5, 0.8, -6.0], vlan: 20 },
      { id: 'l1-poli-prn', type: 'printer', label: 'Printer Resep Poli', qty: 1, position: [5.5, 0.8, -4.5], vlan: 20 },
    ],
    description: 'Ruang Poliklinik Rawat Jalan terpadu. Konsultasi dokter spesialis dengan integrasi rekam medis elektronik (EMR) VLAN 20.',
  },
  {
    id: 'l1-radiologi',
    floor: 1,
    name: 'Radiologi',
    category: 'medis',
    vlan: vlans.find(v => v.id === 40)!,
    dimensions: { width: 4, length: 4, height: 3, wallThicknessCm: 25 },
    boundsMin: [6.32, 0.05, -7.46],
    boundsMax: [8.62, 2.65, -3.46],
    devices: [
      { id: 'l1-rad-sw',  type: 'switch',  label: 'Switch Radiologi',   qty: 1, position: [6.8, 1.0, -4.0], vlan: 40 },
      { id: 'l1-rad-pc',  type: 'desktop', label: 'Workstation PACS',   qty: 2, position: [7.5, 0.8, -5.8], vlan: 40 },
      { id: 'l1-rad-prn', type: 'printer', label: 'Dry Imager DICOM',  qty: 1, position: [8.0, 0.8, -4.2], vlan: 40 },
    ],
    description: 'Instalasi Radiologi berpelindung timbal (dinding 25cm). Jaringan VLAN 40 throughput tinggi untuk transmisi citra PACS/DICOM.',
  },
  {
    id: 'l1-lab',
    floor: 1,
    name: 'Laboratorium Klinik',
    category: 'medis',
    vlan: vlans.find(v => v.id === 40)!,
    boundsMin: [8.62, 0.05, -7.45],
    boundsMax: [11.1, 2.65, -3.46],
    devices: [
      { id: 'l1-lab-sw',  type: 'switch',  label: 'Switch Laboratorium', qty: 1, position: [9.0, 1.0, -4.0], vlan: 40 },
      { id: 'l1-lab-pc',  type: 'desktop', label: 'PC Analisis Sampel',  qty: 2, position: [9.8, 0.8, -5.8], vlan: 40 },
      { id: 'l1-lab-prn', type: 'printer', label: 'Printer Hasil Uji',  qty: 1, position: [10.5, 0.8, -4.2], vlan: 40 },
    ],
    description: 'Laboratorium patologi klinik. Analis hematologi dan kimia darah terhubung via VLAN 40 untuk transmisi otomatis hasil uji ke SIMRS.',
  },
  {
    id: 'l1-farmasi',
    floor: 1,
    name: 'Farmasi / Depo Obat',
    category: 'medis',
    vlan: vlans.find(v => v.id === 20)!,
    boundsMin: [-11.13, 0.05, -3.46],
    boundsMax: [-7.32, 2.65, 1.01],
    devices: [
      { id: 'l1-far-sw',  type: 'switch',  label: 'Switch Farmasi',     qty: 1, position: [-10.2, 1.0, -1.0], vlan: 20 },
      { id: 'l1-far-pc',  type: 'desktop', label: 'PC Dispensing Obat', qty: 2, position: [-9.0, 0.8, -2.0], vlan: 20 },
      { id: 'l1-far-prn', type: 'printer', label: 'Printer Etiket Obat',qty: 1, position: [-8.0, 0.8, -0.5], vlan: 20 },
    ],
    description: 'Depo Farmasi rawat jalan & rawat inap. Penerimaan resep elektronik e-prescribing dari seluruh unit poli dan kamar rawat.',
  },
  {
    id: 'l1-rehab',
    floor: 1,
    name: 'Rehabilitasi Medis',
    category: 'medis',
    vlan: vlans.find(v => v.id === 20)!,
    boundsMin: [-7.32, 0.05, -3.46],
    boundsMax: [-3.75, 2.65, 1.01],
    devices: [
      { id: 'l1-rehab-sw', type: 'switch', label: 'Switch Rehab',     qty: 1, position: [-6.5, 1.0, -1.0], vlan: 20 },
      { id: 'l1-rehab-ap', type: 'ap',     label: 'AP Fisioterapi',   qty: 1, position: [-5.5, 2.4, -1.2], vlan: 60 },
      { id: 'l1-rehab-pc', type: 'desktop',label: 'PC Fisioterapi',   qty: 1, position: [-4.5, 0.8, -2.0], vlan: 20 },
    ],
    description: 'Unit Terapi Fisik dan Rehabilitasi Medis pasien. Dilengkapi jaringan nirkabel untuk pencatatan rekam medis terapi.',
  },
  {
    id: 'l1-ipsrs',
    floor: 1,
    name: 'IPSRS (Pemeliharaan)',
    category: 'administrasi',
    vlan: vlans.find(v => v.id === 10)!,
    boundsMin: [-3.75, 0.05, -1.46],
    boundsMax: [-0.02, 2.65, 3.06],
    devices: [
      { id: 'l1-ipsrs-sw',  type: 'switch',  label: 'Switch IPSRS',      qty: 1, position: [-3.0, 1.0, 0.5], vlan: 10 },
      { id: 'l1-ipsrs-pc',  type: 'desktop', label: 'PC Maintenance RS',qty: 2, position: [-1.8, 0.8, 1.2], vlan: 10 },
      { id: 'l1-ipsrs-prn', type: 'printer', label: 'Printer Log Kerja',qty: 1, position: [-0.8, 0.8, 2.0], vlan: 10 },
    ],
    description: 'Instalasi Pemeliharaan Sarana RS. Pengawasan sistem kelistrikan, genset, gas medik, dan infrastruktur gedung.',
  },
  {
    id: 'l1-dapur',
    floor: 1,
    name: 'Dapur & Gizi',
    category: 'service',
    boundsMin: [-0.02, 0.05, -1.46],
    boundsMax: [3.71, 2.65, 3.06],
    devices: [
      { id: 'l1-dapur-pc', type: 'desktop', label: 'PC Menu Gizi Diet', qty: 1, position: [1.8, 0.8, 0.8], vlan: 10 },
    ],
    description: 'Instalasi Dapur & Gizi. Manajemen porsi makan dan pantangan diet pasien sesuai rekomendasi dokter.',
  },
  {
    id: 'l1-gudang',
    floor: 1,
    name: 'Gudang Alat Medis',
    category: 'penunjang',
    boundsMin: [-11.13, 0.05, 1.01],
    boundsMax: [-6.33, 2.65, 3.06],
    devices: [],
    description: 'Gudang penyimpanan persediaan perbekalan medis non-steril dan alat kesehatan cadangan.',
  },
  {
    id: 'l1-toilet',
    floor: 1,
    name: 'Toilet Umum L1',
    category: 'umum',
    boundsMin: [-6.33, 0.05, 1.01],
    boundsMax: [-3.75, 2.65, 3.06],
    devices: [],
    description: 'Fasilitas toilet umum pengunjung dan staf Lantai 1.',
  },
  {
    id: 'l1-tangga',
    floor: 1,
    name: 'Tangga & Shaft Kabel FO',
    category: 'umum',
    boundsMin: [6.32, 0.05, 1.01],
    boundsMax: [11.1, 2.65, 3.06],
    devices: [],
    description: 'Shaft vertikal & tangga antar-lantai. Jalur pipa conduit tempat kabel Fiber Optik Backbone naik ke Distribution Switch Lantai 2.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LANTAI 2 (Upper Floor: Y = 2.7 to 5.6m) - FULL 3D
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'l2-rawat-a',
    floor: 2,
    name: 'Rawat Inap A',
    category: 'medis',
    vlan: vlans.find(v => v.id === 20)!,
    dimensions: { width: 4, length: 4, height: 3, wallThicknessCm: 15 },
    boundsMin: [-11.13, 2.75, -7.45],
    boundsMax: [-7.32, 5.5, -3.46],
    devices: [
      { id: 'l2-ra-sw',   type: 'switch',  label: 'Access Switch Ward A', qty: 1, position: [-10.2, 3.6, -4.0], vlan: 20 },
      { id: 'l2-ra-pc',   type: 'desktop', label: 'PC Nurse Ward A',      qty: 1, position: [-9.2, 3.5, -6.0], vlan: 20 },
      { id: 'l2-ra-lap',  type: 'laptop',  label: 'Laptop Dokter Visite', qty: 1, position: [-8.2, 3.5, -5.0], vlan: 20 },
    ],
    description: 'Ruang Rawat Inap Kelas A. Dilengkapi sistem pemantauan infus dan bed pasien berbasis jaringan SIMRS.',
  },
  {
    id: 'l2-rawat-b',
    floor: 2,
    name: 'Rawat Inap B',
    category: 'medis',
    vlan: vlans.find(v => v.id === 20)!,
    dimensions: { width: 4, length: 4, height: 3, wallThicknessCm: 15 },
    boundsMin: [-7.32, 2.75, -7.45],
    boundsMax: [-3.54, 5.5, -3.46],
    devices: [
      { id: 'l2-rb-pc',  type: 'desktop', label: 'PC Nurse Ward B',      qty: 1, position: [-5.8, 3.5, -6.0], vlan: 20 },
      { id: 'l2-rb-lap', type: 'laptop',  label: 'Laptop Dokter Visite', qty: 1, position: [-4.6, 3.5, -5.0], vlan: 20 },
    ],
    description: 'Ruang Rawat Inap Kelas B. Unit perawatan pasien standar dengan koneksi aman VLAN 20 Medis.',
  },
  {
    id: 'l2-rawat-c',
    floor: 2,
    name: 'Rawat Inap C',
    category: 'medis',
    vlan: vlans.find(v => v.id === 20)!,
    dimensions: { width: 4, length: 4, height: 3, wallThicknessCm: 15 },
    boundsMin: [-3.54, 2.75, -7.45],
    boundsMax: [-0.11, 5.5, -3.46],
    devices: [
      { id: 'l2-rc-pc',  type: 'desktop', label: 'PC Nurse Ward C',      qty: 1, position: [-2.0, 3.5, -6.0], vlan: 20 },
      { id: 'l2-rc-lap', type: 'laptop',  label: 'Laptop Dokter Visite', qty: 1, position: [-1.0, 3.5, -5.0], vlan: 20 },
    ],
    description: 'Ruang Rawat Inap Kelas C. Kapasitas multi-bed dengan akses rekam medis terpadu.',
  },
  {
    id: 'l2-icu',
    floor: 2,
    name: 'ICU (Intensive Care Unit)',
    category: 'medis',
    vlan: vlans.find(v => v.id === 30)!,
    dimensions: { width: 4, length: 4, height: 3, wallThicknessCm: 15 },
    boundsMin: [-0.11, 2.75, -7.45],
    boundsMax: [6.32, 5.5, -3.46],
    devices: [
      { id: 'l2-icu-sw',  type: 'switch',  label: 'Access Switch ICU',  qty: 1, position: [0.8, 3.6, -4.0], vlan: 30 },
      { id: 'l2-icu-ap',  type: 'ap',      label: 'AP ICU Dedicated',   qty: 1, position: [3.1, 5.0, -5.4], vlan: 60 },
      { id: 'l2-icu-pc',  type: 'desktop', label: 'PC Bedside Monitor', qty: 2, position: [2.0, 3.5, -6.0], vlan: 30 },
      { id: 'l2-icu-lap', type: 'laptop',  label: 'Laptop Dokter Anestesi', qty: 1, position: [4.5, 3.5, -5.5], vlan: 30 },
    ],
    description: 'Unit Perawatan Intensif (ICU). Terisolasi di VLAN 30 dengan latensi sangat rendah untuk pemantauan tanda vital real-time.',
  },
  {
    id: 'l2-ok',
    floor: 2,
    name: 'Ruang Operasi (OK)',
    category: 'medis',
    vlan: vlans.find(v => v.id === 30)!,
    boundsMin: [6.32, 2.75, -7.46],
    boundsMax: [11.1, 5.5, -3.46],
    devices: [
      { id: 'l2-ok-sw',  type: 'switch',  label: 'Switch Bedah OK',     qty: 1, position: [7.2, 3.6, -4.0], vlan: 30 },
      { id: 'l2-ok-pc',  type: 'desktop', label: 'Workstation Kamera OK', qty: 1, position: [8.5, 3.5, -6.0], vlan: 30 },
      { id: 'l2-ok-lap', type: 'laptop',  label: 'Laptop Dokter Bedah', qty: 1, position: [9.8, 3.5, -5.0], vlan: 30 },
    ],
    description: 'Kamar Bedah / Ruang Operasi steril. VLAN 30 khusus untuk streaming video laparoskopi dan dokumentasi tindakan operasi.',
  },
  {
    id: 'l2-nurse-station',
    floor: 2,
    name: 'Nurse Station L2',
    category: 'medis',
    vlan: vlans.find(v => v.id === 20)!,
    boundsMin: [-3.75, 2.75, -3.46],
    boundsMax: [3.71, 5.5, 1.01],
    devices: [
      { id: 'l2-ns-dsw',  type: 'distribution-switch', label: 'Distribution Switch L2', qty: 1, position: [0.0, 3.8, -1.0], vlan: 20 },
      { id: 'l2-ns-sw',   type: 'switch',              label: 'Access Switch NS',       qty: 1, position: [-1.2, 3.5, -0.5], vlan: 20 },
      { id: 'l2-ns-ap1',  type: 'ap',                  label: 'Access Point Utama 1',   qty: 1, position: [-2.0, 5.1, -1.2], vlan: 60 },
      { id: 'l2-ns-ap2',  type: 'ap',                  label: 'Access Point Utama 2',   qty: 1, position: [2.0, 5.1, -1.2], vlan: 70 },
      { id: 'l2-ns-pc',   type: 'desktop',             label: 'PC Central Monitor NS',  qty: 3, position: [0.0, 3.5, 0.2], vlan: 20 },
      { id: 'l2-ns-prn',  type: 'printer',             label: 'Printer Jaringan L2',    qty: 1, position: [1.8, 3.5, 0.0], vlan: 20 },
    ],
    description: 'Pusat Distribusi Jaringan Lantai 2. Di sini terdapat Distribution Switch penerima Fiber Optik dari Lantai 1, serta 2 AP pengcover seluruh lantai.',
  },
  {
    id: 'l2-dokter',
    floor: 2,
    name: 'Ruang Dokter Jaga',
    category: 'medis',
    vlan: vlans.find(v => v.id === 20)!,
    boundsMin: [-3.75, 2.75, 1.01],
    boundsMax: [-0.02, 5.5, 3.06],
    devices: [
      { id: 'l2-dok-pc',  type: 'desktop', label: 'PC Dokter Jaga',  qty: 3, position: [-2.5, 3.5, 2.0], vlan: 20 },
      { id: 'l2-dok-lap', type: 'laptop',  label: 'Laptop Dokter',   qty: 2, position: [-1.2, 3.5, 1.8], vlan: 20 },
      { id: 'l2-dok-prn', type: 'printer', label: 'Printer Laporan', qty: 1, position: [-0.5, 3.5, 2.4], vlan: 20 },
    ],
    description: 'Ruang kerja dan istirahat dokter jaga rawat inap. Koneksi ke SIMRS untuk telaah hasil lab dan radiologi.',
  },
  {
    id: 'l2-manajemen',
    floor: 2,
    name: 'Ruang Manajemen & Direksi',
    category: 'administrasi',
    vlan: vlans.find(v => v.id === 10)!,
    boundsMin: [-0.02, 2.75, 1.01],
    boundsMax: [3.71, 5.5, 3.06],
    devices: [
      { id: 'l2-mgmt-sw',  type: 'switch',  label: 'Switch Manajemen', qty: 1, position: [0.5, 3.6, 1.4], vlan: 10 },
      { id: 'l2-mgmt-pc',  type: 'desktop', label: 'PC Manajemen',     qty: 4, position: [1.8, 3.5, 2.0], vlan: 10 },
      { id: 'l2-mgmt-lap', type: 'laptop',  label: 'Laptop Direktur',  qty: 2, position: [2.8, 3.5, 1.6], vlan: 10 },
      { id: 'l2-mgmt-prn', type: 'printer', label: 'Printer Dokumen',  qty: 1, position: [3.2, 3.5, 2.5], vlan: 10 },
    ],
    description: 'Kantor Direksi dan Manajemen Rumah Sakit. Berada di VLAN 10 dengan firewall protektif terhadap laporan finansial dan analitik RS.',
  },
  {
    id: 'l2-laundry',
    floor: 2,
    name: 'Laundry & Linen',
    category: 'service',
    boundsMin: [-11.13, 2.75, -1.46],
    boundsMax: [-3.75, 5.5, 1.01],
    devices: [
      { id: 'l2-lnd-pc', type: 'desktop', label: 'PC Inventori Linen', qty: 1, position: [-7.0, 3.5, -0.2], vlan: 10 },
    ],
    description: 'Unit pengelolaan linen, seragam steril dokter bedah, dan cucian ruang rawat inap.',
  },
  {
    id: 'l2-toilet',
    floor: 2,
    name: 'Toilet L2',
    category: 'umum',
    boundsMin: [-11.13, 2.75, 1.01],
    boundsMax: [-6.33, 5.5, 3.06],
    devices: [],
    description: 'Fasilitas toilet umum Lantai 2.',
  },
  {
    id: 'l2-tangga',
    floor: 2,
    name: 'Tangga & Shaft FO L2',
    category: 'umum',
    boundsMin: [6.32, 2.75, 1.01],
    boundsMax: [11.1, 5.5, 3.06],
    devices: [],
    description: 'Akses tangga darurat dan shaft vertikal kabel Fiber Optik yang menghubungkan ke Lantai 1.',
  },
];

// ─── TOUR WAYPOINTS ─────────────────────────────────────────────────────────
export const tourWaypointsFloor1 = [
  'l1-tangga',
  'l1-server',
  'l1-frontoffice',
  'l1-igd',
  'l1-poli',
  'l1-radiologi',
  'l1-lab',
  'l1-farmasi',
  'l1-rehab',
  'l1-ipsrs',
];

export const tourWaypointsFloor2 = [
  'l2-tangga',
  'l2-nurse-station',
  'l2-rawat-a',
  'l2-rawat-b',
  'l2-rawat-c',
  'l2-icu',
  'l2-ok',
  'l2-dokter',
  'l2-manajemen',
  'l2-laundry',
];

// ─── TOPOLOGY CONNECTIONS ───────────────────────────────────────────────────
export type CableType = 'utp' | 'fiber';
export interface CableConnection {
  from: string;
  to: string;
  type: CableType;
}

export const cableConnections: CableConnection[] = [
  // ── LANTAI 1 INTERNAL (Server Room) ──
  { from: 'l1-srv-router',  to: 'l1-srv-coresw',  type: 'fiber' },
  { from: 'l1-srv-coresw',  to: 'l1-srv-rack1',   type: 'utp'   },
  { from: 'l1-srv-coresw',  to: 'l1-srv-rack2',   type: 'utp'   },
  { from: 'l1-srv-coresw',  to: 'l1-srv-simrs',   type: 'utp'   },
  { from: 'l1-srv-coresw',  to: 'l1-srv-patch',   type: 'utp'   },
  { from: 'l1-srv-ups',     to: 'l1-srv-coresw',  type: 'utp'   },

  // ── LANTAI 1 HORIZONTAL DISTRIBUTION (UTP) ──
  { from: 'l1-srv-coresw',  to: 'l1-fo-sw',       type: 'utp'   },
  { from: 'l1-srv-coresw',  to: 'l1-igd-sw',      type: 'utp'   },
  { from: 'l1-srv-coresw',  to: 'l1-poli-sw',     type: 'utp'   },
  { from: 'l1-srv-coresw',  to: 'l1-rad-sw',      type: 'utp'   },
  { from: 'l1-srv-coresw',  to: 'l1-lab-sw',      type: 'utp'   },
  { from: 'l1-srv-coresw',  to: 'l1-far-sw',      type: 'utp'   },
  { from: 'l1-srv-coresw',  to: 'l1-rehab-sw',    type: 'utp'   },
  { from: 'l1-srv-coresw',  to: 'l1-ipsrs-sw',    type: 'utp'   },

  // ── BACKBONE INTER-FLOOR (FIBER OPTIC) ──
  // Dari Core Switch L1 naik vertikal melalui shaft kabel ke Distribution Switch L2!
  { from: 'l1-srv-coresw',  to: 'l2-ns-dsw',      type: 'fiber' },

  // ── LANTAI 2 DISTRIBUTION (UTP) ──
  { from: 'l2-ns-dsw',      to: 'l2-ns-sw',       type: 'utp'   },
  { from: 'l2-ns-dsw',      to: 'l2-ra-sw',       type: 'utp'   },
  { from: 'l2-ns-dsw',      to: 'l2-icu-sw',      type: 'utp'   },
  { from: 'l2-ns-dsw',      to: 'l2-ok-sw',       type: 'utp'   },
  { from: 'l2-ns-dsw',      to: 'l2-mgmt-sw',     type: 'utp'   },

  // ── LANTAI 2 ACCESS SWITCHES TO END DEVICES ──
  { from: 'l2-ra-sw',       to: 'l2-ra-pc',       type: 'utp'   },
  { from: 'l2-ra-sw',       to: 'l2-ra-lap',      type: 'utp'   },
  { from: 'l2-icu-sw',      to: 'l2-icu-pc',      type: 'utp'   },
  { from: 'l2-icu-sw',      to: 'l2-icu-ap',      type: 'utp'   },
  { from: 'l2-ok-sw',       to: 'l2-ok-pc',       type: 'utp'   },
  { from: 'l2-ns-sw',       to: 'l2-ns-pc',       type: 'utp'   },
  { from: 'l2-ns-sw',       to: 'l2-ns-prn',      type: 'utp'   },
  { from: 'l2-ns-sw',       to: 'l2-ns-ap1',      type: 'utp'   },
  { from: 'l2-ns-sw',       to: 'l2-ns-ap2',      type: 'utp'   },
  { from: 'l2-mgmt-sw',     to: 'l2-mgmt-pc',     type: 'utp'   },
  { from: 'l2-mgmt-sw',     to: 'l2-mgmt-prn',    type: 'utp'   },
];

// Helper: get rooms by floor
export function getRoomsByFloor(floor: 1 | 2): Room[] {
  return rooms.filter(r => r.floor === floor);
}

// Helper: get room by id
export function getRoomById(id: string): Room | undefined {
  return rooms.find(r => r.id === id);
}

// Helper: get room center coordinate in world space
export function getRoomCenter(room: Room): [number, number, number] {
  return [
    (room.boundsMin[0] + room.boundsMax[0]) / 2,
    (room.boundsMin[1] + room.boundsMax[1]) / 2,
    (room.boundsMin[2] + room.boundsMax[2]) / 2,
  ];
}

// Helper: get tour rooms for active floor
export function getTourRooms(floor: 1 | 2): Room[] {
  const ids = floor === 1 ? tourWaypointsFloor1 : tourWaypointsFloor2;
  return ids.map(id => rooms.find(r => r.id === id)).filter((r): r is Room => !!r);
}

// Helper: map all devices
export function getAllDevicesMap(): Map<string, { device: NetworkDevice; room: Room }> {
  const map = new Map<string, { device: NetworkDevice; room: Room }>();
  for (const room of rooms) {
    for (const device of room.devices) {
      map.set(device.id, { device, room });
    }
  }
  return map;
}

// Stats
export const stats = {
  totalRooms: rooms.length,
  floor1Rooms: rooms.filter(r => r.floor === 1).length,
  floor2Rooms: rooms.filter(r => r.floor === 2).length,
  totalDevices: rooms.reduce((acc, r) => acc + r.devices.length, 0),
  totalVlans: vlans.length,
};
