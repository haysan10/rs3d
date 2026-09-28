// src/components/3d/HospitalFrontYard.tsx
// Front Yard, Drop-Off Canopy, Ambulance Bay, Driveway, and Landscaping
// Positioned at the main entrance side (sisi kiri yang ada pintunya, memanjang ke belakang)

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  getAsphaltTexture,
  getPaverTexture,
  getGrassTexture,
} from '../../utils/proceduralTextures';

export function HospitalFrontYard() {
  const asphaltTex = useMemo(() => getAsphaltTexture(), []);
  const paverTex = useMemo(() => getPaverTexture(), []);
  const grassTex = useMemo(() => getGrassTexture(), []);

  const ambulanceBeaconRef = useRef<THREE.PointLight>(null);

  // Animate ambulance emergency beacon light
  useFrame(() => {
    if (ambulanceBeaconRef.current) {
      const pulse = Math.sin(Date.now() * 0.008);
      ambulanceBeaconRef.current.intensity = pulse > 0 ? 0.8 : 0.1;
      ambulanceBeaconRef.current.color.setHex(pulse > 0 ? 0xEF4444 : 0x3B82F6);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ─── 1. ASPHALT DRIVEWAY & ACCESS ROAD ─── */}
      <mesh position={[-20.5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 26]} />
        <meshStandardMaterial
          map={asphaltTex}
          roughness={0.85}
          metalness={0.1}
          color="#334155"
        />
      </mesh>

      {/* Road Curbs (Concrete Edges) */}
      <mesh position={[-29.6, 0.06, 0]}>
        <boxGeometry args={[0.3, 0.12, 26]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.6} />
      </mesh>
      <mesh position={[-11.4, 0.06, 0]}>
        <boxGeometry args={[0.3, 0.12, 26]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.6} />
      </mesh>

      {/* Road Center Line (White Dashed Paint) */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <mesh key={i} position={[-21, 0.015, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.25, 2.2]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      ))}

      {/* Zebra Cross Pedestrian Crossing leading to Main Lobby */}
      {[-7.2, -6.6, -6.0, -5.4, -4.8, -4.2].map((z, i) => (
        <mesh key={`zebra-${i}`} position={[-15.2, 0.016, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.8, 0.35]} />
          <meshBasicMaterial color="#F8FAFC" />
        </mesh>
      ))}

      {/* ─── 2. PEDESTRIAN ENTRANCE PLAZA (PAVED WALKWAY) ─── */}
      <mesh position={[-13.5, 0.02, -5.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 8.5]} />
        <meshStandardMaterial
          map={paverTex}
          roughness={0.7}
          metalness={0.05}
          color="#E2E8F0"
        />
      </mesh>

      {/* ─── 3. MAIN ENTRANCE PORTAL & OVERHEAD SIGN ON FAÇADE ─── */}
      <group position={[-11.36, 1.3, -5.4]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Overhead Entrance Signboard */}
        <mesh position={[0, 1.42, 0.06]} castShadow>
          <boxGeometry args={[3.4, 0.45, 0.08]} />
          <meshStandardMaterial color="#0284C7" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Architectural Entrance Frame */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[2.8, 2.4, 0.04]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glass Sliding Doors with Cyan Sheen */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[2.5, 2.2]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.55}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        {/* Warm Portal Lighting */}
        <pointLight position={[0, 1.5, 0.35]} intensity={0.6} distance={4} color="#FFFBEB" />
      </group>

      {/* ─── 4. MAIN ENTRANCE DROP-OFF CANOPY (LOBBY UTAMA & IGD) ─── */}
      <group position={[-14.2, 0, -5.4]}>
        {/* Support Steel Columns (Anthracite Finish) */}
        <mesh position={[-2.8, 1.8, -3.2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 3.6, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-2.8, 1.8, 3.2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 3.6, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[2.8, 1.8, -3.2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 3.6, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[2.8, 1.8, 3.2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 3.6, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Canopy Roof Slab */}
        <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 0.22, 7.2]} />
          <meshStandardMaterial color="#0F172A" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Translucent Tinted Glass Center Skylight on Canopy */}
        <mesh position={[0, 3.72, 0]}>
          <boxGeometry args={[4.5, 0.05, 5.0]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.45}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Canopy Fascia Signboard */}
        <mesh position={[-3.12, 3.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[6.8, 0.35]} />
          <meshStandardMaterial color="#0284C7" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Recessed Warm Ceiling Downlights */}
        <pointLight position={[0, 3.4, -1.8]} intensity={0.6} distance={6} color="#FFFBEB" />
        <pointLight position={[0, 3.4, 1.8]} intensity={0.6} distance={6} color="#FFFBEB" />
      </group>

      {/* ─── 5. DEDICATED AMBULANCE BAY (AREA PARKIR AMBULANS IGD) ─── */}
      <group position={[-17.8, 0.025, -2.5]}>
        {/* Yellow-Red Hazard Striped Parking Apron */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 5.8]} />
          <meshStandardMaterial color="#7F1D1D" roughness={0.7} />
        </mesh>

        {/* Yellow Bay Boundary Lines */}
        <mesh position={[-1.5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 5.8]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>
        <mesh position={[1.5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 5.8]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>
        <mesh position={[0, 0.005, -2.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.15, 0.15]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>

        {/* ─── 3D AMBULANCE VEHICLE ─── */}
        <group position={[0, 0, 0]}>
          {/* Main Van Body */}
          <mesh position={[0, 0.85, 0]} castShadow>
            <boxGeometry args={[1.9, 1.4, 4.4]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.2} />
          </mesh>

          {/* Cabin Windshield */}
          <mesh position={[0, 0.95, -1.8]} rotation={[0.3, 0, 0]}>
            <planeGeometry args={[1.6, 0.7]} />
            <meshStandardMaterial color="#0284C7" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Front Bumper */}
          <mesh position={[0, 0.35, -2.25]}>
            <boxGeometry args={[1.8, 0.4, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>

          {/* Headlights */}
          <mesh position={[-0.7, 0.5, -2.35]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
          <mesh position={[0.7, 0.5, -2.35]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>

          {/* Red Emergency Medical Side Stripe */}
          <mesh position={[-0.96, 0.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[4.2, 0.28]} />
            <meshBasicMaterial color="#DC2626" />
          </mesh>
          <mesh position={[0.96, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[4.2, 0.28]} />
            <meshBasicMaterial color="#DC2626" />
          </mesh>

          {/* Red Cross Symbol on Sides */}
          <mesh position={[-0.97, 1.1, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial color="#DC2626" />
          </mesh>
          <mesh position={[0.97, 1.1, 0.5]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial color="#DC2626" />
          </mesh>

          {/* Rooftop Emergency Flashing Lightbar */}
          <mesh position={[0, 1.62, -0.6]}>
            <boxGeometry args={[1.4, 0.12, 0.3]} />
            <meshStandardMaterial color="#EF4444" roughness={0.2} />
          </mesh>
          <pointLight
            ref={ambulanceBeaconRef}
            position={[0, 1.9, -0.6]}
            distance={5}
            intensity={0.6}
            color="#EF4444"
          />

          {/* 4 Rubber Tires */}
          {[
            [-0.95, 0.32, -1.3],
            [0.95, 0.32, -1.3],
            [-0.95, 0.32, 1.3],
            [0.95, 0.32, 1.3],
          ].map((pos, idx) => (
            <mesh key={idx} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ─── 6. LANDSCAPED GARDEN ISLAND & ROUNDABOUT ─── */}
      <group position={[-23.5, 0.03, 5.5]}>
        {/* Curving Grass Island */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[4.2, 32]} />
          <meshStandardMaterial
            map={grassTex}
            roughness={0.9}
            color="#16A34A"
          />
        </mesh>
        {/* Concrete Curb Ring */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.1, 4.35, 32]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.5} />
        </mesh>

        {/* Central Indonesian Flagpole (Tiang Bendera Merah Putih) */}
        <group position={[0, 0, 0]}>
          {/* Circular Pedestal */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.7, 0.8, 0.4, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Tall Silver Mast */}
          <mesh position={[0, 3.8, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 7.2, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Gold Finial Ball */}
          <mesh position={[0, 7.45, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Indonesian Red and White Flag */}
          <mesh position={[0.65, 6.8, 0]}>
            <boxGeometry args={[1.3, 0.45, 0.02]} />
            <meshBasicMaterial color="#DC2626" />
          </mesh>
          <mesh position={[0.65, 6.35, 0]}>
            <boxGeometry args={[1.3, 0.45, 0.02]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>

        {/* Palm Trees / Tropical Landscaping */}
        {[
          [-2.2, -1.8],
          [2.2, -1.8],
          [0, 2.5],
        ].map(([px, pz], idx) => (
          <group key={`tree-${idx}`} position={[px, 0, pz]}>
            {/* Trunk */}
            <mesh position={[0, 1.4, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.18, 2.8, 8]} />
              <meshStandardMaterial color="#78350F" roughness={0.9} />
            </mesh>
            {/* Palm Foliage Canopy */}
            <mesh position={[0, 2.8, 0]} castShadow>
              <sphereGeometry args={[1.1, 8, 8]} />
              <meshStandardMaterial color="#15803D" roughness={0.8} />
            </mesh>
            <mesh position={[0, 3.4, 0]} castShadow>
              <sphereGeometry args={[0.75, 8, 8]} />
              <meshStandardMaterial color="#16A34A" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Low Boxwood Garden Hedges */}
        {[-2.5, 0, 2.5].map((x, i) => (
          <mesh key={`hedge-${i}`} position={[x, 0.25, -2.8]} castShadow>
            <boxGeometry args={[1.2, 0.5, 0.5]} />
            <meshStandardMaterial color="#14532D" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ─── 7. HOSPITAL TOTEM MONUMENT SIGN (PYLON SIGNAGE) ─── */}
      <group position={[-27.5, 0, -8.5]} rotation={[0, Math.PI / 4, 0]}>
        {/* Concrete Foundation */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.8, 0.4, 0.8]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>

        {/* Monolith Pylon Sign */}
        <mesh position={[0, 2.0, 0]} castShadow>
          <boxGeometry args={[1.4, 3.2, 0.45]} />
          <meshStandardMaterial color="#0F172A" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Blue Front Face Panel */}
        <mesh position={[0, 2.1, 0.23]}>
          <planeGeometry args={[1.2, 2.8]} />
          <meshStandardMaterial color="#0284C7" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Glowing Red Cross Icon */}
        <mesh position={[0, 3.0, 0.24]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>

        {/* Ground Uplight Spotting the Totem */}
        <pointLight position={[0, 0.5, 0.8]} intensity={0.8} distance={4} color="#38BDF8" />
      </group>

      {/* ─── 8. SOLAR BOLLARD LIGHTS ALONG WALKWAYS ─── */}
      {[-8.5, -6.5, -4.5, -2.5, -0.5, 1.5, 3.5].map((z, i) => (
        <group key={`bollard-${i}`} position={[-11.7, 0, z]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.92, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.08, 8]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
