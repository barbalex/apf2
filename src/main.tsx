import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import { App } from './App.tsx'
import { installErrorTelemetry } from './modules/errorTelemetry.ts'
import { installPreloadErrorRecovery } from './modules/installPreloadErrorRecovery.ts'

// https://vite-pwa-org.netlify.app/guide/auto-update.html
registerSW({ immediate: true })

// no-op unless VITE_ERROR_TELEMETRY_URL is set at build time
installErrorTelemetry()

// reload once when a deploy has invalidated the running bundle's chunks
installPreloadErrorRecovery()

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
