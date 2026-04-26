"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroSection({
  introFinished = true,
}: {
  introFinished?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!introFinished) return; // Wait for intro to finish

    // Ensure GSAP works correctly in Next.js by waiting for mount
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Title Bounce & Slide
      tl.fromTo(
        [title1Ref.current, title2Ref.current],
        {
          yPercent: 150,
          opacity: 0,
          rotateX: 45,
          scale: 0.8,
          transformOrigin: "0% 50% -50",
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 1.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        0.1, // Short delay after intro finishes
      );

      // 2. Tagline Fade In
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.6",
      );

      // 3. Car Silhouette Dash
      tl.fromTo(
        carRef.current,
        { x: "-20vw", opacity: 0, scale: 0.8 },
        {
          x: "110vw",
          opacity: 1,
          scale: 1,
          duration: 2.8,
          ease: "power2.inOut",
        },
        "-=0.8",
      );

      // 4. Scroll Indicator Fade
      tl.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 1 },
        "-=0.5",
      );

      // Scroll Indicator Bounce Animation
      const scrollLine = scrollRef.current?.querySelector(".scroll-line");
      if (scrollLine) {
        gsap.to(scrollLine, {
          y: 8,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [introFinished]);

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
        background: "var(--color-background)", // Dark background
      }}
    >
      {/* Subtle Track Lines Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage: `
          repeating-linear-gradient(90deg, transparent 0, transparent 40px, var(--color-border) 40px, var(--color-border) 41px),
          repeating-linear-gradient(0deg, transparent 0, transparent 40px, var(--color-border) 40px, var(--color-border) 41px)
        `,
          transform: "perspective(1000px) rotateX(60deg) scale(2.5)",
          transformOrigin: "bottom",
          pointerEvents: "none",
        }}
      />

      {/* Red Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60vw",
          height: "40vh",
          background:
            "radial-gradient(ellipse, rgba(225,6,0,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content Container */}
      <div
        className="container-xl"
        style={{ position: "relative", zIndex: 10, textAlign: "center" }}
      >
        {/* Title Container with Clip Path for Sliding Effect */}
        <div
          style={{
            overflow: "hidden",
            paddingBottom: "10px",
            display: "inline-block",
          }}
        >
          <h1
            ref={title1Ref}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                opacity: 0.6,
                scale: 1.02,
                duration: 0.3,
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, { opacity: 1, scale: 1, duration: 0.3 })
            }
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
            }}
          >
            Formula
          </h1>
        </div>
        <br />
        <div
          style={{
            overflow: "hidden",
            paddingTop: "5px",
            display: "inline-block",
          }}
        >
          <h1
            ref={title2Ref}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                opacity: 0.6,
                scale: 1.02,
                duration: 0.3,
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, { opacity: 1, scale: 1, duration: 0.3 })
            }
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
            }}
          >
            Decoded
          </h1>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1rem, 2vw, 1.5rem)",
            fontWeight: 300,
            color: "rgba(240, 240, 240, 0.7)",
            marginTop: "2rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Breaking Down the Technology of Modern Formula One
        </p>
      </div>

      {/* Racing F1 Car Silhouette */}
      <div
        ref={carRef}
        style={{
          position: "absolute",
          bottom: "15%",
          left: 0,
          width: "500px",
          height: "100px",
          zIndex: 5,
          pointerEvents: "none",
          // Motion blur effect using backdrop-filter and drop-shadow
          filter: "drop-shadow(-20px 0px 10px rgba(225,6,0,0.4)) blur(2px)",
        }}
      >
        {/* F1 Silhouette SVG */}
        <svg
          viewBox="0 0 500 120"
          fill="var(--color-foreground)"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          <path d="M70,80 L90,80 L95,60 L140,55 L180,45 L220,40 L260,35 L300,45 L340,50 L400,60 L450,70 L480,80 L480,95 L450,95 C450,110 420,110 420,95 L140,95 C140,110 110,110 110,95 L70,95 Z" />
          {/* Wheels */}
          <circle
            cx="125"
            cy="95"
            r="20"
            fill="#111"
            stroke="#333"
            strokeWidth="4"
          />
          <circle
            cx="435"
            cy="95"
            r="20"
            fill="#111"
            stroke="#333"
            strokeWidth="4"
          />
          {/* Rear Wing */}
          <rect x="60" y="40" width="10" height="40" fill="var(--color-red)" />
          <rect x="40" y="30" width="40" height="10" fill="var(--color-red)" />
        </svg>
      </div>

      {/* Speed lines for motion effect */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: 0,
          width: "100%",
          height: "60px",
          pointerEvents: "none",
          zIndex: 4,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(225,6,0,0.05) 50%, transparent 100%)",
          animation: "slide-right 0.5s linear infinite",
          opacity: 0.5,
        }}
      />

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
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
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-red)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(240, 240, 240, 0.5)")
          }
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
          <div
            className="scroll-line"
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
      </div>
    </section>
  );
}
