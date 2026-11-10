import { useEffect, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'

import { isPrintAtom } from '../../store/index.ts'
import { version as appVersion } from '../../../package.json'

import styles from './index.module.css'

const DISMISSED_KEY = 'versionCheckDismissedVersion'
const UPDATE_PENDING_KEY = 'versionCheckUpdatePending'
const RECHECK_INTERVAL_MS = 15 * 60 * 1000
// the update handshake gives up after this many extra reloads or this
// much time — a stubborn service worker must not be able to trap the
// app in a reload loop
const MAX_UPDATE_ATTEMPTS = 3
const GIVE_UP_AFTER_MS = 5 * 60 * 1000

interface PendingUpdate {
  target: string
  attempts: number
  startedAt: number
}

const readPendingUpdate = (): PendingUpdate | null => {
  try {
    const raw = localStorage.getItem(UPDATE_PENDING_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PendingUpdate>
    if (typeof parsed.target !== 'string') return null
    return {
      target: parsed.target,
      attempts: typeof parsed.attempts === 'number' ? parsed.attempts : 0,
      startedAt:
        typeof parsed.startedAt === 'number' ? parsed.startedAt : Date.now(),
    }
  } catch {
    return null
  }
}

const writePendingUpdate = (pending: PendingUpdate) => {
  localStorage.setItem(UPDATE_PENDING_KEY, JSON.stringify(pending))
}

// true while a started update still needs this bundle to act on it:
// the running bundle is not the target yet and the handshake has
// neither exhausted its attempts nor timed out
const isUpdateInFlight = (pending: PendingUpdate | null): boolean =>
  pending !== null &&
  pending.target !== appVersion &&
  pending.attempts < MAX_UPDATE_ATTEMPTS &&
  Date.now() - pending.startedAt <= GIVE_UP_AFTER_MS

/**
 * Drop the precache and the service worker registration so a reload
 * cannot be served the stale bundle again.
 */
const dropCachesAndWorker = async () => {
  try {
    const cacheKeys = await caches.keys()
    await Promise.all(cacheKeys.map((key) => caches.delete(key)))
  } catch {
    // insecure contexts have no caches api
  }
  try {
    const registration = await navigator.serviceWorker?.getRegistration()
    await registration?.unregister()
  } catch {
    // no service worker: plain reload is enough
  }
}

/**
 * The service worker can keep a stale bundle running for days
 * (registerType: 'autoUpdate' only swaps in after a reload). This
 * banner compares the running version against /version.json (emitted
 * by vite.config.ts, never cached by sw or Vercel) and offers a
 * cache-clearing reload. Stale clients otherwise fail silently, e.g.
 * calls to long-removed api endpoints (#836).
 *
 * The reload fires immediately: awaiting the cleanup first kept the
 * button looking dead for up to a minute (a ~600-file precache, a
 * worker mid-install). The cleanup runs in the background instead;
 * if the reload still lands on the stale bundle (the dying worker can
 * serve one more navigation from the precache), the started bundle
 * finishes the cleanup and reloads again. The handshake state
 * survives reloads in localStorage and gives up after
 * MAX_UPDATE_ATTEMPTS.
 *
 * A dismissed banner only hides it for as long as this bundle runs —
 * stale clients also degrade the shared api for everyone (#836, #837),
 * so the update is forced as soon as the user leaves the app: hiding
 * the tab blurs (and thereby saves) the focused field, nothing typed
 * is lost in the reload.
 */
export const VersionCheck = () => {
  const isPrint = useAtomValue(isPrintAtom)
  const [availableVersion, setAvailableVersion] = useState<string | null>(null)
  const pendingVersionRef = useRef<string | null>(null)
  // "später" hides the banner for as long as this bundle runs; the next
  // version starts fresh
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === appVersion,
  )
  // an update started by this or a previous (stale) bundle is in
  // flight; carried across reloads via localStorage
  const [updating, setUpdating] = useState(() =>
    isUpdateInFlight(readPendingUpdate()),
  )

  const update = (target: string) => {
    // mark the update as in flight before anything async: this context
    // dies with the reload and the next bundle must be able to tell
    // whether it is the target already or still stale
    writePendingUpdate({ target, attempts: 0, startedAt: Date.now() })
    setUpdating(true)
    // the cleanup must not delay the reload — it can take up to a
    // minute for a big precache, which made the button look dead
    void dropCachesAndWorker()
    window.location.reload()
  }

  // finish an update a previous bundle started: either the reload
  // already landed on the target bundle (or the handshake gave up) —
  // only the flag needs dropping — or this bundle is still stale and
  // the interrupted cleanup is completed before reloading again
  useEffect(() => {
    const pending = readPendingUpdate()
    if (!pending) return
    if (!isUpdateInFlight(pending)) {
      localStorage.removeItem(UPDATE_PENDING_KEY)
      return
    }
    writePendingUpdate({ ...pending, attempts: pending.attempts + 1 })
    let active = true
    void (async () => {
      // the reload may have cut the previous bundle's background
      // cleanup short: make sure the precache and worker are really
      // gone before reloading again
      await dropCachesAndWorker()
      if (active) window.location.reload()
    })()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    const check = async () => {
      try {
        const res = await fetch('/version.json', { cache: 'no-store' })
        if (!res.ok || !active) return
        const data = (await res.json()) as { version?: string | undefined }
        if (data.version && data.version !== appVersion) {
          pendingVersionRef.current = data.version
          setAvailableVersion(data.version)
        }
      } catch {
        // dev server has no version.json, electron/offline fetches fail:
        // nothing to compare
      }
    }
    void check()
    const interval = setInterval(() => void check(), RECHECK_INTERVAL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void check()
      } else if (pendingVersionRef.current) {
        update(pendingVersionRef.current)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      active = false
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  if (isPrint) return null

  if (updating) {
    return (
      <div
        className={styles.banner}
        role="status"
      >
        <div className={styles.text}>
          {`App wird aktualisiert …`}
        </div>
        <LinearProgress
          className={styles.progress}
          color="inherit"
        />
      </div>
    )
  }

  if (!availableVersion || dismissed) return null

  return (
    <div
      className={styles.banner}
      role="alert"
    >
      <div className={styles.text}>
        {`Eine neue Version (${availableVersion}) von apflora ist verfügbar. Die laufende Version (${appVersion}) ist veraltet und kann Fehler verursachen.`}
      </div>
      <div className={styles.actions}>
        <Button
          className={styles.button}
          variant="outlined"
          size="small"
          onClick={() => update(availableVersion)}
        >
          App aktualisieren
        </Button>
        <Button
          className={styles.button}
          size="small"
          onClick={() => {
            localStorage.setItem(DISMISSED_KEY, appVersion)
            setDismissed(true)
          }}
        >
          später
        </Button>
      </div>
    </div>
  )
}
