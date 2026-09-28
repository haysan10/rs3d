// src/components/3d/BuildingModel.tsx
import { useEffect, useRef, useMemo } from 'react';
import { useGLTF, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { getRoomById } from '../../data/rooms';
import { useDebugClick } from './DebugHelpers';
import {
  getHospitalTileTexture,
  getHospitalWallTexture,
  getWoodDoorTexture,
  getMedicalVinylTexture,
} from '../../utils/proceduralTextures';

const MODEL_URL = '/models/lantai_2.glb';
useGLTF.preload(MODEL_URL);

const FLOOR_SPLIT_Y = 2.75;

export function BuildingModel() {
  const {
    viewMode, activeFloor, activeRoomId, isolateRoom,
    setModelLoading, setModelLoadProgress
  } = useAppStore();
  const { scene } = useGLTF(MODEL_URL);
  const { progress, active } = useProgress();
  const handleDebugClick = useDebugClick();
  const groupRef = useRef<THREE.Group>(null);
  const meshDataRef = useRef<Map<THREE.Mesh, {
    isFloor2: boolean;
    center: THREE.Vector3;
    origColor: THREE.Color;
  }>>(new Map());

  // Cached procedural textures
  const tileTex = useMemo(() => getHospitalTileTexture(512, 4, '#F8FAFC', '#CBD5E1'), []);
  const wallTex = useMemo(() => getHospitalWallTexture(), []);
  const woodTex = useMemo(() => getWoodDoorTexture(), []);
  const vinylTex = useMemo(() => getMedicalVinylTexture('#0D9488'), []);

  // Report loading progress
  useEffect(() => {
    if (progress > 0) setModelLoadProgress(progress);
    if (!active && progress >= 99) setModelLoading(false);
  }, [progress, active, setModelLoadProgress, setModelLoading]);

  // Index meshes and apply realistic PBR textures & materials
  useEffect(() => {
    if (!scene) return;

    scene.updateMatrixWorld(true);
    meshDataRef.current.clear();

    const box = new THREE.Box3();
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = (child.name || '').toLowerCase();
        const isStructure = name.includes('wall') || name.includes('slab') || name.includes('floor');
        child.castShadow = isStructure;
        child.receiveShadow = isStructure;

        box.setFromObject(child);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const isFloor2 = center.y >= FLOOR_SPLIT_Y || box.min.y >= FLOOR_SPLIT_Y - 0.1;

        const mat = Array.isArray(child.material) ? child.material[0] : child.material;
        const origColor = mat && (mat as any).color ? (mat as any).color.clone() : new THREE.Color(0xF8FAFC);

        meshDataRef.current.set(child, { isFloor2, center, origColor });

        // Apply realistic materials and textures
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            const name = (child.name || '').toLowerCase();

            if (name.includes('wall') || name.includes('dinding')) {
              m.map = wallTex;
              m.color.set(0xF8FAFC);
              m.roughness = 0.6;
              m.metalness = 0.05;
              m.needsUpdate = true;
            } else if (name.includes('slab') || name.includes('floor') || name.includes('lantai')) {
              m.map = tileTex;
              m.color.set(0xFFFFFF);
              m.roughness = 0.28;
              m.metalness = 0.08;
              m.needsUpdate = true;
            } else if (name.includes('skirting') || name.includes('plinth')) {
              m.color.set(0x334155);
              m.roughness = 0.5;
              m.metalness = 0.1;
              m.needsUpdate = true;
            } else if (name.includes('opening') || name.includes('door') || name.includes('pintu')) {
              if (name.includes('glass') || name.includes('window')) {
                m.color.set(0x7DD3FC);
                m.roughness = 0.08;
                m.metalness = 0.8;
                m.transparent = true;
                m.opacity = 0.45;
              } else {
                m.map = woodTex;
                m.color.set(0xD97706);
                m.roughness = 0.45;
                m.metalness = 0.1;
              }
              m.needsUpdate = true;
            } else if (name.includes('item') || name.includes('furniture') || name.includes('chair') || name.includes('table')) {
              m.color.set(0x475569);
              m.roughness = 0.4;
              m.metalness = 0.2;
              m.needsUpdate = true;
            }
          }
        });
      }
    });

    setModelLoadProgress(100);
    const timer = setTimeout(() => setModelLoading(false), 300);
    return () => clearTimeout(timer);
  }, [scene, tileTex, wallTex, woodTex, vinylTex, setModelLoadProgress, setModelLoading]);

  // Dynamic appearance updates based on floor, viewMode, and room isolation
  useEffect(() => {
    if (!scene || meshDataRef.current.size === 0) return;

    const activeRoom = (isolateRoom && activeRoomId) ? getRoomById(activeRoomId) : null;

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const data = meshDataRef.current.get(child);
      if (!data) return;

      const { isFloor2, center } = data;
      const name = (child.name || '').toLowerCase();
      const isWall = name.includes('wall') || name.includes('dinding');
      const isFloor = name.includes('slab') || name.includes('floor') || name.includes('lantai');
      const isFurniture = name.includes('item') || name.includes('furniture') || name.includes('chair') || name.includes('table');

      // Check if mesh is inside the isolated room
      let isInsideActiveRoom = false;
      if (activeRoom) {
        const padding = 1.2;
        isInsideActiveRoom =
          center.x >= activeRoom.boundsMin[0] - padding && center.x <= activeRoom.boundsMax[0] + padding &&
          center.y >= activeRoom.boundsMin[1] - 0.5 && center.y <= activeRoom.boundsMax[1] + 1.5 &&
          center.z >= activeRoom.boundsMin[2] - padding && center.z <= activeRoom.boundsMax[2] + padding;
      }

      // 1. Floor isolation
      if (activeFloor === 1) {
        if (isFloor2) {
          child.visible = false;
          return;
        } else {
          child.visible = true;
        }
      } else if (activeFloor === 2) {
        child.visible = true;
      } else {
        child.visible = true;
      }

      // 2. Room isolation mode ("Lihat Ruangan dan Jaringan Saja")
      if (activeRoom) {
        if (!isInsideActiveRoom) {
          // Ghost or hide elements outside the isolated room
          if (viewMode === 'network-only') {
            child.visible = false;
          } else {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m) => {
              if (m instanceof THREE.MeshStandardMaterial) {
                m.transparent = true;
                m.opacity = 0.05;
                m.depthWrite = false;
              }
            });
          }
          return;
        } else {
          child.visible = true;
        }
      }

      // 3. View Mode: Network X-Ray vs Full Architecture
      if (viewMode === 'network-only') {
        if (isWall) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            if (m instanceof THREE.MeshStandardMaterial) {
              m.transparent = true;
              m.opacity = 0.12;
              m.depthWrite = false;
              m.color.set(0x0284C7); // Cyan holographic blueprint tint
              m.map = null;
              m.needsUpdate = true;
            }
          });
        }
        if (isFurniture) {
          child.visible = false;
          return;
        }
      } else {
        // Restore standard full architecture material with textures
        child.visible = true;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            if (!name.includes('opening') && !name.includes('glass')) {
              m.transparent = false;
              m.opacity = 1.0;
              m.depthWrite = true;

              if (isWall) {
                m.map = wallTex;
                m.color.set(0xF8FAFC);
              } else if (isFloor) {
                m.map = tileTex;
                m.color.set(0xFFFFFF);
              }
              m.needsUpdate = true;
            }
          }
        });
      }
    });
  }, [viewMode, activeFloor, activeRoomId, isolateRoom, scene, wallTex, tileTex]);

  if (!scene) return null;

  return (
    <group ref={groupRef} onClick={handleDebugClick}>
      <primitive object={scene} />
    </group>
  );
}
