import React, { useCallback, useEffect, useContext, useState } from 'react'
import styled from 'styled-components'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import IconButton from '@mui/material/IconButton'
import SimpleBar from 'simplebar-react'

import query from './query'
import queryTpopkontrs from './queryTpopkontrs'
import createTpopkontrzaehl from './createTpopkontrzaehl'
import FilterTitle from '../../../shared/FilterTitle'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopfreiwkontrType } from '../../../../store/Tree/DataFilter/tpopfreiwkontr'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'
import TpopfreiwkontrForm from './Form'
import OrTabs from './Tabs'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
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
const FilterCommentTitle = styled.div`
  margin-top: -10px;
  padding: 0 10px 16px 10px;
  font-size: 0.75em;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
`
const FilterCommentList = styled.ul`
  margin-bottom: 10px;
`
const FilterComment = styled.li`
  margin-top: -10px;
  padding: 0 10px 0 10px;
  font-size: 0.75em;
`

const Tpopfreiwkontr = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, user } = store
  const tree = store[treeName]
  const {
    activeNodeArray,
    dataFilter,
    ekfGqlFilter,
    nodeLabelFilter,
    mapFilter,
    apFilter,
    artIsFiltered,
    popIsFiltered,
    tpopIsFiltered,
    apIdInActiveNodeArray,
    popIdInActiveNodeArray,
    tpopIdInActiveNodeArray,
  } = tree

  const id = '99999999-9999-9999-9999-999999999999'
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

  const allTpopkontrFilter = {
    typ: { equalTo: 'Freiwilligen-Erfolgskontrolle' },
    tpopByTpopId: {
      popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
    },
  }
  const tpopkontrFilter = {
    typ: { equalTo: 'Freiwilligen-Erfolgskontrolle' },
    tpopByTpopId: {
      popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
    },
  }
  const tpopkontrFilterValues = Object.entries(
    dataFilter.tpopfreiwkontr,
  ).filter((e) => e[1] || e[1] === 0)
  tpopkontrFilterValues.forEach(([key, value]) => {
    const expression =
      tpopfreiwkontrType[key] === 'string' ? 'includes' : 'equalTo'
    tpopkontrFilter[key] = { [expression]: value }
  })
  const { data: dataTpopkontrs } = useQuery(queryTpopkontrs, {
    variables: {
      tpopkontrFilter,
      allTpopkontrFilter,
      apId: activeNodeArray[3],
      apIdExists: !!activeNodeArray[3],
      apIdNotExists: !activeNodeArray[3],
    },
  })

  const zaehls = data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []

  let totalNr
  let filteredNr
  let row = dataFilter.tpopfreiwkontr
  if (activeNodeArray[3]) {
    const popsOfAp = dataTpopkontrs?.popsOfAp?.nodes ?? []
    const tpopsOfAp = flatten(popsOfAp.map((p) => p?.tpops?.nodes ?? []))
    totalNr = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => p?.tpopkontrs?.totalCount)
          .reduce((acc = 0, val) => acc + val)
    filteredNr = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => p?.tpopkontrsFiltered?.totalCount)
          .reduce((acc = 0, val) => acc + val)
  } else {
    totalNr = dataTpopkontrs?.allTpopkontrs?.totalCount ?? '...'
    filteredNr = dataTpopkontrs?.tpopkontrsFiltered?.totalCount ?? '...'
  }

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

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  if (Object.keys(row).length === 0) return null

  return (
    <Container>
      <FilterTitle
        title="Freiwilligen-Kontrollen"
        treeName={treeName}
        table="tpopfreiwkontr"
        totalNr={totalNr}
        filteredNr={filteredNr}
      />
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
    </Container>
  )
}

export default observer(Tpopfreiwkontr)
