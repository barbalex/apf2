import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { useTpopbersNavData } from '../../../../modules/useTpopbersNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useTpopbersNavData()

  return (
    <SharedList
      navData={navData as NavData}
      MenuBarComponent={Menu}
      highlightSearchString={nodeLabelFilter.tpopber}
    />
  )
}
