export const BASE_URL = import.meta.env.DEV
  ? "/api"                            // dev uses Vite proxy
  : import.meta.env.VITE_API_URL;     // prod uses Fly.io URL
