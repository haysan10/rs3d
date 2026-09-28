// src/components/3d/NetworkDevice3D.tsx
import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import type { NetworkDevice } from '../../data/rooms';
import { deviceIcons, rooms } from '../../data/rooms';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  device: NetworkDevice;
  floor: 1 | 2;
  worldPosition: [number, number, number];
  visible?: boolean;
}

export function NetworkDevice3D({ device, floor, worldPosition, visible = true }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setHoveredDeviceId, hoveredDeviceId, activeFloor, deviceFilter, isolateRoom, activeRoomId } = useAppStore();

  const isHovered = hoveredDeviceId === device.id;

  // Animation: AP radio pulse & hover bounce (called unconditionally at top)
  useFrame(() => {
    if (ringRef.current && device.type === 'ap') {
      const s = 1 + (Math.sin(Date.now() * 0.004) * 0.2 + 0.2);
      ringRef.current.scale.set(s, s, s);
      const mat = ringRef.current.material as any;
      if (mat) mat.opacity = 0.5 - (s - 1);
    }
    if (groupRef.current && (isHovered || hovered)) {
      groupRef.current.position.y = worldPosition[1] + Math.sin(Date.now() * 0.008) * 0.04 + 0.04;
    } else if (groupRef.current) {
      groupRef.current.position.y = worldPosition[1];
    }
  });

  // 1. Filter by floor after all hooks
  if (activeFloor !== 'all' && floor !== activeFloor) {
    return null;
  }

  // 2. Filter by device category
  const isInfra = ['server', 'core-switch', 'distribution-switch', 'switch', 'router-firewall', 'ups', 'patch-panel'].includes(device.type);
  const isAP = device.type === 'ap';
  const isTerminal = ['desktop', 'laptop', 'printer'].includes(device.type);
  if (deviceFilter === 'infrastructure' && !isInfra) return null;
  if (deviceFilter === 'ap' && !isAP) return null;
  if (deviceFilter === 'terminals' && !isTerminal) return null;

  // 3. Filter by room isolation
  if (isolateRoom && activeRoomId) {
    const room = rooms.find(r => r.id === activeRoomId);
    const isInRoom = room?.devices.some(d => d.id === device.id);
    if (!isInRoom) return null;
  }

  if (!visible) return null;

  return (
    <group
      ref={groupRef}
      position={worldPosition}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHoveredDeviceId(device.id);
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHoveredDeviceId(null);
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        // find room by device
      }}
    >
      {/* ─── CUSTOM 3D HARDWARE MODELS ─── */}
      {device.type === 'server' && (
        <group>
          {/* Server Rack Cabinet */}
          <mesh castShadow position={[0, 0.45, 0]}>
            <boxGeometry args={[0.45, 0.9, 0.35]} />
            <meshStandardMaterial color={0x1E293B} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Server Unit Slats */}
          {[0.15, 0.3, 0.45, 0.6, 0.75].map((y, i) => (
            <mesh key={i} position={[0, y, 0.178]}>
              <boxGeometry args={[0.38, 0.08, 0.01]} />
              <meshStandardMaterial color={0x334155} metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
          {/* Glowing Status LEDs */}
          <mesh position={[-0.14, 0.75, 0.185]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color={0x10B981} />
          </mesh>
          <mesh position={[-0.1, 0.75, 0.185]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color={0x38BDF8} />
          </mesh>
        </group>
      )}

      {(device.type === 'core-switch' || device.type === 'distribution-switch' || device.type === 'switch') && (
        <group>
          {/* Switch Chassis */}
          <mesh castShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[device.type === 'core-switch' ? 0.55 : 0.4, 0.14, 0.24]} />
            <meshStandardMaterial
              color={device.type === 'core-switch' ? 0x991B1B : device.type === 'distribution-switch' ? 0xC2410C : 0x1E293B}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Port Bank */}
          <mesh position={[0, 0.08, 0.122]}>
            <boxGeometry args={[device.type === 'core-switch' ? 0.45 : 0.32, 0.06, 0.01]} />
            <meshStandardMaterial color={0x0F172A} metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Blinking Activity LEDs */}
          <mesh position={[0.15, 0.08, 0.128]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshBasicMaterial color={0x22C55E} />
          </mesh>
          <mesh position={[0.18, 0.08, 0.128]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshBasicMaterial color={0xF59E0B} />
          </mesh>
        </group>
      )}

      {device.type === 'router-firewall' && (
        <group>
          {/* Red Security Chassis */}
          <mesh castShadow position={[0, 0.09, 0]}>
            <boxGeometry args={[0.42, 0.16, 0.26]} />
            <meshStandardMaterial color={0xDC2626} metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Front Grille */}
          <mesh position={[0, 0.09, 0.132]}>
            <boxGeometry args={[0.34, 0.08, 0.01]} />
            <meshStandardMaterial color={0x1E1E1E} />
          </mesh>
          <mesh position={[0, 0.09, 0.138]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshBasicMaterial color={0xEF4444} />
          </mesh>
        </group>
      )}

      {device.type === 'ap' && (
        <group>
          {/* Access Point Saucer Dome */}
          <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.14, 0.06, 24]} />
            <meshStandardMaterial color={0xFFFFFF} roughness={0.2} metalness={0.1} />
          </mesh>
          {/* Center LED ring */}
          <mesh position={[0, -0.032, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
            <meshBasicMaterial color={0x10B981} />
          </mesh>
          {/* Animated WiFi Pulse Ring */}
          <mesh ref={ringRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.22, 0.28, 24]} />
            <meshBasicMaterial color={0x10B981} transparent opacity={0.35} />
          </mesh>
        </group>
      )}

      {device.type === 'desktop' && (
        <group>
          {/* Monitor */}
          <mesh castShadow position={[0, 0.22, 0]}>
            <boxGeometry args={[0.32, 0.22, 0.02]} />
            <meshStandardMaterial color={0x1E293B} metalness={0.4} roughness={0.3} />
          </mesh>
          {/* Screen Display */}
          <mesh position={[0, 0.22, 0.012]}>
            <planeGeometry args={[0.29, 0.19]} />
            <meshBasicMaterial color={0x0284C7} />
          </mesh>
          {/* Monitor Stand */}
          <mesh position={[0, 0.05, -0.02]}>
            <boxGeometry args={[0.04, 0.14, 0.02]} />
            <meshStandardMaterial color={0x64748B} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.14, 0.01, 0.12]} />
            <meshStandardMaterial color={0x334155} />
          </mesh>
          {/* Desktop Tower */}
          <mesh castShadow position={[0.22, 0.16, 0]}>
            <boxGeometry args={[0.1, 0.32, 0.26]} />
            <meshStandardMaterial color={0x0F172A} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      )}

      {device.type === 'laptop' && (
        <group>
          {/* Base */}
          <mesh castShadow position={[0, 0.01, 0]}>
            <boxGeometry args={[0.26, 0.015, 0.18]} />
            <meshStandardMaterial color={0x94A3B8} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Opened Screen */}
          <mesh position={[0, 0.11, -0.08]} rotation={[0.25, 0, 0]}>
            <boxGeometry args={[0.26, 0.17, 0.01]} />
            <meshStandardMaterial color={0x64748B} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.11, -0.074]} rotation={[0.25, 0, 0]}>
            <planeGeometry args={[0.23, 0.14]} />
            <meshBasicMaterial color={0x38BDF8} />
          </mesh>
        </group>
      )}

      {device.type === 'printer' && (
        <group>
          {/* Main Body */}
          <mesh castShadow position={[0, 0.14, 0]}>
            <boxGeometry args={[0.34, 0.24, 0.28]} />
            <meshStandardMaterial color={0xE2E8F0} roughness={0.4} metalness={0.1} />
          </mesh>
          {/* Paper Output Tray */}
          <mesh position={[0, 0.18, 0.16]}>
            <boxGeometry args={[0.24, 0.02, 0.1]} />
            <meshStandardMaterial color={0x94A3B8} />
          </mesh>
        </group>
      )}

      {device.type === 'ups' && (
        <group>
          <mesh castShadow position={[0, 0.3, 0]}>
            <boxGeometry args={[0.28, 0.6, 0.26]} />
            <meshStandardMaterial color={0x064E3B} metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Battery Status Display */}
          <mesh position={[0, 0.45, 0.132]}>
            <planeGeometry args={[0.14, 0.08]} />
            <meshBasicMaterial color={0x10B981} />
          </mesh>
        </group>
      )}

      {device.type === 'patch-panel' && (
        <group>
          <mesh castShadow position={[0, 0.04, 0]}>
            <boxGeometry args={[0.48, 0.08, 0.08]} />
            <meshStandardMaterial color={0x334155} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* ─── BILLBOARD TOOLTIP (Mounted ONLY on hover to maintain 60 FPS) ─── */}
      {(isHovered || hovered) && (
        <Html
          position={[0, 0.5, 0]}
          center
          distanceFactor={9}
          zIndexRange={[20, 30]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(8px)',
              border: `1.5px solid ${device.type.includes('switch') ? '#F59E0B' : device.type === 'server' ? '#8B5CF6' : '#0EA5E9'}`,
              borderRadius: 8,
              padding: '6px 12px',
              color: 'white',
              fontSize: 12,
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              transform: 'scale(1.05)',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
              <span>{deviceIcons[device.type]}</span>
              <span>{device.label}</span>
              {device.qty && device.qty > 1 && (
                <span style={{ background: '#0284C7', padding: '1px 5px', borderRadius: 4, fontSize: 10 }}>
                  ×{device.qty}
                </span>
              )}
            </div>
            <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3 }}>
              <span>Tipe: <strong style={{ color: '#E2E8F0' }}>{device.type}</strong></span>
              {device.vlan && (
                <span style={{ marginLeft: 8 }}>VLAN: <strong style={{ color: '#38BDF8' }}>{device.vlan}</strong></span>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
