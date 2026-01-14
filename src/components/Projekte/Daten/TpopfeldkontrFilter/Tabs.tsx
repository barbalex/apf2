import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { initial as tpopfeldkontr } from '../../../../store/Tree/DataFilter/tpopfeldkontr.ts'
import { MobxContext } from '../../../../mobxContext.js'

import styles from './Tabs.module.css'

interface TabsProps {
  activeTab: number
  setActiveTab: (tab: number) => void
  dataFilter: any[]
}

export const Tabs = observer(
  ({ activeTab, setActiveTab, dataFilter }: TabsProps) => {
    const store = useContext(MobxContext)
    const { dataFilterAddOr } = store.tree

    const lastFilterIsEmpty =
      Object.values(dataFilter[dataFilter.length - 1] ?? {}).filter(
        (v) => v !== null,
      ).length === 0

    const onChangeTab = (event, value) => {
      if (value > dataFilter.length - 1) {
        dataFilterAddOr({
          table: 'tpopfeldkontr',
          val: tpopfeldkontr,
        })
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
        </MuiTabs>
      </div>
    )
  },
)
