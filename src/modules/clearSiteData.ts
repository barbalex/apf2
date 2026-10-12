import localForage from 'localforage'

/**
 * Clears all data the browser has stored for this origin, then reloads.
 *
 * Unlike logout (which only resets app state), this wipes everything:
 * service workers and their caches, IndexedDB, web storage and the
 * cookies reachable from JavaScript. On reload the service worker
 * re-registers (main.tsx) and rebuilds its cache from the current build.
 *
 * All async deletions must be awaited before reloading: the reload kills
 * in-flight transactions, which is why fire-and-forget clearing
 * (as in the previous attempt) left data behind.
 */
export const clearSiteData = async () => {
  // 1. Unregister service workers before deleting their caches,
  // so they cannot re-populate caches while being torn down
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.allSettled(
      registrations.map((registration) => registration.unregister()),
    )
  }

  // 2. Delete all Cache Storage caches (workbox precache and runtime caches)
  if ('caches' in window) {
    const cacheKeys = await caches.keys()
    await Promise.allSettled(cacheKeys.map((key) => caches.delete(key)))
  }

  // 3. Wipe IndexedDB.
  // localForage keeps its connection open, which blocks deleting its own
  // database until page unload - so clear it through the open connection
  // and delete all other databases (blocked deletions resolve, not hang)
  const idbWork: Promise<unknown>[] = [localForage.clear()]
  if (indexedDB.databases) {
    const databases = await indexedDB.databases()
    for (const { name } of databases) {
      if (!name || name === 'localforage') continue
      idbWork.push(
        new Promise<void>((resolve) => {
          const request = indexedDB.deleteDatabase(name)
          request.onsuccess = request.onerror = request.onblocked = () =>
            resolve()
        }),
      )
    }
  }
  await Promise.allSettled(idbWork)

  // 4. Expire cookies reachable from JavaScript
  // (HttpOnly cookies can only be cleared by the server)
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim()
    if (!name) continue
    document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; path=/`
  }

  // 5. Web storage synchronously, immediately before reloading:
  // atoms persisted with atomWithStorage write back to localStorage on
  // every set, so clearing any earlier would let later writes survive
  localStorage.clear()
  sessionStorage.clear()

  // 6. Reload: page is served from the network, not the deleted precache
  window.location.reload()
}
