"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { COMPONENTS, type ViewMode } from "@/data/carExplorerData";

// Preload the GLB
useGLTF.preload("/models/f1_car_rb19_2023.glb");

export type F1CarModelProps = {
  viewMode: ViewMode;
  explodeFactor: number;
  selectedIndex: number;
  onSelectComponent: (idx: number) => void;
};

// ── Procedural Fallback Car ──────────────────────────────────────────────────
// Builds a simplified F1 car from primitive geometries when the GLB fails to load.
function buildProceduralCar(): THREE.Group[] {
  const matBase = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.8, roughness: 0.3 });
  const matRed = new THREE.MeshStandardMaterial({ color: 0xe8001d, metalness: 0.6, roughness: 0.4 });
  const matYellow = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.7, roughness: 0.3 });
  const matCarbon = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.6 });
  const matTyre = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.1, roughness: 0.9 });

  const parts: THREE.Group[] = [];

  // 0: Front wing
  const fwGroup = new THREE.Group();
  fwGroup.name = "FrontWing";
  const mainPlane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.03, 0.28), matRed.clone());
  const el1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 0.18), matBase.clone());
  el1.position.set(0, 0.05, -0.07);
  const el2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.02, 0.14), matBase.clone());
  el2.position.set(0, 0.09, -0.12);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.4, 8), matBase.clone());
  nose.rotation.x = -Math.PI / 2; nose.position.set(0, 0.08, 0.25);
  const ep1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.25), matBase.clone());
  ep1.position.set(-0.68, 0.05, 0);
  const ep2 = ep1.clone(); ep2.position.x = 0.68;
  fwGroup.add(mainPlane, el1, el2, nose, ep1, ep2);
  fwGroup.position.set(0, -0.18, 1.35);
  parts.push(fwGroup);

  // 1: Monocoque / chassis
  const chassis = new THREE.Group();
  chassis.name = "Monocoque";
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.32, 1.8), matBase.clone());
  const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.55), matCarbon.clone());
  cockpit.position.set(0, 0.28, 0.28);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.02, 6, 20, Math.PI), matCarbon.clone());
  halo.rotation.x = Math.PI / 2; halo.position.set(0, 0.42, 0.15);
  const nose2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.18, 0.7, 8), matBase.clone());
  nose2.rotation.x = Math.PI / 2; nose2.position.set(0, -0.02, 1.05);
  chassis.add(body, cockpit, halo, nose2);
  chassis.position.set(0, 0.1, 0);
  parts.push(chassis);

  // 2: Rear wing
  const rwGroup = new THREE.Group();
  rwGroup.name = "RearWing";
  const rMain = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.22), matRed.clone());
  const rFlap = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.02, 0.16), matBase.clone());
  rFlap.position.y = 0.06;
  const rp1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.22), matBase.clone());
  rp1.position.x = -0.4;
  const rp2 = rp1.clone(); rp2.position.x = 0.4;
  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.14), matBase.clone());
  beam.position.y = -0.22;
  rwGroup.add(rMain, rFlap, rp1, rp2, beam);
  rwGroup.position.set(0, 0.45, -1.35);
  parts.push(rwGroup);

  // 3: Sidepods
  const spGroup = new THREE.Group();
  spGroup.name = "Sidepods";
  const bodyL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 1.1), matBase.clone());
  bodyL.position.set(-0.46, 0, 0);
  const inletL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.06), matCarbon.clone());
  inletL.position.set(-0.46, 0.02, 0.54);
  const bodyR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 1.1), matBase.clone());
  bodyR.position.set(0.46, 0, 0);
  const inletR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.06), matCarbon.clone());
  inletR.position.set(0.46, 0.02, 0.54);
  spGroup.add(bodyL, inletL, bodyR, inletR);
  spGroup.position.set(0, 0.06, -0.1);
  parts.push(spGroup);

  // 4: Floor / diffuser
  const floorGrp = new THREE.Group();
  floorGrp.name = "Floor";
  const floorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 2.6), matCarbon.clone());
  const diffL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.5), matBase.clone());
  diffL.position.set(-0.35, 0.06, -1.05); diffL.rotation.x = 0.2;
  const diffR = diffL.clone(); diffR.position.x = 0.35;
  floorGrp.add(floorPanel, diffL, diffR);
  floorGrp.position.set(0, -0.2, 0);
  parts.push(floorGrp);

  // 5: Power unit (engine)
  const puGrp = new THREE.Group();
  puGrp.name = "PowerUnit";
  const block = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.35, 0.7), matCarbon.clone());
  const turbo = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 12), matBase.clone());
  turbo.rotation.z = Math.PI / 2; turbo.position.set(0.24, 0.12, 0.08);
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.35, 8), matBase.clone());
  exhaust.rotation.x = Math.PI / 2; exhaust.position.set(0, 0.14, -0.44);
  puGrp.add(block, turbo, exhaust);
  puGrp.position.set(0, 0.06, -0.38);
  parts.push(puGrp);

  // 6: Suspension + wheels
  const suspGrp = new THREE.Group();
  suspGrp.name = "Suspension";
  const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.22, 20);
  const tyreGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.3, 20);
  const positions: [number, number, number][] = [
    [-0.58, 0, 1.0], [0.58, 0, 1.0], [-0.58, 0, -0.95], [0.58, 0, -0.95],
  ];
  positions.forEach((p) => {
    const tyre = new THREE.Mesh(tyreGeo, matTyre.clone());
    const rim = new THREE.Mesh(wheelGeo, matYellow.clone());
    tyre.rotation.z = Math.PI / 2; rim.rotation.z = Math.PI / 2;
    tyre.position.set(p[0], p[1], p[2]);
    rim.position.set(p[0], p[1], p[2]);
    const armGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.38, 6);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });
    const arm1 = new THREE.Mesh(armGeo, armMat);
    arm1.position.set(p[0] * 0.5, p[1] + 0.05, p[2]);
    arm1.rotation.z = Math.PI / 2;
    suspGrp.add(tyre, rim, arm1);
  });
  suspGrp.position.y = -0.06;
  parts.push(suspGrp);

  return parts;
}

// ── GLB-based Car Model ──────────────────────────────────────────────────────
function GLBCarModel({
  viewMode,
  explodeFactor,
  selectedIndex,
  onSelectComponent,
}: F1CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene: gltfScene } = useGLTF("/models/f1_car_rb19_2023.glb");
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const basePositionsRef = useRef<THREE.Vector3[]>([]);
  const materialsCacheRef = useRef<Map<string, THREE.Material>>(new Map());

  // Collect meshes on mount and assign component indices
  useEffect(() => {
    const allMeshes: THREE.Mesh[] = [];
    gltfScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        allMeshes.push(mesh);
      }
    });

    // Store meshes and their base positions
    meshesRef.current = allMeshes;
    basePositionsRef.current = allMeshes.map((m) => m.position.clone());

    // Assign component indices (map meshes round-robin to 7 components)
    allMeshes.forEach((mesh, i) => {
      mesh.userData.compIdx = i < COMPONENTS.length ? i : -1;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Clone material so we can modify it independently
      if (mesh.material) {
        const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
        const cloned = mat.clone() as THREE.MeshStandardMaterial;
        cloned.transparent = true;
        cloned.metalness = 0.6;
        cloned.roughness = 0.35;
        mesh.material = cloned;
        materialsCacheRef.current.set(mesh.uuid, cloned);
      }
    });
  }, [gltfScene]);

  // Apply view mode and selection effects
  useEffect(() => {
    meshesRef.current.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat) return;
      const compIdx = mesh.userData.compIdx;

      if (viewMode === "xray") {
        if (compIdx === selectedIndex && selectedIndex >= 0) {
          mat.opacity = 1;
          mat.transparent = false;
          mat.emissive = new THREE.Color(0xe8001d);
          mat.emissiveIntensity = 0.25;
        } else {
          mat.opacity = 0.12;
          mat.transparent = true;
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0;
        }
      } else if (selectedIndex >= 0) {
        if (compIdx === selectedIndex) {
          mat.opacity = 1;
          mat.transparent = false;
          mat.emissive = new THREE.Color(0xe8001d);
          mat.emissiveIntensity = 0.25;
        } else {
          mat.opacity = 0.25;
          mat.transparent = true;
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0;
        }
      } else {
        mat.opacity = 1;
        mat.transparent = false;
        mat.emissive = new THREE.Color(0x000000);
        mat.emissiveIntensity = 0;
      }
    });
  }, [viewMode, selectedIndex]);

  // Apply explode positions
  useEffect(() => {
    meshesRef.current.forEach((mesh, i) => {
      const compIdx = mesh.userData.compIdx;
      if (compIdx < 0 || compIdx >= COMPONENTS.length) return;
      const basePos = basePositionsRef.current[i];
      if (!basePos) return;

      const dir = COMPONENTS[compIdx].explodeDir;
      const offset = new THREE.Vector3(dir[0], dir[1], dir[2]).multiplyScalar(explodeFactor * 0.5);
      mesh.position.copy(basePos.clone().add(offset));
    });
  }, [explodeFactor]);

  // Auto-rotate when nothing selected
  useFrame((_state, delta) => {
    if (groupRef.current && selectedIndex < 0) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Raycast click handler
  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      let obj: THREE.Object3D | null = e.object;
      while (obj && obj.userData.compIdx === undefined) {
        obj = obj.parent;
      }
      if (obj && obj.userData.compIdx >= 0 && obj.userData.compIdx < COMPONENTS.length) {
        onSelectComponent(obj.userData.compIdx);
      }
    },
    [onSelectComponent]
  );

  return (
    <Bounds fit clip observe margin={1.2}>
      <Center>
        <group ref={groupRef}>
          <primitive
            object={gltfScene}
            onClick={handleClick}
          />
        </group>
      </Center>
    </Bounds>
  );
}

// ── Procedural Fallback Model ────────────────────────────────────────────────
function ProceduralCarModel({
  viewMode,
  explodeFactor,
  selectedIndex,
  onSelectComponent,
}: F1CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const partsRef = useRef<THREE.Group[]>([]);
  const basePositionsRef = useRef<THREE.Vector3[]>([]);

  const parts = useMemo(() => buildProceduralCar(), []);

  useEffect(() => {
    partsRef.current = parts;
    basePositionsRef.current = parts.map((p) => p.position.clone());

    // Tag every mesh within each part group
    parts.forEach((part, i) => {
      part.userData.compIdx = i;
      part.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          obj.userData.compIdx = i;
          const mesh = obj as THREE.Mesh;
          const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
          if (mat) {
            mat.transparent = true;
          }
        }
      });
    });
  }, [parts]);

  // Apply view mode and selection
  useEffect(() => {
    partsRef.current.forEach((part, i) => {
      part.traverse((obj) => {
        if (!(obj as THREE.Mesh).isMesh) return;
        const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (!mat) return;

        if (viewMode === "xray") {
          if (i === selectedIndex && selectedIndex >= 0) {
            mat.opacity = 1;
            mat.transparent = false;
            mat.emissive = new THREE.Color(0xe8001d);
            mat.emissiveIntensity = 0.25;
          } else {
            mat.opacity = 0.12;
            mat.transparent = true;
            mat.emissive = new THREE.Color(0x000000);
            mat.emissiveIntensity = 0;
          }
        } else if (selectedIndex >= 0) {
          if (i === selectedIndex) {
            mat.opacity = 1;
            mat.transparent = false;
            mat.emissive = new THREE.Color(0xe8001d);
            mat.emissiveIntensity = 0.25;
          } else {
            mat.opacity = 0.25;
            mat.transparent = true;
            mat.emissive = new THREE.Color(0x000000);
            mat.emissiveIntensity = 0;
          }
        } else {
          mat.opacity = 1;
          mat.transparent = false;
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0;
        }
      });
    });
  }, [viewMode, selectedIndex]);

  // Apply explode positions
  useEffect(() => {
    partsRef.current.forEach((part, i) => {
      if (i >= COMPONENTS.length) return;
      const basePos = basePositionsRef.current[i];
      if (!basePos) return;
      const dir = COMPONENTS[i].explodeDir;
      const offset = new THREE.Vector3(dir[0], dir[1], dir[2]).multiplyScalar(explodeFactor * 1.2);
      part.position.copy(basePos.clone().add(offset));
    });
  }, [explodeFactor]);

  // Auto-rotate
  useFrame((_state, delta) => {
    if (groupRef.current && selectedIndex < 0) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      let obj: THREE.Object3D | null = e.object;
      while (obj && obj.userData.compIdx === undefined) {
        obj = obj.parent;
      }
      if (obj && obj.userData.compIdx >= 0 && obj.userData.compIdx < COMPONENTS.length) {
        onSelectComponent(obj.userData.compIdx);
      }
    },
    [onSelectComponent]
  );

  return (
    <group ref={groupRef} onClick={handleClick}>
      {parts.map((part, i) => (
        <primitive key={i} object={part} />
      ))}
    </group>
  );
}

// ── Main Exported Component ──────────────────────────────────────────────────
// Tries GLB first, falls back to procedural if load fails.
export default function F1CarModel(props: F1CarModelProps) {
  const [useGlb, setUseGlb] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Test if GLB is accessible
    fetch("/models/f1_car_rb19_2023.glb", { method: "HEAD" })
      .then((res) => {
        if (!res.ok) throw new Error("GLB not found");
        setUseGlb(true);
        setReady(true);
      })
      .catch(() => {
        console.warn("GLB model unavailable, using procedural fallback");
        setUseGlb(false);
        setReady(true);
      });
  }, []);

  if (!ready) return null;

  return useGlb ? (
    <GLBCarModel {...props} />
  ) : (
    <ProceduralCarModel {...props} />
  );
}
