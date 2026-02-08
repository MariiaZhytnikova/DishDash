export type AppTheme = {
  colors: {
    bg: string;
    panel: string;
    border: string;

    text: string;
    title: string;
    muted: string;

    primary: string;
    primaryHover: string;
    active: string;

    success: string;
    danger: string;
    warning: string;
  };
  shadow: {
    sm: string;
    md: string;
  };
  radius: {
    md: string;
  };
  transition: {
    normal: string;
  };
};

export const theme = {
  colors: {
    bg: "var(--color-bg)",
    panel: "var(--color-panel)",
    border: "var(--color-border)",

    text: "var(--color-text)",
    title: "var(--color-title)",
    muted: "var(--color-muted)",

    primary: "var(--color-primary)",
    primaryHover: "var(--color-primary-hover)",
    active: "var(--color-active)",

    success: "var(--color-success)",
    danger: "var(--color-danger)",
    warning: "var(--color-warning)",
  },
  shadow: {
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
  },
  radius: {
    md: "var(--radius-md)",
  },
  transition: {
    normal: "var(--transition-normal)",
  },
} satisfies AppTheme;
