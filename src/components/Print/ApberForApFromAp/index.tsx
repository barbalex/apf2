import { apiFetch } from '../../../modules/api.ts'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { ApberForAp } from '../ApberForAp/index.tsx'
import type {
  ApberForApApNode,
  ApberForApJberAbcNode,
} from '../ApberForAp/types.ts'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { Spinner } from '../../shared/Spinner.tsx'

// result type of the apByIdJahr query (apByIdJahr.ts)
interface ApByIdJahrQueryResult {
  apById: ApberForApApNode | null
  jberAbcByApId: {
    nodes: ApberForApJberAbcNode[]
  } | null
}
export const Component = () => {
  const { apberId, apId } = useParams()

  const { data, error, isLoading } = useQuery({
    queryKey: ['apByIdJahrForApberForApFromAp', apberId, apId],
    queryFn: async () => {
      const rows = await apiFetch<{ id: string; jahr: number | null }[]>(
        `/apber?id=eq.${apberId}&select=id,jahr`,
      )
      const apberData = { apberById: rows?.[0] ?? null }
      const jahr = apberData?.apberById?.jahr
      if (!jahr) throw new Error('im AP-Bericht fehlt das Jahr')

      // phase 5: the deep history tree comes from one RPC
      const data = await apiFetch<ApByIdJahrQueryResult | null>(
        '/rpc/apber_for_ap_from_ap',
        {
          method: 'POST',
          body: JSON.stringify({ p_ap_id: apId, p_jahr: jahr }),
        },
      )
      return { data: data ?? undefined, jahr }
    },
  })

  const jahr = data?.jahr

  if (error) return `Fehler: ${error.message}`

  // without this the no-data message flashes while the tree loads
  if (isLoading) return <Spinner />

  return (
    <ErrorBoundary>
      <ApberForAp
        apId={apId}
        jahr={jahr}
        apData={data?.data}
        node={data?.data?.jberAbcByApId?.nodes?.[0]}
      />
    </ErrorBoundary>
  )
}
