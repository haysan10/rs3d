// src/components/3d/Hospital3DViewer.tsx
// Master 3D Interactive Visualization for the Hospital Building (Lantai 1 & Lantai 2)
// Optimized for 60 FPS Performance: Capped DPR, Lightweight Lighting, Static Baked Contact Shadows

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { rooms, getRoomCenter } from '../../data/rooms';
import { BuildingModel } from './BuildingModel';
import { HospitalFrontYard } from './HospitalFrontYard';
import { RoomOverlay } from './RoomOverlay';
import { NetworkDevice3D } from './NetworkDevice3D';
import { CableNetwork } from './CableNetwork';
import { DebugHelpers } from './DebugHelpers';
import { TourController, ManualController } from './WalkthroughController';
import { LoadingScreen } from '../ui/LoadingScreen';
import { RoomInfoPanel } from '../ui/RoomInfoPanel';
import { RoomNavigator } from '../ui/RoomNavigator';
import { TourCard } from '../ui/TourCard';
import { Minimap } from '../ui/Minimap';
import { ViewControls, TourOverlay, ManualModeOverlay } from '../ui/ViewControls';

function ProgressReporter() {
  const { progress, active } = useProgress();
  const { setModelLoadProgress, setModelLoading } = useAppStore();
  useEffect(() => {
    if (progress > 0) setModelLoadProgress(progress);
    if (!active && progress >= 95) setModelLoading(false);
  }, [progress, active, setModelLoadProgress, setModelLoading]);
  return null;
}

// ─── OPTIMIZED ENVIRONMENT LIGHTING RIG (LOW SHADER OVERHEAD) ─────────────────
function DynamicEnvironment() {
  const { lightingMode } = useAppStore();

  if (lightingMode === 'sunset') {
    return (
      <group>
        <ambientLight intensity={0.55} color="#FED7AA" />
        <directionalLight
          position={[-30, 10, 12]}
          intensity={2.0}
          color="#F97316"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={70}
          shadow-camera-left={-26}
          shadow-camera-right={26}
          shadow-camera-top={26}
          shadow-camera-bottom={-26}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[20, 8, -12]} intensity={0.7} color="#F43F5E" />
        <hemisphereLight args={['#FDE68A', '#831843', 0.5]} />
      </group>
    );
  }

  if (lightingMode === 'night') {
    return (
      <group>
        {/* Deep Night Ambient & Moonbeam */}
        <ambientLight intensity={0.4} color="#1E293B" />
        <directionalLight
          position={[-15, 25, 15]}
          intensity={0.5}
          color="#60A5FA"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={70}
          shadow-camera-left={-26}
          shadow-camera-right={26}
          shadow-camera-top={26}
          shadow-camera-bottom={-26}
          shadow-bias={-0.0001}
        />
        <hemisphereLight args={['#38BDF8', '#020617', 0.4]} />

        {/* 1 Key Front Canopy Night Light (Zero light sprawl) */}
        <pointLight position={[-14.2, 3.4, -5.4]} intensity={1.8} distance={10} color="#FEF08A" />
      </group>
    );
  }

  if (lightingMode === 'studio') {
    return (
      <group>
        <ambientLight intensity={0.9} color="#FFFFFF" />
        <directionalLight position={[-20, 30, 20]} intensity={1.0} color="#FFFFFF" />
        <directionalLight position={[20, 20, 20]} intensity={0.6} color="#F1F5F9" />
      </group>
    );
  }

  // Default: Day (Cahaya Alami Siang Hari - 1024x1024 Shadow Map)
  return (
    <group>
      <ambientLight intensity={0.8} color="#F8FAFC" />
      <directionalLight
        position={[-18, 30, 20]}
        intensity={1.4}
        color="#FFFBEB"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={70}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[18, 18, -18]} intensity={0.5} color="#E0F2FE" />
      <hemisphereLight args={['#E0F2FE', '#0F172A', 0.4]} />
    </group>
  );
}

// ─── CINEMATIC CAMERA RIG WITH DRONE 360° AUTO-ORBIT ─────────────────────────
function CameraRig() {
  const {
    activeFloor, walkthroughMode, activeRoomId, isolateRoom,
    autoOrbit, cameraPreset
  } = useAppStore();
  const controlsRef = useRef<any>(null);
  const targetLookAt = useRef(new THREE.Vector3(-4, 2.2, 0));
  const targetCamPos = useRef(new THREE.Vector3(-26, 13, 15));
  const isTransitioning = useRef(false);
  const orbitAngle = useRef(-Math.PI * 0.75);

  useEffect(() => {
    if (walkthroughMode !== 'none' || !controlsRef.current) return;

    // 1. Cinematic Camera Presets
    if (cameraPreset === 'server') {
      targetLookAt.current.set(-9.2, 1.2, -5.5);
      targetCamPos.current.set(-14, 3.8, -4.0);
      isTransitioning.current = true;
      return;
    }
    if (cameraPreset === 'distribution') {
      targetLookAt.current.set(1.0, 3.8, -4.0);
      targetCamPos.current.set(-3.5, 7.2, -3.0);
      isTransitioning.current = true;
      return;
    }
    if (cameraPreset === 'igd') {
      targetLookAt.current.set(-2.5, 1.2, -5.5);
      targetCamPos.current.set(-17, 4.5, -3.8);
      isTransitioning.current = true;
      return;
    }
    if (cameraPreset === 'isometric') {
      targetLookAt.current.set(-2, 2.2, 0);
      targetCamPos.current.set(-2, 26, 22);
      isTransitioning.current = true;
      return;
    }
    if (cameraPreset === 'front') {
      targetLookAt.current.set(-4, 2.2, 0);
      targetCamPos.current.set(-26, 13, 15);
      isTransitioning.current = true;
      return;
    }

    // 2. Focused Active Room Fly-To
    if (activeRoomId) {
      const room = rooms.find((r) => r.id === activeRoomId);
      if (room) {
        const center = getRoomCenter(room);
        targetLookAt.current.set(center[0], center[1] + 0.4, center[2]);
        targetCamPos.current.set(
          center[0] - 3.8,
          center[1] + 3.4,
          center[2] + 4.2
        );
        isTransitioning.current = true;
        return;
      }
    }

    // 3. Floor Transitions
    if (activeFloor === 1) {
      targetLookAt.current.set(-4, 1.2, 0);
      targetCamPos.current.set(-23, 9.5, 12);
      isTransitioning.current = true;
    } else if (activeFloor === 2) {
      targetLookAt.current.set(-4, 3.8, 0);
      targetCamPos.current.set(-23, 14, 14);
      isTransitioning.current = true;
    } else {
      // Whole building overview looking from front yard
      targetLookAt.current.set(-4, 2.2, 0);
      targetCamPos.current.set(-26, 13, 15);
      isTransitioning.current = true;
    }
  }, [activeFloor, walkthroughMode, activeRoomId, isolateRoom, cameraPreset]);

  useFrame((state, delta) => {
    if (walkthroughMode !== 'none' || !controlsRef.current) return;

    // 🛰️ Smooth Drone 360° Auto-Orbit
    if (autoOrbit && !isTransitioning.current) {
      orbitAngle.current += delta * 0.18;
      const radius = 28;
      const target = controlsRef.current.target;
      state.camera.position.x = target.x + radius * Math.cos(orbitAngle.current);
      state.camera.position.z = target.z + radius * Math.sin(orbitAngle.current);
      state.camera.position.y = 13.5 + Math.sin(orbitAngle.current * 2) * 1.5;
      controlsRef.current.update();
      return;
    }

    // Smooth Damped Lerp Fly-To
    if (isTransitioning.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.08);
      state.camera.position.lerp(targetCamPos.current, 0.08);
      controlsRef.current.update();

      if (
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.05 &&
        state.camera.position.distanceTo(targetCamPos.current) < 0.1
      ) {
        isTransitioning.current = false;
      }
    }
  });

  if (walkthroughMode !== 'none') return null;

  return (
    <OrbitControls
      ref={controlsRef}
      target={[-4, 2.2, 0]}
      minDistance={2}
      maxDistance={70}
      maxPolarAngle={Math.PI / 2 - 0.04}
      enableDamping
      dampingFactor={0.06}
    />
  );
}

// ─── MASTER 3D CANVAS VIEWER ──────────────────────────────────────────────────
export function Hospital3DViewer() {
  const {
    walkthroughMode, modelLoading, modelLoadProgress, debugMode, lightingMode
  } = useAppStore();

  return (
    <div className={`relative w-full h-full overflow-hidden select-none transition-colors duration-500 ${
      lightingMode === 'night' ? 'bg-[#030712]' : lightingMode === 'sunset' ? 'bg-[#180B1C]' : 'bg-[#0A101D]'
    }`}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: lightingMode === 'sunset' ? 1.25 : lightingMode === 'night' ? 1.4 : 1.15,
        }}
        camera={{
          fov: 46,
          near: 0.1,
          far: 250,
          position: [-26, 13, 15],
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Dynamic Environment Lighting */}
        <DynamicEnvironment />

        {/* Clean Ground Podium encompassing Hospital + Front Yard */}
        <mesh position={[-8, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial
            color={lightingMode === 'night' ? '#030712' : '#0F172A'}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Circular Grid Podium directly underneath building and yard */}
        <mesh position={[-8, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[28, 64]} />
          <meshStandardMaterial
            color={lightingMode === 'night' ? '#0F172A' : '#1E293B'}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {/* Soft Contact Shadows - Baked once (frames={1}) to eliminate continuous 60fps GPU render passes */}
        <ContactShadows
          position={[-8, -0.02, 0]}
          opacity={lightingMode === 'night' ? 0.45 : 0.65}
          scale={48}
          blur={1.8}
          far={10}
          resolution={512}
          frames={1}
          color="#000000"
        />

        {/* 3D Building, Front Yard & Network Layer */}
        <Suspense fallback={null}>
          <BuildingModel />
          <HospitalFrontYard />
          <ProgressReporter />

          {/* Room overlays for all rooms */}
          {rooms.map((room) => (
            <RoomOverlay key={room.id} room={room} visible />
          ))}

          {/* Network devices for all rooms */}
          {rooms.map((room) =>
            room.devices.map((device) => (
              <NetworkDevice3D
                key={device.id}
                device={device}
                floor={room.floor}
                worldPosition={device.position}
                visible={true}
              />
            ))
          )}

          {/* Cable network including vertical Fiber Optic backbone */}
          <CableNetwork visible />

          {/* Debug helpers */}
          <DebugHelpers />
        </Suspense>

        {/* Camera Control Rig */}
        <CameraRig />
        {walkthroughMode === 'tour' && <TourController />}
        {walkthroughMode === 'manual' && <ManualController />}
      </Canvas>

      {/* Loading overlay with safety bypass */}
      {modelLoading && <LoadingScreen progress={modelLoadProgress} />}

      {/* Debug mode banner */}
      {debugMode && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full z-50 shadow">
          🛠 DEBUG MODE — Klik scene untuk log koordinat real-time
        </div>
      )}

      {/* UI Overlays */}
      <RoomNavigator />
      <ViewControls />
      <TourOverlay />
      <ManualModeOverlay />
      {walkthroughMode === 'tour' && <TourCard />}
      <RoomInfoPanel />
      <Minimap />
    </div>
  );
}
