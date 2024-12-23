import { memo, useState, useEffect } from 'react'

import { Fetcher } from './Fetcher.jsx'

export const NodesList = memo(({ menu, in: inProp }) => {
  const { fetcherName, fetcherParams } = menu

  const [fetcherModule, setFetcherModule] = useState(null)

  useEffect(() => {
    // return the module, not the hook as that would already be called
    import(`../../../../../modules/${fetcherName}.js`).then((module) => {
      setFetcherModule(module)
    })
  }, [fetcherName])

  if (!fetcherModule) return null

  return (
    <Fetcher
      menu={menu}
      fetcherModule={fetcherModule}
      inProp={inProp}
    />
  )
})
