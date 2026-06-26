"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

// ── Detailed F1 Car SVG ────────────────────────────────────────
// Realistic side-profile silhouette with halo, bargeboards,
// floor edge, diffuser, rear wing, front wing elements

function F1CarSVG() {
    return (
        <svg
            viewBox="0 0 900 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%" }}
        >
            {/* ── Main Body ── */}
            <path
                d="M140,160 L155,160 L158,145 L165,130 L175,118 L195,108 L220,100 L250,94 L290,88 L340,83 L380,80 L420,78 L470,77 L520,78 L560,80 L590,83 L620,88 L650,92 L680,98 L710,106 L740,115 L760,125 L775,135 L785,145 L790,155 L790,168 L780,168 C778,185 748,185 746,168 L245,168 C243,185 213,185 211,168 L140,168 Z"
                fill="#111111"
                stroke="#222"
                strokeWidth="0.5"
            />

            {/* ── Cockpit / Survival Cell ── */}
            <path
                d="M430,78 L440,60 L460,52 L480,50 L500,52 L520,58 L530,68 L535,78"
                fill="#0a0a0a"
                stroke="#1a1a1a"
                strokeWidth="1"
            />

            {/* ── Halo Device ── */}
            <path
                d="M460,52 L455,38 L480,28 L510,30 L525,40 L520,58"
                fill="none"
                stroke="#333"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M460,52 L455,38 L480,28 L510,30 L525,40 L520,58"
                fill="none"
                stroke="#444"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* ── Sidepod Inlet ── */}
            <path
                d="M380,80 L385,70 L420,65 L420,78"
                fill="#0d0d0d"
                stroke="#1a1a1a"
                strokeWidth="0.5"
            />

            {/* ── Floor Edge / Bargeboard Area ── */}
            <path
                d="M250,145 L300,140 L400,138 L500,137 L600,140 L680,148 L700,155 L700,165 L250,165 Z"
                fill="#080808"
                stroke="#151515"
                strokeWidth="0.5"
            />

            {/* ── Diffuser ── */}
            <path
                d="M140,155 L140,148 L148,135 L155,125 L158,118 L155,155"
                fill="#0a0a0a"
                stroke="#1a1a1a"
                strokeWidth="0.5"
            />
            {/* Diffuser fins */}
            <line x1="142" y1="150" x2="148" y2="130" stroke="#1a1a1a" strokeWidth="1" />
            <line x1="146" y1="150" x2="152" y2="128" stroke="#1a1a1a" strokeWidth="1" />
            <line x1="150" y1="152" x2="155" y2="126" stroke="#1a1a1a" strokeWidth="1" />

            {/* ── Rear Wing - Main Plane ── */}
            <rect x="118" y="68" width="8" height="68" rx="2" fill="#111" stroke="#222" strokeWidth="0.5" />
            {/* DRS flap */}
            <rect x="116" y="60" width="12" height="12" rx="1" fill="#0d0d0d" stroke="#1a1a1a" strokeWidth="0.5" />
            {/* Rear wing endplate */}
            <path
                d="M110,55 L130,55 L132,140 L108,140 Z"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1"
            />
            {/* Rear wing top element */}
            <rect x="108" y="50" width="28" height="8" rx="2" fill="#111" stroke="#e10600" strokeWidth="0.5" />

            {/* ── Front Wing ── */}
            <path
                d="M780,145 L800,140 L830,138 L855,140 L868,148 L870,160 L870,168 L790,168 L790,155"
                fill="#111"
                stroke="#222"
                strokeWidth="0.5"
            />
            {/* Front wing elements */}
            <path d="M810,142 L850,140 L860,145" fill="none" stroke="#e10600" strokeWidth="1.5" />
            <path d="M800,148 L845,144 L860,150" fill="none" stroke="#1a1a1a" strokeWidth="1" />
            <path d="M795,153 L840,149 L858,155" fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
            {/* Front wing endplate */}
            <rect x="862" y="136" width="4" height="34" rx="1" fill="#111" stroke="#e10600" strokeWidth="0.5" />

            {/* ── Nose Cone ── */}
            <path
                d="M785,145 L800,130 L820,125 L835,128 L840,135 L830,138"
                fill="#0d0d0d"
                stroke="#1a1a1a"
                strokeWidth="0.5"
            />

            {/* ── Engine Cover / Shark Fin ── */}
            <path
                d="M340,83 L350,68 L370,58 L400,54 L430,55 L430,78"
                fill="#0c0c0c"
                stroke="#151515"
                strokeWidth="0.5"
            />

            {/* ── Rear Wheels ── */}
            <g>
                <circle cx="228" cy="168" r="28" fill="#0a0a0a" />
                <circle cx="228" cy="168" r="24" fill="#111" stroke="#222" strokeWidth="2" />
                <circle cx="228" cy="168" r="18" fill="#0d0d0d" stroke="#1a1a1a" strokeWidth="1" />
                {/* Tire tread pattern */}
                <g className="tire-rear" style={{ transformOrigin: "228px 168px", animation: "tire-spin 8s linear infinite" }}>
                    {Array.from({ length: 8 }).map((_, i) => {
                        const angle = (i * 45 * Math.PI) / 180;
                        const x1 = 228 + Math.cos(angle) * 18;
                        const y1 = 168 + Math.sin(angle) * 18;
                        const x2 = 228 + Math.cos(angle) * 24;
                        const y2 = 168 + Math.sin(angle) * 24;
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#1a1a1a"
                                strokeWidth="2"
                            />
                        );
                    })}
                </g>
                {/* Wheel nut */}
                <circle cx="228" cy="168" r="5" fill="#1a1a1a" stroke="#e10600" strokeWidth="1" />
            </g>

            {/* ── Front Wheels ── */}
            <g>
                <circle cx="762" cy="168" r="28" fill="#0a0a0a" />
                <circle cx="762" cy="168" r="24" fill="#111" stroke="#222" strokeWidth="2" />
                <circle cx="762" cy="168" r="18" fill="#0d0d0d" stroke="#1a1a1a" strokeWidth="1" />
                {/* Tire tread */}
                <g className="tire-front" style={{ transformOrigin: "762px 168px", animation: "tire-spin 8s linear infinite" }}>
                    {Array.from({ length: 8 }).map((_, i) => {
                        const angle = (i * 45 * Math.PI) / 180;
                        const x1 = 762 + Math.cos(angle) * 18;
                        const y1 = 168 + Math.sin(angle) * 18;
                        const x2 = 762 + Math.cos(angle) * 24;
                        const y2 = 168 + Math.sin(angle) * 24;
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#1a1a1a"
                                strokeWidth="2"
                            />
                        );
                    })}
                </g>
                <circle cx="762" cy="168" r="5" fill="#1a1a1a" stroke="#e10600" strokeWidth="1" />
            </g>

            {/* ── Red Accent Lines ── */}
            {/* Halo highlight */}
            <path
                d="M462,51 L458,38 L480,29"
                fill="none"
                stroke="#e10600"
                strokeWidth="1"
                opacity="0.6"
            />
            {/* Side stripe */}
            <line x1="300" y1="135" x2="650" y2="135" stroke="#e10600" strokeWidth="1" opacity="0.3" />
            {/* Engine cover accent */}
            <line x1="360" y1="65" x2="420" y2="58" stroke="#e10600" strokeWidth="0.8" opacity="0.4" />

            {/* ── Exhaust Heat Shimmer (behind car) ── */}
            <g opacity="0.08" style={{ animation: "heat-shimmer 3s ease-in-out infinite" }}>
                <ellipse cx="100" cy="140" rx="30" ry="20" fill="#ff3300" />
                <ellipse cx="90" cy="135" rx="20" ry="15" fill="#ff6600" />
            </g>

            {/* ── Ground Shadow ── */}
            <ellipse cx="490" cy="200" rx="350" ry="12" fill="rgba(0,0,0,0.4)" />
        </svg>
    );
}

// ── Floating Particles ─────────────────────────────────────────

function FloatingParticles() {
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        bottom: `${Math.random() * 20}%`,
        size: 1 + Math.random() * 2.5,
        duration: 6 + Math.random() * 10,
        delay: Math.random() * 8,
        alt: i % 4 === 0,
    }));

    return (
        <>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className={`hero-particle${p.alt ? " hero-particle--alt" : ""}`}
                    style={{
                        left: p.left,
                        bottom: p.bottom,
                        width: p.size,
                        height: p.size,
                        ["--duration" as string]: `${p.duration}s`,
                        ["--delay" as string]: `${p.delay}s`,
                    }}
                />
            ))}
        </>
    );
}

// ── Hero Section ───────────────────────────────────────────────

const titleVariants = {
    hidden: {
        yPercent: 120,
        opacity: 0,
        rotateX: 35,
        scale: 0.9,
    },
    visible: (i: number) => ({
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 80,
            damping: 18,
            mass: 1,
            delay: i * 0.15 + 0.1,
        },
    }),
};

const taglineVariants = {
    hidden: { opacity: 0, y: 20, letterSpacing: "0.3em" },
    visible: {
        opacity: 1,
        y: 0,
        letterSpacing: "0.1em",
        transition: {
            duration: 1,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        },
    },
};

const carVariants = {
    hidden: { opacity: 0, x: 60, scale: 0.95 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 50,
            damping: 20,
            mass: 1.2,
            delay: 0.3,
        },
    },
};

const scrollVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 0.6,
        transition: { duration: 1, delay: 1.2 },
    },
};

export default function HeroSection({
    introFinished = true,
}: {
    introFinished?: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section
            ref={containerRef}
            id="hero"
            style={{
                position: "relative",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "var(--color-background)",
            }}
        >
            {/* ── Animated Gradient Mesh ── */}
            <div className="hero-gradient-mesh" />

            {/* ── Grid Perspective Floor ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage: `
                        repeating-linear-gradient(90deg, transparent 0, transparent 40px, var(--color-border) 40px, var(--color-border) 41px),
                        repeating-linear-gradient(0deg, transparent 0, transparent 40px, var(--color-border) 40px, var(--color-border) 41px)
                    `,
                    transform: "perspective(1000px) rotateX(60deg) scale(2.5)",
                    transformOrigin: "bottom",
                    pointerEvents: "none",
                }}
            />

            {/* ── Floating Particles ── */}
            <FloatingParticles />

            {/* ── Red Ambient Glow ── */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60vw",
                    height: "40vh",
                    background:
                        "radial-gradient(ellipse, rgba(225,6,0,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* ── Content Container ── */}
            <div
                className="container-xl"
                style={{
                    position: "relative",
                    zIndex: 10,
                    textAlign: "center",
                }}
            >
                {/* ── Title ── */}
                <div
                    style={{
                        overflow: "hidden",
                        paddingBottom: "10px",
                        display: "inline-block",
                        perspective: "1000px",
                    }}
                >
                    <motion.h1
                        custom={0}
                        initial="hidden"
                        animate={introFinished ? "visible" : "hidden"}
                        variants={titleVariants}
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(3rem, 10vw, 8rem)",
                            fontWeight: 900,
                            fontStyle: "italic",
                            lineHeight: 0.9,
                            letterSpacing: "0.02em",
                            textTransform: "uppercase",
                            color: "var(--color-foreground)",
                            margin: 0,
                            paddingRight: "0.05em",
                            transformOrigin: "0% 50% -50px",
                            cursor: "default",
                        }}
                        whileHover={{
                            opacity: 0.6,
                            scale: 1.02,
                            transition: { duration: 0.3 },
                        }}
                    >
                        Formula
                    </motion.h1>
                </div>
                <br />
                <div
                    style={{
                        overflow: "hidden",
                        paddingTop: "5px",
                        display: "inline-block",
                        perspective: "1000px",
                    }}
                >
                    <motion.h1
                        custom={1}
                        initial="hidden"
                        animate={introFinished ? "visible" : "hidden"}
                        variants={titleVariants}
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(3rem, 10vw, 8rem)",
                            fontWeight: 900,
                            fontStyle: "italic",
                            lineHeight: 0.9,
                            letterSpacing: "0.02em",
                            textTransform: "uppercase",
                            color: "transparent",
                            WebkitTextStroke: "2px var(--color-red)",
                            margin: 0,
                            paddingRight: "0.05em",
                            transformOrigin: "0% 50% -50px",
                            cursor: "default",
                        }}
                        whileHover={{
                            opacity: 0.6,
                            scale: 1.02,
                            transition: { duration: 0.3 },
                        }}
                    >
                        Decoded
                    </motion.h1>
                </div>

                {/* ── Tagline ── */}
                <motion.p
                    initial="hidden"
                    animate={introFinished ? "visible" : "hidden"}
                    variants={taglineVariants}
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(1rem, 2vw, 1.5rem)",
                        fontWeight: 300,
                        color: "rgba(240, 240, 240, 0.7)",
                        marginTop: "2rem",
                        textTransform: "uppercase",
                    }}
                >
                    Breaking Down the Technology of Modern Formula One
                </motion.p>
            </div>



            {/* ── Scroll Indicator ── */}
            <motion.div
                initial="hidden"
                animate={introFinished ? "visible" : "hidden"}
                variants={scrollVariants}
                style={{
                    position: "absolute",
                    bottom: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.75rem",
                    cursor: "pointer",
                    zIndex: 20,
                }}
                onClick={() => {
                    const carSection = document.getElementById("car");
                    if (carSection) {
                        carSection.scrollIntoView({ behavior: "smooth" });
                    }
                }}
                whileHover={{ opacity: 1 }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "rgba(240, 240, 240, 0.5)",
                        transition: "color 0.3s",
                    }}
                >
                    Explore
                </span>
                <div
                    style={{
                        height: "40px",
                        width: "1px",
                        background: "rgba(255,255,255,0.1)",
                        position: "relative",
                    }}
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "-1px",
                            width: "3px",
                            height: "15px",
                            background: "var(--color-red)",
                            borderRadius: "2px",
                        }}
                    />
                </div>
            </motion.div>

            {/* ── Bottom Vignette ── */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "30%",
                    background:
                        "linear-gradient(to top, var(--color-background) 0%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex: 3,
                }}
            />
        </section>
    );
}
