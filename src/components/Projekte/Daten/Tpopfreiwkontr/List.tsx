import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { useTpopfreiwkontrNavData } from '../../../../modules/useTpopfreiwkontrNavData.ts'

export const List = () => {
  const { navData } = useTpopfreiwkontrNavData()

  // BEWARE: Zählungen need to be hidden in this list
  const navDataToPass = {
    ...navData,
    menus: navData.menus.filter((m) => !m.hideInNavList),
  }

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
        menuBarProps={{ row: navData }}
      />
    </Suspense>
  )
}
