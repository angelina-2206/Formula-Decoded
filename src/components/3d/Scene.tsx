"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { Suspense, useRef } from "react";
import F1CarModel from "./F1CarModel";
import type { ViewMode } from "@/data/carExplorerData";

type SceneProps = {
  viewMode: ViewMode;
  explodeFactor: number;
  selectedIndex: number;
  onSelectComponent: (idx: number) => void;
  orbitRef?: React.RefObject<React.ComponentRef<typeof OrbitControls> | null>;
};

export default function Scene({
  viewMode,
  explodeFactor,
  selectedIndex,
  onSelectComponent,
  orbitRef,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [3.5, 1.5, 3.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      shadows
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#ffffff"
      />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.6}
        color="#ffa0a0"
      />
      <pointLight position={[0, -2, -4]} intensity={0.4} color="#ff1a1a" />
      <pointLight position={[0, -3, 0]} intensity={0.2} color="#ff0000" />

      {/* Environment */}
      <Environment preset="city" background={false} />

      {/* Grid floor */}
      <Grid
        infiniteGrid
        cellSize={0.6}
        cellThickness={0.5}
        cellColor="#1e1e22"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#2a0000"
        fadeDistance={20}
        fadeStrength={2}
        position={[0, -0.8, 0]}
      />

      {/* F1 Car */}
      <Suspense fallback={null}>
        <F1CarModel
          viewMode={viewMode}
          explodeFactor={explodeFactor}
          selectedIndex={selectedIndex}
          onSelectComponent={onSelectComponent}
        />
      </Suspense>

      {/* Controls */}
      <OrbitControls
        ref={orbitRef}
        enablePan={true}
        enableZoom
        enableRotate
        minDistance={1.5}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2 + 0.1}
        autoRotate={selectedIndex < 0}
        autoRotateSpeed={0.5}
        makeDefault
      />
    </Canvas>
  );
}
