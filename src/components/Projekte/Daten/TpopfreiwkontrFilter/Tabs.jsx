import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { initial as tpopfreiwkontr } from '../../../../store/Tree/DataFilter/tpopfreiwkontr.js'
import { MobxContext } from '../../../../mobxContext.js'

import { title, tabs, tab } from './Tabs.module.css'

export const Tabs = observer(({ activeTab, setActiveTab, dataFilter }) => {
  const store = useContext(MobxContext)
  const { dataFilterAddOr } = store.tree

  const lastFilterIsEmpty =
    Object.values(dataFilter[dataFilter.length - 1] ?? {}).filter(
      (v) => v !== null,
    ).length === 0

  const onChangeTab = (event, value) => {
    if (value > dataFilter.length - 1) {
      dataFilterAddOr({
        table: 'tpopfreiwkontr',
        val: tpopfreiwkontr,
      })
      setTimeout(() => setActiveTab(value), 0)
      return
    }
    setActiveTab(value)
  }

  return (
    <>
      <div className={title}>Filter-Kriterien:</div>
      <MuiTabs
        value={activeTab}
        onChange={onChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className={tabs}
      >
        {dataFilter.map((filter, index) => (
          <Tab
            key={index}
            label={index + 1}
            value={index}
            className={tab}
          />
        ))}
        <Tab
          key={dataFilter.length}
          label="oder"
          value={dataFilter.length}
          disabled={lastFilterIsEmpty}
          className={tab}
        />
      </MuiTabs>
    </>
  )
})
