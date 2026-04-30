"use client";

import { useEffect } from "react";

export default function ThemeBoot({
  accent,
  fontPair,
}: {
  accent: string;
  fontPair: string;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.accent = accent;
    root.dataset.readerFont = fontPair;
  }, [accent, fontPair]);

  return null;
}
