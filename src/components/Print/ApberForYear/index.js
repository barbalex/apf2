import React, { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import { gql } from '@apollo/client'

import ApberForYear from './ApberForYear'
import storeContext from '../../../storeContext'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Spinner from '../../shared/Spinner'

const ApberForYearContainer = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { printingJberYear } = store
  const { apberuebersichtIdInActiveNodeArray } = store.tree

  const apberuebersichtId =
    apberuebersichtIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'

  const [year, setYear] = useState(printingJberYear)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setYear(printingJberYear)
  }, [printingJberYear])
  useEffect(() => {
    if (printingJberYear) return

    setLoading(true)

    const run = async () => {
      let result
      try {
        result = await client.query({
          query: gql`
            query apberuebersichtByIdForApberForYear(
              $apberuebersichtId: UUID!
            ) {
              apberuebersichtById(id: $apberuebersichtId) {
                id
                jahr
                bemerkungen
              }
            }
          `,
          variables: {
            apberuebersichtId,
          },
        })
      } catch (error) {
        setError(error)
      }
      /*console.log('ApberForYear, useEffect setting year:', {
        year: result?.data?.apberuebersichtById?.jahr,
        result,
        apberuebersichtId,
      })*/
      setYear(result?.apberuebersichtById?.jahr)
      setLoading(false)
    }

    run()
  }, [
    apberuebersichtId,
    apberuebersichtIdInActiveNodeArray,
    client,
    printingJberYear,
  ])

  if (error) {
    return `Fehler: ${error.message}`
  }

  // DANGER: without rerendering when loading mutates from true to false
  // data remains undefined
  // Plus: ensure jber is only rendered when year has been fetched
  // this is important when opening app on jber route
  if (loading || !year) return <Spinner />

  //console.log('ApberForYear, year:', year)

  return (
    <ErrorBoundary>
      <ApberForYear jahr={year} apberuebersichtId={apberuebersichtId} />
    </ErrorBoundary>
  )
}

export default observer(ApberForYearContainer)
