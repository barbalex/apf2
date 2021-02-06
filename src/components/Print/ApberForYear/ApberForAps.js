import React from 'react'
import { observer } from 'mobx-react-lite'

import ApberForAp from '../ApberForAp'
import ErrorBoundary from '../../shared/ErrorBoundary'

const ApberForYear = ({ jahr, data }) => {
  const aps = (data?.allAps?.nodes ?? []).filter(
    (ap) => (ap?.apbersByApId?.totalCount ?? 0) > 0,
  )

  const nodes = data?.jberAbc?.nodes ?? []

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

export default observer(ApberForYear)
