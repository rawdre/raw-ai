"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/** Makes every Framer animation honour the visitor's reduced-motion setting. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
