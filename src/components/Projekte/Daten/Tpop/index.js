import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import query from './query'
import queryTpops from './queryTpops'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopType } from '../../../../store/Tree/DataFilter/tpop'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import Ek from './Ek'
import Tpop from './Tpop'
import TpopHistory from './History'
import Files from '../../../shared/Files'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import {
  popStatusWerte,
  tpop,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  height: 100%;
  overflow: hidden !important;
  overflow-y: auto;
  fieldset {
    padding-right: 30px;
  }
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  height: calc(100% - 48px);
`

const fieldTypes = {
  popId: 'UUID',
  nr: 'Int',
  gemeinde: 'String',
  flurname: 'String',
  radius: 'Int',
  hoehe: 'Int',
  exposition: 'String',
  klima: 'String',
  neigung: 'String',
  bodenTyp: 'String',
  bodenKalkgehalt: 'String',
  bodenDurchlaessigkeit: 'String',
  bodenHumus: 'String',
  bodenNaehrstoffgehalt: 'String',
  bodenAbtrag: 'String',
  wasserhaushalt: 'String',
  beschreibung: 'String',
  katasterNr: 'String',
  status: 'Int',
  statusUnklarGrund: 'String',
  apberRelevant: 'Boolean',
  apberRelevantGrund: 'Int',
  bekanntSeit: 'Int',
  eigentuemer: 'String',
  kontakt: 'String',
  nutzungszone: 'String',
  bewirtschafter: 'String',
  bewirtschaftung: 'String',
  ekfrequenz: 'UUID',
  ekfrequenzAbweichend: 'Boolean',
  ekfKontrolleur: 'UUID',
  ekfrequenzStartjahr: 'Int',
  bemerkungen: 'String',
  statusUnklar: 'Boolean',
}

const TpopForm = ({ treeName, showFilter = false }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { dataFilterSetValue, refetch, urlQuery, setUrlQuery } = store

  const { activeNodeArray, dataFilter } = store[treeName]
  const [tab, setTab] = useState(urlQuery?.tpopTab ?? 'tpop')
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'tpopTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  let id =
    activeNodeArray.length > 7
      ? activeNodeArray[7]
      : '99999999-9999-9999-9999-999999999999'
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'
  const apId = activeNodeArray[3]
  const {
    data,
    loading,
    error,
    refetch: refetchTpop,
  } = useQuery(query, {
    variables: {
      id,
    },
  })
  const apJahr = data?.tpopById?.popByPopId?.apByApId?.startJahr ?? null

  const allTpopsFilter = {
    popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
  }
  const tpopFilter = {
    popId: { isNull: false },
    popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
  }
  const tpopFilterValues = Object.entries(dataFilter.tpop).filter(
    (e) => e[1] || e[1] === 0,
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
    tpopFilter[key] = { [expression]: value }
  })

  const { data: dataTpops } = useQuery(queryTpops, {
    variables: {
      allTpopsFilter,
      tpopFilter,
      apId,
      apIdExists: !!apId && showFilter,
    },
  })

  let tpopTotalCount
  let tpopFilteredCount
  let tpopOfApTotalCount
  let tpopOfApFilteredCount
  let row
  if (showFilter) {
    row = dataFilter.tpop
    tpopTotalCount = dataTpops?.allTpops?.totalCount ?? '...'
    tpopFilteredCount = dataTpops?.tpopsFiltered?.totalCount ?? '...'
    const popsOfAp = dataTpops?.popsOfAp?.nodes ?? []
    tpopOfApTotalCount = !popsOfAp.length
      ? '...'
      : popsOfAp
          .map((p) => p?.tpops?.totalCount)
          .reduce((acc = 0, val) => acc + val)
    tpopOfApFilteredCount = !popsOfAp.length
      ? '...'
      : popsOfAp
          .map((p) => p?.tpopsFiltered?.totalCount)
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = data?.tpopById ?? {}
  }

  const [fieldErrors, setFieldErrors] = useState({})
  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      if (showFilter) {
        return dataFilterSetValue({
          treeName,
          table: 'tpop',
          key: field,
          value,
        })
      } else {
        const variables = {
          id: row.id,
          [field]: value,
          changedBy: store.user.name,
        }
        try {
          await client.mutate({
            mutation: gql`
            mutation updateTpop${field}(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateTpopById(
                input: {
                  id: $id
                  tpopPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpop {
                  ...TpopFields
                  popStatusWerteByStatus {
                    ...PopStatusWerteFields
                  }
                  tpopApberrelevantGrundWerteByApberRelevantGrund {
                    ...TpopApberrelevantGrundWerteFields
                  }
                  popByPopId {
                    id
                    apId
                  }
                }
              }
            }
            ${popStatusWerte}
            ${tpop}
            ${tpopApberrelevantGrundWerte}
          `,
            variables,
            // no optimistic responce as geomPoint
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        // update tpop on map
        if (
          (value &&
            ((field === 'ylv95Y' && row?.lv95X) ||
              (field === 'lv95X' && row?.y))) ||
          (!value && (field === 'ylv95Y' || field === 'lv95X'))
        ) {
          if (refetch.tpopForMap) {
            // need to also refetch pop in case pop was new
            refetch.popForMap && refetch.popForMap()
            refetch.tpopForMap()
          }
        }
        if (Object.keys(fieldErrors).length) {
          setFieldErrors({})
        }
      }
    },
    [
      client,
      dataFilterSetValue,
      fieldErrors,
      refetch,
      row.id,
      row?.lv95X,
      row?.y,
      showFilter,
      store.user.name,
      treeName,
    ],
  )

  if (error) return <Error error={error} />
  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        {showFilter ? (
          <FilterTitle
            title="Teil-Population"
            treeName={treeName}
            table="tpop"
            totalNr={tpopTotalCount}
            filteredNr={tpopFilteredCount}
            totalApNr={tpopOfApTotalCount}
            filteredApNr={tpopOfApFilteredCount}
          />
        ) : (
          <FormTitle
            apId={data?.tpopById?.popByPopId?.apId}
            title="Teil-Population"
            treeName={treeName}
          />
        )}
        <FieldsContainer>
          <Tabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <StyledTab label="Teil-Population" value="tpop" data-id="tpop" />
            <StyledTab label="EK" value="ek" data-id="ek" />
            {!showFilter && (
              <StyledTab label="Dateien" value="dateien" data-id="dateien" />
            )}
            {!showFilter && (
              <StyledTab label="Historien" value="history" data-id="history" />
            )}
          </Tabs>
          <TabContent>
            {tab === 'tpop' ? (
              <Tpop
                showFilter={showFilter}
                saveToDb={saveToDb}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                row={row}
                apJahr={apJahr}
                refetchTpop={refetchTpop}
                treeName={treeName}
                loadingParent={loading}
              />
            ) : tab === 'ek' ? (
              <Ek
                treeName={treeName}
                showFilter={showFilter}
                saveToDb={saveToDb}
                fieldErrors={fieldErrors}
                row={row}
                loadingParent={loading}
              />
            ) : tab === 'dateien' ? (
              <Files parentId={row?.id} parent="tpop" loadingParent={loading} />
            ) : (
              <TpopHistory tpopId={id} />
            )}
          </TabContent>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(TpopForm)
