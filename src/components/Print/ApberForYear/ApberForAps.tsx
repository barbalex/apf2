import { ApberForAp } from '../ApberForAp/index.tsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'

import type {
  ApberForYearQueryResult,
  JberQueryResult,
} from './types.ts'

interface ApberForApsProps {
  jahr?: number | undefined
  data?: ApberForYearQueryResult | undefined
  jberData?: JberQueryResult | undefined
}

export const ApberForAps = ({ jahr, data, jberData }: ApberForApsProps) => {
  const aps = (data?.allAps?.nodes ?? []).filter(
    (ap) => (ap?.apbersByApId?.totalCount ?? 0) > 0,
  )

  const nodes = jberData?.jberAbc?.nodes ?? []

  return (
    <ErrorBoundary>
      {nodes.map((node, index) => (
        <ApberForAp
          key={node.id}
          apId={node.id}
          jahr={jahr}
          apData={aps.find((ap) => ap.id === node.id)}
          node={node}
          isSubReport={true}
          subReportIndex={index}
        />
      ))}
    </ErrorBoundary>
  )
}
