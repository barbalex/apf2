import { memo } from 'react'
import { useParams } from 'react-router'

import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useApNavData } from '../../../../modules/useApNavData.js'

export const List = memo(() => {
  const params = useParams()
  const { navData, isLoading, error } = useApNavData(params)

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <SharedList
      navData={navData}
      MenuBarComponent={Menu}
    />
  )
})
