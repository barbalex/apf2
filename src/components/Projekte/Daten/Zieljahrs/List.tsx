import { Suspense } from 'react'
import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { useZieljahrsNavData } from '../../../../modules/useZieljahrsNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Menu } from './Menu.tsx'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useZieljahrsNavData()

  // the nav data hook keys the year folders by numeric jahr;
  // SharedList's NavData expects string ids
  const navDataForList = navData as unknown as NavData

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navDataForList}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.ziel}
      />
    </Suspense>
  )
}
