import { ApberForAp } from '../ApberForAp/index.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

export const ApberForAps = ({ jahr, data, jberData }) => {
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
