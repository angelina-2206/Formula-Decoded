# Formula Decoded: Project Build Todo List

This todo list is synthesized from the [PRD.txt](file:///e:/Projects/Formula%20Decoded/PRD.txt), [Design doc.txt](file:///e:/Projects/Formula%20Decoded/Design%20doc.txt), and [Tech doc.txt](file:///e:/Projects/Formula%20Decoded/Tech%20doc.txt) to guide the development of the Formula Decoded platform.

## 🏗️ Phase 1: PRD - Feature Definition & Content Strategy
Focus on the core pillars of the project: Engineering Education, 3D Interaction, and F1 Data.

### 📝 Core Features & Content Implementation
- [ ] **Interactive 3D F1 Car (Centerpiece)**
    - [ ] Implement Rotate, Zoom, and Pan controls.
    - [ ] Map Hotspots for key car components.
    - [ ] Build Component-specific info panels (Technical Data).
- [ ] **2026 Active Aerodynamics Simulation**
    - [ ] Toggle logic between "Corner Mode" (High Downforce) and "Straight Mode" (Low Drag).
    - [ ] Create Particle animation system for airflow over surfaces.
- [ ] **Hybrid Energy Flow Visualization**
    - [ ] 50-50 Power Balance Simulation using 2026 Regulations data.
    - [ ] Implement Overtake (electric boost) vs. Recharge (energy harvesting) animations.
- [ ] **Exploded View / Engineering Breakdown**
    - [ ] Model separation: Front Wing, Halo, Sidepods, PU, Gearbox, Rear Wing, Diffuser.
- [ ] **F1 Ecosystem Content**
    - [ ] **Current Driver Grid**: 20 animated cards with statistics and team colors.
    - [ ] **Race Calendar**: Interactive global map with GP locations and track details.
    - [ ] **History Timeline**: Scroll-driven eras (V10, Hybrid, 2026 Future) with morphing cars.

## 🎨 Phase 2: Design - Cinematic UX & Visual Identity
Focus on the "Apple-style" product launch aesthetic and immersive storytelling.

### ✨ Visual Design & Asset Preparation
- [ ] **Establish Design Language**
    - [ ] Color Palette: Carbon Black (#0A0A0A), Race Red (#E10600), Electric Blue (#00E5FF).
    - [ ] Typography: `Orbitron` / `Exo 2` for headers; `Inter` for technical text.
- [ ] **3D Asset Pipeline**
    - [ ] Optimize GLB models (Target Size: <5MB).
    - [ ] Prepare compressed WebP textures and Environment Maps for realistic carbon fiber.
- [ ] **Cinematic Intro Sequence**
    - [ ] Sequential "Black Screen" to "Engine Ignition" landing.
    - [ ] Doppler fly-by animation with motion blur and tire smoke particles.
    - [ ] Sliding mask title reveal for "Formula Decoded".
- [ ] **Interactive Mechanics Design**
    - [ ] Design Technical Blueprint style UI overlays for engineering sections.
    - [ ] Source/Generate Sound FX: Engine ignition, gear shifts, and energy recharge telemetry.

## 💻 Phase 3: Tech Stack - Architecture & Implementation
Focus on the technical foundation and performance optimization.

### 🛠️ Development & Infrastructure
- [ ] **Project Framework Initialization**
    - [ ] Set up **Next.js** (App Router) with **Tailwind CSS**.
    - [ ] Configure standard folder structure (Components, Assets, Animations, Pages, Styles).
- [ ] **Animation Engine (GSAP & ScrollTrigger)**
    - [ ] Implement Cinematic Scroll camera paths.
    - [ ] Coordinate 3D model transforms (rotation, exploded view) with scroll progress.
- [ ] **3D Layer (React Three Fiber / Three.js)**
    - [ ] Set up optimized Three.js Canvas with Realistic lighting.
    - [ ] Implement `GLTFLoader` with `<Suspense />` / `Html` loaders.
    - [ ] Build dynamic airflow shaders for the aerodynamics section.
- [ ] **Data Visualization Layer**
    - [ ] Integrate **Chart.js** or **D3.js** for Telemetry (Speed, Battery, Tire Wear).
- [ ] **Optimization & Accessibility**
    - [ ] Progressive asset loading (Lazy loading, Lottie optimizations).
    - [ ] Full Keyboard navigation support and ARIA labels for technical data.
- [ ] **Deployment & Analytics**
    - [ ] Connect to **Vercel** for hosting.
    - [ ] Implement basic interaction telemetry to measure user engagement.
