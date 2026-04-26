"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const MILESTONES = [
  {
    year: "1950",
    label: "The Genesis",
    desc: "The inaugural Formula One World Championship begins at Silverstone. Alfa Romeo dominates the field.",
    color: "#ffffff",
    image: "/images/eras/f1_1950_genesis_1773157952746.png",
  },
  {
    year: "1978",
    label: "Ground Effect",
    desc: "Team Lotus introduces revolutionary ground effect aerodynamics, sucking cars to the track for unprecedented speed.",
    color: "#ff33cc",
    image: "/images/eras/f1_1978_ground_effect_1773158379919.png",
  },
  {
    year: "1980s",
    label: "Turbo Era",
    desc: "Unlimited boost pressures lead to monstrous fire-breathing 1,000+ horsepower qualification engines.",
    color: "#FF0033",
    image: "/images/eras/f1_1980s_turbo_1773157974738.png",
  },
  {
    year: "1990s",
    label: "V10 Era",
    desc: "Screaming normally aspirated engines operating at 20,000 RPM define the acoustic signature of modern F1.",
    color: "#00E0FF",
    image: "/images/eras/f1_1990s_v10_1773158000817.png",
  },
  {
    year: "2014",
    label: "Hybrid Era",
    desc: "The introduction of sophisticated highly efficient 1.6L V6 Turbo Hybrid power units focuses on energy recovery.",
    color: "#00FF66",
    image: "/images/eras/f1_2014_hybrid_1773158021348.png",
  },
  {
    year: "2026",
    label: "New Regulations",
    desc: "Agile aero concepts and a roughly 50/50 split between internal combustion and electrical power outline the future.",
    color: "#FFD700",
    image: "/images/eras/f1_2026_next_1773158043657.png",
  },
];

export default function HistoryTimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = scrollContainerRef.current;

    if (!section || !container) return;

    const ctx = gsap.context(() => {
      // Horizontal scroll animation
      const scrollTween = gsap.to(container, {
        x: () => -(container.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${container.scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, { scaleX: self.progress });
            }
          }
        }
      });

      // Animate broadcast cards sliding up
      cardsRef.current.forEach((card) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { y: 150, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left left+=80%", // Trigger when card enters viewport
              toggleActions: "play reverse play reverse",
            }
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        background: "#0a0a0c",
        overflow: "hidden",
      }}
    >
      {/* Background Graphic elements for broadcast feel */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "10%", right: "-10%", width: "40%", height: "1PX", background: "rgba(255,255,255,0.1)", transform: "rotate(-15deg)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "-10%", width: "30%", height: "1PX", background: "rgba(255,255,255,0.1)", transform: "rotate(-15deg)" }} />
      </div>

      <div style={{ position: "absolute", top: "4rem", left: "2rem", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{
            display: "inline-block",
            backgroundColor: "var(--color-red)",
            color: "#fff",
            padding: "4px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            letterSpacing: "2px",
            fontWeight: "bold",
            textTransform: "uppercase",
            clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)",
            marginBottom: "1rem"
          }}
        >
          Replay: Historical Lineage
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "3rem",
            fontWeight: 900,
            fontStyle: "italic",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 1,
          }}
        >
          Eras of Speed
        </motion.h2>
      </div>

      {/* Scroller Container */}
      <div
        ref={scrollContainerRef}
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          width: `${MILESTONES.length * 80}vw`, // Extended width for scrolling
          paddingLeft: "10vw",
          paddingRight: "50vw",
          zIndex: 1,
          position: "relative"
        }}
      >
        {MILESTONES.map((m, i) => (
          <div
            key={i}
            style={{
              width: "60vw",
              maxWidth: "600px",
              flexShrink: 0,
              marginRight: "10vw",
              display: "flex",
              justifyContent: "center"
            }}
          >
            {/* Broadcast Graphic Card */}
            <div
              ref={(el) => { cardsRef.current[i] = el; }}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, rgba(30,30,35,0.95) 0%, rgba(15,15,18,0.95) 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderLeft: `4px solid ${m.color}`,
                clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
            >
              {/* Graphic Header / Year */}
              <div style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem 1.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(0,0,0,0.3)"
              }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  fontStyle: "italic",
                  lineHeight: 0.8,
                  color: m.color,
                  marginRight: "1.5rem"
                }}>
                  {m.year}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#fff"
                }}>
                  {m.label}
                </div>
              </div>

              {/* Graphic Content & Image */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", overflow: "hidden" }}>
                <Image
                  src={m.image}
                  alt={m.label}
                  fill
                  style={{ objectFit: "cover" }}
                />

                {/* Gradient overlay for text legibility if needed, or broadcast overlay elements */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }} />

                {/* Description mapped onto the bottom of the image area for broadcast look */}
                <div style={{
                  position: "absolute",
                  bottom: 0, left: 0, width: "100%",
                  padding: "1.5rem",
                }}>
                  <p style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.1rem",
                    lineHeight: 1.4,
                    maxWidth: "90%"
                  }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Global Replay / Timeline Bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 20,
        background: "rgba(0,0,0,0.8)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* The thin tracking line that fills up */}
        <div style={{ width: "100%", height: "3px", background: "rgba(255,255,255,0.1)" }}>
          <div
            ref={progressBarRef}
            style={{
              width: "100%",
              height: "100%",
              background: "var(--color-red)",
              transformOrigin: "left center",
              transform: "scaleX(0)"
            }}
          />
        </div>

        {/* Timeline Text Layout */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 2rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          letterSpacing: "1px",
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase"
        }}>
          {MILESTONES.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: m.color, fontWeight: "bold", marginRight: "6px" }}>{m.year}</span>
              <span style={{ display: "none", '@media (minWidth: 768px)': { display: "inline" } } as any}>| {m.label}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
