import React, { useEffect, useCallback } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import { withResizeDetector } from 'react-resize-detector'

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
const TitleRow = styled.div`
  background-color: #d84315;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: white;
  font-weight: bold;
`

const FilterTitle = ({
  activeTab,
  setActiveTab,
  setTitleHeight,
  height = 81,
}) => {
  useEffect(() => {
    setTitleHeight(height)
  }, [height, setTitleHeight])

  const onChangeTab = useCallback((event, value) => setActiveTab(value), [
    setActiveTab,
  ])

  const titleObject = {
    ap: 'Aktionsplan Filter',
    pop: 'Population Filter',
    tpop: 'Teil-Population Filter',
    tpopmassn: 'Massnahmen Filter',
    tpopfeldkontr: 'Feld-Kontrollen Filter',
    tpopfreiwkontr: 'Freiwilligen-Kontrollen Filter',
  }

  return (
    <TitleRow>
      <Title data-id="form-title">{titleObject[activeTab]}</Title>
      <StyledTabs
        value={activeTab}
        onChange={onChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <StyledTab label="AP" value="ap" data-id="ap" />
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
    </TitleRow>
  )
}

export default withResizeDetector(FilterTitle)
