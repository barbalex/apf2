// snackbar notifications and the navigate function
import { atom } from 'jotai'

// Notifications
export interface Notification {
  key: number
  message: string
  title?: string
  options?: Record<string, unknown> & { key?: number; variant?: string }
}
export const notificationsAtom = atom<Notification[]>([])

export const addNotificationAtom = atom(
  null,
  (get, set, note: Omit<Notification, 'key'>) => {
    const notifications = get(notificationsAtom)
    const key = note.options?.key ?? new Date().getTime() + Math.random()
    set(notificationsAtom, [
      ...notifications,
      {
        key,
        ...note,
      },
    ])
  },
)

export const removeNotificationAtom = atom(null, (get, set, key: number) => {
  const notifications = get(notificationsAtom)
  set(
    notificationsAtom,
    notifications.filter((n) => n.key !== key),
  )
})

// navigate function atom
// Store as object because Jotai doesn't handle bare functions well
// The setter accepts a function and wraps it in { fn: function }
const navigateObjectBaseAtom = atom<{ fn: (path: string) => void } | undefined>(
  undefined,
)
export const navigateObjectAtom = atom(
  (get) => get(navigateObjectBaseAtom),
  (_get, set, navigateFunction: (path: string) => void) => {
    set(navigateObjectBaseAtom, { fn: navigateFunction })
  },
)
export const navigateAtom = atom((get) => get(navigateObjectBaseAtom)?.fn)

// drops the navigate function — the tree2 pane does this on unmount so a
// later explicit open sets the start path instead of navigating the dead
// memory router
export const unsetNavigateObjectAtom = atom(null, (_get, set) => {
  set(navigateObjectBaseAtom, undefined)
})
