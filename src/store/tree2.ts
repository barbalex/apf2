// the second tree: an in-app pane with its own jotai store and its own
// MemoryRouter (see src/components/Projekte/Tree2). The pane store is
// initialized like a fresh app load and holds independent navigation,
// open-node and filter state — the successor of the former whole-app
// iframe (issues/tree2-second-pane.md).
//
// Shared atoms (user, query client, notifications) are mirrored from the
// root store so the pane authenticates, invalidates and toasts through
// the app's singletons.
import { atom, createStore } from 'jotai'

import { store as rootStore } from './store.ts'
import { treeActiveNodeArrayAtom } from './tree.ts'
import { tsQueryClientAtom } from './ui.ts'
import {
  addNotificationAtom,
  navigateAtom,
  notificationsAtom,
  type Notification,
} from './notifications.ts'
import { userAtom } from './user.ts'

export const tree2Store = createStore()

// initial entry of the pane's MemoryRouter; only used when the pane
// mounts — once open, navigation goes through the pane's own navigate.
// '' means "no explicit target": the pane then opens at pane 1's current
// location (the former iframe-src default)
export const tree2PathAtom = atom('')

// builds the pane path the way the former iframe src was built: keep all
// search params, reduce projekteTabs to the de-2ed tree2-tabs (defaulting
// to tree+daten), point at the given /Daten path
export const buildTree2Path = (
  path: string,
  search: string,
  onlyShowActivePath?: boolean | undefined,
) => {
  const paneSearch = new URLSearchParams()
  for (const [key, value] of new URLSearchParams(search)) {
    if (key !== 'projekteTabs') paneSearch.append(key, value)
  }
  // keep only the tree2-tabs, de-2 them (the former iframe src rule)
  const derivedTabs = new URLSearchParams(search)
    .getAll('projekteTabs')
    .filter((t) => t.includes('2'))
    .map((t) => t.replace('2', ''))
  for (const t of derivedTabs) paneSearch.append('projekteTabs', t)
  if (!paneSearch.getAll('projekteTabs').length) {
    paneSearch.append('projekteTabs', 'tree')
    paneSearch.append('projekteTabs', 'daten')
  }
  if (onlyShowActivePath) paneSearch.append('onlyShowActivePath', 'true')
  return `${path}?${paneSearch.toString()}`
}

// whether the pane is currently mounted. Maintained by the Tree2
// component — NOT derivable from tree2Store's navigateObjectAtom, which
// outlives the pane (module-level store): an explicit open after a
// close would otherwise navigate the dead memory router instead of
// setting the pane's start path
export const tree2OpenAtom = atom(false)

// opens (or navigates) the pane on a node
export const setTree2PathByActiveNodeArrayAtom = atom(
  null,
  (
    _get,
    _set,
    {
      activeNodeArray,
      search,
      onlyShowActivePath,
    }: {
      activeNodeArray: (string | number)[]
      search: string
      onlyShowActivePath?: boolean | undefined
    },
  ) => {
    const path = buildTree2Path(
      `/Daten/${activeNodeArray.join('/')}`,
      search,
      onlyShowActivePath,
    )

    const navigate =
      rootStore.get(tree2OpenAtom) ? tree2Store.get(navigateAtom) : undefined
    if (navigate) {
      // pane is open: navigate it in place — no remount, no reload
      navigate(path)
    } else {
      tree2Store.set(treeActiveNodeArrayAtom, activeNodeArray)
      rootStore.set(tree2PathAtom, path)
    }
  },
)

// mirror the shared atoms from the root store into the pane store.
// Called once when the pane mounts.
export const initTree2SharedAtoms = () => {
  tree2Store.set(userAtom, rootStore.get(userAtom))
  const tsQueryClient = rootStore.get(tsQueryClientAtom)
  if (tsQueryClient) tree2Store.set(tsQueryClientAtom, tsQueryClient)
}

// pane-2 notifications are displayed by the root snackbar (notistack is
// mounted once): forward every notification added in the pane store.
let notificationsBridged = false
export const bridgeTree2Notifications = () => {
  if (notificationsBridged) return
  notificationsBridged = true

  let previous: Notification[] = []
  tree2Store.sub(notificationsAtom, () => {
    const next = tree2Store.get(notificationsAtom)
    const added = next.filter((n) => !previous.includes(n))
    previous = next
    for (const notification of added) {
      rootStore.set(addNotificationAtom, notification)
    }
    if (added.length) {
      // consume locally so they are not forwarded again; the root store
      // owns display and timeout removal
      tree2Store.set(
        notificationsAtom,
        next.filter((n) => !added.includes(n)),
      )
      previous = tree2Store.get(notificationsAtom)
    }
  })
}
