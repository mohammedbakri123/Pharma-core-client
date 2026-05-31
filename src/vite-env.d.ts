/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_PREFIX?: string;
  readonly VITE_API_HEALTH_PATH?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
  readonly VITE_API_CREDENTIALS?: RequestCredentials;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
