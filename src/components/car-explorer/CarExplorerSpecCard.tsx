"use client";

import { COMPONENTS, type CarComponent } from "@/data/carExplorerData";

type SpecCardProps = {
  selectedIndex: number;
};

function SpecContent({ comp }: { comp: CarComponent }) {
  const { specs } = comp;

  return (
    <>
      {/* Overview */}
      <div>
        <div className="ce-spec-section-label">OVERVIEW</div>
        <div className="ce-spec-note">{specs.overview}</div>
      </div>

      {/* Technical Specifications */}
      <div>
        <div className="ce-spec-section-label">TECHNICAL SPECIFICATIONS</div>
        {specs.technical.map((row) => (
          <div key={row.k} className="ce-spec-row">
            <div className="ce-spec-key">{row.k}</div>
            <div
              className={`ce-spec-val${row.highlight ? " highlight" : ""}`}
            >
              {row.v}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Bars */}
      {specs.bars && specs.bars.length > 0 && (
        <div>
          <div className="ce-spec-section-label">PERFORMANCE METRICS</div>
          {specs.bars.map((bar) => (
            <div key={bar.label} className="ce-spec-bar-row">
              <div className="ce-spec-bar-label">
                <span>{bar.label}</span>
                <span>{bar.val}%</span>
              </div>
              <div className="ce-spec-bar">
                <div
                  className="ce-spec-bar-fill"
                  style={{ width: `${bar.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {specs.tags && specs.tags.length > 0 && (
        <div>
          <div className="ce-spec-section-label">CLASSIFICATION</div>
          <div className="ce-spec-tag-row">
            {specs.tags.map((tag) => (
              <div
                key={tag}
                className={`ce-spec-tag${tag.startsWith("FIA") ? "" : " red"}`}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2026 Regulation Note */}
      {specs.note && (
        <div>
          <div className="ce-spec-section-label">2026 REGULATION NOTE</div>
          <div className="ce-spec-note">{specs.note}</div>
        </div>
      )}
    </>
  );
}

export default function CarExplorerSpecCard({ selectedIndex }: SpecCardProps) {
  const comp = selectedIndex >= 0 ? COMPONENTS[selectedIndex] : null;

  return (
    <div className="ce-right-panel">
      {/* Spec Header */}
      <div className="ce-spec-header">
        <div className="ce-spec-eyebrow">COMPONENT DATA</div>
        <div className="ce-spec-title">
          {comp ? comp.short : "SELECT PART"}
        </div>
        <div className="ce-spec-subtitle">
          {comp
            ? comp.desc
            : "Click any component on the model or from the list to view engineering specifications."}
        </div>
      </div>

      {/* Spec Body */}
      <div className="ce-spec-body">
        {comp ? (
          <SpecContent comp={comp} />
        ) : (
          <div className="ce-empty-state">
            <div className="ce-empty-icon" />
            <div className="ce-empty-text">
              NO COMPONENT
              <br />
              SELECTED
              <br />
              <br />
              CLICK A PART
              <br />
              TO BEGIN
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
