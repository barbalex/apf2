import { isEqual } from 'es-toolkit'
import { atom } from 'jotai'

import type { TreeMenu } from './types.ts'

/**
 * Registries for the virtualized tree.
 *
 * The visible rows are built by walking these maps (see useVisibleTreeRows).
 * Each open folder's menus are registered by the ChildLoader component that
 * runs the folder's own use*NavData fetcher - the same per-node data flow the
 * recursive tree used. Registrations survive the loader unmounting (when its
 * row leaves the virtualized window) so rows don't disappear while scrolling.
 */

// children of open folders, keyed by JSON.stringify(menu.treeUrl)
export const treeChildrenMenusAtom = atom<Map<string, TreeMenu[]>>(new Map())

export const setTreeChildrenMenusAtom = atom(
  () => null,
  (get, set, { key, menus }: { key: string; menus: TreeMenu[] }) => {
    const prev = get(treeChildrenMenusAtom)
    if (isEqual(prev.get(key), menus)) return
    const next = new Map(prev)
    next.set(key, menus)
    set(treeChildrenMenusAtom, next)
  },
)

// the root menus (Projekte, Benutzer, Werte-Listen, Mitteilungen, Aktuelle Fehler),
// keyed by a stable slot name. Map order = display order.
export const treeRootMenusAtom = atom<Map<string, TreeMenu>>(new Map())

export const setTreeRootMenusAtom = atom(
  () => null,
  (get, set, { key, menu }: { key: string; menu: TreeMenu }) => {
    const prev = get(treeRootMenusAtom)
    if (isEqual(prev.get(key), menu)) return
    const next = new Map(prev)
    next.set(key, menu)
    set(treeRootMenusAtom, next)
  },
)
