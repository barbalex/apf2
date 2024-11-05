import { useCallback, Suspense } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContentContainer = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`
const TabContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

export const Component = () => {
  const { popId } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onChangeTab = useCallback(
    (event, value) =>
      pathname.endsWith(popId) ? navigate(`./${value}`) : navigate(value),
    [popId, navigate],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Population" />
        <Tabs
          value={
            pathname.includes(`${popId}/Population`) ? 'Population'
            : pathname.includes(`${popId}/Auswertung`) ?
              'Auswertung'
            : pathname.includes(`${popId}/Dateien`) ?
              'Dateien'
            : pathname.includes(`${popId}/Historien`) ?
              'Historien'
            : 'Population'
          }
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab
            label="Population"
            value="Population"
            data-id="Population"
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
        <TabContentContainer>
          <TabContent>
            <Suspense fallback={<Spinner />}>
              <Outlet />
            </Suspense>
          </TabContent>
        </TabContentContainer>
      </Container>
    </ErrorBoundary>
  )
}
