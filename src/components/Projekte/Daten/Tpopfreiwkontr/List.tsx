import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Error } from '../../../shared/Error.tsx'
import { useTpopfreiwkontrNavData } from '../../../../modules/useTpopfreiwkontrNavData.ts'

export const List = () => {
  const { navData, error } = useTpopfreiwkontrNavData()

  // BEWARE: Zählungen need to be hidden in this list
  const navDataToPass = {
    ...navData,
    menus: navData.menus.filter((m) => !m.hideInNavList),
  }

  if (error) return <Error error={error} />

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
