import { atom } from 'jotai'

import type { TreeNodeData } from '../Tree/types.ts'

// state of the open tree context menu; null when closed
export interface TreeContextMenuState {
  // increments per opening; used to remount the menu (resetting state)
  id: number
  node: TreeNodeData
  x: number
  y: number
}

// ms a left mouse button / touch has to be held down on a row to open the menu
export const holdToDisplayMs = 1000

let menuOpenCount = 0
export const nextMenuOpenId = () => ++menuOpenCount

export const treeContextMenuAtom = atom<TreeContextMenuState | null>(null)
