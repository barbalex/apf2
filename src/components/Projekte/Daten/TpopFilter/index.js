import React, { useCallback, useContext, useState, useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import FilterTitle from '../../../shared/FilterTitle'
import queryTpops from './queryTpops'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import Ek from './Ek'
import Tpop from './Tpop'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import PopOrTabs from './Tabs'

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
const FilterComment = styled.div`
  margin-top: -10px;
  padding: 0 10px 16px 10px;
  font-size: 0.75em;
`

const TpopFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue, urlQuery } = store

  const { activeNodeArray, dataFilter, tpopGqlFilter, nodeLabelFilter } =
    store[treeName]
  const [tab, setTab] = useState(urlQuery?.tpopTab ?? 'tpop')
  const onChangeTab = useCallback((event, value) => setTab(value), [])

  const apId = activeNodeArray[3]
  const popId = activeNodeArray[5]

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.tpop.length - 1 < activeTab) {
      // filter was emtied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.tpop.length])

  const { data: dataTpops, error } = useQuery(queryTpops, {
    variables: {
      filteredFilter: tpopGqlFilter.filtered,
      allFilter: tpopGqlFilter.all,
    },
  })

  const row = dataFilter.tpop[activeTab]
  const totalNr = dataTpops?.allTpops?.totalCount
  const filteredNr = dataTpops?.allTpopsFiltered?.totalCount

  const [fieldErrors, setFieldErrors] = useState({})
  const saveToDb = useCallback(
    async (event) =>
      dataFilterSetValue({
        treeName,
        table: 'tpop',
        key: event.target.name,
        value: ifIsNumericAsNumber(event.target.value),
        index: activeTab,
      }),
    [activeTab, dataFilterSetValue, treeName],
  )
  const hiearchyComment = popId
    ? 'Eine Population ist gewählt. Es werden (nur) die Teil-Populationen dieser Population berücksichtigt.'
    : apId
    ? 'Eine Art ist gewählt. Es werden (nur) die Teil-Populationen dieser Art berücksichtigt.'
    : 'Es werden alle Teil-Populationen des Projekts berücksichtigt.'

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
          activeTab={activeTab}
        />
        <FilterComment>{hiearchyComment}</FilterComment>
        {!!nodeLabelFilter.tpop && (
          <FilterComment>{`Hinweis: Gemäss Navigationsbaum wird das Label der Teil-Populationen nach "${nodeLabelFilter.tpop}" gefiltert.`}</FilterComment>
        )}
        <PopOrTabs
          dataFilter={dataFilter.tpop}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          treeName={treeName}
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
                rowStringified={JSON.stringify(row)}
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
