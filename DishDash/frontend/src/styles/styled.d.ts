import "styled-components";
import type { AppTheme } from "./theme";

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
// Required for styled-components module augmentation.
// ESLint flags this as an empty interface, but it is intentional and correct.
