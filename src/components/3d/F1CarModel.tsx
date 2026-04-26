"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";

// Preload the model
useGLTF.preload("/models/f1_car_rb19_2023.glb");

type ComponentMap = { [key: string]: { name: string, desc: string } };

// Mapping the raw Object_X names from the GLB to logical F1 components
const MESH_COMPONENT_MAP: ComponentMap = {
    "Object_0": { name: "Front Wing & End Plates", desc: "Generates high downforce to plant the car's nose into corners and outwash air around the tires." },
    "Object_1": { name: "Rear Wing", desc: "Provides rear stability and houses the Drag Reduction System (DRS) for overtaking." },
    "Object_2": { name: "Suspension System", desc: "Push-rod or pull-rod mechanics that control ride height, absorb bumps, and maximize tire contact." },
    "Object_3": { name: "Diffuser & Plank", desc: "Accelerates airflow out from under the car to create immense suction and ground effect downforce." },
    "Object_4": { name: "Engine Intake / Air Box", desc: "Feeds air directly into the internal combustion engine and channels cooling to the power unit." },
    "Object_5": { name: "Sidepods & Barge Boards", desc: "Sculpted bodywork housing radiators for cooling, shaping airflow towards the rear of the car." },
    "Object_6": { name: "Chassis & Cockpit", desc: "The central survival cell and carbon fiber monocoque housing the driver and steering wheel." },
    "Object_7": { name: "Halo", desc: "Titanium crash-protection structure placed above the cockpit to protect the driver's head." },
    "Object_8": { name: "Nose Box", desc: "The front crash structure that mounts the front wing and directs air to the floor." },
    "Object_9": { name: "Exhaust", desc: "Expels hot gases from the engine, tightly packaged to minimize aerodynamic drag at the rear." },
    "Object_10": { name: "Brake Disc & Wheels", desc: "Carbon-ceramic brakes and 18-inch Pirelli tires mounted with wheel covers for aerodynamic efficiency." }
};

export type ComponentInfo = { name: string; desc: string };

type F1CarModelProps = {
    onHoverChange?: (info: ComponentInfo | null) => void;
};

export default function F1CarModel({ onHoverChange }: F1CarModelProps) {
    const groupRef = useRef<THREE.Group>(null);

    // NOTE: Replace '/models/f1_car_rb19_2023.glb' with the actual path to your GLB model in the public folder.
    const { scene } = useGLTF("/models/f1_car_rb19_2023.glb");

    const [hoveredMeshName, setHoveredMeshName] = useState<string | null>(null);

    // Smooth rotation
    useFrame((_state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1;
        }
    });

    const handlePointerOver = (e: any) => {
        e.stopPropagation();

        if (e.object?.isMesh) {
            const mesh = e.object as THREE.Mesh;
            setHoveredMeshName(mesh.name);
            document.body.style.cursor = 'pointer';

            if (onHoverChange) {
                const info = MESH_COMPONENT_MAP[mesh.name] || { name: mesh.name, desc: "F1 Component" };
                onHoverChange(info);
            }
        }
    };

    const handlePointerOut = (e: any) => {
        e.stopPropagation();
        if (e.object?.isMesh) {
            const mesh = e.object as THREE.Mesh;
            if (mesh.name === hoveredMeshName) {
                setHoveredMeshName(null);
                if (onHoverChange) onHoverChange(null);
            }
            document.body.style.cursor = 'auto';
        }
    };

    // Apply material override logic whenever hover state changes
    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;

                // Ensure we store the original material once
                if (!mesh.userData.originalMaterial) {
                    mesh.userData.originalMaterial = mesh.material;
                    // Store a cloned material for modifications so we don't mutate shared materials
                    const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
                    mesh.userData.customMaterial = (mat as THREE.Material).clone();

                    // Make it support opacity adjustments
                    (mesh.userData.customMaterial as THREE.Material).transparent = true;
                }

                const customMat = mesh.userData.customMaterial;

                if (hoveredMeshName === null) {
                    // Reset to default
                    customMat.opacity = 1.0;
                    if ('emissive' in customMat) {
                        customMat.emissive = new THREE.Color("#000000");
                    }
                } else if (mesh.name === hoveredMeshName) {
                    // Glow state active
                    customMat.opacity = 1.0;
                    if ('emissive' in customMat) {
                        customMat.emissive = new THREE.Color("#e10600"); // Red glow
                        customMat.emissiveIntensity = 0.5;
                    }
                } else {
                    // Dim state for other meshes
                    customMat.opacity = 0.3;
                    if ('emissive' in customMat) {
                        customMat.emissive = new THREE.Color("#000000");
                    }
                }

                mesh.material = customMat;
            }
        });
    }, [hoveredMeshName, scene]);

    // Cleanup cursor on unmount
    useEffect(() => {
        return () => {
            document.body.style.cursor = 'auto';
        };
    }, []);

    return (
        <Bounds fit clip observe margin={1.2}>
            <Center>
                <group ref={groupRef}>
                    <primitive
                        object={scene}
                        onPointerOver={handlePointerOver}
                        onPointerOut={handlePointerOut}
                    />
                </group>
            </Center>
        </Bounds>
    );
}
