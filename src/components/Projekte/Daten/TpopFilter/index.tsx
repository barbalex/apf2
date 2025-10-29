import { useContext, useState, useEffect } from 'react'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'

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

import { container, styledTab } from './index.module.css'

export const TpopFilter = observer(() => {
  const store = useContext(MobxContext)

  const { dataFilter, tpopGqlFilter, dataFilterSetValue } = store.tree

  const [tab, setTab] = useSearchParamsState('tpopTab', 'tpop')
  const onChangeTab = (event, value) => setTab(value)

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
  const saveToDb = (event) =>
    dataFilterSetValue({
      table: 'tpop',
      key: event.target.name,
      value: ifIsNumericAsNumber(event.target.value),
      index: activeTab,
    })

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={container}>
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
          <Tab
            label="Teil-Population"
            value="tpop"
            data-id="tpop"
            className={styledTab}
          />
          <Tab
            label="EK"
            value="ek"
            data-id="ek"
            className={styledTab}
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
      </div>
    </ErrorBoundary>
  )
})
