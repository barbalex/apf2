import { useAtomValue } from 'jotai'

import { useApbersNavData } from '../../../../modules/useApbersNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useApbersNavData()

  return (
    <SharedList
      navData={navData as NavData}
      MenuBarComponent={Menu}
      highlightSearchString={nodeLabelFilter.apber}
    />
  )
}
