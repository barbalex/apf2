import React, { useCallback, useContext, useState, useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import FilterTitle from '../../../shared/FilterTitle.jsx'
import queryTpops from './queryTpops.js'
import storeContext from '../../../../storeContext.js'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber.js'
import Ek from './Ek/index.jsx'
import Tpop from './Tpop.jsx'
import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'
import Error from '../../../shared/Error.jsx'
import OrTabs from './Tabs.jsx'
import useSearchParamsState from '../../../../modules/useSearchParamsState.js'
import { ActiveFilters } from './ActiveFilters.js'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`
const FieldsContainer = styled.div`
  height: 100%;
  overflow: hidden !important;
  overflow-y: auto;
  scrollbar-width: thin;
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

export const TpopFilter = observer(() => {
  const store = useContext(storeContext)

  const { dataFilter, tpopGqlFilter, dataFilterSetValue } = store.tree

  const [tab, setTab] = useSearchParamsState('tpopTab', 'tpop')
  const onChangeTab = useCallback((event, value) => setTab(value), [setTab])

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.tpop.length - 1 < activeTab) {
      // filter was emptied, need to set correct tab
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

  const [fieldErrors, setFieldErrors] = useState({})
  const saveToDb = useCallback(
    async (event) =>
      dataFilterSetValue({
        table: 'tpop',
        key: event.target.name,
        value: ifIsNumericAsNumber(event.target.value),
        index: activeTab,
      }),
    [activeTab, dataFilterSetValue],
  )

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Teil-Population"
          table="tpop"
          totalNr={dataTpops?.allTpops?.totalCount ?? '...'}
          filteredNr={dataTpops?.allTpopsFiltered?.totalCount ?? '...'}
          activeTab={activeTab}
        />
        <ActiveFilters />
        <OrTabs
          dataFilter={dataFilter.tpop}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
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
                rowStringified={JSON.stringify(row)}
              />
            ) : (
              <Ek saveToDb={saveToDb} fieldErrors={fieldErrors} row={row} />
            )}
          </TabContent>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
})
