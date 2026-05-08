import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { createHighlighter } from "shiki";

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getCachedHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark-default"],
      langs: ["bash", "css", "html", "javascript", "json", "markdown", "tsx", "typescript"],
    });
  }
  return highlighterPromise;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeLang(info?: string) {
  if (!info) {
    return "text";
  }
  const lang = info.split(/\s+/)[0]?.toLowerCase() ?? "text";
  if (lang === "js") return "javascript";
  if (lang === "ts") return "typescript";
  if (lang === "md") return "markdown";
  return lang;
}

export async function renderMarkdown(source: string) {
  const renderer = new marked.Renderer();
  const asyncRenderer = renderer as unknown as {
    code: (code: string, info?: string) => Promise<string>;
  };
  asyncRenderer.code = async (code, info) => {
    const lang = normalizeLang(info);
    const highlighter = await getCachedHighlighter();
    const tokens = highlighter.codeToTokens(code, { lang, theme: "github-dark-default" });
    const lines = tokens
      .map((lineTokens, index) => {
        const content = lineTokens
          .map((token) => {
            const color = token.color ?? "#e2e8f0";
            return `<span style="color:${color}">${escapeHtml(token.content)}</span>`;
          })
          .join("");
        const safeContent = content.length === 0 ? "&nbsp;" : content;
        return `<span class="code-line"><span class="line-number">${index + 1}</span><span class="line-content">${safeContent}</span></span>`;
      })
      .join("");

    return `<div class="code-block" data-lang="${escapeHtml(lang)}"><div class="code-block-toolbar"><span class="code-lang">${escapeHtml(
      lang
    )}</span><button type="button" class="code-copy" data-code-copy aria-label="Copy code">Copy</button></div><pre><code>${lines}</code></pre></div>`;
  };

  const html = (await marked.parse(source || "", { async: true, renderer })) as string;
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "code",
      "pre",
      "div",
      "span",
      "button",
      "a",
      "img",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title"],
      code: ["class"],
      pre: ["class"],
      div: ["class", "data-lang"],
      span: ["class", "style"],
      button: ["class", "data-code-copy", "type", "aria-label"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
