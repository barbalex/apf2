import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { MdPrint } from 'react-icons/md'
import IconButton from '@material-ui/core/IconButton'
import { withResizeDetector } from 'react-resize-detector'
import SimpleBar from 'simplebar-react'

import query from './query'
import queryTpopkontrs from './queryTpopkontrs'
import createTpopkontrzaehl from './createTpopkontrzaehl'
import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopfreiwkontrType } from '../../../../store/Tree/DataFilter/tpopfreiwkontr'
import Error from '../../../shared/Error'
import TpopfreiwkontrForm from './Form'

const Container = styled.div`
  height: ${(props) =>
    props.showfilter
      ? `calc(100% - ${props['data-filter-title-height']}px)`
      : `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
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
const LoadingContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  padding: 10px;
`
const ScrollContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const StyledIconButton = styled(IconButton)`
  color: white !important;
  margin-right: 10px !important;
`

const Tpopfreiwkontr = ({
  treeName,
  showFilter = false,
  id: idPassed,
  width = 1000,
  filterTitleHeight = 81,
}) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, isPrint, setIsPrint, view, user, appBarHeight } =
    store
  const tree = store[treeName]
  const { activeNodeArray, dataFilter } = tree

  let id = idPassed
    ? idPassed
    : activeNodeArray.length > 9
    ? activeNodeArray[9]
    : '99999999-9999-9999-9999-999999999999'
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'
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
      apId,
      apIdExists: !!apId && showFilter,
    },
  })

  const zaehls = data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []

  let tpopkontrTotalCount
  let tpopkontrFilteredCount
  let tpopkontrsOfApTotalCount
  let tpopkontrsOfApFilteredCount
  let row
  if (showFilter) {
    row = dataFilter.tpopfreiwkontr
    tpopkontrTotalCount = dataTpopkontrs?.allTpopkontrs?.totalCount ?? '...'
    tpopkontrFilteredCount =
      dataTpopkontrs?.tpopkontrsFiltered?.totalCount ?? '...'
    const popsOfAp = dataTpopkontrs?.popsOfAp?.nodes ?? []
    const tpopsOfAp = flatten(popsOfAp.map((p) => p?.tpops?.nodes ?? []))
    tpopkontrsOfApTotalCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => p?.tpopkontrs?.totalCount)
          .reduce((acc = 0, val) => acc + val)
    tpopkontrsOfApFilteredCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => p?.tpopkontrsFiltered?.totalCount)
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = data?.tpopkontrById ?? {}
  }

  useEffect(() => {
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
          .then(() => refetch())
          .catch((error) =>
            enqueNotification({
              message: error.message,
              options: {
                variant: 'error',
              },
            }),
          )
      }
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

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  if (loading)
    return (
      <LoadingContainer data-appbar-height={appBarHeight}>
        Lade...
      </LoadingContainer>
    )
  if (error) return <Error error={error} />
  if (Object.keys(row).length === 0) return null

  console.log('isPrint:', isPrint)

  return (
    <Container
      showfilter={showFilter}
      data-appbar-height={appBarHeight}
      data-filter-title-height={filterTitleHeight}
    >
      {!(view === 'ekf') && showFilter && (
        <FilterTitle
          title="Freiwilligen-Kontrollen"
          treeName={treeName}
          table="tpopfreiwkontr"
          totalNr={tpopkontrTotalCount}
          filteredNr={tpopkontrFilteredCount}
          totalApNr={tpopkontrsOfApTotalCount}
          filteredApNr={tpopkontrsOfApFilteredCount}
          setFormTitleHeight={setFormTitleHeight}
        />
      )}
      {!(view === 'ekf') && !showFilter && (
        <FormTitle
          apId={apId}
          title="Freiwilligen-Kontrolle"
          treeName={treeName}
          setFormTitleHeight={setFormTitleHeight}
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
          showFilter={showFilter}
          id={idPassed}
          data={data}
          row={row}
          apId={apId}
          error={error}
          refetch={refetch}
        />
      ) : (
        <ScrollContainer data-form-title-height={formTitleHeight}>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <TpopfreiwkontrForm
              treeName={treeName}
              showFilter={showFilter}
              id={idPassed}
              data={data}
              row={row}
              apId={apId}
              error={error}
              refetch={refetch}
            />
          </SimpleBar>
        </ScrollContainer>
      )}
    </Container>
  )
}

export default withResizeDetector(observer(Tpopfreiwkontr))
