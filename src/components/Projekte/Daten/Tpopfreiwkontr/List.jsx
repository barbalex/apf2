import { memo, useMemo } from 'react'

import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useTpopfreiwkontrNavData } from '../../../../modules/useTpopfreiwkontrNavData.js'

export const List = memo(() => {
  const { navData, isLoading, error } = useTpopfreiwkontrNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  // BEWARE: Zählungen need to be hidden in this list
  const navDataToPass = useMemo(
    () => ({
      ...navData,
      menus: navData.menus.filter((m) => !m.hideInNavList),
    }),
    [navData],
  )

  return (
    <SharedList
      navData={navData}
      MenuBarComponent={Menu}
      menuBarProps={{ row: navData }}
    />
  )
})
