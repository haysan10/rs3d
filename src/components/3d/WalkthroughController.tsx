// src/components/3d/WalkthroughController.tsx
import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { rooms, getTourRooms } from '../../data/rooms';
import { useAppStore } from '../../store/useAppStore';

// ─── Auto Tour Controller ────────────────────────────────────────────────────
export function TourController() {
  const { tourStep, setTourStep, tourPlaying, walkthroughMode, setWalkthroughMode, setActiveRoomId, setCameraPosition, activeFloor } = useAppStore();
  const { camera } = useThree();

  const floorNumber = activeFloor === 1 ? 1 : 2;
  const tourRooms = getTourRooms(floorNumber);
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const arrived = useRef(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute camera position for a tour room
  function getRoomCamPos(step: number): { pos: THREE.Vector3; look: THREE.Vector3 } {
    const room = tourRooms[step];
    if (!room) return { pos: new THREE.Vector3(0, 10, 20), look: new THREE.Vector3(0, 1.5, 0) };
    const cx = (room.boundsMin[0] + room.boundsMax[0]) / 2;
    const cz = (room.boundsMin[2] + room.boundsMax[2]) / 2;
    const cy = room.boundsMin[1] + 1.6; // eye height
    return {
      pos: new THREE.Vector3(cx, cy + 0.6, cz + 2.5),
      look: new THREE.Vector3(cx, cy, cz),
    };
  }

  useEffect(() => {
    if (walkthroughMode !== 'tour') return;
    const { pos, look } = getRoomCamPos(tourStep);
    targetPos.current.copy(pos);
    targetLook.current.copy(look);
    arrived.current = false;
    setActiveRoomId(tourRooms[tourStep]?.id ?? null);
  }, [tourStep, walkthroughMode, activeFloor]);

  useFrame((_, delta) => {
    if (walkthroughMode !== 'tour') return;

    if (!arrived.current) {
      const speed = delta * 1.5;
      camera.position.lerp(targetPos.current, speed);
      camera.lookAt(targetLook.current);

      const dist = camera.position.distanceTo(targetPos.current);
      if (dist < 0.2) {
        arrived.current = true;
        const currentRoom = tourRooms[tourStep];
        if (currentRoom) {
          const cx = (currentRoom.boundsMin[0] + currentRoom.boundsMax[0]) / 2;
          const cz = (currentRoom.boundsMin[2] + currentRoom.boundsMax[2]) / 2;
          setCameraPosition(cx, cz);
        }

        if (tourPlaying) {
          autoAdvanceTimer.current = setTimeout(() => {
            if (tourStep < tourRooms.length - 1) {
              setTourStep(tourStep + 1);
            } else {
              setWalkthroughMode('none');
            }
          }, 5000);
        }
      }
    }

    setCameraPosition(camera.position.x, camera.position.z);
  });

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, [tourStep]);

  return null;
}

// ─── Manual FPS Controller ────────────────────────────────────────────────────
const MOVE_SPEED = 4.5;
const LOOK_SENSITIVITY = 0.002;

export function ManualController() {
  const { walkthroughMode, setWalkthroughMode, setActiveRoomId, setCameraPosition, activeFloor } = useAppStore();
  const { camera, gl } = useThree();
  const keys = useRef<Set<string>>(new Set());
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isLocked = useRef(false);

  const eyeHeight = activeFloor === 2 ? 4.3 : 1.6;

  // Detect which room camera is inside
  const checkRoom = useCallback((pos: THREE.Vector3) => {
    for (const room of rooms) {
      if (
        pos.x >= room.boundsMin[0] && pos.x <= room.boundsMax[0] &&
        pos.y >= room.boundsMin[1] - 0.5 && pos.y <= room.boundsMax[1] + 0.5 &&
        pos.z >= room.boundsMin[2] && pos.z <= room.boundsMax[2]
      ) {
        setActiveRoomId(room.id);
        return;
      }
    }
    setActiveRoomId(null);
  }, [setActiveRoomId]);

  useEffect(() => {
    if (walkthroughMode !== 'manual') return;

    const canvas = gl.domElement;

    const onCanvasClick = () => {
      if (!isLocked.current) {
        canvas.requestPointerLock();
      }
    };

    const onPointerLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      yaw.current -= e.movementX * LOOK_SENSITIVITY;
      pitch.current -= e.movementY * LOOK_SENSITIVITY;
      pitch.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch.current));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.code);
      if (e.code === 'Escape') {
        setWalkthroughMode('none');
        document.exitPointerLock();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code);

    canvas.addEventListener('click', onCanvasClick);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Initial position
    camera.position.set(0, eyeHeight, 2);
    yaw.current = 0;
    pitch.current = 0;

    return () => {
      canvas.removeEventListener('click', onCanvasClick);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      if (document.pointerLockElement === canvas) {
        document.exitPointerLock();
      }
    };
  }, [walkthroughMode, gl.domElement, eyeHeight]);

  useFrame((_, delta) => {
    if (walkthroughMode !== 'manual') return;

    const speed = MOVE_SPEED * delta;
    const qyaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    const qpitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch.current);
    camera.quaternion.copy(qyaw).multiply(qpitch);

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(qyaw);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(qyaw);

    if (keys.current.has('KeyW') || keys.current.has('ArrowUp'))    camera.position.addScaledVector(forward, speed);
    if (keys.current.has('KeyS') || keys.current.has('ArrowDown'))  camera.position.addScaledVector(forward, -speed);
    if (keys.current.has('KeyA') || keys.current.has('ArrowLeft'))  camera.position.addScaledVector(right, -speed);
    if (keys.current.has('KeyD') || keys.current.has('ArrowRight')) camera.position.addScaledVector(right, speed);

    camera.position.y = eyeHeight;

    checkRoom(camera.position);
    setCameraPosition(camera.position.x, camera.position.z);
  });

  return null;
}
