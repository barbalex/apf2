/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module 'react-leaflet-markercluster/styles'
declare module 'file-saver'
declare module 'react-highlight-words' {
  import type { ComponentType } from 'react'
  const Highlighter: ComponentType<{
    searchWords: string[]
    textToHighlight: string
    highlightClassName?: string
    autoEscape?: boolean
  }>
  export default Highlighter
}
declare module 'browser-update' {
  const updateBrowser: (config: Record<string, unknown>) => void
  export default updateBrowser
}
