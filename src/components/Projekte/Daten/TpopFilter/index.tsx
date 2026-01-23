import {
  useState,
  useEffect,
  type SyntheticEvent,
  type ChangeEvent,
} from 'react'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { useAtomValue, useSetAtom } from 'jotai'

import { FilterTitle } from '../../../shared/FilterTitle.tsx'
import { queryTpops } from './queryTpops.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { Ek } from './Ek/index.tsx'
import { Tpop } from './Tpop.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  treeDataFilterAtom,
  treeDataFilterSetValueAtom,
  treeTpopGqlFilterAtom,
} from '../../../../store/index.ts'
import { Tabs } from './Tabs.tsx'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.ts'
import { ActiveFilters } from './ActiveFilters.tsx'

interface TpopsQueryResult {
  allTpops: {
    totalCount: number
  }
  allTpopsFiltered: {
    totalCount: number
  }
}

import styles from './index.module.css'

export const TpopFilter = () => {
  const tpopGqlFilter = useAtomValue(treeTpopGqlFilterAtom)

  const dataFilter = useAtomValue(treeDataFilterAtom)
  const setDataFilterValue = useSetAtom(treeDataFilterSetValueAtom)

  const [tab, setTab] = useSearchParamsState('tpopTab', 'tpop')
  const onChangeTab = (_event: SyntheticEvent, value: string) => setTab(value)

  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    if (dataFilter.tpop.length - 1 < activeTab) {
      // filter was emptied, need to set correct tab
      setActiveTab(0)
    }
  }, [activeTab, dataFilter.tpop.length])

  const apolloClient = useApolloClient()

  const { data: dataTpops } = useQuery<TpopsQueryResult>({
    queryKey: ['tpopsCount', tpopGqlFilter.filtered, tpopGqlFilter.all],
    queryFn: async () => {
      const result = await apolloClient.query<TpopsQueryResult>({
        query: queryTpops,
        variables: {
          filteredFilter: tpopGqlFilter.filtered,
          allFilter: tpopGqlFilter.all,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const row = dataFilter.tpop[activeTab]

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const saveToDb = (event: ChangeEvent<HTMLInputElement>) =>
    setDataFilterValue({
      table: 'tpop',
      key: event.target.name,
      value: ifIsNumericAsNumber(event.target.value),
      index: activeTab,
    })

  return (
    <ErrorBoundary>
      <div className={styles.container}>
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
            className={styles.styledTab}
          />
          <Tab
            label="EK"
            value="ek"
            data-id="ek"
            className={styles.styledTab}
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
}
