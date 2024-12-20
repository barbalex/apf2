import { memo } from 'react'

import { List as SharedList } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useIdealbiotopNavData } from '../../../../modules/useIdealbiotopNavData.js'

export const List = memo(() => {
  const { navData, isLoading, error } = useIdealbiotopNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return <SharedList navData={navData} />
})
