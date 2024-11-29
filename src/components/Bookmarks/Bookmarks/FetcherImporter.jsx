import { memo, useState, useEffect } from 'react'

import { Fetcher } from './Fetcher.jsx'

export const FetcherImporter = memo(({ match }) => {
  const [fetcherModule, setFetcherModule] = useState(null)

  const fetcherName = match.handle?.bookmarkFetcherName

  console.log('HookImporter, fetcherName:', fetcherName)

  useEffect(() => {
    // return the module, not the hook as that would already be called
    import(`../../../modules/${fetcherName}.js`).then((module) => {
      setFetcherModule(module)
    })
  }, [fetcherName])

  if (!fetcherModule) return null

  return (
    <Fetcher
      match={match}
      fetcherModule={fetcherModule}
    />
  )
})
