import { memo, useCallback, useContext, useState, useEffect } from 'react'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from "@apollo/client/react";

import { FilterTitle } from '../../../shared/FilterTitle.jsx'
import { queryTpops } from './queryTpops.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { Ek } from './Ek/index.jsx'
import { Tpop } from './Tpop.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Tabs } from './Tabs.jsx'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'
import { ActiveFilters } from './ActiveFilters.js'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`

export const TpopFilter = memo(
  observer(() => {
    const store = useContext(MobxContext)

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
          <Tabs
            dataFilter={dataFilter.tpop}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <MuiTabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <StyledTab
              label="Teil-Population"
              value="tpop"
              data-id="tpop"
            />
            <StyledTab
              label="EK"
              value="ek"
              data-id="ek"
            />
          </MuiTabs>
          {tab === 'tpop' ?
            <Tpop
              saveToDb={saveToDb}
              fieldErrors={fieldErrors}
              setFieldErrors={setFieldErrors}
              row={row}
              rowStringified={JSON.stringify(row)}
            />
          : <Ek
              saveToDb={saveToDb}
              fieldErrors={fieldErrors}
              row={row}
            />
          }
        </Container>
      </ErrorBoundary>
    )
  }),
)
