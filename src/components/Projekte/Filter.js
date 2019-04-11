import React, { useState, useCallback } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import ApFilter from './Daten/ApFilter'
import Pop from './Daten/Pop'
import Tpop from './Daten/Tpop'
import Tpopmassn from './Daten/Tpopmassn'
import Tpopfeldkontr from './Daten/Tpopfeldkontr'
import Tpopfreiwkontr from './Daten/Tpopfreiwkontr'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffd3a7;
`
const StyledTabs = styled(Tabs)`
  [role='tab'][aria-selected='false'],
  svg {
    color: white !important;
  }
`
const StyledTab = styled(Tab)`
  min-width: 70px !important;
`
const TitleRow = styled.div`
  background-color: #d84315;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: white;
  font-weight: bold;
`

export default ({ treeName }) => {
  const [activeTab, setActiveTab] = useState('ap')

  const onChangeTab = useCallback((event, value) => setActiveTab(value))

  const formObject = {
    ap: <ApFilter treeName={treeName} />,
    pop: <Pop treeName={treeName} showFilter={true} />,
    tpop: <Tpop treeName={treeName} showFilter={true} />,
    tpopmassn: <Tpopmassn treeName={treeName} showFilter={true} />,
    tpopfeldkontr: <Tpopfeldkontr treeName={treeName} showFilter={true} />,
    tpopfreiwkontr: <Tpopfreiwkontr treeName={treeName} showFilter={true} />,
  }
  const form = formObject[activeTab]
  const titleObject = {
    ap: 'Aktionsplan Filter',
    pop: 'Population Filter',
    tpop: 'Teil-Population Filter',
    tpopmassn: 'Massnahmen Filter',
    tpopfeldkontr: 'Feld-Kontrollen Filter',
    tpopfreiwkontr: 'Freiwilligen-Kontrollen Filter',
  }

  return (
    <ErrorBoundary>
      <Container>
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
            <StyledTab
              label="EK"
              value="tpopfeldkontr"
              data-id="tpopfeldkontr"
            />
            <StyledTab
              label="EKF"
              value="tpopfreiwkontr"
              data-id="tpopfreiwkontr"
            />
          </StyledTabs>
        </TitleRow>
        {form}
      </Container>
    </ErrorBoundary>
  )
}
