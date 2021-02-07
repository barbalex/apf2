import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import apQuery from './apByIdJahr'
import apberQuery from './apberById'
import ApberForAp from '../ApberForAp'
import storeContext from '../../../storeContext'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Spinner from '../../shared/Spinner'

const ApberForApFromAp = ({ apberId: apberIdPassed, apId: apIdPassed }) => {
  const store = useContext(storeContext)
  const { apberIdInActiveNodeArray, apIdInActiveNodeArray } = store.tree
  let apberId
  if (apberIdPassed) {
    apberId = apberIdPassed
  } else {
    apberId = apberIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  }
  let apId
  if (apIdPassed) {
    apId = apIdPassed
  } else {
    apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  }

  const { data: apberData, error: apberDataError } = useQuery(apberQuery, {
    variables: {
      apberId,
    },
  })

  const jahr = apberData?.apberById?.jahr ?? 0

  const { data: apData, loading: apDataLoading, error: apDataError } = useQuery(
    apQuery,
    {
      variables: {
        apId,
        jahr,
      },
    },
  )

  if (apDataLoading) return <Spinner />
  if (apberDataError) return `Fehler: ${apberDataError.message}`
  if (apDataError) return `Fehler: ${apDataError.message}`

  return (
    <ErrorBoundary>
      <ApberForAp apId={apId} jahr={jahr} apData={apData} />
    </ErrorBoundary>
  )
}

export default observer(ApberForApFromAp)
