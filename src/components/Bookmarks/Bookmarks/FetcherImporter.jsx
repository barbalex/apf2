import { memo, useState, useEffect } from 'react'

import { Fetcher } from './Fetcher.jsx'
import { Spinner } from '../../shared/Spinner.jsx'

// pass on TransitionGroup's props
export const FetcherImporter = memo(({ match, ...other }) => {
  const [fetcherModule, setFetcherModule] = useState(null)

  const fetcherName = match.handle?.bookmarkFetcherName

  useEffect(() => {
    // console.log('FetcherImporter.useEffect', { fetcherName, fetcherModule })
    if (fetcherModule || !fetcherName) return

    // return the module, not the hook as that would already be called
    import(`../../../modules/${fetcherName}.js`).then((module) =>
      setFetcherModule(module),
    )
  }, [fetcherName, fetcherModule])

  // console.log('FetcherImporter render 1', {
  //   fetcherName,
  //   fetcherModule,
  //   params: match.params,
  // })

  if (!fetcherModule || !fetcherName) {
    // console.log('no fetcherModule yet for', fetcherName)
    // return null
    return <Spinner />
  }

  // console.log('FetcherImporter render 2', { fetcherName, fetcherModule })

  return (
    <Fetcher
      match={match}
      fetcherModule={fetcherModule[fetcherName]}
      {...other}
    />
  )
})
