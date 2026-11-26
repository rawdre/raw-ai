"use client";

import { useCallback, useEffect, useState } from "react";
import { EMPTY_STATE, type GameState } from "./game";

const STORAGE_KEY = "raw-personal-game-v1";

function readStored(): GameState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return parsed && parsed.v === 1 ? { ...EMPTY_STATE, ...parsed } : EMPTY_STATE;
  } catch {
    return EMPTY_STATE; // storage blocked or corrupted: start fresh, the page still works
  }
}

/** Game progress, kept in this browser only (localStorage). `saveFailed` flags a blocked store. */
export function useGameState() {
  const [state, setState] = useState<GameState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    setState(readStored());
    setReady(true);
  }, []);

  const update = useCallback((change: (prev: GameState) => GameState) => {
    setState((prev) => {
      const next = change(prev);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setSaveFailed(false);
      } catch {
        setSaveFailed(true);
      }
      return next;
    });
  }, []);

  return { state, update, ready, saveFailed };
}
