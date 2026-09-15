import { Suspense } from 'react'
import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { useAssozartsNavData } from '../../../../modules/useAssozartsNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useAssozartsNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData as NavData}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.assozart}
      />
    </Suspense>
  )
}
