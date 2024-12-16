import { memo } from 'react'

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
  return (
    <SharedList
      items={navData.menus.filter((m) => !m.hideInNavList)}
      title={navData.label}
      menuBar={<Menu row={navData} />}
    />
  )
})
