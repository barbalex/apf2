import { memo } from 'react'

import { Spinner } from '../../shared/Spinner.jsx'
import { Error } from '../../shared/Error.jsx'
import { Bookmark } from '../Bookmark/index.jsx'

export const Fetcher = memo(({ match, fetcherModule }) => {
  const fetcherName = match.handle?.bookmarkFetcherName

  const { navData, isLoading, error } = fetcherModule?.[fetcherName]()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <Bookmark
      key={navData.id}
      navData={navData}
    />
  )
})
