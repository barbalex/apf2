import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import FilterTitle from '../../../shared/FilterTitle'
import queryTpops from './queryTpops'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopType } from '../../../../store/Tree/DataFilter/tpop'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import Ek from './Ek'
import Tpop from './Tpop'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
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

const TpopFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue, urlQuery } = store

  const { activeNodeArray, dataFilter, tpopGqlFilter } = store[treeName]
  const [tab, setTab] = useState(urlQuery?.tpopTab ?? 'tpop')
  const onChangeTab = useCallback((event, value) => setTab(value), [])

  const apId = activeNodeArray[3]

  const tpopFilter = apId
    ? {
        popId: { isNull: false },
        popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
      }
    : { popId: { isNull: false } }
  const tpopFilterValues = Object.entries(dataFilter.tpop).filter(
    (e) => e[1] || e[1] === 0,
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
    tpopFilter[key] = { [expression]: value }
  })

  const { data: dataTpops, error } = useQuery(queryTpops, {
    variables: {
      tpopFilter,
      apId,
      apIdExists: !!apId,
      apIdNotExists: !apId,
    },
  })

  let totalNr
  let filteredNr
  let row = dataFilter.tpop
  if (apId) {
    const pops = dataTpops?.allPops?.nodes ?? []
    totalNr = !pops.length
      ? '...'
      : pops
          .map((p) => p?.tpops?.totalCount)
          .reduce((acc = 0, val) => acc + val)
    filteredNr = !pops.length
      ? '...'
      : pops
          .map((p) => p?.tpopsFiltered?.totalCount)
          .reduce((acc = 0, val) => acc + val)
  } else {
    totalNr = dataTpops?.allTpops?.totalCount
    filteredNr = dataTpops?.allTpopsFiltered?.totalCount
  }

  const [fieldErrors, setFieldErrors] = useState({})
  const saveToDb = useCallback(
    async (event) =>
      dataFilterSetValue({
        treeName,
        table: 'tpop',
        key: event.target.name,
        value: ifIsNumericAsNumber(event.target.value),
      }),
    [dataFilterSetValue, treeName],
  )

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Teil-Population"
          treeName={treeName}
          table="tpop"
          totalNr={totalNr}
          filteredNr={filteredNr}
        />
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
          </Tabs>
          <TabContent>
            {tab === 'tpop' ? (
              <Tpop
                saveToDb={saveToDb}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                row={row}
                treeName={treeName}
              />
            ) : (
              <Ek
                treeName={treeName}
                saveToDb={saveToDb}
                fieldErrors={fieldErrors}
                row={row}
              />
            )}
          </TabContent>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(TpopFilter)
