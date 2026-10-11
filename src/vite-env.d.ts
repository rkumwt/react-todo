/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "localStorage" (default) | "indexedDB" | "memory" */
  readonly VITE_STORAGE_DRIVER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
