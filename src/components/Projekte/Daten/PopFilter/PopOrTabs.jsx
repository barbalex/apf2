import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { initial as pop } from '../../../../store/Tree/DataFilter/pop'
import { MobxContext } from '../../../../mobxContext.js'

import { title, styledTabs, styledTab } from './PopOrTabs.module.css'

export const PopOrTabs = observer(({ activeTab, setActiveTab, dataFilter }) => {
  const store = useContext(MobxContext)
  const { dataFilterAddOr } = store.tree

  const lastFilterIsEmpty =
    Object.values(dataFilter[dataFilter.length - 1] ?? {}).filter(
      (v) => v !== null,
    ).length === 0

  const onChangeTab = (event, value) => {
    if (value > dataFilter.length - 1) {
      dataFilterAddOr({ table: 'pop', val: pop })
      setTimeout(() => setActiveTab(value), 0)
      return
    }
    setActiveTab(value)
  }

  return (
    <div>
      <div className={title}>Filter-Kriterien:</div>
      <Tabs
        value={activeTab}
        onChange={onChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className={styledTabs}
      >
        {dataFilter.map((filter, index) => (
          <Tab
            key={index}
            label={index + 1}
            value={index}
            className={styledTab}
          />
        ))}
        <Tab
          key={dataFilter.length}
          label="oder"
          value={dataFilter.length}
          disabled={lastFilterIsEmpty}
          className={styledTab}
        />
      </Tabs>
    </div>
  )
})
