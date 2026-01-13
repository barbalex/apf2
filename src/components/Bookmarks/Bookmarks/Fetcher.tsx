import { Suspense } from 'react'

import { Spinner } from '../../shared/Spinner.jsx'
import { Error } from '../../shared/Error.jsx'
import { Bookmark } from '../Bookmark/index.tsx'

// pass on TransitionGroup's props as other
export const Fetcher = ({ params, fetcherModule, ...other }) => {
  // need to pass in params
  // If not: When navigating up the tree while transitioning out lower levels,
  // those bookmark components will not have their params anymore and error
  // there is a weird * param containing the pathname. Remove it
  delete params['*']

  const { navData, error } = fetcherModule(params)

  if (error) return <Error error={error} />

  return (
    <Suspense fallback={<Spinner />}>
      <Bookmark
        key={`${navData.id}`}
        navData={navData}
        {...other}
      />
    </Suspense>
  )
}
