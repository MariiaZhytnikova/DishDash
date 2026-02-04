import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    /* Primary Colors */
    --color-primary: #1FA9E4;
    --color-primary-hover: #7ed5f9;
    --color-primary-light: #e8f5e9;
    --color-primary-grey: #aeb0b4ff;
    
    /* Danger Colors */
    --color-danger: #ef4444;
    --color-danger-hover: #dc2626;
    
    /* Text Colors */ 
    --color-text: #0F172A;
    --color-text-muted:     #64748B; 
    --color-text-secondary: #202125;  /* secondary text */
    --color-text-disabled:  #94A3B8;  /* disabled / very subtle */
    --color-cardtext: #4a4a4a;
    
    /* Secondary Colors */
    --color-secondary: #5dc2e7;
    --color-secondary-alt: #a0c6ff;
    --color-info-hover: #7ed5f9;
    --color-accent: #de1167;
    --color-accent-hover: #b21057;
    
    /* Neutral Colors */
    --color-white: #ffffff;
    
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
