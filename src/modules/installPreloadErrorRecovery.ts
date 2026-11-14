// a deploy replaces the running bundle's hashed assets under the same
// url: every lazy import() of a session that predates the deploy (or
// caught its cutover) fails to preload its chunk css — Vite's preload
// helper then throws "Unable to preload CSS for /assets/…". The root
// Router is lazy inside a Suspense without an error boundary, so such a
// failure leaves a blank page. Vite dispatches 'vite:preloadError'
// before throwing; this handler drops the service-worker precache (a
// stale worker would serve the dead bundle right back) and reloads.
// Attempts are capped so a persistently broken deployment cannot trap
// the app in a reload loop — same shape as VersionCheck's update
// handshake, but for an unknown target version.
import { dropCachesAndWorker } from './dropCachesAndWorker.ts'

const KEY = 'preloadErrorRecoveryAttempts'
const MAX_ATTEMPTS = 3
// a healthy load never clears the counter (nothing knows it succeeded);
// instead the window expires it — a later incident starts fresh
const WINDOW_MS = 5 * 60 * 1000

interface Recovery {
  attempts: number
  startedAt: number
}

const readRecovery = (): Recovery => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { attempts: 0, startedAt: 0 }
    const parsed = JSON.parse(raw) as Partial<Recovery>
    if (
      typeof parsed.attempts !== 'number' ||
      typeof parsed.startedAt !== 'number'
    ) {
      return { attempts: 0, startedAt: 0 }
    }
    return {
      attempts: parsed.attempts,
      startedAt: parsed.startedAt,
    }
  } catch {
    return { attempts: 0, startedAt: 0 }
  }
}

const recover = async () => {
  const { attempts, startedAt } = readRecovery()
  const fresh = attempts === 0 || Date.now() - startedAt > WINDOW_MS
  if (!fresh && attempts >= MAX_ATTEMPTS) return
  const next = {
    attempts: fresh ? 1 : attempts + 1,
    startedAt: fresh ? Date.now() : startedAt,
  }
  localStorage.setItem(KEY, JSON.stringify(next))
  await dropCachesAndWorker()
  window.location.reload()
}

export const installPreloadErrorRecovery = () => {
  // the preload helper still throws after the event (unless prevented):
  // on purpose — the error stays visible in the error telemetry while
  // the reload races it (reportError's fetch is keepalive, it survives)
  window.addEventListener('vite:preloadError', () => {
    void recover()
  })
}
