/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module 'react-leaflet-markercluster/styles'
declare module 'file-saver'
declare module 'browser-update' {
  const updateBrowser: (config: Record<string, unknown>) => void
  export default updateBrowser
}
