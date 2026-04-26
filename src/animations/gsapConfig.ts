import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Register all GSAP plugins once.
 * Call this at the app entry level (layout.tsx or top-level client component).
 */
export function registerGSAP(): void {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * Default GSAP easing presets matching the motorsport design system.
 */
export const EASINGS = {
    racing: "power3.out",
    sharp: "expo.inOut",
    smooth: "power2.inOut",
    snappy: "back.out(1.7)",
} as const;

/**
 * Default ScrollTrigger defaults for scroll storytelling sections.
 */
export const SCROLL_DEFAULTS = {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
} as const;

/**
 * Animate elements into view on scroll using GSAP ScrollTrigger.
 * @param targets - CSS selector or element(s)
 * @param vars - Additional GSAP animation vars
 */
export function animateOnScroll(
    targets: string | Element | Element[],
    vars: gsap.TweenVars = {}
): gsap.core.Tween {
    return gsap.fromTo(
        targets,
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: EASINGS.racing,
            stagger: 0.12,
            scrollTrigger: {
                trigger: typeof targets === "string" ? targets : undefined,
                ...SCROLL_DEFAULTS,
            },
            ...vars,
        }
    );
}

/**
 * Create a pinned scroll sequence — pins the trigger for the duration
 * so that scroll drives animation progress.
 */
export function createScrollSequence(
    trigger: string | Element,
    scrubDuration: number = 1
): ScrollTrigger {
    return ScrollTrigger.create({
        trigger,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: scrubDuration,
    });
}

/**
 * Horizontal marquee scroll effect.
 */
export function animateMarquee(
    track: string | Element,
    direction: "left" | "right" = "left"
): gsap.core.Tween {
    const xPercent = direction === "left" ? -50 : 50;
    return gsap.to(track, {
        xPercent,
        ease: "none",
        duration: 20,
        repeat: -1,
    });
}
