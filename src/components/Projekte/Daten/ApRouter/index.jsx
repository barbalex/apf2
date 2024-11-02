import { useCallback, Suspense } from 'react'
import styled from '@emotion/styled'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'
import { Spinner } from '../../../shared/Spinner.jsx'

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
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onChangeTab = useCallback(
    (event, value) => {
      navigate(`./${value}`)
    },
    [apId, navigate],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Art" />
        <Tabs
          value={
            pathname.endsWith('Art') ? 'Art'
            : pathname.endsWith('Auswertung') ?
              'Auswertung'
            : pathname.endsWith('Dateien') ?
              'Dateien'
            : pathname.endsWith('Historien') ?
              'Historien'
            : 'Art'
          }
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab
            label="Art"
            value="Art"
            data-id="Art"
          />
          <StyledTab
            label="Auswertung"
            value="Auswertung"
            data-id="Auswertung"
          />
          <StyledTab
            label="Dateien"
            value="Dateien"
            data-id="Dateien"
          />
          <StyledTab
            label="Historien"
            value="Historien"
            data-id="Historien"
          />
        </Tabs>
        <TabContent>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </TabContent>
      </Container>
    </ErrorBoundary>
  )
}
