// src/components/3d/RoomOverlay.tsx
import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { Room } from '../../data/rooms';
import { categoryColorsHex } from '../../data/rooms';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  room: Room;
  visible?: boolean;
}

export function RoomOverlay({ room, visible = true }: Props) {
  const meshRef = useRef<Mesh>(null);
  const { activeRoomId, setActiveRoomId, viewMode, activeFloor } = useAppStore();
  const isActive = activeRoomId === room.id;

  useFrame(() => {
    if (meshRef.current && isActive) {
      const t = Date.now() * 0.003;
      const mat = meshRef.current.material as any;
      if (mat) mat.opacity = 0.5 + Math.sin(t) * 0.15;
    }
  });

  // Filter by active floor after all hooks
  if (activeFloor !== 'all' && room.floor !== activeFloor) {
    return null;
  }

  const cx = (room.boundsMin[0] + room.boundsMax[0]) / 2;
  const cz = (room.boundsMin[2] + room.boundsMax[2]) / 2;
  const w = Math.abs(room.boundsMax[0] - room.boundsMin[0]);
  const d = Math.abs(room.boundsMax[2] - room.boundsMin[2]);
  const floorY = room.boundsMin[1] + 0.05; // slightly above slab surface

  const color = categoryColorsHex[room.category] ?? 0xF1ECE3;

  if (!visible || w < 0.1 || d < 0.1) return null;

  const planeW = Math.max(w - 0.15, 0.2);
  const planeD = Math.max(d - 0.15, 0.2);

  return (
    <group>
      {/* Floor overlay plane */}
      <mesh
        ref={meshRef}
        position={[cx, floorY, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveRoomId(isActive ? null : room.id);
        }}
        onPointerEnter={() => (document.body.style.cursor = 'pointer')}
        onPointerLeave={() => (document.body.style.cursor = 'auto')}
      >
        <planeGeometry args={[planeW, planeD]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={isActive ? 0.6 : (viewMode === 'network-only' ? 0.38 : 0.22)}
          depthWrite={false}
          roughness={0.2}
        />
      </mesh>

      {/* Room badge only shown when active (prevents React 19 unmount clutter) */}
      {isActive && (
        <Html
          position={[cx, floorY + 0.3, cz]}
          center
          distanceFactor={10}
          zIndexRange={[5, 15]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(15,23,42,0.92)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid #0EA5E9',
              borderRadius: 8,
              padding: '4px 10px',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            }}
          >
            {room.name}
            {room.vlan && (
              <span style={{ marginLeft: 8, fontSize: 10, color: '#38BDF8', fontWeight: 500 }}>
                VLAN {room.vlan.id}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
