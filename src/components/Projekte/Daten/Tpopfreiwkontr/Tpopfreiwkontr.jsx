import { useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useParams } from 'react-router'

import { query } from './query.js'
import { createTpopkontrzaehl } from './createTpopkontrzaehl.js'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Form } from './Form/index.jsx'
import { Menu } from './Menu.jsx'

import { container, scrollContainer } from './Tpopfreiwkontr.module.css'

export const Component = observer(({ id: idPassed }) => {
  const params = useParams()
  const { pathname } = useLocation()

  const store = useContext(MobxContext)
  const { enqueNotification, isPrint, user } = store

  const apolloClient = useApolloClient()

  const id = idPassed ?? params.tpopkontrId
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['TpopkontrQuery', id],
    queryFn: async () =>
      apolloClient.query({
        query,
        variables: { id },
        fetchPolicy: 'no-cache',
      }),
  })
  // DO NOT use apId from url because this form is also used for mass prints
  const apId =
    data?.data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apId ??
    '99999999-9999-9999-9999-999999999999'

  const zaehls =
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []

  const row = data?.data?.tpopkontrById ?? {}

  useEffect(() => {
    let isActive = true
    if (!isLoading) {
      // loading data just finished
      // check if tpopkontr exist
      const tpopkontrCount = zaehls.length
      if (tpopkontrCount === 0) {
        // add counts for all ekzaehleinheit
        // BUT DANGER: only for ekzaehleinheit with zaehleinheit_id
        const ekzaehleinheits = (
          data?.data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apByApId
            ?.ekzaehleinheitsByApId?.nodes ?? []
        )
          // remove ekzaehleinheits without zaehleinheit_id
          .filter((z) => !!z?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code)

        Promise.all(
          ekzaehleinheits.map((z) =>
            apolloClient.mutate({
              mutation: createTpopkontrzaehl,
              variables: {
                tpopkontrId: row.id,
                einheit:
                  z?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code ?? null,
                changedBy: user.name,
              },
            }),
          ),
        )
          .then(() => {
            if (!isActive) return

            refetch()
          })
          .catch((error) => {
            if (!isActive) return

            enqueNotification({
              message: error.message,
              options: {
                variant: 'error',
              },
            })
          })
      }
    }
    return () => {
      isActive = false
    }
  }, [
    apolloClient,
    data,
    enqueNotification,
    isLoading,
    refetch,
    row.id,
    user.name,
    zaehls.length,
  ])

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  if (Object.keys(row).length === 0) return null

  // console.log('Tpopfreiwkontr, isPrint:', isPrint)

  return (
    <div className={container}>
      {!pathname.includes('EKF') && (
        <>
          <FormTitle
            title="Freiwilligen-Kontrolle"
            MenuBarComponent={Menu}
            menuBarProps={{ row }}
          />
        </>
      )}
      {isPrint ?
        <Form
          data={data?.data}
          row={row}
          apId={apId}
          refetch={refetch}
        />
      : <div className={scrollContainer}>
          <Form
            data={data?.data}
            row={row}
            apId={apId}
            refetch={refetch}
          />
        </div>
      }
    </div>
  )
})
