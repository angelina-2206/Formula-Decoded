"use client";

const LINKS = [
    { label: "Car Explorer", href: "#car" },
    { label: "Aerodynamics", href: "#aerodynamics" },
    { label: "Power Unit", href: "#power-unit" },
    { label: "Drivers", href: "#drivers" },
    { label: "2026 Regs", href: "#regulations" },
];

const SOCIALS = [
    { label: "GitHub", href: "#" },
    { label: "Twitter / X", href: "#" },
    { label: "LinkedIn", href: "#" },
];

export default function Footer() {
    return (
        <footer style={{
            background: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
            marginTop: "4rem",
        }}>
            {/* Ticker */}
            <div style={{
                background: "var(--color-red)",
                overflow: "hidden",
                height: "32px",
                display: "flex",
                alignItems: "center",
            }}>
                <div className="animate-marquee" style={{ display: "flex", gap: "3rem", whiteSpace: "nowrap" }}>
                    {Array(6).fill(null).map((_, i) => (
                        <span key={i} style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "0.6rem",
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.9)",
                        }}>
                            Formula Decoded &nbsp;·&nbsp; 2026 Regulations &nbsp;·&nbsp; Active Aerodynamics &nbsp;·&nbsp; Hybrid Power Unit &nbsp;·&nbsp; 50/50 Power Split
                        </span>
                    ))}
                </div>
            </div>

            <div className="container-xl" style={{ padding: "3rem 2rem 2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}
                    className="grid-cols-1 md:grid-cols-3">

                    {/* Brand */}
                    <div>
                        <div style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.1rem",
                            fontWeight: 800,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            marginBottom: "0.5rem",
                        }}>
                            Formula <span style={{ color: "var(--color-red)" }}>Decoded</span>
                        </div>
                        <p style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "0.85rem",
                            color: "rgba(240,240,240,0.5)",
                            lineHeight: 1.6,
                            maxWidth: "240px",
                        }}>
                            Breaking down the engineering and technology of modern Formula One. Built for motorsport enthusiasts.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <div className="hud-label" style={{ marginBottom: "1rem" }}>Explore</div>
                        {LINKS.map((link) => (
                            <a key={link.label} href={link.href} style={{
                                display: "block",
                                fontFamily: "var(--font-heading)",
                                fontSize: "0.85rem",
                                color: "rgba(240,240,240,0.6)",
                                textDecoration: "none",
                                marginBottom: "0.5rem",
                                transition: "color 0.2s",
                            }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-red)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,240,240,0.6)")}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Socials */}
                    <div>
                        <div className="hud-label" style={{ marginBottom: "1rem" }}>Connect</div>
                        {SOCIALS.map((s) => (
                            <a key={s.label} href={s.href} style={{
                                display: "block",
                                fontFamily: "var(--font-heading)",
                                fontSize: "0.85rem",
                                color: "rgba(240,240,240,0.6)",
                                textDecoration: "none",
                                marginBottom: "0.5rem",
                                transition: "color 0.2s",
                            }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-red)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,240,240,0.6)")}
                            >
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "2.5rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid var(--color-border-subtle)",
                }}>
                    <span style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(240,240,240,0.3)",
                    }}>
                        © 2026 Formula Decoded. All rights reserved.
                    </span>
                    <span className="hud-tag">FIA 2026 Compliant</span>
                </div>
            </div>
        </footer>
    );
}
