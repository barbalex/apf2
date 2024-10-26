import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useParams } from 'react-router-dom'

import Ap from './Ap'
import { Auswertung } from './Auswertung/index.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import Files from '../../../shared/Files/index.jsx'
import ApHistory from './History'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import useSearchParamsState from '../../../../modules/useSearchParamsState.js'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
`

export const Component = () => {
  const { apId } = useParams()

  const [tab, setTab] = useSearchParamsState('apTab', 'ap')
  const onChangeTab = useCallback((event, value) => setTab(value), [setTab])

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Art" />
        <Tabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab
            label="Art"
            value="ap"
            data-id="ap"
          />
          <StyledTab
            label="Auswertung"
            value="auswertung"
            data-id="auswertung"
          />
          <StyledTab
            label="Dateien"
            value="dateien"
            data-id="dateien"
          />
          <StyledTab
            label="Historien"
            value="history"
            data-id="history"
          />
        </Tabs>
        <TabContent>
          {tab === 'ap' && <Ap />}
          {tab === 'auswertung' && <Auswertung />}
          {tab === 'dateien' && (
            <Files
              parentId={apId}
              parent="ap"
            />
          )}
          {tab === 'history' && <ApHistory />}
        </TabContent>
      </Container>
    </ErrorBoundary>
  )
}
