import type { SyntheticEvent } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useSetAtom } from 'jotai'

import { initial as pop } from '../../../../store/DataFilter/pop.ts'
import { treeDataFilterAddOrAtom } from '../../../../store/index.ts'

import styles from './PopOrTabs.module.css'

export interface PopFilterRow {
  nr: number | null
  name: string | null
  status: number | null
  statusUnklar: boolean | null
  statusUnklarBegruendung: string | null
  bekanntSeit: number | null
  apByApId?: { startJahr: number | null } | undefined
}

interface PopOrTabsProps {
  activeTab: number
  setActiveTab: (value: number) => void
  dataFilter: PopFilterRow[]
}

export const PopOrTabs = ({
  activeTab,
  setActiveTab,
  dataFilter,
}: PopOrTabsProps) => {
  const addDataFilterOr = useSetAtom(treeDataFilterAddOrAtom)

  const lastFilterIsEmpty =
    Object.values(dataFilter[dataFilter.length - 1] ?? {}).filter(
      (v) => v !== null,
    ).length === 0

  const onChangeTab = (_event: SyntheticEvent, value: number) => {
    if (value > dataFilter.length - 1) {
      addDataFilterOr({ table: 'pop', val: pop })
      setTimeout(() => setActiveTab(value), 0)
      return
    }
    setActiveTab(value)
  }

  return (
    <div>
      <div className={styles.title}>Filter-Kriterien:</div>
      <Tabs
        value={activeTab}
        onChange={onChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className={styles.tabs}
      >
        {dataFilter.map((_filter, index) => (
          <Tab
            key={index}
            label={index + 1}
            value={index}
            className={styles.tab}
          />
        ))}
        <Tab
          key={dataFilter.length}
          label="oder"
          value={dataFilter.length}
          disabled={lastFilterIsEmpty}
          className={styles.tab}
        />
      </Tabs>
    </div>
  )
}
