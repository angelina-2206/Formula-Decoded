"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type AirflowSimulationProps = {
    mode: "corner" | "straight";
};

export default function AirflowSimulation({ mode }: AirflowSimulationProps) {
    const pointsRef = useRef<THREE.Points>(null);

    // Load the car model to display as a context wireframe/shadow
    const { scene } = useGLTF("/models/f1_car_rb19_2023.glb");

    // Create a faded wireframe representation of the car
    const carWireframe = useMemo(() => {
        const clonedScene = scene.clone();
        clonedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = new THREE.MeshBasicMaterial({
                    color: "#444444",
                    wireframe: true,
                    transparent: true,
                    opacity: 0.15,
                });
            }
        });
        return clonedScene;
    }, [scene]);

    // Particle System Configuration
    const particleCount = 2000;

    const [positions, initialPositions, velocities] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const initialPos = new Float32Array(particleCount * 3);
        const vel = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Start particles ahead of the car (-Z is forward in this model's space, but let's assume standard space where we flow along Z)
            // Adjust coordinates based on model orientation. Let's assume airflow goes from +Z to -Z along the car's length.
            const x = (Math.random() - 0.5) * 3; // Spread across car width
            const y = Math.random() * 1.5 + 0.1; // Height from ground to above car
            const z = Math.random() * 5 + 3;     // Start ahead of car (+Z)

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            initialPos[i * 3] = x;
            initialPos[i * 3 + 1] = y;
            initialPos[i * 3 + 2] = 3 + Math.random() * 2; // Original start depth

            // Varying speeds
            vel[i] = 0.1 + Math.random() * 0.15;
        }

        return [pos, initialPos, vel];
    }, []);

    useFrame(() => {
        if (!pointsRef.current) return;
        const geometry = pointsRef.current.geometry;
        const positionsAttr = geometry.attributes.position;

        for (let i = 0; i < particleCount; i++) {
            let x = positionsAttr.getX(i);
            let y = positionsAttr.getY(i);
            let z = positionsAttr.getZ(i);

            // Move particle backwards (flowing over car)
            z -= velocities[i];

            // Aerodynamic deflection logic
            if (z < 2 && z > -2) {
                // Particle is over the main body of the car

                // Front wing deflection (approx z = 1.6)
                if (z < 1.8 && z > 1.2 && y < 0.5) {
                    y += 0.01;
                }

                // Halo / Cockpit deflection (approx z = 0)
                if (z < 0.5 && z > -0.5 && Math.abs(x) < 0.5 && y < 1.0) {
                    y += 0.015;
                    x += (x > 0 ? 0.01 : -0.01);
                }

                // Rear wing deflection (approx z = -1.6)
                if (z < -1.2 && z > -1.8) {
                    if (mode === "corner") {
                        // High downforce: aggressive upwash
                        y += 0.04;
                    } else {
                        // Low drag: slight upwash
                        y += 0.01;
                    }
                }

                // Sucking effect of Diffuser (under car)
                if (z < 0 && z > -1.5 && Math.abs(x) < 0.8 && y < 0.3) {
                    y -= 0.01;
                    // Diffuser expansion
                    if (z < -1.0) {
                        y += 0.02; // Upwash as it exits
                        x += (x > 0 ? 0.01 : -0.01);
                    }
                }
            }

            // Reset particle if it goes too far behind
            if (z < -4) {
                x = initialPositions[i * 3];
                y = initialPositions[i * 3 + 1];
                z = initialPositions[i * 3 + 2];
            }

            positionsAttr.setXYZ(i, x, y, z);
        }

        positionsAttr.needsUpdate = true;
    });

    return (
        <group scale={1.8}>
            {/* Contextual Car */}
            <primitive object={carWireframe} />

            {/* Airflow Particles */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.03}
                    color={mode === "corner" ? "#e10600" : "#00e5ff"}
                    transparent
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
}
