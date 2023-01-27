import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import apQuery from './apByIdJahr'
import apberQuery from './apberById'
import ApberForAp from '../ApberForAp'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Spinner from '../../shared/Spinner'

const ApberForApFromAp = () => {
  const { apberId, apId } = useParams()

  const { data: apberData, error: apberDataError } = useQuery(apberQuery, {
    variables: {
      apberId,
      apId,
    },
  })

  const jahr = apberData?.apberById?.jahr ?? 0

  const {
    data: apData,
    loading: apDataLoading,
    error: apDataError,
  } = useQuery(apQuery, {
    variables: {
      apId,
      jahr,
    },
  })

  if (apDataLoading) return <Spinner />
  if (apberDataError) return `Fehler: ${apberDataError.message}`
  if (apDataError) return `Fehler: ${apDataError.message}`

  return (
    <ErrorBoundary>
      <ApberForAp
        apId={apId}
        jahr={jahr}
        apData={apData}
        node={apData?.jberAbcByApId?.nodes?.[0]}
      />
    </ErrorBoundary>
  )
}

export default observer(ApberForApFromAp)
