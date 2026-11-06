import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { isPrintAtom } from '../../store/index.ts'
import { version as appVersion } from '../../../package.json'

import styles from './index.module.css'

const DISMISSED_KEY = 'versionCheckDismissedVersion'
const RECHECK_INTERVAL_MS = 15 * 60 * 1000

/**
 * The service worker can keep a stale bundle running for days
 * (registerType: 'autoUpdate' only swaps in after a reload). This
 * banner compares the running version against /version.json (emitted
 * by vite.config.ts, never cached by sw or Vercel) and offers a
 * cache-clearing reload. Stale clients otherwise fail silently, e.g.
 * calls to long-removed api endpoints (#836).
 */
export const VersionCheck = () => {
  const isPrint = useAtomValue(isPrintAtom)
  const [availableVersion, setAvailableVersion] = useState<string | null>(null)
  // "später" hides the banner for as long as this bundle runs; the next
  // version starts fresh
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === appVersion,
  )

  useEffect(() => {
    let active = true
    const check = async () => {
      try {
        const res = await fetch('/version.json', { cache: 'no-store' })
        if (!res.ok || !active) return
        const data = (await res.json()) as { version?: string | undefined }
        if (data.version && data.version !== appVersion) {
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
      if (document.visibilityState === 'visible') void check()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      active = false
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const update = async () => {
    // drop the precache so the reload cannot serve the stale bundle again
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
    window.location.reload()
  }

  if (!availableVersion || dismissed || isPrint) return null

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
          onClick={() => void update()}
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
