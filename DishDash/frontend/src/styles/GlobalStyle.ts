import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    /* Core */
    --color-bg: #fcfcfc;
    --color-panel: #fafafa;
    --color-border: rgba(255,255,255,0.08);
    --color-border-focus: #e9ecef;
    --color-bg-lighter: #f8f9fa;

    /* Text */
    --color-text: #0f172a;
    --color-text-primary: #1a1a1a;
    --color-text-light: #666;
    --color-text-cardtext: #4a4a4a;
    --color-title: #1fa9e4;
    --color-muted: #64748b;

    /* Brand / Actions */
    --color-primary: #1fa9e4;
    --color-primary-hover: #7ed5f9;
    --color-primary-dark: #0d8bc9;
    --color-active: #1fa9e4;

    /* Status */
    --color-success: #22c55e;
    --color-danger: #dc2626;
    --color-warning: #ea580c;

    /* Shadows */
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.12);
    --shadow-primary: 0 4px 12px rgba(31, 169, 228, 0.3);
    --shadow-primary-hover: 0 4px 12px rgba(31, 169, 228, 0.15);

    /* Radius */
    --radius-md: 12px;

    /* Transitions */
    --transition-normal: 0.2s ease;
  }

  /* Optional: future dark mode (just switch data-theme on body/html) */
  [data-theme="dark"] {
    --color-bg: #0b1220;
    --color-panel: #0f172a;
    --color-border: rgba(255, 255, 255, 0.08);

    --color-text: #e5e7eb;
    --color-title: #7ed5f9;
    --color-muted: #94a3b8;

    --color-primary: #7ed5f9;
    --color-primary-hover: #bfefff;
    --color-active: #7ed5f9;
  }

  * { box-sizing: border-box; }
  html, body { height: 100%; }

  body {
    margin: 0;
    background: var(--color-bg);
    color: var(--color-text);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  }

  a { color: inherit; }
`;
