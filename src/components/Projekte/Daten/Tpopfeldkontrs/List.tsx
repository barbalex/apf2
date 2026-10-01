import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { useTpopfeldkontrsNavData } from '../../../../modules/useTpopfeldkontrsNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useTpopfeldkontrsNavData()

  return (
    <SharedList
      navData={navData as NavData}
      MenuBarComponent={Menu}
      highlightSearchString={nodeLabelFilter.tpopkontr}
    />
  )
}
