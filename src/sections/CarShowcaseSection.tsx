"use client";

import { Suspense, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ComponentInfo } from "@/components/3d/F1CarModel";

const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });

export default function CarShowcaseSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [hoveredComponent, setHoveredComponent] = useState<ComponentInfo | null>(null);

    return (
        <section
            id="car"
            ref={sectionRef}
            style={{
                position: "relative",
                minHeight: "100vh",
                background: "var(--color-background)",
                overflow: "hidden",
            }}
        >
            {/* Section bg accent */}
            <div className="carbon-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />

            <div className="container-xl section-padding" style={{ position: "relative", zIndex: 2 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem", marginBottom: "3rem" }}>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="section-label"
                        >
                            <span />
                            <span>Interactive 3D</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="section-title"
                        >
                            Car Explorer
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="section-subtitle"
                        style={{ maxWidth: "360px" }}
                    >
                        Drag to rotate. Scroll to zoom. Click components to explore the engineering of a Formula One car.
                    </motion.p>
                </div>

                {/* 3D Canvas Area */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{
                        position: "relative",
                        height: "60vh",
                        minHeight: "400px",
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                    }}
                >
                    <Suspense
                        fallback={
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                gap: "1rem",
                            }}>
                                <div style={{
                                    width: "40px", height: "40px",
                                    border: "2px solid var(--color-border)",
                                    borderTopColor: "var(--color-red)",
                                    borderRadius: "50%",
                                    animation: "spin-slow 1s linear infinite",
                                }} />
                                <span className="hud-label">Loading 3D Scene</span>
                            </div>
                        }
                    >
                        <Scene onHoverChange={setHoveredComponent} />
                    </Suspense>

                    {/* Component Info Panel Overlay */}
                    <AnimatePresence>
                        {hoveredComponent && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                style={{
                                    position: "absolute",
                                    bottom: "2rem",
                                    right: "2rem",
                                    width: "300px",
                                    padding: "1.5rem",
                                    background: "rgba(10, 10, 10, 0.85)",
                                    backdropFilter: "blur(12px)",
                                    border: "1px solid rgba(225, 6, 0, 0.3)",
                                    borderLeft: "3px solid var(--color-red)",
                                    borderRadius: "var(--radius-md)",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                                    pointerEvents: "none",
                                    zIndex: 10
                                }}
                            >
                                <div className="hud-label" style={{ color: "var(--color-red)", marginBottom: "0.5rem" }}>
                                    Component Inspected
                                </div>
                                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                                    {hoveredComponent.name}
                                </h3>
                                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                                    {hoveredComponent.desc}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* HUD Overlays */}
                    <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                        <span className="hud-tag">Live 3D</span>
                    </div>
                    <div style={{ position: "absolute", top: "1rem", right: "1rem", textAlign: "right" }}>
                        <div className="hud-label">Controls</div>
                        <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.75rem", color: "rgba(240,240,240,0.5)", lineHeight: 1.6 }}>
                            Drag · Rotate<br />
                            Scroll · Zoom<br />
                            Hover · Inspect
                        </div>
                    </div>
                    <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
                        <div className="hud-label" style={{ marginBottom: "0.25rem" }}>Model</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(240,240,240,0.6)" }}>
                            F1 CAR — 2026 SPEC
                        </div>
                    </div>
                </motion.div>

                {/* Component cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "1rem",
                        marginTop: "1.5rem",
                    }}
                >
                    {["Front Wing", "Nose Box", "Suspension", "Sidepods", "Air Box", "Halo", "Cockpit", "Diffuser", "Rear Wing"].map((part) => (
                        <button
                            key={part}
                            className="card-dark"
                            style={{
                                padding: "1rem",
                                cursor: "pointer",
                                textAlign: "left",
                                background: "none",
                                color: "inherit",
                                fontFamily: "inherit",
                            }}
                        >
                            <div className="hud-label" style={{ marginBottom: "0.25rem" }}>Component</div>
                            <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", fontWeight: 500 }}>{part}</div>
                        </button>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
