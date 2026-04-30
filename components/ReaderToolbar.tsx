"use client";

import { useEffect, useState } from "react";

const themes = [
  { id: "ivory", label: "Ivory" },
  { id: "sepia", label: "Sepia" },
  { id: "dim", label: "Dim" },
];

const fonts = [
  { id: "serif", label: "Serif" },
  { id: "sans", label: "Sans" },
];

export default function ReaderToolbar() {
  const [theme, setTheme] = useState("ivory");
  const [font, setFont] = useState("serif");
  const [readingMode, setReadingMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("reader-theme");
    const storedFont = localStorage.getItem("reader-font");
    const storedMode = localStorage.getItem("reader-mode");
    if (storedTheme) setTheme(storedTheme);
    if (storedFont) setFont(storedFont);
    if (storedMode) setReadingMode(storedMode === "on");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.readerTheme = theme;
    root.dataset.readerFont = font;
    if (readingMode) {
      root.classList.add("reading-mode");
    } else {
      root.classList.remove("reading-mode");
    }
    localStorage.setItem("reader-theme", theme);
    localStorage.setItem("reader-font", font);
    localStorage.setItem("reader-mode", readingMode ? "on" : "off");
  }, [theme, font, readingMode]);

  return (
    <div className="reader-toolbar">
      <div className="reader-group">
        {themes.map((item) => (
          <button
            key={item.id}
            type="button"
            className={theme === item.id ? "reader-chip active" : "reader-chip"}
            onClick={() => setTheme(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="reader-group">
        {fonts.map((item) => (
          <button
            key={item.id}
            type="button"
            className={font === item.id ? "reader-chip active" : "reader-chip"}
            onClick={() => setFont(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={readingMode ? "reader-chip active" : "reader-chip"}
        onClick={() => setReadingMode((value) => !value)}
      >
        Reading mode
      </button>
    </div>
  );
}
