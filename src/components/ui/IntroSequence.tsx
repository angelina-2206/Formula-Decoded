"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldPlay, setShouldPlay] = useState<boolean | null>(null);

    useEffect(() => {
        const hasPlayed = sessionStorage.getItem("introPlayed");
        if (hasPlayed) {
            setShouldPlay(false);
            onComplete();
        } else {
            setShouldPlay(true);
            sessionStorage.setItem("introPlayed", "true");
        }
    }, [onComplete]);

    useGSAP(
        () => {
            if (!shouldPlay) return;

            const tl = gsap.timeline({
                onComplete: () => {
                    // Fade out the entire overlay
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.inOut",
                        onComplete: () => {
                            if (containerRef.current) containerRef.current.style.display = "none";
                            onComplete();
                            // Dispatch event for other components to know intro is done
                            window.dispatchEvent(new Event("introComplete"));
                        },
                    });
                },
            });

            // Stage 1: Grid Lights turn on sequentially
            tl.to(".grid-light", {
                backgroundColor: "#FF0033",
                boxShadow: "0 0 20px #FF0033, 0 0 40px #FF0033",
                duration: 0.1,
                stagger: 0.4,
                ease: "none",
            })
                // Pause while all 5 lights are on
                .to({}, { duration: 0.8 })
                // Lights Out
                .to(".grid-light-container", {
                    opacity: 0,
                    duration: 0.1,
                });

            // Stage 2: Car dash & Logo reveal
            tl.addLabel("carDash")
                .fromTo(
                    ".intro-car",
                    { x: "-20vw", opacity: 1 },
                    { x: "120vw", duration: 0.6, ease: "power2.in" },
                    "carDash"
                )
                // Motion blur lines
                .fromTo(
                    ".speed-line",
                    { x: "-100%", opacity: 0 },
                    { x: "100%", opacity: 0.8, duration: 0.4, stagger: 0.05, ease: "power1.inOut" },
                    "carDash+=0.2"
                );

            // Logo Reveal using CSS Clip Path (sliding in from left as car passes)
            tl.fromTo(
                ".logo-word-1",
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power2.out" },
                "carDash+=0.3"
            ).fromTo(
                ".logo-word-2",
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power2.out" },
                "carDash+=0.4"
            ).fromTo(
                ".logo-tagline",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                "carDash+=0.6"
            )
                // Hold logo
                .to({}, { duration: 1.2 });

        },
        { scope: containerRef, dependencies: [shouldPlay] }
    );

    if (shouldPlay === null || !shouldPlay) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999, // Above everything
                background: "#050505",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            {/* Asphalt Texture */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.05,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    pointerEvents: "none",
                }}
            />

            {/* Grid Lights */}
            <div
                className="grid-light-container"
                style={{
                    position: "absolute",
                    top: "15%",
                    display: "flex",
                    gap: "2rem",
                }}
            >
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="grid-light"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#222",
                            border: "4px solid #111",
                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.8)",
                        }}
                    />
                ))}
            </div>

            {/* Logo Container */}
            <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
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
                    <span className="logo-word-1" style={{ color: "#FFF" }}>Formula</span>
                    <span
                        className="logo-word-2"
                        style={{
                            color: "transparent",
                            WebkitTextStroke: "2px #FF0033",
                        }}
                    >
                        Decoded
                    </span>
                </h1>
                <p
                    className="logo-tagline"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.9rem",
                        color: "#888",
                        marginTop: "1.5rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                    }}
                >
                    Breaking Down the Technology of Modern Formula One
                </p>
            </div>

            {/* Rushing Car Silhouette */}
            <div
                className="intro-car"
                style={{
                    position: "absolute",
                    bottom: "35%",
                    left: 0,
                    opacity: 0,
                    zIndex: 5,
                    filter: "drop-shadow(-20px 0px 10px rgba(255,0,51,0.6)) blur(1px)",
                }}
            >
                <svg viewBox="0 0 500 120" fill="#111" width="600px">
                    <path d="M70,80 L90,80 L95,60 L140,55 L180,45 L220,40 L260,35 L300,45 L340,50 L400,60 L450,70 L480,80 L480,95 L450,95 C450,110 420,110 420,95 L140,95 C140,110 110,110 110,95 L70,95 Z" />
                    <circle cx="125" cy="95" r="20" fill="#000" />
                    <circle cx="435" cy="95" r="20" fill="#000" />
                    <rect x="60" y="40" width="10" height="40" fill="#FF0033" />
                    <rect x="40" y="30" width="40" height="10" fill="#FF0033" />
                </svg>
            </div>

            {/* Speed Lines */}
            {[0, 1, 2, 3].map((i) => (
                <div
                    key={`line-${i}`}
                    className="speed-line"
                    style={{
                        position: "absolute",
                        bottom: `${30 + i * 5}%`,
                        left: 0,
                        width: "100%",
                        height: "2px",
                        background: "linear-gradient(90deg, transparent, #FF0033, transparent)",
                        opacity: 0,
                        zIndex: 4,
                    }}
                />
            ))}
        </div>
    );
}
