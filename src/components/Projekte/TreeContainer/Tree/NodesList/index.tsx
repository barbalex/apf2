import { useState, useEffect } from 'react'

import { Fetcher } from './Fetcher.tsx'

export const NodesList = ({ menu, in: inProp, parentTransitionState }) => {
  const { fetcherName, fetcherParams } = menu

  const [fetcherModule, setFetcherModule] = useState(null)

  useEffect(() => {
    // return the module, not the hook as that would already be called
    import(`../../../../../modules/${fetcherName}.ts`).then((module) => {
      setFetcherModule(module)
    })
  }, [fetcherName])

  // console.log('NodesList', {
  //   fetcherModule,
  //   menu,
  //   inProp,
  //   fetcherName,
  //   fetcherParams,
  // })

  if (!fetcherModule) return null

  return (
    <Fetcher
      menu={menu}
      fetcherModule={fetcherModule}
      inProp={inProp}
      parentTransitionState={parentTransitionState}
    />
  )
}
