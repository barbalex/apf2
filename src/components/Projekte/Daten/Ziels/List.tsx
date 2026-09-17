import { Suspense } from 'react'
import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { useZielsOfJahrNavData } from '../../../../modules/useZielsOfJahrNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Menu } from './Menu.tsx'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useZielsOfJahrNavData()

  // the nav data hook keys folders by year, so its id is a number;
  // SharedList's NavData expects a string id
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
