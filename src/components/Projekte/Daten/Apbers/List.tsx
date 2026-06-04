import { Suspense } from 'react'
import { useAtomValue } from 'jotai'

import { useApbersNavData } from '../../../../modules/useApbersNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import {
  isDesktopViewAtom,
  treeNodeLabelFilterAtom,
} from '../../../../store/index.ts'

export const List = () => {
  const isDesktopView = useAtomValue(isDesktopViewAtom)

  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useApbersNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.apber}
      />
    </Suspense>
  )
}
