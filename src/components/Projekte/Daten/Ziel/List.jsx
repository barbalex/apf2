import { memo } from 'react'

import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useZielNavData } from '../../../../modules/useZielNavData.js'

export const List = memo(() => {
  const { navData, isLoading, error } = useZielNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <SharedList
      items={navData.menus}
      title={navData.label}
      menuBar={<Menu />}
    />
  )
})