import { useState, useEffect } from 'react'
import type { UIMatch } from 'react-router'

import { Fetcher } from './Fetcher.tsx'

// pass on TransitionGroup's props
export const FetcherImporter = ({
  match,
  ...other
}: {
  match: UIMatch
  [key: string]: unknown
}) => {
  const [fetcherModule, setFetcherModule] = useState<
    Record<string, (params: Record<string, string | undefined>) => unknown> | null
  >(null)

  const fetcherName = (match.handle as { bookmarkFetcherName?: string } | undefined)?.bookmarkFetcherName

  useEffect(() => {
    if (fetcherModule || !fetcherName) return

    // return the module, not the hook as that would already be called
    void import(`../../../modules/${fetcherName}.ts`).then((module) =>
      setFetcherModule(module as Record<string, (params: Record<string, string | undefined>) => unknown>),
    )
  }, [fetcherName, fetcherModule])

  if (!fetcherModule || !fetcherName) return null

  return (
    <Fetcher
      params={match.params}
      fetcherModule={fetcherModule[fetcherName] as (
        params: Record<string, string | undefined>,
      ) => import('../types.ts').NavData}
      {...other}
    />
  )
}
