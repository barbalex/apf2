import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../store/index.ts'
import { useDocsNavData } from '../../modules/useDocsNavData.ts'
import { List as SharedList } from '../shared/List/index.tsx'
import { Menu } from './Menu.tsx'

export const MobileList = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useDocsNavData()

  return (
    <SharedList
      navData={navData}
      MenuBarComponent={Menu}
      highlightSearchString={nodeLabelFilter.doc}
    />
  )
}
