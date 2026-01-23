import { Dispatch, SetStateAction, type SyntheticEvent } from 'react'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useSetAtom } from 'jotai'

import { initial as tpop } from '../../../../store/Tree/DataFilter/tpop.ts'
import { treeDataFilterAddOrAtom } from '../../../../JotaiStore/index.ts'

import styles from './Tabs.module.css'

interface TabsProps {
  activeTab: number
  setActiveTab: Dispatch<SetStateAction<number>>
  dataFilter: any[]
}

export const Tabs = ({ activeTab, setActiveTab, dataFilter }: TabsProps) => {
  const addDataFilterOr = useSetAtom(treeDataFilterAddOrAtom)

  const lastFilterIsEmpty =
    Object.values(dataFilter[dataFilter.length - 1] ?? {}).filter(
      (v) => v !== null,
    ).length === 0

  const onChangeTab = (_event: SyntheticEvent, value: number) => {
    if (value > dataFilter.length - 1) {
      addDataFilterOr({ table: 'tpop', val: tpop })
      setTimeout(() => setActiveTab(value), 0)
      return
    }
    setActiveTab(value)
  }

  return (
    <div>
      <div className={styles.title}>Filter-Kriterien:</div>
      <MuiTabs
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
      </MuiTabs>
    </div>
  )
}
