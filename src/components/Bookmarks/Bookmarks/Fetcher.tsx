import { Suspense } from 'react'

import { Spinner } from '../../shared/Spinner.tsx'
import { Bookmark } from '../Bookmark/index.tsx'

// pass on TransitionGroup's props as other
export const Fetcher = ({ params, fetcherModule, ...other }) => {
  // need to pass in params
  // If not: When navigating up the tree while transitioning out lower levels,
  // those bookmark components will not have their params anymore and error
  // there is a weird * param containing the pathname. Remove it
  delete params['*']

  const navData = fetcherModule(params)

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
