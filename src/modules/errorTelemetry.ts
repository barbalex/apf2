// opt-in client error telemetry for self-hosted collectors (Sentry,
// GlitchTip, or a simple PostgREST RPC). Privacy by default: unless
// VITE_ERROR_TELEMETRY_URL is set at build time, every function here is a
// no-op and nothing leaves the browser.
//
// Payload discipline — send only what is needed to reproduce an error:
// message, stack, url (path + search), user agent, release. No user id, no
// user name, no localStorage, no extra DOM state. Stacks reference the
// deployed chunk urls; the server can symbolicate them with the sourcemaps
// the build emits (build.sourcemap in vite.config.ts).

declare const __APP_VERSION__: string

const endpoint = import.meta.env.VITE_ERROR_TELEMETRY_URL as string | undefined

// hard caps so a broken release cannot flood the collector or loop
const maxEventsPerSession = 25
const maxRepeatsPerMessage = 3
const maxMessageLength = 2_000
const maxStackLength = 5_000

let sentEvents = 0
const sentPerMessage = new Map<string, number>()

export type ErrorKind =
  'window.error' | 'unhandledrejection' | 'boundary' | 'manual'

export interface ErrorTelemetryEvent {
  release: string
  timestamp: string
  kind: ErrorKind
  message: string
  stack?: string | undefined
  url: string
  userAgent: string
}

const clip = (value: string | undefined, max: number) =>
  value ? value.slice(0, max) : undefined

const buildEvent = (
  kind: ErrorKind,
  error: unknown,
): ErrorTelemetryEvent | undefined => {
  const message =
    error instanceof Error ? error.message
    : typeof error === 'string' ? error
    : (JSON.stringify(error) ?? 'unknown error')
  if (!message) return undefined
  return {
    release: __APP_VERSION__,
    timestamp: new Date().toISOString(),
    kind,
    message: message.slice(0, maxMessageLength),
    stack: clip(
      error instanceof Error ? error.stack : undefined,
      maxStackLength,
    ),
    url: `${window.location.pathname}${window.location.search}`,
    userAgent: navigator.userAgent,
  }
}

export const reportError = (kind: ErrorKind, error: unknown): Promise<void> => {
  if (!endpoint) return Promise.resolve()

  const event = buildEvent(kind, error)
  if (!event) return Promise.resolve()

  if (sentEvents >= maxEventsPerSession) return Promise.resolve()
  const repeats = sentPerMessage.get(event.message) ?? 0
  if (repeats >= maxRepeatsPerMessage) return Promise.resolve()
  sentPerMessage.set(event.message, repeats + 1)
  sentEvents++

  // the collector must never become a source of errors itself
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
    keepalive: true,
  })
    .then(() => undefined)
    .catch(() => undefined)
}

// install global handlers. Called once from main.tsx
export const installErrorTelemetry = () => {
  if (!endpoint) return

  window.addEventListener('error', (event) => {
    void reportError('window.error', event.error ?? event.message)
  })
  window.addEventListener('unhandledrejection', (event) => {
    void reportError('unhandledrejection', event.reason)
  })
}
