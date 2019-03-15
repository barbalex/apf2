import React, { useState, useCallback } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import Ap from './Daten/Ap'
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
const StyledTab = styled(Tab)`
  min-width: 100px !important;
`

export default ({
  treeName,
  dimensions,
}: {
  treeName: String,
  dimensions: Object,
}) => {
  const [activeTab, setActiveTab] = useState('ap')

  const onChangeTab = useCallback((event, value) => setActiveTab(value))

  const formObject = {
    ap: <Ap dimensions={dimensions} treeName={treeName} showFilter={true} />,
    pop: <Pop dimensions={dimensions} treeName={treeName} showFilter={true} />,
    tpop: (
      <Tpop dimensions={dimensions} treeName={treeName} showFilter={true} />
    ),
    tpopmassn: (
      <Tpopmassn
        dimensions={dimensions}
        treeName={treeName}
        showFilter={true}
      />
    ),
    tpopfeldkontr: (
      <Tpopfeldkontr
        dimensions={dimensions}
        treeName={treeName}
        showFilter={true}
      />
    ),
    tpopfreiwkontr: (
      <Tpopfreiwkontr
        dimensions={dimensions}
        treeName={treeName}
        showFilter={true}
      />
    ),
  }
  const form = formObject[activeTab]

  return (
    <ErrorBoundary>
      <Container>
        <Tabs
          value={activeTab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
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
        </Tabs>
        {form}
      </Container>
    </ErrorBoundary>
  )
}
