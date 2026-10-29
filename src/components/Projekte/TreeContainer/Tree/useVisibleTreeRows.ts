import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import {
  treeActiveNodeArrayAtom,
  treeOpenNodesAtom,
} from '../../../../store/index.ts'
import { isNodeOrParentInActiveNodePath } from '../isNodeOrParentInActiveNodePath.ts'
import { checkIfIsOpen } from './checkIfIsOpen.ts'
import { nodeFromMenu } from './nodeFromMenu.ts'
import { treeChildrenMenusAtom, treeRootMenusAtom } from './virtualTreeAtoms.ts'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.ts'
import type { TreeNodeData, TreeMenu } from './types.ts'

export interface TreeRowData {
  // stable key: menus rendered as rows always provide treeUrl
  key: string
  menu: TreeMenu
  node: TreeNodeData
}

/**
 * Flattens the visible tree into a row array for the virtualizer.
 *
 * Mirrors the rules of the former recursive tree:
 * - root menus in registration order
 * - children of open folders come from the children registry
 *   (filled by ChildLoader) or, for childrenAreFolders menus,
 *   from the inline menus (filtered by component, like Folders did)
 * - onlyShowActivePath prunes rows not in the active path (like Row did)
 */
export const useVisibleTreeRows = () => {
  const rootMenus = useAtomValue(treeRootMenusAtom)
  const childrenMenus = useAtomValue(treeChildrenMenusAtom)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const [onlyShowActivePathString] = useSearchParamsState<string>(
    'onlyShowActivePath',
    'false',
  )
  const onlyShowActivePath = onlyShowActivePathString === 'true'

  const rows = useMemo(() => {
    const rows: TreeRowData[] = []

    const visit = (menu: TreeMenu) => {
      // menus rendered as rows always provide treeUrl
      if (!menu.treeUrl) return
      const treeUrl = menu.treeUrl as (string | number)[]

      if (onlyShowActivePath) {
        const inPath = isNodeOrParentInActiveNodePath({
          node: { url: treeUrl, urlLabel: menu.id },
          activeNodeArray,
        })
        if (!inPath) return
      }

      const key = JSON.stringify(treeUrl)
      rows.push({ key, menu, node: nodeFromMenu(menu) })

      const isOpen = checkIfIsOpen({ menu, openNodes })
      if (!isOpen) return

      let children: TreeMenu[] | undefined
      if (menu.childrenAreFolders) {
        // like Folders: only menus with a component were rendered
        children = (menu.menus ?? []).filter((m) => !!m.component)
      } else if (menu.fetcherName) {
        children = childrenMenus.get(key)
      }
      for (const child of children ?? []) visit(child)
    }

    for (const root of rootMenus.values()) visit(root)

    return rows
  }, [rootMenus, childrenMenus, openNodes, activeNodeArray, onlyShowActivePath])

  return rows
}
