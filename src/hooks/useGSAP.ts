"use client";

import { useEffect, useRef, DependencyList } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGSAP } from "@/animations/gsapConfig";

if (typeof window !== "undefined") {
    registerGSAP();
}

type GSAPContextCallback = (context: gsap.Context) => void;

/**
 * useGSAP — R3F-safe GSAP context hook.
 * Automatically creates and reverts a GSAP context on unmount.
 *
 * @param callback - GSAP animation code using the provided context
 * @param deps     - Dependency array (like useEffect)
 * @param scope    - Optional scope element ref for context isolation
 *
 * @example
 * const containerRef = useRef(null);
 * useGSAP((ctx) => {
 *   ctx.add(() => {
 *     gsap.from(".card", { opacity: 0, y: 30, stagger: 0.1 });
 *   });
 * }, [], containerRef);
 */
export function useGSAP(
    callback: GSAPContextCallback,
    deps: DependencyList = [],
    scope?: React.RefObject<HTMLElement | null>
) {
    const ctxRef = useRef<gsap.Context | null>(null);

    useEffect(() => {
        // Cleanup previous context
        ctxRef.current?.revert();

        const ctx = gsap.context(
            (self) => callback(self),
            scope?.current ?? undefined
        );
        ctxRef.current = ctx;

        return () => {
            ctx.revert();
            ScrollTrigger.refresh();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return ctxRef;
}
