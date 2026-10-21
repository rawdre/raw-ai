import { useSyncExternalStore } from "react";

function subscribeTo(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
}

/** Live media-query match. `null` during SSR/hydration, so callers can wait for the real value. */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(subscribeTo(query), () => window.matchMedia(query).matches, () => null);
}

/** True when the visitor asked the OS for less motion (false until hydrated). */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)") ?? false;
}
