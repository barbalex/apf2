import { useState, useEffect, Suspense } from 'react'

import { Fetcher } from './Fetcher.jsx'
import { Spinner } from '../../shared/Spinner.jsx'

// pass on TransitionGroup's props
export const FetcherImporter = ({ match, ...other }) => {
  const [fetcherModule, setFetcherModule] = useState(null)

  const fetcherName = match.handle?.bookmarkFetcherName

  useEffect(() => {
    if (fetcherModule || !fetcherName) return

    // return the module, not the hook as that would already be called
    import(`../../../modules/${fetcherName}.js`).then((module) =>
      setFetcherModule(module),
    )
  }, [fetcherName, fetcherModule])

  if (!fetcherModule || !fetcherName) {
    return null
    // return <Spinner />
  }

  return (
    <Fetcher
      params={match.params}
      fetcherModule={fetcherModule[fetcherName]}
      {...other}
    />
  )
}
