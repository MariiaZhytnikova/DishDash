import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    /* Primary Colors */
    --color-primary: #1FA9E4;
    --color-primary-hover: #7ed5f9;
    --color-primary-light: #e8f5e9;
    
    /* Danger Colors */
    --color-danger: #ef4444;
    --color-danger-hover: #dc2626;
    --color-danger-light: #fee2e2;
    --color-danger-text: #991b1b;
    --color-danger-border: #fca5a5;
    
    /* Info Colors */
    --color-info: #3b82f6;
    --color-info-hover: #2563eb;
    
    /* Secondary Colors */
    --color-secondary: #5dc2e7;
    --color-secondary-alt: #4f46e5;
    
    /* Accent Colors */
    --color-accent: #de1167;
    --color-accent-hover: #b21057;
    
    /* Neutral Colors */
    --color-white: #ffffff;
    --color-text: #1a1a1a;
    --color-text-secondary: #333333;
    --color-text-muted: #666666;
    --color-text-light: #999999;
    
    /* Border & Background Colors */
    --color-border: #e5e5e5;
    --color-bg: #f5f5f5;
    --color-bg-light: #fafafa;
    --color-input-bg: #ffffff;
    
    /* Shadow */
    --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.15);
    --shadow-md: 0 8px 16px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.25);
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
    
    /* Border Radius */
    --radius-xs: 2px;
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;
    
    /* Font Sizes */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    
    /* Font Weights */
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    /* Line Height */
    --line-height-tight: 1.2;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    
    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    /* Z-Index Layers */
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal: 1000;
    --z-tooltip: 1100;
    --z-notification: 1200;
    
    /* Border Width */
    --border-width-thin: 1px;
    --border-width-normal: 2px;
  }

  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  }
  a { color: inherit; }
`;
