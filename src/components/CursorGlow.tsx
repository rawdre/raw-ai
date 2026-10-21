"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/** Site-wide FX: a cyan spotlight that trails the cursor + a scroll-progress beam. */
export function CursorGlow() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    // Vars live on the glow layer only — writing them on :root would restyle the whole page per move.
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const style = glow.current?.style;
        style?.setProperty("--mx", `${e.clientX}px`);
        style?.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <div ref={glow} aria-hidden className="cursor-glow pointer-events-none fixed inset-0 z-[1] hidden md:block" />
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
        style={{ scaleX: progress, backgroundImage: "var(--grad)" }}
      />
    </>
  );
}
