import { useAtomValue } from 'jotai'

import { ChildLoader } from './ChildLoader.tsx'
import { treeChildrenMenusAtom } from './virtualTreeAtoms.ts'
import type { TreeRowData } from './useVisibleTreeRows.ts'

/**
 * The virtualized tree only loads children of folders whose row is inside
 * the visible window (via ChildLoader). When navigating to a deep node,
 * the rows along its path may never load - the scroll target would not
 * exist and scroll-into-view deadlocks.
 *
 * This component breaks the deadlock: it loads children for the deepest
 * ancestor of the focus target whose row already exists but whose children
 * are not registered yet - level by level, until the target row exists.
 */
export const FocusPathLoader = ({
  rows,
  focusKey,
}: {
  rows: TreeRowData[]
  focusKey: string | null | undefined
}) => {
  const childrenMenus = useAtomValue(treeChildrenMenusAtom)

  if (!focusKey) return null

  let targetUrl: (string | number)[]
  try {
    targetUrl = JSON.parse(focusKey) as (string | number)[]
  } catch {
    return null
  }

  // find the deepest existing row that is an ancestor of the focus target
  // and whose children still need loading
  let menuToLoad: TreeRowData | undefined
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i]
    if (!row) continue
    const rowUrl = row.node.url
    if (rowUrl.length >= targetUrl.length) continue
    if (JSON.stringify(rowUrl) !== JSON.stringify(targetUrl.slice(0, rowUrl.length)))
      continue
    // row is an ancestor of the target
    if (
      row.menu.fetcherName &&
      !row.menu.childrenAreFolders &&
      !childrenMenus.has(row.key)
    ) {
      menuToLoad = row
    }
    break
  }

  if (!menuToLoad) return null

  // key by row: when the loading frontier advances, a new fetcher hook
  // must run in a fresh component instance, not the previous one
  return <ChildLoader
    key={menuToLoad.key}
    menu={menuToLoad.menu}
  />
}
