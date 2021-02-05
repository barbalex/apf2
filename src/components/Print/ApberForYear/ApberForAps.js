import React, { useContext } from 'react'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import query2 from './query2'
import ApberForAp from '../ApberForAp'
import queryMengen from './queryMengen'
import storeContext from '../../../storeContext'
import ErrorBoundary from '../../shared/ErrorBoundary'

const ApberForYear = ({ jahr }) => {
  const store = useContext(storeContext)
  const {
    apberuebersichtIdInActiveNodeArray,
    projIdInActiveNodeArray,
  } = store.tree

  const apberuebersichtId =
    apberuebersichtIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const projektId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const { data: data2, error: data2Error } = useQuery(query2, {
    variables: {
      projektId,
      jahr,
      apberuebersichtId,
    },
  })

  const aps = sortBy(
    get(data2, 'allAps.nodes', []).filter(
      (ap) => get(ap, 'apbersByApId.totalCount', 0) > 0,
    ),
    (ap) => get(ap, 'aeTaxonomyByArtId.artname'),
  )

  const {
    data: mengenData,
    loading: mengenLoading,
    error: mengenError,
  } = useQuery(queryMengen, {
    variables: { jahr },
  })

  if (data2Error) {
    return `Fehler: ${data2Error.message}`
  }
  if (mengenError) {
    return `Fehler: ${mengenError.message}`
  }

  if (!mengenData?.jberAbc?.nodes?.length) return null

  return (
    <ErrorBoundary>
      {mengenData.jberAbc.nodes.map((node, index) => (
        <ApberForAp
          key={node.apId}
          apId={node.apId}
          jahr={jahr}
          apData={aps.find((ap) => ap.id === node.apId)}
          mengenLoading={mengenLoading}
          node={node}
          isSubReport={true}
          subReportIndex={index}
        />
      ))}
    </ErrorBoundary>
  )
}

export default observer(ApberForYear)
