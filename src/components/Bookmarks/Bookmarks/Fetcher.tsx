import { Suspense } from 'react'
import type { TransitionProps } from 'react-transition-group/Transition'

import type { NavData } from '../types.ts'

import { Spinner } from '../../shared/Spinner.tsx'
import { Bookmark } from '../Bookmark/index.tsx'

// pass on TransitionGroup's props as other
export const Fetcher = ({
  params,
  fetcherModule,
  ...other
}: {
  params: Record<string, string | undefined>
  fetcherModule: (params: Record<string, string | undefined>) => NavData
} & Omit<TransitionProps, 'children'>) => {
  // need to pass in params
  // If not: When navigating up the tree while transitioning out lower levels,
  // those bookmark components will not have their params anymore and error
  // there is a weird * param containing the pathname. Remove it
  const { ...paramsWithoutStar } = params
  delete paramsWithoutStar['*']

  const navData = fetcherModule(paramsWithoutStar) as NavData

  return (
    <Suspense fallback={<Spinner />}>
      <Bookmark
        key={`${navData.id}`}
        navData={navData}
        in={(other as { in?: boolean }).in ?? true}
      />
    </Suspense>
  )
}
