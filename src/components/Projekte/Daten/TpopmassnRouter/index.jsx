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
  flex-grow: 1;
`
const TabContent = styled.div`
  height: 100%;
`

export const Component = () => {
  const { tpopmassnId } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onChangeTab = useCallback(
    (event, value) =>
      pathname.endsWith(tpopmassnId) ? navigate(`./${value}`) : navigate(value),
    [],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Massnahme" />
        <Tabs
          value={
            pathname.endsWith('Massnahme') ? 'Massnahme'
            : pathname.endsWith('Dateien') ?
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
