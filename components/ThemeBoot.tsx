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
    const storedTheme = localStorage.getItem("reader-theme");
    const storedFont = localStorage.getItem("reader-font");
    const storedSize = localStorage.getItem("reader-size");
    const storedMode = localStorage.getItem("reader-mode");
    if (storedTheme) root.dataset.readerTheme = storedTheme;
    if (storedFont) root.dataset.readerFont = storedFont;
    if (storedSize) root.dataset.readerSize = storedSize;
    if (storedMode === "on") root.classList.add("reading-mode");
  }, [accent, fontPair]);

  return null;
}
