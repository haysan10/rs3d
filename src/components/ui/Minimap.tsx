// src/components/ui/Minimap.tsx
import { useAppStore } from '../../store/useAppStore';
import { rooms } from '../../data/rooms';

// Real calibrated building bounds: X -11.4..11.4, Z -8.0..8.0
const WORLD_MIN_X = -11.5;
const WORLD_MAX_X = 11.5;
const WORLD_MIN_Z = -8.0;
const WORLD_MAX_Z = 8.0;

function toMinimap(wx: number, wz: number, w: number, h: number) {
  const nx = (wx - WORLD_MIN_X) / (WORLD_MAX_X - WORLD_MIN_X);
  const nz = (wz - WORLD_MIN_Z) / (WORLD_MAX_Z - WORLD_MIN_Z);
  return { x: nx * w, y: nz * h };
}

export function Minimap() {
  const { cameraX, cameraZ, activeRoomId, walkthroughMode, activeFloor } = useAppStore();

  if (walkthroughMode === 'none') return null;

  const W = 160;
  const H = 120;
  const targetFloor = activeFloor === 1 ? 1 : 2;
  const floorRooms = rooms.filter((r) => r.floor === targetFloor);

  return (
    <div className="minimap shadow-2xl">
      <div className="px-2 py-1 bg-slate-900/90 text-[10px] text-sky-400 font-bold border-b border-sky-400/20 flex justify-between">
        <span>RADAR POV</span>
        <span>Lantai {targetFloor}</span>
      </div>
      <svg width={W} height={H} className="bg-slate-950/80">
        {/* Rooms */}
        {floorRooms.map((room) => {
          const a = toMinimap(room.boundsMin[0], room.boundsMin[2], W, H);
          const b = toMinimap(room.boundsMax[0], room.boundsMax[2], W, H);
          const isActive = room.id === activeRoomId;
          return (
            <rect
              key={room.id}
              x={Math.min(a.x, b.x)}
              y={Math.min(a.y, b.y)}
              width={Math.max(Math.abs(b.x - a.x), 2)}
              height={Math.max(Math.abs(b.y - a.y), 2)}
              fill={isActive ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.12)'}
              stroke={isActive ? '#0EA5E9' : 'rgba(255,255,255,0.3)'}
              strokeWidth="0.8"
            />
          );
        })}

        {/* Live Camera Position & Direction */}
        {(() => {
          const p = toMinimap(cameraX, cameraZ, W, H);
          return (
            <g>
              <circle cx={p.x} cy={p.y} r={4} fill="#0EA5E9" />
              <circle cx={p.x} cy={p.y} r={7} fill="none" stroke="#38BDF8" strokeWidth="1.2" opacity={0.6} />
            </g>
          );
        })()}

        {/* Compass N */}
        <text x={6} y={14} fontSize="9" fill="rgba(56,189,248,0.8)" fontWeight="bold">N↑</text>
      </svg>
    </div>
  );
}
