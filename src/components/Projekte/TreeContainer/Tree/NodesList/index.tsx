import { useState, useEffect, Suspense } from 'react'
import type { TransitionStatus } from 'react-transition-group'

import { Fetcher } from './Fetcher.tsx'
import type { TreeMenu, FetcherModule } from '../types.ts'

interface NodesListProps {
  menu: TreeMenu
  in?: boolean | undefined
  parentTransitionState?: TransitionStatus | undefined
}

export const NodesList = ({
  menu,
  in: inProp,
  parentTransitionState,
}: NodesListProps) => {
  const { fetcherName } = menu

  const [fetcherModule, setFetcherModule] = useState<FetcherModule | null>(
    null,
  )

  useEffect(() => {
    // return the module, not the hook as that would already be called
    void import(`../../../../../modules/${fetcherName}.ts`).then(
      (module: FetcherModule) => {
        setFetcherModule(module)
      },
    )
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
    <Suspense fallback={null}>
      <Fetcher
        menu={menu}
        fetcherModule={fetcherModule}
        inProp={inProp}
        parentTransitionState={parentTransitionState}
      />
    </Suspense>
  )
}
