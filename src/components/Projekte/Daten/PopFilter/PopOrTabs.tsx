import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useSetAtom } from 'jotai'

import { initial as pop } from '../../../../JotaiStore/DataFilter/pop'
import { treeDataFilterAddOrAtom } from '../../../../JotaiStore/index.ts'

import styles from './PopOrTabs.module.css'

interface PopOrTabsProps {
  activeTab: number
  setActiveTab: (value: number) => void
  dataFilter: any[]
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

  const onChangeTab = (event, value) => {
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
        {dataFilter.map((filter, index) => (
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
