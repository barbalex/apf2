import { type SyntheticEvent } from 'react'
import MaterialTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useSetAtom } from 'jotai'

import { initial as ap } from '../../../../store/Tree/DataFilter/ap'
import { treeDataFilterAddOrAtom } from '../../../../JotaiStore/index.ts'

import styles from './Tabs.module.css'

interface TabsProps {
  activeTab: number
  setActiveTab: (tab: number) => void
  dataFilter: any[]
}

export const Tabs = ({ activeTab, setActiveTab, dataFilter }: TabsProps) => {
  const addDataFilterOr = useSetAtom(treeDataFilterAddOrAtom)

  const lastFilterIsEmpty =
    Object.values(dataFilter[dataFilter.length - 1] ?? {}).filter(
      (v) => v !== null,
    ).length === 0

  const onChangeTab = (event: SyntheticEvent, value: number) => {
    if (value > dataFilter.length - 1) {
      addDataFilterOr({ table: 'ap', val: ap })
      setTimeout(() => setActiveTab(value), 0)
      return
    }
    setActiveTab(value)
  }

  return (
    <div>
      <div className={styles.title}>Filter-Kriterien:</div>
      <MaterialTabs
        value={activeTab}
        onChange={onChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className={styles.styledTabs}
      >
        {dataFilter.map((filter, index) => (
          <Tab
            key={index}
            label={index + 1}
            value={index}
            className={styles.styledTab}
          />
        ))}
        <Tab
          key={dataFilter.length}
          label="oder"
          value={dataFilter.length}
          disabled={lastFilterIsEmpty}
          className={styles.styledTab}
        />
      </MaterialTabs>
    </div>
  )
}
