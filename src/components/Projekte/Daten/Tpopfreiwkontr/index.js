import React, { useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { MdPrint } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import SimpleBar from 'simplebar-react'

import query from './query'
import createTpopkontrzaehl from './createTpopkontrzaehl'
import FormTitle from '../../../shared/FormTitle'
import storeContext from '../../../../storeContext'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'
import TpopfreiwkontrForm from './Form'

const Container = styled.div`
  height: 100%;
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
const ScrollContainer = styled.div`
  overflow-y: auto;
`
const StyledIconButton = styled(IconButton)`
  color: white !important;
  margin-right: 10px !important;
`

const Tpopfreiwkontr = ({ treeName, id: idPassed }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, isPrint, setIsPrint, view, user } = store
  const tree = store[treeName]
  const { activeNodeArray } = tree

  let id = idPassed
    ? idPassed
    : activeNodeArray.length > 9
    ? activeNodeArray[9]
    : '99999999-9999-9999-9999-999999999999'
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      id,
    },
  })
  // DO NOT fetch apId from activeNodeArray because this form is also used for mass prints
  //const apId = activeNodeArray[3]
  const apId =
    data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apId ??
    '99999999-9999-9999-9999-999999999999'

  const zaehls = data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []

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
          .filter((z) => !!z?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code)

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

  const onClickPrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsPrint(true)
      setTimeout(() => {
        window.print()
        setIsPrint(false)
      })
    }
  }, [setIsPrint])

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  if (Object.keys(row).length === 0) return null

  return (
    <Container>
      {!(view === 'ekf') && (
        <FormTitle
          apId={apId}
          title="Freiwilligen-Kontrolle"
          treeName={treeName}
          buttons={
            <>
              <StyledIconButton onClick={onClickPrint} title="drucken">
                <MdPrint />
              </StyledIconButton>
            </>
          }
        />
      )}
      {isPrint ? (
        <TpopfreiwkontrForm
          treeName={treeName}
          data={data}
          row={row}
          apId={apId}
          refetch={refetch}
        />
      ) : (
        <ScrollContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <TpopfreiwkontrForm
              treeName={treeName}
              data={data}
              row={row}
              apId={apId}
              refetch={refetch}
            />
          </SimpleBar>
        </ScrollContainer>
      )}
    </Container>
  )
}

export default observer(Tpopfreiwkontr)
