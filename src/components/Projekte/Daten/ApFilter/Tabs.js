import React, { useCallback, useContext } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'

import { initial as ap } from '../../../../store/Tree/DataFilter/ap'
import storeContext from '../../../../storeContext'

const StyledTabs = styled(Tabs)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const StyledTab = styled(Tab)`
  min-width: 70px !important;
  text-transform: none !important;
`

const OrTabs = ({ activeTab, setActiveTab, dataFilter, treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterAddOr } = store

  const onChangeTab = useCallback(
    (event, value) => {
      if (value > dataFilter.length - 1) {
        dataFilterAddOr({ treeName, table: 'ap', val: ap })
        setTimeout(() => setActiveTab(value), 0)
        return
      }
      setActiveTab(value)
    },
    [dataFilter.length, dataFilterAddOr, setActiveTab, treeName],
  )

  return (
    <StyledTabs
      value={activeTab}
      onChange={onChangeTab}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
    >
      {dataFilter.map((filter, index) => (
        <StyledTab key={index} label={index + 1} value={index} />
      ))}
      <StyledTab
        key={dataFilter.length}
        label="oder"
        value={dataFilter.length}
      />
    </StyledTabs>
  )
}

export default OrTabs
