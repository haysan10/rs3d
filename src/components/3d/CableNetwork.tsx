// src/components/3d/CableNetwork.tsx
// Structured Hospital Network Cabling with Physical Cable Trays, Corridor Trunking & Animated Traffic

import { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cableConnections, getAllDevicesMap } from '../../data/rooms';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  visible?: boolean;
}

// ─── PHYSICAL 3D CABLE TRAY & TRUNKING MESHES ────────────────────────────────
function PhysicalCableTrays({ floor }: { floor: 1 | 2 | 'all' }) {
  const showF1 = floor === 1 || floor === 'all';
  const showF2 = floor === 2 || floor === 'all';

  return (
    <group>
      {/* ─── LANTAI 1 CABLE TRAY SYSTEM (Y = 2.42m) ─── */}
      {showF1 && (
        <group>
          {/* Main Central Corridor Tray (West to East) */}
          <mesh position={[-0.75, 2.42, -1.5]} castShadow>
            <boxGeometry args={[18.0, 0.05, 0.4]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Tray Side Rails (Wire Mesh Flanges) */}
          <mesh position={[-0.75, 2.46, -1.3]}>
            <boxGeometry args={[18.0, 0.08, 0.02]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.75, 2.46, -1.7]}>
            <boxGeometry args={[18.0, 0.08, 0.02]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Branch to Server Room / MDF (North-West) */}
          <mesh position={[-9.2, 2.42, -3.2]}>
            <boxGeometry args={[0.35, 0.05, 3.4]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Branch to South Wing (Farmasi & Rehab) */}
          <mesh position={[-5.4, 2.42, -0.2]}>
            <boxGeometry args={[0.35, 0.05, 2.6]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[1.5, 2.42, -0.2]}>
            <boxGeometry args={[0.35, 0.05, 2.6]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Branch into Vertical Telecom Shaft near Stairs */}
          <mesh position={[7.8, 2.42, 0.0]}>
            <boxGeometry args={[0.35, 0.05, 3.0]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Ceiling Threaded Rod Hangers */}
          {[-8, -5, -2, 1, 4, 7].map((x, i) => (
            <mesh key={`hanger-f1-${i}`} position={[x, 2.58, -1.5]}>
              <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} />
            </mesh>
          ))}
        </group>
      )}

      {/* ─── LANTAI 2 CABLE TRAY SYSTEM (Y = 5.12m) ─── */}
      {showF2 && (
        <group>
          {/* Main Central Corridor Tray L2 (West to East) */}
          <mesh position={[-0.75, 5.12, -1.5]} castShadow>
            <boxGeometry args={[18.0, 0.05, 0.4]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-0.75, 5.16, -1.3]}>
            <boxGeometry args={[18.0, 0.08, 0.02]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.75, 5.16, -1.7]}>
            <boxGeometry args={[18.0, 0.08, 0.02]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Branch to Nurse Station / IDF L2 */}
          <mesh position={[1.0, 5.12, -2.8]}>
            <boxGeometry args={[0.35, 0.05, 2.6]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Branch to ICU & Ruang Operasi (South Wing) */}
          <mesh position={[-4.5, 5.12, -0.2]}>
            <boxGeometry args={[0.35, 0.05, 2.6]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-1.0, 5.12, -0.2]}>
            <boxGeometry args={[0.35, 0.05, 2.6]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Branch from Vertical Telecom Shaft L2 */}
          <mesh position={[7.8, 5.12, 0.0]}>
            <boxGeometry args={[0.35, 0.05, 3.0]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Ceiling Threaded Rod Hangers L2 */}
          {[-8, -5, -2, 1, 4, 7].map((x, i) => (
            <mesh key={`hanger-f2-${i}`} position={[x, 5.28, -1.5]}>
              <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} />
            </mesh>
          ))}
        </group>
      )}

      {/* ─── VERTICAL TELECOM RISER SHAFT CONDUIT (BACKBONE SLEEVE) ─── */}
      <group position={[7.8, 3.78, 1.5]}>
        {/* Fire-rated High-Visibility Orange Backbone Conduit Pipe */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2.7, 16]} />
          <meshStandardMaterial color="#F97316" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Wall Mounting Brackets */}
        <mesh position={[0, -0.9, 0]}>
          <boxGeometry args={[0.22, 0.06, 0.22]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[0.22, 0.06, 0.22]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </group>
  );
}

// ─── TRAVELING DATA PULSE ALONG CABLE ─────────────────────────────────────────
function CablePulse({
  curve,
  color,
  speed = 0.5,
  offset = 0,
  size = 0.05,
}: {
  curve: THREE.CatmullRomCurve3;
  color: number;
  speed?: number;
  offset?: number;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const t = ((Date.now() * speed * 0.0006) + offset) % 1;
    const pt = curve.getPointAt(t);
    meshRef.current.position.copy(pt);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} />
      {/* Visual glowing aura without costly WebGL light computations */}
      <mesh scale={1.6}>
        <sphereGeometry args={[size, 6, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </mesh>
  );
}

// ─── MASTER CABLE NETWORK COMPONENT ──────────────────────────────────────────
export function CableNetwork({ visible = true }: Props) {
  const { activeFloor, activeRoomId, isolateRoom, animateTraffic, viewMode, showCableTrays } = useAppStore();
  const devMap = useMemo(() => getAllDevicesMap(), []);

  // Compute realistic tray-routed cable pathways
  const cables = useMemo(() => {
    const result: {
      key: string;
      type: 'utp' | 'fiber';
      category: 'standard' | 'critical' | 'ap' | 'backbone';
      points: [number, number, number][];
      curve: THREE.CatmullRomCurve3;
      involvesActiveRoom: boolean;
    }[] = [];

    for (const conn of cableConnections) {
      const fromEntry = devMap.get(conn.from);
      const toEntry = devMap.get(conn.to);
      if (!fromEntry || !toEntry) continue;

      // Floor filter
      if (activeFloor !== 'all') {
        const involvesActiveFloor = fromEntry.room.floor === activeFloor || toEntry.room.floor === activeFloor;
        if (!involvesActiveFloor) continue;
      }

      const involvesActiveRoom = !!activeRoomId && (fromEntry.room.id === activeRoomId || toEntry.room.id === activeRoomId);

      // Room isolation filter
      if (isolateRoom && activeRoomId && !involvesActiveRoom) {
        continue;
      }

      const fromPos = fromEntry.device.position;
      const toPos = toEntry.device.position;

      // Determine cable category & color logic
      const isAP = fromEntry.device.type === 'ap' || toEntry.device.type === 'ap';
      const isCritical = ['l1-rad-sw', 'l1-lab-sw', 'l2-icu-sw', 'l2-ok-sw'].includes(fromEntry.device.id) ||
                         ['l1-rad-sw', 'l1-lab-sw', 'l2-icu-sw', 'l2-ok-sw'].includes(toEntry.device.id) ||
                         conn.to.includes('icu') || conn.to.includes('ok');

      let category: 'standard' | 'critical' | 'ap' | 'backbone' = 'standard';
      if (conn.type === 'fiber') category = 'backbone';
      else if (isAP) category = 'ap';
      else if (isCritical) category = 'critical';

      let pts: [number, number, number][] = [];

      // ─── 1. VERTICAL RISER: FIBER OPTIC BACKBONE ROUTE ───
      if (conn.type === 'fiber' && fromEntry.room.floor !== toEntry.room.floor) {
        pts = [
          // 1. From Core Switch in Server Room
          [fromPos[0], fromPos[1] + 0.15, fromPos[2]],
          // 2. Ascend to Server Room cable ladder
          [fromPos[0], 2.42, fromPos[2]],
          // 3. Exit Server Room to corridor tray junction
          [-9.2, 2.44, -1.5],
          // 4. Run along Floor 1 main corridor tray toward telecom riser shaft
          [7.8, 2.44, -1.5],
          // 5. Enter shaft base conduit
          [7.8, 2.44, 1.5],
          // 6. Vertical riser conduit ascent (firestop protected)
          [7.8, 5.14, 1.5],
          // 7. Exit into Floor 2 telecom tray
          [7.8, 5.14, -1.5],
          // 8. Run along Floor 2 corridor tray toward Nurse Station IDF
          [1.0, 5.14, -1.5],
          // 9. Drop down into Nurse Station Distribution Switch
          [1.0, 5.14, toPos[2]],
          [toPos[0], toPos[1] + 0.15, toPos[2]],
        ];
      } else {
        // ─── 2. HORIZONTAL STRUCTURED UTP ROUTE (VIA CORRIDOR TRAY) ───
        const floorY = fromEntry.room.floor === 1 ? 2.43 : 5.13;
        const corridorZ = -1.5;

        // If both devices are inside the same room (intra-room switch-to-device)
        if (fromEntry.room.id === toEntry.room.id) {
          pts = [
            [fromPos[0], fromPos[1] + 0.08, fromPos[2]],
            [(fromPos[0] + toPos[0]) / 2, Math.max(fromPos[1], toPos[1]) + 0.3, (fromPos[2] + toPos[2]) / 2],
            [toPos[0], toPos[1] + 0.08, toPos[2]],
          ];
        } else {
          // Structured route: Device -> Ceiling drop -> Corridor Tray -> Switch drop
          pts = [
            // Start at device port
            [fromPos[0], fromPos[1] + 0.08, fromPos[2]],
            // Rise to ceiling
            [fromPos[0], floorY, fromPos[2]],
            // Enter corridor cable tray perpendicularly
            [fromPos[0], floorY, corridorZ],
            // Travel along corridor cable tray to destination column
            [toPos[0], floorY, corridorZ],
            // Branch to destination room
            [toPos[0], floorY, toPos[2]],
            // Drop into destination device / switch
            [toPos[0], toPos[1] + 0.08, toPos[2]],
          ];
        }
      }

      // Smooth curve interpolation along tray path
      const curve = new THREE.CatmullRomCurve3(
        pts.map((p) => new THREE.Vector3(...p)),
        false,
        'catmullrom',
        0.15
      );

      result.push({
        key: `${conn.from}-${conn.to}`,
        type: conn.type,
        category,
        points: pts,
        curve,
        involvesActiveRoom,
      });
    }

    return result;
  }, [devMap, activeFloor, activeRoomId, isolateRoom]);

  if (!visible) return null;

  return (
    <group>
      {/* ─── PHYSICAL METALLIC CABLE TRAYS & CONDUITS ─── */}
      {showCableTrays && <PhysicalCableTrays floor={activeFloor} />}

      {/* ─── STRUCTURED CABLE PATHWAYS ─── */}
      {cables.map(({ key, type, category, points, involvesActiveRoom }) => {
        const isHighlighted = involvesActiveRoom || viewMode === 'network-only';

        let cableColor = '#38BDF8'; // Standard UTP Blue
        let lineWidth = 1.8;

        if (type === 'fiber') {
          cableColor = isHighlighted ? '#FF0055' : '#EF4444'; // Fiber Optic
          lineWidth = 3.6;
        } else if (category === 'critical') {
          cableColor = isHighlighted ? '#FB923C' : '#EA580C'; // Orange (ICU/OK/PACS)
          lineWidth = 2.2;
        } else if (category === 'ap') {
          cableColor = isHighlighted ? '#FACC15' : '#CA8A04'; // Yellow (PoE AP)
          lineWidth = 2.0;
        }

        return (
          <Line
            key={key}
            points={points}
            color={cableColor}
            lineWidth={lineWidth}
            dashed={type === 'fiber'}
            dashScale={type === 'fiber' ? 4 : 0}
            dashSize={type === 'fiber' ? 0.35 : 0}
            gapSize={type === 'fiber' ? 0.18 : 0}
            opacity={isHighlighted ? 1.0 : 0.8}
            transparent
          />
        );
      })}

      {/* ─── REAL-TIME ANIMATED DATA TRAFFIC PULSES ─── */}
      {animateTraffic && cables.map(({ key, type, category, curve, involvesActiveRoom }) => {
        let pulseColor = 0x38BDF8;
        let speed = 0.6;
        let size = involvesActiveRoom ? 0.07 : 0.05;

        if (type === 'fiber') {
          pulseColor = 0xFFFFFF; // Ultra-bright white/magenta pulse on fiber
          speed = 1.3;
          size = 0.07;
        } else if (category === 'critical') {
          pulseColor = 0xFED7AA;
          speed = 0.8;
          size = 0.06;
        } else if (category === 'ap') {
          pulseColor = 0xFEF08A;
          speed = 0.7;
          size = 0.055;
        }

        return (
          <group key={`pulse-${key}`}>
            <CablePulse
              curve={curve}
              color={pulseColor}
              speed={speed}
              offset={0}
              size={size}
            />
            {/* Secondary packet on high-throughput lines */}
            {(type === 'fiber' || category === 'critical') && (
              <CablePulse
                curve={curve}
                color={type === 'fiber' ? 0xFCA5A5 : 0xFB923C}
                speed={speed}
                offset={0.5}
                size={size * 0.9}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}
