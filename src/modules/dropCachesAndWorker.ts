/**
 * Drop the precache and the service worker registration so a reload
 * cannot be served the stale bundle again. Shared by VersionCheck's
 * update handshake and the vite:preloadError recovery — must stay
 * importable from the entry chunk, so it must not depend on app code.
 */
export const dropCachesAndWorker = async () => {
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
