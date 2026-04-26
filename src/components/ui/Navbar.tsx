"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "The Machine", href: "#machine" },
  { label: "The Grid", href: "#grid" },
  { label: "Race Control", href: "#race-control" },
];

export default function Navbar({
  introFinished = true,
}: {
  introFinished?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {introFinished && (
        <>
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2,
            }}
            className="fixed top-0 left-0 right-0 z-50"
            style={{
              background: scrolled ? "rgba(7, 7, 8, 0.92)" : "transparent",
              borderBottom: scrolled
                ? "1px solid rgba(30,30,34,0.8)"
                : "1px solid transparent",
              backdropFilter: scrolled ? "blur(20px)" : "none",
              WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
              transition:
                "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
            }}
          >
            <div className="container-xl">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "72px",
                }}
              >
                {/* Logo */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "var(--color-red)",
                      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                      position: "relative",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.9rem",
                        fontWeight: 800,
                        fontStyle: "italic",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--color-foreground)",
                        lineHeight: 1,
                        paddingRight: "0.05em",
                      }}
                    >
                      Formula
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.65rem",
                        fontWeight: 400,
                        fontStyle: "italic",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "var(--color-red)",
                        lineHeight: 1,
                        marginTop: "2px",
                        paddingRight: "0.05em",
                      }}
                    >
                      Decoded
                    </div>
                  </div>
                </motion.a>

                {/* Desktop Nav */}
                <nav
                  style={{ display: "flex", alignItems: "center", gap: "2rem" }}
                  className="hidden md:flex"
                >
                  {NAV_LINKS.map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      whileHover={{ color: "var(--color-red)" }}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(240, 240, 240, 0.7)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>

                {/* Right side */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  {/* Status pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.3rem 0.75rem",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface)",
                    }}
                    className="hidden md:flex"
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--color-red)",
                        animation: "pulse-red 2s ease-in-out infinite",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(240,240,240,0.5)",
                      }}
                    >
                      2026 Season
                    </span>
                  </div>

                  {/* Hamburger */}
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      padding: "4px",
                    }}
                    aria-label="Toggle menu"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        style={{
                          display: "block",
                          height: "1.5px",
                          background: "var(--color-foreground)",
                          transformOrigin: "center",
                        }}
                        animate={{
                          width:
                            menuOpen && i === 1 ? 0 : i === 1 ? "16px" : "24px",
                          rotate: menuOpen
                            ? i === 0
                              ? 45
                              : i === 2
                                ? -45
                                : 0
                            : 0,
                          y: menuOpen
                            ? i === 0
                              ? 6.5
                              : i === 2
                                ? -6.5
                                : 0
                            : 0,
                        }}
                        transition={{ duration: 0.25 }}
                      />
                    ))}
                  </button>
                </div>
              </div>
            </div>

            {/* Red accent line at very bottom of nav */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: scrolled
                  ? "linear-gradient(90deg, transparent, var(--color-red), transparent)"
                  : "transparent",
                transition: "background 0.4s",
              }}
            />
          </motion.header>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "fixed",
                  top: "72px",
                  left: 0,
                  right: 0,
                  zIndex: 49,
                  background: "rgba(7,7,8,0.98)",
                  borderBottom: "1px solid var(--color-border)",
                  backdropFilter: "blur(20px)",
                  padding: "1.5rem 2rem",
                }}
              >
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(240,240,240,0.8)",
                      textDecoration: "none",
                      padding: "1rem 0",
                      borderBottom: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
