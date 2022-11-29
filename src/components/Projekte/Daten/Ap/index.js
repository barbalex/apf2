import React, { useContext, useCallback, useState } from 'react'
import styled from '@emotion/styled'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { observer } from 'mobx-react-lite'

import Ap from './Ap'
import Auswertung from './Auswertung'
import FormTitle from '../../../shared/FormTitle'
import Files from '../../../shared/Files'
import ApHistory from './History'
import storeContext from '../../../../storeContext'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  overflow-y: auto;
`

const ApTabs = ({ treeName }) => {
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery } = store
  const { activeNodeArray } = store[treeName]

  let id =
    activeNodeArray.length > 3
      ? activeNodeArray[3]
      : '99999999-9999-9999-9999-999999999999'

  const [tab, setTab] = useState(urlQuery?.apTab ?? 'ap')
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'apTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle apId={id} title="Art" treeName={treeName} />
        <Tabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="Art" value="ap" data-id="ap" />
          <StyledTab
            label="Auswertung"
            value="auswertung"
            data-id="auswertung"
          />
          <StyledTab label="Dateien" value="dateien" data-id="dateien" />
          <StyledTab label="Historien" value="history" data-id="history" />
        </Tabs>
        <TabContent>
          {tab === 'ap' && <Ap id={id} />}
          {tab === 'auswertung' && <Auswertung id={id} />}
          {tab === 'dateien' && <Files parentId={id} parent="ap" />}
          {tab === 'history' && <ApHistory apId={id} />}
        </TabContent>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApTabs)
