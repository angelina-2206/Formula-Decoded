"use client";

import { COMPONENTS, type ViewMode } from "@/data/carExplorerData";

type LeftPanelProps = {
  viewMode: ViewMode;
  explodeFactor: number;
  selectedIndex: number;
  onModeChange: (mode: ViewMode) => void;
  onExplodeChange: (val: number) => void;
  onSelectComponent: (idx: number) => void;
};

export default function CarExplorerLeftPanel({
  viewMode,
  explodeFactor,
  selectedIndex,
  onModeChange,
  onExplodeChange,
  onSelectComponent,
}: LeftPanelProps) {
  return (
    <div className="ce-left-panel">
      {/* Header */}
      <div className="ce-panel-header">
        <div className="ce-panel-eyebrow">Interactive 3D</div>
        <div className="ce-panel-title">Car Explorer</div>
        <div className="ce-panel-subtitle">
          Select a component to isolate and inspect. Drag to rotate. Scroll to
          zoom.
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="ce-mode-toggle">
        {(["assembled", "exploded", "xray"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            className={`ce-mode-btn${viewMode === mode ? " active" : ""}`}
            onClick={() => onModeChange(mode)}
          >
            {mode === "xray" ? "X-RAY" : mode.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Component List */}
      <div className="ce-component-list">
        {COMPONENTS.map((comp, i) => (
          <button
            key={comp.id}
            className={`ce-comp-item${selectedIndex === i ? " active" : ""}`}
            onClick={() => onSelectComponent(i)}
          >
            <div className="ce-comp-number">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="ce-comp-info">
              <div className="ce-comp-name">{comp.name}</div>
              <div className="ce-comp-desc">{comp.desc}</div>
              <div className="ce-comp-tag">{comp.tag}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Explode Slider */}
      <div className="ce-explode-control">
        <div className="ce-explode-label">
          EXPLODE FACTOR{" "}
          <span>{Math.round(explodeFactor * 100)}%</span>
        </div>
        <input
          type="range"
          className="ce-explode-slider"
          min="0"
          max="100"
          value={Math.round(explodeFactor * 100)}
          onChange={(e) => onExplodeChange(Number(e.target.value) / 100)}
        />
      </div>
    </div>
  );
}
