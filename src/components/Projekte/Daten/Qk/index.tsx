import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import Alert from '@mui/material/Alert'
import { apiFetch } from '../../../../modules/api.ts'

import { Qk } from './Qk/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type {
  ApId,
  QkName,
  ApqkQkName,
} from '../../../../models/apflora/index.ts'

interface QkNode {
  name: QkName
  titel: string | null
  beschreibung: string | null
  sort: number | null
}

interface ApqkNode {
  apId: ApId
  qkName: ApqkQkName
}

interface QkQueryResult {
  allQks?: {
    totalCount: number
    nodes: QkNode[]
  }
  allApqks?: {
    totalCount: number
    nodes: ApqkNode[]
  }
}

export const Component = () => {
  const { apId } = useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['qk', apId],
    queryFn: async () => {
      const [qks, apqks] = await Promise.all([
        apiFetch<
          {
            name: string
            titel: string | null
            beschreibung: string | null
            sort: number | null
          }[]
        >(`/qk?select=name,titel,beschreibung,sort&order=sort.asc,name.asc`),
        apiFetch<{ ap_id: string; qk_name: string }[]>(
          `/apqk?ap_id=eq.${apId}&select=ap_id,qkName:qk_name`,
        ),
      ])
      return {
        allQks: { nodes: qks ?? [], totalCount: (qks ?? []).length },
        allApqks: { nodes: apqks ?? [] },
      } as unknown as QkQueryResult
    },
    // no suspense as else the node will not turn red on click, only after QK's were queried
  })
  /**
   * DO NOT get allQks.nodes.apqksByQkName.totalCount
   * AS THIS IS NEVER UPDATED
   */
  const allQks = data?.allQks?.nodes ?? []
  const qks = allQks.filter(
    (qk) =>
      !!(data?.allApqks?.nodes ?? [])?.find((no) => no?.qkName === qk.name),
  )
  const qkNameQueries = Object.fromEntries(
    allQks.map((n) => [
      n.name,
      !!(data?.allApqks?.nodes ?? [])?.find((no) => no?.qkName === n.name),
    ]),
  )

  const qkCount = data?.allQks?.totalCount

  if (isLoading) {
    return <div>Lade Daten...</div>
  }

  // a failed check-list query must never read as "nothing to complain
  // about" (#836)
  if (error) {
    return (
      <ErrorBoundary>
        <Alert severity="error">{`Die Qualitätskontrollen konnten nicht geladen werden: ${error.message}. Bitte melden Sie diesen Fehler.`}</Alert>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <Qk
        key={qkCount}
        qkNameQueries={qkNameQueries ?? {}}
        qks={qks}
      />
    </ErrorBoundary>
  )
}
