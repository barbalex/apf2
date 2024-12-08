import { memo, useEffect, useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { useLocation, useParams } from 'react-router'

import { query } from './query.js'
import { createTpopkontrzaehl } from './createTpopkontrzaehl.js'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Form } from './Form/index.jsx'
import { Menu } from './Menu.jsx'

const Container = styled.div`
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @media print {
    font-size: 11px;
    height: auto;
    width: inherit;
    margin: 0 !important;
    padding: 0.5cm !important;
    overflow: hidden;
    page-break-after: always;
  }
`
// somehow scrollbars were not shown without explicitly setting height
const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
`

export const Component = memo(
  observer(({ id: idPassed }) => {
    const { tpopkontrId: idPassedFromUrl } = useParams()

    const { pathname } = useLocation()
    const client = useApolloClient()
    const store = useContext(MobxContext)
    const { enqueNotification, isPrint, user } = store

    const id = idPassed ?? idPassedFromUrl
    const { data, loading, error, refetch } = useQuery(query, {
      variables: {
        id,
      },
    })
    // DO NOT use apId from url because this form is also used for mass prints
    const apId =
      data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apId ??
      '99999999-9999-9999-9999-999999999999'

    const zaehls =
      data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []

    const row = data?.tpopkontrById ?? {}

    useEffect(() => {
      let isActive = true
      if (!loading) {
        // loading data just finished
        // check if tpopkontr exist
        const tpopkontrCount = zaehls.length
        if (tpopkontrCount === 0) {
          // add counts for all ekzaehleinheit
          // BUT DANGER: only for ekzaehleinheit with zaehleinheit_id
          const ekzaehleinheits = (
            data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apByApId
              ?.ekzaehleinheitsByApId?.nodes ?? []
          )
            // remove ekzaehleinheits without zaehleinheit_id
            .filter(
              (z) => !!z?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code,
            )

          Promise.all(
            ekzaehleinheits.map((z) =>
              client.mutate({
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
      client,
      data,
      enqueNotification,
      loading,
      refetch,
      row.id,
      user.name,
      zaehls.length,
    ])

    if (loading) return <Spinner />

    if (error) return <Error error={error} />

    if (Object.keys(row).length === 0) return null

    // console.log('Tpopfreiwkontr, isPrint:', isPrint)

    return (
      <Container>
        {!pathname.includes('EKF') && (
          <>
            <FormTitle
              title="Freiwilligen-Kontrolle"
              menuBar={<Menu row={row} />}
            />
          </>
        )}
        {isPrint ?
          <Form
            data={data}
            row={row}
            apId={apId}
            refetch={refetch}
          />
        : <ScrollContainer>
            <Form
              data={data}
              row={row}
              apId={apId}
              refetch={refetch}
            />
          </ScrollContainer>
        }
      </Container>
    )
  }),
)
