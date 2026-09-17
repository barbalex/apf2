import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { useTpopfreiwkontrNavData } from '../../../../modules/useTpopfreiwkontrNavData.ts'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const navData = useTpopfreiwkontrNavData()

  // BEWARE: Zählungen need to be hidden in this list

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        // the nav data hook is not typed compatible with NavData
        navData={navData as NavData}
        MenuBarComponent={Menu}
        menuBarProps={{ row: navData }}
      />
    </Suspense>
  )
}
