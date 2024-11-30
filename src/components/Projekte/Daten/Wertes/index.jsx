import { memo } from 'react'

import { List } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useWertesNavData } from '../../../../modules/useWertesNavData.js'

export const Component = memo(() => {
  const { navData, isLoading, error } = useWertesNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <List
      items={navData?.menus}
      title={navData?.label}
    />
  )
})
