import { useEffect, useState } from 'react'

import { Spinner } from '../../shared/Spinner.jsx'
import { Error } from '../../shared/Error.jsx'
import { Bookmark } from '../Bookmark/index.jsx'

// pass on TransitionGroup's props as other
export const Fetcher = ({ match, fetcherModule, ...other }) => {
  // need to pass in params
  // If not: When navigating up the tree while transitioning out lower levels,
  // those bookmark components will not have their params anymore and error
  const params = { ...match.params }
  // there is a weird * param containing the pathname. Remove it
  delete params['*']

  console.log('Fetcher render 1', {
    fetcherName: match.handle?.bookmarkFetcherName,
    fetcherModule,
    params,
  })

  const { navData, isLoading, error } = fetcherModule(params)

  console.log('Fetcher render 2', {
    fetcherName: match.handle?.bookmarkFetcherName,
    navData,
    isLoading,
    error,
  })

  if (error) return <Error error={error} />

  // somehow isLoading is way too often true
  // so only show spinner if no navData yet
  if (!navData) return <Spinner />

  return (
    <Bookmark
      key={`${navData.id}`}
      navData={navData}
      {...other}
    />
  )
}
