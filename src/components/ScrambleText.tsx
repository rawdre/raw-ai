"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*<>/\{}[]=+";
const HOLD_MS = 2600;
const TICK_MS = 28;

/** Cycles through words with a "decrypting" glyph-scramble transition. */
export function ScrambleText({ words, className = "" }: { words: string[]; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (reduced) return;
    const hold = setTimeout(() => setIndex((i) => (i + 1) % words.length), HOLD_MS);
    return () => clearTimeout(hold);
  }, [index, reduced, words.length]);

  useEffect(() => {
    const target = words[index % words.length];
    if (reduced) {
      setText(target);
      return;
    }
    let step = 0;
    const total = target.length * 2;
    const timer = setInterval(() => {
      step++;
      const revealed = Math.floor(step / 2);
      setText(
        target
          .split("")
          .map((ch, i) => (i < revealed || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (step >= total) clearInterval(timer);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [index, reduced, words]);

  return (
    <>
      <span className="sr-only">{words[index % words.length]}</span>
      <span className={className} aria-hidden>
        {text}
      </span>
    </>
  );
}
