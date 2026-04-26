"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGSAP, EASINGS } from "@/animations/gsapConfig";

if (typeof window !== "undefined") {
    registerGSAP();
}

/**
 * useFadeIn - Fades an element in when entering the viewport.
 */
export function useFadeIn<T extends HTMLElement>(
    options: { duration?: number; delay?: number; start?: string } = {}
) {
    const ref = useRef<T>(null);
    const { duration = 1, delay = 0, start = "top 85%" } = options;

    useEffect(() => {
        if (!ref.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ref.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration,
                    delay,
                    ease: EASINGS.smooth,
                    scrollTrigger: {
                        trigger: ref.current,
                        start,
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, ref);

        return () => {
            ctx.revert();
            ScrollTrigger.refresh();
        };
    }, [duration, delay, start]);

    return ref;
}

/**
 * useSlideUp - Slides an element up and fades it in.
 */
export function useSlideUp<T extends HTMLElement>(
    options: { yOffset?: number; duration?: number; delay?: number; start?: string } = {}
) {
    const ref = useRef<T>(null);
    const { yOffset = 50, duration = 0.8, delay = 0, start = "top 85%" } = options;

    useEffect(() => {
        if (!ref.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ref.current,
                { opacity: 0, y: yOffset },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    delay,
                    ease: EASINGS.racing,
                    scrollTrigger: {
                        trigger: ref.current,
                        start,
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, ref);

        return () => {
            ctx.revert();
            ScrollTrigger.refresh();
        };
    }, [yOffset, duration, delay, start]);

    return ref;
}

/**
 * useStaggeredText - Reaveals text characters or words with a stagger.
 * It assumes you have wrapped the text items inside the ref container.
 */
export function useStaggeredText<T extends HTMLElement>(
    options: { childSelector?: string; yOffset?: number; stagger?: number; duration?: number; start?: string } = {}
) {
    const ref = useRef<T>(null);
    const {
        childSelector = "span, p, h1, h2, h3",
        yOffset = 30,
        stagger = 0.05,
        duration = 0.7,
        start = "top 85%",
    } = options;

    useEffect(() => {
        if (!ref.current) return;
        const ctx = gsap.context(() => {
            const targets = ref.current!.querySelectorAll(childSelector);
            if (!targets.length) return;

            gsap.fromTo(
                targets,
                { opacity: 0, y: yOffset },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    stagger,
                    ease: EASINGS.smooth,
                    scrollTrigger: {
                        trigger: ref.current,
                        start,
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, ref);

        return () => {
            ctx.revert();
            ScrollTrigger.refresh();
        };
    }, [childSelector, yOffset, stagger, duration, start]);

    return ref;
}

/**
 * useParallax - Moves a background element at a different speed than the scroll.
 */
export function useParallax<T extends HTMLElement>(speed: number = 0.3) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ref.current!,
                { yPercent: -10 * speed },
                {
                    yPercent: 30 * speed,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ref.current!.parentElement || ref.current!, // Parent acts as the bounds usually
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                }
            );
        }, ref);

        return () => {
            ctx.revert();
            ScrollTrigger.refresh();
        };
    }, [speed]);

    return ref;
}
