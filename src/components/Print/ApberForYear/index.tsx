import { useEffect } from 'react'
import { apiFetch } from '../../../modules/api.ts'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useSetAtom } from 'jotai'

import { ApberForYear } from './ApberForYear.tsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { setIsPrintAtom } from '../../../store/index.ts'

// react-query v5 omitted suspense from the public useQuery options
// although it is still honored at runtime
type ApberuebersichtUseQueryOptions = UseQueryOptions<
  { apberuebersichtById: { id: string; jahr: number | null | undefined } },
  Error
> & {
  suspense: boolean
}

export const Component = () => {
  const { apberuebersichtId = '99999999-9999-9999-9999-999999999999' } =
    useParams()
  const setIsPrint = useSetAtom(setIsPrintAtom)

  // leaving the print route ends print mode: the print button navigates
  // away without resetting isPrint (resetting first would re-render the
  // report in screen mode before the route transition commits)
  useEffect(() => () => setIsPrint(false), [setIsPrint])

  const queryOptions: ApberuebersichtUseQueryOptions = {
    queryKey: ['apberuebersichtForApberForYear', apberuebersichtId],
    queryFn: async () => {
      const rows = await apiFetch<{ id: string; jahr: number | null }[]>(
        `/apberuebersicht?id=eq.${apberuebersichtId ?? ''}&select=id,jahr`,
      )
      return {
        apberuebersichtById: rows?.[0] ?? { id: apberuebersichtId, jahr: null },
      }
    },
    suspense: true,
  }

  const { data } = useQuery(queryOptions)
  const year = data?.apberuebersichtById?.jahr ?? undefined

  return (
    <ErrorBoundary>
      <ApberForYear
        jahr={year}
        apberuebersichtId={apberuebersichtId}
      />
    </ErrorBoundary>
  )
}
