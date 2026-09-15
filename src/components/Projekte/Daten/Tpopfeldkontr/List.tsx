import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { useTpopfeldkontrNavData } from '../../../../modules/useTpopfeldkontrNavData.ts'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const navData = useTpopfeldkontrNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData as NavData}
        MenuBarComponent={Menu}
        menuBarProps={{ row: navData }}
      />
    </Suspense>
  )
}
