import type { ComponentType } from 'react'

/**
 * menu/navData object as built by the use*NavData modules.
 * Most fields are optional: the modules only set the fields
 * relevant for the respective menu type.
 */
export interface TreeMenu {
  id?: string | null | undefined
  label?: string | null | undefined
  url?: string | undefined
  treeNodeType?: string | undefined
  treeMenuType?: string | undefined
  treeId?: string | null | undefined
  treeTableId?: string | null | undefined
  treeParentTableId?: string | null | undefined
  treeUrl?: ((string | number) | undefined)[] | undefined
  treeSingleElementName?: string | undefined
  hasChildren?: boolean | undefined
  alwaysOpen?: boolean | undefined
  childrenAreFolders?: boolean | undefined
  fetcherName?: string | undefined
  fetcherParams?: Record<string, unknown> | undefined
  component?: ComponentType<{ menu: TreeMenu }> | undefined
  menus?: TreeMenu[] | undefined
  isSelf?: boolean | undefined
  labelLeftElements?: ComponentType[] | undefined
  labelRightElements?: ComponentType[] | undefined
  jahr?: number | undefined
  status?: number | undefined
  hideInNavList?: boolean | undefined
  passTransitionStateToChildren?: boolean | undefined
}

/**
 * node of a tree row, as built by nodeFromMenu.
 * Fields needed non-optional by Row (label, url, menuType) are typed
 * accordingly: menus rendered as rows always provide them.
 */
export interface TreeNodeData {
  nodeType: string | undefined
  menuType: string
  id: string | null | undefined
  parentTableId: string | null | undefined
  urlLabel: string | null | undefined
  label: string
  labelLeftElements: ComponentType[] | undefined
  labelRightElements: ComponentType[] | undefined
  url: (string | number)[]
  singleElementName: string | undefined
  hasChildren: boolean | undefined
  alwaysOpen: boolean | undefined
  jahr: number | undefined
  status: number | undefined
  hideInNavList: boolean | undefined
  childrenAreFolders: boolean | undefined
  // Row reads the following fields although nodeFromMenu does not set them,
  // so they are always undefined at runtime
  tableId?: string | number | undefined
  treeParentTableId?: string | number | undefined
  parentId?: string | number | undefined
}

/**
 * module dynamically imported by NodesList, providing the
 * use*NavData hook named like the module file
 */
export type FetcherModule = Record<
  string,
  ((params?: Record<string, unknown>) => TreeMenu) | undefined
>
