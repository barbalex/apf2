import { Suspense } from 'react'
import { useAtomValue } from 'jotai'

import { treeNodeLabelFilterAtom } from '../../../../store/index.ts'
import { useEkfrequenzsNavData } from '../../../../modules/useEkfrequenzsNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const navData = useEkfrequenzsNavData()

  // the nav data hook returns a wider shape than SharedList's NavData:
  // menus can be undefined and their ids/labels nullable
  const navDataForList = {
    ...navData,
    menus: navData.menus ?? [],
  } as NavData

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navDataForList}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.ekfrequenz}
      />
    </Suspense>
  )
}
