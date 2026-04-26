"use client";

import { useState, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParallax, useStaggeredText, useSlideUp, useFadeIn } from "@/hooks/useScrollAnimation";
import dynamic from "next/dynamic";

const DynamicAirflowCanvas = dynamic(() => import("@/components/3d/DynamicAirflowCanvas"), { ssr: false });

const AERO_MODES = [
    {
        id: "corner",
        label: "Corner Mode",
        tag: "High Downforce",
        color: "#e10600",
        description: "Maximum downforce configuration with elevated wing angles. Generates up to 3.5G of lateral grip through high-speed corners.",
        metrics: [
            { label: "Downforce", value: "95%", bar: 0.95 },
            { label: "Drag", value: "72%", bar: 0.72 },
            { label: "Wing Angle", value: "32°", bar: 0.85 },
        ],
    },
    {
        id: "straight",
        label: "Straight Mode",
        tag: "Low Drag",
        color: "#00e5ff",
        description: "Reduced drag configuration for maximum straight-line speed. Wings flatten to minimize aerodynamic resistance on the main straights.",
        metrics: [
            { label: "Downforce", value: "38%", bar: 0.38 },
            { label: "Drag", value: "22%", bar: 0.22 },
            { label: "Wing Angle", value: "4°", bar: 0.1 },
        ],
    },
];

export default function AerodynamicsSection() {
    const [activeMode, setActiveMode] = useState("corner");
    const mode = AERO_MODES.find((m) => m.id === activeMode)!;

    const bgRef = useParallax<HTMLDivElement>(0.15);
    const headerRef = useStaggeredText<HTMLDivElement>({ yOffset: 20 });
    const contentRef = useSlideUp<HTMLDivElement>({ delay: 0.1 });
    const diagramRef = useFadeIn<HTMLDivElement>({ delay: 0.2 });

    return (
        <section id="aerodynamics" style={{
            position: "relative",
            background: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
            overflow: "hidden",
        }}>
            <div ref={bgRef} className="grid-bg" style={{ position: "absolute", top: "-20%", left: 0, right: 0, bottom: "-20%", opacity: 0.3 }} />

            <div className="container-xl section-padding" style={{ position: "relative", zIndex: 2 }}>
                {/* Header */}
                <div ref={headerRef} style={{ marginBottom: "3rem" }}>
                    <div className="section-label">
                        <span /><span>2026 Active Aero</span>
                    </div>
                    <h2 className="section-title">
                        Aerodynamics
                    </h2>
                    <p className="section-subtitle" style={{ marginTop: "1rem" }}>
                        The 2026 regulations introduce adaptive aerodynamics — wings that dynamically adjust between high-downforce and low-drag configurations.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}
                    className="grid-cols-1 lg:grid-cols-2">

                    {/* Mode selector */}
                    <div ref={contentRef}>
                        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
                            {AERO_MODES.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveMode(m.id)}
                                    style={{
                                        flex: 1,
                                        padding: "0.75rem 1rem",
                                        background: activeMode === m.id ? "var(--color-red-muted)" : "transparent",
                                        border: `1px solid ${activeMode === m.id ? "var(--color-red)" : "var(--color-border)"}`,
                                        color: activeMode === m.id ? "var(--color-red)" : "rgba(240,240,240,0.5)",
                                        fontFamily: "var(--font-display)",
                                        fontSize: "0.6rem",
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        transition: "all 0.3s",
                                    }}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeMode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <span className="hud-tag" style={{ marginBottom: "1rem", display: "inline-block" }}>
                                    {mode.tag}
                                </span>
                                <p style={{
                                    fontFamily: "var(--font-heading)",
                                    fontSize: "0.95rem",
                                    color: "rgba(240,240,240,0.7)",
                                    lineHeight: 1.7,
                                    marginBottom: "2rem",
                                }}>
                                    {mode.description}
                                </p>

                                {/* Metrics */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    {mode.metrics.map((metric) => (
                                        <div key={metric.label}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                                                <span className="hud-label">{metric.label}</span>
                                                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", color: mode.color }}>
                                                    {metric.value}
                                                </span>
                                            </div>
                                            <div style={{ height: "2px", background: "var(--color-border)", borderRadius: "1px", overflow: "hidden" }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${metric.bar * 100}%` }}
                                                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                    style={{ height: "100%", background: mode.color, borderRadius: "1px" }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Visual diagram placeholder */}
                    <div
                        ref={diagramRef}
                        className="card-dark"
                        style={{ padding: "2rem", minHeight: "360px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                    >
                        <div className="hud-label">Aerodynamic Flow Visualization</div>
                        {/* 3D Particle Simulation Canvas */}
                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem 0", position: "relative", minHeight: "250px" }}>
                            <Suspense fallback={
                                <div style={{ color: "rgba(240,240,240,0.5)", fontSize: "0.8rem", fontFamily: "var(--font-heading)" }}>
                                    Initializing Simulation...
                                </div>
                            }>
                                <DynamicAirflowCanvas mode={activeMode as "corner" | "straight"} />
                            </Suspense>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                            <div>
                                <div className="hud-label">Mode</div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: mode.color, letterSpacing: "0.1em" }}>
                                    {mode.label.toUpperCase()}
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div className="hud-label">Regulation</div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "rgba(240,240,240,0.5)", letterSpacing: "0.1em" }}>
                                    FIA 2026
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
