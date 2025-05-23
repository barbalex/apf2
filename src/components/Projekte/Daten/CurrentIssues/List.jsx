import { memo } from 'react'

import { useCurrentissuesNavData } from '../../../../modules/useCurrentissuesNavData.js'
import { List as SharedList } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const List = memo(() => {
  const { navData, isLoading, error } = useCurrentissuesNavData()
  const currentissues = navData?.data?.allCurrentissues?.nodes ?? []
  const totalCount = navData?.data?.allCurrentissues?.totalCount ?? 0

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return <SharedList navData={navData} />
})
