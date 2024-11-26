import { useCallback, Suspense } from 'react'
import styled from '@emotion/styled'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router'

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
  const { apId } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onChangeTab = useCallback(
    (event, value) =>
      pathname.endsWith(apId) ? navigate(`./${value}`) : navigate(value),
    [],
  )
  const path = pathname.split('/').filter((el) => !!el)
  const lastPathEl = path.at(-1)

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Idealbiotop" />
        <Tabs
          value={
            lastPathEl === 'Idealbiotop' ? 'Idealbiotop'
            : pathname.includes(`${apId}/Idealbiotop/Dateien`) ?
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
