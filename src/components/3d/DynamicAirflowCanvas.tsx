"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AirflowSimulation from "./AirflowSimulation";

type DynamicAirflowCanvasProps = {
    mode: "corner" | "straight";
};

export default function DynamicAirflowCanvas({ mode }: DynamicAirflowCanvasProps) {
    return (
        <Canvas
            camera={{ position: [5, 2, 5], fov: 45 }}
            style={{ width: "100%", height: "300px", background: "transparent" }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <AirflowSimulation mode={mode} />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </Canvas>
    );
}
