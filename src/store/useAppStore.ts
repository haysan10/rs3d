// src/store/useAppStore.ts
import { create } from 'zustand';

export type ViewMode = 'full' | 'network-only';
export type WalkthroughMode = 'none' | 'tour' | 'manual';
export type ActiveFloor = 1 | 2 | 'all';
export type DeviceFilter = 'all' | 'infrastructure' | 'ap' | 'terminals';
export type LightingMode = 'day' | 'sunset' | 'night' | 'studio';
export type CameraPreset = 'front' | 'server' | 'distribution' | 'igd' | 'isometric' | null;

interface AppState {
  // Floor selection: 1 (Lantai 1), 2 (Lantai 2), 'all' (Gedung Lengkap)
  activeFloor: ActiveFloor;
  setActiveFloor: (floor: ActiveFloor) => void;

  // View mode toggle: 'full' (Arsitektur Lengkap) vs 'network-only' (Hologram / Jaringan Saja)
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

  // Selected room
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;

  // Isolate room mode (only show this room and its network installation)
  isolateRoom: boolean;
  setIsolateRoom: (v: boolean) => void;

  // Hovered device
  hoveredDeviceId: string | null;
  setHoveredDeviceId: (id: string | null) => void;

  // Device category filter
  deviceFilter: DeviceFilter;
  setDeviceFilter: (filter: DeviceFilter) => void;

  // Cable animation (data traffic pulses)
  animateTraffic: boolean;
  setAnimateTraffic: (v: boolean) => void;
  toggleAnimateTraffic: () => void;

  // Physical Cable Tray display
  showCableTrays: boolean;
  setShowCableTrays: (v: boolean) => void;
  toggleShowCableTrays: () => void;

  // Lighting environment mode
  lightingMode: LightingMode;
  setLightingMode: (mode: LightingMode) => void;

  // Cinematic Camera movement & presets
  autoOrbit: boolean;
  setAutoOrbit: (v: boolean) => void;
  toggleAutoOrbit: () => void;
  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;

  // Walkthrough / POV
  walkthroughMode: WalkthroughMode;
  setWalkthroughMode: (mode: WalkthroughMode) => void;

  // Tour state
  tourStep: number;
  setTourStep: (step: number) => void;
  tourPlaying: boolean;
  setTourPlaying: (playing: boolean) => void;

  // Debug mode (enabled via ?debug=1)
  debugMode: boolean;
  setDebugMode: (v: boolean) => void;

  // Loading state
  modelLoading: boolean;
  modelLoadProgress: number;
  setModelLoading: (v: boolean) => void;
  setModelLoadProgress: (v: number) => void;

  // Side panels & room navigator
  sidePanelOpen: boolean;
  setSidePanelOpen: (v: boolean) => void;
  sidePanelTab: 'vlan' | 'topology' | 'legend';
  setSidePanelTab: (tab: 'vlan' | 'topology' | 'legend') => void;

  roomNavigatorOpen: boolean;
  setRoomNavigatorOpen: (v: boolean) => void;

  // Camera position (for minimap)
  cameraX: number;
  cameraZ: number;
  setCameraPosition: (x: number, z: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeFloor: 'all',
  setActiveFloor: (floor) => set({ activeFloor: floor, activeRoomId: null, tourStep: 0, cameraPreset: null }),

  viewMode: 'full',
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () => set((s) => ({ viewMode: s.viewMode === 'full' ? 'network-only' : 'full' })),

  activeRoomId: null,
  setActiveRoomId: (id) => set({ activeRoomId: id }),

  isolateRoom: false,
  setIsolateRoom: (v) => set({ isolateRoom: v }),

  hoveredDeviceId: null,
  setHoveredDeviceId: (id) => set({ hoveredDeviceId: id }),

  deviceFilter: 'all',
  setDeviceFilter: (filter) => set({ deviceFilter: filter }),

  animateTraffic: true,
  setAnimateTraffic: (v) => set({ animateTraffic: v }),
  toggleAnimateTraffic: () => set((s) => ({ animateTraffic: !s.animateTraffic })),

  showCableTrays: true,
  setShowCableTrays: (v) => set({ showCableTrays: v }),
  toggleShowCableTrays: () => set((s) => ({ showCableTrays: !s.showCableTrays })),

  lightingMode: 'day',
  setLightingMode: (mode) => set({ lightingMode: mode }),

  autoOrbit: false,
  setAutoOrbit: (v) => set({ autoOrbit: v }),
  toggleAutoOrbit: () => set((s) => ({ autoOrbit: !s.autoOrbit })),

  cameraPreset: 'front',
  setCameraPreset: (preset) => set({ cameraPreset: preset, autoOrbit: false }),

  walkthroughMode: 'none',
  setWalkthroughMode: (mode) => set({ walkthroughMode: mode, tourPlaying: mode === 'tour' }),

  tourStep: 0,
  setTourStep: (step) => set({ tourStep: step }),
  tourPlaying: false,
  setTourPlaying: (playing) => set({ tourPlaying: playing }),

  debugMode: false,
  setDebugMode: (v) => set({ debugMode: v }),

  modelLoading: true,
  modelLoadProgress: 0,
  setModelLoading: (v) => set({ modelLoading: v }),
  setModelLoadProgress: (v) => set({ modelLoadProgress: v }),

  sidePanelOpen: false,
  setSidePanelOpen: (v) => set({ sidePanelOpen: v }),
  sidePanelTab: 'vlan',
  setSidePanelTab: (tab) => set({ sidePanelTab: tab }),

  roomNavigatorOpen: false,
  setRoomNavigatorOpen: (v) => set({ roomNavigatorOpen: v }),

  cameraX: 0,
  cameraZ: 0,
  setCameraPosition: (x, z) => set({ cameraX: x, cameraZ: z }),
}));
