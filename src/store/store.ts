// the jotai store singleton plus the storage helpers shared by all modules
import { atom, createStore } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

// Some atoms with storage should not sync over all tabs:
// a JSON storage with the subscribe method disabled (no cross-tab sync).
// Explicitly typed as SyncStorage so atom getters don't widen to `T | Promise<T>`.
// delete, not assigning undefined, because of exactOptionalPropertyTypes
export const createUnsubscribedStorage = <T>() => {
  const storage = createJSONStorage<T>(() => localStorage)
  delete storage.subscribe
  return storage
}

export function atomWithToggleAndStorage(
  key: string,
  initialValue: boolean,
  storage?: Parameters<typeof atomWithStorage<boolean>>[2],
) {
  const anAtom = atomWithStorage(key, initialValue, storage, {
    getOnInit: true,
  })
  const derivedAtom = atom(
    (get) => get(anAtom),
    (get, set, nextValue?: boolean) => {
      const update = nextValue ?? !get(anAtom)
      set(anAtom, update)
    },
  )

  return derivedAtom
}

export const store = createStore()
