"use client";

import { useEffect } from "react";

function collectCode(block: Element) {
  const lines = Array.from(block.querySelectorAll(".line-content"));
  if (lines.length === 0) {
    const code = block.querySelector("code");
    return code?.textContent ?? "";
  }
  return lines.map((line) => line.textContent ?? "").join("\n");
}

export default function CodeCopyClient() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const button = target?.closest("[data-code-copy]") as HTMLElement | null;
      if (!button) return;

      const block = button.closest(".code-block");
      if (!block) return;

      const text = collectCode(block);
      if (!text) return;

      void navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = "Copied";
      button.setAttribute("data-copied", "true");
      window.setTimeout(() => {
        button.textContent = original ?? "Copy";
        button.removeAttribute("data-copied");
      }, 1500);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
