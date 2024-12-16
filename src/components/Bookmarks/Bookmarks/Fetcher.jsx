import { memo, useEffect, useState } from 'react'

import { Spinner } from '../../shared/Spinner.jsx'
import { Error } from '../../shared/Error.jsx'
import { Bookmark } from '../Bookmark/index.jsx'

// pass on TransitionGroup's props
export const Fetcher = memo(({ match, fetcherModule, ...other }) => {
  const fetcherName = match.handle?.bookmarkFetcherName

  // need to pass in params
  // If not: When navigating up the tree while transitioning out lower levels,
  // those bookmark components will not have their params anymore and error
  const params = { ...match.params }
  // there is a weird * param containing the pathname. Remove it
  delete params['*']

  const {
    navData,
    isLoading,
    error,
    rerenderer: fetcherRerenderer,
  } = fetcherModule?.[fetcherName](params)
  const [rerenderer, setRerenderer] = useState(0)
  useEffect(() => {
    setRerenderer((prev) => prev + 1)
  }, [fetcherRerenderer])

  console.log('Bookmarks.Fetcher, rerenderer:', rerenderer)

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <Bookmark
      key={`${navData.id}/${fetcherRerenderer}`}
      navData={navData}
      {...other}
    />
  )
})
