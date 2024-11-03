import { useCallback, Suspense } from 'react'
import styled from '@emotion/styled'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
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
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > div:first-of-type {
    > div:first-of-type {
      display: block !important;
    }
  }
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
    (event, value) =>
      pathname.endsWith(apId) ? navigate(`./${value}`) : navigate(value),
    [],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Idealbiotop" />
        <FieldsContainer>
          <Tabs
            value={
              pathname.endsWith('Idealbiotop/Idealbiotop') ? 'Idealbiotop'
              : pathname.endsWith('Dateien') ?
                'Dateien'
              : 'Idealbiotop'
            }
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <StyledTab
              label="Idealbiotop"
              value="Idealbiotop"
              data-id="Idealbiotop"
            />
            <StyledTab
              label="Dateien"
              value="Dateien"
              data-id="Dateien"
            />
          </Tabs>
          <div style={{ overflowY: 'auto' }}>
            <TabContent>
              <Suspense fallback={<Spinner />}>
                <Outlet />
              </Suspense>
            </TabContent>
          </div>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}
