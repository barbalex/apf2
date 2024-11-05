import { useCallback, Suspense } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom'

import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
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
  const { tpopmassnId, tpopId, popId, apId, projId } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onChangeTab = useCallback(
    (event, value) => {
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen/${tpopmassnId}/${value}`,
      )
    },
    [projId, apId, popId, tpopId, tpopmassnId, navigate],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Massnahme" />
        <Tabs
          value={
            pathname.includes(`${tpopmassnId}/Massnahme`) ? 'Massnahme'
            : pathname.includes(`${tpopmassnId}/Dateien`) ?
              'Dateien'
            : 'Massnahme'
          }
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab
            label="Massnahme"
            value="Massnahme"
            data-id="Massnahme"
          />
          <StyledTab
            label="Dateien"
            value="Dateien"
            data-id="Dateien"
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
