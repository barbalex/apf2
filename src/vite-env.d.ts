/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_ERROR_TELEMETRY_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// injected via vite define (vite.config.ts / vitest.config.unit.ts)
declare const __APP_VERSION__: string

declare module 'browser-update' {
  const updateBrowser: (config: Record<string, unknown>) => void
  export default updateBrowser
}
