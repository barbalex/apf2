import { Suspense } from 'react'
import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { useBeobNichtZuzuordnensNavData } from '../../../../modules/useBeobNichtZuzuordnensNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from '../BeobNichtBeurteilts/Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

import type { NavData } from '../../../Bookmarks/types.ts'

const menuBarProps = { apfloraLayer: 'beobNichtZuzuordnen' }

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useBeobNichtZuzuordnensNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        // navData comes from the untyped useBeobNichtZuzuordnensNavData hook
        navData={navData as NavData}
        MenuBarComponent={Menu}
        menuBarProps={menuBarProps}
        highlightSearchString={nodeLabelFilter.beob}
      />
    </Suspense>
  )
}
