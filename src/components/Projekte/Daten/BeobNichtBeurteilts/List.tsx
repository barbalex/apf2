import { Suspense } from 'react'
import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { useBeobNichtBeurteiltsNavData } from '../../../../modules/useBeobNichtBeurteiltsNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

import type { NavData } from '../../../Bookmarks/types.ts'

const menuBarProps = { apfloraLayer: 'beobNichtBeurteilt' }

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useBeobNichtBeurteiltsNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        // navData comes from the untyped useBeobNichtBeurteiltsNavData hook
        navData={navData as NavData}
        MenuBarComponent={Menu}
        menuBarProps={menuBarProps}
        highlightSearchString={nodeLabelFilter.beob}
      />
    </Suspense>
  )
}
