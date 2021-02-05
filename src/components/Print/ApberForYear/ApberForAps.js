import React from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import ApberForAp from '../ApberForAp'
import queryMengen from './queryMengen'
import ErrorBoundary from '../../shared/ErrorBoundary'

const ApberForYear = ({ jahr, data: dataPassed }) => {
  const aps = (dataPassed?.allAps?.nodes ?? []).filter(
    (ap) => (ap?.apbersByApId?.totalCount ?? 0) > 0,
  )

  const { data, loading, error } = useQuery(queryMengen, {
    variables: { jahr },
  })
  const nodes = data?.jberAbc?.nodes ?? []

  //console.log('ApberForAps', { loading, data, nodes })
  console.log('ApberForAps', { aps })

  if (error) {
    return `Fehler: ${error.message}`
  }

  return (
    <ErrorBoundary>
      {nodes.map((node, index) => (
        <ApberForAp
          key={node.id}
          apId={node.id}
          jahr={jahr}
          apData={aps.find((ap) => ap.id === node.id)}
          mengenLoading={loading}
          node={node}
          isSubReport={true}
          subReportIndex={index}
        />
      ))}
    </ErrorBoundary>
  )
}

export default observer(ApberForYear)
