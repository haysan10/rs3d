// src/components/3d/DebugHelpers.tsx
import { useCallback } from 'react';
import { Grid } from '@react-three/drei';
import { useAppStore } from '../../store/useAppStore';

export function DebugHelpers() {
  const { debugMode } = useAppStore();

  if (!debugMode) return null;

  return (
    <>
      <Grid
        args={[50, 50]}
        position={[0, 0, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#888"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#1A6FB4"
        infiniteGrid
        fadeDistance={50}
        fadeStrength={1}
      />
      <axesHelper args={[5]} />
    </>
  );
}

export function useDebugClick() {
  const { debugMode } = useAppStore();

  const handleClick = useCallback(
    (event: any) => {
      if (!debugMode) return;
      const point = event.point;
      if (point) {
        console.log(
          `[DEBUG CLICK] position: [${point.x.toFixed(3)}, ${point.y.toFixed(3)}, ${point.z.toFixed(3)}]`
        );
        console.log(`[DEBUG CLICK] Rounded: [${Math.round(point.x)}, ${Math.round(point.y)}, ${Math.round(point.z)}]`);
      }
    },
    [debugMode]
  );

  return handleClick;
}
