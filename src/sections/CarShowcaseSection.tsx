"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CarExplorerLeftPanel from "@/components/car-explorer/CarExplorerLeftPanel";
import CarExplorerSpecCard from "@/components/car-explorer/CarExplorerSpecCard";
import CarExplorerHotkeys from "@/components/car-explorer/CarExplorerHotkeys";
import { type ViewMode, COMPONENTS } from "@/data/carExplorerData";

const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });

export default function CarShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("assembled");
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // ── Mode switching ──
  const handleModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "exploded") {
      setExplodeFactor(0.65);
    } else if (mode === "assembled") {
      setExplodeFactor(0);
      setSelectedIndex(-1);
    } else if (mode === "xray") {
      setExplodeFactor(0.3);
    }
  }, []);

  // ── Deselect ──
  const handleDeselect = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const key = e.key.toLowerCase();

      if (key === "e") {
        // Toggle explode
        if (explodeFactor > 0.5) {
          setExplodeFactor(0);
          setViewMode("assembled");
        } else {
          setExplodeFactor(0.7);
          setViewMode("exploded");
        }
      } else if (key === "r") {
        // Reset camera — we just reset state; OrbitControls handles positioning
        setSelectedIndex(-1);
        setExplodeFactor(0);
        setViewMode("assembled");
      } else if (key === "x") {
        // Toggle X-ray
        if (viewMode === "xray") {
          handleModeChange("assembled");
        } else {
          handleModeChange("xray");
        }
      } else if (key === "escape") {
        handleDeselect();
      } else {
        const num = parseInt(key);
        if (!isNaN(num) && num >= 1 && num <= 7) {
          setSelectedIndex(num - 1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [explodeFactor, viewMode, handleModeChange, handleDeselect]);

  return (
    <section
      id="car"
      ref={sectionRef}
      className="car-explorer"
    >
      <div className="car-explorer-layout">
        {/* Left Panel — Component Selector + Mode Toggle + Explode Slider */}
        <CarExplorerLeftPanel
          viewMode={viewMode}
          explodeFactor={explodeFactor}
          selectedIndex={selectedIndex}
          onModeChange={handleModeChange}
          onExplodeChange={setExplodeFactor}
          onSelectComponent={setSelectedIndex}
        />

        {/* Center — 3D Canvas */}
        <div className="ce-canvas-wrap">
          <Suspense
            fallback={
              <div className="ce-loading">
                <div className="ce-loading-title">
                  CAR <span>EXPLORER</span>
                </div>
                <div className="ce-loading-bar-wrap">
                  <div
                    className="ce-loading-bar"
                    style={{ width: "60%" }}
                  />
                </div>
                <div className="ce-loading-text">
                  LOADING 3D ENGINE
                </div>
              </div>
            }
          >
            <Scene
              viewMode={viewMode}
              explodeFactor={explodeFactor}
              selectedIndex={selectedIndex}
              onSelectComponent={setSelectedIndex}
            />
          </Suspense>

          {/* HUD Overlays */}
          <div className="ce-controls-overlay">
            <div>DRAG · ROTATE</div>
            <div>SCROLL · ZOOM</div>
            <div>RIGHT-DRAG · PAN</div>
            <div>CLICK · INSPECT</div>
          </div>

          <div className="ce-model-badge">
            <div>MODEL</div>
            <div className="ce-model-badge-val">RB19 — 2023 SPEC</div>
          </div>

          <button
            className="ce-reset-btn"
            onClick={() => {
              setSelectedIndex(-1);
              setExplodeFactor(0);
              setViewMode("assembled");
            }}
          >
            RESET VIEW
          </button>

          <CarExplorerHotkeys />
        </div>

        {/* Right Panel — Spec Card */}
        <CarExplorerSpecCard selectedIndex={selectedIndex} />
      </div>
    </section>
  );
}
