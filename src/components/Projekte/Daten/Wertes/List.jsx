import { memo } from 'react'

import { List as SharedList } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useWertesNavData } from '../../../../modules/useWertesNavData.js'

export const List = memo(() => {
  const { navData, isLoading, error } = useWertesNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return <SharedList navData={navData} />
})
