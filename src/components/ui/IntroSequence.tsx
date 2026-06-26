"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

// ── F1 Light Gantry ────────────────────────────────────────────
// 5 columns × 4 bulbs each — matches the real FIA starting gantry

const COLUMNS = 5;
const BULBS_PER_COLUMN = 4;
const LIGHT_INTERVAL = 1.0; // seconds between each column lighting up
const MIN_HOLD = 1.2; // minimum seconds all lights stay on before blackout
const MAX_HOLD = 2.8; // maximum — randomized for tension

function LightGantry({ litColumns }: { litColumns: number }) {
    return (
        <div className="f1-gantry">
            {Array.from({ length: COLUMNS }).map((_, colIdx) => (
                <div key={colIdx} className="f1-light-column">
                    {Array.from({ length: BULBS_PER_COLUMN }).map((_, bulbIdx) => (
                        <div
                            key={bulbIdx}
                            className={`f1-light-bulb${colIdx < litColumns ? " f1-light-bulb--on" : ""}`}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

// ── Spark Particles ────────────────────────────────────────────

function SparkBurst({ active }: { active: boolean }) {
    if (!active) return null;

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 30,
            }}
        >
            {Array.from({ length: 30 }).map((_, i) => {
                const angle = Math.random() * 360;
                const distance = 100 + Math.random() * 300;
                const size = 1 + Math.random() * 3;
                const duration = 0.4 + Math.random() * 0.8;
                const x = Math.cos((angle * Math.PI) / 180) * distance;
                const y = Math.sin((angle * Math.PI) / 180) * distance;

                return (
                    <motion.div
                        key={i}
                        initial={{
                            x: "50vw",
                            y: "35%",
                            opacity: 1,
                            scale: 1,
                        }}
                        animate={{
                            x: `calc(50vw + ${x}px)`,
                            y: `calc(35% + ${y}px)`,
                            opacity: 0,
                            scale: 0,
                        }}
                        transition={{
                            duration,
                            ease: "easeOut",
                            delay: Math.random() * 0.15,
                        }}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            background:
                                i % 3 === 0
                                    ? "#FF6622"
                                    : i % 3 === 1
                                      ? "#FF3333"
                                      : "#FFAA44",
                            boxShadow: `0 0 ${size * 3}px ${i % 3 === 0 ? "#FF6622" : "#FF3333"}`,
                        }}
                    />
                );
            })}
        </div>
    );
}

// ── Typewriter Text ────────────────────────────────────────────

function TypewriterTagline({
    text,
    show,
    onComplete,
}: {
    text: string;
    show: boolean;
    onComplete?: () => void;
}) {
    const [displayed, setDisplayed] = useState("");
    const [cursorVisible, setCursorVisible] = useState(true);

    useEffect(() => {
        if (!show) {
            setDisplayed("");
            return;
        }

        let idx = 0;
        const interval = setInterval(() => {
            idx++;
            setDisplayed(text.slice(0, idx));
            if (idx >= text.length) {
                clearInterval(interval);
                // Hide cursor after typing completes
                setTimeout(() => {
                    setCursorVisible(false);
                    onComplete?.();
                }, 800);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [show, text, onComplete]);

    if (!show) return null;

    return (
        <span>
            {displayed}
            {cursorVisible && <span className="typewriter-cursor" />}
        </span>
    );
}

// ── Main IntroSequence Component ───────────────────────────────

export default function IntroSequence({
    onComplete,
}: {
    onComplete: () => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldPlay, setShouldPlay] = useState<boolean | null>(null);
    const [litColumns, setLitColumns] = useState(0);
    const [lightsOut, setLightsOut] = useState(false);
    const [showSparks, setShowSparks] = useState(false);
    const [showLogo, setShowLogo] = useState(false);
    const [showTagline, setShowTagline] = useState(false);
    const [phase, setPhase] = useState<"lights" | "blackout" | "logo" | "done">("lights");
    const [shaking, setShaking] = useState(false);

    const stableOnComplete = useCallback(() => {
        onComplete();
    }, [onComplete]);

    useEffect(() => {
        const hasPlayed = sessionStorage.getItem("introPlayed");
        if (hasPlayed) {
            setShouldPlay(false);
            stableOnComplete();
        } else {
            setShouldPlay(true);
            sessionStorage.setItem("introPlayed", "true");
        }
    }, [stableOnComplete]);

    // ── Lights Sequence ──
    useEffect(() => {
        if (!shouldPlay) return;

        // Sequentially light up each column
        const timeouts: NodeJS.Timeout[] = [];

        for (let col = 1; col <= COLUMNS; col++) {
            timeouts.push(
                setTimeout(() => {
                    setLitColumns(col);
                }, col * LIGHT_INTERVAL * 1000)
            );
        }

        // All 5 lit — hold for random duration, then lights out
        const holdDuration =
            MIN_HOLD + Math.random() * (MAX_HOLD - MIN_HOLD);
        const lightsOutTime =
            COLUMNS * LIGHT_INTERVAL * 1000 + holdDuration * 1000;

        timeouts.push(
            setTimeout(() => {
                // LIGHTS OUT!
                setLitColumns(0);
                setLightsOut(true);
                setShaking(true);
                setShowSparks(true);

                // Stop shake after 300ms
                setTimeout(() => setShaking(false), 300);
                // Stop sparks after 1s
                setTimeout(() => setShowSparks(false), 1000);

                // Brief blackout, then show logo
                setTimeout(() => {
                    setPhase("logo");
                    setShowLogo(true);
                }, 500);

                // Start tagline after logo appears
                setTimeout(() => {
                    setShowTagline(true);
                }, 1200);

                // Transition out
                setTimeout(() => {
                    setPhase("done");
                }, 3500);
            }, lightsOutTime)
        );

        return () => timeouts.forEach(clearTimeout);
    }, [shouldPlay]);

    // ── Fade out and complete ──
    useGSAP(
        () => {
            if (phase !== "done") return;

            gsap.to(containerRef.current, {
                opacity: 0,
                duration: 1.0,
                ease: "power2.inOut",
                onComplete: () => {
                    if (containerRef.current)
                        containerRef.current.style.display = "none";
                    stableOnComplete();
                    window.dispatchEvent(new Event("introComplete"));
                },
            });
        },
        { scope: containerRef, dependencies: [phase] }
    );

    if (shouldPlay === null || !shouldPlay) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "#030304",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                animation: shaking ? "screen-shake 0.3s ease-in-out" : "none",
            }}
        >
            {/* ── Asphalt Noise Texture ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.04,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    pointerEvents: "none",
                }}
            />

            {/* ── Grid Slot Markings (perspective floor) ── */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background: `
                        repeating-linear-gradient(
                            90deg,
                            transparent 0,
                            transparent 80px,
                            rgba(255,255,255,0.03) 80px,
                            rgba(255,255,255,0.03) 82px
                        )
                    `,
                    transform: "perspective(600px) rotateX(55deg)",
                    transformOrigin: "bottom center",
                    pointerEvents: "none",
                    opacity: 0.5,
                }}
            />

            {/* ── Ambient Red Ground Glow (when lights are on) ── */}
            <AnimatePresence>
                {litColumns > 0 && !lightsOut && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        style={{
                            position: "absolute",
                            top: "30%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: `${30 + litColumns * 8}%`,
                            height: "60%",
                            background:
                                "radial-gradient(ellipse at 50% 30%, rgba(255,0,0,0.12) 0%, rgba(180,0,0,0.06) 40%, transparent 70%)",
                            pointerEvents: "none",
                            animation: "ground-glow 2s ease-in-out infinite",
                        }}
                    />
                )}
            </AnimatePresence>

            {/* ── Heat Shimmer Overlay ── */}
            {litColumns > 2 && !lightsOut && (
                <div
                    style={{
                        position: "absolute",
                        top: "25%",
                        left: "30%",
                        right: "30%",
                        height: "30%",
                        animation: "heat-shimmer 3s ease-in-out infinite",
                        background: "transparent",
                        pointerEvents: "none",
                        zIndex: 5,
                        backdropFilter: "blur(0.3px)",
                    }}
                />
            )}

            {/* ── Lights Out Flash ── */}
            <AnimatePresence>
                {lightsOut && phase === "lights" && (
                    <motion.div
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.15) 0%, transparent 60%)",
                            pointerEvents: "none",
                            zIndex: 20,
                        }}
                    />
                )}
            </AnimatePresence>

            {/* ── Spark Particles on Lights Out ── */}
            <SparkBurst active={showSparks} />

            {/* ── F1 Light Gantry ── */}
            <AnimatePresence>
                {phase === "lights" && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.4 } }}
                        style={{
                            position: "absolute",
                            top: "22%",
                            zIndex: 10,
                        }}
                    >
                        <LightGantry litColumns={litColumns} />

                        {/* Gantry support poles (visual detail) */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "0 2rem",
                            }}
                        >
                            {[0, 1].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: "3px",
                                        height: "60px",
                                        background:
                                            "linear-gradient(180deg, #1a1a1e, #0a0a0a)",
                                        boxShadow:
                                            "1px 0 0 rgba(255,255,255,0.03)",
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Logo Reveal (post-lights-out) ── */}
            <AnimatePresence>
                {showLogo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{
                            position: "relative",
                            zIndex: 40,
                            textAlign: "center",
                        }}
                    >
                        <h1
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(3rem, 10vw, 8rem)",
                                fontWeight: 900,
                                fontStyle: "italic",
                                lineHeight: 0.9,
                                letterSpacing: "0.02em",
                                textTransform: "uppercase",
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <motion.span
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                    filter: "blur(8px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                }}
                                transition={{
                                    duration: 0.7,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                                style={{ color: "#FFF" }}
                            >
                                Formula
                            </motion.span>
                            <motion.span
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                    filter: "blur(8px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                }}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.15,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                                style={{
                                    color: "transparent",
                                    WebkitTextStroke: "2px #FF0033",
                                }}
                            >
                                Decoded
                            </motion.span>
                        </h1>

                        {/* Typewriter tagline */}
                        <p
                            style={{
                                fontFamily: "var(--font-mono, var(--font-display))",
                                fontSize: "clamp(0.65rem, 1.2vw, 0.9rem)",
                                color: "#666",
                                marginTop: "1.5rem",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                minHeight: "1.4em",
                            }}
                        >
                            <TypewriterTagline
                                text="The Technology Behind Formula One"
                                show={showTagline}
                            />
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Subtle vignette ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />
        </div>
    );
}
