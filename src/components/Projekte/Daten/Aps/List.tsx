import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { useApsNavData } from '../../../../modules/useApsNavData.ts'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  // menus contain more properties than shared List needs
  const navData = useApsNavData() as NavData

  return (
    <SharedList
      navData={navData}
      MenuBarComponent={Menu}
      highlightSearchString={nodeLabelFilter.ap}
    />
  )
}
