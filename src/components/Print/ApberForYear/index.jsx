import { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { useParams } from 'react-router'

import { ApberForYear } from './ApberForYear.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../shared/Spinner.jsx'

export const Component = () => {
  const { apberuebersichtId = '99999999-9999-9999-9999-999999999999' } =
    useParams()

  const client = useApolloClient()
  const store = useContext(MobxContext)
  const { printingJberYear } = store

  const [year, setYear] = useState(printingJberYear)
  const [error, setError] = useState(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setYear(printingJberYear)
  }, [printingJberYear])

  useEffect(() => {
    let isActive = true
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
        if (!isActive) return

        setError(error)
      }
      if (!isActive) return

      /*console.log('ApberForYear, useEffect setting year:', {
        year: result?.data?.apberuebersichtById?.jahr,
        result,
        apberuebersichtId,
      })*/
      setYear(result?.apberuebersichtById?.jahr)
      setLoading(false)
    }

    run()

    return () => {
      isActive = false
    }
  }, [apberuebersichtId, client, printingJberYear])

  if (error) {
    return `Fehler: ${error.message}`
  }

  // DANGER: without rerendering when loading mutates from true to false
  // data remains undefined
  // Plus: ensure jber is only rendered when year has been fetched
  // this is important when opening app on jber route
  if (loading || !year) return <Spinner />

  return (
    <ErrorBoundary>
      <ApberForYear
        jahr={year}
        apberuebersichtId={apberuebersichtId}
      />
    </ErrorBoundary>
  )
}
