import React, { useCallback, useContext } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'

import { initial as tpop } from '../../../../store/Tree/DataFilter/tpop'
import storeContext from '../../../../storeContext'

const Row = styled.div``
const Title = styled.div`
  margin-top: -8px;
  margin-bottom: -8px;
  font-size: 0.75em;
  font-weight: bold;
  padding-left: 10px;
  color: rgba(0, 0, 0, 0.87);
`
const StyledTabs = styled(Tabs)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const StyledTab = styled(Tab)`
  min-width: 70px !important;
  text-transform: none !important;
`

const TpopOrTabs = ({ activeTab, setActiveTab, dataFilter, treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterAddOr } = store

  const lastFilterIsEmpty =
    Object.values(dataFilter[dataFilter.length - 1] ?? {}).filter(
      (v) => v !== null,
    ).length === 0

  const onChangeTab = useCallback(
    (event, value) => {
      if (value > dataFilter.length - 1) {
        dataFilterAddOr({ treeName, table: 'tpop', val: tpop })
        setTimeout(() => setActiveTab(value), 0)
        return
      }
      setActiveTab(value)
    },
    [dataFilter.length, dataFilterAddOr, setActiveTab, treeName],
  )

  return (
    <Row>
      <Title>Filter-Kriterien:</Title>
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
          disabled={lastFilterIsEmpty}
        />
      </StyledTabs>
    </Row>
  )
}

export default TpopOrTabs
