"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid, Float } from "@react-three/drei";
import { Suspense } from "react";
import F1CarModel, { ComponentInfo } from "./F1CarModel";

type SceneProps = {
    onHoverChange?: (info: ComponentInfo | null) => void;
};

export default function Scene({ onHoverChange }: SceneProps) {
    return (
        <Canvas
            camera={{ position: [0, 1.5, 6], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
            shadows
        >
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight
                position={[5, 8, 5]}
                intensity={1.5}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                color="#ffffff"
            />
            <pointLight position={[-4, 3, -4]} intensity={0.8} color="#e10600" />
            <pointLight position={[4, 1, 4]} intensity={0.4} color="#00e5ff" />

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
                sectionColor="#e10600"
                fadeDistance={20}
                fadeStrength={2}
                position={[0, -0.8, 0]}
            />

            {/* F1 Car */}
            <Suspense fallback={null}>
                <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.15}>
                    <F1CarModel onHoverChange={onHoverChange} />
                </Float>
            </Suspense>

            {/* Controls */}
            <OrbitControls
                enablePan={false}
                enableZoom
                enableRotate
                minDistance={3}
                maxDistance={12}
                maxPolarAngle={Math.PI / 2 + 0.1}
                autoRotate
                autoRotateSpeed={0.5}
                makeDefault
            />
        </Canvas>
    );
}
