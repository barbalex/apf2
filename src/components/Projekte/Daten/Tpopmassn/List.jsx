import { memo } from 'react'

import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useTpopmassnNavData } from '../../../../modules/useTpopmassnNavData.js'

export const List = memo(() => {
  const { navData, isLoading, error } = useTpopmassnNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <SharedList
      navData={navData}
      MenuBarComponent={Menu}
      menuBarProps={{ row: navData }}
    />
  )
})
