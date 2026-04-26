"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStaggeredText, useSlideUp, useFadeIn } from "@/hooks/useScrollAnimation";
import EnergyFlowDiagram from "@/components/ui/EnergyFlowDiagram";

const POWER_MODES = [
    {
        id: "overtake",
        label: "Overtake",
        color: "#e10600",
        mgu: 100,
        ice: 60,
        description: "Full electric deployment alongside combustion for a 350kW burst of hybrid power — the weapon for overtaking.",
    },
    {
        id: "boost",
        label: "Boost",
        color: "#ffd700",
        mgu: 75,
        ice: 100,
        description: "Maximum combined output mode, balancing ICE at peak with sustained electric support for maximum lap performance.",
    },
    {
        id: "recharge",
        label: "Recharge",
        color: "#00e5ff",
        mgu: -60,
        ice: 80,
        description: "MGU-K operates in regeneration mode under braking, harvesting kinetic energy to replenish the battery store.",
    },
];

export default function PowerUnitSection() {
    const [activeMode, setActiveMode] = useState("overtake");
    const mode = POWER_MODES.find((m) => m.id === activeMode)!;

    const headerRef = useStaggeredText<HTMLDivElement>({ yOffset: 20 });
    const contentRef = useSlideUp<HTMLDivElement>({ delay: 0.1 });
    const diagramRef = useFadeIn<HTMLDivElement>({ delay: 0.2 });

    return (
        <section id="power-unit" style={{
            position: "relative",
            background: "var(--color-background)",
            borderTop: "1px solid var(--color-border)",
            overflow: "hidden",
        }}>
            <div className="container-xl section-padding" style={{ position: "relative", zIndex: 2 }}>
                {/* Header */}
                <div ref={headerRef} style={{ marginBottom: "3rem" }}>
                    <div className="section-label">
                        <span /><span>Hybrid Energy System</span>
                    </div>
                    <h2 className="section-title">
                        Power Unit
                    </h2>
                    <p className="section-subtitle" style={{ marginTop: "1rem" }}>
                        The 2026 power unit achieves a 50/50 split between internal combustion and electric energy. Explore each deployment mode below.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
                    {/* Mode selector */}
                    <div ref={contentRef}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                            {POWER_MODES.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveMode(m.id)}
                                    style={{
                                        padding: "1rem 1.25rem",
                                        background: activeMode === m.id ? `rgba(${m.color === "#e10600" ? "225,6,0" : m.color === "#ffd700" ? "255,215,0" : "0,229,255"}, 0.12)` : "transparent",
                                        border: `1px solid ${activeMode === m.id ? m.color : "var(--color-border)"}`,
                                        borderLeftWidth: activeMode === m.id ? "3px" : "1px",
                                        color: activeMode === m.id ? m.color : "rgba(240,240,240,0.5)",
                                        fontFamily: "var(--font-display)",
                                        fontSize: "0.65rem",
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        transition: "all 0.3s",
                                        textAlign: "left",
                                    }}
                                >
                                    {m.label} Mode
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.p
                                key={activeMode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "rgba(240,240,240,0.65)", lineHeight: 1.7 }}
                            >
                                {mode.description}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Power flow visualization */}
                    <div
                        ref={diagramRef}
                        className="card-dark"
                        style={{ padding: "2rem" }}
                    >
                        <div className="hud-label" style={{ marginBottom: "1rem" }}>Energy Flow System</div>
                        <EnergyFlowDiagram activeMode={activeMode} modeColor={mode.color} />
                    </div>
                </div>
            </div>
        </section>
    );
}
