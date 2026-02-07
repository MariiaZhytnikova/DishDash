import "styled-components";
import type { AppTheme } from "./theme";

declare module "styled-components" {
  // Use type alias instead of empty interface
  export type DefaultTheme = AppTheme;
}
