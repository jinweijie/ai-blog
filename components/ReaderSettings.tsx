"use client";

import { useEffect, useMemo, useState } from "react";

const themes = [
  { id: "ivory", label: "Ivory" },
  { id: "sepia", label: "Sepia" },
  { id: "dim", label: "Dim" },
];

const fonts = [
  { id: "serif", label: "Serif" },
  { id: "sans", label: "Sans" },
];

const fontSizes = [
  { id: "sm", label: "Small", value: "15px" },
  { id: "md", label: "Medium", value: "17px" },
  { id: "lg", label: "Large", value: "19px" },
];

const defaultSettings = {
  theme: "ivory",
  font: "serif",
  size: "md",
  mode: false,
};

function readSetting<T extends keyof typeof defaultSettings>(
  key: T
): (typeof defaultSettings)[T] {
  const raw = localStorage.getItem(`reader-${key}`);
  if (raw === null) {
    return defaultSettings[key];
  }
  if (key === "mode") {
    return (raw === "on") as (typeof defaultSettings)[T];
  }
  return raw as (typeof defaultSettings)[T];
}

function applySettings({
  theme,
  font,
  size,
  mode,
}: {
  theme: string;
  font: string;
  size: string;
  mode: boolean;
}) {
  const root = document.documentElement;
  root.dataset.readerTheme = theme;
  root.dataset.readerFont = font;
  root.dataset.readerSize = size;
  if (mode) {
    root.classList.add("reading-mode");
  } else {
    root.classList.remove("reading-mode");
  }
}

function persistSettings({
  theme,
  font,
  size,
  mode,
}: {
  theme: string;
  font: string;
  size: string;
  mode: boolean;
}) {
  localStorage.setItem("reader-theme", theme);
  localStorage.setItem("reader-font", font);
  localStorage.setItem("reader-size", size);
  localStorage.setItem("reader-mode", mode ? "on" : "off");
}

export default function ReaderSettings() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(defaultSettings.theme);
  const [font, setFont] = useState(defaultSettings.font);
  const [size, setSize] = useState(defaultSettings.size);
  const [mode, setMode] = useState(defaultSettings.mode);

  useEffect(() => {
    const nextTheme = readSetting("theme");
    const nextFont = readSetting("font");
    const nextSize = readSetting("size");
    const nextMode = readSetting("mode");
    setTheme(nextTheme);
    setFont(nextFont);
    setSize(nextSize);
    setMode(nextMode);
    applySettings({
      theme: nextTheme,
      font: nextFont,
      size: nextSize,
      mode: nextMode,
    });
  }, []);

  useEffect(() => {
    applySettings({ theme, font, size, mode });
    persistSettings({ theme, font, size, mode });
  }, [theme, font, size, mode]);

  const sizeLabel = useMemo(
    () => fontSizes.find((item) => item.id === size)?.label ?? "Medium",
    [size]
  );

  return (
    <div className="reader-settings">
      <button type="button" className="reader-settings-trigger" onClick={() => setOpen(true)}>
        Reading
      </button>
      {open ? (
        <div className="reader-settings-backdrop" onClick={() => setOpen(false)}>
          <div className="reader-settings-dialog" onClick={(event) => event.stopPropagation()}>
            <div className="reader-settings-header">
              <div>
                <p className="reader-settings-title">Reading settings</p>
                <p className="reader-settings-subtitle">
                  Theme, font, size, and focus mode apply site-wide.
                </p>
              </div>
              <button
                type="button"
                className="reader-settings-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="reader-settings-section">
              <p className="reader-settings-label">Theme</p>
              <div className="reader-settings-row">
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
            </div>
            <div className="reader-settings-section">
              <p className="reader-settings-label">Font</p>
              <div className="reader-settings-row">
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
            </div>
            <div className="reader-settings-section">
              <p className="reader-settings-label">Text size</p>
              <div className="reader-settings-row">
                {fontSizes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={size === item.id ? "reader-chip active" : "reader-chip"}
                    onClick={() => setSize(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="reader-settings-footer">
              <span className="reader-settings-status">Current size: {sizeLabel}</span>
              <button
                type="button"
                className={mode ? "reader-chip active" : "reader-chip"}
                onClick={() => setMode((value) => !value)}
              >
                Reading mode
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
