import React, { useCallback } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'

const StyledTabs = styled(Tabs)`
  [role='tab'][aria-selected='false'],
  svg {
    color: white !important;
  }
`
const StyledTab = styled(Tab)`
  min-width: 70px !important;
  text-transform: none !important;
`

const OrTabs = ({ activeTab, setActiveTab }) => {
  const onChangeTab = useCallback(
    (event, value) => setActiveTab(value),
    [setActiveTab],
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
        <StyledTab label="Art" value="ap" data-id="ap" />
        <StyledTab label="Pop" value="pop" data-id="pop" />
        <StyledTab label="T-Pop" value="tpop" data-id="tpop" />
        <StyledTab label="Massn" value="tpopmassn" data-id="tpopmassn" />
        <StyledTab label="EK" value="tpopfeldkontr" data-id="tpopfeldkontr" />
        <StyledTab
          label="EKF"
          value="tpopfreiwkontr"
          data-id="tpopfreiwkontr"
        />
      </StyledTabs>
  )
}

export default OrTabs
